import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AuthFlow from '../../components/auth/AuthFlow'
import OtpInput from '../../components/ui/OtpInput'
import Button from '../../components/ui/Button'
import { CheckIcon, MailIcon } from '../../components/ui/icons'
import { sendAuthCode, verifyAuthCode } from '../../services/api'
import type { AuthCodePurpose } from '../../services/api'
import { useUser } from '../../context/userContext'
import './AuthFlowPages.css'

const CODE_LENGTH = 6
const RESEND_SECONDS = 60

function formatTime(total: number): string {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function VerifyPage() {
  const navigate = useNavigate()
  const { refreshVerification, signOut } = useUser()
  const [params] = useSearchParams()
  const purpose: AuthCodePurpose = params.get('purpose') === 'reset' ? 'reset' : 'verify'
  const email = params.get('email') ?? ''
  const next = params.get('next')

  const [code, setCode] = useState('')
  const [checking, setChecking] = useState(false)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const [resent, setResent] = useState(false)
  const sentOnceRef = useRef(false)

  const canResend = secondsLeft === 0 && !sending

  const send = useCallback(
    async (asResend: boolean) => {
      if (!email) {
        setError('We could not find your email. Please start over.')
        return
      }
      setSending(true)
      setError('')
      try {
        await sendAuthCode(email, purpose)
        setSecondsLeft(RESEND_SECONDS)
        if (asResend) {
          setResent(true)
          setCode('')
          window.setTimeout(() => setResent(false), 2600)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setSending(false)
      }
    },
    [email, purpose],
  )

  // Send the code once on mount (guarded against StrictMode double-invoke).
  useEffect(() => {
    if (sentOnceRef.current) return
    sentOnceRef.current = true
    void send(false)
  }, [send])

  useEffect(() => {
    if (canResend) return
    const id = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [canResend])

  const resend = () => {
    void send(true)
  }

  const signOutHere = async () => {
    try {
      await signOut()
    } catch {
      // ignore — still leave the page
    }
    void navigate('/auth')
  }

  const submit = async () => {
    if (code.length !== CODE_LENGTH || checking || sending) return
    if (!email) {
      setError('Missing email. Please start over.')
      return
    }
    setChecking(true)
    setError('')
    try {
      const res = await verifyAuthCode(email, purpose, code)
      if (purpose === 'verify') {
        await refreshVerification()
      }
      setChecking(false)
      setDone(true)
      window.setTimeout(() => {
        if (purpose === 'reset') {
          if (res.resetToken) {
            void navigate('/reset-password', {
              state: { email, token: res.resetToken },
            })
          } else {
            void navigate('/forgot-password')
          }
        } else {
          const target = next && next !== '/auth' ? next : '/'
          void navigate(target)
        }
      }, 1300)
    } catch (err) {
      setChecking(false)
      setCode('')
      setError(err instanceof Error ? err.message : 'Invalid code')
    }
  }

  return (
    <AuthFlow
      title={purpose === 'reset' ? 'Check your email' : 'Verify your email'}
      subtitle={
        purpose === 'reset'
          ? `We sent a ${CODE_LENGTH}-digit code to ${email}. Enter it below to choose a new password.`
          : `We sent a ${CODE_LENGTH}-digit code to ${email}. Enter it below to verify your account.`
      }
      backTo={purpose === 'reset' ? '/forgot-password' : '/auth'}
      backLabel={purpose === 'reset' ? 'Back to reset' : 'Back to sign up'}
      flame={!done}
    >
      {done ? (
        <div className="auth-flow__success" role="status">
          <span className="auth-flow__success-icon">
            <CheckIcon />
          </span>
          <h2>{purpose === 'reset' ? 'Code confirmed' : 'Account verified'}</h2>
          <p>
            {purpose === 'reset'
              ? 'Great — now you can set a new password.'
              : 'Your email is verified. Welcome to the camp!'}
          </p>
        </div>
      ) : (
        <>
          <OtpInput
            length={CODE_LENGTH}
            value={code}
            onChange={setCode}
            invalid={Boolean(error)}
            disabled={checking || sending}
          />

          {error && (
            <p className="flow-alert" role="alert">
              {error}
            </p>
          )}

          <Button
            variant="primary"
            size="md"
            className="flow-form__submit"
            onClick={() => void submit()}
            disabled={code.length !== CODE_LENGTH || checking || sending}
          >
            {checking ? 'Verifying…' : 'Verify code'}
          </Button>

          <div className="flow-code-hint">
            <span className="flow-code-hint__mail">
              <MailIcon />
              {resent ? 'New code sent' : 'Code sent'}
            </span>
            <span
              className={
                canResend ? 'flow-code-hint__time--idle' : 'flow-code-hint__time'
              }
            >
              {canResend ? 'Expired' : formatTime(secondsLeft)}
            </span>
          </div>

          <button
            type="button"
            className="flow-resend"
            onClick={resend}
            disabled={!canResend}
          >
            {canResend ? 'Resend code' : `Resend in ${formatTime(secondsLeft)}`}
          </button>

          {purpose === 'verify' && (
            <button
              type="button"
              className="flow-logout"
              onClick={() => void signOutHere()}
              disabled={checking || sending}
            >
              Not you? Sign out
            </button>
          )}
        </>
      )}
    </AuthFlow>
  )
}
