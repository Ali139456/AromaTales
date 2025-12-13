import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Header from './components/Header'
import Banner from './components/Banner'
import Products from './components/Products'
import Reviews from './components/Reviews'
import Footer from './components/Footer'
import CheckoutModal from './components/CheckoutModal'
import WhatsAppButton from './components/WhatsAppButton'
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

  const addToCart = useCallback(async (product) => {
    try {
      const cartData = await addToCartAPI(sessionId, product._id || product.id)
      setCart(cartData.items || [])
    } catch (error) {
      console.error('Error adding to cart:', error)
      // Fallback to local state if API fails
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => 
          (item.product?._id || item.product?.id || item.id) === (product._id || product.id)
        )
        if (existingItem) {
          return prevCart.map((item) =>
            (item.product?._id || item.product?.id || item.id) === (product._id || product.id)
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
        return [...prevCart, { product, quantity: 1 }]
      })
    }
  }, [sessionId])

  const removeFromCart = useCallback(async (itemId) => {
    try {
      const cartData = await removeFromCartAPI(sessionId, itemId)
      setCart(cartData.items || [])
    } catch (error) {
      console.error('Error removing from cart:', error)
      // Fallback to local state - clean itemId for comparison
      let cleanItemId = itemId
      if (itemId && typeof itemId === 'object') {
        cleanItemId = itemId.toString()
      }
      if (cleanItemId && typeof cleanItemId === 'string') {
        cleanItemId = cleanItemId.split(':')[0]
      }
      setCart((prevCart) => prevCart.filter((item) => {
        let itemIdToCompare = item._id || item.id
        if (itemIdToCompare && typeof itemIdToCompare === 'object') {
          itemIdToCompare = itemIdToCompare.toString()
        }
        if (itemIdToCompare && typeof itemIdToCompare === 'string') {
          itemIdToCompare = itemIdToCompare.split(':')[0]
        }
        return itemIdToCompare !== cleanItemId
      }))
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
      // Fallback to local state - clean itemId for comparison
      let cleanItemId = itemId
      if (itemId && typeof itemId === 'object') {
        cleanItemId = itemId.toString()
      }
      if (cleanItemId && typeof cleanItemId === 'string') {
        cleanItemId = cleanItemId.split(':')[0]
      }
      setCart((prevCart) =>
        prevCart.map((item) => {
          let itemIdToCompare = item._id || item.id
          if (itemIdToCompare && typeof itemIdToCompare === 'object') {
            itemIdToCompare = itemIdToCompare.toString()
          }
          if (itemIdToCompare && typeof itemIdToCompare === 'string') {
            itemIdToCompare = itemIdToCompare.split(':')[0]
          }
          return itemIdToCompare === cleanItemId ? { ...item, quantity } : item
        })
      )
    }
  }, [sessionId])

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

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
    alert(`Order placed successfully!\n\nOrder Number: ${order.orderNumber}\n\nYou will receive a confirmation email shortly. We will contact you soon for delivery details.\n\nFor any queries, contact us at:\nEmail: info.aromatales@gmail.com\nWhatsApp: +92 333 1290243`)
    setCart([])
    setIsCheckoutOpen(false)
  }

  return (
    <div className="app">
      <Header 
        cartCount={getTotalItems} 
        cart={cart} 
        removeFromCart={removeFromCart} 
        updateQuantity={updateQuantity}
        onCheckout={handleCheckout}
      />
      <Banner />
      <Products addToCart={addToCart} />
      <Reviews />
      <Footer />
      <WhatsAppButton />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={getCartTotal}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  )
}

export default App
