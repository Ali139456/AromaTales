import React, { useState, useEffect, useRef } from 'react'
import './Reviews.css'

const reviews = [
  {
    id: 1,
    name: 'Ahmed Hassan',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Mashallah, Red Sea is amazing! The smell lasts the whole day. Sab log poochte hain kya perfume hai. Delivery bhi jaldi ho gayi. Definitely recommend!',
    product: 'Red Sea'
  },
  {
    id: 2,
    name: 'Fatima Ali',
    rating: 5,
    date: '1 month ago',
    comment: 'Red Sea is perfect for weddings and parties. Bahut strong hai aur long lasting bhi. Packaging bhi nice hai. Price bhi reasonable hai for the quality.',
    product: 'Red Sea'
  },
  {
    id: 3,
    name: 'Hassan Malik',
    rating: 5,
    date: '3 weeks ago',
    comment: 'Zephyr is excellent! Office mein use karta hoon, sab ko pasand aata hai. Value for money hai. Next order bhi yahi se karunga inshaAllah.',
    product: 'Zephyr'
  },
  {
    id: 4,
    name: 'Ayesha Khan',
    rating: 5,
    date: '1 week ago',
    comment: 'Red Sea is my favorite now! Evening outings ke liye perfect hai. Smell bahut unique hai, kisi aur ke saath mix nahi hota. Very satisfied!',
    product: 'Red Sea'
  },
  {
    id: 5,
    name: 'Muhammad Ali',
    rating: 5,
    date: '2 months ago',
    comment: 'Zephyr is top quality. Daily use kar raha hoon, abhi tak ek bottle hi finish hui. Long lasting hai aur smell bhi classy hai. Highly recommended!',
    product: 'Zephyr'
  },
  {
    id: 6,
    name: 'Sana Ahmed',
    rating: 5,
    date: '3 weeks ago',
    comment: 'Red Sea is perfect! Gift kiya tha bhai ko, unhone bahut pasand kiya. Smell luxurious hai aur price bhi theek hai. Will order again for sure.',
    product: 'Red Sea'
  },
  {
    id: 7,
    name: 'Usman Sheikh',
    rating: 5,
    date: '1 month ago',
    comment: 'Zephyr is amazing quality. College jaane se pehle lagata hoon, poore din fresh feel hota hai. Packaging bhi nice hai. Great product!',
    product: 'Zephyr'
  },
  {
    id: 8,
    name: 'Zainab Malik',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Red Sea is best! Functions aur parties mein use karti hoon. Sab log poochte hain kahan se liya. Smell bahut attractive hai. Love it!',
    product: 'Red Sea'
  },
  {
    id: 9,
    name: 'Bilal Ahmed',
    rating: 5,
    date: '4 weeks ago',
    comment: 'Zephyr is excellent value for money. Office mein use karta hoon, colleagues bhi poochte hain. Long lasting hai aur smell professional hai.',
    product: 'Zephyr'
  },
  {
    id: 10,
    name: 'Hira Khan',
    rating: 5,
    date: '1 week ago',
    comment: 'Red Sea is perfect for special occasions! Wedding season mein use kiya, bahut compliments mile. Quality top notch hai. Must try!',
    product: 'Red Sea'
  },
  {
    id: 11,
    name: 'Hamza Raza',
    rating: 5,
    date: '3 weeks ago',
    comment: 'Zephyr is great! Daily use kar raha hoon, smell fresh hai aur long lasting bhi. Price bhi reasonable hai. Customer service bhi accha hai.',
    product: 'Zephyr'
  },
  {
    id: 12,
    name: 'Maryam Ali',
    rating: 5,
    date: '2 months ago',
    comment: 'Red Sea is amazing! Smell unique hai, kisi aur brand jaisa nahi lagta. Long lasting hai aur packaging bhi beautiful hai. Highly satisfied!',
    product: 'Red Sea'
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
