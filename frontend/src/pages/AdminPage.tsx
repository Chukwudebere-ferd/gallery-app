import { useMemo, useState } from 'react'
import Badge from '../components/ui/Badge'
import Switch from '../components/ui/Switch'
import Field from '../components/ui/Field'
import StatCard from '../components/admin/StatCard'
import UserRow from '../components/admin/UserRow'
import ModerationCard from '../components/admin/ModerationCard'
import UploadPage from './UploadPage'
import { users, pendingPosts, emailSubscribers, formatCompact } from '../services/mockAdmin'
import type { AdminPost, AdminUser, ApprovalMode, ModerationStatus } from '../services/mockAdmin'
import {
  LayoutDashboardIcon,
  UserIcon,
  ShieldCheckIcon,
  BanIcon,
  ClockIcon,
  CheckCircleIcon,
  SearchIcon,
  CameraIcon,
  MailIcon,
} from '../components/ui/icons'
import './AdminPage.css'

type Tab = 'overview' | 'users' | 'moderation' | 'uploads'
type UserFilter = 'all' | 'verified' | 'banned'
type PostFilter = 'pending' | 'approved' | 'declined'

const TABS: { key: Tab; label: string; icon: typeof UserIcon }[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboardIcon },
  { key: 'users', label: 'Users', icon: UserIcon },
  { key: 'moderation', label: 'Moderation', icon: CheckCircleIcon },
  { key: 'uploads', label: 'Uploads', icon: CameraIcon },
]

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('overview')
  const [mode, setMode] = useState<ApprovalMode>('auto')
  const [userList, setUserList] = useState<AdminUser[]>(users)
  const [postList, setPostList] = useState<AdminPost[]>(pendingPosts)

  const [userFilter, setUserFilter] = useState<UserFilter>('all')
  const [userQuery, setUserQuery] = useState('')
  const [postFilter, setPostFilter] = useState<PostFilter>('pending')

  const pendingCount = postList.filter((p) => p.status === 'pending').length
  const verifiedCount = userList.filter((u) => u.verified).length
  const bannedCount = userList.filter((u) => u.banned).length

  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase()
    return userList.filter((u) => {
      const matchesFilter =
        userFilter === 'all' ||
        (userFilter === 'verified' && u.verified) ||
        (userFilter === 'banned' && u.banned)
      const matchesQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.handle.toLowerCase().includes(q)
      return matchesFilter && matchesQuery
    })
  }, [userList, userFilter, userQuery])

  const filteredPosts = useMemo(
    () => postList.filter((p) => p.status === postFilter),
    [postList, postFilter],
  )

  const toggleVerified = (id: string) =>
    setUserList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, verified: !u.verified } : u)),
    )

  const toggleBan = (id: string) =>
    setUserList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, banned: !u.banned } : u)),
    )

  const setStatus = (id: string, status: ModerationStatus) =>
    setPostList((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))

  return (
    <section className="admin" aria-label="Admin dashboard">
      <header className="admin__head">
        <div className="admin__title">
          <Badge tone="accent">Admin</Badge>
          <h1>Camp control room</h1>
          <p>Manage your camp — users, approvals and uploads.</p>
        </div>
      </header>

      <nav className="admin__tabs" aria-label="Admin sections">
        {TABS.map(({ key, label, icon: Icon }) => {
          const active = tab === key
          const badge = key === 'moderation' && pendingCount > 0 ? pendingCount : undefined
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              className={active ? 'admin__tab admin__tab--on' : 'admin__tab'}
              onClick={() => setTab(key)}
            >
              <Icon />
              {label}
              {badge != null && <span className="admin__tab-badge">{badge}</span>}
            </button>
          )
        })}
      </nav>

      {tab === 'overview' && (
        <div className="admin__panel">
          <div className="admin__overview">
            <div className="admin__overview-main">
              <h2 className="admin__overview-title">At a glance</h2>
              <div className="admin__stats">
                <StatCard
                  label="Total users"
                  value={userList.length}
                  icon={<UserIcon />}
                />
                <StatCard
                  label="Email subscribers"
                  value={formatCompact(emailSubscribers)}
                  icon={<MailIcon />}
                  tone="accent"
                />
                <StatCard
                  label="Verified"
                  value={verifiedCount}
                  icon={<ShieldCheckIcon />}
                  tone="accent"
                />
                <StatCard
                  label="Pending approval"
                  value={pendingCount}
                  icon={<ClockIcon />}
                  tone="success"
                />
                <StatCard
                  label="Banned"
                  value={bannedCount}
                  icon={<BanIcon />}
                  tone="danger"
                />
              </div>
              <div className="admin__quick">
                <div>
                  <strong>Post approval mode</strong>
                  <p>
                    {mode === 'auto'
                      ? 'New photos & videos go live instantly.'
                      : 'New photos & videos wait for your review.'}
                  </p>
                </div>
                <Switch
                  name="Approval mode"
                  value={mode}
                  onChange={setMode}
                  options={[
                    {
                      value: 'auto',
                      label: 'Auto-post all',
                      hint: 'Published instantly',
                      icon: CheckCircleIcon,
                    },
                    {
                      value: 'on-approve',
                      label: 'On approve',
                      hint: 'Reviewed by admin first',
                      icon: ClockIcon,
                    },
                  ]}
                />
              </div>
            </div>

            <aside className="admin__overview-side">
              <div className="admin__mode">
                <div className="admin__mode-head">
                  <span className="admin__mode-icon">
                    <CheckCircleIcon />
                  </span>
                  <div>
                    <h2>Approval settings</h2>
                    <p>Choose how photos & videos reach the feed.</p>
                  </div>
                </div>
                <p className="admin__mode-note">
                  {mode === 'auto'
                    ? 'Everything is live immediately. Switch to On-approve to screen content before it appears.'
                    : 'New posts sit in the Moderation tab until you approve them — pending items are not public.'}
                </p>
                <Badge tone={mode === 'auto' ? 'success' : 'neutral'}>
                  {mode === 'auto' ? 'Auto-post all' : 'On-approve'}
                </Badge>
              </div>
            </aside>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="admin__panel">
          <div className="admin__tools">
            <div className="admin__chips" role="tablist" aria-label="User filter">
              {(
                [
                  ['all', 'All'],
                  ['verified', 'Verified'],
                  ['banned', 'Banned'],
                ] as [UserFilter, string][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={userFilter === value}
                  className={
                    userFilter === value
                      ? 'admin__chip admin__chip--on'
                      : 'admin__chip'
                  }
                  onClick={() => setUserFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            <Field
              label="Search users"
              className="admin__search"
              icon={<SearchIcon />}
              type="search"
              placeholder="Search by name or handle…"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
            />
          </div>

          {filteredUsers.length > 0 ? (
            <ul className="admin__list">
              {filteredUsers.map((u) => (
                <UserRow
                  key={u.id}
                  user={u}
                  onToggleVerified={toggleVerified}
                  onToggleBan={toggleBan}
                />
              ))}
            </ul>
          ) : (
            <div className="admin__empty" role="status">
              <UserIcon />
              <h2>No users found</h2>
              <p>No one matches your current search or filter.</p>
            </div>
          )}
        </div>
      )}

      {tab === 'moderation' && (
        <div className="admin__panel">
          <div className="admin__chips" role="tablist" aria-label="Post filter">
            {(
              [
                ['pending', 'Pending'],
                ['approved', 'Approved'],
                ['declined', 'Declined'],
              ] as [PostFilter, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={postFilter === value}
                className={
                  postFilter === value ? 'admin__chip admin__chip--on' : 'admin__chip'
                }
                onClick={() => setPostFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>

          {filteredPosts.length > 0 ? (
            <ul className="admin__list">
              {filteredPosts.map((p) => (
                <ModerationCard key={p.id} post={p} onStatus={setStatus} />
              ))}
            </ul>
          ) : (
            <div className="admin__empty" role="status">
              <CheckCircleIcon />
              <h2>All caught up</h2>
              <p>Nothing in this state right now.</p>
            </div>
          )}
        </div>
      )}

      {tab === 'uploads' && (
        <div className="admin__panel">
          <div className="admin__upload-hint">
            <p>
              Upload photos and videos for your camp. Everything shares the same
              HD pipeline as the normal upload flow.
            </p>
          </div>
          <UploadPage />
        </div>
      )}
    </section>
  )
}