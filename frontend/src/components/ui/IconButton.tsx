import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './IconButton.css'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  active?: boolean
  badge?: ReactNode
}

export default function IconButton({
  label,
  active = false,
  badge,
  className,
  children,
  ...rest
}: IconButtonProps) {
  const cls = ['icon-btn', active ? 'icon-btn--active' : '', className]
    .filter(Boolean)
    .join(' ')
  return (
    <button
      type="button"
      className={cls}
      aria-label={label}
      aria-pressed={active}
      {...rest}
    >
      {children}
      {badge != null && <span className="icon-btn__badge">{badge}</span>}
    </button>
  )
}