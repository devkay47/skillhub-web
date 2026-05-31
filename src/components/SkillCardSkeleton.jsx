import styles from './SkillCardSkeleton.module.css'

export default function SkillCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={`skeleton ${styles.icon}`} />
        <div className={`skeleton ${styles.badge}`} />
      </div>
      <div className={`skeleton ${styles.name}`} />
      <div className={`skeleton ${styles.desc}`} />
      <div className={`skeleton ${styles.desc2}`} />
      <div className={styles.footer}>
        <div className={`skeleton ${styles.cat}`} />
        <div className={`skeleton ${styles.btn}`} />
      </div>
    </div>
  )
}
