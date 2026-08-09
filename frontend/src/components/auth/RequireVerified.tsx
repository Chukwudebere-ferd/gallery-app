import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useUser } from '../../context/userContext'
import FlameLoader from '../ui/FlameLoader'
import './RequireVerified.css'

export default function RequireVerified() {
  const { status, role, verified, user } = useUser()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="require-verified">
        <FlameLoader size={88} label="Checking your campfire…" />
      </div>
    )
  }

  // Guests can browse without an account.
  if (status === 'guest') return <Outlet />

  // Admins are auto-verified.
  if (role === 'admin') return <Outlet />

  if (verified === null) {
    return (
      <div className="require-verified">
        <FlameLoader size={88} label="Checking your campfire…" />
      </div>
    )
  }

  if (verified) return <Outlet />

  const email = user?.email ? `&email=${encodeURIComponent(user.email)}` : ''
  const next = encodeURIComponent(location.pathname + location.search)
  return (
    <Navigate to={`/verify?purpose=verify${email}&next=${next}`} replace />
  )
}
