import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthFlow from '../../components/auth/AuthFlow'
import Field from '../../components/ui/Field'
import Button from '../../components/ui/Button'
import { LockIcon, EyeIcon, EyeOffIcon, CheckIcon } from '../../components/ui/icons'
import { resetPassword } from '../../services/api'
import './AuthFlowPages.css'

interface ResetState {
  email: string
  token: string
}

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as ResetState | null

  const [show, setShow] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const email = state?.email ?? 'your account'

  const submit = async (e: FormEvent) => {
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
    setFormError('')
    try {
      if (!state?.token) {
        throw new Error('Your reset session has expired. Please start over.')
      }
      await resetPassword(email, state.token, password)
      setLoading(false)
      setDone(true)
      window.setTimeout(() => void navigate('/auth'), 1600)
    } catch (err) {
      setLoading(false)
      setFormError(err instanceof Error ? err.message : 'Something went wrong')
    }
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

          {formError && (
            <p className="flow-alert" role="alert">
              {formError}
            </p>
          )}

          <Button type="submit" size="md" className="flow-form__submit" disabled={loading}>
            {loading ? 'Saving…' : 'Update password'}
          </Button>
        </form>
      )}
    </AuthFlow>
  )
}
