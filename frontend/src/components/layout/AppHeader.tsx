import Button from '../ui/Button'
import Avatar from '../ui/Avatar'
import { LogoMark, SearchIcon, CameraIcon } from '../ui/icons'
import './AppHeader.css'

export interface AppHeaderProps {
  query: string
  onQueryChange: (query: string) => void
}

export default function AppHeader({ query, onQueryChange }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <a className="app-header__logo" href="/" aria-label="Campfire — home">
          <LogoMark className="app-header__mark" />
          <span className="app-header__word">Campfire</span>
        </a>

        <form
          className="app-header__search"
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <SearchIcon className="app-header__search-icon" />
          <label htmlFor="global-search" className="sr-only">
            Search photos and videos
          </label>
          <input
            id="global-search"
            className="app-header__search-input"
            type="search"
            placeholder="Search camping, hikes, campfires…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </form>

        <div className="app-header__actions">
          <Button variant="primary" size="sm" className="app-header__upload">
            <CameraIcon />
            <span>Upload</span>
          </Button>
          <Avatar
            name="Maya Camper"
            src="https://i.pravatar.cc/80?img=32"
            size="sm"
          />
        </div>
      </div>
    </header>
  )
}