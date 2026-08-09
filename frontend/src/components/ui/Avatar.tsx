import { useState } from 'react'
import type { CSSProperties } from 'react'
import './Avatar.css'

type Size = 'xs' | 'sm' | 'md' | 'lg'

export interface AvatarProps {
  name: string
  src?: string
  size?: Size
  className?: string
}

const sizeMap: Record<Size, number> = {
  xs: 22,
  sm: 28,
  md: 36,
  lg: 44,
}

const hueFor = (name: string) => {
  let h = 0
  for (let i = 0; i < name.length; i += 1) {
    h = (h * 31 + name.charCodeAt(i)) % 360
  }
  return h
}

export default function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const [broken, setBroken] = useState(false)
  const px = sizeMap[size]
  const initial = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(-2)
    .join('')
    .toUpperCase()

  const style: CSSProperties & { '--hue': number } = {
    width: px,
    height: px,
    fontSize: Math.round(px * 0.38),
    '--hue': hueFor(name),
  }

  if (src && !broken) {
    return (
      <img
        src={src}
        alt={name}
        className={className || 'avatar'}
        style={style}
        onError={() => setBroken(true)}
      />
    )
  }

  return (
    <span className={className || 'avatar avatar--fallback'} style={style} aria-hidden>
      {initial}
    </span>
  )
}