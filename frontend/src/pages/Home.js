import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import './Home.css';

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

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/products/featured').then((res) => {
      setFeatured(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <h1>Fresh Groceries<br />Delivered Fast 🚀</h1>
            <p>Farm-fresh vegetables, fruits, dairy & more — delivered to your door in Dhaka.</p>
            <div className="hero-btns">
              <Link to="/products" className="btn-primary" style={{ fontSize: 16, padding: '12px 32px' }}>
                Shop Now
              </Link>
              <Link to="/products?category=Organic" className="btn-outline" style={{ fontSize: 16, padding: '12px 32px' }}>
                Organic 🌿
              </Link>
            </div>
          </div>
          <div className="hero-image">🛒</div>
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
