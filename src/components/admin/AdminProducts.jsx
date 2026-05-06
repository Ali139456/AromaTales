import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { deleteAdminProduct, fetchAdminProducts } from '../../services/api'
import './Admin.css'

export default function AdminProducts() {
  const { accessToken } = useAuth()
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    if (!accessToken) return
    setLoading(true)
    try {
      const data = await fetchAdminProducts(accessToken)
      setProducts(data || [])
      setError('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [accessToken])

  const handleDelete = async (id, name) => {
    if (!accessToken) return
    if (!window.confirm(`Delete “${name}”? This cannot be undone.`)) return
    try {
      await deleteAdminProduct(accessToken, id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <>
      <h1>Products</h1>
      <div className="admin-toolbar">
        <Link to="/admin/products/new" className="admin-btn admin-btn--primary">
          Add product
        </Link>
      </div>
      {error ? <div className="admin-alert admin-alert--error">{error}</div> : null}
      {loading ? <p>Loading…</p> : null}
      {!loading && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th />
                <th>Name</th>
                <th>Collection</th>
                <th>Price</th>
                <th>Stock</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img className="admin-thumb" src={p.image} alt="" />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>PKR {Number(p.price).toLocaleString()}</td>
                  <td>{p.inStock ? 'Yes' : 'No'}</td>
                  <td>
                    <div className="admin-row-actions">
                      <Link to={`/admin/products/${p.id}/edit`} className="admin-link">
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="admin-link"
                        style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                        onClick={() => handleDelete(p.id, p.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
