import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  createAdminProduct,
  fetchProduct,
  updateAdminProduct,
  uploadAdminProductImage
} from '../../services/api'
import './Admin.css'

const emptyForm = {
  name: '',
  category: 'Unisex',
  price: '',
  description: '',
  image: '',
  inStock: true,
  sortOrder: 0
}

export default function AdminProductForm() {
  const { id } = useParams()
  const isNew = !id
  const navigate = useNavigate()
  const { accessToken } = useAuth()

  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!isNew)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isNew) return
    let cancelled = false
    ;(async () => {
      try {
        const p = await fetchProduct(id)
        if (cancelled) return
        setForm({
          name: p.name || '',
          category: p.category || 'Unisex',
          price: String(p.price ?? ''),
          description: p.description || '',
          image: p.image || '',
          inStock: p.inStock !== false,
          sortOrder: Number(p.sortOrder ?? p.sort_order ?? 0)
        })
      } catch (e) {
        if (!cancelled) setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, isNew])

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !accessToken) return
    setError('')
    try {
      const { url } = await uploadAdminProductImage(accessToken, file)
      setField('image', url)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!accessToken) return
    const priceNum = Number(form.price)
    if (!form.name.trim() || !form.image.trim() || Number.isNaN(priceNum) || priceNum < 0) {
      setError('Name, valid price, and image URL (or upload an image) are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        price: priceNum,
        description: form.description.trim() || ' ',
        image: form.image.trim(),
        inStock: form.inStock,
        sort_order: Number(form.sortOrder) || 0
      }
      if (isNew) {
        await createAdminProduct(accessToken, payload)
      } else {
        await updateAdminProduct(accessToken, id, payload)
      }
      navigate('/admin/products')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p>Loading product…</p>
  }

  return (
    <>
      <div className="admin-toolbar">
        <Link to="/admin/products" className="admin-btn admin-btn--ghost">
          ← All products
        </Link>
      </div>
      <h1>{isNew ? 'New product' : 'Edit product'}</h1>
      {error ? <div className="admin-alert admin-alert--error">{error}</div> : null}
      <form className="admin-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            required
          />
        </label>
        <label>
          Collection
          <select
            value={form.category}
            onChange={(e) => setField('category', e.target.value)}
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </label>
        <label>
          Price (PKR)
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setField('price', e.target.value)}
            required
          />
        </label>
        <label>
          Description
          <textarea
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
            required
          />
        </label>
        <label>
          Image URL
          <input
            value={form.image}
            onChange={(e) => setField('image', e.target.value)}
            placeholder="https://… or upload below"
          />
        </label>
        <label>
          Upload image (JPEG, PNG, WebP)
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFile} />
        </label>
        {form.image ? (
          <img className="admin-preview" src={form.image} alt="" />
        ) : null}
        <label>
          Sort order
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => setField('sortOrder', e.target.value)}
          />
        </label>
        <label className="admin-checkbox">
          <input
            type="checkbox"
            checked={form.inStock}
            onChange={(e) => setField('inStock', e.target.checked)}
          />
          In stock
        </label>
        <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
          {saving ? 'Saving…' : isNew ? 'Create product' : 'Save changes'}
        </button>
      </form>
    </>
  )
}
