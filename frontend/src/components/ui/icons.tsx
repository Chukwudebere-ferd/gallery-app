import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
} satisfies IconProps

export function HeartIcon({ filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base} {...props} fill={filled ? 'currentColor' : 'none'}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  )
}

export function CommentIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.27 8.27 0 0 1-3.3-.66L4 21l1.66-4.24A8.27 8.27 0 0 1 4 11.5 8.38 8.38 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z" />
    </svg>
  )
}

export function ShareIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="m16 6-4-4-4 4" />
      <path d="M12 2v13" />
    </svg>
  )
}

export function BookmarkIcon({ filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base} {...props} fill={filled ? 'currentColor' : 'none'}>
      <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16l7-4Z" />
    </svg>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 10.5 12 4l9 6.5" />
      <path d="M5 10.5V21h14v-10.5" />
    </svg>
  )
}

export function UploadIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v14" />
      <path d="m6 9 6-6 6 6" />
      <path d="M4 19v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 5.2v13.6L19.2 12Z" fill="currentColor" />
    </svg>
  )
}

export function CameraIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="5" />
    </svg>
  )
}

export function LogoMark(props: IconProps) {
  return (
    <svg
      width={28}
      height={28}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M12 2c4 3.9 6.5 7.2 6.5 10a6.5 6.5 0 1 1-13 0c0-2.8 2.5-6.1 6.5-10Z" />
      <path d="M12 13c-1.6 0-2.6.8-2.6 2a2.6 2.6 0 0 0 2.6 2.6c1.4 0 2.6-1.2 2.6-2.6 0-1.2-1-2-2.6-2Z" fill="var(--bg)" />
    </svg>
  )
}