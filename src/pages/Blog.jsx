import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchBlogPosts } from '../lib/github.js'
import Footer from '../components/Footer.jsx'
import styles from './Blog.module.css'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogPosts()
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.hero}>
          <h1 className={styles.title}>Updates & Writing</h1>
          <p className={styles.desc}>What we're building, why we're building it, and what we're learning along the way.</p>
        </div>

        <div className={styles.posts}>
          {loading
            ? Array(3).fill(0).map((_, i) => <PostSkeleton key={i} />)
            : posts.map(post => (
                <Link key={post.slug} to={`/blog/${post.slug}`} className={styles.postCard}>
                  <div className={styles.postMeta}>
                    <span className={styles.postDate}>{formatDate(post.date)}</span>
                    <span className={styles.postTag}>{post.tag}</span>
                  </div>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <p className={styles.postSummary}>{post.summary}</p>
                  <span className={styles.readMore}>Read more →</span>
                </Link>
              ))
          }
        </div>
      </div>
      <Footer />
    </div>
  )
}

function PostSkeleton() {
  return (
    <div className={styles.postCard} style={{ cursor: 'default' }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <div className="skeleton" style={{ width: 80, height: 14 }} />
        <div className="skeleton" style={{ width: 52, height: 14, borderRadius: 99 }} />
      </div>
      <div className="skeleton" style={{ width: '60%', height: 22, marginBottom: 10 }} />
      <div className="skeleton" style={{ width: '90%', height: 14, marginBottom: 6 }} />
      <div className="skeleton" style={{ width: '70%', height: 14 }} />
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
