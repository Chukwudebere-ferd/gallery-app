import { useCallback, useEffect, useState } from 'react'
import Badge from '../../components/ui/Badge'
import Switch from '../../components/ui/Switch'
import Field from '../../components/ui/Field'
import StatCard from '../../components/admin/StatCard'
import UserRow from '../../components/admin/UserRow'
import ModerationCard from '../../components/admin/ModerationCard'
import Spinner from '../../components/ui/Spinner'
import UploadPage from '../Upload/UploadPage'
import { pendingPosts } from '../../services/mockAdmin'
import type { AdminPost, ApprovalMode, ModerationStatus } from '../../services/mockAdmin'
import {
  fetchAdminOverview,
  fetchAdminUsers,
  updateAdminUser,
} from '../../services/adminApi'
import type { AdminOverview, AdminUser, UserFilter } from '../../services/adminApi'
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
} from '../../components/ui/icons'
import './AdminPage.css'

type Tab = 'overview' | 'users' | 'moderation' | 'uploads'
type PostFilter = 'pending' | 'approved' | 'declined'
type LoadStatus = 'loading' | 'ready' | 'error'

const TABS: { key: Tab; label: string; icon: typeof UserIcon }[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboardIcon },
  { key: 'users', label: 'Users', icon: UserIcon },
  { key: 'moderation', label: 'Moderation', icon: CheckCircleIcon },
  { key: 'uploads', label: 'Uploads', icon: CameraIcon },
]

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('overview')
  const [mode, setMode] = useState<ApprovalMode>('auto')

  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [overviewStatus, setOverviewStatus] = useState<LoadStatus>('loading')
  const [overviewError, setOverviewError] = useState('')
  const [overviewReload, setOverviewReload] = useState(0)

  const [userList, setUserList] = useState<AdminUser[]>([])
  const [userTotal, setUserTotal] = useState(0)
  const [usersStatus, setUsersStatus] = useState<LoadStatus>('loading')
  const [usersError, setUsersError] = useState('')
  const [usersReload, setUsersReload] = useState(0)
  const [pendingUid, setPendingUid] = useState<string | null>(null)

  const [userFilter, setUserFilter] = useState<UserFilter>('all')
  const [userQuery, setUserQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const [postList, setPostList] = useState<AdminPost[]>(pendingPosts)
  const [postFilter, setPostFilter] = useState<PostFilter>('pending')

  useEffect(() => {
    let cancelled = false
    setOverviewStatus('loading')
    setOverviewError('')
    fetchAdminOverview()
      .then((data) => {
        if (cancelled) return
        setOverview(data)
        setOverviewStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        setOverviewError(err instanceof Error ? err.message : 'Failed to load stats.')
        setOverviewStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [overviewReload])

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQuery(userQuery), 350)
    return () => window.clearTimeout(t)
  }, [userQuery])

  useEffect(() => {
    let cancelled = false
    setUsersStatus('loading')
    setUsersError('')
    fetchAdminUsers(debouncedQuery, userFilter)
      .then((res) => {
        if (cancelled) return
        setUserList(res.users)
        setUserTotal(res.total)
        setUsersStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        setUsersError(err instanceof Error ? err.message : 'Failed to load users.')
        setUsersStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [debouncedQuery, userFilter, usersReload])

  const pendingCount = postList.filter((p) => p.status === 'pending').length

  const filteredPosts = postList.filter((p) => p.status === postFilter)

  const toggleUser = useCallback(
    async (id: string, patch: { verified?: boolean; banned?: boolean }) => {
      const current = userList.find((u) => u.id === id)
      if (!current || pendingUid) return
      setPendingUid(id)
      setUsersError('')
      try {
        const updated = await updateAdminUser(id, patch)
        setUserList((prev) => prev.map((u) => (u.id === id ? updated : u)))
        setOverviewReload((n) => n + 1)
      } catch (err) {
        setUsersError(err instanceof Error ? err.message : 'Failed to update user.')
      } finally {
        setPendingUid(null)
      }
    },
    [userList, pendingUid],
  )

  const toggleVerified = (id: string) => {
    const current = userList.find((u) => u.id === id)
    if (current) void toggleUser(id, { verified: !current.verified })
  }

  const toggleBan = (id: string) => {
    const current = userList.find((u) => u.id === id)
    if (current) void toggleUser(id, { banned: !current.banned })
  }

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
          {overviewStatus === 'loading' ? (
            <div className="admin__loading" role="status">
              <Spinner size={28} label="Loading stats…" />
            </div>
          ) : overviewStatus === 'error' ? (
            <div className="admin__empty" role="alert">
              <ClockIcon />
              <h2>Couldn't load stats</h2>
              <p>{overviewError}</p>
              <button
                type="button"
                className="admin__retry"
                onClick={() => setOverviewReload((n) => n + 1)}
              >
                Try again
              </button>
            </div>
          ) : overview ? (
            <div className="admin__overview">
              <div className="admin__overview-main">
                <h2 className="admin__overview-title">At a glance</h2>
                <div className="admin__stats">
                  <StatCard
                    label="Total users"
                    value={overview.totalUsers}
                    icon={<UserIcon />}
                  />
                  <StatCard
                    label="Email subscribers"
                    value={overview.emailSubscribers}
                    icon={<MailIcon />}
                    tone="accent"
                  />
                  <StatCard
                    label="Verified"
                    value={overview.verifiedUsers}
                    icon={<ShieldCheckIcon />}
                    tone="accent"
                  />
                  <StatCard
                    label="Pending approval"
                    value={overview.pendingPosts}
                    icon={<ClockIcon />}
                    tone="success"
                  />
                  <StatCard
                    label="Banned"
                    value={overview.bannedUsers}
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
          ) : null}
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

          {usersStatus === 'loading' ? (
            <div className="admin__loading" role="status">
              <Spinner size={28} label="Loading users…" />
            </div>
          ) : usersStatus === 'error' ? (
            <div className="admin__empty" role="alert">
              <UserIcon />
              <h2>Couldn't load users</h2>
              <p>{usersError}</p>
              <button
                type="button"
                className="admin__retry"
                onClick={() => setUsersReload((n) => n + 1)}
              >
                Try again
              </button>
            </div>
          ) : userList.length > 0 ? (
            <>
              {usersError && (
                <p className="admin__error" role="alert">
                  {usersError}
                </p>
              )}
              <p className="admin__count" role="status">
                {userTotal} {userTotal === 1 ? 'user' : 'users'}
              </p>
              <ul className="admin__list">
                {userList.map((u) => (
                  <UserRow
                    key={u.id}
                    user={u}
                    onToggleVerified={toggleVerified}
                    onToggleBan={toggleBan}
                    busy={pendingUid === u.id}
                  />
                ))}
              </ul>
            </>
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
