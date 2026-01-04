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
          price: 2550,
          description: `BRIEF
Black Stone is a rich and luxurious fragrance that exudes sophistication and depth. The top notes of Woody and Agarwood provide an earthy and powerful opening, setting the tone for an unforgettable experience. The heart notes of Vanilla and Sweet create a warm and inviting core, adding a soft and creamy sweetness to the composition. The base notes of Sandalwood, Oud, and Powdery create a refined and opulent finish, with the deep richness of oud perfectly balanced by the smoothness of sandalwood. Black Stone is ideal for those who appreciate deep, exotic, and timeless scents.

Major ingredients % wise:
Woody Accord: 12%
Agarwood (Oud) Accord: 10%
Vanilla Extract: 8%
Sweet Accord: 7%
Sandalwood Oil: 9%
Oud Accord: 7%
Powdery Accord: 7%

Concentration: 40% (Extrait De Parfum)
Sillage: Strong
Lasting upto: 12–14 hours (measured in standard atmosphere)

Top Notes: Woody, Agarwood
Middle Notes: Vanilla, Sweet
Base Notes: Sandalwood, Oud, Powdery`,
          image: '/assets/images/products/black-stone.jpg',
          inStock: false
        },
        {
          _id: 2,
          name: 'Ocean Safari',
          category: 'Unisex',
          price: 2300,
          description: `BRIEF
Ocean Safari is a refreshing and invigorating fragrance that embodies the spirit of the ocean. The top notes of Woody and Aromatic create a natural, fresh opening, evoking the calm and vastness of the sea breeze. The middle notes of Citrus and Earthy bring a zesty yet grounded heart, adding balance and vibrancy. The base notes of Soft Spicy and Powdery provide a smooth and comforting finish, creating a fragrance that is both energizing and serene. Ocean Safari is the perfect scent for those who enjoy a fresh, clean, and natural fragrance that lasts all day.

Major ingredients % wise:
Woody Accord: 12%
Aromatic Accord: 10%
Citrus Oil Natural: 8%
Earthy Accord: 6%
Soft Spicy Accord: 7%
Powdery Accord: 7%

Concentration: 40% (Extrait De Parfum)
Sillage: Moderate
Lasting upto: 8–10 hours (measured in standard atmosphere)

Top Notes: Woody, Aromatic
Middle Notes: Citrus, Earthy
Base Notes: Soft Spicy, Powdery`,
          image: '/assets/images/products/ocean-safari.jpg',
          inStock: false
        },
        {
          _id: 3,
          name: 'Red Sea',
          category: 'Unisex',
          price: 2350,
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
          image: '/assets/images/products/red-sea.png',
          inStock: true
        },
        {
          _id: 5,
          name: 'Zephyr',
          category: 'Unisex',
          price: 2800,
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
          price: 2500,
          description: `BRIEF
Timeless is a vibrant and daring fragrance for men. The top notes combine Citrus, Lavender, and Fresh Spicy for a refreshing and invigorating opening. The middle notes of Aromatic, Floral, and Herbal create an alluring heart with a sophisticated twist. The base notes of Woody, Earthy, Mossy, and a hint of Alcohol bring depth and character, leaving a strong and unforgettable trail. Timeless is the perfect scent for those who embrace their bold and charismatic nature.

Major ingredients % wise:
Citrus Oil Natural: 8%
Lavender Oil Natural – France: 3%
Fresh Spicy Accord: 4%
Aromatic Accord: 3%
Floral Accord: 4%
Herbal Extracts: 2%
Woody Accord: 5%
Earthy Accord: 2%
Moss Absolute: 1.5%
Alcohol: 1.5%

Concentration: 40% (Extrait De Parfum)
Sillage: Strong
Lasting upto: 8–10 hours (measured in standard atmosphere)

Top Notes: Citrus, Lavender, Fresh Spicy
Middle Notes: Aromatic, Floral, Herbal
Base Notes: Woody, Earthy, Mossy, Alcohol`,
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
