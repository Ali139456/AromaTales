import React, { useCallback, useState, memo } from 'react'
import { Link } from 'react-router-dom'
import './PromoSplit.css'

const PromoSplit = memo(() => {
  const [copied, setCopied] = useState(false)
  const code = 'ATELIER15'

  const copyCode = useCallback(() => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2400)
    }
  }, [code])

  return (
    <section className="promo-split" aria-labelledby="promo-heading">
      <div className="promo-split-inner">
        <div className="promo-copy">
          <p className="promo-label">Aroma insider</p>
          <h2 id="promo-heading">Enjoy 15% off your first extrait</h2>
          <p className="promo-text">
            Treat the archive like a private opening — one code per customer, crafted for first-time orders in Lahore and
            nationwide.
          </p>
          <div className="promo-code-row">
            <span className="promo-code">{code}</span>
            <button type="button" className="promo-copy-btn" onClick={copyCode}>
              {copied ? 'Copied' : 'Copy code'}
            </button>
          </div>
          <Link to="/shop" className="landing-btn">
            Shop now
          </Link>
        </div>

        <div className="promo-visual" aria-hidden="true">
          <div className="promo-orbit promo-orbit--1" />
          <div className="promo-orbit promo-orbit--2" />
          <div className="promo-orbit promo-orbit--3" />
          <div className="promo-circle">
            <img src="/assets/images/products/red-sea.jpg" alt="" loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
    </section>
  )
})

export default PromoSplit
