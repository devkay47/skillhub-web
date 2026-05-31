import styles from './VerifiedBadge.module.css'

export default function VerifiedBadge({ size = 'sm' }) {
  return (
    <div className={`${styles.badge} ${styles[size]}`} title="Reviewed and verified by SkillHub maintainers">
      <CheckIcon />
      <span>VERIFIED</span>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 6 5 9 10 3"/>
    </svg>
  )
}
