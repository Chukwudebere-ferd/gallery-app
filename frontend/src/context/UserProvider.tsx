import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { UserContext } from './userContext'
import type { UserProfile, AuthStatus, UserRole } from './userContext'
import {
  subscribeToAuth,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle as signInWithGoogleService,
  signOutUser,
  fetchUserClaims,
  auth,
} from '../services/firebase'
import { getMe } from '../services/api'

const PROFILE_STORAGE_PREFIX = 'campfire.profile.'

function profileFor(uid: string): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_PREFIX + uid)
    if (raw) return JSON.parse(raw) as UserProfile
  } catch {
    /* corrupted storage — fall back to base profile */
  }
  return null
}

function saveProfile(uid: string, profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_PREFIX + uid, JSON.stringify(profile))
  } catch {
    /* storage unavailable */
  }
}

function baseProfile(email?: string | null): UserProfile {
  const fallback = email ? email.split('@')[0] : 'Camper'
  return {
    name: fallback,
    username: '',
    bio: '',
    avatarUrl: '',
    emailNotifications: true,
    email: email ?? undefined,
  }
}

export default function UserProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<UserProfile | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [verified, setVerified] = useState<boolean | null>(null)
  const uidRef = useRef<string | null>(null)

  const refreshVerification = useCallback(async () => {
    const fbUser = auth.currentUser
    if (!fbUser) {
      setVerified(null)
      return
    }
    try {
      const token = await fbUser.getIdToken(true)
      const me = await getMe(token)
      setVerified(me.verified)
    } catch {
      setVerified(false)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeToAuth((fbUser) => {
      if (fbUser) {
        uidRef.current = fbUser.uid
        setVerified(null)
        void refreshVerification()
        const stored = profileFor(fbUser.uid)
        const base = baseProfile(fbUser.email)
        setUser({
          ...base,
          ...stored,
          name: stored?.name || fbUser.displayName || base.name,
          avatarUrl: stored?.avatarUrl || fbUser.photoURL || '',
          email: fbUser.email ?? base.email,
        })
        setStatus('authed')
        void fetchUserClaims(fbUser).then((claims) => {
          setRole(claims.admin === true ? 'admin' : 'user')
        })
      } else {
        uidRef.current = null
        setUser(null)
        setRole(null)
        setVerified(null)
        setStatus('guest')
      }
    })
    return unsubscribe
  }, [refreshVerification])

  const updateUser = useCallback((patch: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      if (uidRef.current) saveProfile(uidRef.current, next)
      return next
    })
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmail(email, password)
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    await signUpWithEmail(email, password)
  }, [])

  const signInWithGoogle = useCallback(async () => {
    await signInWithGoogleService()
  }, [])

  const signOut = useCallback(async () => {
    await signOutUser()
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        status,
        isGuest: status === 'guest',
        role,
        isAdmin: status === 'authed' && role === 'admin',
        verified,
        updateUser,
        refreshVerification,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
