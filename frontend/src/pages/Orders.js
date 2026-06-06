import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Orders.css';

const statusSteps = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];
const statusColor = { Processing: '#ff9800', Confirmed: '#2196f3', Shipped: '#9c27b0', Delivered: '#4caf50', Cancelled: '#f44336' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      API.get('/orders/my').then((res) => {
        setOrders(res.data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user]);

  if (!user) return (
    <div className="orders-empty container">
      <h2>Please login to view orders</h2>
      <Link to="/login" className="btn-primary">Login</Link>
    </div>
  );

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;

  return (
    <div className="orders-page container">
      <h1>My Orders 📦</h1>
      {orders.length === 0 ? (
        <div className="orders-empty">
          <h2>No orders yet</h2>
          <Link to="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-card-header">
              <div>
                <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="order-right">
                <span className="order-total">৳{order.totalPrice.toLocaleString()}</span>
                <span className="status-badge" style={{ background: statusColor[order.orderStatus] + '22', color: statusColor[order.orderStatus] }}>
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {order.orderStatus !== 'Cancelled' && (
              <div className="tracking-bar">
                {statusSteps.map((step, i) => {
                  const currentIdx = statusSteps.indexOf(order.orderStatus);
                  const done = i <= currentIdx;
                  return (
                    <div key={step} className={`tracking-step ${done ? 'done' : ''}`}>
                      <div className="step-dot">{done ? '✓' : i + 1}</div>
                      <span>{step}</span>
                      {i < statusSteps.length - 1 && <div className={`step-line ${i < currentIdx ? 'done' : ''}`} />}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="order-items-list">
              {order.items.map((item, idx) => (
                <div key={idx} className="order-item-row">
                  <img src={item.image} alt={item.name} />
                  <span>{item.name}</span>
                  <span className="muted">x{item.qty}</span>
                  <span>৳{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="payment-status">
                Payment: <span style={{ color: order.paymentStatus === 'Paid' ? '#4caf50' : '#ff9800', fontWeight: 700 }}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="delivery-address">
                📍 {order.shippingAddress.address}, {order.shippingAddress.city}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
