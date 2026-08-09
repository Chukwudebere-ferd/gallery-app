import { createContext, useContext } from 'react'

export interface UserProfile {
  name: string
  username: string
  bio: string
  avatarUrl: string
  emailNotifications: boolean
}

export interface UserContextValue {
  user: UserProfile
  updateUser: (patch: Partial<UserProfile>) => void
  signOut: () => void
}

export const UserContext = createContext<UserContextValue | null>(null)

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext)
  if (!ctx) {
    throw new Error('useUser must be used within <UserProvider>')
  }
  return ctx
}