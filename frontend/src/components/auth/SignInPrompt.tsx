import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import { CloseIcon, LockIcon } from '../ui/icons'
import './SignInPrompt.css'

export interface SignInPromptProps {
  action: string
  open: boolean
  onClose: () => void
}

export default function SignInPrompt({ action, open, onClose }: SignInPromptProps) {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      previous?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  const next = encodeURIComponent(pathname + search)

  return (
    <div className="signin-prompt" role="presentation" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-prompt-title"
        className="signin-prompt__dialog"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="signin-prompt__close"
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <span className="signin-prompt__icon" aria-hidden>
          <LockIcon />
        </span>

        <h2 id="signin-prompt-title" className="signin-prompt__title">
          Sign in to {action}
        </h2>
        <p className="signin-prompt__copy">
          Guests can browse the gallery freely. Sign in to {action} and keep your
          favorites close.
        </p>

        <div className="signin-prompt__actions">
          <Button variant="primary" onClick={() => void navigate(`/auth?next=${next}`)}>
            Sign in
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Not now
          </Button>
        </div>
      </div>
    </div>
  )
}
