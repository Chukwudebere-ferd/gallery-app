export interface PostComment {
  id: string
  author: { name: string; avatarUrl?: string }
  text: string
  time: string
  likes: number
}

const authors = [
  { name: 'Leo Mwangi', avatarUrl: 'https://i.pravatar.cc/150?img=13' },
  { name: 'Iris Folke', avatarUrl: 'https://i.pravatar.cc/150?img=32' },
  { name: 'Cam Okafor', avatarUrl: 'https://i.pravatar.cc/150?img=68' },
  { name: 'June Kim', avatarUrl: 'https://i.pravatar.cc/150?img=47' },
  { name: 'Otto Berg', avatarUrl: 'https://i.pravatar.cc/150?img=59' },
  { name: 'Rin Sato', avatarUrl: 'https://i.pravatar.cc/150?img=44' },
]

const pool = [
  'This shot is unreal — adding it to my camp bucket list.',
  'We camped here last fall. The light is exactly like this at sunrise.',
  'The colors! What camera did you use?',
  'Saving this for our next trip planning.',
  'So quiet and peaceful. Love the mood.',
  'Can you share the trailhead info?',
  'This makes me want to book a weekend out immediately.',
  'Beautiful composition. Keep them coming!',
  'The best part of camping right there.',
  'Perfection. Straight to the group chat.',
]

const times = ['2h ago', '5h ago', 'Yesterday', '2 days ago', '4 days ago', '1w ago']

function hashFor(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 37 + id.charCodeAt(i)) % 1009
  }
  return h
}

export function commentsForPost(postId: string): PostComment[] {
  const seed = hashFor(postId)
  const count = 3 + (seed % 3)
  const start = seed % pool.length
  return Array.from({ length: count }, (_, i) => {
    const body = pool[(start + i) % pool.length]
    const author = authors[(seed + i) % authors.length]
    return {
      id: `${postId}-c${i + 1}`,
      author,
      text: body,
      time: times[(start + i) % times.length],
      likes: (seed + i * 7) % 24,
    }
  })
}