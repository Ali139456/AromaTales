import React, { useState, memo, useCallback } from 'react'
import './ProductCard.css'

const ProductCard = memo(({ product, addToCart }) => {
  const [added, setAdded] = useState(false)

  const handleAddToCart = useCallback(() => {
    if (product.inStock && !added) {
      addToCart(product)
      setAdded(true)
      setTimeout(() => {
        setAdded(false)
      }, 2000)
    }
  }, [product.inStock, product, addToCart, added])

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
        <p className="product-description">{product.description}</p>
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
