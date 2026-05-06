import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchMyOrders } from '../services/api'
import Header from './Header'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'
import CheckoutModal from './CheckoutModal'
import './AccountPage.css'

export default function AccountPage({
  cartCount,
  cart,
  removeFromCart,
  updateQuantity,
  onCheckout,
  isOpen,
  onClose,
  total,
  onOrderSuccess
}) {
  const { user, profile, accessToken, signOut } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken) return
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchMyOrders(accessToken)
        if (!cancelled) setOrders(data || [])
      } catch (e) {
        if (!cancelled) setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [accessToken])

  return (
    <>
      <Header
        cartCount={cartCount}
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        onCheckout={onCheckout}
      />
      <main className="account-page">
        <div className="account-inner">
          <p className="account-eyebrow">Your space</p>
          <h1>Account</h1>
          <p className="account-intro">
            Signed in as <strong>{user?.email}</strong>
            {profile?.full_name ? ` · ${profile.full_name}` : ''}
          </p>
          <button type="button" className="account-signout" onClick={() => signOut()}>
            Sign out
          </button>

          <section className="account-orders">
            <h2>Order history</h2>
            {loading ? <p className="account-muted">Loading orders…</p> : null}
            {error ? <p className="account-error">{error}</p> : null}
            {!loading && !error && orders.length === 0 ? (
              <p className="account-muted">
                No orders linked to this account yet. <Link to="/shop">Browse the shop</Link>
              </p>
            ) : null}
            <ul className="account-order-list">
              {orders.map((order) => (
                <li key={order.id} className="account-order-card">
                  <div className="account-order-head">
                    <span className="account-order-num">{order.orderNumber}</span>
                    <span className="account-order-meta">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''} ·{' '}
                      <strong>PKR {Number(order.total || 0).toLocaleString()}</strong>
                    </span>
                    <span className={`account-status account-status--${(order.status || 'pending').toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <ul className="account-line-items">
                    {(order.items || []).map((line) => (
                      <li key={line.id}>
                        {line.product?.name || 'Product'} × {line.quantity} — PKR{' '}
                        {Number(line.price || 0).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
      <CheckoutModal
        isOpen={isOpen}
        onClose={onClose}
        cart={cart}
        total={total}
        onOrderSuccess={onOrderSuccess}
      />
    </>
  )
}
