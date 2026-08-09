import type { InputHTMLAttributes, ReactNode } from 'react'
import './Field.css'

export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: ReactNode
  trailing?: ReactNode
}

export default function Field({
  label,
  error,
  icon,
  trailing,
  id,
  className,
  ...rest
}: FieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const cls = ['field', error ? 'field--error' : '', className]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={cls}>
      <label className="field__label" htmlFor={fieldId}>
        {label}
      </label>
      <div className="field__inner">
        {icon && <span className="field__icon">{icon}</span>}
        <input
          id={fieldId}
          className="field__input"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...rest}
        />
        {trailing && <span className="field__trailing">{trailing}</span>}
      </div>
      {error && (
        <span className="field__error" id={`${fieldId}-error`} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}