import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { fetchBlogPosts } from '../lib/github.js'
import Footer from '../components/Footer.jsx'
import styles from './BlogPost.module.css'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogPosts().then(posts => {
      const found = posts.find(p => p.slug === slug)
      setPost(found || null)
      setLoading(false)
    })
  }, [slug])

  if (loading) return (
    <div className={styles.page}>
      <div className="container" style={{ padding: '60px var(--page-padding)' }}>
        <div className="skeleton" style={{ width: 200, height: 14, marginBottom: 40 }} />
        <div className="skeleton" style={{ width: '70%', height: 44, marginBottom: 20 }} />
        <div className="skeleton" style={{ width: '100%', height: 400, borderRadius: 14 }} />
      </div>
    </div>
  )

  if (!post) return (
    <div className={styles.page}>
      <div className="container" style={{ padding: '80px var(--page-padding)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>Post not found</h2>
        <Link to="/blog" style={{ color: 'var(--amber)', fontWeight: 500 }}>← Back to Blog</Link>
      </div>
    </div>
  )

  // Strip frontmatter from content before rendering
  const body = post.content.replace(/^---[\s\S]*?---\n/, '')

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.inner}>
          <Link to="/blog" className={styles.back}>← Back to Blog</Link>
          <div className={styles.meta}>
            <span className={styles.date}>{formatDate(post.date)}</span>
            <span className={styles.tag}>{post.tag}</span>
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.summary}>{post.summary}</p>
          <div className={styles.markdown}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
