/** Configure native Firebase authentication with persistent device storage. */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, type Auth } from 'firebase/auth';

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};
export const isAuthConfigured = Object.values(config).every(Boolean);
let auth: Auth | null = null;
if (isAuthConfigured) {
  const existing = getApps().find((app) => app.name === '[DEFAULT]');
  auth = existing
    ? getAuth(existing)
    : initializeAuth(initializeApp(config), {
        persistence: getReactNativePersistence(AsyncStorage),
      });
}
export { auth };
