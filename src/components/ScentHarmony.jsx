import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import './ScentHarmony.css'

const chords = [
  {
    title: 'Floral luminosity',
    text: 'Radiant bouquets, soft musks, and skin-glow textures — wear closer for evening glass and daylight alike.',
    to: '/shop?collection=Women',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.2" />
        <path
          d="M24 12v6M24 30v6M12 24h6M30 24h6M16.5 16.5l4.2 4.2M27.3 27.3l4.2 4.2M31.5 16.5l-4.2 4.2M20.7 27.3l-4.2 4.2"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.25" />
      </svg>
    )
  },
  {
    title: 'Structured woods',
    text: 'Spice, resin, and timber-grain silhouettes — composed for presence without shouting across the room.',
    to: '/shop?collection=Men',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.2" />
        <path d="M24 10v28M18 16h12M16 28h16M14 36h20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    )
  },
  {
    title: 'Clean musk & air',
    text: 'Shared, versatile extrait that glides over linen and skin — the quiet constant in a loud week.',
    to: '/shop?collection=Unisex',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.2" />
        <path d="M16 30c2-6 6-10 8-14s4-6 8-6 6 4 8 10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M14 34h20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    )
  }
]

const ScentHarmony = memo(() => (
  <section className="harmony" aria-labelledby="harmony-heading">
    <div className="harmony-inner">
      <header className="harmony-head">
        <h2 id="harmony-heading">A multi-layered harmony</h2>
        <p>Three families — each with its own posture, none of them shy about concentration.</p>
      </header>
      <div className="harmony-grid">
        {chords.map((c) => (
          <article key={c.title} className="harmony-card">
            <div className="harmony-icon">{c.icon}</div>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
            <Link to={c.to} className="harmony-link">
              Browse line
            </Link>
          </article>
        ))}
      </div>
    </div>
  </section>
))

ScentHarmony.displayName = 'ScentHarmony'

export default ScentHarmony
