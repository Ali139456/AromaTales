import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import './AboutBand.css'

const AboutBand = memo(() => (
  <section id="about" className="about-band">
    <div className="about-band-inner">
      <div className="about-band-copy">
        <h2>Crafted for long wear</h2>
        <p>
          Every listing mirrors your Aroma Tales briefs: 40% extrait concentration, transparent note structure, and
          retail pricing from your sheet. Photography pulls from the same assets used for Instagram and the web.
        </p>
        <Link to="/shop" className="about-band-link">
          Explore all products →
        </Link>
      </div>
    </div>
  </section>
))

AboutBand.displayName = 'AboutBand'

export default AboutBand
