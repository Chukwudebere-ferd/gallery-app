import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useUser } from '../../context/userContext'
import FlameLoader from '../ui/FlameLoader'
import './RequireAuth.css'

export default function RequireAuth() {
  const { status } = useUser()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="require-auth">
        <FlameLoader size={88} label="Checking your campfire…" />
      </div>
    )
  }

  if (status === 'guest') {
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/auth?next=${next}`} replace />
  }

  return <Outlet />
}
