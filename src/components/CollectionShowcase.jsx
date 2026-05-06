import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import './CollectionShowcase.css'

const cells = [
  {
    key: 'men',
    placement: 'collections-card--tl',
    image: '/assets/images/products/black-stone.jpg',
    to: '/shop?collection=Men',
    label: "Men's line"
  },
  {
    key: 'women',
    placement: 'collections-card--tr',
    image: '/assets/images/products/xaeemah.jpg',
    to: '/shop?collection=Women',
    label: "Women's line"
  },
  {
    key: 'unisex',
    placement: 'collections-card--bl',
    image: '/assets/images/products/zephyr.jpg',
    to: '/shop?collection=Unisex',
    label: 'Unisex'
  },
  {
    key: 'archive',
    placement: 'collections-card--br',
    image: '/assets/images/products/white-stone.jpg',
    to: '/shop',
    label: 'Full archive'
  }
]

function BlossomBranch() {
  return (
    <svg
      className="collections-branch-svg"
      viewBox="0 0 400 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M-20 40 C60 120, 40 200, 120 280 C200 360, 180 420, 260 500"
        stroke="rgba(166, 137, 102, 0.35)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M80 100 C140 140, 130 200, 200 240 M140 180 C220 200, 240 280, 320 320 M100 260 C160 300, 200 380, 280 420"
        stroke="rgba(166, 137, 102, 0.22)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {[
        [95, 108],
        [128, 168],
        [188, 228],
        [248, 298],
        [168, 338],
        [288, 368],
        [218, 118],
        [308, 218]
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="11" fill="rgba(253, 251, 247, 0.95)" stroke="rgba(166, 137, 102, 0.4)" strokeWidth="1" />
          <circle cx={cx - 2} cy={cy - 2} r="3" fill="rgba(166, 137, 102, 0.35)" />
        </g>
      ))}
    </svg>
  )
}

const CollectionShowcase = () => (
  <section className="collections" id="collections">
    <div className="collections-inner">
      <header className="collections-head">
        <h2 className="collections-title">New collections</h2>
        <p className="collections-sub">
          Stone, linen, and glass — the same still life language across every cap.
        </p>
      </header>

      <div className="collections-stage">
        <p className="collections-new-tag" aria-hidden="true">
          New
        </p>

        <div className="collections-collage">
          <div className="collections-branch" aria-hidden="true">
            <BlossomBranch />
          </div>

          <span className="collections-vertical-label" aria-hidden="true">
            Collections
          </span>

          <ul className="collections-card-list">
            {cells.map((c) => (
              <li key={c.key} className={`collections-card-wrap ${c.placement}`}>
                <Link to={c.to} className="collections-card">
                  <img src={c.image} alt="" loading="lazy" decoding="async" />
                  <span className="collections-card-label">{c.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="collections-cta">
        <Link to="/shop" className="landing-btn">
          All collections
        </Link>
      </div>
    </div>
  </section>
)

export default memo(CollectionShowcase)
