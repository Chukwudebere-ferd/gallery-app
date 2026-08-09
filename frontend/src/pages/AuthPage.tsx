import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Field from '../components/ui/Field'
import FlameLoader from '../components/ui/FlameLoader'
import Flame from '../components/ui/Flame'
import {
  LogoMark,
  MailIcon,
  LockIcon,
  UserIcon,
  EyeIcon,
  EyeOffIcon,
  GoogleIcon,
} from '../components/ui/icons'
import './AuthPage.css'

type Mode = 'signin' | 'signup'

interface FieldErrors {
  username?: string
  email?: string
  identifier?: string
  password?: string
  consent?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_RE = /^[a-z0-9_]{3,20}$/

export default function AuthPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('signin')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})

  const finish = () => {
    setLoading(true)
    window.setTimeout(() => {
      void navigate(mode === 'signup' ? '/verify?purpose=verify' : '/')
    }, 900)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: FieldErrors = {}

    if (mode === 'signup') {
      if (!USERNAME_RE.test(username.trim())) {
        next.username = '3–20 characters, letters, numbers or underscores'
      }
      if (!EMAIL_RE.test(email)) {
        next.email = 'Enter a valid email address'
      }
      if (password.length < 8) {
        next.password = 'Use at least 8 characters'
      }
      if (!consent) {
        next.consent = 'Please accept the privacy policy to continue'
      }
    } else {
      if (identifier.trim().length < 3) {
        next.identifier = 'Enter your email or username'
      }
      if (password.length === 0) {
        next.password = 'Enter your password'
      }
    }

    setErrors(next)
    if (Object.keys(next).length > 0) return
    finish()
  }

  return (
    <div className="auth">
      <aside className="auth__hero">
        <div className="auth__hero-fire" aria-hidden>
          <Flame size={150} />
        </div>
        <h1>Your camp memories, together.</h1>
        <p>
          Snap photos and videos, upload in HD, and relive every trail, lake
          and campfire with your crew.
        </p>
        <dl className="auth__stats">
          <div>
            <dt>40K+</dt>
            <dd>camp moments</dd>
          </div>
          <div>
            <dt>12K</dt>
            <dd>campers</dd>
          </div>
          <div>
            <dt>4.9★</dt>
            <dd>member rating</dd>
          </div>
        </dl>
      </aside>

      <section className="auth__panel">
        <main className="auth__card">
          <div className="auth__card-head">
            <LogoMark className="auth__card-mark" />
            <span>Campfire</span>
          </div>

          <div className="auth__tabs" role="tablist" aria-label="Authentication">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signin'}
              className={mode === 'signin' ? 'auth__tab auth__tab--on' : 'auth__tab'}
              onClick={() => setMode('signin')}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signup'}
              className={mode === 'signup' ? 'auth__tab auth__tab--on' : 'auth__tab'}
              onClick={() => setMode('signup')}
            >
              Create account
            </button>
          </div>

          <form className="auth__form" onSubmit={submit} noValidate>
            {mode === 'signup' ? (
              <>
                <Field
                  label="Username"
                  icon={<UserIcon />}
                  type="text"
                  placeholder="mayacamp"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.trim())}
                  error={errors.username}
                  autoComplete="username"
                  autoCapitalize="none"
                />
                <Field
                  label="Email"
                  icon={<MailIcon />}
                  type="email"
                  placeholder="you@camp.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  autoComplete="email"
                />
              </>
            ) : (
              <Field
                label="Email or username"
                icon={<MailIcon />}
                type="text"
                placeholder="you@camp.com or @mayacamp"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                error={errors.identifier}
                autoComplete="username"
              />
            )}
            <Field
              label="Password"
              icon={<LockIcon />}
              type={showPassword ? 'text' : 'password'}
              placeholder="8+ characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              trailing={
                <button
                  type="button"
                  className="auth__show"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              }
            />

            {mode === 'signin' && (
              <button
                type="button"
                className="auth__forgot"
                onClick={() => void navigate('/forgot-password')}
              >
                Forgot password?
              </button>
            )}

            {mode === 'signup' && (
              <label
                className={`auth__consent${errors.consent ? ' auth__consent--error' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span className="auth__check" aria-hidden>
                  <svg viewBox="0 0 24 24" className="auth__tick">
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                </span>
                <span>
                  I understand how{' '}
                  <Link to="/privacy" onClick={(e) => e.stopPropagation()}>
                    privacy
                  </Link>{' '}
                  works and why my info is needed
                </span>
                {errors.consent && <em>{errors.consent}</em>}
              </label>
            )}

            <Button type="submit" size="md" className="auth__submit" disabled={loading}>
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </Button>

            <div className="auth__divider" aria-hidden>
              <span>or</span>
            </div>

            <Button
              variant="secondary"
              size="md"
              className="auth__google"
              onClick={finish}
              disabled={loading}
            >
              <GoogleIcon />
              Continue with Google
            </Button>
          </form>
          {loading && (
            <div className="auth__loader" role="status">
              <FlameLoader size={96} label="Lighting your campfire…" />
            </div>
          )}
        </main>
      </section>
    </div>
  )
}