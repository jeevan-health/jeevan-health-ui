import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { seedTests } from '../data/seedData';
import {
  MagnifyingGlass, Flask, ShoppingCart, Plus, Trash, CheckCircle, Clock, Info, WarningCircle, MapPin,
  Heartbeat, Heart, Drop, Shield, Bone, Baby, User, Warning,
  Microscope, Truck, Sparkle, Gear,
  CaretRight, CaretDown, FileText, CalendarDots, ChatCircle, Gift,
  Lightbulb, Suitcase, Pill, Cloud, ForkKnife, Airplane, Briefcase, Coin, Moon, Leaf,
  Syringe, FirstAid, Globe, Lightning,
  Phone, WhatsappLogo,
} from '@phosphor-icons/react';
import TestDetailModal from '../components/test/TestDetailModal';
import useAuthStore from '../store/authStore';
import { getFamilyMembers } from '../services/authService';
import { searchTests, placeDiagnosticOrder } from '../services/diagnosticsService';
import { getTestEducation, getPackageEducation } from '../utils/testEducation';
import { getPackagesByAxis } from '../utils/packageGenerator';

const categoryList = [
  { name: 'Full Body', icon: User, color: '#0F5DA8' },
  { name: 'Heart', icon: Heartbeat, color: '#e53935', mostBooked: true },
  { name: 'Fever', icon: Drop, color: '#ff6f00', ticker: '20,186 Chikungunya cases â€¢ 6,927 Dengue cases â€¢ 19,422 Malaria cases â€¢ 4,08,000 Typhoid cases' },
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

const testimonials = [
  { name: 'Meera Sharma', place: 'Delhi', text: 'The sample collection was smooth and hygienic. I received detailed reports within 12 hours, helping me consult my doctor promptly.' },
  { name: 'Raj Patel', place: 'Bangalore', text: 'I received detailed and understandable reports. The free doctor consultation was a great addition, helping me interpret results effectively.' },
  { name: 'Anjali Singh', place: 'Agra', text: 'The sample collector was punctual, hygienic, and polite. The sealed collection kit assured me of their professionalism.' },
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
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [collectionDate, setCollectionDate] = useState('');
  const [collectionTime, setCollectionTime] = useState('');
  const [address, setAddress] = useState({ line1: '', city: '', pincode: '' });
  const [city, setCity] = useState('Hyderabad');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [showAllTests, setShowAllTests] = useState(false);
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
  const nextSlot = ['2:00 PM', '4:00 PM', '6:00 PM', 'Tomorrow 8:00 AM'][cart.length % 4];
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focused, setFocused] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [faqOpen, setFaqOpen] = useState({});
  const [packagesByAxis, setPackagesByAxis] = useState({});
  const [packageSearch, setPackageSearch] = useState('');
  const [showPackageSuggestions, setShowPackageSuggestions] = useState(false);
  const packagesRef = useRef(null);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const sortOptions = [
    { value: 'popular', label: 'Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A-Z' },
  ];

  const totalBookedToday = 247;
  const dailyBookings = {
    'Complete Blood Count (CBC)': 89,
    'HbA1c': 124,
    'Thyroid Profile (T3, T4, TSH)': 76,
    'Lipid Profile': 93,
    'Vitamin D Total': 58,
    'Blood Sugar (Fasting)': 67,
    'Liver Function Test (LFT)': 42,
    'Kidney Function Test (KFT)': 38,
  };

  const popularTests = ['Complete Blood Count (CBC)', 'HbA1c', 'Thyroid Profile (T3, T4, TSH)', 'Lipid Profile', 'Vitamin D Total'];
  const mostBookedTests = ['Complete Blood Count (CBC)', 'HbA1c', 'Thyroid Profile (T3, T4, TSH)', 'Lipid Profile', 'Vitamin D Total', 'Blood Sugar (Fasting)', 'Blood Sugar (Postprandial / Post Lunch - 2 HR)', 'Random Blood Sugar (RBS)', 'Liver Function Test (LFT)', 'Kidney Function Test (KFT)'];
  const bookingCounts = {
    'Complete Blood Count (CBC)': '2,847',
    'HbA1c': '4,216',
    'Thyroid Profile (T3, T4, TSH)': '3,591',
    'Lipid Profile': '3,128',
    'Vitamin D Total': '2,964',
    'Blood Sugar (Fasting)': '1,873',
    'Blood Sugar (Postprandial / Post Lunch - 2 HR)': '2,146',
    'Random Blood Sugar (RBS)': '1,214',
    'Liver Function Test (LFT)': '1,652',
    'Kidney Function Test (KFT)': '1,449',
  };

  const relatedSuggestions = {
    'Complete Blood Count (CBC)': ['Iron Studies', 'Vitamin B12'],
    'HbA1c': ['Blood Sugar (Fasting)', 'Lipid Profile'],
    'Thyroid Profile (T3, T4, TSH)': ['TSH', 'Lipid Profile'],
    'Lipid Profile': ['Blood Sugar (Fasting)', 'hs-CRP'],
    'Vitamin D Total': ['Vitamin B12', 'Calcium'],
    'Blood Sugar (Fasting)': ['HbA1c', 'Lipid Profile'],
    'Blood Sugar (Postprandial / Post Lunch - 2 HR)': ['Blood Sugar (Fasting)', 'HbA1c'],
    'Random Blood Sugar (RBS)': ['Blood Sugar (Fasting)', 'HbA1c'],
    'Liver Function Test (LFT)': ['Kidney Function Test (KFT)', 'Lipid Profile'],
    'Kidney Function Test (KFT)': ['Liver Function Test (LFT)', 'Uric Acid'],
  };

  const comboData = {
    'HbA1c': { name: 'Diabetes Care Pack', saveLabel: 'Save â‚¹271', tests: ['Blood Sugar (Fasting)', 'Lipid Profile'], comboPrice: 999 },
    'Blood Sugar (Fasting)': { name: 'Diabetes Care Pack', saveLabel: 'Save â‚¹271', tests: ['HbA1c', 'Lipid Profile'], comboPrice: 999 },
    'Blood Sugar (Postprandial / Post Lunch - 2 HR)': { name: 'Sugar Control Pack', saveLabel: 'Save â‚¹351', tests: ['Blood Sugar (Fasting)', 'HbA1c'], comboPrice: 499 },
    'Random Blood Sugar (RBS)': { name: 'Basic Sugar Check', saveLabel: 'Save â‚¹100', tests: ['Blood Sugar (Fasting)'], comboPrice: 249 },
    'Complete Blood Count (CBC)': { name: 'Anaemia Checkup', saveLabel: 'Save â‚¹600', tests: ['Iron Studies', 'Vitamin B12'], comboPrice: 1799 },
    'Thyroid Profile (T3, T4, TSH)': { name: 'Complete Thyroid', saveLabel: 'Save â‚¹151', tests: ['TSH'], comboPrice: 899 },
    'Lipid Profile': { name: 'Heart Health Pack', saveLabel: 'Save â‚¹201', tests: ['Total Cholesterol', 'hs-CRP'], comboPrice: 749 },
    'Vitamin D Total': { name: 'Bone Health Pack', saveLabel: 'Save â‚¹401', tests: ['Vitamin B12', 'Serum Calcium'], comboPrice: 1799 },
    'Liver Function Test (LFT)': { name: 'Organ Health Pack', saveLabel: 'Save â‚¹301', tests: ['Kidney Function Test (KFT)', 'Lipid Profile'], comboPrice: 1499 },
    'Kidney Function Test (KFT)': { name: 'Organ Health Pack', saveLabel: 'Save â‚¹301', tests: ['Liver Function Test (LFT)', 'Lipid Profile'], comboPrice: 1499 },
  };

  // Expose tests and packages globally for HealthPackages / PackageDetail pages
  window.__allTests = seedTests;
  window.__packagesByAxis = getPackagesByAxis(seedTests);

  const getComboForTest = (test) => {
    if (!test || !comboData[test.name]) return null;
    const combo = comboData[test.name];
    const comboItems = combo.tests.map(name => tests.find(t => t.name === name)).filter(Boolean);
    const total = (test.price || 0) + comboItems.reduce((s, t) => s + (t?.price || 0), 0);
    return { ...combo, items: [test, ...comboItems], total, savings: total - combo.comboPrice };
  };

  let allTests = [];

  const load = async () => {
    setLoading(true);
    let filtered = [...seedTests];
    if (mode === 'packages') {
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
    load();
    const checkPkg = () => {
      const data = window.__packagesByAxis;
      if (data && Object.keys(data).length > 0) { setPackagesByAxis(data); return true; }
      return false;
    };
    if (!checkPkg()) {
      const t = setInterval(() => { checkPkg(); }, 200);
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
    setShowAllTests(true);
    load();
  };

  const allPackagesList = Object.values(packagesByAxis).flat();
  const packageSuggestions = packageSearch.trim()
    ? allPackagesList.filter(p => p.name.toLowerCase().includes(packageSearch.toLowerCase()) || p.desc?.toLowerCase().includes(packageSearch.toLowerCase())).slice(0, 8)
    : [];

  const handlePackageSuggestionClick = (pkg) => {
    setPackageSearch(pkg.name);
    setShowPackageSuggestions(false);
  };

  const addToCart = (test) => {
    setCart(prev => {
      if (prev.find(i => i.id === test.id)) return prev;
      return [...prev, { ...test, qty: 1 }];
    });
  };

  let addressTimer;
  const searchAddress = (q) => {
    clearTimeout(addressTimer);
    if (!q.trim()) { setAddressSuggestions([]); setShowAddressSuggestions(false); return; }
    addressTimer = setTimeout(async () => {
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

  const handlePlace = async () => {
    setPlacing(true);
    try {
      await placeDiagnosticOrder({
        tests: cart.map(i => ({ testId: i.id, name: i.name, price: i.price })),
        totalAmount: cartTotal,
        collectionDate: collectionDate || null,
        collectionTime: collectionTime || null,
        collectionAddress: address.city ? address : null,
        bookedFor: bookedFor || null,
        paymentMethod: paymentMethod || 'pay_at_collection',
        patientInfo: patientInfo.name ? patientInfo : null,
      });
      const generatedId = 'JHC-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.random().toString(36).slice(2,6).toUpperCase();
      setOrderId(generatedId);
      setBookingStep(5);
      setBookingSubmitted(true);
    } catch {} finally { setPlacing(false); }
  };

  if (bookingSubmitted) {
    return (
      <div className="page-wrapper" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-light)', padding: 40 }}>
        <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 4px 20px rgba(46,125,50,0.2)' }}>
            <CheckCircle size={48} weight="fill" color="#2e7d32" />
          </div>
          <h1 style={{ fontSize: 26, marginBottom: 6 }}>Booking Confirmed!</h1>
          <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 20 }}>Our healthcare team will contact you within 15-30 minutes.</p>
          <div style={{ background: 'linear-gradient(135deg, #e8f0fe, #d4e4f7)', borderRadius: 12, padding: '12px 20px', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#0F5DA8', fontWeight: 700, marginBottom: 24 }}>
            <CheckCircle size={18} weight="fill" /> Booking ID: {orderId || 'JHC-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.random().toString(36).slice(2,6).toUpperCase()}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:+919700104108" style={{ background: 'linear-gradient(135deg, #0F5DA8, #0C6BC4)', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', boxShadow: '0 4px 14px rgba(10,94,176,0.3)' }}>
              <Phone size={18} weight="fill" /> Call Now
            </a>
            <a href={`https://wa.me/919700104108?text=${encodeURIComponent('Hi! I\'ve booked tests on Jeevan HealthCare. Order ID: ' + (orderId || ''))}`} target="_blank" rel="noopener noreferrer" style={{ background: '#25d366', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', boxShadow: '0 4px 14px rgba(37,211,102,0.3)' }}>
              <WhatsappLogo size={18} weight="fill" /> WhatsApp
            </a>
            <button onClick={() => { setBookingSubmitted(false); setBookingStep(1); setCart([]); setShowForm(false); setOrderId(null); navigate('/'); }} style={{ padding: '12px 24px', borderRadius: 10, fontWeight: 600, fontSize: 14, background: '#fff', color: '#0F5DA8', border: '1px solid #0F5DA8', cursor: 'pointer', fontFamily: 'inherit' }}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0F5DA8 0%, #0C6BC4 100%)',
        padding: '40px 20px 32px', textAlign: 'center',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div className="container" style={{ maxWidth: 720, position: 'relative', zIndex: 1 }}>
          {/* City + availability row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowCityPicker(!showCityPicker)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px',
                  borderRadius: 20, background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 12,
                  fontFamily: 'inherit', fontWeight: 500, transition: 'all 0.15s',
                }}>
                <MapPin size={12} weight="fill" />
                {city}
                <CaretDown size={10} />
              </button>
              {showCityPicker && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 6px)', left: 0, minWidth: 160,
                  background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  overflow: 'hidden', zIndex: 10, textAlign: 'left',
                }}>
                  {['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'].map(c => (
                    <button key={c} onMouseDown={() => { setCity(c); setShowCityPicker(false); }}
                      style={{
                        display: 'block', width: '100%', padding: '10px 16px', fontSize: 13,
                        border: 'none', background: city === c ? '#e8f0fe' : '#fff',
                        color: city === c ? '#0F5DA8' : 'var(--text-dark)', cursor: 'pointer',
                        fontFamily: 'inherit', fontWeight: city === c ? 600 : 400,
                        textAlign: 'left', transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f0f5ff'}
                      onMouseLeave={e => e.currentTarget.style.background = city === c ? '#e8f0fe' : '#fff'}>
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle size={11} weight="fill" color="#22C55E" /> Free home collection
            </span>
          </div>

          {/* Heading */}
          {mode === 'tests' ? (
            <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, marginBottom: 4, letterSpacing: -0.3 }}>Looking for a Test?</h1>
          ) : (
            <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, marginBottom: 4, letterSpacing: -0.3 }}>Health Packages</h1>
          )}
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, marginBottom: 20, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
            {mode === 'tests' ? 'Book diagnostic tests at home â€” accurate reports, doorstep collection' : 'Curated health checkup packages â€” up to 60% off'}
          </p>

          {/* Search bar (tests only) */}
          {mode === 'tests' && (
            <div style={{ position: 'relative', maxWidth: 520, margin: '0 auto' }}>
              <MagnifyingGlass size={18} style={{ position: 'absolute', left: 18, top: 13, color: '#0F5DA8' }} />
              <input type="text" placeholder="Search tests (e.g., CBC, Thyroid, Lipid)..."
                value={search}
                onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
                onFocus={() => { setFocused(true); setShowSuggestions(true); }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={e => { if (e.key === 'Enter') { setShowAllTests(true); setShowSuggestions(false); } }}
                style={{
                  width: '100%', padding: '12px 16px 12px 48px', borderRadius: 50,
                  border: 'none', fontSize: 14, outline: 'none', background: '#fff',
                  fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }} />
              {showSuggestions && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                  background: '#fff', borderRadius: 16, boxShadow: '0 12px 48px rgba(0,0,0,0.12)',
                  border: '1px solid var(--border)', overflow: 'hidden', zIndex: 999, textAlign: 'left',
                }}>
                  {search.trim() && suggestions.length > 0 ? (
                    suggestions.map(t => (
                      <button key={t.id} onMouseDown={() => handleSuggestionClick(t.name)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 18px',
                          border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                          borderBottom: '1px solid #f5f5f5', transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f0f5ff'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                        <MagnifyingGlass size={16} color="#0F5DA8" />
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-dark)' }}>{t.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{t.category} â€¢ â‚¹{t.offerPrice || t.price} {t.mrp ? <span style={{ textDecoration: 'line-through', marginLeft: 2, color: '#bbb' }}>â‚¹{t.mrp}</span> : null}</div>
                        </div>
                      </button>
                    ))
                  ) : !search.trim() && focused ? (
                    <div style={{ padding: '12px 18px' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Popular Tests</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {popularTests.map(name => (
                          <button key={name} onMouseDown={() => handleSuggestionClick(name)}
                            style={{
                              padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                              background: '#e8f0fe', color: '#0F5DA8', border: 'none', cursor: 'pointer',
                              fontFamily: 'inherit', transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#d0e2ff'}
                            onMouseLeave={e => e.currentTarget.style.background = '#e8f0fe'}>
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : search.trim() && suggestions.length === 0 ? (
                    <div style={{ padding: '16px 18px', fontSize: 13, color: 'var(--text-light)', textAlign: 'center' }}>
                      No tests found â€” try a different name
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Sticky Tab Bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: '#fff', borderBottom: '1px solid #e8edf2',
        padding: '0 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div className="container" style={{ display: 'flex', gap: 0, maxWidth: 720 }}>
          <button onClick={() => { setMode('tests'); setSearch(''); setCategory(''); }}
            style={{
              flex: 1, padding: '14px 16px', fontSize: 14, fontWeight: 600,
              background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              color: mode === 'tests' ? '#0F5DA8' : '#8b9bb5',
              borderBottom: mode === 'tests' ? '2px solid #0F5DA8' : '2px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s',
            }}>
            <Flask size={18} weight={mode === 'tests' ? 'fill' : 'regular'} />
            Diagnostic Tests
            {mode === 'tests' && <span style={{ fontSize: 11, color: '#0F5DA8', fontWeight: 700, marginLeft: 4, background: '#e8f0fe', padding: '1px 8px', borderRadius: 10 }}>{seedTests.length - 3}</span>}
          </button>
          <button onClick={() => { setMode('packages'); setSearch(''); setCategory(''); }}
            style={{
              flex: 1, padding: '14px 16px', fontSize: 14, fontWeight: 600,
              background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              color: mode === 'packages' ? '#22C55E' : '#8b9bb5',
              borderBottom: mode === 'packages' ? '2px solid #22C55E' : '2px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s',
            }}>
            <Gift size={18} weight={mode === 'packages' ? 'fill' : 'regular'} />
            Health Packages
            {mode === 'packages' && <span style={{ fontSize: 11, color: '#fff', fontWeight: 700, background: '#22C55E', padding: '1px 8px', borderRadius: 10 }}>SAVE 60%</span>}
          </button>
        </div>
      </div>

      <div style={{ padding: '28px 20px' }}>
        <div className="container">
          {/* Cart bar */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, padding: '12px 16px', background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <ShoppingCart size={20} color="var(--primary)" />
            <span style={{ fontSize: 14, fontWeight: 600 }}>{cart.length} tests</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>â‚¹{cartTotal}</span>
            <button onClick={() => setShowCart(!showCart)} style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              {showCart ? 'Hide' : 'View'} Cart
            </button>
                {cart.length > 0 && (
                  <button onClick={() => (setShowForm(true), setBookingStep(1))}
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
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>â‚¹{item.price}</span>
                  <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--text-light)', padding: 4, background: 'none', border: 'none', cursor: 'pointer' }}><Trash size={16} /></button>
                </div>
              ))}
            </div>
          )}

          {/* Prescription Upload â€” Prominent */}
          <div className="container" style={{ marginBottom: 16 }}>
            <div style={{
              background: 'linear-gradient(135deg, #eef4ff, #f5f9ff, #fff)',
              borderRadius: 16, border: '1px solid #c7d9f0', padding: '18px 20px',
              display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'linear-gradient(135deg, #0F5DA8, #0C6BC4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <FileText size={22} weight="fill" color="#fff" />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F5DA8', margin: 0 }}>
                  Have a Prescription? Upload Here
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-light)', margin: '2px 0 0' }}>
                  Upload your doctor's prescription and we'll match the right tests for you
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {prescription ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: '#2e7d32', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle size={14} weight="fill" /> {prescription.name.length > 15 ? prescription.name.slice(0, 15) + 'â€¦' : prescription.name}
                    </span>
                    <button onClick={() => { setPrescription(null); if (prescriptionRef.current) prescriptionRef.current.value = ''; }}
                      style={{ background: '#fee2e2', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#dc2626', cursor: 'pointer', fontWeight: 500 }}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <button onClick={() => prescriptionRef.current?.click()}
                    style={{
                      padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                      background: 'linear-gradient(135deg, #0F5DA8, #0C6BC4)', color: '#fff',
                      border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                      boxShadow: '0 2px 8px rgba(15,93,168,0.25)',
                    }}>
                    <input ref={prescriptionRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }}
                      onChange={e => { const f = e.target.files?.[0]; if (f) { setPrescription(f); if (window?.gtag) window.gtag('event', 'prescription_upload'); } }} />
                    ðŸ“„ Upload Prescription
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Booking Form â€” Multi Step */}
          {showForm && bookingStep < 5 && (
            <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 20, marginBottom: 16 }}>
              {/* Step indicator */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 20, overflowX: 'auto' }}>
                {['Review', 'Patient', 'Address', 'Payment'].map((label, i) => (
                  <button key={label} onClick={() => bookingStep > i && setBookingStep(i + 1)}
                    style={{
                      flex: 1, minWidth: 0, padding: '6px 4px', borderRadius: 6,
                      fontSize: 11, fontWeight: 600, border: 'none', cursor: bookingStep > i ? 'pointer' : 'default',
                      background: bookingStep >= i + 1 ? '#0F5DA8' : '#f0f0f0',
                      color: bookingStep >= i + 1 ? '#fff' : '#999',
                      fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.15s',
                    }}>
                    {bookingStep > i + 1 ? 'âœ“ ' : ''}{i + 1}. {label}
                  </button>
                ))}
              </div>

              {/* Step 1: Review Order */}
              {bookingStep === 1 && (
                <>
                  <h3 style={{ fontSize: 15, marginBottom: 12 }}>Review Your Order</h3>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                      <Flask size={20} color="var(--primary)" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-light)' }}>{item.category} â€¢ Qty: {item.qty || 1}</p>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>â‚¹{item.price}</span>
                      <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--text-light)', padding: 4, background: 'none', border: 'none', cursor: 'pointer' }}><Trash size={16} /></button>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '2px solid var(--primary)' }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>Total</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>â‚¹{cartTotal}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => setShowForm(false)} className="btn-outline" style={{ flex: 1 }}>Back to Tests</button>
                    <button onClick={() => setBookingStep(2)} className="btn-accent" style={{ flex: 1 }}>Continue</button>
                  </div>
                </>
              )}

              {/* Step 2: Patient Details */}
              {bookingStep === 2 && (
                <>
                  <h3 style={{ fontSize: 15, marginBottom: 12 }}>Patient Details</h3>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12 }}>Booking for</label>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                      <button onClick={() => { setBookedFor(null); setPatientInfo({ name: '', age: '', gender: '' }); }}
                        style={{
                          padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                          background: !bookedFor ? '#0F5DA8' : '#f0f0f0',
                          color: !bookedFor ? '#fff' : 'var(--text-dark)',
                          border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                        }}>
                        <User size={14} style={{ marginRight: 4 }} /> Myself
                      </button>
                      {familyMembers.map(m => (
                        <button key={m.id} onClick={() => { setBookedFor(m); setPatientInfo({ name: m.name || '', age: m.age || '', gender: m.gender || '' }); }}
                          style={{
                            padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                            background: bookedFor?.id === m.id ? '#0F5DA8' : '#f0f0f0',
                            color: bookedFor?.id === m.id ? '#fff' : 'var(--text-dark)',
                            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                          }}>
                          <User size={14} style={{ marginRight: 4 }} /> {m.name}
                        </button>
                      ))}
                      <button onClick={() => navigate('/add-family')}
                        style={{
                          padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                          background: '#e8f0fe', color: '#0F5DA8', border: '1px dashed #0F5DA8',
                          cursor: 'pointer', fontFamily: 'inherit',
                        }}>
                        + Add Member
                      </button>
                    </div>
                  </div>
                  {!bookedFor && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                      <input placeholder="Your Name" value={patientInfo.name}
                        onChange={e => setPatientInfo({ ...patientInfo, name: e.target.value })}
                        className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
                      <select value={patientInfo.gender}
                        onChange={e => setPatientInfo({ ...patientInfo, gender: e.target.value })}
                        className="input" style={{ padding: '8px 10px', fontSize: 13 }}>
                        <option value="">Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  )}

                  {/* Prescription Upload */}
                  <div style={{ marginTop: 12, marginBottom: 16, borderTop: '1px solid #f0f0f0', paddingTop: 14 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <FileText size={13} color="#0F5DA8" /> Upload Prescription (optional)
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 10 }}>Have a prescription? Upload it so we can match your tests accurately.</p>
                    {prescription ? (
                      <div style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '10px 12px', background: '#f9fafb', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 20 }}>ðŸ“Ž</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prescription.name}</div>
                          <div style={{ fontSize: 11, color: '#2e7d32', display: 'flex', alignItems: 'center', gap: 3 }}><CheckCircle size={11} weight="fill" /> Uploaded</div>
                        </div>
                        <button type="button" onClick={() => { setPrescription(null); if (prescriptionRef.current) prescriptionRef.current.value = ''; }}
                          style={{ background: '#fee2e2', border: 'none', borderRadius: 4, padding: '3px 8px', fontSize: 11, color: '#dc2626', cursor: 'pointer', fontWeight: 500 }}>Remove</button>
                      </div>
                    ) : (
                      <div style={{ border: '1px dashed #d1d5db', borderRadius: 8, padding: '12px', textAlign: 'center', cursor: 'pointer', background: '#fafafa' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#0F5DA8'; e.currentTarget.style.background = '#eef4ff'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = '#fafafa'; }}
                        onClick={() => prescriptionRef.current?.click()}>
                        <input ref={prescriptionRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }}
                          onChange={e => { const f = e.target.files?.[0]; if (f) setPrescription(f); }} />
                        <span style={{ fontSize: 11, color: '#6b7280' }}>ðŸ“„ Click to upload prescription (PDF or image)</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => setBookingStep(1)} className="btn-outline" style={{ flex: 1 }}>Back</button>
                    <button onClick={() => {
                      if (bookedFor || patientInfo.name.trim()) setBookingStep(3);
                    }} className="btn-accent" style={{ flex: 1 }}>Continue</button>
                  </div>
                </>
              )}

              {/* Step 3: Address + Date/Time */}
              {bookingStep === 3 && (
                <>
                  <h3 style={{ fontSize: 15, marginBottom: 4 }}>Schedule Home Collection</h3>
                  <p style={{ fontSize: 12, color: '#e65100', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={14} weight="fill" color="#FF8A00" />
                    Next available slot: {nextSlot} â€” Limited slots
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={{ fontSize: 12 }}>Collection Date</label>
                        <input type="date" value={collectionDate} min={new Date().toISOString().split('T')[0]}
                          onChange={e => setCollectionDate(e.target.value)} className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 12 }}>Preferred Time</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 4 }}>
                          {[
                            { slot: '6:00 AM - 7:00 AM', status: 'available' },
                            { slot: '7:00 AM - 8:00 AM', status: 'available' },
                            { slot: '8:00 AM - 9:00 AM', status: 'limited' },
                            { slot: '9:00 AM - 10:00 AM', status: 'available' },
                            { slot: '10:00 AM - 11:00 AM', status: 'available' },
                            { slot: '11:00 AM - 12:00 PM', status: 'limited' },
                            { slot: '12:00 PM - 1:00 PM', status: 'full' },
                            { slot: '1:00 PM - 2:00 PM', status: 'full' },
                            { slot: '2:00 PM - 3:00 PM', status: 'available' },
                            { slot: '3:00 PM - 4:00 PM', status: 'available' },
                            { slot: '4:00 PM - 5:00 PM', status: 'limited' },
                            { slot: '5:00 PM - 6:00 PM', status: 'available' },
                            { slot: '6:00 PM - 7:00 PM', status: 'full' },
                            { slot: '7:00 PM - 8:00 PM', status: 'full' },
                          ].map(t => {
                            const isSelected = collectionTime === t.slot;
                            const isFull = t.status === 'full';
                            return (
                              <button key={t.slot} onClick={() => !isFull && setCollectionTime(isSelected ? '' : t.slot)}
                                disabled={isFull}
                                style={{
                                  padding: '8px 6px', borderRadius: 8, fontSize: 11, fontWeight: 500,
                                  background: isSelected ? '#0F5DA8' : isFull ? '#f5f5f5' : '#fff',
                                  color: isSelected ? '#fff' : isFull ? '#ccc' : 'var(--text-dark)',
                                  border: `1px solid ${isSelected ? '#0F5DA8' : isFull ? '#eee' : 'var(--border)'}`,
                                  cursor: isFull ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                                  textAlign: 'center', transition: 'all 0.15s', position: 'relative',
                                }}>
                                <div style={{ fontSize: 11 }}>{t.slot.replace(' - ', '\n')}</div>
                                <span style={{
                                  display: 'inline-block', fontSize: 9, fontWeight: 700, marginTop: 2,
                                  color: isSelected ? 'rgba(255,255,255,0.8)' : 
                                    isFull ? '#ccc' : t.status === 'available' ? '#22C55E' : '#FF8A00',
                                }}>
                                  {isFull ? 'Full' : t.status === 'available' ? 'Available' : 'Limited'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <label style={{ fontSize: 12 }}>Collection Address</label>
                    <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
                      <input placeholder="Type your address..." value={address.line1}
                        onChange={e => { setAddress({ ...address, line1: e.target.value }); searchAddress(e.target.value); }}
                        onFocus={() => addressSuggestions.length > 0 && setShowAddressSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowAddressSuggestions(false), 200)}
                        className="input" style={{ padding: '8px 10px', fontSize: 13, flex: 1 }} />
                      {showAddressSuggestions && addressSuggestions.length > 0 && (
                        <div style={{
                          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 10,
                          background: '#fff', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                          border: '1px solid var(--border)', maxHeight: 200, overflowY: 'auto',
                        }}>
                          {addressSuggestions.map((s, i) => (
                            <button key={i} onMouseDown={() => {
                              setAddress({ line1: s.display, city: s.city, pincode: s.pincode });
                              setShowAddressSuggestions(false);
                            }}
                              style={{
                                display: 'block', width: '100%', padding: '10px 14px', fontSize: 13,
                                textAlign: 'left', border: 'none', background: '#fff', cursor: 'pointer',
                                fontFamily: 'inherit', borderBottom: i < addressSuggestions.length - 1 ? '1px solid #f5f5f5' : 'none',
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = '#f0f5ff'}
                              onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                              <MapPin size={12} style={{ marginRight: 6, color: '#0F5DA8', flexShrink: 0 }} />
                              {s.display}
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
                            setAddress({
                              line1: [addr.road, addr.suburb, addr.neighbourhood].filter(Boolean).join(', ') || 'ðŸ“ Current location',
                              city: addr.city || addr.town || addr.village || addr.state_district || '',
                              pincode: addr.postcode || '',
                            });
                          } catch {}
                          setLocating(false);
                        }, () => setLocating(false), { enableHighAccuracy: true });
                      }}
                        style={{
                          padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                          background: '#e8f0fe', color: '#0F5DA8', border: 'none', cursor: 'pointer',
                          fontFamily: 'inherit', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4,
                        }}>
                        <MapPin size={14} weight="fill" /> {locating ? 'Locating...' : 'Use my location'}
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <input placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
                      <input placeholder="PIN Code" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <button onClick={() => setBookingStep(2)} className="btn-outline" style={{ flex: 1 }}>Back</button>
                      <button onClick={() => setBookingStep(4)} className="btn-accent" style={{ flex: 1 }}>
                        Continue â€” â‚¹{cartTotal}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Step 4: Payment */}
              {bookingStep === 4 && (
                <>
                  <h3 style={{ fontSize: 15, marginBottom: 12 }}>Choose Payment Method</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { value: 'phonepe', label: 'PhonePe / Google Pay / UPI', icon: 'ðŸ“±', desc: 'Pay via any UPI app' },
                      { value: 'card', label: 'Credit / Debit Card', icon: 'ðŸ’³', desc: 'Visa, Mastercard, RuPay' },
                      { value: 'pay_at_collection', label: 'Pay at Collection', icon: 'ðŸ’µ', desc: 'Cash or card at your doorstep' },
                    ].map(opt => (
                      <button key={opt.value} onClick={() => setPaymentMethod(opt.value)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                          borderRadius: 12, border: `2px solid ${paymentMethod === opt.value ? '#0F5DA8' : 'var(--border)'}`,
                          background: paymentMethod === opt.value ? '#e8f0fe' : '#fff',
                          cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s',
                        }}>
                        <span style={{ fontSize: 24 }}>{opt.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{opt.label}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{opt.desc}</div>
                        </div>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%',
                          border: `2px solid ${paymentMethod === opt.value ? '#0F5DA8' : '#ccc'}`,
                          background: paymentMethod === opt.value ? '#0F5DA8' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {paymentMethod === opt.value && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button onClick={() => setBookingStep(3)} className="btn-outline" style={{ flex: 1 }}>Back</button>
                    <button onClick={handlePlace} disabled={placing || !paymentMethod} className="btn-accent" style={{ flex: 1 }}>
                      {placing ? 'Placing Order...' : `Pay â‚¹${cartTotal}`}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}



          {mode === 'packages' && (
            <div style={{ padding: '20px 0' }}>
              <div className="container">
                {/* Section intro */}
                <div ref={packagesRef} style={{
                  background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)',
                  borderRadius: 16, padding: '20px 24px', marginBottom: 20,
                  display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: 'linear-gradient(135deg, #22C55E, #16a34a)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Gift size={24} weight="fill" color="#fff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: '#166534', margin: 0 }}>Health Packages</h2>
                    <p style={{ fontSize: 13, color: '#4a7c59', margin: '2px 0 0' }}>Curated checkup bundles â€” more tests, less spend</p>
                  </div>
                </div>
                {/* Package search */}
                <div style={{ marginBottom: 16, position: 'relative' }}>
                  <MagnifyingGlass size={18} color="#aaa" style={{ position: 'absolute', left: 14, top: 12, zIndex: 1 }} />
                  <input type="text" placeholder="Search packages by name or category..."
                    value={packageSearch}
                    onChange={e => { setPackageSearch(e.target.value); setShowPackageSuggestions(true); }}
                    onFocus={e => { e.target.style.borderColor = '#22C55E'; setShowPackageSuggestions(true); }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border)'; setTimeout(() => setShowPackageSuggestions(false), 200); }}
                    style={{
                      width: '100%', padding: '10px 14px 10px 40px', borderRadius: 10,
                      border: '1px solid var(--border)', fontSize: 14, fontFamily: 'inherit',
                      outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 0.2s',
                    }} />
                  {showPackageSuggestions && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                      background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      border: '1px solid #e8edf2', overflow: 'hidden', zIndex: 999, textAlign: 'left',
                    }}>
                      {packageSearch.trim() && packageSuggestions.length > 0 ? (
                        packageSuggestions.map(pkg => (
                          <button key={pkg.slug} onMouseDown={() => handlePackageSuggestionClick(pkg)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 16px',
                              border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                              borderBottom: '1px solid #f5f5f5', transition: 'background 0.1s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                            onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                            <Gift size={16} color="#22C55E" />
                            <div style={{ textAlign: 'left', flex: 1 }}>
                              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-dark)' }}>{pkg.name}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{pkg.testCount} tests â€¢ â‚¹{pkg.bundlePrice?.toLocaleString()}</div>
                            </div>
                            <span style={{ fontSize: 10, fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg, #22C55E, #16a34a)', padding: '2px 8px', borderRadius: 4 }}>{pkg.discountPct}% off</span>
                          </button>
                        ))
                      ) : !packageSearch.trim() ? (
                        <div style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-light)' }}>
                          <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Popular Categories</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {['Full Body', 'Heart', 'Diabetes', 'Thyroid', 'Vitamin', 'Liver', 'Kidney'].map(cat => (
                              <button key={cat} onMouseDown={() => { setPackageSearch(cat); }}
                                style={{ padding: '5px 12px', borderRadius: 16, fontSize: 12, fontWeight: 500, background: '#e8f5e9', color: '#2e7d32', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div style={{ padding: '16px 18px', fontSize: 13, color: 'var(--text-light)', textAlign: 'center' }}>
                          No packages match "<strong>{packageSearch}</strong>"
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Package cards â€” all 117 by axis */}
                {Object.keys(packagesByAxis).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-light)' }}>
                    <p style={{ fontSize: 13 }}>Loading packages...</p>
                  </div>
                ) : (
                  (() => {
                    const axisOrder = ['organ', 'disease', 'disorder', 'age', 'gender', 'lifestyle', 'lifeStage', 'symptom', 'occupation', 'medication', 'familyHistory', 'seasonal', 'diet', 'postRecovery', 'travel', 'insurance', 'preventive', 'budget', 'risk', 'duration', 'mentalHealth', 'fitness', 'sleep', 'environmental', 'vaccination', 'preSurgical', 'ethnicity', 'fertility'];
                    const axisMeta = {
                      organ: { label: 'Organ Wise', icon: Heartbeat, color: '#0F5DA8' },
                      disease: { label: 'Disease Wise', icon: Warning, color: '#c62828' },
                      disorder: { label: 'Disorder Wise', icon: Shield, color: '#7b1fa2' },
                      age: { label: 'Age Wise', icon: User, color: '#2e7d32' },
                      gender: { label: 'Gender Wise', icon: Heart, color: '#e65100' },
                      lifestyle: { label: 'Lifestyle Wise', icon: Lightbulb, color: '#FF8A00' },
                      lifeStage: { label: 'Life Stage Wise', icon: Baby, color: '#ec407a' },
                      symptom: { label: 'Symptom Wise', icon: Warning, color: '#ff7043' },
                      occupation: { label: 'Occupation Wise', icon: Suitcase, color: '#5c6bc0' },
                      medication: { label: 'Medication Monitoring', icon: Pill, color: '#26a69a' },
                      familyHistory: { label: 'Family History / Genetic', icon: Heartbeat, color: '#ef5350' },
                      seasonal: { label: 'Seasonal Wise', icon: Cloud, color: '#42a5f5' },
                      diet: { label: 'Diet Wise', icon: ForkKnife, color: '#66bb6a' },
                      postRecovery: { label: 'Post-Recovery Wise', icon: Heartbeat, color: '#ab47bc' },
                      travel: { label: 'Travel Wise', icon: Airplane, color: '#ffa726' },
                      insurance: { label: 'Insurance / Corporate', icon: Briefcase, color: '#78909c' },
                      preventive: { label: 'Preventive Screening', icon: Shield, color: '#26c6da' },
                      budget: { label: 'Budget / Price Tier', icon: Coin, color: '#ffca28' },
                      risk: { label: 'Risk Profile', icon: Warning, color: '#ef5350' },
                      duration: { label: 'Duration / Urgency', icon: Clock, color: '#8d6e63' },
                      mentalHealth: { label: 'Mental Health', icon: Heart, color: '#7e57c2' },
                      fitness: { label: 'Fitness & Sports', icon: Lightning, color: '#ff7043' },
                      sleep: { label: 'Sleep Health', icon: Moon, color: '#5c6bc0' },
                      environmental: { label: 'Environmental / Toxin', icon: Leaf, color: '#66bb6a' },
                      vaccination: { label: 'Vaccination & Immunity', icon: Syringe, color: '#42a5f5' },
                      preSurgical: { label: 'Pre-Surgical', icon: FirstAid, color: '#ef5350' },
                      ethnicity: { label: 'Ethnicity / Region', icon: Globe, color: '#ab47bc' },
                      fertility: { label: 'Fertility & Reproductive', icon: Heart, color: '#ec407a' },
                    };
                    const q = packageSearch.toLowerCase().trim();
                    const hasSearch = q.length > 0;
                    const matchedAxes = axisOrder.filter(a => {
                      if (!packagesByAxis[a]) return false;
                      if (!hasSearch) return true;
                      return packagesByAxis[a].some(p => p.name.toLowerCase().includes(q) || p.desc?.toLowerCase().includes(q) || a.toLowerCase().includes(q));
                    });
                    if (matchedAxes.length === 0) {
                      return (
                        <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-light)' }}>
                          <p style={{ fontSize: 14 }}>No packages match "<strong>{packageSearch}</strong>"</p>
                          <button onClick={() => setPackageSearch('')} style={{
                            marginTop: 10, padding: '6px 16px', borderRadius: 8, fontSize: 12,
                            background: '#f0fdf4', color: '#22C55E', border: '1px solid #b7e4c7',
                            cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
                          }}>Clear search</button>
                        </div>
                      );
                    }
                    return matchedAxes.map(axis => {
                      const meta = axisMeta[axis] || { label: axis, icon: Heartbeat, color: '#888' };
                      const Icon = meta.icon;
                      const pkgs = packagesByAxis[axis];
                      return (
                        <div key={axis} style={{ marginBottom: 28 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: meta.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Icon size={18} weight="fill" color={meta.color} />
                            </div>
                            <h3 style={{ fontSize: 15, margin: 0 }}>{meta.label}</h3>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
                            {pkgs.map(pkg => (
                              <div key={pkg.slug} onClick={() => navigate(`/package/${pkg.slug}`)}
                                style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 14, cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                                  <h4 style={{ fontSize: 13, margin: 0, color: meta.color }}>{pkg.name}</h4>
                                  <span style={{ fontSize: 10, fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg, #22C55E, #16a34a)', padding: '1px 6px', borderRadius: 4, whiteSpace: 'nowrap' }}>{pkg.discountPct}% off</span>
                                </div>
                                <p style={{ fontSize: 11, color: 'var(--text-light)', lineHeight: 1.4, marginBottom: 8 }}>{pkg.desc}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>
                                  <span style={{ fontWeight: 600 }}>{pkg.testCount} Tests</span>
                                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#ddd' }} />
                                  <span>Save â‚¹{pkg.savings?.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <div>
                                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>â‚¹{pkg.bundlePrice?.toLocaleString()}</span>
                                    <span style={{ fontSize: 11, color: 'var(--text-light)', textDecoration: 'line-through', marginLeft: 4 }}>â‚¹{pkg.totalMrp?.toLocaleString()}</span>
                                  </div>
                                  <CaretRight size={14} color={meta.color} />
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
            </div>
          )}

          {mode === 'tests' && (
            <>
              {/* Category Chips */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, overflowX: 'auto', paddingBottom: 4, flexShrink: 0 }}>
                <button onClick={() => setCategory('')}
                  style={{
                    padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: !category ? '#0F5DA8' : '#f0f0f0',
                    color: !category ? '#fff' : 'var(--text-dark)',
                    border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                    transition: 'all 0.15s',
                  }}>
                  All
                </button>
                {categoryList.map(cat => (
                  <button key={cat.name} onClick={() => setCategory(category === cat.name ? '' : cat.name)}
                    style={{
                      padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: category === cat.name ? cat.color : '#f0f0f0',
                      color: category === cat.name ? '#fff' : 'var(--text-dark)',
                      border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                      display: 'flex', alignItems: 'center', gap: 6,
                      transition: 'all 0.15s',
                    }}>
                    <cat.icon size={14} weight={category === cat.name ? 'fill' : undefined} />
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Sort bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: 'var(--text-light)', fontWeight: 600 }}>Sort by:</span>
                {sortOptions.map(opt => (
                  <button key={opt.value} onClick={() => setSortBy(opt.value)}
                    style={{
                      padding: '5px 12px', borderRadius: 16, fontSize: 12, fontWeight: 500,
                      background: sortBy === opt.value ? '#0F5DA8' : '#f0f0f0',
                      color: sortBy === opt.value ? '#fff' : 'var(--text-dark)',
                      border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.15s',
                    }}>
                    {opt.label}
                  </button>
                ))}
                <span style={{ fontSize: 11, color: 'var(--text-light)', marginLeft: 'auto' }}>
                  {tests.length} tests found
                </span>
              </div>
            </>
          )}

          {/* Test Grid */}
          {mode === 'tests' && (
            loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-light)' }}>Loading tests...</div>
            ) : sortedTests.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center' }}>
                <Flask size={32} style={{ color: 'var(--text-light)', marginBottom: 8 }} />
                <p style={{ color: 'var(--text-light)' }}>No tests found.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
              {sortedTests.map(test => {
                const inCart = cart.find(i => i.id === test.id);
                const isPackage = test.subcategory === 'Health Packages';
                const paramMatch = isPackage && test.description.match(/(\d+)\+?\s*(parameters|tests|params)/i);
                return (
                   <div key={test.id} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: isPackage ? '2px solid #22C55E' : '1px solid var(--border)', padding: 16, position: 'relative' }}>
                    {mostBookedTests.includes(test.name) && (
                      <span style={{
                        position: 'absolute', top: 8, right: 8,
                        background: 'linear-gradient(135deg, #FF8A00, #FF4D6D)', color: '#fff',
                        fontSize: 9, fontWeight: 700, padding: '2px 10px', borderRadius: 4,
                        textTransform: 'uppercase', letterSpacing: 0.3,
                        zIndex: 2,
                      }}>
                        Most Booked
                      </span>
                    )}
                    {isPackage && (
                      <span style={{
                        position: 'absolute', top: 8, left: 8,
                        background: '#22C55E', color: '#fff',
                        fontSize: 9, fontWeight: 700, padding: '2px 10px', borderRadius: 4,
                        textTransform: 'uppercase', letterSpacing: 0.3,
                        zIndex: 2,
                      }}>
                        PACKAGE {paramMatch ? `â€¢ ${paramMatch[1]}+ Tests` : ''}
                      </span>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, minWidth: 0, marginTop: isPackage ? 20 : 0 }}>
                        <h3 style={{ fontSize: 14, margin: 0, cursor: 'pointer', color: '#0F5DA8' }} onClick={() => setSelectedTest(test)}>{test.name}</h3>
                        <p style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 500, marginTop: 2 }}>{test.subcategory}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 6, lineHeight: 1.4 }}>{test.description}</p>
                    {bookingCounts[test.name] && (
                      <p style={{ fontSize: 11, color: '#22C55E', fontWeight: 600, marginTop: 4 }}>
                        {bookingCounts[test.name]} booked this month
                        {dailyBookings[test.name] && <span style={{ color: '#FF8A00', marginLeft: 8 }}>{dailyBookings[test.name]} today</span>}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap', fontSize: 12, color: 'var(--text-secondary)' }}>
                      {test.fasting_required ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#e65100', fontWeight: 600 }}>
                          <WarningCircle size={14} weight="fill" color="#e65100" /> Fasting required
                        </span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#22C55E', fontWeight: 600 }}>
                          <CheckCircle size={14} weight="fill" color="#22C55E" /> No fasting
                        </span>
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-light)' }}><Clock size={14} /> {test.report_time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>â‚¹{test.offerPrice || test.price}</span>
                      {test.mrp && test.mrp > (test.offerPrice || test.price) && (
                        <span style={{ fontSize: 12, color: 'var(--text-light)', textDecoration: 'line-through', marginLeft: 4 }}>â‚¹{test.mrp}</span>
                      )}
                      {test.mrp && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #FF8A00, #FF4D6D)', padding: '2px 6px', borderRadius: 4, marginLeft: 6, letterSpacing: 0.3 }}>{Math.round((1 - (test.offerPrice || test.price) / test.mrp) * 100)}% off</span>
                      )}
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
                    {(() => {
                      const isPkg = test.subcategory === 'Health Packages';
                      const edu = isPkg ? getPackageEducation(test) : getTestEducation(test);
                      const isOpen = faqOpen[test.id];
                      if (!edu || edu.length === 0) return null;
                      const top = edu.slice(0, 2);
                      const bgColor = isPkg ? '#eef5ff' : '#f3f0ff';
                      const textColor = isPkg ? '#0F5DA8' : '#7b1fa2';
                      const contentBg = isPkg ? '#f5f9ff' : '#faf9ff';
                      return (
                        <div style={{ marginTop: 8 }}>
                          <button onClick={() => setFaqOpen(p => ({ ...p, [test.id]: !p[test.id] }))}
                            style={{
                              width: '100%', padding: '6px 10px', borderRadius: 6, background: bgColor,
                              border: isPkg ? '1px solid #b3d4ff' : 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 600,
                              color: textColor, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            }}>
                            <span>{isPkg ? 'About this package' : 'Why this test?'}</span>
                            <CaretDown size={12} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                          </button>
                          {isOpen && (
                            <div style={{ marginTop: 6, padding: '8px 10px', background: contentBg, borderRadius: 6, fontSize: 11, lineHeight: 1.6 }}>
                              {top.map((section, si) => (
                                <div key={si} style={{ marginBottom: si < top.length - 1 ? 8 : 0 }}>
                                  <p style={{ fontWeight: 700, color: section.color, marginBottom: 4 }}>{section.title}</p>
                                  {section.items.slice(0, 2).map((item, ii) => (
                                    <div key={ii} style={{ marginBottom: 4 }}>
                                      <p style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{item.q}</p>
                                      <p style={{ color: 'var(--text-body)' }}>{item.a.length > 120 ? item.a.slice(0, 120) + '...' : item.a}</p>
                                    </div>
                                  ))}
                                </div>
                              ))}
                              <p style={{ fontSize: 10, color: textColor, fontWeight: 600, marginTop: 4, cursor: 'pointer' }}
                                onClick={() => setSelectedTest(test)}>
                                View all FAQ â†’
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                    {relatedSuggestions[test.name] && (
                      <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f0f0f0' }}>
                        <div style={{ fontSize: 10, color: 'var(--text-light)', fontWeight: 600, marginBottom: 4 }}>Also booked</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {relatedSuggestions[test.name].map(name => {
                            const relatedTest = tests.find(t => t.name === name);
                            if (!relatedTest) return null;
                            const inCart = cart.find(i => i.id === relatedTest.id);
                            return (
                              <button key={name} onClick={(e) => { e.stopPropagation(); addToCart(relatedTest); }}
                                style={{
                                  padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 500,
                                  background: inCart ? '#e8f5e9' : '#f0f5ff',
                                  color: inCart ? '#2e7d32' : '#0F5DA8',
                                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                                  transition: 'all 0.15s', whiteSpace: 'nowrap',
                                }}>
                                {inCart ? `âœ“ ${name}` : `+ ${name}`}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <TestDetailModal test={selectedTest} onClose={() => setSelectedTest(null)}
        combo={selectedTest ? getComboForTest(selectedTest) : null}
        addComboToCart={(items) => { items.forEach(t => addToCart(t)); setSelectedTest(null); }}
        alsoBooked={selectedTest && relatedSuggestions[selectedTest.name]
          ? relatedSuggestions[selectedTest.name].map(name => tests.find(t => t.name === name)).filter(Boolean)
          : []}
        onAddAlsoBooked={(item) => { addToCart(item); }} />
    </>
  );
}

