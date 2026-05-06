import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import './Banner.css'

const HERO_SRC = '/assets/images/hero/ocean-safari-hero-1920.jpg'
const HERO_SRC_2X = '/assets/images/hero/ocean-safari-hero-2560.jpg'

const Banner = memo(() => {
  return (
    <section id="home" className="hero">
      <div className="hero-bleed">
        <img
          className="hero-bg-img"
          src={HERO_SRC}
          srcSet={`${HERO_SRC} 1920w, ${HERO_SRC_2X} 2560w`}
          sizes="100vw"
          alt="Ocean Safari by Aroma Tales"
          width={1920}
          height={960}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="hero-bg-top" aria-hidden="true" />
        <div className="hero-bg-grad" aria-hidden="true" />

        <div className="hero-shell">
          <div className="hero-copy-col">
            <p className="hero-kicker">Premium fragrance</p>
            <h1 className="hero-heading">
              Fragrance,
              <br />
              world class
            </h1>
            <p className="hero-text">
              Ocean Safari — extrait de parfum with the clarity of cool water, the glow of golden amber, and a silhouette
              that lingers on skin like light on stone.
            </p>
            <div className="hero-actions">
              <Link to="/product/ocean-safari" className="landing-btn hero-cta-primary">
                Buy the scent
              </Link>
              <Link to="/shop" className="landing-btn landing-btn--ghost hero-cta-ghost">
                View all
              </Link>
            </div>

            <a href="#collections" className="hero-scroll-hint">
              <span className="hero-scroll-line" aria-hidden="true" />
              <span className="hero-scroll-label">Scroll down</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
})

Banner.displayName = 'Banner'

export default Banner
