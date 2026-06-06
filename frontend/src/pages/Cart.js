import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Cart.css';

export default function Cart() {
  const { cartItems, removeFromCart, updateQty, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shippingPrice = totalPrice > 500 ? 0 : 60;
  const grandTotal = totalPrice + shippingPrice;

  const handleCheckout = () => {
    if (!user) {
      toast.info('Please login to checkout');
      return navigate('/login');
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart container">
        <FiShoppingBag size={80} color="#ccc" />
        <h2>Your cart is empty!</h2>
        <p>Add some fresh groceries to get started.</p>
        <Link to="/products" className="btn-primary">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <div className="cart-header">
        <Link to="/products" className="back-link"><FiArrowLeft /> Continue Shopping</Link>
        <h1>Shopping Cart</h1>
        <button className="clear-btn" onClick={clearCart}>Clear All</button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="item-info">
                <h3>{item.name}</h3>
                <span className="item-category">{item.category}</span>
                <span className="item-price">৳{item.price}/{item.unit}</span>
              </div>
              <div className="item-qty">
                <button onClick={() => updateQty(item._id, item.qty - 1)}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
              </div>
              <div className="item-total">৳{(item.price * item.qty).toLocaleString()}</div>
              <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>৳{totalPrice.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingPrice === 0 ? <span className="free">FREE</span> : `৳${shippingPrice}`}</span>
          </div>
          {shippingPrice > 0 && (
            <p className="free-shipping-note">🎉 Add ৳{500 - totalPrice} more for free shipping!</p>
          )}
          <div className="summary-divider" />
          <div className="summary-row total">
            <span>Total</span>
            <span>৳{grandTotal.toLocaleString()}</span>
          </div>
          <button className="btn-primary checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
