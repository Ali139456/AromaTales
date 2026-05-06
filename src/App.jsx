import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Banner from './components/Banner'
import FragranceDifference from './components/FragranceDifference'
import CollectionShowcase from './components/CollectionShowcase'
import ScentHarmony from './components/ScentHarmony'
import FeaturedStrip from './components/FeaturedStrip'
import PromoSplit from './components/PromoSplit'
import NewsletterBand from './components/NewsletterBand'
import AboutBand from './components/AboutBand'
import Shop from './components/Shop'
import Reviews from './components/Reviews'
import Footer from './components/Footer'
import CheckoutModal from './components/CheckoutModal'
import WhatsAppButton from './components/WhatsAppButton'
import ProductDetail from './components/ProductDetail'
import Contact from './components/Contact'
import HashScroller from './components/HashScroller'
import OrderSuccessModal from './components/OrderSuccessModal'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import AccountPage from './components/AccountPage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/admin/AdminLayout'
import AdminProducts from './components/admin/AdminProducts'
import AdminProductForm from './components/admin/AdminProductForm'
import { getSessionId, getCart, addToCart as addToCartAPI, updateCartItem, removeFromCart as removeFromCartAPI } from './services/api'
import './App.css'

function App() {
  const [cart, setCart] = useState([])
  const [sessionId] = useState(getSessionId())

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await getCart(sessionId)
        setCart(cartData.items || [])
      } catch (error) {
        console.error('Error loading cart:', error)
      }
    }
    loadCart()
  }, [sessionId])

  const getItemId = (item) => item?._id || item?.id || null
  const getItemProductId = (item) => {
    const product = item?.product || item
    return product?._id || product?.id || null
  }

  const addToCart = useCallback(async (product) => {
    if (!product?.inStock) return
    const productId = product._id || product.id
    try {
      const cartData = await addToCartAPI(sessionId, productId)
      setCart(cartData.items || [])
    } catch (error) {
      console.error('Error adding to cart:', error)
      setCart((prevCart) => {
        const existing = prevCart.find((item) => getItemProductId(item) === productId)
        if (existing) {
          return prevCart.map((item) =>
            getItemProductId(item) === productId
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          )
        }
        return [
          ...prevCart,
          {
            _id: `local-${productId}-${Date.now()}`,
            id: `local-${productId}-${Date.now()}`,
            product,
            quantity: 1
          }
        ]
      })
    }
  }, [sessionId])

  const removeFromCart = useCallback(async (itemId) => {
    try {
      const cartData = await removeFromCartAPI(sessionId, itemId)
      setCart(cartData.items || [])
    } catch (error) {
      console.error('Error removing from cart:', error)
      setCart((prevCart) => prevCart.filter((item) => getItemId(item) !== itemId))
    }
  }, [sessionId])

  const updateQuantity = useCallback(async (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    try {
      const cartData = await updateCartItem(sessionId, itemId, quantity)
      setCart(cartData.items || [])
    } catch (error) {
      console.error('Error updating quantity:', error)
      setCart((prevCart) =>
        prevCart.map((item) => (getItemId(item) === itemId ? { ...item, quantity } : item))
      )
    }
  }, [sessionId, removeFromCart])

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [successOrder, setSuccessOrder] = useState(null)

  const getTotalItems = useMemo(() => {
    return cart.reduce((total, item) => total + (item.quantity || 0), 0)
  }, [cart])

  const getCartTotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const product = item.product || item
      return total + (product.price || 0) * (item.quantity || 1)
    }, 0)
  }, [cart])

  const handleCheckout = () => {
    if (cart.length > 0) {
      setIsCheckoutOpen(true)
    }
  }

  const handleOrderSuccess = (order) => {
    setCart([])
    setIsCheckoutOpen(false)
    setSuccessOrder(order)
  }

  const checkoutModalProps = {
    isOpen: isCheckoutOpen,
    onClose: () => setIsCheckoutOpen(false),
    cart,
    total: getCartTotal,
    onOrderSuccess: handleOrderSuccess
  }

  return (
    <div className="app">
      <HashScroller />
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
        </Route>
        <Route
          path="/account"
          element={
            <AccountPage
              cartCount={getTotalItems}
              cart={cart}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              onCheckout={handleCheckout}
              {...checkoutModalProps}
            />
          }
        />
        <Route
          path="/product/:id"
          element={
            <>
              <Header 
                cartCount={getTotalItems} 
                cart={cart} 
                removeFromCart={removeFromCart} 
                updateQuantity={updateQuantity}
                onCheckout={handleCheckout}
              />
              <ProductDetail addToCart={addToCart} />
              <Footer />
              <WhatsAppButton />
              <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                total={getCartTotal}
                onOrderSuccess={handleOrderSuccess}
              />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Header 
                cartCount={getTotalItems} 
                cart={cart} 
                removeFromCart={removeFromCart} 
                updateQuantity={updateQuantity}
                onCheckout={handleCheckout}
              />
              <Contact />
              <Footer />
              <WhatsAppButton />
              <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                total={getCartTotal}
                onOrderSuccess={handleOrderSuccess}
              />
            </>
          }
        />
        <Route
          path="/shop"
          element={
            <>
              <Header
                cartCount={getTotalItems}
                cart={cart}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
                onCheckout={handleCheckout}
              />
              <Shop addToCart={addToCart} />
              <Footer />
              <WhatsAppButton />
              <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                total={getCartTotal}
                onOrderSuccess={handleOrderSuccess}
              />
            </>
          }
        />
        <Route
          path="/"
          element={
            <>
      <Header 
        cartCount={getTotalItems} 
        cart={cart} 
        removeFromCart={removeFromCart} 
        updateQuantity={updateQuantity}
        onCheckout={handleCheckout}
      />
      <Banner />
      <FragranceDifference />
      <CollectionShowcase />
      <ScentHarmony />
      <FeaturedStrip addToCart={addToCart} />
      <PromoSplit />
      <NewsletterBand />
      <Reviews />
      <AboutBand />
      <Footer />
      <WhatsAppButton />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={getCartTotal}
        onOrderSuccess={handleOrderSuccess}
      />
            </>
          }
        />
      </Routes>
      <OrderSuccessModal order={successOrder} onClose={() => setSuccessOrder(null)} />
    </div>
  )
}

export default App
