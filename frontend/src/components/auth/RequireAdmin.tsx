import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useUser } from '../../context/userContext'
import FlameLoader from '../ui/FlameLoader'
import './RequireAdmin.css'

export default function RequireAdmin() {
  const { status, role } = useUser()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="require-admin">
        <FlameLoader size={88} label="Checking your campfire…" />
      </div>
    )
  }

  if (status === 'guest') {
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/auth?next=${next}`} replace />
  }

  if (role === null) {
    return (
      <div className="require-admin">
        <FlameLoader size={88} label="Checking your campfire…" />
      </div>
    )
  }

  if (role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
