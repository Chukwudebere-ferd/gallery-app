import type { CSSProperties } from 'react'
import './Spinner.css'

export interface SpinnerProps {
  size?: number
  label?: string
  className?: string
}

export default function Spinner({ size = 22, label, className }: SpinnerProps) {
  const style = { width: size, height: size } as CSSProperties
  return (
    <span
      className={`spinner${className ? ` ${className}` : ''}`}
      style={style}
      role={label ? 'status' : undefined}
      aria-label={label}
    >
      <span className="spinner__ring" />
    </span>
  )
}