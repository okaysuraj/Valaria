/** CLI: validate or import an operator-supplied catalog JSON manifest. */
import 'dotenv/config';
import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { createPool, databaseFromPool } from '../config/database.js';
import { importCatalog } from './importCatalog.js';
import { catalogImportSchema } from './importSchema.js';

async function main() {
  const file = process.argv[2];
  if (!file)
    throw new Error('Usage: npm run catalog:import -- path/to/real-catalog.json [--validate-only]');
  if ((await stat(file)).size > 16 * 1024 * 1024)
    throw new Error('Import files are limited to 16 MiB / 1000 movies');
  const raw = await readFile(file, 'utf8');
  const input: unknown = JSON.parse(raw);
  const validation = catalogImportSchema.safeParse(input);
  if (!validation.success) {
    for (const issue of validation.error.issues.slice(0, 20))
      console.error(`${issue.path.join('.')}: ${issue.message}`);
    throw new Error('Invalid import manifest');
  }
  if (process.argv.includes('--validate-only')) {
    console.log('Catalog manifest validation passed. No database changes made.');
    return;
  }
  const connection = process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL;
  if (!connection) throw new Error('DATABASE_DIRECT_URL or DATABASE_URL is required');
  const pool = createPool(connection);
  try {
    const result = await databaseFromPool(pool).transaction((client) =>
      importCatalog(client, input, createHash('sha256').update(raw).digest('hex')),
    );
    console.log(
      `Imported ${result.importedMovies} movies and ${result.importedMoods} moods with provenance.`,
    );
  } finally {
    await pool.end();
  }
}
main().catch((error) => {
  console.error(
    error instanceof Error && !('code' in error)
      ? error.message
      : 'Catalog import failed. No partial changes were committed.',
  );
  process.exitCode = 1;
});
