import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiUser, FiSearch, FiLogOut, FiMenu } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${search}`);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          🛒 <span>GreenBasket</span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search fruits, vegetables..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit"><FiSearch /></button>
        </form>

        <div className="navbar-actions">
          <Link to="/wishlist" className="nav-icon-btn" title="Wishlist">
            <FiHeart size={20} />
          </Link>

          <Link to="/cart" className="nav-icon-btn cart-btn" title="Cart">
            <FiShoppingCart size={20} />
            {totalItems > 0 && <span className="badge">{totalItems}</span>}
          </Link>

          {user ? (
            <div className="nav-user-menu">
              <button className="nav-icon-btn user-btn">
                <FiUser size={20} />
                <span>{user.name.split(' ')[0]}</span>
              </button>
              <div className="dropdown">
                {user.isAdmin && <Link to="/admin">Admin Dashboard</Link>}
                <Link to="/orders">My Orders</Link>
                <button onClick={() => { logout(); navigate('/'); }}>
                  <FiLogOut size={14} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '8px 18px', fontSize: 14 }}>
              Login
            </Link>
          )}

          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <FiMenu size={22} />
          </button>
        </div>
      </div>

      <div className={`navbar-categories container ${menuOpen ? 'open' : ''}`}>
        {['Vegetables', 'Fruits', 'Dairy', 'Meat & Fish', 'Bakery', 'Beverages', 'Snacks', 'Organic'].map((cat) => (
          <Link key={cat} to={`/products?category=${cat}`} onClick={() => setMenuOpen(false)}>
            {cat}
          </Link>
        ))}
      </div>
    </nav>
  );
}
