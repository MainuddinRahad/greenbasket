import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Admin.css';

const statusColor = { Processing: '#ff9800', Confirmed: '#2196f3', Shipped: '#9c27b0', Delivered: '#4caf50', Cancelled: '#f44336' };

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.isAdmin) { navigate('/'); return; }
    loadData();
  }, [tab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (tab === 'overview') {
        const { data } = await API.get('/admin/stats');
        setStats(data);
      } else if (tab === 'products') {
        const { data } = await API.get('/products');
        setProducts(data);
      } else if (tab === 'orders') {
        const { data } = await API.get('/orders');
        setOrders(data);
      } else if (tab === 'users') {
        const { data } = await API.get('/admin/users');
        setUsers(data);
      }
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await API.delete(`/products/${id}`);
    setProducts((p) => p.filter((x) => x._id !== id));
    toast.success('Product deleted');
  };

  const updateOrderStatus = async (id, status) => {
    await API.put(`/orders/${id}/status`, { orderStatus: status });
    setOrders((o) => o.map((x) => x._id === id ? { ...x, orderStatus: status } : x));
    toast.success('Order status updated');
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await API.delete(`/admin/users/${id}`);
    setUsers((u) => u.filter((x) => x._id !== id));
    toast.success('User deleted');
  };

  return (
    <div className="admin-page container">
      <div className="admin-header">
        <h1>⚙️ Admin Dashboard</h1>
        <Link to="/" className="btn-outline" style={{ fontSize: 13, padding: '6px 14px' }}>← Back to Site</Link>
      </div>

      <div className="admin-tabs">
        {['overview', 'products', 'orders', 'users'].map((t) => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <div className="page-loader"><div className="spinner"></div></div> : (
        <>
          {tab === 'overview' && (
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">👥</span>
                <div><h3>{stats.totalUsers}</h3><p>Total Users</p></div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🛍️</span>
                <div><h3>{stats.totalProducts}</h3><p>Products</p></div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📦</span>
                <div><h3>{stats.totalOrders}</h3><p>Orders</p></div>
              </div>
              <div className="stat-card green">
                <span className="stat-icon">💰</span>
                <div><h3>৳{stats.totalRevenue?.toLocaleString()}</h3><p>Revenue</p></div>
              </div>
            </div>
          )}

          {tab === 'products' && (
            <div className="admin-table-wrap">
              <div className="table-header">
                <h2>Products</h2>
                <Link to="/admin/products/new" className="btn-primary" style={{ fontSize: 13, padding: '7px 16px' }}>+ Add Product</Link>
              </div>
              <table className="admin-table">
                <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td><img src={p.image} alt={p.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} /></td>
                      <td><strong>{p.name}</strong></td>
                      <td><span className="cat-pill">{p.category}</span></td>
                      <td>৳{p.price}</td>
                      <td><span className={p.stock === 0 ? 'out-stock' : 'in-stock'}>{p.stock}</span></td>
                      <td className="action-btns">
                        <Link to={`/admin/products/edit/${p._id}`} className="edit-btn">Edit</Link>
                        <button className="del-btn" onClick={() => deleteProduct(p._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'orders' && (
            <div className="admin-table-wrap">
              <h2>All Orders</h2>
              <table className="admin-table">
                <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Update</th></tr></thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td><strong>#{o._id.slice(-8).toUpperCase()}</strong></td>
                      <td>{o.user?.name || 'N/A'}</td>
                      <td>৳{o.totalPrice.toLocaleString()}</td>
                      <td><span style={{ color: o.paymentStatus === 'Paid' ? '#4caf50' : '#ff9800', fontWeight: 700 }}>{o.paymentStatus}</span></td>
                      <td><span className="status-pill" style={{ background: statusColor[o.orderStatus] + '22', color: statusColor[o.orderStatus] }}>{o.orderStatus}</span></td>
                      <td>
                        <select value={o.orderStatus} onChange={(e) => updateOrderStatus(o._id, e.target.value)} className="status-select">
                          {['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'users' && (
            <div className="admin-table-wrap">
              <h2>All Users</h2>
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Action</th></tr></thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td><span className={u.isAdmin ? 'admin-badge' : 'user-badge'}>{u.isAdmin ? 'Admin' : 'User'}</span></td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>{!u.isAdmin && <button className="del-btn" onClick={() => deleteUser(u._id)}>Delete</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
