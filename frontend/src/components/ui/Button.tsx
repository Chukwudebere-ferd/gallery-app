import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.css'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'xs' | 'sm' | 'md'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = ['btn', `btn--${variant}`, `btn--${size}`, className]
    .filter(Boolean)
    .join(' ')
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  )
}