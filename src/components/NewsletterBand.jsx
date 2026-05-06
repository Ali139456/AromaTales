import React, { useCallback, useState, memo } from 'react'
import { CONTACT_EMAIL } from '../config/site'
import './NewsletterBand.css'

const NewsletterBand = memo(() => {
  const [note, setNote] = useState(null)

  const onSubmit = useCallback((e) => {
    e.preventDefault()
    const form = e.target
    const email = form.elements.email?.value?.trim()
    if (!email) return
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Newsletter signup')}&body=${encodeURIComponent(`Please add ${email} to the list.`)}`
    setNote('Opening your mail app to confirm…')
    form.reset()
  }, [])

  return (
    <section className="news-band" aria-labelledby="news-band-heading">
      <div className="news-band-card">
        <div className="news-band-media" aria-hidden="true" />
        <div className="news-band-overlay" />
        <div className="news-band-content">
          <h2 id="news-band-heading">Subscribe for atelier notes &amp; drops</h2>
          <form className="news-band-form" onSubmit={onSubmit}>
            <label className="news-band-sr-only" htmlFor="news-email">
              Email
            </label>
            <input
              id="news-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email address"
              required
            />
            <button type="submit" className="landing-btn">
              Sign up
            </button>
          </form>
          {note && <p className="news-band-note">{note}</p>}
        </div>
      </div>
    </section>
  )
})

NewsletterBand.displayName = 'NewsletterBand'

export default NewsletterBand
