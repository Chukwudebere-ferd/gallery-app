import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/userContext'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Field from '../components/ui/Field'
import { ArrowLeftIcon, CameraIcon, CheckIcon, LogoutIcon } from '../components/ui/icons'
import './SettingsPage.css'

export default function SettingsPage() {
  const { user, updateUser, signOut } = useUser()
  const navigate = useNavigate()
  const [name, setName] = useState(user.name)
  const [username, setUsername] = useState(user.username)
  const [bio, setBio] = useState(user.bio)
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl)
  const [emailNotifications, setEmailNotifications] = useState(
    user.emailNotifications,
  )
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const nameInvalid = name.trim().length < 2

  const pickAvatar = (files: FileList | null) => {
    const next = files?.[0]
    if (!next) return
    setAvatarUrl(URL.createObjectURL(next))
  }

  const save = () => {
    if (nameInvalid) {
      setError(true)
      return
    }
    updateUser({
      name: name.trim(),
      username: username.trim() || user.username,
      bio: bio.trim(),
      avatarUrl,
      emailNotifications,
    })
    setError(false)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }

  return (
    <section className="settings">
      <div className="settings__back">
        <Link to="/profile" className="settings__back-btn" aria-label="Back to profile">
          <ArrowLeftIcon />
        </Link>
        <span>Profile settings</span>
      </div>

      <div className="settings__card">
        <div className="settings__avatar">
          <Avatar name={name.trim() || user.name} src={avatarUrl} size="lg" />
          <input
            ref={fileRef}
            className="sr-only"
            type="file"
            accept="image/*"
            aria-hidden
            tabIndex={-1}
            onChange={(e) => pickAvatar(e.target.files)}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fileRef.current?.click()}
          >
            <CameraIcon />
            Change photo
          </Button>
        </div>

        <div className="settings__fields">
          <Field
            label="Full name"
            type="text"
            placeholder="Maya Camper"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Field
            label="Username"
            type="text"
            placeholder="mayacamp"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            icon={<span className="settings__at">@</span>}
          />

          <div className="settings__field">
            <label className="field__label" htmlFor="settings-bio">
              Bio
            </label>
            <textarea
              id="settings-bio"
              className="settings__area"
              rows={4}
              placeholder="Tell people what you explore…"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="settings__row">
            <div className="settings__row-copy">
              <strong className="settings__row-title">Email notifications</strong>
              <span className="settings__row-desc">
                Get a note when someone likes or comments on your camp moments.
              </span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
              <span className="switch__track" aria-hidden>
                <span className="switch__thumb" />
              </span>
              <span className="sr-only">
                {emailNotifications ? 'Email notifications on' : 'Email notifications off'}
              </span>
            </label>
          </div>

          <p className="settings__hint">
            This preview mirrors what visitors see on your profile page.
          </p>
        </div>

        <div className="settings__actions">
          <Button
            variant="primary"
            className="settings__save"
            disabled={saved}
            onClick={save}
          >
            {saved ? (
              <>
                <CheckIcon />
                Saved
              </>
            ) : (
              'Save changes'
            )}
          </Button>
          {error && (
            <p className="settings__error" role="alert">
              Your name needs at least 2 characters.
            </p>
          )}
        </div>
      </div>

      <div className="settings__footer">
        <Link to="/privacy" className="settings__privacy">
          Privacy policy — why we need your info
        </Link>
        <Button
          variant="danger"
          size="sm"
          className="settings__logout"
          onClick={() => {
            signOut()
            navigate('/auth')
          }}
        >
          <LogoutIcon />
          Log out
        </Button>
      </div>
    </section>
  )
}