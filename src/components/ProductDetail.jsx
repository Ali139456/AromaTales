import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchProduct, fetchProducts } from '../services/api'
import { defaultProducts } from '../data/defaultProducts'
import ProductCard from './ProductCard'
import './ProductDetail.css'

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [rating] = useState(4.5) // Default rating, can be made dynamic later
  const [selectedImage, setSelectedImage] = useState(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)

  const getProductImages = useCallback((_productName, defaultImage) => {
    const main = defaultImage || '/assets/images/products/signature.jpg'
    return [main]
  }, [])

  // Scroll to top when component mounts or id changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  // Handle keyboard events for lightbox
  useEffect(() => {
    if (!lightboxOpen || !product) return

    const productName = product?.name
    const productImage = product?.image
    if (!productName || !productImage) return

    const productImagesList = getProductImages(productName, productImage)

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false)
      } else if (e.key === 'ArrowLeft' && productImagesList.length > 1 && selectedImage) {
        const currentIndex = productImagesList.indexOf(selectedImage)
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : productImagesList.length - 1
        setSelectedImage(productImagesList[prevIndex])
      } else if (e.key === 'ArrowRight' && productImagesList.length > 1 && selectedImage) {
        const currentIndex = productImagesList.indexOf(selectedImage)
        const nextIndex = currentIndex < productImagesList.length - 1 ? currentIndex + 1 : 0
        setSelectedImage(productImagesList[nextIndex])
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [lightboxOpen, selectedImage, product?.name, product?.image])

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)

        try {
          const productData = await fetchProduct(id)
          setProduct(productData)
          try {
            const products = await fetchProducts()
            setAllProducts(products)
          } catch (err) {
            console.log('Could not load all products for suggestions, using defaults')
            setAllProducts(defaultProducts)
          }
        } catch (error) {
          console.log('API failed, using default products')
          setAllProducts(defaultProducts)
          const foundProduct = defaultProducts.find(p => String(p._id || p.id) === String(id))
          if (foundProduct) {
            setProduct(foundProduct)
          } else {
            try {
              const products = await fetchProducts()
              setAllProducts(products)
              const apiProduct = products.find(p => String(p._id || p.id) === String(id))
              if (apiProduct) {
                setProduct(apiProduct)
              } else {
                console.error('Product not found with ID:', id)
                navigate('/', { replace: true })
              }
            } catch (err) {
              console.error('Product not found with ID:', id)
              navigate('/', { replace: true })
            }
          }
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadProduct()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleAddToCart = useCallback(() => {
    if (product && product.inStock && !added) {
      addToCart(product)
      setAdded(true)
      setTimeout(() => {
        setAdded(false)
      }, 2000)
    }
  }, [product, added, addToCart])

  const formatDescription = useCallback((text) => {
    if (!text || typeof text !== 'string') return ''
    const lines = text.split('\n')
    return lines.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </React.Fragment>
    ))
  }, [])

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full">★</span>)
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>)
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} className="star empty">★</span>)
    }
    return stars
  }

  // Get suggested products (exclude current product, take 4 random)
  const suggestedProducts = useMemo(() => {
    if (!product || !allProducts.length) return []
    const productId = product._id || product.id
    return allProducts
      .filter(p => (p._id || p.id) !== productId)
      .slice(0, 4)
  }, [allProducts, product])

  const productImages = useMemo(() => {
    if (!product) return []
    return getProductImages(product.name, product.image)
  }, [product?.name, product?.image])
  
  const mainImage = useMemo(() => {
    return productImages[0] || product?.image || '/assets/images/products/signature.jpg'
  }, [productImages, product?.image])

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-loading">
          <div className="loading-spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-error">
          <h2>Product not found</h2>
          <button onClick={() => navigate('/shop')} className="back-button">
            Back to shop
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>

        <div className="product-detail-content">
          <div className="product-detail-image-section">
            <div className="product-image-wrapper" onClick={() => {
              setSelectedImage(mainImage)
              setLightboxOpen(true)
            }}>
              <img
                src={imageError ? '/assets/images/products/signature.jpg' : mainImage}
                alt={product.name}
                className="product-detail-image"
                onError={() => setImageError(true)}
              />
              {!product.inStock && (
                <div className="out-of-stock-overlay">Out of Stock</div>
              )}
              <div className="image-zoom-hint">Click to enlarge</div>
            </div>
            
            {productImages.length > 1 && (
              <div className="product-image-thumbnails">
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail-item ${mainImage === image ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedImage(image)
                      setLightboxOpen(true)
                    }}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      onError={(e) => {
                        e.target.src = '/assets/images/products/signature.jpg'
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="product-detail-category">{product.category}</div>
            <h1 className="product-detail-name">{product.name}</h1>
            
            <div className="product-detail-rating">
              <div className="stars-container">
                {renderStars(rating)}
              </div>
              <span className="rating-value">{rating}</span>
              <span className="rating-count">(127 reviews)</span>
            </div>
            
            <div className="product-detail-price">
              PKR {product.price.toLocaleString()}
            </div>

            <div className="product-detail-actions">
              <button
                className={`product-detail-add-to-cart ${!product.inStock ? 'disabled' : ''} ${added ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={!product.inStock || added}
              >
                {added ? '✓ Added to Cart!' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>

          <div className="product-detail-info-section">
            <div className="product-detail-description">
              <h2>Description</h2>
              <div className="description-content">
                {formatDescription(product.description)}
              </div>
            </div>
          </div>
        </div>

        {suggestedProducts.length > 0 && (
          <div className="suggested-products-section">
            <h2 className="suggested-products-title">You May Also Like</h2>
            <div className="suggested-products-wrapper">
              <div className="suggested-products-grid">
                {suggestedProducts.map((suggestedProduct) => (
                  <div key={suggestedProduct._id || suggestedProduct.id} className="suggested-product-wrapper">
                    <ProductCard product={suggestedProduct} addToCart={addToCart} />
                  </div>
                ))}
              </div>
              {/* Mobile Carousel */}
              <div className="suggested-products-carousel">
                <div 
                  className="suggested-products-carousel-track"
                  style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                >
                  {suggestedProducts.map((suggestedProduct) => (
                    <div key={suggestedProduct._id || suggestedProduct.id} className="suggested-product-carousel-item">
                      <ProductCard product={suggestedProduct} addToCart={addToCart} />
                    </div>
                  ))}
                </div>
                {suggestedProducts.length > 1 && (
                  <>
                    <button
                      className="suggested-carousel-arrow suggested-carousel-arrow-left"
                      onClick={() => setCarouselIndex((prev) => (prev > 0 ? prev - 1 : suggestedProducts.length - 1))}
                      aria-label="Previous product"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>
                    <button
                      className="suggested-carousel-arrow suggested-carousel-arrow-right"
                      onClick={() => setCarouselIndex((prev) => (prev < suggestedProducts.length - 1 ? prev + 1 : 0))}
                      aria-label="Next product"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                    <div className="suggested-carousel-indicators">
                      {suggestedProducts.map((_, index) => (
                        <button
                          key={index}
                          className={`suggested-carousel-indicator ${index === carouselIndex ? 'active' : ''}`}
                          onClick={() => setCarouselIndex(index)}
                          aria-label={`Go to product ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && selectedImage && product && (
        <div className="image-lightbox" onClick={() => setLightboxOpen(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>
              ×
            </button>
            <img src={selectedImage} alt={product.name} className="lightbox-image" />
            {(() => {
              const lightboxImages = getProductImages(product.name, product.image)
              return lightboxImages.length > 1 && (
                <div className="lightbox-navigation">
                  <button
                    className="lightbox-nav-btn prev"
                    onClick={(e) => {
                      e.stopPropagation()
                      const currentIndex = lightboxImages.indexOf(selectedImage)
                      const prevIndex = currentIndex > 0 ? currentIndex - 1 : lightboxImages.length - 1
                      setSelectedImage(lightboxImages[prevIndex])
                    }}
                  >
                    ‹
                  </button>
                  <button
                    className="lightbox-nav-btn next"
                    onClick={(e) => {
                      e.stopPropagation()
                      const currentIndex = lightboxImages.indexOf(selectedImage)
                      const nextIndex = currentIndex < lightboxImages.length - 1 ? currentIndex + 1 : 0
                      setSelectedImage(lightboxImages[nextIndex])
                    }}
                  >
                    ›
                  </button>
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail