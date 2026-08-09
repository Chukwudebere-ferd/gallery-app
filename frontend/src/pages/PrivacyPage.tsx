import { Link } from 'react-router-dom'
import { LogoMark, ShieldCheckIcon, ArrowLeftIcon } from '../components/ui/icons'
import './PrivacyPage.css'

export default function PrivacyPage() {
  return (
    <div className="privacy">
      <main className="privacy__card">
        <header className="privacy__head">
          <Link to="/" className="privacy__back" aria-label="Back to home">
            <ArrowLeftIcon />
          </Link>
          <LogoMark className="privacy__mark" />
          <h1>Privacy policy</h1>
          <p className="privacy__sub">Why Campfire needs your information.</p>
        </header>

        <div className="privacy__body">
          <section className="privacy__section">
            <h2>What we collect and why</h2>
            <p>
              We only ask for what the community genuinely needs. Nothing is
              collected to resell, and nothing is shared with advertisers.
            </p>

            <ul className="privacy__list">
              <li>
                <strong>Email —</strong> so you can sign in, recover your
                account, and get notified when someone likes or comments on
                your camp moments.
              </li>
              <li>
                <strong>Photos &amp; videos —</strong> the whole point of the
                gallery. They are stored in full quality and shown only to
                members you post them for.
              </li>
              <li>
                <strong>Profile details —</strong> your name, bio and avatar
                help your crew find you and know who shared a memory.
              </li>
              <li>
                <strong>Device info —</strong> basic usage data (app version,
                load times) keeps the fire burning reliably. Never sold, never
                individualised in a way you can be identified.
              </li>
            </ul>
          </section>

          <section className="privacy__section">
            <h2>Your control</h2>
            <p>
              You own your moments. You can edit or delete your posts, change
              your profile, export your data, or ask us to erase everything at
              any time —{' '}
              <a href="mailto:privacy@campfire.app">privacy@campfire.app</a>.
            </p>
          </section>

          <section className="privacy__section">
            <h2>Consent</h2>
            <p>
              By creating an account you agree to this policy. We don't use
              dark patterns — a checkbox means we actually need your OK before
              we proceed, and you can change your mind by writing to us above.
            </p>
          </section>

          <p className="privacy__foot">
            <ShieldCheckIcon />
            Updated whenever the camp rules change — we'll always tell you first.
          </p>
        </div>
      </main>
    </div>
  )
}