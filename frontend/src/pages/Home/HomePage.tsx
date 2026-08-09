import { useEffect, useMemo, useState } from 'react'
import { media } from '../../services/mockData'
import { useShell } from '../../components/layout/useShell'
import { useTopics } from '../../context/topicsContext'
import ChipRow from '../../components/feed/ChipRow'
import MasonryGrid from '../../components/feed/MasonryGrid'
import FeedSkeleton from '../../components/feed/FeedSkeleton'
import Button from '../../components/ui/Button'
import FlameLoader from '../../components/ui/FlameLoader'
import { SearchIcon } from '../../components/ui/icons'
import './HomePage.css'

export default function HomePage() {
  const { query } = useShell()
  const { topics } = useTopics()
  const [tag, setTag] = useState<string>('All')
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    const t = window.setTimeout(
      () => setStatus(attempts >= 2 ? 'error' : 'ready'),
      700,
    )
    return () => window.clearTimeout(t)
  }, [attempts])

  const chips = useMemo(() => ['All', ...topics], [topics])

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    return media.filter((m) => {
      const matchesTag = tag === 'All' || m.tag === tag
      const matchesQuery =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.author.name.toLowerCase().includes(q)
      return matchesTag && matchesQuery
    })
  }, [query, tag])

  return (
    <section className="home" aria-label="Photo feed">
      <ChipRow chips={chips} active={tag} onSelect={setTag} />

      {status === 'loading' ? (
        <FeedSkeleton />
      ) : status === 'error' ? (
        <div className="home__status" role="alert">
          <FlameLoader
            variant="error"
            size={88}
            error="We couldn't reach the campfire."
            errorDetail="The gallery server is unreachable right now. Check your connection and try again."
            onRetry={() => {
              setStatus('loading')
              setAttempts((n) => n + 1)
            }}
          />
        </div>
      ) : items.length > 0 ? (
        <MasonryGrid items={items} />
      ) : (
        <div className="home__empty" role="status">
          <SearchIcon />
          <h3>No results found</h3>
          <p>
            Nothing matches your current search or topic. Try a different
            topic or clear your filters.
          </p>
          <Button variant="secondary" size="sm" onClick={() => setTag('All')}>
            Clear filters
          </Button>
        </div>
      )}
    </section>
  )
}