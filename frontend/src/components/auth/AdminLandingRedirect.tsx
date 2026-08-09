import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '../../context/userContext'

export default function AdminLandingRedirect() {
  const { status, role } = useUser()
  const location = useLocation()
  const navigate = useNavigate()
  const prevRole = useRef(role)

  useEffect(() => {
    const becameAdmin = prevRole.current !== 'admin' && role === 'admin'
    prevRole.current = role

    if (status !== 'authed' || !becameAdmin) return
    if (location.pathname !== '/' && location.pathname !== '/auth') return

    const hasNext = new URLSearchParams(location.search).get('next')
    if (location.pathname === '/auth' && hasNext) return

    navigate('/admin', { replace: true })
  }, [status, role, location.pathname, location.search, navigate])

  return null
}
