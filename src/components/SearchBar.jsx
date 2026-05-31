import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './SearchBar.module.css'

export default function SearchBar({ placeholder = 'Search skills...', autoFocus = false }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (query.trim()) navigate(`/browse?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <form className={styles.wrap} onSubmit={handleSubmit}>
      <SearchIcon />
      <input
        className={styles.input}
        placeholder={placeholder}
        value={query}
        onChange={e => setQuery(e.target.value)}
        autoFocus={autoFocus}
      />
      {query && (
        <button type="button" className={styles.clear} onClick={() => setQuery('')}>✕</button>
      )}
      <button type="submit" className={styles.btn}>Search</button>
    </form>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--ink-muted)', flexShrink: 0 }}>
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}
