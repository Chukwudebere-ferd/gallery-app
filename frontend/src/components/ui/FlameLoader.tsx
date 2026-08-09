import { useEffect, useState } from 'react'
import Flame from './Flame'
import './FlameLoader.css'

const DEFAULT_PHASES = [
  'Stoking the fire…',
  'Gathering memories…',
  'Warming the rocks…',
]

export interface FlameLoaderProps {
  variant?: 'loading' | 'error'
  size?: number
  label?: string
  phases?: string[]
  error?: string
  errorDetail?: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

export default function FlameLoader({
  variant = 'loading',
  size = 96,
  label,
  phases,
  error = 'Something snuffed out the fire.',
  errorDetail,
  onRetry,
  retryLabel = 'Try again',
  className,
}: FlameLoaderProps) {
  const isError = variant === 'error'
  const phrases = phases ?? DEFAULT_PHASES
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (isError || label) return
    const id = window.setInterval(() => {
      setPhase((i) => (i + 1) % phrases.length)
    }, 2000)
    return () => window.clearInterval(id)
  }, [isError, label, phrases.length])

  const message = isError ? (error ?? 'Something snuffed out the fire.') : label ?? phrases[phase]

  const cls = [
    'flame-loader',
    isError ? 'flame-loader--error' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cls} role="status" aria-live="polite">
      <span className="flame-loader__fire">
        <Flame size={size} className={isError ? 'flame-loader__flame' : undefined} />
        {isError && (
          <span className="flame-loader__smoke" aria-hidden>
            <i className="flame-loader__puff flame-loader__puff--1" />
            <i className="flame-loader__puff flame-loader__puff--2" />
            <i className="flame-loader__puff flame-loader__puff--3" />
          </span>
        )}
      </span>

      <p key={message} className="flame-loader__message">
        {message}
      </p>

      {isError && errorDetail && (
        <p className="flame-loader__detail">{errorDetail}</p>
      )}

      {isError && onRetry && (
        <button type="button" className="flame-loader__retry" onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </div>
  )
}