import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlass, Flask, ShoppingCart, Plus, Trash, CheckCircle, Clock, Info,
  Heartbeat, Heart, Drop, Shield, Bone, Baby, User,
  Microscope, Truck, Sparkle,
  CaretRight, FileText, CalendarDots, ChatCircle,
} from '@phosphor-icons/react';
import TestDetailModal from '../components/test/TestDetailModal';
import useAuthStore from '../store/authStore';

const categoryList = [
  { name: 'Full Body', icon: User, color: '#0B4FA8' },
  { name: 'Heart', icon: Heartbeat, color: '#e53935', mostBooked: true },
  { name: 'Fever', icon: Drop, color: '#ff6f00', ticker: '20,186 Chikungunya cases • 6,927 Dengue cases • 19,422 Malaria cases • 4,08,000 Typhoid cases' },
  { name: 'Vitamin', icon: Sparkle, color: '#00acc1' },
  { name: 'Diabetes', icon: Drop, color: '#1e88e5' },
  { name: 'Thyroid', icon: Shield, color: '#8e24aa' },
  { name: 'Hormones', icon: Drop, color: '#d81b60' },
  { name: 'Lifestyle', icon: Heart, color: '#43a047' },
  { name: 'Cancer', icon: Shield, color: '#e53935' },
  { name: 'Combo', icon: Flask, color: '#6d4c41' },
  { name: 'Pregnancy', icon: Baby, color: '#ec407a' },
  { name: 'Allergy', icon: Shield, color: '#7e57c2' },
  { name: 'Arthritis', icon: Bone, color: '#5d4037' },
  { name: 'STD', icon: Shield, color: '#c62828' },
  { name: 'Anemia', icon: Drop, color: '#c62828' },
  { name: 'Antenatal', icon: Baby, color: '#f06292' },
];

const categoryFilterMap = {
  'Full Body': '', 'Heart': 'Cardiac', 'Fever': 'Infections', 'Vitamin': 'Vitamins',
  'Diabetes': 'Diabetes', 'Thyroid': 'Thyroid', 'Hormones': 'Hormones', 'Lifestyle': '',
  'Cancer': 'Cancer', 'Combo': '', 'Pregnancy': 'Hormones', 'Allergy': 'Infections',
  'Arthritis': '', 'STD': 'Infections', 'Anemia': 'Hematology', 'Antenatal': 'Hormones',
};

const stats = [
  { value: '1 Crore+', label: 'Lives Touched' },
  { value: '2,000+', label: 'Lab Tests Available' },
  { value: '50+', label: 'Collection Centres' },
  { value: '500+', label: 'Trained Phlebotomists' },
];

const healthPackages = [
  { name: 'Basic Health Checkup', tests: '30+ Tests', price: 999, oldPrice: 2499 },
  { name: 'Essential Wellness', tests: '45+ Tests', price: 1499, oldPrice: 3749 },
  { name: 'Executive Health', tests: '60+ Tests', price: 2499, oldPrice: 6249 },
  { name: 'Full Body Checkup', tests: '85+ Tests', price: 3999, oldPrice: 9999 },
  { name: 'Diabetes Care Package', tests: '25+ Tests', price: 1299, oldPrice: 3249 },
  { name: 'Cardiac Health Check', tests: '35+ Tests', price: 1999, oldPrice: 4999 },
  { name: 'Liver Function Panel', tests: '15+ Tests', price: 899, oldPrice: 2249 },
  { name: 'Women\'s Wellness', tests: '40+ Tests', price: 1799, oldPrice: 4499 },
];

const testimonials = [
  { name: 'Meera Sharma', place: 'Delhi', text: 'The sample collection was smooth and hygienic. I received detailed reports within 12 hours, helping me consult my doctor promptly.' },
  { name: 'Raj Patel', place: 'Bangalore', text: 'I received detailed and understandable reports. The free doctor consultation was a great addition, helping me interpret results effectively.' },
  { name: 'Anjali Singh', place: 'Agra', text: 'The sample collector was punctual, hygienic, and polite. The sealed collection kit assured me of their professionalism.' },
];

export default function Diagnostics() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [collectionDate, setCollectionDate] = useState('');
  const [collectionTime, setCollectionTime] = useState('');
  const [address, setAddress] = useState({ line1: '', city: '', pincode: '' });
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [showAllTests, setShowAllTests] = useState(false);

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
      await placeDiagnosticOrder({
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
    <section style={{ padding: '60px 20px', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <CheckCircle size={32} weight="fill" color="#2e7d32" />
      </div>
      <h2>Test Booked Successfully!</h2>
      <p style={{ color: 'var(--text-light)', marginTop: 8 }}>Your home sample collection has been scheduled.</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
        <button onClick={() => navigate('/my-test-orders')} className="btn-primary">Track Order</button>
        <button onClick={() => { setPlaced(false); setCart([]); setShowForm(false); }} className="btn-outline">Book More Tests</button>
      </div>
    </section>
  );

  return (
    <>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0B4FA8 0%, #0C6BC4 100%)',
        padding: '48px 20px 40px', textAlign: 'center',
      }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <h1 style={{ color: '#fff', fontSize: 32, marginBottom: 8 }}>Looking for a Test?</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, marginBottom: 24 }}>
            Book diagnostic tests at home — accurate reports, doorstep collection
          </p>
          <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
            <MagnifyingGlass size={20} style={{ position: 'absolute', left: 16, top: 14, color: '#0B4FA8' }} />
            <input type="text" placeholder="Search tests (e.g., CBC, Thyroid, Lipid)..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '14px 16px 14px 48px', borderRadius: 50,
                border: 'none', fontSize: 15, outline: 'none', background: '#fff',
                fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }} />
          </div>
        </div>
      </div>

      <div style={{ padding: '28px 20px' }}>
        <div className="container">
          {/* Category Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12, marginBottom: 36 }}>
            {categoryList.map(c => {
              const Icon = c.icon;
              const isActive = category === categoryFilterMap[c.name];
              return (
                <button key={c.name} onClick={() => { setCategory(isActive ? '' : categoryFilterMap[c.name]); setShowAllTests(true); }}
                  style={{
                    background: isActive ? '#0B4FA8' : '#fff', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)', padding: '16px 8px', textAlign: 'center',
                    cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit', position: 'relative',
                  }}>
                  {c.mostBooked && (
                    <span style={{ position: 'absolute', top: -6, right: 6, fontSize: 8, fontWeight: 700, background: '#00FFFF', color: '#083d86', padding: '1px 6px', borderRadius: 4 }}>
                      MOST BOOKED
                    </span>
                  )}
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: isActive ? 'rgba(255,255,255,0.2)' : '#e8f0fe',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 8px',
                  }}>
                    <Icon size={22} weight="fill" color={isActive ? '#fff' : c.color} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: isActive ? '#fff' : 'var(--text-dark)' }}>{c.name}</span>
                  {c.ticker && (
                    <div style={{ fontSize: 8, color: isActive ? 'rgba(255,255,255,0.7)' : '#888', marginTop: 4, lineHeight: 1.3 }}>
                      {c.ticker}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Top Booked Health Checkup Packages */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 20 }}>Top Booked Health Checkup Packages</h2>
              <button onClick={() => setShowAllTests(true)} style={{ color: '#0B4FA8', fontSize: 14, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                View All Tests
              </button>
            </div>
            <div className="scroll-row">
              {healthPackages.map(pkg => (
                <div key={pkg.name} className="test-card" style={{ width: 240 }}>
                  <div style={{ fontSize: 11, color: '#0B4FA8', fontWeight: 600, marginBottom: 4 }}>DOCTOR CURATED</div>
                  <h4 style={{ fontSize: 14 }}>{pkg.name}</h4>
                  <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 8 }}>{pkg.tests}</div>
                  <div className="pricing">
                    <span className="price-current">₹{pkg.price}</span>
                    <span className="price-old">₹{pkg.oldPrice}</span>
                    <span className="discount">60% off</span>
                  </div>
                  <button className="add-btn" onClick={() => setShowAllTests(true)}>Book Now</button>
                </div>
              ))}
            </div>
          </div>

          {/* Why Jeevan HealthCare */}
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, marginBottom: 20, textAlign: 'center' }}>Why Jeevan HealthCare?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {[
                { icon: FileText, title: 'Smart Reports', desc: 'Colour-coded insights & doctor-verified' },
                { icon: Truck, title: 'One-prick Collection', desc: 'by trained experts at your doorstep' },
                { icon: Shield, title: 'Temperature-controlled', desc: 'Sample transfer in certified bags' },
                { icon: Microscope, title: 'NABL Labs', desc: 'Processing under strict quality protocols' },
                { icon: ChatCircle, title: 'Free Expert Consultation', desc: 'With every test booked' },
                { icon: CalendarDots, title: 'Diet Plan', desc: 'Personalized for your health goals' },
              ].map(f => (
                <div key={f.title} style={{ textAlign: 'center', padding: 20, background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: '#0B4FA8' }}>
                    <f.icon size={22} weight="fill" />
                  </div>
                  <h3 style={{ fontSize: 14, marginBottom: 4 }}>{f.title}</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-light)' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 40 }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '20px 16px', background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#0B4FA8' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, marginBottom: 20, textAlign: 'center' }}>What Our Customers Say</h2>
            <div className="scroll-row">
              {testimonials.map(t => (
                <div key={t.name} style={{ width: 300, flexShrink: 0, padding: 20, background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0B4FA8', fontWeight: 700, fontSize: 14 }}>{t.name.charAt(0)}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{t.place}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-light)', lineHeight: 1.5 }}>"{t.text}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tests section */}
          {showAllTests && (
            <>
              {/* Cart bar */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, padding: '12px 16px', background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <ShoppingCart size={20} color="var(--primary)" />
                <span style={{ fontSize: 14, fontWeight: 600 }}>{cart.length} tests</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>₹{cartTotal}</span>
                <button onClick={() => setShowCart(!showCart)} style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
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
                <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 16, marginBottom: 16 }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                      <Flask size={20} color="var(--primary)" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</p>
                        <p style={{ fontSize: 12, color: 'var(--text-light)' }}>{item.category}</p>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>₹{item.price}</span>
                      <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--text-light)', padding: 4, background: 'none', border: 'none', cursor: 'pointer' }}><Trash size={16} /></button>
                    </div>
                  ))}
                </div>
              )}

              {/* Booking Form */}
              {showForm && (
                <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 20, marginBottom: 16 }}>
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
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-light)' }}>Loading tests...</div>
              ) : tests.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center' }}>
                  <Flask size={32} style={{ color: 'var(--text-light)', marginBottom: 8 }} />
                  <p style={{ color: 'var(--text-light)' }}>No tests found.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
                  {tests.map(test => {
                    const inCart = cart.find(i => i.id === test.id);
                    return (
                       <div key={test.id} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 style={{ fontSize: 14, margin: 0, cursor: 'pointer', color: '#0B4FA8' }} onClick={() => setSelectedTest(test)}>{test.name}</h3>
                            <p style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 500, marginTop: 2 }}>{test.subcategory}</p>
                          </div>
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
                              style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: '#fbe9e7', color: '#c62828', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
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
            </>
          )}

          {/* Custom Package */}
          {!showAllTests && (
            <div style={{ background: 'linear-gradient(135deg, #e8f0fe, #d4e4f7)', borderRadius: 'var(--radius-lg)', padding: '32px 24px', textAlign: 'center', marginBottom: 40 }}>
              <h2 style={{ fontSize: 18, marginBottom: 8 }}>Create Your Own Package</h2>
              <p style={{ fontSize: 14, color: 'var(--text-body)', marginBottom: 16, maxWidth: 500, margin: '0 auto 16px' }}>
                Customise your package based on tests you choose and get extra discounts
              </p>
              <button onClick={() => setShowAllTests(true)} className="btn-primary" style={{ padding: '12px 28px' }}>
                Create Now <CaretRight size={16} weight="bold" />
              </button>
            </div>
          )}
        </div>
      </div>

      <TestDetailModal test={selectedTest} onClose={() => setSelectedTest(null)} />
    </>
  );
}
