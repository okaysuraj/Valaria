// Rebuild the API from scratch, including the SQL needed by the migration command.
const { copyFileSync, existsSync, mkdirSync, realpathSync, rmSync } = require('node:fs');
const { dirname, resolve } = require('node:path');
const { spawnSync } = require('node:child_process');

const root = realpathSync(resolve(__dirname, '..'));
const output = resolve(root, 'dist');
if (dirname(output) !== root || (existsSync(output) && realpathSync(output) !== output)) {
  throw new Error('Refusing to clean outside the backend build directory');
}
rmSync(output, { recursive: true, force: true });

const result = spawnSync(process.execPath, [require.resolve('typescript/lib/tsc.js')], {
  cwd: root,
  stdio: 'inherit',
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

mkdirSync(resolve(output, 'db'), { recursive: true });
copyFileSync(resolve(root, 'src/db/schema.sql'), resolve(output, 'db/schema.sql'));
