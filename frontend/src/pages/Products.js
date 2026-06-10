import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import ProductCard from '../components/common/ProductCard';
import { useAuth } from '../context/AuthContext';
import './Products.css';

const categories = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Meat & Fish', 'Bakery', 'Beverages', 'Snacks', 'Organic'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || '';

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category && category !== 'All') params.category = category;
    if (sort) params.sort = sort;
    API.get('/products', { params }).then((res) => {
      setProducts(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search, category, sort]);

  useEffect(() => {
    if (user) {
      API.get('/wishlist')
        .then((res) => {
          setWishlistIds(res.data.products?.map((p) => p._id || p) || []);
        })
        .catch(() => {
          setWishlistIds([]);
        });
    }
  }, [user]);

  const setParam = (key, val) => {
    const p = Object.fromEntries(searchParams.entries());
    if (val) p[key] = val; else delete p[key];
    setSearchParams(p);
  };

  const handleWishlistToggle = (id) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="products-page container">
      <div className="products-header">
        <h1>All Products {category !== 'All' && `— ${category}`}</h1>
        <span className="product-count">{products.length} items</span>
      </div>

      <div className="products-layout">
        <aside className="filter-panel">
          <h3>Categories</h3>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setParam('category', cat === 'All' ? '' : cat)}
            >
              {cat}
            </button>
          ))}
          <h3 style={{ marginTop: 24 }}>Sort By</h3>
          {[
            { val: '', label: 'Newest' },
            { val: 'price_asc', label: 'Price: Low to High' },
            { val: 'price_desc', label: 'Price: High to Low' },
            { val: 'rating', label: 'Top Rated' },
          ].map((s) => (
            <button
              key={s.val}
              className={`filter-btn ${sort === s.val ? 'active' : ''}`}
              onClick={() => setParam('sort', s.val)}
            >
              {s.label}
            </button>
          ))}
        </aside>

        <main className="products-main">
          {loading ? (
            <div className="page-loader"><div className="spinner"></div></div>
          ) : products.length === 0 ? (
            <div className="no-products">
              <p>😕 No products found.</p>
              <button className="btn-primary" onClick={() => setSearchParams({})}>Clear Filters</button>
            </div>
          ) : (
            <div className="products-grid-main">
              {products.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  wishlistIds={wishlistIds}
                  onWishlistToggle={handleWishlistToggle}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
