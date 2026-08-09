import { useState } from 'react'
import type { FormEvent } from 'react'
import Avatar from '../ui/Avatar'
import { HeartIcon, LockIcon, SendIcon } from '../ui/icons'
import { useUser } from '../../context/userContext'
import { useGuestPrompt } from '../auth/useGuestPrompt'
import { commentsForPost } from '../../services/mockComments'
import type { PostComment } from '../../services/mockComments'
import './CommentSection.css'

function CommentRow({ comment }: { comment: PostComment }) {
  const [liked, setLiked] = useState(false)
  const { guard, element: prompt } = useGuestPrompt()

  return (
    <li className="cm">
      {prompt}
      <Avatar name={comment.author.name} src={comment.author.avatarUrl} size="sm" />
      <div className="cm__body">
        <div className="cm__meta">
          <strong>{comment.author.name}</strong>
          <time>{comment.time}</time>
        </div>
        <p className="cm__text">{comment.text}</p>
        <button
          type="button"
          className={liked ? 'cm__like cm__like--on' : 'cm__like'}
          onClick={() => {
            if (guard('like this comment')) return
            setLiked((v) => !v)
          }}
          aria-pressed={liked}
          aria-label={liked ? 'Remove like' : 'Like this comment'}
        >
          <HeartIcon filled={liked} />
          {comment.likes + (liked ? 1 : 0)}
        </button>
      </div>
    </li>
  )
}

export default function CommentSection({ postId }: { postId: string }) {
  const { user, isGuest } = useUser()
  const { guard, element: prompt } = useGuestPrompt()
  const [comments, setComments] = useState<PostComment[]>(() => commentsForPost(postId))
  const [draft, setDraft] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text || !user) return
    setComments((prev) => [
      ...prev,
      {
        id: `${postId}-me${prev.length + 1}`,
        author: { name: user.name, avatarUrl: user.avatarUrl },
        text,
        time: 'just now',
        likes: 0,
      },
    ])
    setDraft('')
  }

  return (
    <section className="cm-section" aria-label="Comments">
      {prompt}
      <h2 className="cm-section__title">
        Comments <span className="cm-section__count">{comments.length}</span>
      </h2>

      <ul className="cm-list">
        {comments.map((c) => (
          <CommentRow key={c.id} comment={c} />
        ))}
      </ul>

      {isGuest ? (
        <div className="cm-guest">
          <button
            type="button"
            className="cm-guest__btn"
            onClick={() => guard('join the conversation')}
          >
            <LockIcon />
            Sign in to comment
          </button>
        </div>
      ) : (
        <form className="cm-form" onSubmit={submit}>
          <Avatar name={user?.name ?? ''} src={user?.avatarUrl} size="sm" />
          <label htmlFor="comment-text" className="sr-only">
            Write a comment
          </label>
          <input
            id="comment-text"
            className="cm-form__input"
            type="text"
            placeholder="Add a comment…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button
            type="submit"
            className="cm-form__send"
            aria-label="Post comment"
            disabled={draft.trim().length === 0}
          >
            <SendIcon />
          </button>
        </form>
      )}
    </section>
  )
}
