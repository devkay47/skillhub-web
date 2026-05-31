const OWNER = import.meta.env.VITE_GITHUB_OWNER || 'devkay47'
const REPO = import.meta.env.VITE_GITHUB_REPO || 'SkillHub'
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN || ''

const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

function headers() {
  const h = { 'Accept': 'application/vnd.github+json' }
  if (TOKEN) h['Authorization'] = `Bearer ${TOKEN}`
  return h
}

function cacheGet(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(key); return null }
    return data
  } catch { return null }
}

function cacheSet(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })) } catch {}
}

async function githubFetch(url) {
  const res = await fetch(url, { headers: headers() })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`)
  return res.json()
}

// Fetch all skills by reading every metadata.json in skills/**/
export async function fetchAllSkills() {
  const cacheKey = `skillhub_all_skills`
  const cached = cacheGet(cacheKey)
  if (cached) return cached

  // Get the skills directory tree recursively
  const tree = await githubFetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/main?recursive=1`
  )

  // Find all metadata.json files
  const metaFiles = tree.tree.filter(
    f => f.type === 'blob' && f.path.startsWith('skills/') && f.path.endsWith('/metadata.json')
  )

  // Fetch each metadata.json in parallel
  const skills = await Promise.all(
    metaFiles.map(async (file) => {
      try {
        const raw = await githubFetch(
          `https://api.github.com/repos/${OWNER}/${REPO}/contents/${file.path}`
        )
        const decoded = JSON.parse(atob(raw.content.replace(/\n/g, '')))
        // Attach the path so we can build GitHub links
        decoded._path = file.path.replace('/metadata.json', '')
        return decoded
      } catch {
        return null
      }
    })
  )

  const result = skills.filter(Boolean)
  cacheSet(cacheKey, result)
  return result
}

// Fetch a single skill's metadata + README
export async function fetchSkill(slug) {
  const cacheKey = `skillhub_skill_${slug}`
  const cached = cacheGet(cacheKey)
  if (cached) return cached

  // Find the skill path from all skills
  const all = await fetchAllSkills()
  const meta = all.find(s => s.slug === slug || s.name === slug)
  if (!meta) throw new Error(`Skill not found: ${slug}`)

  // Fetch README
  let readme = ''
  try {
    const raw = await githubFetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${meta._path}/README.md`
    )
    readme = atob(raw.content.replace(/\n/g, ''))
  } catch {
    readme = '_No README found for this skill._'
  }

  const result = { ...meta, readme }
  cacheSet(cacheKey, result)
  return result
}

// Fetch blog posts from a /blog folder in the repo (optional)
export async function fetchBlogPosts() {
  const cacheKey = `skillhub_blog`
  const cached = cacheGet(cacheKey)
  if (cached) return cached

  try {
    const files = await githubFetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/blog`
    )
    const posts = await Promise.all(
      files
        .filter(f => f.name.endsWith('.md'))
        .map(async (f) => {
          const raw = await githubFetch(f.url)
          const content = atob(raw.content.replace(/\n/g, ''))
          // Parse frontmatter: ---\ntitle: ...\ndate: ...\nsummary: ...\n---
          const fm = {}
          const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
          if (fmMatch) {
            fmMatch[1].split('\n').forEach(line => {
              const [k, ...v] = line.split(': ')
              if (k) fm[k.trim()] = v.join(': ').trim()
            })
          }
          return {
            slug: f.name.replace('.md', ''),
            title: fm.title || f.name,
            date: fm.date || '',
            summary: fm.summary || '',
            tag: fm.tag || 'update',
            content,
          }
        })
    )
    const sorted = posts.sort((a, b) => new Date(b.date) - new Date(a.date))
    cacheSet(cacheKey, sorted)
    return sorted
  } catch {
    // Return hardcoded seed posts if no blog folder exists yet
    return SEED_POSTS
  }
}

// Seed blog posts — shown until real posts exist in the repo
const SEED_POSTS = [
  {
    slug: 'why-we-built-skillhub',
    title: 'Why we built SkillHub',
    date: '2026-05-31',
    tag: 'launch',
    summary: '800,000 unreviewed skills on one site. 169,000 ecosystem-locked on another. We built the one that neither of them is.',
    content: `---
title: Why we built SkillHub
date: 2026-05-31
tag: launch
summary: 800,000 unreviewed skills on one site. 169,000 ecosystem-locked on another. We built the one that neither of them is.
---

# Why we built SkillHub

The SKILL.md format is quietly becoming the standard way to extend AI coding agents. Drop a file in the right folder and your agent immediately knows how to do that task — properly, consistently, every time.

The problem is finding quality skills. The existing options are broken in different ways:

- **SkillsMP** has 800,000+ skills scraped from GitHub with zero review. Finding something good is luck.
- **LobeHub** is polished but locked to its own ecosystem.
- **Skills.sh** has great DX but no quality signal.

SkillHub is the curated version. Every skill is reviewed before listing. Every skill works across Claude Code, Cursor, Codex CLI, OpenClaw, and Gemini CLI. Every skill passes a security checklist.

We believe the internet needs one place where you can find an AI agent skill and trust that it works, it's safe, and it does what it says.

That's SkillHub.
`,
  },
  {
    slug: 'how-skill-md-works',
    title: 'How the SKILL.md standard works',
    date: '2026-05-31',
    tag: 'guide',
    summary: 'A SKILL.md file is three things at once: a routing instruction, a capability definition, and a trigger condition.',
    content: `---
title: How the SKILL.md standard works
date: 2026-05-31
tag: guide
summary: A SKILL.md file is three things at once: a routing instruction, a capability definition, and a trigger condition.
---

# How the SKILL.md standard works

A SKILL.md file teaches your AI agent to do a specific task — properly, consistently, and with the right tools.

## The three parts of every skill

**1. The trigger** — keywords or phrases that activate the skill. When you say "commit my changes", the git-commit-formatter skill activates.

**2. The capability definition** — exactly what the skill does, what tools it uses, what the output looks like.

**3. The constraints** — what the skill should never do. This is what separates good skills from dangerous ones.

## Where to put the file

\`\`\`
# Claude Code
.claude/skills/your-skill/SKILL.md

# Cursor
.cursor/skills/your-skill/SKILL.md

# Global (all agents)
~/.claude/skills/your-skill/SKILL.md
\`\`\`

## The three-file standard

Every SkillHub skill has exactly three files:

- **SKILL.md** — what the agent reads
- **README.md** — what humans read
- **metadata.json** — what the website reads

This separation means the agent instruction stays clean, the documentation stays human-readable, and the registry stays queryable.
`,
  },
]
