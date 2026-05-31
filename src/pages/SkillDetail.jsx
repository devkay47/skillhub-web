import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { fetchSkill } from '../lib/github.js'
import VerifiedBadge from '../components/VerifiedBadge.jsx'
import InstallCommand from '../components/InstallCommand.jsx'
import Footer from '../components/Footer.jsx'
import styles from './SkillDetail.module.css'

const CATEGORY_LABELS = {
  'coding-and-development': 'Coding & Development',
  'document-processing': 'Document Processing',
  'data-analysis': 'Data Analysis',
  'api-integration': 'API Integration',
  'memory-and-context': 'Memory & Context',
  'productivity-automation': 'Productivity & Automation',
}

export default function SkillDetail() {
  const { slug } = useParams()
  const [skill, setSkill] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchSkill(slug)
      .then(setSkill)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorState message={error} slug={slug} />

  const githubUrl = `https://github.com/devkay47/SkillHub/tree/main/${skill._path}`
  const catLabel = CATEGORY_LABELS[skill.category] || skill.category

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.breadcrumb}>
          <Link to="/browse">Browse</Link>
          <span>/</span>
          <Link to={`/browse/${skill.category}`}>{catLabel}</Link>
          <span>/</span>
          <span className={styles.breadcrumbCurrent}>{skill.name}</span>
        </div>

        <div className={styles.layout}>
          {/* MAIN */}
          <div className={styles.main}>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{skill.name}</h1>
              {skill.verified && <VerifiedBadge size="md" />}
            </div>
            <p className={styles.desc}>{skill.description}</p>

            <div className={styles.installSection}>
              <h2 className={styles.subTitle}>Install</h2>
              <InstallCommand skill={skill} />
            </div>

            <div className={styles.readmeSection}>
              <h2 className={styles.subTitle}>README</h2>
              <div className={styles.markdown}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {skill.readme}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className={styles.sidebar}>
            <div className={styles.sideCard}>
              <div className={styles.sideCardTitle}>Details</div>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Author</span>
                <span className={styles.metaVal}>{skill.author || 'devkay47'}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Version</span>
                <span className={styles.metaVal}>{skill.version || '1.0.0'}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Category</span>
                <span className={styles.metaVal}>{catLabel}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Verified</span>
                <span className={styles.metaVal} style={{ color: skill.verified ? 'var(--amber)' : 'var(--ink-muted)' }}>
                  {skill.verified ? '✓ Yes' : 'Pending'}
                </span>
              </div>
              {skill.license && (
                <div className={styles.metaRow}>
                  <span className={styles.metaKey}>License</span>
                  <span className={styles.metaVal}>{skill.license}</span>
                </div>
              )}
            </div>

            {skill.compatible_with?.length > 0 && (
              <div className={styles.sideCard}>
                <div className={styles.sideCardTitle}>Compatible Agents</div>
                <div className={styles.chips}>
                  {skill.compatible_with.map(a => (
                    <span key={a} className={styles.agentChip}>{a}</span>
                  ))}
                </div>
              </div>
            )}

            {skill.tags?.length > 0 && (
              <div className={styles.sideCard}>
                <div className={styles.sideCardTitle}>Tags</div>
                <div className={styles.chips}>
                  {skill.tags.map(t => (
                    <span key={t} className={styles.tagChip}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            {skill.dependencies?.length > 0 && (
              <div className={styles.sideCard}>
                <div className={styles.sideCardTitle}>Dependencies</div>
                <div className={styles.chips}>
                  {skill.dependencies.map(d => (
                    <span key={d} className={styles.depChip}>{d}</span>
                  ))}
                </div>
              </div>
            )}

            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={styles.githubBtn}>
              <GitHubIcon />
              View on GitHub
            </a>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className={styles.page}>
      <div className="container" style={{ padding: '40px var(--page-padding)' }}>
        <div className={`skeleton ${styles.skelBreadcrumb}`} />
        <div className={styles.layout}>
          <div>
            <div className={`skeleton ${styles.skelTitle}`} />
            <div className={`skeleton ${styles.skelDesc}`} />
            <div className={`skeleton ${styles.skelBlock}`} />
          </div>
          <div>
            <div className={`skeleton ${styles.skelSide}`} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ErrorState({ message, slug }) {
  return (
    <div className={styles.page}>
      <div className="container" style={{ padding: '80px var(--page-padding)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>Skill not found</h2>
        <p style={{ color: 'var(--ink-muted)', marginBottom: 24 }}>{message}</p>
        <Link to="/browse" style={{ color: 'var(--amber)', fontWeight: 500 }}>← Back to Browse</Link>
      </div>
    </div>
  )
}

function GitHubIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  }
