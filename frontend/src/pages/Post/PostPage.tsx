import { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { media } from '../../services/mockData'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import CommentSection from '../../components/comments/CommentSection'
import { useGuestPrompt } from '../../components/auth/useGuestPrompt'
import {
  ArrowLeftIcon,
  HeartIcon,
  CommentIcon,
  ShareIcon,
  BookmarkIcon,
  PlayIcon,
} from '../../components/ui/icons'
import './PostPage.css'

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`
  return String(n)
}

export default function PostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const item = media.find((m) => m.id === id)

  const [liked, setLiked] = useState(item?.liked ?? false)
  const [saved, setSaved] = useState(item?.saved ?? false)
  const [copied, setCopied] = useState(false)
  const commentsRef = useRef<HTMLDivElement>(null)
  const { guard, element: prompt } = useGuestPrompt()

  const likeCount = (item?.likes ?? 0) + (liked && !item?.liked ? 1 : 0)

  const toggleLike = () => {
    if (guard('like this post')) return
    setLiked((v) => !v)
  }

  const toggleSave = () => {
    if (guard('save this post')) return
    setSaved((v) => !v)
  }

  const follow = () => {
    guard('follow this camper')
  }

  const share = async () => {
    const url = `https://campfire.gallery/p/${item?.id ?? ''}`
    if (navigator.share) {
      try {
        await navigator.share({ title: item?.title ?? 'Campfire photo', url })
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

  if (!item) {
    return (
      <div className="pp-missing">
        <h2>Post not found</h2>
        <p>This photo may have been removed or the link is out of date.</p>
        <Link to="/" className="pp-missing__link">
          Back to the feed
        </Link>
      </div>
    )
  }

  return (
    <article className="post">
      {prompt}
      <div className="post__back">
        <button
          type="button"
          className="post__back-btn"
          onClick={() => void navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeftIcon />
        </button>
        <span>Back to feed</span>
      </div>

      <div className="post__layout">
        <div className="post__media-wrap">
          <div className="post__media" style={{ aspectRatio: `${item.width}/${item.height}` }}>
            <img src={item.image} alt={item.title} decoding="async" />

            {item.type === 'video' && (
              <span className="post__video" role="img" aria-label="Video">
                <PlayIcon />
              </span>
            )}

            <div className="post__overlay">
              <button
                type="button"
                className={saved ? 'post__save post__save--on' : 'post__save'}
                onClick={toggleSave}
              >
                <BookmarkIcon filled={saved} />
                {saved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        <div className="post__info">
          <h1 className="post__title">{item.title}</h1>

          <div className="post__author">
            <Avatar name={item.author.name} src={item.author.avatarUrl} size="md" />
            <div className="post__author-meta">
              <strong>{item.author.name}</strong>
              <span>2 days ago · {item.type === 'video' ? 'Video' : 'Photo'}</span>
            </div>
            <Button variant="secondary" size="xs" className="post__follow" onClick={follow}>
              Follow
            </Button>
          </div>

          <div className="post__actions">
            <button
              type="button"
              className={liked ? 'post__act post__act--like post__act--on' : 'post__act post__act--like'}
              onClick={toggleLike}
              aria-pressed={liked}
              aria-label={liked ? 'Unlike this post' : 'Like this post'}
            >
              <HeartIcon filled={liked} />
              <span>{formatCount(likeCount)}</span>
            </button>

            <button
              type="button"
              className="post__act"
              onClick={() =>
                commentsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
              aria-label="Comment on this post"
            >
              <CommentIcon />
              <span>{formatCount(item.comments)}</span>
            </button>

            <button
              type="button"
              className="post__act"
              onClick={() => void share()}
              aria-label={copied ? 'Link copied' : 'Share this post'}
            >
              <ShareIcon />
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>

          <div ref={commentsRef} className="post__comments">
            <CommentSection postId={item.id} />
          </div>
        </div>
      </div>
    </article>
  )
}