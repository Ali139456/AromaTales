import React, { memo } from 'react'
import './Banner.css'

const Banner = memo(() => {
  return (
    <section id="home" className="banner">
      <div className="banner-overlay"></div>
      <div className="banner-content">
        <h1 className="banner-title">Once Upon A Scent</h1>
        <p className="banner-subtitle">Discover Your Signature Fragrance</p>
        <p className="banner-description">
          Experience the essence of luxury with our curated collection of premium perfumes. 
          Each bottle tells a unique story, crafted with passion and precision.
        </p>
        <a href="#products" className="banner-cta">Explore Collection</a>
      </div>
      <div className="banner-image-container">
        <img 
          src="/assets/images/banners/banner.jpg" 
          alt="Premium Perfume"
          className="banner-image"
          loading="eager"
          decoding="async"
          onError={(e) => {
            e.target.src = "/assets/images/banners/banner2.jpg"
          }}
        />
      </div>
    </section>
  )
})

Banner.displayName = 'Banner'

export default Banner
