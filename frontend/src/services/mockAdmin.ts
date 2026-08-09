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
