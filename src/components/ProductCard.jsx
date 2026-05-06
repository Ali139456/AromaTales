import React, { useState, memo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './ProductCard.css'

const ProductCard = memo(({ product, addToCart }) => {
  const [added, setAdded] = useState(false)
  const productId = product._id || product.id

  const handleAddToCart = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (product.inStock && !added) {
        addToCart(product)
        setAdded(true)
        setTimeout(() => {
          setAdded(false)
        }, 2000)
      }
    },
    [product.inStock, product, addToCart, added]
  )

  return (
    <article className={`product-card ${!product.inStock ? 'out-of-stock' : ''}`}>
      <Link to={`/product/${productId}`} className="product-card-media-link" aria-label={`View ${product.name}`}>
        <div className="product-image-container">
          <img
            src={product.image}
            alt=""
            className="product-image"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.target.src = '/assets/images/products/signature.jpg'
            }}
          />
          <div className="product-category">{product.category}</div>
          {!product.inStock && <div className="out-of-stock-badge">Out of Stock</div>}
        </div>
      </Link>

      <div className="product-info">
        <Link to={`/product/${productId}`} className="product-name-link">
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <button
          type="button"
          className={`add-to-cart-btn ${!product.inStock ? 'disabled' : ''} ${added ? 'added' : ''}`}
          onClick={handleAddToCart}
          disabled={!product.inStock || added}
        >
          {added ? 'Added' : product.inStock ? 'Add to cart' : 'Unavailable'}
        </button>
      </div>
    </article>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard
