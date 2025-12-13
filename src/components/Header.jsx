import React, { useState, memo } from 'react'
import CartModal from './CartModal'
import './Header.css'

const Header = ({ cartCount, cart, removeFromCart, updateQuantity, onCheckout }) => {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <img 
              src="/assets/images/logo/Aroma Tales Logo.png" 
              alt="Logo" 
              loading="eager"
              onError={(e) => {
                e.target.src = "/assets/images/logo/aromalogo_Black.png"
              }}
            />
          </div>
          
          <nav className={`nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
            <a href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
            <a href="#products" onClick={() => setIsMobileMenuOpen(false)}>Products</a>
            <a href="#reviews" onClick={() => setIsMobileMenuOpen(false)}>Reviews</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
          </nav>

          <div className="header-actions">
            <button 
              className="cart-button" 
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping cart"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            
            <button 
              className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        onCheckout={() => {
          setIsCartOpen(false)
          if (onCheckout) onCheckout()
        }}
      />
    </>
  )
}

export default memo(Header)
