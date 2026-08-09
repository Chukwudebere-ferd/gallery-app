import type { ReactNode } from 'react'
import './Badge.css'

export type BadgeTone = 'neutral' | 'success' | 'danger' | 'accent' | 'muted'

export interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
  className?: string
}

export default function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  const cls = ['badge', `badge--${tone}`, className].filter(Boolean).join(' ')
  return <span className={cls}>{children}</span>
}