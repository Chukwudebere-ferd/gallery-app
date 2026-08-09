import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthFlow from '../../components/auth/AuthFlow'
import Field from '../../components/ui/Field'
import Button from '../../components/ui/Button'
import { MailIcon, SendIcon } from '../../components/ui/icons'
import { sendAuthCode } from '../../services/api'
import './AuthFlowPages.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!EMAIL_RE.test(email)) {
      setError('Enter a valid email address')
      return
    }
    setError('')
    setLoading(true)
    try {
      await sendAuthCode(email.trim(), 'reset')
      void navigate(`/verify?purpose=reset&email=${encodeURIComponent(email.trim())}`)
    } catch (err) {
      setLoading(false)
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <AuthFlow
      title="Reset your password"
      subtitle="Enter the email you signed up with and we'll send you a reset code."
      backTo="/auth"
      backLabel="Back to sign in"
    >
      <form className="flow-form" onSubmit={submit} noValidate>
        <Field
          label="Email"
          icon={<MailIcon />}
          type="email"
          placeholder="you@camp.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          autoComplete="email"
          autoFocus
        />
        <Button type="submit" size="md" className="flow-form__submit" disabled={loading}>
          {loading ? null : <SendIcon />}
          {loading ? 'Sending…' : 'Send reset code'}
        </Button>
      </form>
    </AuthFlow>
  )
}
