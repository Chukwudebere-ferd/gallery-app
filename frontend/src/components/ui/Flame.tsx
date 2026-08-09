import type { CSSProperties } from 'react'
import './Flame.css'

export interface FlameProps {
  size?: number
  className?: string
}

export default function Flame({ size = 120, className }: FlameProps) {
  const style = { '--flame-size': `${size}px` } as CSSProperties & {
    '--flame-size': string
  }
  const cls = ['flame', className].filter(Boolean).join(' ')

  return (
    <div className={cls} style={style} role="presentation" aria-hidden>
      <span className="flame__glow" />
      <span className="flame__flame flame__flame--outer" />
      <span className="flame__flame flame__flame--mid" />
      <span className="flame__flame flame__flame--core" />
      <span className="flame__ember flame__ember--1" />
      <span className="flame__ember flame__ember--2" />
      <span className="flame__ember flame__ember--3" />
      <span className="flame__ember flame__ember--4" />
      <span className="flame__ember flame__ember--5" />
    </div>
  )
}