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

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const productData = await fetchProduct(id)
        setProduct(productData)
        
        // Load all products for suggested section
        try {
          const products = await fetchProducts()
          setAllProducts(products)
        } catch (err) {
          console.log('Could not load all products for suggestions')
        }
      } catch (error) {
        console.error('Error loading product:', error)
        // Fallback: try to find product from all products
        try {
          const products = await fetchProducts()
          setAllProducts(products)
          const foundProduct = products.find(p => (p._id || p.id) === id)
          if (foundProduct) {
            setProduct(foundProduct)
          } else {
            navigate('/', { replace: true })
          }
        } catch (err) {
          navigate('/', { replace: true })
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

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>

        <div className="product-detail-content">
          <div className="product-detail-image-section">
            <div className="product-image-wrapper">
              <img
                src={imageError ? '/assets/images/products/Signature.jpg' : product.image}
                alt={product.name}
                className="product-detail-image"
                onError={() => setImageError(true)}
              />
              {!product.inStock && (
                <div className="out-of-stock-overlay">Out of Stock</div>
              )}
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

            <div className="product-detail-description">
              <h2>Description</h2>
              <div className="description-content">
                {formatDescription(product.description)}
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
            <div className="suggested-products-grid">
              {suggestedProducts.map((suggestedProduct) => (
                <div key={suggestedProduct._id || suggestedProduct.id} className="suggested-product-wrapper">
                  <ProductCard product={suggestedProduct} addToCart={addToCart} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail