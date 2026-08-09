import { createContext, useContext } from 'react'

export interface TopicsValue {
  topics: string[]
  addTopic: (name: string) => void
}

export const TopicsContext = createContext<TopicsValue | null>(null)

export function useTopics(): TopicsValue {
  const ctx = useContext(TopicsContext)
  if (!ctx) {
    throw new Error('useTopics must be used within <TopicsProvider>')
  }
  return ctx
}