import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../../utils/api';
import { toast } from 'react-toastify';
import './Admin.css';

const categories = ['Vegetables', 'Fruits', 'Dairy', 'Meat & Fish', 'Bakery', 'Beverages', 'Snacks', 'Organic'];

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', originalPrice: '',
    category: 'Vegetables', image: '', stock: '', unit: 'kg', isFeatured: false,
  });

  useEffect(() => {
    if (isEdit) {
      API.get(`/products/${id}`).then((res) => setForm(res.data));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await API.put(`/products/${id}`, form);
        toast.success('Product updated!');
      } else {
        await API.post('/products', form);
        toast.success('Product created!');
      }
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page container">
      <div className="admin-header">
        <h1>{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        <Link to="/admin" className="btn-outline" style={{ fontSize: 13, padding: '6px 14px' }}>← Back</Link>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 28, maxWidth: 680 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Fresh Broccoli" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={3} placeholder="Product description..." style={{ width: '100%', border: '1.5px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 14, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Price (৳)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" />
            </div>
            <div className="form-group">
              <label>Original Price (৳)</label>
              <input type="number" name="originalPrice" value={form.originalPrice} onChange={handleChange} min="0" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange} style={{ width: '100%', border: '1.5px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 14 }}>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Unit</label>
              <input name="unit" value={form.unit} onChange={handleChange} placeholder="kg / piece / liter" />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} min="0" />
            </div>
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
            {form.image && <img src={form.image} alt="preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <input type="checkbox" id="isFeatured" name="isFeatured" checked={form.isFeatured} onChange={handleChange} style={{ width: 18, height: 18 }} />
            <label htmlFor="isFeatured" style={{ fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Show on Homepage (Featured)</label>
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '12px 32px' }} disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
