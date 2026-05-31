import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchAllSkills } from '../lib/github.js'
import SkillCard from '../components/SkillCard.jsx'
import SkillCardSkeleton from '../components/SkillCardSkeleton.jsx'
import Footer from '../components/Footer.jsx'
import styles from './Home.module.css'

const CATEGORIES = [
  { slug: 'coding-and-development', label: 'Coding & Development', icon: <CodeIcon />, color: 'var(--cat-coding)' },
  { slug: 'document-processing', label: 'Document Processing', icon: <DocIcon />, color: 'var(--cat-docs)' },
  { slug: 'data-analysis', label: 'Data Analysis', icon: <DataIcon />, color: 'var(--cat-data)' },
  { slug: 'api-integration', label: 'API Integration', icon: <ApiIcon />, color: 'var(--cat-api)' },
  { slug: 'memory-and-context', label: 'Memory & Context', icon: <MemoryIcon />, color: 'var(--cat-memory)' },
  { slug: 'productivity-automation', label: 'Productivity & Automation', icon: <BoltIcon />, color: 'var(--cat-productivity)' },
]

export default function Home() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchAllSkills()
      .then(setSkills)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) navigate(`/browse?q=${encodeURIComponent(query.trim())}`)
  }

  const featured = skills.filter(s => s.verified).slice(0, 4)
  const categoryCounts = CATEGORIES.map(c => ({
    ...c,
    count: skills.filter(s => s.category === c.slug).length,
  }))

  return (
    <div className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={`${styles.heroBadge} fade-up`}>
            <SparkleIcon />
            The App Store for AI Agent Skills
          </div>
          <h1 className={`${styles.heroTitle} fade-up fade-up-delay-1`}>
            Find skills that make your<br />
            agent <em className={styles.accent}>actually work.</em>
          </h1>
          <p className={`${styles.heroSub} fade-up fade-up-delay-2`}>
            The curated, model-agnostic marketplace for SKILL.md files.<br />
            Every skill reviewed. Every skill verified. Works on Claude Code, Cursor, Codex, OpenClaw.
          </p>
          <form className={`${styles.searchWrap} fade-up fade-up-delay-3`} onSubmit={handleSearch}>
            <SearchIcon />
            <input
              className={styles.searchInput}
              placeholder="Search skills — e.g. git commits, PDF, TypeScript..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button className={styles.searchBtn} type="submit">Search</button>
          </form>
          <div className={`${styles.stats} fade-up fade-up-delay-4`}>
            <div className={styles.stat}><strong>{loading ? '—' : skills.length}</strong> skills</div>
            <div className={styles.statDivider} />
            <div className={styles.stat}><strong>6</strong> categories</div>
            <div className={styles.statDivider} />
            <div className={styles.stat}><strong>5</strong> agents supported</div>
            <div className={styles.statDivider} />
            <div className={styles.stat}><strong>{loading ? '—' : skills.filter(s => s.verified).length}</strong> verified</div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Skills</h2>
            <Link to="/browse" className={styles.sectionLink}>View all →</Link>
          </div>
          {error && <div className={styles.error}>Could not load skills. <a href="https://github.com/devkay47/SkillHub" target="_blank" rel="noopener noreferrer">View on GitHub</a></div>}
          <div className={styles.cardsGrid}>
            {loading
              ? Array(4).fill(0).map((_, i) => <SkillCardSkeleton key={i} />)
              : featured.map(skill => <SkillCard key={skill.slug} skill={skill} />)
            }
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className={`${styles.section} ${styles.catSection}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Browse by Category</h2>
          </div>
          <div className={styles.catGrid}>
            {categoryCounts.map(cat => (
              <Link key={cat.slug} to={`/browse/${cat.slug}`} className={styles.catPanel}>
                <div className={styles.catIcon} style={{ background: cat.color + '18', color: cat.color }}>
                  {cat.icon}
                </div>
                <div>
                  <div className={styles.catName}>{cat.label}</div>
                  <div className={styles.catCount}>{loading ? '...' : cat.count} skill{cat.count !== 1 ? 's' : ''}</div>
                </div>
                <ArrowIcon className={styles.catArrow} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.howSection}>
        <div className="container">
          <h2 className={styles.howTitle}>How SkillHub works</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNum}>1</div>
              <h3 className={styles.stepTitle}>Browse & find</h3>
              <p className={styles.stepDesc}>Search or filter by category, agent compatibility, or verified status. Every skill has a full README and install command.</p>
            </div>
            <div className={styles.stepConnector} />
            <div className={styles.step}>
              <div className={styles.stepNum}>2</div>
              <h3 className={styles.stepTitle}>Copy & install</h3>
              <p className={styles.stepDesc}>One command drops the skill into your agent's skills folder. Works across Claude Code, Cursor, OpenClaw, Codex, and Gemini CLI.</p>
            </div>
            <div className={styles.stepConnector} />
            <div className={styles.step}>
              <div className={styles.stepNum}>3</div>
              <h3 className={styles.stepTitle}>Build & submit</h3>
              <p className={styles.stepDesc}>Made something useful? Open a PR. The community builds it, we curate it, everyone benefits. Free forever.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

// SVG Icons
function SparkleIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
}
function SearchIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color:'var(--ink-muted)',flexShrink:0}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
}
function CodeIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> }
function DocIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> }
function DataIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
function ApiIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg> }
function MemoryIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2"/><path d="M12 8v4l3 3"/></svg> }
function BoltIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> }
function ArrowIcon({ className }) { return <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg> }
