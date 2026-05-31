import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.desc}>This page doesn't exist. Maybe the skill you're looking for was moved or deleted.</p>
        <div className={styles.actions}>
          <Link to="/" className={styles.btnPrimary}>Go home</Link>
          <Link to="/browse" className={styles.btnSecondary}>Browse skills</Link>
        </div>
      </div>
    </div>
  )
}
