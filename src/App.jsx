import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Home from './pages/Home.jsx'
import Browse from './pages/Browse.jsx'
import SkillDetail from './pages/SkillDetail.jsx'
import Submit from './pages/Submit.jsx'
import Blog from './pages/Blog.jsx'
import BlogPost from './pages/BlogPost.jsx'
import NotFound from './pages/NotFound.jsx'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <div key={location.pathname} className="fade-up">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/browse/:category" element={<Browse />} />
        <Route path="/skills/:slug" element={<SkillDetail />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <BackToTop />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
