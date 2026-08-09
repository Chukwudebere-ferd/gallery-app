import { Link, useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'
import { useUser } from '../../context/userContext'
import { LogoMark, SearchIcon, CameraIcon } from '../ui/icons'
import './AppHeader.css'

export interface AppHeaderProps {
  query: string
  onQueryChange: (query: string) => void
}

export default function AppHeader({ query, onQueryChange }: AppHeaderProps) {
  const navigate = useNavigate()
  const { user, status } = useUser()

  const signIn = () =>
    void navigate(`/auth?next=${encodeURIComponent('/')}`)

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link className="app-header__logo" to="/" aria-label="Campfire — home">
          <LogoMark className="app-header__mark" />
          <span className="app-header__word">Campfire</span>
        </Link>

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
          {status === 'guest' ? (
            <Button
              variant="secondary"
              size="sm"
              className="app-header__signin"
              onClick={signIn}
            >
              Sign in
            </Button>
          ) : status === 'authed' ? (
            <>
              <Button
                variant="primary"
                size="sm"
                className="app-header__upload"
                onClick={() => void navigate('/upload')}
              >
                <CameraIcon />
                <span>Upload</span>
              </Button>
              <button
                type="button"
                className="app-header__avatar"
                aria-label="View your profile"
                onClick={() => void navigate('/profile')}
              >
                <Avatar name={user?.name ?? ''} src={user?.avatarUrl} size="sm" />
              </button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  )
}