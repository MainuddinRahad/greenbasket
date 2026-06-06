import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { toast } from 'react-toastify';
import './Checkout.css';

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const shippingPrice = totalPrice > 500 ? 0 : 60;
  const grandTotal = totalPrice + shippingPrice;

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: 'Dhaka',
    postalCode: '1000',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return toast.error('Cart is empty');
    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map((x) => ({
          product: x._id,
          name: x.name,
          image: x.image,
          price: x.price,
          qty: x.qty,
        })),
        shippingAddress: form,
        itemsPrice: totalPrice,
        shippingPrice,
        totalPrice: grandTotal,
      };
      const { data: order } = await API.post('/orders', orderData);

      const { data: payment } = await API.post('/payment/init', { orderId: order._id });
      clearCart();
      window.location.href = payment.url;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page container">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <form className="shipping-form" onSubmit={handlePlaceOrder}>
          <h2>Shipping Information</h2>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Your full name" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input name="phone" value={form.phone} onChange={handleChange} required placeholder="01XXXXXXXXX" />
          </div>
          <div className="form-group">
            <label>Delivery Address</label>
            <textarea name="address" value={form.address} onChange={handleChange} required placeholder="House/Road/Area" rows={3} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <select name="city" value={form.city} onChange={handleChange}>
                <option>Dhaka</option>
                <option>Chittagong</option>
                <option>Sylhet</option>
                <option>Rajshahi</option>
                <option>Khulna</option>
              </select>
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="1000" />
            </div>
          </div>

          <h2 style={{ marginTop: 28 }}>Payment Method</h2>
          <div className="payment-method">
            <div className="payment-option active">
              <span>💳 SSLCommerz (Card / bKash / Nagad)</span>
            </div>
          </div>

          <button type="submit" className="btn-primary place-order-btn" disabled={loading}>
            {loading ? 'Redirecting to payment...' : `Place Order — ৳${grandTotal.toLocaleString()}`}
          </button>
        </form>

        <div className="order-review">
          <h2>Order Review</h2>
          {cartItems.map((item) => (
            <div key={item._id} className="review-item">
              <img src={item.image} alt={item.name} />
              <div className="review-item-info">
                <span>{item.name}</span>
                <span className="muted">x{item.qty}</span>
              </div>
              <span className="review-item-price">৳{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
          <div className="review-totals">
            <div className="summary-row"><span>Subtotal</span><span>৳{totalPrice.toLocaleString()}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shippingPrice === 0 ? 'FREE' : `৳${shippingPrice}`}</span></div>
            <div className="summary-row total"><span>Total</span><span>৳{grandTotal.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
