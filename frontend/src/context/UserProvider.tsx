import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { UserContext } from './userContext'
import type { UserProfile } from './userContext'

const STORAGE_KEY = 'campfire.profile'

const DEFAULT_USER: UserProfile = {
  name: 'Maya Camper',
  username: 'mayacamp',
  bio: 'Weekend hiker, campfire chef, and collector of golden hours. Living one trail at a time.',
  avatarUrl: 'https://i.pravatar.cc/200?img=32',
  emailNotifications: true,
}

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return { ...DEFAULT_USER, ...(JSON.parse(raw) as UserProfile) }
    } catch {
      /* corrupted storage — fall back to defaults */
    }
    return DEFAULT_USER
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } catch {
      /* storage unavailable */
    }
  }, [user])

  const updateUser = (patch: Partial<UserProfile>) =>
    setUser((prev) => ({ ...prev, ...patch }))

  const signOut = () => {
    setUser(DEFAULT_USER)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* storage unavailable */
    }
  }

  return (
    <UserContext.Provider value={{ user, updateUser, signOut }}>
      {children}
    </UserContext.Provider>
  )
}