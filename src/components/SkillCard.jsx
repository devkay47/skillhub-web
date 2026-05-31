import { Link } from 'react-router-dom'
import VerifiedBadge from './VerifiedBadge.jsx'
import InstallCommand from './InstallCommand.jsx'
import styles from './SkillCard.module.css'

const CATEGORY_COLORS = {
  'coding-and-development': 'var(--cat-coding)',
  'document-processing': 'var(--cat-docs)',
  'data-analysis': 'var(--cat-data)',
  'api-integration': 'var(--cat-api)',
  'memory-and-context': 'var(--cat-memory)',
  'productivity-automation': 'var(--cat-productivity)',
}

const CATEGORY_LABELS = {
  'coding-and-development': 'Coding',
  'document-processing': 'Docs',
  'data-analysis': 'Data',
  'api-integration': 'API',
  'memory-and-context': 'Memory',
  'productivity-automation': 'Productivity',
}

export default function SkillCard({ skill }) {
  const color = CATEGORY_COLORS[skill.category] || 'var(--ink-muted)'
  const label = CATEGORY_LABELS[skill.category] || skill.category

  return (
    <Link to={`/skills/${skill.slug}`} className={styles.card}>
      <div className={styles.top}>
        <div className={styles.iconWrap} style={{ background: color + '18' }}>
          <SkillIcon category={skill.category} color={color} />
        </div>
        {skill.verified && <VerifiedBadge />}
      </div>

      <div className={styles.name}>{skill.name}</div>
      <div className={styles.desc}>{skill.description}</div>

      <div className={styles.footer}>
        <span className={styles.category} style={{ color, background: color + '14' }}>
          {label}
        </span>
        <div onClick={e => e.preventDefault()}>
          <InstallCommand skill={skill} compact />
        </div>
      </div>
    </Link>
  )
}

function SkillIcon({ category, color }) {
  const props = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

  switch (category) {
    case 'coding-and-development':
      return <svg {...props}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
    case 'document-processing':
      return <svg {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
    case 'data-analysis':
      return <svg {...props}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
    case 'api-integration':
      return <svg {...props}><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>
    case 'memory-and-context':
      return <svg {...props}><path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2"/><path d="M12 8v4l3 3"/></svg>
    case 'productivity-automation':
      return <svg {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
    default:
      return <svg {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
  }
}
