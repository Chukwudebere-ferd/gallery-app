import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AppHeader from './AppHeader'
import BottomNav from './BottomNav'

export interface ShellContext {
  query: string
  setQuery: (query: string) => void
}

export default function AppShell() {
  const [query, setQuery] = useState('')
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="app">
      <AppHeader query={query} onQueryChange={setQuery} />
      <main className="app__main">
        <Outlet context={{ query, setQuery } satisfies ShellContext} />
      </main>
      <BottomNav />
    </div>
  )
}