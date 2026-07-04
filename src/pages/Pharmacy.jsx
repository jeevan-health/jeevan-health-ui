import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, Pill, ShoppingCart, Plus, Minus, Trash, CheckCircle } from '@phosphor-icons/react';
import { searchMedicines, getMedCategories, placeOrder } from '../services/pharmacyService';
import useAuthStore from '../store/authStore';

export default function Pharmacy() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);

  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [prescriptionFilter, setPrescriptionFilter] = useState('');

  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const [showOrderForm, setShowOrderForm] = useState(false);
  const [address, setAddress] = useState({ line1: '', city: '', pincode: '' });
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.name = search;
      if (category) params.category = category;
      if (prescriptionFilter) params.prescription = prescriptionFilter;
      const { data } = await searchMedicines(params);
      setMedicines(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => {
    load();
    getMedCategories().then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [search, category, prescriptionFilter]);

  const addToCart = (med) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === med.id);
      if (existing) return prev.map(i => i.id === med.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...med, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) { navigate('/signup'); return; }
    setPlacing(true);
    try {
      await placeOrder({
        items: cart.map(i => ({ medicineId: i.id, name: i.name, price: i.price, qty: i.qty })),
        totalAmount: cartTotal,
        deliveryAddress: address,
        prescriptionUrl: prescriptionFile ? 'uploaded' : null,
        paymentMethod: 'COD',
      });
      setPlaced(true);
      setCart([]);
      setShowOrderForm(false);
    } catch {} finally { setPlacing(false); }
  };

  if (placed) return (
    <section className="page-section">
      <div className="card p-10 text-center" style={{ maxWidth: 480, margin: '40px auto' }}>
        <CheckCircle size={48} weight="fill" color="#2e7d32" style={{ marginBottom: 12 }} />
        <h2>Order Placed!</h2>
        <p style={{ color: 'var(--text-light)', marginTop: 8 }}>Your medicines will be delivered to your doorstep.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
          <button onClick={() => navigate('/my-orders')} className="btn-primary">Track Order</button>
          <button onClick={() => setPlaced(false)} className="btn-outline">Order More</button>
        </div>
      </div>
    </section>
  );

  return (
    <section className="page-section">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1>Pharmacy — Medicines Delivered</h1>
            <p style={{ margin: 0 }}>Search, order, and get medicines at your doorstep.</p>
          </div>
          <button onClick={() => navigate('/my-orders')} className="btn-outline" style={{ padding: '8px 16px', fontSize: 13 }}>
            My Orders
          </button>
        </div>

        {/* Cart bar */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '16px 0', padding: '12px 16px', background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <ShoppingCart size={20} color="var(--primary)" />
          <span style={{ fontSize: 14, fontWeight: 600 }}>{cartCount} items</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>₹{cartTotal}</span>
          <button onClick={() => setShowCart(!showCart)} style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500, background: 'none' }}>
            {showCart ? 'Hide' : 'View'} Cart
          </button>
          {cart.length > 0 && (
            <button onClick={() => isAuthenticated ? setShowOrderForm(true) : navigate('/signup')}
              className="btn-accent" style={{ padding: '6px 16px', fontSize: 13, marginLeft: 'auto', width: 'auto' }}>
              Place Order
            </button>
          )}
        </div>

        {/* Cart dropdown */}
        {showCart && cart.length > 0 && (
          <div className="card p-4" style={{ marginBottom: 16 }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-light)' }}>₹{item.price} each</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button onClick={() => updateQty(item.id, -1)} className="btn-outline" style={{ padding: '4px 8px', fontSize: 12 }}><Minus size={12} /></button>
                  <span style={{ fontSize: 14, fontWeight: 600, minWidth: 24, textAlign: 'center' }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="btn-primary" style={{ padding: '4px 8px', fontSize: 12 }}><Plus size={12} /></button>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, minWidth: 60, textAlign: 'right' }}>₹{item.price * item.qty}</span>
                <button onClick={() => removeItem(item.id)} style={{ color: 'var(--text-light)', padding: 4, background: 'none' }}><Trash size={16} /></button>
              </div>
            ))}
          </div>
        )}

        {/* Order form */}
        {showOrderForm && (
          <div className="card p-5" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, marginBottom: 12 }}>Delivery Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input placeholder="Address line" value={address.line1} onChange={e => setAddress({ ...address, line1: e.target.value })} className="input" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} className="input" />
                <input placeholder="PIN Code" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} className="input" />
              </div>
              <div>
                <label>Upload Prescription (if applicable)</label>
                <input type="file" accept="image/*,.pdf" onChange={e => setPrescriptionFile(e.target.files[0])} className="input" style={{ padding: 8 }} />
              </div>
              <button onClick={handlePlaceOrder} disabled={placing || !address.city} className="btn btn-accent" style={{ marginTop: 8 }}>
                {placing ? 'Placing...' : `Place Order — ₹${cartTotal}`}
              </button>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '16px 0' }}>
          <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
            <MagnifyingGlass size={18} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-light)' }} />
            <input type="text" placeholder="Search medicines..." value={search} onChange={e => setSearch(e.target.value)}
              className="input" style={{ paddingLeft: 38 }} />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)} className="input" style={{ width: 'auto', minWidth: 150 }}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={prescriptionFilter} onChange={e => setPrescriptionFilter(e.target.value)} className="input" style={{ width: 'auto', minWidth: 130 }}>
            <option value="">All Medicines</option>
            <option value="false">OTC Only</option>
            <option value="true">Prescription</option>
          </select>
        </div>

        {/* Results */}
        {loading ? (
          <div className="card p-10 text-center">Loading medicines...</div>
        ) : medicines.length === 0 ? (
          <div className="card p-10 text-center">
            <Pill size={32} style={{ color: 'var(--text-light)', marginBottom: 8 }} />
            <p style={{ color: 'var(--text-light)' }}>No medicines found.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {medicines.map(med => (
              <div key={med.id} className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 14, margin: 0 }}>{med.name}</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-light)' }}>{med.composition}</p>
                  </div>
                  {med.requires_prescription && (
                    <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: '#fff3e0', color: '#e65100', whiteSpace: 'nowrap' }}>Rx</span>
                  )}
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>{med.manufacturer}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>₹{med.price}</span>
                  {med.mrp > med.price && (
                    <span style={{ fontSize: 12, color: 'var(--text-light)', textDecoration: 'line-through' }}>₹{med.mrp}</span>
                  )}
                  {med.mrp > med.price && (
                    <span style={{ fontSize: 11, color: '#2e7d32', fontWeight: 600 }}>
                      {Math.round((1 - med.price / med.mrp) * 100)}% off
                    </span>
                  )}
                </div>
                <button onClick={() => addToCart(med)}
                  className="btn-primary" style={{ width: '100%', marginTop: 10, padding: '8px', fontSize: 13, justifyContent: 'center' }}>
                  <Plus size={16} /> Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
