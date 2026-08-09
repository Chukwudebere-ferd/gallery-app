import type { CSSProperties } from 'react'
import IconButton from '../ui/IconButton'
import {
  HomeIcon,
  SearchIcon,
  BookmarkIcon,
  UserIcon,
  PlusIcon,
} from '../ui/icons'
import './BottomNav.css'

export default function BottomNav() {
  const fabStyle = { '--fab-size': '56px' } as CSSProperties
  return (
    <nav className="bottom-nav" aria-label="Primary">
      <div className="bottom-nav__inner">
        <IconButton label="Home" active className="bottom-nav__item">
          <HomeIcon />
        </IconButton>
        <IconButton label="Search" className="bottom-nav__item">
          <SearchIcon />
        </IconButton>

        <button
          type="button"
          className="bottom-nav__fab"
          style={fabStyle}
          aria-label="Upload a photo or video"
        >
          <PlusIcon />
        </button>

        <IconButton label="Saved" className="bottom-nav__item">
          <BookmarkIcon />
        </IconButton>
        <IconButton label="Profile" className="bottom-nav__item">
          <UserIcon />
        </IconButton>
      </div>
    </nav>
  )
}