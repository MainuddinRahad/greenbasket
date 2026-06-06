import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import API from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import { useAuth } from '../context/AuthContext';
import './Wishlist.css';

export default function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchWishlist = () => {
    API.get('/wishlist').then((res) => {
      setProducts(res.data.products || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { if (user) fetchWishlist(); else setLoading(false); }, [user]);

  const handleToggle = (id) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  if (!user) return (
    <div className="wishlist-empty container">
      <FiHeart size={60} color="#ccc" />
      <h2>Please login to view wishlist</h2>
      <Link to="/login" className="btn-primary">Login</Link>
    </div>
  );

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;

  return (
    <div className="wishlist-page container">
      <h1>My Wishlist ❤️</h1>
      {products.length === 0 ? (
        <div className="wishlist-empty">
          <FiHeart size={60} color="#ccc" />
          <h2>Your wishlist is empty</h2>
          <p>Save products you love and shop them later.</p>
          <Link to="/products" className="btn-primary">Explore Products</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              wishlistIds={products.map((x) => x._id)}
              onWishlistToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
