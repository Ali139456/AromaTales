import React, { memo, useState, useEffect } from 'react'
import './Banner.css'

const Banner = memo(() => {
  const banners = [
    '/assets/images/banners/banner.jpg',
    '/assets/images/banners/aroma-tales-banner-2.jpg'
  ]
  
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [banners.length])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
  }

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
        {banners.map((banner, index) => (
          <img
            key={index}
            src={banner}
            alt={`Banner ${index + 1}`}
            className={`banner-image ${index === currentIndex ? 'active' : ''}`}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            onError={(e) => {
              e.target.src = "/assets/images/banners/banner2.jpg"
            }}
          />
        ))}
      </div>
      <button className="banner-nav-btn banner-nav-prev" onClick={goToPrevious} aria-label="Previous banner">
        ‹
      </button>
      <button className="banner-nav-btn banner-nav-next" onClick={goToNext} aria-label="Next banner">
        ›
      </button>
      <div className="banner-indicators">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`banner-indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
})

Banner.displayName = 'Banner'

export default Banner
