import type { NavLinkRenderProps } from 'react-router-dom'
import { Link, NavLink } from 'react-router-dom'
import { HomeIcon, UserIcon, PlusIcon } from '../ui/icons'
import './BottomNav.css'

const itemClass = ({ isActive }: NavLinkRenderProps) =>
  [
    'icon-btn',
    'bottom-nav__item',
    isActive ? 'bottom-nav__item--active' : '',
  ]
    .filter(Boolean)
    .join(' ')

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      <div className="bottom-nav__inner">
        <NavLink to="/" end aria-label="Home" className={itemClass}>
          <HomeIcon />
          <span className="bottom-nav__label">Home</span>
        </NavLink>

        <Link
          to="/upload"
          className="bottom-nav__fab"
          aria-label="Upload a photo or video"
        >
          <PlusIcon />
          <span className="bottom-nav__label bottom-nav__label--fab">Upload</span>
        </Link>

        <NavLink to="/profile" aria-label="Profile" className={itemClass}>
          <UserIcon />
          <span className="bottom-nav__label">Profile</span>
        </NavLink>
      </div>
    </nav>
  )
}