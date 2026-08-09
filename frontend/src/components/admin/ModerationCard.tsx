import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { CheckCircleIcon, XCircleIcon, PlayIcon, FlagIcon } from '../ui/icons'
import type { AdminPost, ModerationStatus } from '../../services/mockAdmin'
import './ModerationCard.css'

const statusLabel: Record<ModerationStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  declined: 'Declined',
}

const statusTone: Record<ModerationStatus, 'neutral' | 'success' | 'danger'> = {
  pending: 'neutral',
  approved: 'success',
  declined: 'danger',
}

export interface ModerationCardProps {
  post: AdminPost
  onStatus: (id: string, status: ModerationStatus) => void
}

export default function ModerationCard({ post, onStatus }: ModerationCardProps) {
  return (
    <li className="mod-card">
      <div className="mod-card__media">
        <img src={post.image} alt={post.title} loading="lazy" decoding="async" />
        {post.type === 'video' && (
          <span className="mod-card__play" role="img" aria-label="Video">
            <PlayIcon />
          </span>
        )}
      </div>

      <div className="mod-card__body">
        <div className="mod-card__top">
          <h3 className="mod-card__title">{post.title}</h3>
          <Badge tone={statusTone[post.status]}>{statusLabel[post.status]}</Badge>
        </div>
        <div className="mod-card__meta">
          <span>by {post.author}</span>
          {post.reported && (
            <span className="mod-card__reported">
              <FlagIcon />
              Reported
            </span>
          )}
        </div>

        {post.status === 'pending' && (
          <div className="mod-card__actions">
            <Button
              variant="primary"
              size="xs"
              className="mod-card__approve"
              onClick={() => onStatus(post.id, 'approved')}
            >
              <CheckCircleIcon />
              Approve
            </Button>
            <Button
              variant="secondary"
              size="xs"
              className="mod-card__decline"
              onClick={() => onStatus(post.id, 'declined')}
            >
              <XCircleIcon />
              Decline
            </Button>
          </div>
        )}

        {post.status === 'declined' && (
          <div className="mod-card__actions">
            <Button
              variant="secondary"
              size="xs"
              onClick={() => onStatus(post.id, 'pending')}
            >
              Re-review
            </Button>
          </div>
        )}
      </div>
    </li>
  )
}