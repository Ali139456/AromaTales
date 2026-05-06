import React, { useEffect } from 'react'
import { CONTACT_EMAIL } from '../config/site'
import './OrderSuccessModal.css'

const OrderSuccessModal = ({ order, onClose }) => {
  useEffect(() => {
    if (!order) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = 'unset'
    }
  }, [order, onClose])

  if (!order) return null

  return (
    <div className="success-overlay" onClick={onClose}>
      <div className="success-modal" onClick={(e) => e.stopPropagation()}>
        <button className="success-close" onClick={onClose} aria-label="Close">×</button>

        <div className="success-icon-wrap">
          <svg className="success-icon" viewBox="0 0 52 52">
            <circle className="success-icon-circle" cx="26" cy="26" r="24" fill="none" />
            <path className="success-icon-check" fill="none" d="M14 27l8 8 16-18" />
          </svg>
        </div>

        <h2 className="success-title">Order Placed</h2>
        <p className="success-subtitle">Thank you for shopping with Aroma Tales</p>

        <div className="success-details">
          <div className="success-row">
            <span>Order Number</span>
            <strong>{order.orderNumber}</strong>
          </div>
          <div className="success-row">
            <span>Total</span>
            <strong>PKR {order.total?.toLocaleString?.() ?? order.total}</strong>
          </div>
          <div className="success-row">
            <span>Payment</span>
            <strong>{order.paymentMethod || 'COD'}</strong>
          </div>
        </div>

        <p className="success-note">
          A confirmation email is on its way. We will contact you shortly to confirm
          delivery details.
        </p>

        <div className="success-contact">
          Need help? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          {' · '}
          <a href="https://wa.me/923331290243" target="_blank" rel="noopener noreferrer">
            WhatsApp +92 333 1290243
          </a>
        </div>

        <button className="success-cta" onClick={onClose}>Continue Shopping</button>
      </div>
    </div>
  )
}

export default OrderSuccessModal
