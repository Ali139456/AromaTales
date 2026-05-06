import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AuthPages.css'

export default function SignUp() {
  const { signUp } = useAuth()
  const location = useLocation()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const { data, error: upErr } = await signUp(email.trim(), password, fullName.trim())
      if (upErr) {
        setError(upErr.message || 'Could not create account')
        return
      }
      if (data?.session) {
        setSuccess('Account created. You can sign in now.')
      } else {
        setSuccess(
          'Check your inbox — we sent a confirmation link. After confirming, return here to sign in.'
        )
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-panel__brand">
          <Link to="/">
            <span className="auth-panel__eyebrow">Aroma Tales</span>
            <img src="/assets/images/logo/aromalogo_Black.png" alt="" width={180} height={40} />
          </Link>
        </div>
        <h1>Create your account</h1>
        <p className="auth-panel__sub">Track orders and get updates about your fragrance journey.</p>

        {error ? <div className="auth-error">{error}</div> : null}
        {success ? <div className="auth-success">{success}</div> : null}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="signup-name">Full name</label>
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Creating…' : 'Sign up'}
          </button>
        </form>

        <p className="auth-alt">
          Already have an account? <Link to="/sign-in" state={location.state}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
