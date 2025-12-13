import React, { useState, useEffect, useRef } from 'react'
import './Reviews.css'

const reviews = [
  {
    id: 1,
    name: 'Sarah Johnson',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Absolutely love Red Sea! The fragrance is captivating and long-lasting. Perfect for any occasion. Highly recommend!',
    product: 'Red Sea'
  },
  {
    id: 2,
    name: 'Michael Chen',
    rating: 5,
    date: '1 month ago',
    comment: 'Black Stone has become my signature scent. It\'s sophisticated and mysterious, exactly as described. Great quality!',
    product: 'Black Stone'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    rating: 5,
    date: '3 weeks ago',
    comment: 'Timeless is a beautiful fragrance. It\'s elegant and truly lives up to its name. The packaging is also exquisite.',
    product: 'Timeless'
  },
  {
    id: 4,
    name: 'David Thompson',
    rating: 5,
    date: '1 week ago',
    comment: 'Ocean Safari is incredible! It brings back memories of beach vacations. Fresh, invigorating, and unique.',
    product: 'Ocean Safari'
  },
  {
    id: 5,
    name: 'Jessica Williams',
    rating: 5,
    date: '2 months ago',
    comment: 'I\'ve tried all four fragrances and they are all amazing! Red Sea is my favorite though - so deep and captivating.',
    product: 'Red Sea'
  },
  {
    id: 6,
    name: 'Robert Martinez',
    rating: 5,
    date: '3 weeks ago',
    comment: 'Outstanding quality and customer service. Black Stone is powerful yet refined. Will definitely order again!',
    product: 'Black Stone'
  }
]

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const carouselRef = useRef(null)
  
  const getReviewsPerView = () => {
    if (window.innerWidth <= 768) return 1
    if (window.innerWidth <= 1200) return 2
    return 3
  }
  const [reviewsPerView, setReviewsPerView] = useState(getReviewsPerView())

  useEffect(() => {
    const handleResize = () => {
      setReviewsPerView(getReviewsPerView())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const maxIndex = Math.max(0, reviews.length - reviewsPerView)
          return prev >= maxIndex ? 0 : prev + 1
        })
      }, 3000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying, reviews.length, reviewsPerView])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, reviews.length - reviewsPerView)
      return prev <= 0 ? maxIndex : prev - 1
    })
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, reviews.length - reviewsPerView)
      return prev >= maxIndex ? 0 : prev + 1
    })
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    
    const distance = touchStartX.current - touchEndX.current
    const minSwipeDistance = 50

    if (distance > minSwipeDistance) {
      goToNext()
    } else if (distance < -minSwipeDistance) {
      goToPrevious()
    }

    touchStartX.current = 0
    touchEndX.current = 0
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < rating ? 'star filled' : 'star'}>
        ★
      </span>
    ))
  }

  return (
    <section id="reviews" className="reviews">
      <div className="reviews-container">
        <div className="section-header">
          <h2 className="section-title">Customer Reviews</h2>
          <p className="section-subtitle">
            See what our customers are saying about our premium fragrances
          </p>
        </div>

        <div className="reviews-carousel-wrapper">
          <button 
            className="carousel-arrow carousel-arrow-left" 
            onClick={goToPrevious}
            aria-label="Previous reviews"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <div 
            className="reviews-carousel"
            ref={carouselRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="reviews-carousel-track"
              style={{
                transform: `translateX(-${currentIndex * (100 / reviewsPerView)}%)`
              }}
            >
              {reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="reviewer-name">{review.name}</h4>
                        <p className="review-product">Purchased: {review.product}</p>
                      </div>
                    </div>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  
                  <p className="review-comment">{review.comment}</p>
                  
                  <div className="review-footer">
                    <span className="review-date">{review.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="carousel-arrow carousel-arrow-right" 
            onClick={goToNext}
            aria-label="Next reviews"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Reviews
