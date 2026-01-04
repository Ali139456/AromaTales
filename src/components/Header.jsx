import React, { useState, memo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import CartModal from './CartModal'
import './Header.css'

const Header = ({ cartCount, cart, removeFromCart, updateQuantity, onCheckout }) => {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavClick = (path, e) => {
    setIsMobileMenuOpen(false)
    if (location.pathname === path) {
      e.preventDefault()
      // If already on the page, scroll to section
      if (path === '/') {
        const hash = e.target.getAttribute('data-hash')
        if (hash) {
          const element = document.querySelector(hash)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }
      }
    }
  }

  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
            <img 
              src="/assets/images/logo/Aroma Tales Logo.png" 
              alt="Logo" 
              loading="eager"
              onError={(e) => {
                e.target.src = "/assets/images/logo/aromalogo_Black.png"
              }}
            />
          </Link>
          
          <nav className={`nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
            <Link 
              to="/" 
              onClick={(e) => handleNavClick('/', e)}
              data-hash="#home"
            >
              Home
            </Link>
            <Link 
              to="/" 
              onClick={(e) => handleNavClick('/', e)}
              data-hash="#products"
            >
              Products
            </Link>
            <Link 
              to="/" 
              onClick={(e) => handleNavClick('/', e)}
              data-hash="#reviews"
            >
              Reviews
            </Link>
            <Link 
              to="/" 
              onClick={(e) => handleNavClick('/', e)}
              data-hash="#about"
            >
              About
            </Link>
            <Link 
              to="/" 
              onClick={(e) => handleNavClick('/', e)}
              data-hash="#contact"
            >
              Contact
            </Link>
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
