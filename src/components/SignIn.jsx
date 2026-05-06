import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiPath } from '../services/api'
import './AuthPages.css'

export default function SignIn() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/account'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data, error: signErr } = await signIn(email.trim(), password)
      if (signErr) {
        setError(signErr.message || 'Could not sign in')
        return
      }
      const token = data?.session?.access_token
      if (!token) {
        setError('Check your email and confirm your account before signing in.')
        return
      }
      const r = await fetch(apiPath('/auth/me'), {
        headers: { Authorization: 'Bearer ' + token }
      })
      const body = await r.json().catch(() => ({}))
      const role = body.profile?.role
      if (role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate(from, { replace: true })
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
        <h1>Welcome back</h1>
        <p className="auth-panel__sub">Sign in to view your orders and saved details.</p>

        {error ? <div className="auth-error">{error}</div> : null}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="signin-email">Email</label>
            <input
              id="signin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="signin-password">Password</label>
            <input
              id="signin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-alt">
          New here?{' '}
          <Link to="/sign-up" state={location.state}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
