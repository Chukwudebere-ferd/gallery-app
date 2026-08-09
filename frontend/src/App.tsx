import { useState } from 'react'
import AppHeader from './components/layout/AppHeader'
import BottomNav from './components/layout/BottomNav'
import HomePage from './pages/HomePage'

function App() {
  const [query, setQuery] = useState('')

  return (
    <div className="app">
      <AppHeader query={query} onQueryChange={setQuery} />
      <main className="app__main">
        <HomePage query={query} />
      </main>
      <BottomNav />
    </div>
  )
}

export default App