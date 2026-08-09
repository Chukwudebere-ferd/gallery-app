import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Flame from '../ui/Flame'
import { LogoMark, ArrowLeftIcon } from '../ui/icons'
import './AuthFlow.css'

export interface AuthFlowProps {
  flame?: boolean
  title: string
  subtitle: string
  backTo?: string
  backLabel?: string
  children: ReactNode
}

export default function AuthFlow({
  flame = true,
  title,
  subtitle,
  backTo,
  backLabel = 'Back',
  children,
}: AuthFlowProps) {
  return (
    <div className="auth-flow">
      <div className="auth-flow__bg" aria-hidden />
      {flame && (
        <div className="auth-flow__flame" aria-hidden>
          <Flame size={132} />
        </div>
      )}

      <section className="auth-flow__panel">
        <main className="auth-flow__card">
          <div className="auth-flow__card-head">
            <LogoMark className="auth-flow__mark" />
            <span>Campfire</span>
          </div>

          {backTo && (
            <Link className="auth-flow__back" to={backTo}>
              <ArrowLeftIcon />
              {backLabel}
            </Link>
          )}

          <h1 className="auth-flow__title">{title}</h1>
          <p className="auth-flow__subtitle">{subtitle}</p>

          {children}
        </main>
      </section>
    </div>
  )
}