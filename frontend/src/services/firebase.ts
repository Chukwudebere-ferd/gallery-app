import { initializeApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth'
import type { User } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const auth = getAuth(initializeApp(firebaseConfig))

export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback)
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export async function signUpWithEmail(email: string, password: string): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  return credential.user
}

export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider()
  const credential = await signInWithPopup(auth, provider)
  return credential.user
}

export async function signOutUser(): Promise<void> {
  await signOut(auth)
}

export interface AuthClaims {
  admin?: boolean
  [key: string]: unknown
}

export async function fetchUserClaims(user: User): Promise<AuthClaims> {
  try {
    return (await user.getIdTokenResult(true)).claims as AuthClaims
  } catch {
    try {
      return (await user.getIdTokenResult()).claims as AuthClaims
    } catch {
      return {}
    }
  }
}

const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'Enter a valid email address',
  'auth/email-already-in-use': 'An account already exists for that email',
  'auth/weak-password': 'Password must be at least 6 characters',
  'auth/user-not-found': 'No account found for that email',
  'auth/wrong-password': 'Incorrect password. Try again.',
  'auth/invalid-credential': 'Incorrect email or password',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
}

export function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code ?? ''
  return FIREBASE_ERROR_MESSAGES[code] ?? 'Something went wrong. Please try again.'
}

export function isAuthCancelled(error: unknown): boolean {
  const code = (error as { code?: string })?.code ?? ''
  return code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request'
}
