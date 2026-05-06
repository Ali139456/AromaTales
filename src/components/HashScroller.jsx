import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const HashScroller = () => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      const tryScroll = () => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return true
        }
        return false
      }
      if (!tryScroll()) {
        const timer = setTimeout(tryScroll, 120)
        return () => clearTimeout(timer)
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
    }
  }, [pathname, hash])

  return null
}

export default HashScroller
