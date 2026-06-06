import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import API from '../../utils/api';
import './ProductCard.css';

export default function ProductCard({ product, wishlistIds = [], onWishlistToggle }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const isWished = wishlistIds.includes(product._id);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = async () => {
    if (!user) return toast.info('Please login to use wishlist');
    try {
      await API.post('/wishlist/toggle', { productId: product._id });
      onWishlistToggle && onWishlistToggle(product._id);
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-card">
      {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
      <button className={`wishlist-btn ${isWished ? 'active' : ''}`} onClick={handleWishlist}>
        <FiHeart />
      </button>
      <Link to={`/products/${product._id}`}>
        <img src={product.image} alt={product.name} className="product-img" />
      </Link>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <Link to={`/products/${product._id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <div className="product-rating">
          <FiStar size={13} fill="#ffa000" color="#ffa000" />
          <span>{product.rating?.toFixed(1) || '0.0'}</span>
          <span className="muted">({product.numReviews})</span>
        </div>
        <div className="product-price-row">
          <div>
            <span className="product-price">৳{product.price}</span>
            <span className="product-unit">/{product.unit}</span>
            {product.originalPrice > product.price && (
              <span className="original-price">৳{product.originalPrice}</span>
            )}
          </div>
          <button className="add-cart-btn" onClick={handleAddToCart} disabled={product.stock === 0}>
            {product.stock === 0 ? 'Out' : <FiShoppingCart size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
