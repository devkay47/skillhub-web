import { useState } from 'react'
import styles from './InstallCommand.module.css'

const AGENTS = {
  'claude-code': { label: 'Claude Code', path: '.claude/skills' },
  'cursor': { label: 'Cursor', path: '.cursor/skills' },
  'openclaw': { label: 'OpenClaw', path: '.openclaw/skills' },
  'codex': { label: 'Codex CLI', path: '.codex/skills' },
  'gemini': { label: 'Gemini CLI', path: '.gemini/skills' },
}

export default function InstallCommand({ skill, compact = false }) {
  const [copied, setCopied] = useState(false)
  const [activeAgent, setActiveAgent] = useState(
    skill?.compatible_with?.[0] || 'claude-code'
  )

  const agentPath = AGENTS[activeAgent]?.path || '.claude/skills'
  const skillPath = skill?._path || `skills/${skill?.category}/${skill?.slug}`
  const command = `cp -r ${skillPath} ${agentPath}/`

  function copy() {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  if (compact) {
    return (
      <button className={styles.compactBtn} onClick={copy} title={`Copy: ${command}`}>
        {copied ? <CheckIcon /> : <CopyIcon />}
        <span>{copied ? 'Copied!' : 'Copy install'}</span>
      </button>
    )
  }

  const agents = skill?.compatible_with || ['claude-code']

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs}>
        {agents.map(a => (
          <button
            key={a}
            className={`${styles.tab} ${activeAgent === a ? styles.activeTab : ''}`}
            onClick={() => setActiveAgent(a)}
          >
            {AGENTS[a]?.label || a}
          </button>
        ))}
      </div>
      <div className={styles.box}>
        <code className={styles.code}>{command}</code>
        <button className={`${styles.copyBtn} ${copied ? styles.copied : ''}`} onClick={copy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}
