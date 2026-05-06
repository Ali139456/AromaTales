import React, { useState, useEffect, useMemo, memo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import { fetchProducts } from '../services/api'
import { COLLECTIONS, defaultProducts } from '../data/defaultProducts'
import './Shop.css'

const Shop = ({ addToCart }) => {
  const [products, setProducts] = useState(defaultProducts)
  const [searchParams, setSearchParams] = useSearchParams()
  const collection = searchParams.get('collection') || 'all'

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProducts()
        if (data && data.length > 0) setProducts(data)
      } catch {
        /* fallback already set */
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const list = [...products].sort((a, b) => {
      if (a.inStock === b.inStock) return a.name.localeCompare(b.name)
      return a.inStock ? -1 : 1
    })
    if (collection === 'all') return list
    return list.filter((p) => p.category === collection)
  }, [products, collection])

  const setCollection = (next) => {
    if (next === 'all') {
      searchParams.delete('collection')
      setSearchParams(searchParams, { replace: true })
    } else {
      setSearchParams({ collection: next }, { replace: true })
    }
  }

  return (
    <section className="shop-page" id="shop">
      <div className="shop-inner">
        <header className="shop-header">
          <p className="shop-eyebrow">Catalog</p>
          <h1 className="shop-title">The collection</h1>
          <p className="shop-lead">
            Twenty-four extrait compositions across three lines — names, notes, and art direction from your Aroma Tales
            workbook and assets.
          </p>
        </header>

        <div className="shop-tabs" role="tablist" aria-label="Filter by collection">
          <button
            type="button"
            role="tab"
            aria-selected={collection === 'all'}
            className={`shop-tab ${collection === 'all' ? 'active' : ''}`}
            onClick={() => setCollection('all')}
          >
            All
          </button>
          {COLLECTIONS.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={collection === c}
              className={`shop-tab ${collection === c ? 'active' : ''}`}
              onClick={() => setCollection(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <p className="shop-count">
          Showing <strong>{filtered.length}</strong> fragrances
          {collection !== 'all' ? ` · ${collection}` : ''}
        </p>

        <div className="shop-grid">
          {filtered.map((product, index) => (
            <div
              key={product._id || product.id}
              className="shop-card-slot"
              style={{ '--delay': `${index * 0.04}s` }}
            >
              <ProductCard product={product} addToCart={addToCart} />
            </div>
          ))}
        </div>

        <p className="shop-back-wrap">
          <Link to="/" className="shop-back">
            ← Back to home
          </Link>
        </p>
      </div>
    </section>
  )
}

export default memo(Shop)
