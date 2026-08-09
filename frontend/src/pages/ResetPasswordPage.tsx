import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AuthFlow from '../components/auth/AuthFlow'
import Field from '../components/ui/Field'
import Button from '../components/ui/Button'
import { LockIcon, EyeIcon, EyeOffIcon, CheckIcon } from '../components/ui/icons'
import './AuthFlowPages.css'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const email = params.get('email') ?? 'your account'

  const [show, setShow] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (password.length < 8) {
      next.password = 'Use at least 8 characters'
    }
    if (confirm !== password) {
      next.confirm = 'Passwords do not match'
    }
    setErrors(next)
    if (Object.keys(next).length > 0) return
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      setDone(true)
      window.setTimeout(() => void navigate('/'), 1300)
    }, 700)
  }

  return (
    <AuthFlow
      title="Choose a new password"
      subtitle={`Pick a strong password for ${email}.`}
      backTo="/auth"
      backLabel="Back to sign in"
      flame={!done}
    >
      {done ? (
        <div className="auth-flow__success" role="status">
          <span className="auth-flow__success-icon">
            <CheckIcon />
          </span>
          <h2>Password updated</h2>
          <p>You're all set. Sign in with your new password whenever you're ready.</p>
        </div>
      ) : (
        <form className="flow-form" onSubmit={submit} noValidate>
          <Field
            label="New password"
            icon={<LockIcon />}
            type={show ? 'text' : 'password'}
            placeholder="8+ characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="new-password"
            trailing={
              <button
                type="button"
                className="auth__show"
                aria-label={show ? 'Hide password' : 'Show password'}
                onClick={() => setShow((v) => !v)}
              >
                {show ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            }
          />
          <Field
            label="Confirm password"
            icon={<LockIcon />}
            type={show ? 'text' : 'password'}
            placeholder="Repeat your new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={errors.confirm}
            autoComplete="new-password"
          />
          <Button
            type="submit"
            size="md"
            className="flow-form__submit"
            disabled={loading}
          >
            {loading ? 'Saving…' : 'Update password'}
          </Button>
        </form>
      )}
    </AuthFlow>
  )
}