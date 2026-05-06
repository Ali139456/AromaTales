import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { CONTACT_EMAIL } from '../config/site'
import './Footer.css'

const Footer = () => {
  const year = new Date().getFullYear()
  const [newsletterNote, setNewsletterNote] = useState(null)

  const onNewsletterSubmit = useCallback((e) => {
    e.preventDefault()
    const form = e.target
    const email = form.elements.email?.value?.trim()
    if (!email) return
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Join the atelier — newsletter')}&body=${encodeURIComponent(`Please add this email to your list: ${email}`)}`
    setNewsletterNote('Thanks — your mail app should open to send the request.')
    form.reset()
  }, [])

  return (
    <footer id="footer" className="footer-muse">
      <div className="footer-watermark" aria-hidden="true">
        <span className="footer-watermark-aroma">AROMA</span>
        <span className="footer-watermark-tales">tales</span>
      </div>

      <div className="footer-muse-inner">
        <div className="footer-muse-top">
          <div className="footer-muse-brand">
            <Link to="/" className="footer-muse-logo">
              <img
                src="/assets/images/logo/aromalogo_Black.png"
                alt="Aroma Tales"
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className="footer-muse-tagline">
              An olfactory atelier creating bold, highly concentrated extracts — each composition hand-tended and
              priced with the same care as the briefs behind every name.
            </p>
            <div className="footer-muse-social" aria-label="Social">
              <a href="https://www.instagram.com/aromatalesofficial/" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href="https://www.tiktok.com/@aromatales.official" target="_blank" rel="noopener noreferrer">
                TikTok
              </a>
              <a
                href="https://www.facebook.com/people/Aroma-Tales/61565297351838/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </div>
          </div>

          <nav className="footer-muse-col" aria-labelledby="footer-archives">
            <h2 id="footer-archives" className="footer-muse-heading">
              Archives
            </h2>
            <ul className="footer-muse-links">
              <li>
                <Link to="/shop">Extrait de Parfum</Link>
              </li>
              <li>
                <Link to={{ pathname: '/', hash: 'featured' }}>Discovery set</Link>
              </li>
              <li>
                <Link to="/contact">Gift &amp; corporate</Link>
              </li>
              <li>
                <Link to="/contact">Stockists</Link>
              </li>
            </ul>
          </nav>

          <nav className="footer-muse-col" aria-labelledby="footer-maison">
            <h2 id="footer-maison" className="footer-muse-heading">
              Maison
            </h2>
            <ul className="footer-muse-links">
              <li>
                <Link to={{ pathname: '/', hash: 'about' }}>The philosophy</Link>
              </li>
              <li>
                <Link to="/contact">Contact us</Link>
              </li>
              <li>
                <Link to="/contact">Shipping</Link>
              </li>
              <li>
                <Link to="/contact">Returns</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="footer-muse-bottom">
          <div className="footer-muse-newsletter">
            <h2 className="footer-muse-heading">Join the atelier</h2>
            <form className="footer-muse-form" onSubmit={onNewsletterSubmit} noValidate>
              <label className="footer-muse-sr-only" htmlFor="footer-email">
                Email address
              </label>
              <input
                id="footer-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email address"
                required
              />
              <button type="submit">Subscribe</button>
            </form>
            {newsletterNote && <p className="footer-muse-note">{newsletterNote}</p>}
          </div>
          <div className="footer-muse-legal">
            <span>© {year} Aroma Tales</span>
            <span className="footer-muse-dot" aria-hidden="true">
              ·
            </span>
            <a href="#">Privacy</a>
            <span className="footer-muse-dot" aria-hidden="true">
              ·
            </span>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>

      <div className="footer-muse-bar" aria-hidden="true" />
    </footer>
  )
}

export default Footer
