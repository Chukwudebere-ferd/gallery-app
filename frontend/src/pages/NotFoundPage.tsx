import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { LogoMark, ArrowLeftIcon } from '../components/ui/icons'
import './NotFoundPage.css'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="nf">
      <LogoMark className="nf__mark" />
      <h1>Lost in the woods</h1>
      <p>
        We couldn’t find that page. It may have moved or never existed — let’s
        get you back to the trail.
      </p>
      <div className="nf__actions">
        <Button variant="secondary" onClick={() => void navigate(-1)}>
          <ArrowLeftIcon />
          Go back
        </Button>
        <Link to="/" className="btn btn--primary btn--md">
          Head home
        </Link>
      </div>
    </div>
  )
}