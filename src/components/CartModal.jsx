import React from 'react'
import './CartModal.css'

const CartModal = ({ isOpen, onClose, cart, removeFromCart, updateQuantity, onCheckout }) => {
  if (!isOpen) return null

  const total = cart.reduce((sum, item) => {
    const product = item.product || item
    return sum + (product.price || 0) * (item.quantity || 1)
  }, 0)

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-modal-header">
          <h2>Shopping Cart</h2>
          <button className="close-button" onClick={onClose} aria-label="Close cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="cart-modal-content">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <p className="empty-cart-subtitle">Add some perfumes to get started!</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item, index) => {
                  const product = item.product || item
                  const productId = product._id || product.id
                  
                  // MongoDB subdocuments use lowercase .id for the string ID
                  // Try .id first (string), then _id (may be ObjectId), then fallback
                  let itemId = item.id || item._id?.toString() || item._id || item.id
                  
                  // Convert to string if it's an object
                  if (itemId && typeof itemId === 'object' && itemId.toString) {
                    itemId = itemId.toString()
                  }
                  
                  // Ensure it's a string and clean it
                  if (itemId) {
                    itemId = String(itemId).split(':')[0].split('.')[0].trim()
                  } else {
                    // Last resort fallback
                    itemId = `temp_${index}_${Date.now()}`
                  }
                  
                  return (
                    <div key={itemId || productId} className="cart-item">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="cart-item-image"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.target.src = '/assets/images/products/Signature.jpg'
                        }}
                      />
                      <div className="cart-item-info">
                        <h4 className="cart-item-name">{product.name}</h4>
                        <p className="cart-item-category">{product.category}</p>
                        <p className="cart-item-price">${product.price.toFixed(2)}</p>
                      </div>
                      <div className="cart-item-controls">
                        <div className="quantity-controls">
                          <button 
                            onClick={() => updateQuantity(itemId, (item.quantity || 1) - 1)}
                            className="quantity-btn"
                          >
                            −
                          </button>
                          <span className="quantity">{item.quantity || 1}</span>
                          <button 
                            onClick={() => updateQuantity(itemId, (item.quantity || 1) + 1)}
                            className="quantity-btn"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(itemId)}
                          className="remove-button"
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="cart-item-total">
                        ${((product.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="cart-total">
                <div className="cart-total-row">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="cart-total-row">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="cart-total-row total">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button className="checkout-button" onClick={onCheckout}>Proceed to Checkout</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartModal
