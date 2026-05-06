import React, { useState, useEffect, useMemo, memo } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import { fetchProducts } from '../services/api'
import { FEATURED_PRODUCT_IDS, defaultProducts } from '../data/defaultProducts'
import './FeaturedStrip.css'

const FeaturedStrip = ({ addToCart }) => {
  const [products, setProducts] = useState(defaultProducts)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProducts()
        if (data && data.length > 0) setProducts(data)
      } catch {
        /* use defaults */
      }
    }
    load()
  }, [])

  const featured = useMemo(() => {
    const byId = new Map(products.map((p) => [p.id || p._id, p]))
    return FEATURED_PRODUCT_IDS.map((id) => byId.get(id)).filter(Boolean)
  }, [products])

  return (
    <section className="featured" id="featured">
      <div className="featured-inner">
        <header className="featured-head">
          <p className="featured-eyebrow">Editor&apos;s pick</p>
          <h2 className="featured-title">Six silhouettes to start</h2>
          <p className="featured-sub">
            A tight edit of bestsellers — explore the full twenty-four in the shop.
          </p>
        </header>

        <div className="featured-grid">
          {featured.map((product, index) => (
            <div
              key={product._id || product.id}
              className="featured-slot"
              style={{ '--delay': `${index * 0.06}s` }}
            >
              <ProductCard product={product} addToCart={addToCart} />
            </div>
          ))}
        </div>

        <div className="featured-cta">
          <Link to="/shop" className="landing-btn">
            View full shop
          </Link>
        </div>
      </div>
    </section>
  )
}

export default memo(FeaturedStrip)
