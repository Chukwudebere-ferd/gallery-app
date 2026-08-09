import type { ReactNode } from 'react'
import './StatCard.css'

export interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
  tone?: 'default' | 'accent' | 'danger' | 'success'
}

export default function StatCard({ label, value, icon, tone = 'default' }: StatCardProps) {
  return (
    <div className={tone === 'default' ? 'stat' : `stat stat--${tone}`}>
      <span className="stat__icon">{icon}</span>
      <div className="stat__body">
        <strong className="stat__value">{value}</strong>
        <span className="stat__label">{label}</span>
      </div>
    </div>
  )
}