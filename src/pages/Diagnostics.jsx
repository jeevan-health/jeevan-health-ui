import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, Flask, ShoppingCart, Plus, Minus, Trash, CheckCircle, Clock, Info } from '@phosphor-icons/react';
import { searchTests, getTestCategories, getTestSubcategories, placeDiagnosticOrder } from '../services/diagnosticsService';
import useAuthStore from '../store/authStore';

export default function Diagnostics() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);

  const [tests, setTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [collectionDate, setCollectionDate] = useState('');
  const [collectionTime, setCollectionTime] = useState('');
  const [address, setAddress] = useState({ line1: '', city: '', pincode: '' });
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.name = search;
      if (category) params.category = category;
      const { data } = await searchTests(params);
      setTests(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => {
    load();
    getTestCategories().then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [search, category]);

  const addToCart = (test) => {
    setCart(prev => {
      if (prev.find(i => i.id === test.id)) return prev;
      return [...prev, { ...test, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const cartTotal = cart.reduce((sum, i) => sum + i.price, 0);

  const handlePlace = async () => {
    if (!isAuthenticated) { navigate('/signup'); return; }
    setPlacing(true);
    try {
      const { data } = await placeDiagnosticOrder({
        tests: cart.map(i => ({ testId: i.id, name: i.name, price: i.price })),
        totalAmount: cartTotal,
        collectionDate: collectionDate || null,
        collectionTime: collectionTime || null,
        collectionAddress: address.city ? address : null,
      });
      setPlaced(true);
    } catch {} finally { setPlacing(false); }
  };

  if (placed) return (
    <section className="page-section">
      <div className="card p-10 text-center" style={{ maxWidth: 480, margin: '40px auto' }}>
        <CheckCircle size={48} weight="fill" color="#2e7d32" style={{ marginBottom: 12 }} />
        <h2>Test Booked!</h2>
        <p style={{ color: 'var(--text-light)', marginTop: 8 }}>Your sample collection has been scheduled.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
          <button onClick={() => navigate('/my-test-orders')} className="btn-primary">Track Order</button>
          <button onClick={() => { setPlaced(false); setCart([]); setShowForm(false); }} className="btn-outline">Book More Tests</button>
        </div>
      </div>
    </section>
  );

  return (
    <section className="page-section">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1>Lab Tests at Home</h1>
            <p style={{ margin: 0 }}>Book tests, home collection, digital reports.</p>
          </div>
          <button onClick={() => navigate('/my-test-orders')} className="btn-outline" style={{ padding: '8px 16px', fontSize: 13 }}>
            My Orders
          </button>
        </div>

        {/* Categories */}
        <div className="scroll-row" style={{ margin: '16px 0' }}>
          {['All', ...categories].map(c => (
            <button key={c} onClick={() => setCategory(c === 'All' ? '' : c)}
              style={{
                padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
                background: (category === c || (!c && category === '')) ? 'var(--primary)' : '#fff',
                color: (category === c || (!c && category === '')) ? '#fff' : 'var(--text-body)',
                border: '1px solid var(--border)',
              }}>
              {c}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <MagnifyingGlass size={18} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-light)' }} />
          <input type="text" placeholder="Search tests (e.g., CBC, Thyroid, Lipid)..." value={search}
            onChange={e => setSearch(e.target.value)} className="input" style={{ paddingLeft: 38 }} />
        </div>

        {/* Cart bar */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, padding: '12px 16px', background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <ShoppingCart size={20} color="var(--primary)" />
          <span style={{ fontSize: 14, fontWeight: 600 }}>{cart.length} tests</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>₹{cartTotal}</span>
          <button onClick={() => setShowCart(!showCart)} style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500, background: 'none' }}>
            {showCart ? 'Hide' : 'View'} Cart
          </button>
          {cart.length > 0 && (
            <button onClick={() => isAuthenticated ? setShowForm(true) : navigate('/signup')}
              className="btn-accent" style={{ padding: '6px 16px', fontSize: 13, marginLeft: 'auto', width: 'auto' }}>
              Book Tests
            </button>
          )}
        </div>

        {/* Cart dropdown */}
        {showCart && cart.length > 0 && (
          <div className="card p-4" style={{ marginBottom: 16 }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <Flask size={20} color="var(--primary)" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-light)' }}>{item.category}</p>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>₹{item.price}</span>
                <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--text-light)', padding: 4, background: 'none' }}><Trash size={16} /></button>
              </div>
            ))}
          </div>
        )}

        {/* Booking Form */}
        {showForm && (
          <div className="card p-5" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, marginBottom: 12 }}>Schedule Home Collection</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12 }}>Collection Date</label>
                  <input type="date" value={collectionDate} min={new Date().toISOString().split('T')[0]}
                    onChange={e => setCollectionDate(e.target.value)} className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12 }}>Preferred Time</label>
                  <select value={collectionTime} onChange={e => setCollectionTime(e.target.value)} className="input" style={{ padding: '8px 10px', fontSize: 13 }}>
                    <option value="">Select time</option>
                    {['6:00 AM - 8:00 AM', '8:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '12:00 PM - 2:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM', '6:00 PM - 8:00 PM'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <input placeholder="Address" value={address.line1} onChange={e => setAddress({ ...address, line1: e.target.value })} className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
                <input placeholder="PIN Code" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
              </div>
              <button onClick={handlePlace} disabled={placing} className="btn btn-accent" style={{ marginTop: 8 }}>
                {placing ? 'Booking...' : `Book ${cart.length} Test${cart.length > 1 ? 's' : ''} — ₹${cartTotal}`}
              </button>
            </div>
          </div>
        )}

        {/* Test Grid */}
        {loading ? (
          <div className="card p-10 text-center">Loading tests...</div>
        ) : tests.length === 0 ? (
          <div className="card p-10 text-center">
            <Flask size={32} style={{ color: 'var(--text-light)', marginBottom: 8 }} />
            <p style={{ color: 'var(--text-light)' }}>No tests found.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {tests.map(test => {
              const inCart = cart.find(i => i.id === test.id);
              return (
                <div key={test.id} className="card" style={{ padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: 14, margin: 0 }}>{test.name}</h3>
                      <p style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 500, marginTop: 2 }}>{test.subcategory}</p>
                    </div>
                    <button title="Test info" style={{ color: 'var(--text-light)', background: 'none', padding: 2 }}>
                      <Info size={16} />
                    </button>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 6, lineHeight: 1.4 }}>{test.description}</p>
                  <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap', fontSize: 12, color: 'var(--text-secondary)' }}>
                    {test.fasting_required && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> Fasting required</span>}
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {test.report_time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>₹{test.price}</span>
                    {inCart ? (
                      <button onClick={() => removeFromCart(test.id)}
                        style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: '#fbe9e7', color: '#c62828', border: 'none' }}>
                        <Trash size={14} /> Remove
                      </button>
                    ) : (
                      <button onClick={() => addToCart(test)}
                        className="btn-primary" style={{ padding: '6px 14px', fontSize: 12 }}>
                        <Plus size={14} /> Add
                      </button>
                    )}
                  </div>
                  {test.preparation_instructions && (
                    <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 6, padding: '6px 8px', background: '#fff8e1', borderRadius: 4 }}>
                      <Info size={12} /> {test.preparation_instructions}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
