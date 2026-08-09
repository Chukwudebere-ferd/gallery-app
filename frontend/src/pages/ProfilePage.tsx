import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { media } from '../services/mockData'
import { useUser } from '../context/userContext'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import MasonryGrid from '../components/feed/MasonryGrid'
import {
  GridIcon,
  PlaySquareIcon,
  BookmarkIcon,
  ShareIcon,
  PenIcon,
} from '../components/ui/icons'
import './ProfilePage.css'

type Tab = 'posts' | 'videos' | 'saved'

const TABS: { key: Tab; label: string; icon: typeof GridIcon }[] = [
  { key: 'posts', label: 'Posts', icon: GridIcon },
  { key: 'videos', label: 'Videos', icon: PlaySquareIcon },
  { key: 'saved', label: 'Saved', icon: BookmarkIcon },
]

export default function ProfilePage() {
  const { user } = useUser()
  const [tab, setTab] = useState<Tab>('posts')

  const items = useMemo(() => {
    switch (tab) {
      case 'videos':
        return media.filter((m) => m.type === 'video')
      case 'saved':
        return media.filter((m) => m.saved)
      default:
        return media.filter((m) => m.type === 'photo')
    }
  }, [tab])

  const shareProfile = async () => {
    const url = 'https://campfire.gallery/mayacamp'
    if (navigator.share) {
      try {
        await navigator.share({ title: user.name, text: user.bio, url })
      } catch {
        /* user cancelled */
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      /* clipboard unavailable */
    }
  }

return (
    <div className="profile">
      <header className="profile__head">
        <div className="profile__cover" aria-hidden />
        <div className="profile__row">
          <Avatar name={user.name} src={user.avatarUrl} size="lg" />
          <div className="profile__id">
            <h1>{user.name}</h1>
            <span>@{user.username}</span>
          </div>
          <div className="profile__head-actions">
            <Link to="/settings" className="btn btn--secondary btn--sm">
              <PenIcon />
              Edit profile
            </Link>
            <Button variant="ghost" size="sm" onClick={() => void shareProfile()} aria-label="Share profile">
              <ShareIcon />
            </Button>
          </div>
        </div>

        <p className="profile__bio">{user.bio}</p>

        <ul className="profile__stats">
          <li>
            <strong>{media.length}</strong>
            <span>Posts</span>
          </li>
          <li>
            <strong>{media.filter((m) => m.saved).length}</strong>
            <span>Saved</span>
          </li>
          <li>
            <strong>2.4k</strong>
            <span>Followers</span>
          </li>
          <li>
            <strong>312</strong>
            <span>Following</span>
          </li>
        </ul>
      </header>

      <nav className="profile__tabs" aria-label="Profile sections">
        {TABS.map(({ key, label, icon: Icon }) => {
          const active = tab === key
          const tint = active ? 'profile__tab profile__tab--on' : 'profile__tab'
          return (
            <button
              key={key}
              type="button"
              className={tint}
              aria-selected={active}
              role="tab"
              onClick={() => setTab(key)}
            >
              <Icon />
              {label}
            </button>
          )
        })}
      </nav>

      <div className="profile__grid">
        {items.length > 0 ? (
          <MasonryGrid items={items} />
        ) : (
          <div className="profile__empty" role="status">
            <PlaySquareIcon />
            <h2>Nothing here yet</h2>
            <p>Share your first video and it will show up in this section.</p>
          </div>
        )}
      </div>
    </div>
  )
}