import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { presetTopics } from '../services/mockData'
import { TopicsContext } from './topicsContext'

const STORAGE_KEY = 'campfire.customTopics'

function normalize(list: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const item of list) {
    const clean = item.trim()
    const key = clean.toLowerCase()
    if (!clean || seen.has(key)) continue
    seen.add(key)
    out.push(clean.slice(0, 30))
  }
  return out
}

function readCustomTopics(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? normalize(parsed as string[]) : []
  } catch {
    return []
  }
}

export default function TopicsProvider({ children }: { children: ReactNode }) {
  const [customTopics, setCustomTopics] = useState<string[]>(readCustomTopics)

  const topics = useMemo(
    () => normalize([...presetTopics, ...customTopics]),
    [customTopics],
  )

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customTopics))
    } catch {
      /* storage unavailable */
    }
  }, [customTopics])

  const addTopic = (name: string) => {
    const clean = name.trim().slice(0, 30)
    if (!clean) return
    const exists = topics.some(
      (t) => t.toLowerCase() === clean.toLowerCase(),
    )
    if (exists) return
    setCustomTopics((prev) => [...prev, clean])
  }

  return (
    <TopicsContext.Provider value={{ topics, addTopic }}>
      {children}
    </TopicsContext.Provider>
  )
}