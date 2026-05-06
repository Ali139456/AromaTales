import React, { memo } from 'react'
import './FragranceDifference.css'

const points = [
  {
    n: '01',
    title: 'Naturally concentrated',
    text: 'Extrait-level compositions built for longevity — each formula weighted as poetry, not filler.'
  },
  {
    n: '02',
    title: 'Lahore atelier',
    text: 'Small-batch ethos with the discipline of a price sheet and the warmth of a single-studio line.'
  },
  {
    n: '03',
    title: 'Transparent notes',
    text: 'Every silhouette ships with a clear pyramid so you know what you are wearing on skin.'
  },
  {
    n: '04',
    title: 'Conscious craft',
    text: 'Compositions tuned for real wear — fewer harsh extras, more room for the oils to speak.'
  }
]

const FragranceDifference = memo(() => (
  <section className="diff" aria-labelledby="diff-heading">
    <div className="diff-inner">
      <header className="diff-head">
        <h2 id="diff-heading">The fragrance difference</h2>
        <p className="diff-lede">
          Still lifes of glass and stone, light that feels borrowed from late afternoon — the same quiet you will find in
          our bottles.
        </p>
      </header>

      <div className="diff-grid">
        <ul className="diff-col diff-col--left">
          {points.slice(0, 2).map((p) => (
            <li key={p.n} className="diff-point">
              <span className="diff-num">{p.n}</span>
              <div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="diff-center">
          <div className="diff-center-frame">
            <img src="/assets/images/products/zephyr.jpg" alt="" loading="lazy" decoding="async" />
          </div>
        </div>

        <ul className="diff-col diff-col--right">
          {points.slice(2, 4).map((p) => (
            <li key={p.n} className="diff-point">
              <span className="diff-num">{p.n}</span>
              <div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
))

FragranceDifference.displayName = 'FragranceDifference'

export default FragranceDifference
