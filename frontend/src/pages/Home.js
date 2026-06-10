import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import './Home.css';

const heroMessages = [
  'Fresh vegetables delivered today',
  'Organic fruits handpicked for you',
  'Dairy essentials from trusted farms',
  'Pantry staples at great prices',
  'Fast delivery across Dhaka',
];

const categories = [
  { name: 'Vegetables', emoji: '🥦', color: '#e8f5e9' },
  { name: 'Fruits', emoji: '🍎', color: '#fff3e0' },
  { name: 'Dairy', emoji: '🥛', color: '#e3f2fd' },
  { name: 'Meat & Fish', emoji: '🐟', color: '#fce4ec' },
  { name: 'Bakery', emoji: '🍞', color: '#fff8e1' },
  { name: 'Beverages', emoji: '🧃', color: '#f3e5f5' },
  { name: 'Snacks', emoji: '🍿', color: '#e8f5e9' },
  { name: 'Organic', emoji: '🌿', color: '#f1f8e9' },
];

const homeBenefits = [
  {
    title: 'Fresh pick every day',
    description: 'New stock, seasonal produce, and pantry essentials chosen for quality.',
    emoji: '✨',
  },
  {
    title: 'Fast local delivery',
    description: 'Order in the morning and get your groceries delivered without delay.',
    emoji: '🚚',
  },
  {
    title: 'Trusted by families',
    description: 'Simple shopping, reliable service, and products people come back for.',
    emoji: '🏠',
  },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    API.get('/products/featured').then((res) => {
      setFeatured(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroMessages.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <h1>Fresh Groceries<br />Delivered Fast 🚀</h1>
            <p>Farm-fresh vegetables, fruits, dairy & more — delivered to your door in Dhaka.</p>
            <div className="hero-carousel" role="status" aria-live="polite">
              <span className="hero-carousel-label">Now featuring</span>
              <span className="hero-carousel-text" key={heroIndex}>{heroMessages[heroIndex]}</span>
            </div>
            <div className="hero-btns">
              <Link to="/products" className="btn-primary" style={{ fontSize: 16, padding: '12px 32px' }}>
                Shop Now
              </Link>
              <Link to="/products?category=Organic" className="btn-outline" style={{ fontSize: 16, padding: '12px 32px' }}>
                Organic 🌿
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-icon-frame">
              <div className="hero-icon">🛒</div>
              <div className="hero-icon-ring"></div>
              <div className="hero-icon-glow"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="ad-section container">
        <div className="ad-card">
          <div className="ad-card-content">
            <p className="ad-label">Hot Sale</p>
            <h3>Fresh picks at hot prices</h3>
            <p>
              Save on seasonal favorites with daily discounts on vegetables, fruits, dairy,
              and pantry essentials.
            </p>
            <div className="ad-points" aria-label="Hot sale highlights">
              <span>Daily deals</span>
              <span>Seasonal savings</span>
              <span>Limited-time offers</span>
            </div>
            <Link to="/products" className="btn-outline">Shop Hot Sale</Link>
          </div>
          <div className="ad-card-image">
            <img
              src="https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=520&h=320&q=80"
              alt="Hot sale groceries banner"
              loading="lazy"
            />
          </div>
        </div>
      </section>

          <section className="benefits-section container">
            <div className="section-header">
              <h2>Why customers shop here</h2>
              <Link to="/products">Explore Products →</Link>
            </div>
            <div className="benefits-grid">
              {homeBenefits.map((benefit) => (
                <article className="benefit-card" key={benefit.title}>
                  <div className="benefit-emoji" aria-hidden="true">{benefit.emoji}</div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </article>
              ))}
            </div>
          </section>

      <section className="categories-section container">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link to={`/products?category=${cat.name}`} key={cat.name} className="category-card" style={{ background: cat.color }}>
              <span className="cat-emoji">{cat.emoji}</span>
              <span className="cat-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-section container">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/products">View All →</Link>
        </div>
        {loading ? (
          <div className="page-loader"><div className="spinner"></div></div>
        ) : (
          <div className="products-grid">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      <section className="banner container">
        <div className="banner-card">
          <div>
            <h3>🌿 100% Organic Products</h3>
            <p>Fresh from certified organic farms. No pesticides, no chemicals.</p>
            <Link to="/products?category=Organic" className="btn-primary" style={{ marginTop: 12, display: 'inline-block' }}>
              Shop Organic
            </Link>
          </div>
          <div className="banner-emoji">🥦🍅🥕</div>
        </div>
      </section>
    </div>
  );
}
