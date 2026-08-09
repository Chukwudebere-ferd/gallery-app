export interface AdminUser {
  id: string
  name: string
  handle: string
  avatarUrl: string
  verified: boolean
  banned: boolean
  posts: number
  joined: string
}

export type ModerationStatus = 'pending' | 'approved' | 'declined'

export interface AdminPost {
  id: string
  title: string
  type: 'photo' | 'video'
  author: string
  image: string
  status: ModerationStatus
  reported?: boolean
}

export type ApprovalMode = 'auto' | 'on-approve'

export const approvalModes = ['auto', 'on-approve'] as const

export const emailSubscribers = 1284
export const formatCompact = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`
  return String(n)
}

export const users: AdminUser[] = [
  {
    id: 'u01',
    name: 'Maya Camper',
    handle: '@mayacamp',
    avatarUrl: 'https://i.pravatar.cc/150?img=32',
    verified: true,
    banned: false,
    posts: 48,
    joined: 'Mar 2025',
  },
  {
    id: 'u02',
    name: 'Leo Mwangi',
    handle: '@leotrails',
    avatarUrl: 'https://i.pravatar.cc/150?img=13',
    verified: false,
    banned: false,
    posts: 12,
    joined: 'Jun 2025',
  },
  {
    id: 'u03',
    name: 'Iris Folke',
    handle: '@irisfires',
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
    verified: true,
    banned: false,
    posts: 73,
    joined: 'Jan 2025',
  },
  {
    id: 'u04',
    name: 'Cam Okafor',
    handle: '@camadventures',
    avatarUrl: 'https://i.pravatar.cc/150?img=68',
    verified: false,
    banned: true,
    posts: 4,
    joined: 'Sep 2025',
  },
  {
    id: 'u05',
    name: 'June Kim',
    handle: '@junekamp',
    avatarUrl: 'https://i.pravatar.cc/150?img=59',
    verified: false,
    banned: false,
    posts: 27,
    joined: 'Feb 2025',
  },
  {
    id: 'u06',
    name: 'Otto Berg',
    handle: '@ottobivouac',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    verified: false,
    banned: false,
    posts: 9,
    joined: 'Aug 2025',
  },
  {
    id: 'u07',
    name: 'Rin Sato',
    handle: '@rintent',
    avatarUrl: 'https://i.pravatar.cc/150?img=44',
    verified: true,
    banned: false,
    posts: 56,
    joined: 'Oct 2024',
  },
  {
    id: 'u08',
    name: 'Zoe Harden',
    handle: '@zoebackpack',
    avatarUrl: 'https://i.pravatar.cc/150?img=25',
    verified: false,
    banned: false,
    posts: 3,
    joined: 'Dec 2025',
  },
]

export const pendingPosts: AdminPost[] = [
  {
    id: 'a01',
    title: 'First light on the ridge',
    type: 'photo',
    author: 'June Kim',
    image: 'https://picsum.photos/seed/admin1/600/800',
    status: 'pending',
  },
  {
    id: 'a02',
    title: 'Storm rolling in over camp',
    type: 'video',
    author: 'Leo Mwangi',
    image: 'https://picsum.photos/seed/admin2/800/600',
    status: 'pending',
  },
  {
    id: 'a03',
    title: 'Lake mirror at dawn',
    type: 'photo',
    author: 'Otto Berg',
    image: 'https://picsum.photos/seed/admin3/700/900',
    status: 'pending',
  },
  {
    id: 'a04',
    title: 'Campfire stories, night two',
    type: 'photo',
    author: 'Iris Folke',
    image: 'https://picsum.photos/seed/admin4/600/750',
    status: 'approved',
  },
  {
    id: 'a05',
    title: 'Trail selfie claiming the peak',
    type: 'video',
    author: 'Zoe Harden',
    image: 'https://picsum.photos/seed/admin5/750/520',
    status: 'declined',
    reported: true,
  },
]