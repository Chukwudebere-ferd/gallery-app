import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { MediaItem } from '../../services/mockData'
import Avatar from '../ui/Avatar'
import {
  HeartIcon,
  CommentIcon,
  ShareIcon,
  BookmarkIcon,
  PlayIcon,
  CameraIcon,
} from '../ui/icons'
import './PhotoCard.css'

export interface PhotoCardProps {
  item: MediaItem
  index: number
}

function formatCount(n: number): string {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`
  }
  return String(n)
}

export default function PhotoCard({ item, index }: PhotoCardProps) {
  const [liked, setLiked] = useState(item.liked)
  const [saved, setSaved] = useState(item.saved)
  const [copied, setCopied] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  const likeCount = item.likes + (liked && !item.liked ? 1 : 0)

  const toggleLike = () => setLiked((v) => !v)
  const toggleSave = () => setSaved((v) => !v)

  const share = async () => {
    const url = `https://campfire.gallery/p/${item.id}`
    if (navigator.share) {
      try {
        await navigator.share({ title: item.title, text: item.title, url })
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
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const mediaStyle = {
    aspectRatio: `${item.width} / ${item.height}`,
    '--i': index,
  } as CSSProperties & { '--i': number }

  return (
    <article className="pc" style={mediaStyle}>
      <div className="pc__media">
        {imageFailed ? (
          <div className="pc__fallback">
            <CameraIcon />
          </div>
        ) : (
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        )}

        {item.type === 'video' && (
          <span className="pc__video" role="img" aria-label="Video">
            <PlayIcon />
          </span>
        )}

        <div className="pc__overlay">
          <button
            type="button"
            className={saved ? 'pc__save pc__save--saved' : 'pc__save'}
            onClick={toggleSave}
          >
            <BookmarkIcon filled={saved} />
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      <div className="pc__meta">
        <h3 className="pc__title">{item.title}</h3>
        <div className="pc__row">
          <span className="pc__author">
            <Avatar name={item.author.name} src={item.author.avatarUrl} size="xs" />
            <span className="pc__author-name">{item.author.name}</span>
          </span>

          <button
            type="button"
            className={
              liked ? 'pc__stat pc__stat--like pc__stat--on' : 'pc__stat pc__stat--like'
            }
            onClick={toggleLike}
            aria-pressed={liked}
            aria-label={liked ? `Unlike ${item.title}` : `Like ${item.title}`}
          >
            <HeartIcon filled={liked} />
            {formatCount(likeCount)}
          </button>

          <span className="pc__stat" aria-label={`${item.comments} comments`}>
            <CommentIcon />
            {formatCount(item.comments)}
          </span>

          <button
            type="button"
            className="pc__share"
            onClick={share}
            aria-label={copied ? 'Link copied' : `Share ${item.title}`}
          >
            <ShareIcon />
            <span className="pc__share-text">{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>
    </article>
  )
}