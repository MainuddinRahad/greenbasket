import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>🛒 GreenBasket</h3>
          <p>Fresh groceries delivered to your door. Quality you can trust.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <Link to="/products">All Products</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/orders">My Orders</Link>
        </div>
        <div>
          <h4>Categories</h4>
          <Link to="/products?category=Vegetables">Vegetables</Link>
          <Link to="/products?category=Fruits">Fruits</Link>
          <Link to="/products?category=Dairy">Dairy</Link>
          <Link to="/products?category=Organic">Organic</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <p>📍 Dhaka, Bangladesh</p>
          <p>📞 01700-000000</p>
          <p>✉️ support@greenbasket.com</p>
        </div>
      </div>
      <div className="footer-bottom container">
        <p>© 2026 GreenBasket. All rights reserved.</p>
      </div>
    </footer>
  );
}
