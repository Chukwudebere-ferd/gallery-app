import { createContext, useContext } from 'react'

export interface UserProfile {
  name: string
  username: string
  bio: string
  avatarUrl: string
  emailNotifications: boolean
  email?: string
}

export type AuthStatus = 'loading' | 'guest' | 'authed'

export type UserRole = 'admin' | 'user'

export interface UserContextValue {
  user: UserProfile | null
  status: AuthStatus
  isGuest: boolean
  role: UserRole | null
  isAdmin: boolean
  verified: boolean | null
  updateUser: (patch: Partial<UserProfile>) => void
  refreshVerification: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

export const UserContext = createContext<UserContextValue | null>(null)

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext)
  if (!ctx) {
    throw new Error('useUser must be used within <UserProvider>')
  }
  return ctx
}
