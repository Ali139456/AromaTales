import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchProduct, fetchProducts } from '../services/api'
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

  // Get all images for a product
  // Colorful/styled images from images-2 are main, white background from images-1 are thumbnails
  const getProductImages = (productName, defaultImage) => {
    const imageMap = {
      'Black Stone': [
        '/assets/images/products/black-stone.jpg',  // Main: colorful/styled
        '/assets/images/products/black-stoner.jpg'  // Thumbnail: white background
      ],
      'Ocean Safari': [
        '/assets/images/products/ocean-safari.jpg',      // Main: colorful/styled
        '/assets/images/products/ocean-safari-white.jpg' // Thumbnail: white background
      ],
      'Red Sea': [
        '/assets/images/products/red-sea.png',      // Main: colorful/styled
        '/assets/images/products/red-sea-white.jpg' // Thumbnail: white background
      ],
      'Timeless': [
        '/assets/images/products/timeless.jpg',      // Main: colorful/styled
        '/assets/images/products/timeless-white.jpg' // Thumbnail: white background
      ],
      'Zephyr': [
        '/assets/images/products/zephyr.jpg',        // Main: colorful/styled
        '/assets/images/products/zephyr-white.jpg'   // Thumbnail: white background
      ]
    }
    
    const images = imageMap[productName] || []
    // If no images found, use the product's default image
    return images.length > 0 ? images : [defaultImage || '/assets/images/products/signature.jpg']
  }

  // Scroll to top when component mounts or id changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  // Handle keyboard events for lightbox
  useEffect(() => {
    if (!lightboxOpen || !product) return

    const productImagesList = getProductImages(product.name, product.image)

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
  }, [lightboxOpen, selectedImage, product])

  useEffect(() => {
    const loadProduct = async () => {
      // Default products fallback
      const defaultProducts = [
        {
          _id: 1,
          name: 'Black Stone',
          category: 'Men',
          price: 2550,
          description: `BRIEF
Black Stone is a rich and luxurious fragrance that exudes sophistication and depth. The top notes of Woody and Agarwood provide an earthy and powerful opening, setting the tone for an unforgettable experience. The heart notes of Vanilla and Sweet create a warm and inviting core, adding a soft and creamy sweetness to the composition. The base notes of Sandalwood, Oud, and Powdery create a refined and opulent finish, with the deep richness of oud perfectly balanced by the smoothness of sandalwood. Black Stone is ideal for those who appreciate deep, exotic, and timeless scents.

Major ingredients % wise:
Woody Accord: 12%
Agarwood (Oud) Accord: 10%
Vanilla Extract: 8%
Sweet Accord: 7%
Sandalwood Oil: 9%
Oud Accord: 7%
Powdery Accord: 7%

Concentration: 40% (Extrait De Parfum)
Sillage: Strong
Lasting upto: 12–14 hours (measured in standard atmosphere)

Top Notes: Woody, Agarwood
Middle Notes: Vanilla, Sweet
Base Notes: Sandalwood, Oud, Powdery`,
          image: '/assets/images/products/black-stone.jpg',
          inStock: false
        },
        {
          _id: 2,
          name: 'Ocean Safari',
          category: 'Unisex',
          price: 2300,
          description: `BRIEF
Ocean Safari is a refreshing and invigorating fragrance that embodies the spirit of the ocean. The top notes of Woody and Aromatic create a natural, fresh opening, evoking the calm and vastness of the sea breeze. The middle notes of Citrus and Earthy bring a zesty yet grounded heart, adding balance and vibrancy. The base notes of Soft Spicy and Powdery provide a smooth and comforting finish, creating a fragrance that is both energizing and serene. Ocean Safari is the perfect scent for those who enjoy a fresh, clean, and natural fragrance that lasts all day.

Major ingredients % wise:
Woody Accord: 12%
Aromatic Accord: 10%
Citrus Oil Natural: 8%
Earthy Accord: 6%
Soft Spicy Accord: 7%
Powdery Accord: 7%

Concentration: 40% (Extrait De Parfum)
Sillage: Moderate
Lasting upto: 8–10 hours (measured in standard atmosphere)

Top Notes: Woody, Aromatic
Middle Notes: Citrus, Earthy
Base Notes: Soft Spicy, Powdery`,
          image: '/assets/images/products/ocean-safari.jpg',
          inStock: false
        },
        {
          _id: 3,
          name: 'Red Sea',
          category: 'Unisex',
          price: 2350,
          description: `BRIEF
Red Sea is a bold and captivating fragrance that exudes charm and sophistication. The top notes of Apple, Lemon, Neroli, and Bergamot create a fresh and fruity opening, offering a vibrant and energizing start. The heart notes of Rose, Teak Wood, and Patchouli add a warm, woody floral complexity, giving the scent depth and richness. The base notes of Vanilla and Musk provide a creamy, smooth, and sensual finish, leaving a lasting impression of elegance and allure. Red Sea is the perfect fragrance for the modern, confident individual.

Major ingredients % wise:
Apple Accord: 10%
Lemon Oil: 8%
Neroli Oil: 6%
Bergamot Oil: 7%
Rose Absolute: 8%
Teak Wood Accord: 7%
Patchouli Oil: 6%
Vanilla Extract: 7%
Musk Accord: 6%

Concentration: 40% (Extrait De Parfum)
Sillage: Strong
Lasting upto: 10–12 hours (measured in standard atmosphere)

Top Notes: Apple, Lemon, Neroli, Bergamot
Middle Notes: Rose, Teak Wood, Patchouli
Base Notes: Vanilla, Musk`,
          image: '/assets/images/products/red-sea.png',
          inStock: true
        },
        {
          _id: 5,
          name: 'Zephyr',
          category: 'Unisex',
          price: 2800,
          description: `BRIEF
Zephyr is a luxurious and enchanting fragrance that captivates with its radiant complexity. The top notes of Woody, Amber, and Warm Spicy create a rich and alluring opening, exuding warmth and sophistication. The middle notes of Fresh Spicy and Metallic add a unique and contemporary twist, enhancing the fragrance's intriguing character. The base notes of White Floral and Animalic provide an opulent and sensual finish, leaving an unforgettable impression of elegance and allure. Zephyr is perfect for those who seek a bold yet refined signature scent.

Major ingredients % wise:
Woody Accord: 12%
Amber Accord: 10%
Warm Spicy Accord: 8%
Fresh Spicy Accord: 7%
Metallic Accord: 6%
White Floral Accord: 8%
Animalic Accord: 7%

Concentration: 40% (Extrait De Parfum)
Sillage: Strong
Lasting upto: 12–14 hours (measured in standard atmosphere)

Top Notes: Woody, Amber, Warm Spicy
Middle Notes: Fresh Spicy, Metallic
Base Notes: White Floral, Animalic`,
          image: '/assets/images/products/zephyr.jpg',
          inStock: true
        },
        {
          _id: 4,
          name: 'Timeless',
          category: 'Unisex',
          price: 2500,
          description: `BRIEF
Timeless is a vibrant and daring fragrance for men. The top notes combine Citrus, Lavender, and Fresh Spicy for a refreshing and invigorating opening. The middle notes of Aromatic, Floral, and Herbal create an alluring heart with a sophisticated twist. The base notes of Woody, Earthy, Mossy, and a hint of Alcohol bring depth and character, leaving a strong and unforgettable trail. Timeless is the perfect scent for those who embrace their bold and charismatic nature.

Major ingredients % wise:
Citrus Oil Natural: 8%
Lavender Oil Natural – France: 3%
Fresh Spicy Accord: 4%
Aromatic Accord: 3%
Floral Accord: 4%
Herbal Extracts: 2%
Woody Accord: 5%
Earthy Accord: 2%
Moss Absolute: 1.5%
Alcohol: 1.5%

Concentration: 40% (Extrait De Parfum)
Sillage: Strong
Lasting upto: 8–10 hours (measured in standard atmosphere)

Top Notes: Citrus, Lavender, Fresh Spicy
Middle Notes: Aromatic, Floral, Herbal
Base Notes: Woody, Earthy, Mossy, Alcohol`,
          image: '/assets/images/products/timeless.jpg',
          inStock: false
        }
      ]

      try {
        setLoading(true)
        
        // Try to fetch from API first
        try {
          const productData = await fetchProduct(id)
          setProduct(productData)
          
          // Load all products for suggested section
          try {
            const products = await fetchProducts()
            setAllProducts(products)
          } catch (err) {
            console.log('Could not load all products for suggestions, using defaults')
            setAllProducts(defaultProducts)
          }
        } catch (error) {
          console.log('API failed, using default products')
          // Use default products as fallback
          setAllProducts(defaultProducts)
          const foundProduct = defaultProducts.find(p => String(p._id || p.id) === String(id))
          if (foundProduct) {
            setProduct(foundProduct)
          } else {
            // Try to fetch all products from API as last resort
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
  }, [id, navigate])

  const handleAddToCart = () => {
    if (product && product.inStock && !added) {
      addToCart(product)
      setAdded(true)
      setTimeout(() => {
        setAdded(false)
      }, 2000)
    }
  }

  const formatDescription = (text) => {
    if (!text) return ''
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ))
  }

  // Get suggested products (exclude current product, take 4 random)
  const suggestedProducts = allProducts
    .filter(p => (p._id || p.id) !== (product?._id || product?.id))
    .slice(0, 4)

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
          <button onClick={() => navigate('/')} className="back-button">
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  const productImages = getProductImages(product.name, product.image)
  const mainImage = productImages[0] || product.image

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

            {/* First part of description under images */}
            <div className="product-detail-description-left">
              <div className="description-content">
                {formatDescription(firstPart)}
              </div>
            </div>
          </div>

          <div className="product-detail-info-section">
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

            {/* Second part of description on right side */}
            <div className="product-detail-description">
              <h2>Description</h2>
              <div className="description-content">
                {formatDescription(secondPart)}
              </div>
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