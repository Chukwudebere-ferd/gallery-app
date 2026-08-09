import type { CSSProperties, HTMLAttributes } from 'react'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  height?: number | string
  width?: number | string
  circle?: boolean
}

export default function Skeleton({
  height,
  width,
  circle,
  className,
  style,
  ...rest
}: SkeletonProps) {
  const cls = ['skeleton', className].filter(Boolean).join(' ')
  const merged: CSSProperties = {
    height: height ?? '100%',
    width: width,
    borderRadius: circle ? '50%' : undefined,
    ...style,
  }
  return <div className={cls} style={merged} aria-hidden {...rest} />
}