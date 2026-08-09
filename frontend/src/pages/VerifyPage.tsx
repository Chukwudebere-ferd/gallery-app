import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AuthFlow from '../components/auth/AuthFlow'
import OtpInput from '../components/ui/OtpInput'
import Button from '../components/ui/Button'
import { CheckIcon, MailIcon } from '../components/ui/icons'
import './AuthFlowPages.css'

const CODE_LENGTH = 5
const RESEND_SECONDS = 180 // 3 minutes

function formatTime(total: number): string {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function VerifyPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const purpose = params.get('purpose') === 'reset' ? 'reset' : 'verify'
  const email = params.get('email') ?? 'your email'

  const [code, setCode] = useState('')
  const [checking, setChecking] = useState(false)
  const [done, setDone] = useState(false)

  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)
  const [resent, setResent] = useState(false)

  const canResend = secondsLeft === 0

  useEffect(() => {
    if (canResend) return
    const id = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [canResend])

  const resend = () => {
    setResent(true)
    setSecondsLeft(RESEND_SECONDS)
    setCode('')
    window.setTimeout(() => setResent(false), 2600)
  }

  const submit = () => {
    if (code.length !== CODE_LENGTH) return
    setChecking(true)
    window.setTimeout(() => {
      setChecking(false)
      setDone(true)
      window.setTimeout(() => {
        void navigate(
          purpose === 'reset'
            ? `/reset-password?email=${encodeURIComponent(email)}`
            : '/',
        )
      }, 1300)
    }, 800)
  }

  const title = purpose === 'reset' ? 'Check your email' : 'Verify your email'
  const subtitle =
    purpose === 'reset'
      ? `We sent a 5-digit code to ${email}. Enter it below to choose a new password.`
      : `We sent a 5-digit code to ${email}. Enter it below to verify your account.`

  return (
    <AuthFlow
      title={title}
      subtitle={subtitle}
      backTo={'/auth'}
      backLabel={purpose === 'reset' ? 'Back to reset' : 'Back to sign up'}
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
            disabled={checking}
          />

          <Button
            variant="primary"
            size="md"
            className="flow-form__submit"
            onClick={submit}
            disabled={code.length !== CODE_LENGTH || checking}
          >
            {checking ? 'Verifying…' : 'Verify code'}
          </Button>

          <div className="flow-code-hint">
            <span className="flow-code-hint__mail">
              <MailIcon />
              {resent ? 'New code sent' : '3-minute code'}
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
        </>
      )}
    </AuthFlow>
  )
}