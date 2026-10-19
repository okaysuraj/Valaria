/** Present native sign-in and account settings without owning Firebase actions. */
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { User } from 'firebase/auth';
import { isAuthConfigured } from '../api/firebase';
import type { Profile } from '../types/movie';
import { Button, colors, ui } from './ui';
import { useAuthForm } from '../hooks/useAuthForm';

const formTitles = { signin: 'Welcome back', signup: 'Create an account', reset: 'Reset password' };
const submitLabels = { signin: 'Sign in', signup: 'Create account', reset: 'Send reset email' };
const navigationLabels = { signin: 'Sign in', signup: 'Create account', reset: 'Forgot password' };

interface Props {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onMessage: (message: string) => void;
  profile: Profile | null;
  profileLoading: boolean;
  profileError: string | null;
  preferencePending: boolean;
  onRetryProfile: () => void;
  onPreference: (value: boolean) => void;
}
export function AuthModal({
  open,
  user,
  onClose,
  onMessage,
  profile,
  profileLoading,
  profileError,
  preferencePending,
  onRetryProfile,
  onPreference,
}: Props) {
  const {
    mode,
    setMode,
    email,
    setEmail,
    password,
    setPassword,
    busy,
    error,
    setError,
    deleting,
    setDeleting,
    status,
    submit,
    accountAction,
    deleteAccount,
  } = useAuthForm({ open, onClose, onMessage });
  const confirmDelete = () =>
    Alert.alert(
      'Permanently delete your account?',
      'This deletes your account, profile and saved films across every device. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete account', style: 'destructive', onPress: () => void deleteAccount() },
      ],
    );
  return (
    <Modal
      visible={open}
      animationType="none"
      onRequestClose={busy ? undefined : onClose}
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={ui.screen}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[ui.section, { paddingTop: 28 }]}
          >
            <View style={{ alignItems: 'flex-end' }}>
              <Button
                label="Close account"
                disabled={busy}
                onPress={() => {
                  setPassword('');
                  setError(null);
                  setDeleting(false);
                  onClose();
                }}
              />
            </View>
            <Text style={ui.eyebrow}>YOUR VALARIA ACCOUNT</Text>
            <Text style={ui.title}>{user ? 'Account' : formTitles[mode]}</Text>
            {!isAuthConfigured ? (
              <Text style={ui.body}>
                Account access is not available yet. You can still browse the catalog.
              </Text>
            ) : user ? (
              <>
                <Text style={ui.body}>{user.email}</Text>
                <Text style={ui.body}>
                  {user.emailVerified ? 'Email verified' : 'Email verification pending'}
                </Text>
                {!user.emailVerified && (
                  <Button
                    label="Resend verification email"
                    disabled={busy}
                    onPress={() => void accountAction('verify')}
                  />
                )}
                {!user.emailVerified && (
                  <Button
                    label="Refresh verification status"
                    disabled={busy}
                    onPress={() => void accountAction('refresh')}
                  />
                )}
                {profileLoading ? (
                  <Text style={ui.body}>Loading preferences…</Text>
                ) : profileError ? (
                  <View style={{ gap: 8 }}>
                    <Text style={ui.error} accessibilityRole="alert">
                      {profileError}
                    </Text>
                    <Button label="Retry preferences" onPress={onRetryProfile} />
                  </View>
                ) : (
                  profile && (
                    <View style={[ui.row, { justifyContent: 'space-between' }]}>
                      <Text style={[ui.body, { flex: 1 }]}>Email updates preference</Text>
                      <Switch
                        value={profile.newsletterOptIn}
                        disabled={busy || preferencePending}
                        onValueChange={onPreference}
                        accessibilityLabel="Email updates preference"
                        trackColor={{ false: colors.line, true: '#846527' }}
                        thumbColor={colors.text}
                      />
                    </View>
                  )
                )}
                <Button
                  label={busy ? 'Please wait…' : 'Sign out'}
                  disabled={busy}
                  onPress={() => void accountAction('signout')}
                />
                <View style={ui.divider} />
                {deleting ? (
                  <>
                    <Text style={ui.heading}>Delete account</Text>
                    <Text style={ui.body}>
                      Enter your current password to permanently delete your account and saved data.
                    </Text>
                    <TextInput
                      style={ui.input}
                      value={password}
                      onChangeText={setPassword}
                      accessibilityLabel="Current password for account deletion"
                      secureTextEntry
                      editable={!busy}
                      autoComplete="current-password"
                      textContentType="password"
                      maxLength={128}
                    />
                    <Button
                      label="Permanently delete account"
                      disabled={busy || !password}
                      onPress={confirmDelete}
                    />
                    <Button
                      label="Cancel deletion"
                      disabled={busy}
                      onPress={() => {
                        setDeleting(false);
                        setPassword('');
                        setError(null);
                      }}
                    />
                  </>
                ) : (
                  <Button
                    label="Delete account"
                    disabled={busy}
                    onPress={() => {
                      setDeleting(true);
                      setPassword('');
                      setError(null);
                    }}
                  />
                )}
              </>
            ) : (
              <>
                <Text style={ui.body}>
                  Save films and keep your watchlist in sync across web and mobile.
                </Text>
                <Text style={ui.eyebrow}>EMAIL</Text>
                <TextInput
                  style={ui.input}
                  accessibilityLabel="Email address"
                  placeholder="you@example.com"
                  placeholderTextColor={colors.muted}
                  value={email}
                  onChangeText={setEmail}
                  editable={!busy}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  maxLength={254}
                />
                {mode !== 'reset' && (
                  <>
                    <Text style={ui.eyebrow}>PASSWORD</Text>
                    <TextInput
                      style={ui.input}
                      accessibilityLabel="Password"
                      placeholder={mode === 'signup' ? 'At least 12 characters' : 'Password'}
                      placeholderTextColor={colors.muted}
                      value={password}
                      onChangeText={setPassword}
                      editable={!busy}
                      secureTextEntry
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      textContentType={mode === 'signup' ? 'newPassword' : 'password'}
                      maxLength={128}
                      onSubmitEditing={() => void submit()}
                    />
                  </>
                )}
                <Button
                  primary
                  label={busy ? 'Please wait…' : submitLabels[mode]}
                  disabled={busy}
                  onPress={() => void submit()}
                />
                <View style={ui.row}>
                  {(['signin', 'signup', 'reset'] as const)
                    .filter((item) => item !== mode)
                    .map((item) => (
                      <Button
                        key={item}
                        label={navigationLabels[item]}
                        disabled={busy}
                        onPress={() => {
                          setMode(item);
                          setError(null);
                          setPassword('');
                        }}
                      />
                    ))}
                </View>
              </>
            )}
            {error && (
              <Text style={ui.error} accessibilityRole="alert">
                {error}
              </Text>
            )}
            {status && (
              <Text style={ui.body} accessibilityLiveRegion="polite">
                {status}
              </Text>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
