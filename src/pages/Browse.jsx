import { useState, useEffect, useMemo } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { fetchAllSkills } from '../lib/github.js'
import SkillCard from '../components/SkillCard.jsx'
import SkillCardSkeleton from '../components/SkillCardSkeleton.jsx'
import Footer from '../components/Footer.jsx'
import styles from './Browse.module.css'

const CATEGORIES = [
  { slug: 'all', label: 'All Skills', color: 'var(--amber)' },
  { slug: 'coding-and-development', label: 'Coding & Dev', color: 'var(--cat-coding)' },
  { slug: 'document-processing', label: 'Document Processing', color: 'var(--cat-docs)' },
  { slug: 'data-analysis', label: 'Data Analysis', color: 'var(--cat-data)' },
  { slug: 'api-integration', label: 'API Integration', color: 'var(--cat-api)' },
  { slug: 'memory-and-context', label: 'Memory & Context', color: 'var(--cat-memory)' },
  { slug: 'productivity-automation', label: 'Productivity', color: 'var(--cat-productivity)' },
]

const AGENTS = ['claude-code', 'cursor', 'openclaw', 'codex', 'gemini']
const AGENT_LABELS = { 'claude-code': 'Claude Code', cursor: 'Cursor', openclaw: 'OpenClaw', codex: 'Codex CLI', gemini: 'Gemini CLI' }

export default function Browse() {
  const { category: catParam } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [activeCategory, setActiveCategory] = useState(catParam || 'all')
  const [activeAgents, setActiveAgents] = useState([])
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    fetchAllSkills()
      .then(setSkills)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  function toggleAgent(a) {
    setActiveAgents(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])
  }

  const filtered = useMemo(() => {
    let result = [...skills]
    if (activeCategory !== 'all') result = result.filter(s => s.category === activeCategory)
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(s =>
        s.name?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.tags?.some(t => t.toLowerCase().includes(q))
      )
    }
    if (verifiedOnly) result = result.filter(s => s.verified)
    if (activeAgents.length) result = result.filter(s => activeAgents.every(a => s.compatible_with?.includes(a)))
    if (sort === 'az') result.sort((a, b) => a.name?.localeCompare(b.name))
    return result
  }, [skills, activeCategory, query, verifiedOnly, activeAgents, sort])

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sideSection}>
            <div className={styles.sideLabel}>Category</div>
            {CATEGORIES.map(cat => (
              <button
                key={cat.slug}
                className={`${styles.filterBtn} ${activeCategory === cat.slug ? styles.filterActive : ''}`}
                onClick={() => setActiveCategory(cat.slug)}
              >
                <span className={styles.filterDot} style={{ background: cat.color }} />
                {cat.label}
                <span className={styles.filterCount}>
                  {cat.slug === 'all' ? skills.length : skills.filter(s => s.category === cat.slug).length}
                </span>
              </button>
            ))}
          </div>

          <div className={styles.sideSection}>
            <div className={styles.sideLabel}>Agent</div>
            {AGENTS.map(a => (
              <button
                key={a}
                className={`${styles.filterBtn} ${activeAgents.includes(a) ? styles.filterActive : ''}`}
                onClick={() => toggleAgent(a)}
              >
                <span className={`${styles.filterCheck} ${activeAgents.includes(a) ? styles.filterCheckOn : ''}`}>
                  {activeAgents.includes(a) && <CheckIcon />}
                </span>
                {AGENT_LABELS[a]}
              </button>
            ))}
          </div>

          <div className={styles.sideSection}>
            <div className={styles.sideLabel}>Quality</div>
            <button
              className={`${styles.verifiedToggle} ${verifiedOnly ? styles.verifiedOn : ''}`}
              onClick={() => setVerifiedOnly(v => !v)}
            >
              <span className={styles.verifiedLabel}>✓ Verified only</span>
              <span className={`${styles.togglePill} ${verifiedOnly ? styles.toggleOn : ''}`} />
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className={styles.main}>
          <div className={styles.topBar}>
            <div className={styles.searchWrap}>
              <SearchIcon />
              <input
                className={styles.searchInput}
                placeholder="Search skills..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              {query && <button className={styles.clearBtn} onClick={() => setQuery('')}>✕</button>}
            </div>
            <select className={styles.sortSelect} value={sort} onChange={e => setSort(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="az">A → Z</option>
            </select>
          </div>

          <div className={styles.resultsCount}>
            {loading ? 'Loading skills...' : `Showing ${filtered.length} skill${filtered.length !== 1 ? 's' : ''}`}
          </div>

          {error && <div className={styles.error}>Failed to load skills from GitHub. <a href="https://github.com/devkay47/SkillHub" target="_blank" rel="noopener noreferrer">View repo directly</a></div>}

          <div className={styles.grid}>
            {loading
              ? Array(9).fill(0).map((_, i) => <SkillCardSkeleton key={i} />)
              : filtered.length === 0
                ? <div className={styles.empty}>
                    <EmptyIcon />
                    <p>No skills match your filters.</p>
                    <button onClick={() => { setQuery(''); setActiveCategory('all'); setActiveAgents([]); setVerifiedOnly(false) }}>
                      Clear filters
                    </button>
                  </div>
                : filtered.map(skill => <SkillCard key={skill.slug} skill={skill} />)
            }
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

function SearchIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color:'var(--ink-muted)',flexShrink:0}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
}
function CheckIcon() {
  return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
}
function EmptyIcon() {
  return <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color:'var(--border-strong)',marginBottom:12}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                                          }
