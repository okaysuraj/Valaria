import 'firebase/auth';
import type { Persistence, ReactNativeAsyncStorage } from '@firebase/auth';

// Firebase's React Native entry exports this at runtime; its default web declarations omit it.
// Keep the documented native signature visible to TypeScript without importing internal SDK paths.
declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: ReactNativeAsyncStorage): Persistence;
}
