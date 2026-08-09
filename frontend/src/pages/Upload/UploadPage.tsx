import { useEffect, useRef, useState } from 'react'
import type { DragEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import ChipRow from '../../components/feed/ChipRow'
import Field from '../../components/ui/Field'
import { useTopics } from '../../context/topicsContext'
import {
  CameraIcon,
  UploadIcon,
  CheckIcon,
  CloseIcon,
  PlayIcon,
  PlusIcon,
} from '../../components/ui/icons'
import './UploadPage.css'

type Phase = 'idle' | 'ready' | 'uploading' | 'done'

interface PickedFile {
  name: string
  size: number
  type: 'photo' | 'video'
  url: string
}

const HD_THRESHOLD = 200 * 1024 * 1024

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export default function UploadPage() {
  const navigate = useNavigate()
  const { topics, addTopic } = useTopics()
  const inputRef = useRef<HTMLInputElement>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<PickedFile | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategoryState] = useState<string>(topics[0] ?? '')
  const [creatingTopic, setCreatingTopic] = useState(false)
  const [customTopic, setCustomTopic] = useState('')
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<number | null>(null)

  const createTopic = () => {
    const name = customTopic.trim().replace(/[<>]/g, '').slice(0, 30)
    if (!name) return
    addTopic(name)
    setCategoryState(name)
    setCreatingTopic(false)
    setCustomTopic('')
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      if (file?.url.startsWith('blob:')) URL.revokeObjectURL(file.url)
    }
  }, [file])

  const pickFile = (files: FileList | null) => {
    const next = files?.[0]
    if (!next) return
    const kind: 'photo' | 'video' = next.type.startsWith('video')
      ? 'video'
      : 'photo'
    setFile({
      name: next.name,
      size: next.size,
      type: kind,
      url: URL.createObjectURL(next),
    })
    setPhase('ready')
    setProgress(0)
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    pickFile(e.dataTransfer.files)
  }

  const startUpload = () => {
    setPhase('uploading')
    setProgress(0)
    timerRef.current = window.setInterval(() => {
      setProgress((p) => {
        const next = p + Math.floor(Math.random() * 18) + 8
        if (next >= 100) {
          if (timerRef.current) {
            window.clearInterval(timerRef.current)
            timerRef.current = null
          }
          window.setTimeout(() => setPhase('done'), 300)
          return 100
        }
        return next
      })
    }, 240)
  }

  const dropZoneClass = [
    'upload__zone',
    dragging ? 'upload__zone--dragging' : '',
    phase === 'ready' ? 'upload__zone--filled' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section className="upload">
      {phase === 'done' ? (
        <div className="upload__success" role="status">
          <span className="upload__success-icon">
            <CheckIcon />
          </span>
          <h2>Uploaded in HD</h2>
          <p>
            {file?.name} is being synced to your camp gallery. It will appear
            on the feed in a moment.
          </p>
          <div className="upload__success-actions">
            <Button variant="primary" onClick={() => void navigate('/')}>
              Back to feed
            </Button>
            <Button variant="ghost" onClick={() => void navigate('/upload')}>
              Upload another
            </Button>
          </div>
        </div>
      ) : (
        <div className="upload__grid">
          <div className="upload__main">
            <h1 className="upload__heading">Share a camp memory</h1>

            <input
              ref={inputRef}
              className="sr-only"
              type="file"
              accept="image/*,video/*"
              aria-hidden
              tabIndex={-1}
              onChange={(e) => pickFile(e.target.files)}
            />

            {!file ? (
              <button
                type="button"
                className={dropZoneClass}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
              >
                <span className="upload__zone-icon">
                  <CameraIcon />
                </span>
                <strong>Drag photos & videos here</strong>
                <span className="upload__zone-hint">
                  or click to browse — HD quality is kept in full resolution
                </span>
                <span className="upload__zone-note">Photos or videos, up to 2 GB</span>
              </button>
            ) : (
              <button
                type="button"
                className={dropZoneClass}
                onClick={() => inputRef.current?.click()}
              >
                <div className="upload__preview">
                  {file.type === 'video' ? (
                    <>
                      <video src={file.url} muted playsInline />
                      <span className="upload__preview-badge">
                        <PlayIcon />
                      </span>
                    </>
                  ) : (
                    <img src={file.url} alt="Selected photo preview" />
                  )}
                  <div className="upload__preview-overlay">
                    <strong>{file.name}</strong>
                    <span>
                      {formatBytes(file.size)} · {file.type === 'video' ? 'video' : 'photo'}
                    </span>
                  </div>
                </div>

                {file.size >= HD_THRESHOLD && (
                  <span className="upload__hd-badge">HD</span>
                )}
              </button>
            )}

            <p className="upload__hint">
              {file
                ? phase === 'uploading'
                  ? 'Uploading at max quality…'
                  : 'Preview looks good — now add the details.'
                : 'No silent downgrades. Your memories stay crisp.'}
            </p>
          </div>

          <aside className="upload__panel">
            <Field
              label="Title"
              type="text"
              placeholder="Sunrise over base camp"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="upload__field">
              <label className="field__label" htmlFor="upload-desc">
                Description
              </label>
              <textarea
                id="upload-desc"
                className="upload__area"
                rows={3}
                placeholder="Tell the story behind this moment…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="upload__field">
              <span className="field__label">Topic</span>
              <div className="upload__topics">
                <ChipRow chips={topics} active={category} onSelect={setCategoryState} />
                {!creatingTopic ? (
                  <button
                    type="button"
                    className="upload__new-topic"
                    onClick={() => setCreatingTopic(true)}
                  >
                    <PlusIcon />
                    New topic
                  </button>
                ) : (
                  <div className="upload__topic-create">
                    <input
                      autoFocus
                      className="upload__topic-input"
                      type="text"
                      placeholder="e.g. Kayaking"
                      maxLength={30}
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          createTopic()
                        }
                      }}
                      aria-label="New topic name"
                    />
                    <button
                      type="button"
                      className="upload__topic-action"
                      onClick={createTopic}
                      disabled={customTopic.trim().length === 0}
                      aria-label="Add topic"
                    >
                      <CheckIcon />
                    </button>
                    <button
                      type="button"
                      className="upload__topic-action upload__topic-action--cancel"
                      onClick={() => {
                        setCreatingTopic(false)
                        setCustomTopic('')
                      }}
                      aria-label="Cancel new topic"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {phase === 'uploading' ? (
              <div
                className="upload__progress"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
                aria-label="Upload progress"
              >
                <div className="upload__progress-head">
                  <span>Uploading…</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="upload__progress-track">
                  <div
                    className="upload__progress-bar"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : null}

            <div className="upload__publish">
              <Button
                variant="primary"
                size="md"
                className="upload__publish-btn"
                onClick={startUpload}
                disabled={phase !== 'ready' || title.trim().length < 3}
              >
                <UploadIcon />
                Publish
              </Button>
              <p className="upload__publish-note">
                Everyone in your camp can see and sync this instantly.
              </p>
            </div>
          </aside>
        </div>
      )}
    </section>
  )
}