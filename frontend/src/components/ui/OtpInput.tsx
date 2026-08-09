import { useRef } from 'react'
import type { KeyboardEvent } from 'react'
import './OtpInput.css'

export interface OtpInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  invalid?: boolean
  disabled?: boolean
}

const ALLOWED = /^\d$/

export default function OtpInput({
  length = 6,
  value,
  onChange,
  invalid = false,
  disabled = false,
}: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const digits = Array.from({ length }, (_, i) => value[i] ?? '')

  const focusIndex = (index: number) => refs.current[index]?.focus()

  const handleChange = (index: number, next: string) => {
    if (next === value) return
    const chars = next.split('')
    let j = 0
    const filled = [...digits]
    while (j < chars.length && index + j < length) {
      const c = chars[j]
      if (ALLOWED.test(c)) {
        filled[index + j] = c
      }
      j += 1
    }
    const joined = filled.join('')
    onChange(joined.slice(0, length))
    if (joined.length < length && joined.length > 0) {
      focusIndex(joined.length)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const next = digits.map((d, i) => (i === index ? '' : d)).join('')
      onChange(next)
      if (!digits[index] && index > 0) focusIndex(index - 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (index > 0) focusIndex(index - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      if (index < length - 1) focusIndex(index + 1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      focusIndex(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      focusIndex(length - 1)
    }
  }

  const handlePaste = (text: string) => {
    const merged = (digits.join('') + text.replace(/\D/g, '')).slice(0, length)
    onChange(merged)
    focusIndex(Math.min(merged.length, length - 1))
  }

  return (
    <div
      className={invalid ? 'otp otp--invalid' : 'otp'}
      role="group"
      aria-label={`${length}-digit verification code`}
    >
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          className="otp__input"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-label={`Digit ${i + 1} of ${length}`}
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => {
            e.preventDefault()
            handlePaste(e.clipboardData.getData('text'))
          }}
        />
      ))}
    </div>
  )
}