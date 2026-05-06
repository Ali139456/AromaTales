import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import './Admin.css'

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-brand">
          <small>Dashboard</small>
          Aroma Tales
        </Link>
        <nav className="admin-nav">
          <NavLink
            to="/admin/products"
            className={({ isActive }) => (isActive ? 'admin-nav--active' : '')}
          >
            Products
          </NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/">← Back to store</Link>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
