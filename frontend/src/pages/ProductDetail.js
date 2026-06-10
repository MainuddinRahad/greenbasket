import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiHeart, FiArrowLeft } from 'react-icons/fi';
import API from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    API.get(`/products/${id}`)
      .then((res) => {
        if (!active) return;
        setProduct(res.data);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.response?.data?.message || 'Unable to load this product right now.');
        setProduct(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = async () => {
    if (!user) return toast.info('Please login');
    await API.post('/wishlist/toggle', { productId: id });
    toast.success('Wishlist updated!');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.info('Please login to review');
    try {
      await API.post(`/products/${id}/reviews`, { rating: reviewRating, comment: reviewText });
      toast.success('Review submitted!');
      setReviewText('');
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;

  if (error || !product) {
    return (
      <div className="product-detail container">
        <Link to="/products" className="back-link"><FiArrowLeft /> Back to Products</Link>
        <div className="detail-error-card">
          <h1>Product not available</h1>
          <p>{error || 'The product could not be loaded.'}</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail container">
      <Link to="/products" className="back-link"><FiArrowLeft /> Back to Products</Link>

      <div className="detail-grid">
        <div className="detail-image-wrap">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="detail-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>

          <div className="detail-rating">
            {[1,2,3,4,5].map((s) => (
              <FiStar key={s} size={16} fill={s <= Math.round(product.rating) ? '#ffa000' : 'none'} color="#ffa000" />
            ))}
            <span>{product.rating?.toFixed(1)}</span>
            <span className="muted">({product.numReviews} reviews)</span>
          </div>

          <div className="detail-price">
            <span className="big-price">৳{product.price}</span>
            <span className="unit-label">/ {product.unit}</span>
            {product.originalPrice > product.price && (
              <span className="orig-price">৳{product.originalPrice}</span>
            )}
          </div>

          <p className="detail-desc">{product.description}</p>

          <div className="detail-stock">
            {product.stock > 0 ? (
              <span className="in-stock">✅ In Stock ({product.stock} {product.unit} available)</span>
            ) : (
              <span className="out-stock">❌ Out of Stock</span>
            )}
          </div>

          <div className="detail-actions">
            <div className="qty-control">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
            </div>
            <button className="btn-primary" onClick={handleAddToCart} disabled={product.stock === 0}>
              <FiShoppingCart /> Add to Cart
            </button>
            <button className="btn-outline" onClick={handleWishlist}>
              <FiHeart /> Wishlist
            </button>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Customer Reviews</h2>

        {user && (
          <form className="review-form" onSubmit={handleReview}>
            <h3>Write a Review</h3>
            <div className="star-select">
              {[1,2,3,4,5].map((s) => (
                <button type="button" key={s} onClick={() => setReviewRating(s)}>
                  <FiStar fill={s <= reviewRating ? '#ffa000' : 'none'} color="#ffa000" size={24} />
                </button>
              ))}
            </div>
            <textarea
              placeholder="Share your experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
              rows={3}
            />
            <button type="submit" className="btn-primary">Submit Review</button>
          </form>
        )}

        {product.reviews?.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        ) : (
          product.reviews?.map((r) => (
            <div key={r._id} className="review-card">
              <div className="review-header">
                <span className="reviewer-name">{r.name}</span>
                <div className="review-stars">
                  {[1,2,3,4,5].map((s) => (
                    <FiStar key={s} size={13} fill={s <= r.rating ? '#ffa000' : 'none'} color="#ffa000" />
                  ))}
                </div>
              </div>
              <p>{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
