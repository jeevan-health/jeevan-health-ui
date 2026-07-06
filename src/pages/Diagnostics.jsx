import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { seedTests } from '../data/seedData';
import {
  MagnifyingGlass, Flask, ShoppingCart, Trash, CheckCircle, Clock, MapPin,
  Heartbeat, Heart, Drop, Shield, Baby, User, Warning,
  Truck, Sparkle,
  CaretDown, FileText, CalendarDots, Gift,
  Lightbulb, Suitcase, Pill, Cloud, ForkKnife, Airplane, Briefcase, Coin, Moon, Leaf,
  Syringe, FirstAid, Globe, Lightning,
  Phone, WhatsappLogo, Star, ArrowRight, X,
} from '@phosphor-icons/react';
import useAuthStore from '../store/authStore';
import { getFamilyMembers } from '../services/authService';
import { placeDiagnosticOrder } from '../services/diagnosticsService';
import { createOrder as saveOrderLocally } from '../services/localOrderService';
import { getPackagesByAxis } from '../utils/packageGenerator';

const popularCategories = ['Full Body', 'Heart', 'Diabetes', 'Thyroid', 'Vitamin', 'Women Health', 'Senior Citizen', 'Corporate Health'];

const categoryFilterMap = {
  'Full Body': '', 'Heart': 'Cardiac', 'Fever': 'Infections', 'Vitamin': 'Vitamins',
  'Diabetes': 'Diabetes', 'Thyroid': 'Thyroid', 'Hormones': 'Hormones', 'Lifestyle': '',
  'Cancer': 'Cancer', 'Women Health': 'Hormones', 'Senior Citizen': '', 'Corporate Health': '',
};

const mostBookedPackages = [
  { name: 'Full Body Checkup', tests: 'CBC, LFT, KFT, Lipid, Thyroid, Vitamin D, HbA1c, Urine', price: 799, mrp: 2499, rating: 4.8, booked: '15,200+', emoji: '\u{1F3E5}' },
  { name: 'Diabetes Care Pack', tests: 'HbA1c, Fasting Sugar, Postprandial, Lipid, KFT, Urine Micro', price: 999, mrp: 2199, rating: 4.7, booked: '12,800+', emoji: '\u{1F489}' },
  { name: 'Thyroid Wellness', tests: 'TSH, T3, T4, Anti-TPO, Anti-Tg, Vitamin D, CBC', price: 699, mrp: 1799, rating: 4.6, booked: '9,400+', emoji: '\u{1F9EC}' },
  { name: 'Heart Health', tests: 'Lipid, hs-CRP, Homocysteine, ECG, Troponin, LFT', price: 1299, mrp: 2999, rating: 4.9, booked: '8,700+', emoji: '\u2764\uFE0F' },
  { name: 'Women Wellness', tests: 'CBC, Thyroid, Vitamin D, Iron, Pap Smear, Hormones', price: 1499, mrp: 3499, rating: 4.8, booked: '7,300+', emoji: '\u{1F469}' },
  { name: 'Senior Citizen', tests: 'CBC, LFT, KFT, Lipid, HbA1c, Vitamin B12, PSA/CA125', price: 999, mrp: 2999, rating: 4.7, booked: '11,600+', emoji: '\u{1F474}' },
];

const offers = [
  { title: 'Full Body Checkup', price: '\u20B9799 Only', mrp: '\u20B92,499', discount: '68% OFF', gradient: 'linear-gradient(135deg, #0F5DA8, #1a73e8)', emoji: '\u{1F3E5}', tag: 'Today Only' },
  { title: 'Diabetes Package', price: '\u20B9999', mrp: '\u20B92,199', discount: '55% OFF', gradient: 'linear-gradient(135deg, #1e88e5, #42a5f5)', emoji: '\u{1F489}', tag: 'Limited Slots' },
  { title: 'Thyroid Test Offer', price: '\u20B9499', mrp: '\u20B91,299', discount: '62% OFF', gradient: 'linear-gradient(135deg, #8e24aa, #ab47bc)', emoji: '\u{1F9EC}', tag: 'Best Seller' },
  { title: 'Heart Health', price: '\u20B91,299', mrp: '\u20B92,999', discount: '57% OFF', gradient: 'linear-gradient(135deg, #e53935, #ef5350)', emoji: '\u2764\uFE0F', tag: 'Popular' },
];

const trustStats = [
  { icon: Shield, label: 'NABL Certified Labs' },
  { icon: CheckCircle, label: '1,00,000+ Tests Done' },
  { icon: Truck, label: 'Free Home Collection' },
  { icon: WhatsappLogo, label: 'WhatsApp Reports' },
  { icon: Heartbeat, label: 'Doctor Consultation' },
];

const howItWorks = [
  { step: 1, icon: CalendarDots, title: 'Book Online', desc: 'Choose your test or package and book in 2 mins' },
  { step: 2, icon: Truck, title: 'Sample Collection', desc: 'A trained phlebotomist visits your home' },
  { step: 3, icon: FileText, title: 'Get Reports', desc: 'Detailed reports on WhatsApp & email within 24-48 hrs' },
];

const faqs = [
  { q: 'Do I need to fast before the test?', a: 'Some tests like fasting blood sugar and lipid profile require 8-12 hours of fasting. We\'ll mention it when you book.' },
  { q: 'Is home sample collection free?', a: 'Yes, home sample collection is completely free in Hyderabad and surrounding areas.' },
  { q: 'How long do reports take?', a: 'Most reports are delivered within 24-48 hours on WhatsApp and email. Some tests take longer.' },
  { q: 'Is it safe?', a: 'Our phlebotomists use sealed, sterile collection kits and follow strict hygiene protocols.' },
  { q: 'How do I book?', a: 'Select your tests or package, enter your details, choose a time slot, and confirm. We\'ll handle the rest!' },
];

export default function Diagnostics() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(location.pathname.includes('health-packages') ? 'packages' : 'tests');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [cart, setCart] = useState(() => {
    try {
      const prefill = location.state?.prefillCart;
      if (prefill && prefill.length > 0) {
        localStorage.setItem('jeevan_cart', JSON.stringify(prefill));
        window.dispatchEvent(new CustomEvent('cart-updated'));
        return prefill;
      }
      return JSON.parse(localStorage.getItem('jeevan_cart') || '[]');
    } catch { return []; }
  });
  useEffect(() => {
    localStorage.setItem('jeevan_cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cart-updated'));
  }, [cart]);
  const [showCart, setShowCart] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [collectionDate, setCollectionDate] = useState('');
  const [collectionTime, setCollectionTime] = useState('');
  const [address, setAddress] = useState({ line1: '', city: '', pincode: '' });
  const [city, setCity] = useState('Hyderabad');
  const [placing, setPlacing] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [bookedFor, setBookedFor] = useState(null);
  const [locating, setLocating] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [patientInfo, setPatientInfo] = useState({ name: '', age: '', gender: '' });
  const [prescription, setPrescription] = useState(null);
  const prescriptionRef = useRef(null);
  const addressTimer = useRef(null);
  const nextSlot = ['2:00 PM', '4:00 PM', '6:00 PM', 'Tomorrow 8:00 AM'][cart.length % 4];
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focused, setFocused] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [faqOpen, setFaqOpen] = useState({});
  const [packagesByAxis, setPackagesByAxis] = useState({});
  const [packageSearch, setPackageSearch] = useState('');
  const [showPackageSuggestions, setShowPackageSuggestions] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const bookingCounts = {
    'Complete Blood Count (CBC)': '2,847', 'HbA1c': '4,216', 'Thyroid Profile (T3, T4, TSH)': '3,591',
    'Lipid Profile': '3,128', 'Vitamin D Total': '2,964', 'Blood Sugar (Fasting)': '1,873',
    'Blood Sugar (Postprandial / Post Lunch - 2 HR)': '2,146', 'Random Blood Sugar (RBS)': '1,214',
    'Liver Function Test (LFT)': '1,652', 'Kidney Function Test (KFT)': '1,449',
  };

  const mostBookedTests = ['Complete Blood Count (CBC)', 'HbA1c', 'Thyroid Profile (T3, T4, TSH)', 'Lipid Profile', 'Vitamin D Total', 'Blood Sugar (Fasting)', 'Blood Sugar (Postprandial / Post Lunch - 2 HR)', 'Random Blood Sugar (RBS)', 'Liver Function Test (LFT)', 'Kidney Function Test (KFT)'];

  const load = async () => {
    setLoading(true);
    let filtered = [...seedTests];
    if (mode === 'packages' && !search && !category) {
      filtered = filtered.filter(t => t.subcategory === 'Health Packages');
    } else {
      if (search) filtered = filtered.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
      if (category) {
        const filterVal = categoryFilterMap[category];
        if (filterVal) {
          filtered = filtered.filter(t => t.category === filterVal || t.subcategory === filterVal || t.name.includes(filterVal));
        } else {
          filtered = filtered.filter(t => t.category === category);
        }
      }
    }
    setTests(filtered);
    setLoading(false);
  };

  useEffect(() => {
    window.__allTests = seedTests;
    window.__packagesByAxis = getPackagesByAxis(seedTests);
    load();
    const checkPkg = () => {
      const data = window.__packagesByAxis;
      if (data && Object.keys(data).length > 0) { setPackagesByAxis(data); return true; }
      return false;
    };
    if (!checkPkg()) {
      const t = setInterval(() => { if (checkPkg()) clearInterval(t); }, 200);
      setTimeout(() => clearInterval(t), 10000);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getFamilyMembers().then(({ data }) => setFamilyMembers(data || [])).catch(() => {});
    }
  }, [isAuthenticated]);

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [search, category, mode]);

  const sortedTests = [...tests].sort((a, b) => {
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    return (bookingCounts[b.name] ? parseInt(bookingCounts[b.name].replace(/,/g, '')) : 0) - (bookingCounts[a.name] ? parseInt(bookingCounts[a.name].replace(/,/g, '')) : 0);
  });

  const suggestions = search.trim()
    ? seedTests.filter(t => t.name.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
    : [];

  const handleSuggestionClick = (name) => {
    setSearch(name);
    setShowSuggestions(false);
    if (mode !== 'tests') setMode('tests');
    load();
  };

  const addToCart = (test) => {
    setCart(prev => {
      if (prev.find(i => i.id === test.id)) return prev;
      return [...prev, { ...test, qty: 1 }];
    });
  };

  const searchAddress = (q) => {
    clearTimeout(addressTimer.current);
    if (!q.trim()) { setAddressSuggestions([]); setShowAddressSuggestions(false); return; }
    addressTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`);
        const data = await res.json();
        setAddressSuggestions(data.map(d => ({
          display: d.display_name,
          city: d.address?.city || d.address?.town || d.address?.village || d.address?.state_district || '',
          pincode: d.address?.postcode || '',
          lat: d.lat, lon: d.lon,
        })));
        setShowAddressSuggestions(true);
      } catch {}
    }, 400);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const cartTotal = cart.reduce((sum, i) => sum + i.price, 0);

  const openBooking = () => { setBookingOpen(true); setBookingStep(1); };

  const handlePlace = async () => {
    setPlacing(true);
    const orderData = {
      tests: cart.map(i => ({ testId: i.id, name: i.name, price: i.price })),
      totalAmount: cartTotal,
      collectionDate: collectionDate || null,
      collectionTime: collectionTime || null,
      collectionAddress: address.city ? address : null,
      bookedFor: bookedFor || null,
      paymentMethod: paymentMethod || 'pay_at_collection',
      patientInfo: patientInfo.name ? patientInfo : null,
      prescriptionFile: prescription?.dataUrl || null,
    };
    const local = saveOrderLocally(orderData);
    setOrderId(local.id);
    setBookingSubmitted(true);
    setBookingStep(5);
    try { await placeDiagnosticOrder(orderData); } catch {}
    setPlacing(false);
  };

  const renderBookingPanel = () => (
      <div className="booking-panel-overlay" style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}>
      <div onClick={() => { if (bookingStep < 5) { setBookingOpen(false); setBookingSubmitted(false); } }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)' }} />
      <div className="booking-panel-inner" style={{
        position: 'relative', width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto',
        background: '#fff', borderRadius: '20px 20px 0 0', padding: '20px 18px 24px',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.15)', animation: 'slideUp 0.25s ease-out',
      }}>
        <style>{'@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }'}</style>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
            {bookingSubmitted ? '\u2705 Booking Confirmed' : `Booking (${cart.length} item${cart.length !== 1 ? 's' : ''})`}
          </h2>
          {!bookingSubmitted && (
            <button onClick={() => { setBookingOpen(false); setBookingSubmitted(false); setBookingStep(1); }}
              style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#f5f5f5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={16} />
            </button>
          )}
        </div>

        {bookingSubmitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle size={36} weight="fill" color="#2e7d32" />
            </div>
            <h3 style={{ fontSize: 18, marginBottom: 4 }}>Booking Confirmed!</h3>
            <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 16 }}>Our healthcare team will contact you within 15-30 minutes.</p>
            <div style={{ background: '#e8f0fe', borderRadius: 10, padding: '10px 16px', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#0F5DA8', fontWeight: 700, marginBottom: 20 }}>
              <CheckCircle size={16} weight="fill" /> Booking ID: {orderId || 'JHC-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.random().toString(36).slice(2,6).toUpperCase()}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="tel:+919700104108" style={{ padding: '10px 20px', borderRadius: 10, fontWeight: 600, fontSize: 13, background: 'linear-gradient(135deg, #0F5DA8, #0C6BC4)', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Phone size={16} weight="fill" /> Call Now
              </a>
              <a href={`https://wa.me/919700104108?text=${encodeURIComponent('Hi! I\'ve booked tests on Jeevan HealthCare. Order ID: ' + (orderId || ''))}`} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 20px', borderRadius: 10, fontWeight: 600, fontSize: 13, background: '#25d366', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <WhatsappLogo size={16} weight="fill" /> WhatsApp
              </a>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button onClick={() => { setBookingOpen(false); setCart([]); setBookingStep(1); setBookingSubmitted(false); setOrderId(null); setPrescription(null); setAddress({ line1: '', city: '', pincode: '' }); setCollectionDate(''); setCollectionTime(''); setPaymentMethod(''); setPatientInfo({ name: '', age: '', gender: '' }); setBookedFor(null); }}
                style={{ padding: '10px 24px', borderRadius: 10, fontWeight: 600, fontSize: 13, background: '#fff', color: '#0F5DA8', border: '1px solid #0F5DA8', cursor: 'pointer', fontFamily: 'inherit' }}>
                Back to Tests
              </button>
              <button onClick={() => { setBookingOpen(false); navigate('/my-test-orders'); }}
                style={{ padding: '10px 24px', borderRadius: 10, fontWeight: 600, fontSize: 13, background: '#0F5DA8', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={14} /> View My Bookings
              </button>
            </div>
          </div>
        ) : (
          <>
            {bookingStep === 5 ? null : (
              <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                {['Review', 'Patient', 'Address', 'Payment'].map((label, i) => (
                  <button key={label} onClick={() => bookingStep > i + 1 && setBookingStep(i + 1)}
                    style={{
                      flex: 1, padding: '5px 4px', borderRadius: 6, fontSize: 10, fontWeight: 600,
                      border: 'none', cursor: bookingStep > i + 1 ? 'pointer' : 'default',
                      background: bookingStep >= i + 1 ? '#0F5DA8' : '#f0f0f0',
                      color: bookingStep >= i + 1 ? '#fff' : '#999', fontFamily: 'inherit', whiteSpace: 'nowrap',
                    }}>
                    {bookingStep > i + 1 ? '\u2713 ' : ''}{i + 1}. {label}
                  </button>
                ))}
              </div>
            )}

            {bookingStep === 1 && (
              <>
                <h3 style={{ fontSize: 14, marginBottom: 8 }}>Review Your Order</h3>
                <div style={{ maxHeight: 240, overflowY: 'auto', marginBottom: 8 }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                      <Flask size={16} color="var(--primary)" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{item.category}</div>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{'\u20B9'}{item.price}</span>
                      <button onClick={() => removeFromCart(item.id)} style={{ color: '#999', padding: 4, background: 'none', border: 'none', cursor: 'pointer' }}><Trash size={14} /></button>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '2px solid #0F5DA8', marginBottom: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>Total</span>
                  <span style={{ fontSize: 17, fontWeight: 800, color: '#0F5DA8' }}>{'\u20B9'}{cartTotal}</span>
                </div>
                <button onClick={() => setBookingStep(2)} style={{ width: '100%', padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 700, background: '#0F5DA8', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Continue</button>
              </>
            )}

            {bookingStep === 2 && (
              <>
                <h3 style={{ fontSize: 14, marginBottom: 8 }}>Patient Details</h3>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, display: 'block' }}>Booking for</label>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button onClick={() => { setBookedFor(null); setPatientInfo({ name: '', age: '', gender: '' }); }}
                      style={{ padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 500, background: !bookedFor ? '#0F5DA8' : '#f0f0f0', color: !bookedFor ? '#fff' : 'var(--text-dark)', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                      <User size={12} style={{ marginRight: 3 }} /> Myself
                    </button>
                    {familyMembers.map(m => (
                      <button key={m.id} onClick={() => { setBookedFor(m); setPatientInfo({ name: m.name || '', age: m.age || '', gender: m.gender || '' }); }}
                        style={{ padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 500, background: bookedFor?.id === m.id ? '#0F5DA8' : '#f0f0f0', color: bookedFor?.id === m.id ? '#fff' : 'var(--text-dark)', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                        <User size={12} style={{ marginRight: 3 }} /> {m.name}
                      </button>
                    ))}
                  </div>
                </div>
                {!bookedFor && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                    <input placeholder="Your Name" value={patientInfo.name} onChange={e => setPatientInfo({ ...patientInfo, name: e.target.value })} style={{ padding: '7px 10px', fontSize: 12, borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'inherit', outline: 'none' }} />
                    <select value={patientInfo.gender} onChange={e => setPatientInfo({ ...patientInfo, gender: e.target.value })} style={{ padding: '7px 10px', fontSize: 12, borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'inherit', outline: 'none' }}>
                      <option value="">Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                )}
                <div style={{ marginTop: 8, marginBottom: 12, borderTop: '1px solid #f0f0f0', paddingTop: 10 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}><FileText size={12} color="#0F5DA8" /> Upload Prescription (optional)</p>
                  {prescription ? (
                    <div style={{ border: '1px solid #d1d5db', borderRadius: 7, padding: '8px 10px', background: '#f9fafb', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{'\u{1F4CE}'}</span>
                      <div style={{ flex: 1, minWidth: 0, fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prescription.name}</div>
                      <span style={{ fontSize: 10, color: '#2e7d32' }}><CheckCircle size={10} weight="fill" /> Uploaded</span>
                      <button onClick={() => { setPrescription(null); if (prescriptionRef.current) prescriptionRef.current.value = ''; }} style={{ background: '#fee2e2', border: 'none', borderRadius: 3, padding: '2px 6px', fontSize: 10, color: '#dc2626', cursor: 'pointer', fontWeight: 500 }}>Remove</button>
                    </div>
                  ) : (
                    <div style={{ border: '1px dashed #d1d5db', borderRadius: 7, padding: '10px', textAlign: 'center', cursor: 'pointer', background: '#fafafa' }} onClick={() => prescriptionRef.current?.click()}>
                      <input ref={prescriptionRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }}
                        onChange={e => { const f = e.target.files?.[0]; if (f) { const reader = new FileReader(); reader.onload = () => { setPrescription({ name: f.name, dataUrl: reader.result }); }; reader.readAsDataURL(f); } }} />
                      <span style={{ fontSize: 10, color: '#6b7280' }}>{'\u{1F4C4}'} Click to upload prescription (PDF or image)</span>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setBookingStep(1)} style={{ flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 600, background: '#fff', color: '#0F5DA8', border: '1px solid #0F5DA8', cursor: 'pointer', fontFamily: 'inherit' }}>Back</button>
                  <button onClick={() => setBookingStep(3)} style={{ flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 700, background: '#0F5DA8', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Continue</button>
                </div>
              </>
            )}

            {bookingStep === 3 && (
              <>
                <h3 style={{ fontSize: 14, marginBottom: 2 }}>Schedule Home Collection</h3>
                <p style={{ fontSize: 11, color: '#e65100', fontWeight: 600, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} weight="fill" color="#FF8A00" /> Next available: {nextSlot}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <label style={{ fontSize: 11 }}>Collection Date</label>
                      <input type="date" value={collectionDate} min={new Date().toISOString().split('T')[0]} onChange={e => setCollectionDate(e.target.value)} style={{ padding: '7px 10px', fontSize: 12, borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11 }}>Preferred Time</label>
                      <select value={collectionTime} onChange={e => setCollectionTime(e.target.value)} style={{ padding: '7px 10px', fontSize: 12, borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box' }}>
                        <option value="">Select time</option>
                        {['6:00 AM - 7:00 AM', '7:00 AM - 8:00 AM', '8:00 AM - 9:00 AM', '9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '2:00 PM - 3:00 PM', '3:00 PM - 4:00 PM', '4:00 PM - 5:00 PM', '5:00 PM - 6:00 PM'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <label style={{ fontSize: 11 }}>Collection Address</label>
                  <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
                    <input placeholder="Type your address..." value={address.line1}
                      onChange={e => { setAddress({ ...address, line1: e.target.value }); searchAddress(e.target.value); }}
                      onFocus={() => addressSuggestions.length > 0 && setShowAddressSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowAddressSuggestions(false), 200)}
                      style={{ padding: '7px 10px', fontSize: 12, borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'inherit', outline: 'none', flex: 1 }} />
                    {showAddressSuggestions && addressSuggestions.length > 0 && (
                      <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 10, background: '#fff', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid var(--border)', maxHeight: 150, overflowY: 'auto' }}>
                        {addressSuggestions.map((s, i) => (
                          <button key={i} onMouseDown={() => { setAddress({ line1: s.display, city: s.city, pincode: s.pincode }); setShowAddressSuggestions(false); }}
                            style={{ display: 'block', width: '100%', padding: '8px 12px', fontSize: 11, textAlign: 'left', border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', borderBottom: i < addressSuggestions.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                            <MapPin size={10} style={{ marginRight: 4, color: '#0F5DA8' }} /> {s.display}
                          </button>
                        ))}
                      </div>
                    )}
                    <button onClick={() => {
                      if (!navigator.geolocation) return;
                      setLocating(true);
                      navigator.geolocation.getCurrentPosition(async (pos) => {
                        try {
                          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
                          const data = await res.json();
                          const addr = data.address || {};
                          setAddress({ line1: [addr.road, addr.suburb, addr.neighbourhood].filter(Boolean).join(', ') || 'Current location', city: addr.city || addr.town || addr.village || addr.state_district || '', pincode: addr.postcode || '' });
                        } catch {}
                        setLocating(false);
                      }, () => setLocating(false), { enableHighAccuracy: true });
                    }} style={{ padding: '7px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: '#e8f0fe', color: '#0F5DA8', border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                      <MapPin size={12} weight="fill" /> {locating ? '...' : 'Locate'}
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <input placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} style={{ padding: '7px 10px', fontSize: 12, borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'inherit', outline: 'none' }} />
                    <input placeholder="Pincode" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} style={{ padding: '7px 10px', fontSize: 12, borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'inherit', outline: 'none' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={() => setBookingStep(2)} style={{ flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 600, background: '#fff', color: '#0F5DA8', border: '1px solid #0F5DA8', cursor: 'pointer', fontFamily: 'inherit' }}>Back</button>
                  <button onClick={() => setBookingStep(4)} style={{ flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 700, background: '#0F5DA8', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Continue</button>
                </div>
              </>
            )}

            {bookingStep === 4 && (
              <>
                <h3 style={{ fontSize: 14, marginBottom: 10 }}>Payment</h3>
                {[
                  { value: 'pay_at_collection', label: 'Pay at Collection', desc: 'Cash or card at your doorstep', icon: Coin },
                  { value: 'online', label: 'Pay Online', desc: 'Card / UPI / Net Banking', icon: Shield },
                ].map(opt => {
                  const Icon = opt.icon;
                  return (
                    <button key={opt.value} onClick={() => setPaymentMethod(opt.value)}
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: 10, marginBottom: 8,
                        display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
                        background: paymentMethod === opt.value ? '#e8f0fe' : '#fff',
                        border: paymentMethod === opt.value ? '2px solid #0F5DA8' : '1px solid var(--border)',
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}>
                      <Icon size={20} color={paymentMethod === opt.value ? '#0F5DA8' : '#666'} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)' }}>{opt.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{opt.desc}</div>
                      </div>
                    </button>
                  );
                })}
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={() => setBookingStep(3)} style={{ flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 600, background: '#fff', color: '#0F5DA8', border: '1px solid #0F5DA8', cursor: 'pointer', fontFamily: 'inherit' }}>Back</button>
                  <button onClick={handlePlace} disabled={placing || !paymentMethod}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 700,
                      background: placing || !paymentMethod ? '#ccc' : '#0F5DA8', color: '#fff',
                      border: 'none', cursor: placing || !paymentMethod ? 'default' : 'pointer',
                      fontFamily: 'inherit',
                    }}>
                    {placing ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom: 80, position: 'relative' }}>
      {/* ─── HERO BANNER ─── */}
      <div style={{ position: 'relative', background: 'linear-gradient(135deg, #0F5DA8 0%, #1565C0 50%, #1a73e8 100%)', padding: '20px 16px 24px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', borderRadius: '0 0 24px 24px' }}>
          <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ background: '#FF6B35', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4 }}>{'\u{1F525}'} Limited Time Offer</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: 600, background: 'rgba(255,255,255,0.12)', padding: '3px 10px', borderRadius: 20 }}>
              <MapPin size={10} weight="fill" /> {city}
            </div>
          </div>
          <h1 className="hero-heading" style={{ color: '#fff', fontSize: 24, fontWeight: 800, margin: 0, lineHeight: 1.2, letterSpacing: -0.5 }}>
            Health Checkups at Home{' '}
            <span style={{ color: '#FFD54F' }}>in {city}</span>
          </h1>
          <div className="hero-subtitle" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '10px 0 14px' }}>
            {['Free Home Collection', 'NABL Certified Labs', 'Starting at \u20B9799', 'Up to 60% OFF'].map((text, i) => (
              <span key={i} style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: 3 }}>
                <CheckCircle size={9} weight="fill" color={i === 3 ? '#FFD54F' : '#81C784'} /> {text}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <button onClick={openBooking} style={{ padding: '10px 24px', borderRadius: 10, fontSize: 13, fontWeight: 700, background: '#FF3B30', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(255,59,48,0.35)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkle size={14} weight="fill" /> Book Now
            </button>
            <button onClick={() => setMode('packages')} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: 6 }}>
              View Packages
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#FFD54F', fontSize: 10, fontWeight: 700 }}>
              <Clock size={11} weight="fill" /> Offer ends in 47:00 mins
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>|</div>
            <div style={{ color: '#81C784', fontSize: 10, fontWeight: 600 }}>247 booked today</div>
          </div>
          <div className="hero-search-wrap" style={{ position: 'relative' }}>
            <MagnifyingGlass size={16} style={{ position: 'absolute', left: 14, top: 11, color: '#0F5DA8', zIndex: 2 }} />
            <input type="text" placeholder="Search tests or packages..." value={search}
              onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
              onFocus={() => { setFocused(true); setShowSuggestions(true); }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              style={{ width: '100%', padding: '9px 14px 9px 40px', borderRadius: 12, border: 'none', fontSize: 13, outline: 'none', background: '#fff', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', boxSizing: 'border-box' }} />
            {showSuggestions && (
              <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', borderRadius: 12, boxShadow: '0 12px 48px rgba(0,0,0,0.15)', border: '1px solid #e8edf2', overflow: 'hidden', zIndex: 999, textAlign: 'left' }}>
                {search.trim() && suggestions.length > 0 ? suggestions.map(t => (
                  <button key={t.id} onMouseDown={() => handleSuggestionClick(t.name)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', borderBottom: '1px solid #f5f5f5' }}>
                    <MagnifyingGlass size={14} color="#0F5DA8" />
                    <div><div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div><div style={{ fontSize: 10, color: 'var(--text-light)' }}>{t.category} {'\u2022'} {'\u20B9'}{t.offerPrice || t.price}</div></div>
                  </button>
                )) : !search.trim() && focused ? (
                  <div style={{ padding: '10px 14px' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Popular Tests</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {['Complete Blood Count (CBC)', 'HbA1c', 'Thyroid Profile', 'Lipid Profile', 'Vitamin D Total'].map(name => (
                        <button key={name} onMouseDown={() => handleSuggestionClick(name)} style={{ padding: '5px 12px', borderRadius: 16, fontSize: 11, fontWeight: 500, background: '#e8f0fe', color: '#0F5DA8', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>{name}</button>
                      ))}
                    </div>
                  </div>
                ) : search.trim() && suggestions.length === 0 ? (
                  <div style={{ padding: '12px 14px', fontSize: 12, color: 'var(--text-light)', textAlign: 'center' }}>No tests found</div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── MOST BOOKED PACKAGES ─── */}
      <div style={{ padding: '16px 0 8px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>{'\u{1F525}'} Most Booked Packages</h2>
            <button onClick={() => setMode('packages')} style={{ fontSize: 11, fontWeight: 600, color: '#0F5DA8', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 2 }}>View All <ArrowRight size={11} /></button>
          </div>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 6, scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
            {mostBookedPackages.map((pkg, i) => (
              <div key={i} style={{ minWidth: 260, maxWidth: 260, scrollSnapAlign: 'start', background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', flexShrink: 0 }}>
                <div style={{ background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 28 }}>{pkg.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 8, fontWeight: 700, color: '#fff', background: '#22C55E', padding: '1px 7px', borderRadius: 8 }}>MOST BOOKED</span>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#166534' }}>{pkg.name}</div>
                  </div>
                </div>
                <div style={{ padding: '10px 14px' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-light)', marginBottom: 4, lineHeight: 1.3 }}>{pkg.tests}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div><span style={{ fontSize: 16, fontWeight: 800, color: '#e53935' }}>{'\u20B9'}{pkg.price}</span><span style={{ fontSize: 11, color: '#bbb', textDecoration: 'line-through', marginLeft: 4 }}>{'\u20B9'}{pkg.mrp}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 11, fontWeight: 600, color: '#FF8A00' }}><Star size={10} weight="fill" color="#FF8A00" /> {pkg.rating}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, color: '#22C55E', fontWeight: 600 }}>{pkg.booked} booked</span>
                    <button onClick={() => { addToCart({ id: `pkg_${i}`, name: pkg.name, price: pkg.price, category: 'Package' }); openBooking(); }}
                      style={{ padding: '5px 14px', borderRadius: 7, fontSize: 11, fontWeight: 700, background: '#0F5DA8', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── OFFERS ─── */}
      <div style={{ padding: '8px 0 12px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 16px' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>{'\u{1F381}'} Offers & Promotions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {offers.map((offer, i) => (
              <div key={i} style={{ background: offer.gradient, borderRadius: 14, padding: '14px 16px', color: '#fff', position: 'relative', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} onClick={() => setMode('packages')}>
                <span style={{ position: 'absolute', top: 6, right: 6, fontSize: 8, fontWeight: 700, background: 'rgba(255,255,255,0.25)', padding: '2px 8px', borderRadius: 10, backdropFilter: 'blur(4px)' }}>{offer.tag}</span>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{offer.emoji}</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 1 }}>{offer.title}</div>
                <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 1 }}>{offer.price}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 11, opacity: 0.7, textDecoration: 'line-through' }}>{offer.mrp}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(255,255,255,0.25)', padding: '1px 6px', borderRadius: 6 }}>{offer.discount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CATEGORIES ─── */}
      <div style={{ padding: '4px 0 12px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 16px' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>{'\u{1F9ED}'} Browse by Category</h2>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {popularCategories.map((cat, i) => {
              const colors = ['#0F5DA8', '#e53935', '#1e88e5', '#8e24aa', '#00acc1', '#ec407a', '#78909c', '#5c6bc0'];
              const icons = [User, Heartbeat, Drop, Shield, Sparkle, Baby, User, Briefcase];
              const Icon = icons[i] || User;
              return (
                <button key={i} onClick={() => { setCategory(cat); setMode('tests'); setSearch(''); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, background: '#f8f9fa', border: '1px solid #e8edf2', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                  <Icon size={16} color={colors[i]} />
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── STICKY TAB BAR ─── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: '#fff', borderBottom: '1px solid #e8edf2', padding: '0 16px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', gap: 0, maxWidth: 720, margin: '0 auto' }}>
          <button onClick={() => { setMode('tests'); setSearch(''); setCategory(''); }} style={{ flex: 1, padding: '10px 12px', fontSize: 12, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: mode === 'tests' ? '#0F5DA8' : '#8b9bb5', borderBottom: mode === 'tests' ? '2.5px solid #0F5DA8' : '2.5px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <Flask size={15} weight={mode === 'tests' ? 'fill' : 'regular'} /> Diagnostic Tests <span style={{ fontSize: 9, background: '#e8f0fe', color: '#0F5DA8', fontWeight: 700, padding: '1px 6px', borderRadius: 8 }}>{seedTests.length - 3}</span>
          </button>
          <button onClick={() => { setMode('packages'); setSearch(''); setCategory(''); }} style={{ flex: 1, padding: '10px 12px', fontSize: 12, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: mode === 'packages' ? '#22C55E' : '#8b9bb5', borderBottom: mode === 'packages' ? '2.5px solid #22C55E' : '2.5px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <Gift size={15} weight={mode === 'packages' ? 'fill' : 'regular'} /> Health Packages <span style={{ fontSize: 9, background: '#22C55E', color: '#fff', fontWeight: 700, padding: '1px 6px', borderRadius: 8 }}>SAVE 60%</span>
          </button>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div style={{ padding: '12px 16px 80px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {/* Cart bar */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, padding: '8px 12px', background: '#fff', borderRadius: 10, border: '1px solid var(--border)' }}>
            <ShoppingCart size={16} color="var(--primary)" />
            <span style={{ fontSize: 12, fontWeight: 600 }}>{cart.length} test{cart.length !== 1 ? 's' : ''}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{'\u20B9'}{cartTotal}</span>
            <button onClick={() => setShowCart(!showCart)} style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>{showCart ? 'Hide' : 'View'} Cart</button>
            {cart.length > 0 && (
              <button onClick={openBooking} style={{ padding: '5px 14px', borderRadius: 7, fontSize: 11, fontWeight: 700, background: '#FF3B30', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Sparkle size={12} weight="fill" /> Book Now
              </button>
            )}
          </div>
          {showCart && cart.length > 0 && (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 12, marginBottom: 12 }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <Flask size={16} color="var(--primary)" />
                  <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, fontWeight: 600 }}>{item.name}</div><div style={{ fontSize: 10, color: 'var(--text-light)' }}>{item.category}</div></div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{'\u20B9'}{item.price}</span>
                  <button onClick={() => removeFromCart(item.id)} style={{ color: '#999', padding: 3, background: 'none', border: 'none', cursor: 'pointer' }}><Trash size={13} /></button>
                </div>
              ))}
            </div>
          )}

          {/* Prescription Upload */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ background: 'linear-gradient(135deg, #eef4ff, #f5f9ff)', borderRadius: 12, border: '1px solid #c7d9f0', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, #0F5DA8, #0C6BC4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><FileText size={18} weight="fill" color="#fff" /></div>
              <div style={{ flex: 1, minWidth: 160 }}><div style={{ fontSize: 12, fontWeight: 700, color: '#0F5DA8' }}>Have a Prescription?</div><div style={{ fontSize: 10, color: 'var(--text-light)' }}>Upload and we'll match the right tests</div></div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {prescription ? (
                  <><span style={{ fontSize: 10, color: '#2e7d32', fontWeight: 600 }}><CheckCircle size={10} weight="fill" /> {prescription.name.length > 12 ? prescription.name.slice(0, 12) + '\u2026' : prescription.name}</span>
                    <button onClick={() => { setPrescription(null); if (prescriptionRef.current) prescriptionRef.current.value = ''; }} style={{ background: '#fee2e2', border: 'none', borderRadius: 4, padding: '2px 7px', fontSize: 9, color: '#dc2626', cursor: 'pointer', fontWeight: 500 }}>Remove</button></>
                ) : (
                  <button onClick={() => prescriptionRef.current?.click()} style={{ padding: '6px 14px', borderRadius: 7, fontSize: 11, fontWeight: 600, background: 'linear-gradient(135deg, #0F5DA8, #0C6BC4)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                    <input ref={prescriptionRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }}
                      onChange={e => { const f = e.target.files?.[0]; if (f) { const reader = new FileReader(); reader.onload = () => { setPrescription({ name: f.name, dataUrl: reader.result }); if (window?.gtag) window.gtag('event', 'prescription_upload'); }; reader.readAsDataURL(f); } }} />
                    Upload
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mode content */}
          {mode === 'tests' ? (
            <div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: 30, fontSize: 12, color: 'var(--text-light)' }}>Loading tests...</div>
              ) : sortedTests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 30, fontSize: 12, color: 'var(--text-light)' }}>No tests found</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
                    <button onClick={() => setSortBy(sortBy === 'popular' ? 'price-low' : sortBy === 'price-low' ? 'price-high' : sortBy === 'price-high' ? 'name' : 'popular')} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 10, fontWeight: 600, background: '#f0f5ff', color: '#0F5DA8', border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                      {['Popular', 'Price: Low', 'Price: High', 'Name: A-Z'][['popular', 'price-low', 'price-high', 'name'].indexOf(sortBy)] || 'Popular'}
                    </button>
                    {mostBookedTests.slice(0, 4).map(name => (
                      <button key={name} onClick={() => { setSearch(name); load(); }} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 10, fontWeight: 500, background: '#fff', color: 'var(--text-dark)', border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>{name}</button>
                    ))}
                  </div>
                  {sortedTests.map(test => {
                    const inCart = cart.some(i => i.id === test.id);
                    const count = bookingCounts[test.name];
                    return (
                      <div key={test.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Flask size={18} color="#0F5DA8" /></div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Link to={`/test/${test.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`} style={{ fontSize: 12, fontWeight: 600, marginBottom: 1, color: 'var(--text-dark)', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color = '#0F5DA8'} onMouseLeave={e => e.target.style.color = 'var(--text-dark)'}>{test.name}</Link>
                          <div style={{ fontSize: 10, color: 'var(--text-light)', marginBottom: 2 }}>{test.category}{test.fasting_required ? ' \u2022 Fasting' : ''}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 14, fontWeight: 800, color: '#e53935' }}>{'\u20B9'}{test.offerPrice || test.price}</span>
                            {test.mrp ? <span style={{ fontSize: 10, color: '#bbb', textDecoration: 'line-through' }}>{'\u20B9'}{test.mrp}</span> : null}
                            {count ? <span style={{ fontSize: 9, color: '#22C55E', fontWeight: 600 }}>{count} booked</span> : null}
                          </div>
                        </div>
                        <button onClick={() => inCart ? removeFromCart(test.id) : addToCart(test)} style={{ padding: '6px 14px', borderRadius: 7, fontSize: 11, fontWeight: 700, background: inCart ? '#fee2e2' : '#0F5DA8', color: inCart ? '#dc2626' : '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', minWidth: 60 }}>
                          {inCart ? 'Remove' : 'Add'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 12, position: 'relative' }}>
                <input type="text" placeholder="Search packages..." value={packageSearch}
                  onChange={e => { setPackageSearch(e.target.value); setShowPackageSuggestions(true); }}
                  onFocus={() => setShowPackageSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowPackageSuggestions(false), 200)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: '#fff' }} />
              </div>
              {Object.keys(packagesByAxis).length === 0 ? (
                <div style={{ textAlign: 'center', padding: 20, fontSize: 11, color: 'var(--text-light)' }}>Loading packages...</div>
              ) : (
                (() => {
                  const axisOrder = ['organ', 'disease', 'disorder', 'age', 'gender', 'lifestyle', 'lifeStage', 'symptom', 'occupation', 'medication', 'familyHistory', 'seasonal', 'diet', 'postRecovery', 'travel', 'insurance', 'preventive', 'budget', 'risk', 'duration', 'mentalHealth', 'fitness', 'sleep', 'environmental', 'vaccination', 'preSurgical', 'ethnicity', 'fertility'];
                  const axisMeta = { organ: { icon: Heartbeat, color: '#0F5DA8', label: 'Organ Wise' }, disease: { icon: Warning, color: '#c62828', label: 'Disease Wise' }, disorder: { icon: Shield, color: '#7b1fa2', label: 'Disorder Wise' }, age: { icon: User, color: '#2e7d32', label: 'Age Wise' }, gender: { icon: Heart, color: '#e65100', label: 'Gender Wise' }, lifestyle: { icon: Lightbulb, color: '#FF8A00', label: 'Lifestyle Wise' }, lifeStage: { icon: Baby, color: '#ec407a', label: 'Life Stage Wise' }, symptom: { icon: Warning, color: '#ff7043', label: 'Symptom Wise' }, occupation: { icon: Suitcase, color: '#5c6bc0', label: 'Occupation Wise' }, medication: { icon: Pill, color: '#26a69a', label: 'Medication Monitoring' }, familyHistory: { icon: Heartbeat, color: '#ef5350', label: 'Family History' }, seasonal: { icon: Cloud, color: '#42a5f5', label: 'Seasonal' }, diet: { icon: ForkKnife, color: '#66bb6a', label: 'Diet Wise' }, postRecovery: { icon: Heartbeat, color: '#ab47bc', label: 'Post-Recovery' }, travel: { icon: Airplane, color: '#ffa726', label: 'Travel' }, insurance: { icon: Briefcase, color: '#78909c', label: 'Insurance' }, preventive: { icon: Shield, color: '#26c6da', label: 'Preventive' }, budget: { icon: Coin, color: '#ffca28', label: 'Budget' }, risk: { icon: Warning, color: '#ef5350', label: 'Risk Profile' }, duration: { icon: Clock, color: '#8d6e63', label: 'Duration' }, mentalHealth: { icon: Heart, color: '#7e57c2', label: 'Mental Health' }, fitness: { icon: Lightning, color: '#ff7043', label: 'Fitness' }, sleep: { icon: Moon, color: '#5c6bc0', label: 'Sleep' }, environmental: { icon: Leaf, color: '#66bb6a', label: 'Environmental' }, vaccination: { icon: Syringe, color: '#42a5f5', label: 'Vaccination' }, preSurgical: { icon: FirstAid, color: '#ef5350', label: 'Pre-Surgical' }, ethnicity: { icon: Globe, color: '#ab47bc', label: 'Ethnicity' }, fertility: { icon: Heart, color: '#ec407a', label: 'Fertility' } };
                  const visibleAxes = axisOrder.filter(ax => packagesByAxis[ax]?.length > 0);
                  const filteredPkg = packageSearch.trim()
                    ? Object.fromEntries(Object.entries(packagesByAxis).map(([ax, pkgs]) => [ax, pkgs.filter(p => p.name.toLowerCase().includes(packageSearch.toLowerCase()) || p.desc?.toLowerCase().includes(packageSearch.toLowerCase()))]))
                    : packagesByAxis;
                  return visibleAxes.map(ax => {
                    const pkgs = filteredPkg[ax] || [];
                    if (pkgs.length === 0) return null;
                    const meta = axisMeta[ax] || {};
                    const Icon = meta.icon || Gift;
                    return (
                      <div key={ax} style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                          <Icon size={14} color={meta.color} />
                          <span style={{ fontSize: 13, fontWeight: 700, color: meta.color }}>{meta.label}</span>
                          <span style={{ fontSize: 10, color: 'var(--text-light)' }}>({pkgs.length})</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {pkgs.map(pkg => (
                            <div key={pkg.slug} style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: '10px 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Gift size={18} color="#22C55E" /></div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 1 }}>{pkg.name}</div>
                                  <div style={{ fontSize: 10, color: 'var(--text-light)', marginBottom: 2 }}>{pkg.desc?.slice(0, 70)}{pkg.desc?.length > 70 ? '\u2026' : ''}</div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ fontSize: 14, fontWeight: 800, color: '#e53935' }}>{'\u20B9'}{pkg.bundlePrice?.toLocaleString()}</span>
                                    <span style={{ fontSize: 10, color: '#bbb', textDecoration: 'line-through' }}>{'\u20B9'}{pkg.mrpPrice?.toLocaleString()}</span>
                                    <span style={{ fontSize: 9, fontWeight: 600, color: '#fff', background: '#22C55E', padding: '1px 6px', borderRadius: 4 }}>{pkg.discountPct}% off</span>
                                  </div>
                                  <div style={{ fontSize: 9, color: 'var(--text-light)', marginTop: 1 }}>{pkg.testCount} tests {'\u2022'} Home Collection</div>
                                </div>
                                <button onClick={() => navigate(`/package/${pkg.slug}`)} style={{ padding: '6px 12px', borderRadius: 7, fontSize: 10, fontWeight: 700, background: '#22C55E', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>Details</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()
              )}
            </div>
          )}

          {/* ─── TRUST ─── */}
          <div style={{ background: 'linear-gradient(135deg, #f0f5ff, #e8f0fe)', borderRadius: 14, padding: '16px 14px', margin: '16px 0' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, textAlign: 'center', margin: '0 0 12px', color: '#0F5DA8' }}>{'\u{1F6E1}\uFE0F'} Why Choose Jeevan HealthCare?</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
              {trustStats.map((item, i) => { const Icon = item.icon; return (
                <div key={i} style={{ textAlign: 'center', background: '#fff', borderRadius: 10, padding: '12px 8px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <Icon size={20} color="#0F5DA8" style={{ marginBottom: 4 }} />
                  <div style={{ fontSize: 10, fontWeight: 600 }}>{item.label}</div>
                </div>
              ); })}
            </div>
          </div>

          {/* ─── HOW IT WORKS ─── */}
          <div style={{ margin: '12px 0' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, textAlign: 'center', margin: '0 0 12px' }}>{'\u2699\uFE0F'} How It Works</h3>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
              {howItWorks.map((item, i) => { const Icon = item.icon; return (
                <div key={i} style={{ minWidth: 160, flex: 1, background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: '14px 12px', textAlign: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #0F5DA8, #1a73e8)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                    <Icon size={18} color="#fff" weight="fill" />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-light)' }}>{item.desc}</div>
                </div>
              ); })}
            </div>
          </div>

          {/* ─── FAQ ─── */}
          <div style={{ margin: '12px 0' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, textAlign: 'center', margin: '0 0 12px' }}>FAQ</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 10, border: '1px solid var(--border)', overflow: 'hidden' }}>
                  <button onClick={() => setFaqOpen(prev => ({ ...prev, [i]: !prev[i] }))} style={{ width: '100%', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, color: 'var(--text-dark)', textAlign: 'left' }}>
                    {faq.q}
                    <CaretDown size={12} style={{ transform: faqOpen[i] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }} />
                  </button>
                  {faqOpen[i] && <div style={{ padding: '0 12px 10px', fontSize: 11, color: 'var(--text-light)', lineHeight: 1.5 }}>{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── FLOATING CTA ─── */}
      <div className="floating-cta-bar" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999, padding: '8px 16px 10px', background: '#fff', boxShadow: '0 -4px 16px rgba(0,0,0,0.08)', display: 'flex', gap: 8, alignItems: 'center' }}>
        <a href="https://wa.me/919700104108" target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 10px rgba(37,211,102,0.3)' }}>
          <WhatsappLogo size={20} weight="fill" color="#fff" />
        </a>
        <button onClick={() => navigate('/my-test-orders')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '4px 8px', fontSize: 10, color: '#0F5DA8', fontWeight: 600, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 3 }}>
          <Clock size={11} /> My Bookings
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: 'var(--text-light)' }}>{cart.length} test{cart.length !== 1 ? 's' : ''} selected</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#e53935' }}>{'\u20B9'}{cartTotal}</div>
        </div>
        <button onClick={() => cart.length > 0 ? openBooking() : window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ padding: '9px 24px', borderRadius: 8, fontSize: 12, fontWeight: 700, background: cart.length > 0 ? '#FF3B30' : '#0F5DA8', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: cart.length > 0 ? '0 4px 14px rgba(255,59,48,0.3)' : 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Sparkle size={14} weight="fill" /> {cart.length > 0 ? 'Book Now' : 'Start Booking'}
        </button>
      </div>

      {/* ─── BOOKING PANEL (slide-up overlay) ─── */}
      {bookingOpen && renderBookingPanel()}
    </div>
  );
}
