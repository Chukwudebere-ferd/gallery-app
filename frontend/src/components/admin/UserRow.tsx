import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { ShieldCheckIcon, BanIcon, RotateCcwIcon } from '../ui/icons'
import type { AdminUser } from '../../services/mockAdmin'
import './UserRow.css'

export interface UserRowProps {
  user: AdminUser
  onToggleVerified: (id: string) => void
  onToggleBan: (id: string) => void
}

export default function UserRow({ user, onToggleVerified, onToggleBan }: UserRowProps) {
  return (
    <li className="user-row">
      <Avatar name={user.name} src={user.avatarUrl} size="md" />
      <div className="user-row__meta">
        <strong className="user-row__name">
          {user.name}
          {user.verified && <Badge tone="accent">Verified</Badge>}
          {user.banned && <Badge tone="danger">Banned</Badge>}
        </strong>
        <span className="user-row__sub">
          {user.handle} · {user.posts} posts · joined {user.joined}
        </span>
      </div>
      <div className="user-row__actions">
        <Button
          variant={user.verified ? 'ghost' : 'secondary'}
          size="xs"
          aria-pressed={user.verified}
          onClick={() => onToggleVerified(user.id)}
        >
          <ShieldCheckIcon />
          {user.verified ? 'Verified' : 'Verify'}
        </Button>
        <Button
          variant={user.banned ? 'secondary' : 'ghost'}
          size="xs"
          className={user.banned ? '' : 'user-row__ban'}
          onClick={() => onToggleBan(user.id)}
        >
          {user.banned ? <RotateCcwIcon /> : <BanIcon />}
          {user.banned ? 'Unban' : 'Ban'}
        </Button>
      </div>
    </li>
  )
}