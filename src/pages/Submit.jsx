import Footer from '../components/Footer.jsx'
import styles from './Submit.module.css'

const CHECKLIST = [
  { icon: '🔑', title: 'No hardcoded credentials', desc: 'API keys, tokens, and passwords must use environment variables. Never hardcoded in any skill file.' },
  { icon: '🌐', title: 'All network requests disclosed', desc: 'If your skill makes any HTTP calls, list every domain in the metadata.json network_access field.' },
  { icon: '📂', title: 'File system access documented', desc: 'Any files the skill reads or writes must be listed explicitly. No silent file access.' },
  { icon: '👁️', title: 'No obfuscated scripts', desc: 'All code must be readable and human-auditable. Minified or encoded scripts are automatically rejected.' },
]

const STEPS = [
  { num: 1, title: 'Fork the repo', desc: 'Fork devkay47/SkillHub on GitHub.' },
  { num: 2, title: 'Create your skill folder', desc: 'Add a folder under skills/your-category/your-skill-name/.' },
  { num: 3, title: 'Add the 3 required files', desc: 'SKILL.md, README.md, and metadata.json — all required.' },
  { num: 4, title: 'Open a Pull Request', desc: 'Use the PR template. We review within 72 hours.' },
]

export default function Submit() {
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.hero}>
          <div className={styles.heroBadge}>Open Source</div>
          <h1 className={styles.heroTitle}>Submit a Skill</h1>
          <p className={styles.heroDesc}>
            Built something useful? Share it with the community. Every submission is reviewed before listing — quality and security are the whole point.
          </p>
        </div>

        {/* FILE STRUCTURE */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Required file structure</h2>
          <div className={styles.fileTree}>
            <div className={styles.treeLine}>
              <span className={styles.treeDir}>skills/</span>
            </div>
            <div className={styles.treeLine}>
              <span className={styles.treeIndent}>└── </span>
              <span className={styles.treeDir}>your-category/</span>
            </div>
            <div className={styles.treeLine}>
              <span className={styles.treeIndent2}>└── </span>
              <span className={styles.treeDir}>your-skill-name/</span>
            </div>
            {[
              ['SKILL.md', 'what the agent reads — trigger, capability, constraints'],
              ['README.md', 'human documentation + install guide'],
              ['metadata.json', 'registry data — name, description, tags, agents'],
            ].map(([file, comment], i, arr) => (
              <div key={file} className={styles.treeFileLine}>
                <span className={styles.treeIndent3}>{i < arr.length - 1 ? '├── ' : '└── '}</span>
                <span className={styles.treeFile}>{file}</span>
                <span className={styles.treeComment}> # {comment}</span>
              </div>
            ))}
          </div>
        </div>

        {/* METADATA EXAMPLE */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>metadata.json format</h2>
          <div className={styles.codeBlock}>
            <pre>{`{
  "name": "your-skill-name",
  "slug": "your-skill-name",
  "description": "One sentence describing what this skill does.",
  "category": "coding-and-development",
  "version": "1.0.0",
  "author": "your-github-username",
  "license": "MIT",
  "verified": false,
  "compatible_with": ["claude-code", "cursor"],
  "tags": ["tag1", "tag2"],
  "dependencies": [],
  "network_access": [],
  "file_access": []
}`}</pre>
          </div>
        </div>

        {/* CHECKLIST */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Security checklist — all 4 required</h2>
          <div className={styles.checklist}>
            {CHECKLIST.map(item => (
              <div key={item.title} className={styles.checkItem}>
                <div className={styles.checkIcon}>{item.icon}</div>
                <div>
                  <h3 className={styles.checkTitle}>{item.title}</h3>
                  <p className={styles.checkDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STEPS */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>How to submit</h2>
          <div className={styles.steps}>
            {STEPS.map(step => (
              <div key={step.num} className={styles.step}>
                <div className={styles.stepNum}>{step.num}</div>
                <div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <a
          href="https://github.com/devkay47/SkillHub/compare"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.prBtn}
        >
          <GitHubIcon />
          Open a Pull Request on GitHub
          <ArrowIcon />
        </a>
      </div>
      <Footer />
    </div>
  )
}

function GitHubIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
}
function ArrowIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
    }
