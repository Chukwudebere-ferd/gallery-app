import { useCallback, useState } from 'react'
import type { ReactElement } from 'react'
import { useUser } from '../../context/userContext'
import SignInPrompt from './SignInPrompt'

export interface GuestPrompt {
  guard: (action: string) => boolean
  element: ReactElement | null
}

export function useGuestPrompt(): GuestPrompt {
  const { isGuest } = useUser()
  const [action, setAction] = useState<string | null>(null)

  const guard = useCallback(
    (nextAction: string): boolean => {
      if (isGuest) {
        setAction(nextAction)
        return true
      }
      return false
    },
    [isGuest],
  )

  const element = action ? (
    <SignInPrompt action={action} open onClose={() => setAction(null)} />
  ) : null

  return { guard, element }
}
