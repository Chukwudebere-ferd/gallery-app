import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { media } from '../../services/mockData'
import MasonryGrid from '../../components/feed/MasonryGrid'
import { BookmarkIcon, HeartIcon } from '../../components/ui/icons'
import './SavedPage.css'

export default function SavedPage() {
  const items = useMemo(() => media.filter((m) => m.saved), [])

  return (
    <section className="saved" aria-label="Saved posts">
      <header className="saved__head">
        <h1 className="saved__title">Saved</h1>
        <p className="saved__desc">
          {items.length > 0
            ? `${items.length} post${items.length === 1 ? '' : 's'} waiting for you`
            : 'Posts you save will show up here'}
        </p>
      </header>

      {items.length > 0 ? (
        <MasonryGrid items={items} />
      ) : (
        <div className="saved__empty" role="status">
          <BookmarkIcon />
          <h2>Nothing saved yet</h2>
          <p>
            Tap the bookmark on any post to keep it here for later — great for
            planning your next trip.
          </p>
          <Link to="/" className="saved__cta">
            <HeartIcon />
            Browse the feed
          </Link>
        </div>
      )}
    </section>
  )
}