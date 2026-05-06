import React, { useState, memo, useEffect, useCallback } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import CartModal from './CartModal'
import { useAuth } from '../context/AuthContext'
import './Header.css'

const HASH_SECTIONS = ['#collections', '#reviews', '#about', '#featured']

function Header({ cartCount, cart, removeFromCart, updateQuantity, onCheckout }) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isMobileMenuOpen])

  const { user, isAdmin } = useAuth()

  const hash = location.hash || ''
  const homeExactActive =
    location.pathname === '/' && !HASH_SECTIONS.includes(hash)

  const linkCls = useCallback(
    ({ isActive }) => `minimal-drawer-link${isActive ? ' minimal-drawer-link--active' : ''}`,
    []
  )

  const drawerHashActive = (expectedHash) =>
    location.pathname === '/' && hash === expectedHash ? ' minimal-drawer-link--active' : ''

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`} role="banner">
        {isMobileMenuOpen && (
          <button
            type="button"
            className="mobile-backdrop"
            aria-label="Close menu"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        <div className="header-track">
          <div className="header-shell">
            <div className="header-zone header-zone--left">
              <button
                type="button"
                className={`header-menu-btn ${isMobileMenuOpen ? 'header-menu-btn--open' : ''}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
                aria-controls="minimal-nav"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <span />
                <span />
              </button>
              <NavLink to="/shop" className={({ isActive }) => `header-shop${isActive ? ' header-shop--active' : ''}`}>
                Shop
              </NavLink>
            </div>

            <div className="header-brand-block">
              <span className="header-brand-eyebrow">Premium fragrance</span>
              <Link to="/" className="header-brand" onClick={() => setIsMobileMenuOpen(false)} aria-label="Aroma Tales home">
                <img
                  src="/assets/images/logo/aromalogo_Black.png"
                  alt="Aroma Tales"
                  width={200}
                  height={48}
                  loading="eager"
                  decoding="async"
                />
              </Link>
            </div>

            <div className="header-zone header-zone--right">
              <div className="header-auth">
                {!user && (
                  <Link to="/sign-in" className="header-auth-link">
                    Sign in
                  </Link>
                )}
                {user && isAdmin && (
                  <Link to="/admin" className="header-auth-link">
                    Admin
                  </Link>
                )}
                {user && (
                  <Link to="/account" className="header-auth-link">
                    Account
                  </Link>
                )}
              </div>
              <Link to="/contact" className="header-icon-btn" aria-label="Contact" title="Contact">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.35" />
                  <path
                    d="M5.5 20c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5"
                    stroke="currentColor"
                    strokeWidth="1.35"
                    strokeLinecap="round"
                  />
                </svg>
              </Link>
              <Link to="/shop" className="header-icon-btn" aria-label="Browse shop" title="Browse">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.35" />
                  <path d="M20 20l-4.2-4.2" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
                </svg>
              </Link>
              <button
                type="button"
                className="header-icon-btn header-icon-btn--cart"
                onClick={() => setIsCartOpen(true)}
                aria-label={`Shopping bag${cartCount > 0 ? `, ${cartCount} items` : ''}`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M6 8h12l-1 12H7L6 8z"
                    stroke="currentColor"
                    strokeWidth="1.35"
                    strokeLinejoin="round"
                  />
                  <path d="M9 8V6a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
                </svg>
                {cartCount > 0 && <span className="header-cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>}
              </button>
            </div>
          </div>

          <div
            id="minimal-nav"
            className={`minimal-drawer ${isMobileMenuOpen ? 'minimal-drawer--open' : ''}`}
            aria-hidden={!isMobileMenuOpen}
          >
            <div className="minimal-drawer-inner">
              <p className="minimal-drawer-label">Explore</p>
              <NavLink
                to="/"
                end
                className={() => `minimal-drawer-link${homeExactActive ? ' minimal-drawer-link--active' : ''}`}
              >
                Home
              </NavLink>
              <NavLink to="/shop" className={linkCls}>
                Shop
              </NavLink>
              <Link
                to={{ pathname: '/', hash: 'collections' }}
                className={`minimal-drawer-link${drawerHashActive('#collections')}`}
              >
                Collections
              </Link>
              <Link to={{ pathname: '/', hash: 'featured' }} className={`minimal-drawer-link${drawerHashActive('#featured')}`}>
                Featured
              </Link>
              <Link to={{ pathname: '/', hash: 'reviews' }} className={`minimal-drawer-link${drawerHashActive('#reviews')}`}>
                Reviews
              </Link>
              <Link to={{ pathname: '/', hash: 'about' }} className={`minimal-drawer-link${drawerHashActive('#about')}`}>
                Philosophy
              </Link>
              <NavLink to="/contact" className={linkCls}>
                Contact
              </NavLink>
              {!user && (
                <NavLink to="/sign-in" className={linkCls}>
                  Sign in
                </NavLink>
              )}
              {user && isAdmin && (
                <NavLink to="/admin" className={linkCls}>
                  Admin
                </NavLink>
              )}
              {user && (
                <NavLink to="/account" className={linkCls}>
                  Account
                </NavLink>
              )}
            </div>
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
