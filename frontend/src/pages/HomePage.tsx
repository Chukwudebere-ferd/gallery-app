import { useMemo, useState } from 'react'
import { media, tags } from '../services/mockData'
import ChipRow from '../components/feed/ChipRow'
import MasonryGrid from '../components/feed/MasonryGrid'
import Button from '../components/ui/Button'
import { SearchIcon } from '../components/ui/icons'
import './HomePage.css'

export interface HomePageProps {
  query: string
}

export default function HomePage({ query }: HomePageProps) {
  const [tag, setTag] = useState<string>(tags[0])

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    return media.filter((m) => {
      const matchesTag = tag === tags[0] || m.tag === tag
      const matchesQuery =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.author.name.toLowerCase().includes(q)
      return matchesTag && matchesQuery
    })
  }, [query, tag])

  return (
    <section className="home" aria-label="Photo feed">
      <ChipRow chips={tags} active={tag} onSelect={setTag} />

      {items.length > 0 ? (
        <MasonryGrid items={items} />
      ) : (
        <div className="home__empty" role="status">
          <SearchIcon />
          <h3>No results found</h3>
          <p>
            Nothing matches your current search or topic. Try a different
            topic or clear your filters.
          </p>
          <Button variant="secondary" size="sm" onClick={() => setTag(tags[0])}>
            Clear filters
          </Button>
        </div>
      )}
    </section>
  )
}