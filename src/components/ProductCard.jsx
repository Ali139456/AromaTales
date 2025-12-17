import React, { useState, memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './ProductCard.css'

const ProductCard = memo(({ product, addToCart }) => {
  const [added, setAdded] = useState(false)
  const navigate = useNavigate()

  const handleAddToCart = useCallback((e) => {
    e.stopPropagation()
    if (product.inStock && !added) {
      addToCart(product)
      setAdded(true)
      setTimeout(() => {
        setAdded(false)
      }, 2000)
    }
  }, [product.inStock, product, addToCart, added])

  const handleReadMore = useCallback((e) => {
    e.stopPropagation()
    const productId = product._id || product.id
    navigate(`/product/${productId}`)
  }, [product, navigate])

  // Check if description is long enough to need truncation
  const description = product.description || ''
  const shouldShowReadMore = description.length > 150 || description.split('\n').length > 3

  return (
    <div className={`product-card ${!product.inStock ? 'out-of-stock' : ''}`}>
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name}
          className="product-image"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.target.src = '/assets/images/products/Signature.jpg'
          }}
        />
        <div className="product-category">{product.category}</div>
        {!product.inStock && (
          <div className="out-of-stock-badge">Out of Stock</div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-description-wrapper">
          <p className="product-description">
            {product.description}
          </p>
          {shouldShowReadMore && (
            <button 
              className="read-more-btn"
              onClick={handleReadMore}
              aria-label="Read more"
            >
              Read more
            </button>
          )}
        </div>
        <div className="product-footer">
          <span className="product-price">PKR {product.price.toLocaleString()}</span>
          <button 
            className={`add-to-cart-btn ${!product.inStock ? 'disabled' : ''} ${added ? 'added' : ''}`} 
            onClick={handleAddToCart}
            disabled={!product.inStock || added}
          >
            <span>
              {added ? '✓ Added!' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard
