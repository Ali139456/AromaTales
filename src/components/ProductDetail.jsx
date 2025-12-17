import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchProduct, fetchProducts } from '../services/api'
import './ProductDetail.css'

const ProductDetail = ({ addToCart }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        const productData = await fetchProduct(id)
        setProduct(productData)
      } catch (error) {
        console.error('Error loading product:', error)
        // Fallback: try to find product from all products
        try {
          const allProducts = await fetchProducts()
          const foundProduct = allProducts.find(p => (p._id || p.id) === id)
          if (foundProduct) {
            setProduct(foundProduct)
          } else {
            navigate('/#products', { replace: true })
          }
        } catch (err) {
          navigate('/#products', { replace: true })
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
          <button onClick={() => navigate('/#products')} className="back-button">
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
      </div>
    </div>
  )
}

export default ProductDetail
