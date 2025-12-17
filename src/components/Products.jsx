import React, { useState, useEffect, memo } from 'react'
import ProductCard from './ProductCard'
import { fetchProducts } from '../services/api'
import './Products.css'

const Products = ({ addToCart }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProducts = async () => {
      // Always show products immediately with fallback
      const defaultProducts = [
        {
          _id: 1,
          name: 'Black Stone',
          category: 'Men',
          price: 91.99,
          description: 'Strong and sophisticated, like polished black stone - mysterious and powerful.',
          image: '/assets/images/products/black-stoner.jpg',
          inStock: false
        },
        {
          _id: 2,
          name: 'Ocean Safari',
          category: 'Unisex',
          price: 93.99,
          description: 'An adventurous journey through oceanic notes that invigorate the senses.',
          image: '/assets/images/products/ocean-safari.jpg',
          inStock: false
        },
        {
          _id: 3,
          name: 'Red Sea',
          category: 'Unisex',
          price: 3000,
          description: `BRIEF
Red Sea is a bold and captivating fragrance that exudes charm and sophistication. The top notes of Apple, Lemon, Neroli, and Bergamot create a fresh and fruity opening, offering a vibrant and energizing start. The heart notes of Rose, Teak Wood, and Patchouli add a warm, woody floral complexity, giving the scent depth and richness. The base notes of Vanilla and Musk provide a creamy, smooth, and sensual finish, leaving a lasting impression of elegance and allure. Red Sea is the perfect fragrance for the modern, confident individual.

Major ingredients % wise:
Apple Accord: 10%
Lemon Oil: 8%
Neroli Oil: 6%
Bergamot Oil: 7%
Rose Absolute: 8%
Teak Wood Accord: 7%
Patchouli Oil: 6%
Vanilla Extract: 7%
Musk Accord: 6%

Concentration: 40% (Extrait De Parfum)
Sillage: Strong
Lasting upto: 10–12 hours (measured in standard atmosphere)

Top Notes: Apple, Lemon, Neroli, Bergamot
Middle Notes: Rose, Teak Wood, Patchouli
Base Notes: Vanilla, Musk`,
          image: '/assets/images/products/Red-Sea.jpg',
          inStock: true
        },
        {
          _id: 5,
          name: 'Zephyr',
          category: 'Unisex',
          price: 3000,
          description: `BRIEF
Zephyr is a luxurious and enchanting fragrance that captivates with its radiant complexity. The top notes of Woody, Amber, and Warm Spicy create a rich and alluring opening, exuding warmth and sophistication. The middle notes of Fresh Spicy and Metallic add a unique and contemporary twist, enhancing the fragrance's intriguing character. The base notes of White Floral and Animalic provide an opulent and sensual finish, leaving an unforgettable impression of elegance and allure. Zephyr is perfect for those who seek a bold yet refined signature scent.

Major ingredients % wise:
Woody Accord: 12%
Amber Accord: 10%
Warm Spicy Accord: 8%
Fresh Spicy Accord: 7%
Metallic Accord: 6%
White Floral Accord: 8%
Animalic Accord: 7%

Concentration: 40% (Extrait De Parfum)
Sillage: Strong
Lasting upto: 12–14 hours (measured in standard atmosphere)

Top Notes: Woody, Amber, Warm Spicy
Middle Notes: Fresh Spicy, Metallic
Base Notes: White Floral, Animalic`,
          image: '/assets/images/products/zephyr.jpg',
          inStock: true
        },
        {
          _id: 4,
          name: 'Timeless',
          category: 'Unisex',
          price: 97.99,
          description: 'A fragrance that transcends time, elegant and ever-relevant.',
          image: '/assets/images/products/timeless.jpg',
          inStock: false
        }
      ]
      
      setProducts(defaultProducts)
      setLoading(false)
      
      // Try to fetch from API in background
      try {
        const data = await fetchProducts()
        if (data && data.length > 0) {
          setProducts(data)
        }
      } catch (err) {
        console.log('Using default products')
      }
    }

    loadProducts()
  }, [])

  if (loading) {
    return (
      <section id="products" className="products">
        <div className="products-container">
          <div className="section-header">
            <h2 className="section-title">Our Collection</h2>
            <p className="section-subtitle">Loading products...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error && products.length === 0) {
    return (
      <section id="products" className="products">
        <div className="products-container">
          <div className="section-header">
            <p className="error-message">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="products" className="products">
      <div className="products-container">
        <div className="section-header">
          <h2 className="section-title">Our Collection</h2>
          <p className="section-subtitle">
            Discover our handcrafted selection of premium perfumes, each telling a unique story
          </p>
        </div>

        <div className="products-grid">
          {products.map((product, index) => (
            <div 
              key={product._id || product.id}
              className="product-card-wrapper"
              style={{ '--animation-delay': `${index * 0.1}s` }}
            >
              <ProductCard product={product} addToCart={addToCart} />
            </div>
          ))}
        </div>
      </div>

      <section id="about" className="about-section">
        <div className="about-container">
          <div className="about-content">
            <h2 className="about-title">About Aroma Tales</h2>
            <p className="about-text">
              At Aroma Tales, we believe that every fragrance tells a story. Our carefully curated 
              collection of premium perfumes is designed to evoke emotions, create memories, and 
              express your unique personality. Each bottle is a masterpiece, crafted with the finest 
              ingredients from around the world.
            </p>
            <p className="about-text">
              Whether you're seeking something fresh and invigorating or deep and mysterious, our 
              collection offers a scent for every occasion and mood. Experience the art of perfumery 
              with Aroma Tales.
            </p>
          </div>
        </div>
      </section>
    </section>
  )
}

export default memo(Products)
