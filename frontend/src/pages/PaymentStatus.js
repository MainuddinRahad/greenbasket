import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../utils/api';

export function PaymentSuccess() {
  const [params] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const sandbox = params.get('sandbox') === 'true';
  const orderId = params.get('orderId');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      setLoading(true);
      try {
        const { data } = await API.get(`/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        setError('Unable to verify order details. Please check your order history.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const paymentStatus = order?.paymentStatus || (sandbox ? 'Paid' : 'Pending');
  const displayMessage = paymentStatus === 'Paid' ? 'Payment Successful!' : 'Payment processing...';

  return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: 80 }}>{paymentStatus === 'Paid' ? '✅' : '⏳'}</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#2d7a22', margin: '16px 0 8px' }}>{displayMessage}</h1>
      <p style={{ color: '#757575', fontSize: 16, marginBottom: 8 }}>
        Order #{orderId?.slice(-8).toUpperCase()} {order ? `is ${paymentStatus.toLowerCase()}.` : 'is being verified.'}
      </p>
      {sandbox && (
        <p style={{ color: '#f57c00', fontSize: 15, marginBottom: 28 }}>
          This is a sandbox/demo payment. The order is marked paid for testing purposes.
        </p>
      )}
      {!sandbox && paymentStatus === 'Paid' && (
        <p style={{ color: '#757575', fontSize: 15, marginBottom: 28 }}>We'll deliver fresh groceries to your door!</p>
      )}
      {error && (
        <p style={{ color: '#c62828', fontSize: 15, marginBottom: 28 }}>{error}</p>
      )}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/orders" className="btn-primary">Track My Order</Link>
        <Link to="/products" className="btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
}

export function PaymentFail() {
  const [params] = useSearchParams();
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: 80 }}>❌</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#c62828', margin: '16px 0 8px' }}>Payment Failed</h1>
      <p style={{ color: '#757575', fontSize: 15, marginBottom: 28 }}>
        Order #{params.get('orderId')?.slice(-8).toUpperCase()} — Your payment was not completed.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Link to="/cart" className="btn-primary">Try Again</Link>
        <Link to="/" className="btn-outline">Go Home</Link>
      </div>
    </div>
  );
}

export function PaymentCancel() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: 80 }}>🚫</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#e65100', margin: '16px 0 8px' }}>Payment Cancelled</h1>
      <p style={{ color: '#757575', fontSize: 15, marginBottom: 28 }}>You cancelled the payment. Your cart is still saved.</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Link to="/cart" className="btn-primary">Back to Cart</Link>
        <Link to="/" className="btn-outline">Go Home</Link>
      </div>
    </div>
  );
}
