/** Show the archive link and the signed-in email updates preference. */
import { Switch, Text, View } from 'react-native';
import type { Profile } from '../types/movie';
import { Button, colors, ui } from './ui';

interface Props {
  profile: Profile | null;
  signedIn: boolean;
  busy: boolean;
  onOptIn: (value: boolean) => void;
  onCatalog: () => void;
  onSignIn: () => void;
}
export function Footer({ profile, signedIn, busy, onOptIn, onCatalog, onSignIn }: Props) {
  return (
    <View style={[ui.section, { borderTopWidth: 1, borderTopColor: colors.line }]}>
      <Text style={ui.eyebrow}>VALARIA · CINEMA ARCHIVE</Text>
      <Text style={ui.body}>
        Discover films, explore editorial selections and keep a watchlist across your devices.
      </Text>
      <View style={ui.row}>
        <Button label="Explore catalog" onPress={onCatalog} />
        {!signedIn && <Button label="Sign in" onPress={onSignIn} />}
      </View>
      {signedIn && profile && (
        <View style={[ui.row, { justifyContent: 'space-between' }]}>
          <Text style={[ui.body, { flex: 1 }]}>Email updates preference</Text>
          <Switch
            value={profile.newsletterOptIn}
            disabled={busy}
            onValueChange={onOptIn}
            accessibilityLabel="Email updates preference"
            trackColor={{ false: colors.line, true: '#846527' }}
            thumbColor={colors.text}
          />
        </View>
      )}
      <Text style={[ui.body, { fontSize: 12 }]}>© {new Date().getFullYear()} Valaria</Text>
    </View>
  );
}
