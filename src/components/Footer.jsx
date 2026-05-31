import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoDot} />
            SkillHub
          </Link>
          <p className={styles.tagline}>The curated, model-agnostic marketplace<br />for AI agent skills.</p>
        </div>
        <div className={styles.links}>
          <div className={styles.col}>
            <div className={styles.colTitle}>Product</div>
            <Link to="/browse" className={styles.link}>Browse Skills</Link>
            <Link to="/submit" className={styles.link}>Submit a Skill</Link>
            <Link to="/blog" className={styles.link}>Blog</Link>
          </div>
          <div className={styles.col}>
            <div className={styles.colTitle}>Open Source</div>
            <a href="https://github.com/devkay47/SkillHub" target="_blank" rel="noopener noreferrer" className={styles.link}>GitHub Repo</a>
            <a href="https://github.com/devkay47/SkillHub/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className={styles.link}>Contributing</a>
            <a href="https://github.com/devkay47/SkillHub/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className={styles.link}>MIT License</a>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <span className={styles.copy}>© 2026 SkillHub — devkay47/SkillHub</span>
        <span className={styles.copy}>MIT License — Free forever</span>
      </div>
    </footer>
  )
}
