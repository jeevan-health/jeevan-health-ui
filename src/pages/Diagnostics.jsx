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
  Phone, WhatsappLogo, Star, ArrowRight, X,
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
  { name: 'Fever', icon: Drop, color: '#ff6f00' },
  { name: 'Vitamin', icon: Sparkle, color: '#00acc1' },
  { name: 'Diabetes', icon: Drop, color: '#1e88e5' },
  { name: 'Thyroid', icon: Shield, color: '#8e24aa' },
  { name: 'Hormones', icon: Drop, color: '#d81b60' },
  { name: 'Lifestyle', icon: Heart, color: '#43a047' },
  { name: 'Cancer', icon: Shield, color: '#e53935' },
  { name: 'Women Health', icon: Baby, color: '#ec407a' },
  { name: 'Senior Citizen', icon: User, color: '#78909c' },
  { name: 'Corporate Health', icon: Briefcase, color: '#5c6bc0' },
];

const categoryFilterMap = {
  'Full Body': '', 'Heart': 'Cardiac', 'Fever': 'Infections', 'Vitamin': 'Vitamins',
  'Diabetes': 'Diabetes', 'Thyroid': 'Thyroid', 'Hormones': 'Hormones', 'Lifestyle': '',
  'Cancer': 'Cancer', 'Women Health': 'Hormones', 'Senior Citizen': '', 'Corporate Health': '',
};

const mostBookedPackages = [
  { name: 'Full Body Checkup', tests: 'CBC, LFT, KFT, Lipid, Thyroid, Vitamin D, HbA1c, Urine', price: 799, mrp: 2499, rating: 4.8, booked: '15,200+', image: '🏥' },
  { name: 'Diabetes Care Pack', tests: 'HbA1c, Fasting Sugar, Postprandial, Lipid, KFT, Urine Micro', price: 999, mrp: 2199, rating: 4.7, booked: '12,800+', image: '💉' },
  { name: 'Thyroid Wellness', tests: 'TSH, T3, T4, Anti-TPO, Anti-Tg, Vitamin D, CBC', price: 699, mrp: 1799, rating: 4.6, booked: '9,400+', image: '🧬' },
  { name: 'Heart Health', tests: 'Lipid, hs-CRP, Homocysteine, ECG, Troponin, LFT', price: 1299, mrp: 2999, rating: 4.9, booked: '8,700+', image: '❤️' },
  { name: 'Women Wellness', tests: 'CBC, Thyroid, Vitamin D, Iron, Pap Smear, Hormones', price: 1499, mrp: 3499, rating: 4.8, booked: '7,300+', image: '👩' },
  { name: 'Senior Citizen', tests: 'CBC, LFT, KFT, Lipid, HbA1c, Vitamin B12, PSA/CA125', price: 999, mrp: 2999, rating: 4.7, booked: '11,600+', image: '👴' },
];

const offers = [
  { title: 'Full Body Checkup', price: '₹799 Only', mrp: '₹2,499', discount: '68% OFF', gradient: 'linear-gradient(135deg, #0F5DA8, #1a73e8)', emoji: '🏥', tag: 'Today Only' },
  { title: 'Diabetes Package', price: '₹999', mrp: '₹2,199', discount: '55% OFF', gradient: 'linear-gradient(135deg, #1e88e5, #42a5f5)', emoji: '💉', tag: 'Limited Slots' },
  { title: 'Thyroid Test Offer', price: '₹499', mrp: '₹1,299', discount: '62% OFF', gradient: 'linear-gradient(135deg, #8e24aa, #ab47bc)', emoji: '🧬', tag: 'Best Seller' },
  { title: 'Heart Health', price: '₹1,299', mrp: '₹2,999', discount: '57% OFF', gradient: 'linear-gradient(135deg, #e53935, #ef5350)', emoji: '❤️', tag: 'Popular' },
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
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

  const sortOptions = [
    { value: 'popular', label: 'Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A-Z' },
  ];

  const totalBookedToday = 247;
  const dailyBookings = {
    'Complete Blood Count (CBC)': 89, 'HbA1c': 124, 'Thyroid Profile (T3, T4, TSH)': 76,
    'Lipid Profile': 93, 'Vitamin D Total': 58, 'Blood Sugar (Fasting)': 67,
    'Liver Function Test (LFT)': 42, 'Kidney Function Test (KFT)': 38,
  };

  const popularTests = ['Complete Blood Count (CBC)', 'HbA1c', 'Thyroid Profile (T3, T4, TSH)', 'Lipid Profile', 'Vitamin D Total'];
  const mostBookedTests = ['Complete Blood Count (CBC)', 'HbA1c', 'Thyroid Profile (T3, T4, TSH)', 'Lipid Profile', 'Vitamin D Total', 'Blood Sugar (Fasting)', 'Blood Sugar (Postprandial / Post Lunch - 2 HR)', 'Random Blood Sugar (RBS)', 'Liver Function Test (LFT)', 'Kidney Function Test (KFT)'];
  const bookingCounts = {
    'Complete Blood Count (CBC)': '2,847', 'HbA1c': '4,216', 'Thyroid Profile (T3, T4, TSH)': '3,591',
    'Lipid Profile': '3,128', 'Vitamin D Total': '2,964', 'Blood Sugar (Fasting)': '1,873',
    'Blood Sugar (Postprandial / Post Lunch - 2 HR)': '2,146', 'Random Blood Sugar (RBS)': '1,214',
    'Liver Function Test (LFT)': '1,652', 'Kidney Function Test (KFT)': '1,449',
  };

  const comboData = {
    'HbA1c': { name: 'Diabetes Care Pack', saveLabel: 'Save ₹271', tests: ['Blood Sugar (Fasting)', 'Lipid Profile'], comboPrice: 999 },
    'Blood Sugar (Fasting)': { name: 'Diabetes Care Pack', saveLabel: 'Save ₹271', tests: ['HbA1c', 'Lipid Profile'], comboPrice: 999 },
    'Complete Blood Count (CBC)': { name: 'Anaemia Checkup', saveLabel: 'Save ₹600', tests: ['Iron Studies', 'Vitamin B12'], comboPrice: 1799 },
    'Thyroid Profile (T3, T4, TSH)': { name: 'Complete Thyroid', saveLabel: 'Save ₹151', tests: ['TSH'], comboPrice: 899 },
    'Lipid Profile': { name: 'Heart Health Pack', saveLabel: 'Save ₹201', tests: ['Total Cholesterol', 'hs-CRP'], comboPrice: 749 },
    'Vitamin D Total': { name: 'Bone Health Pack', saveLabel: 'Save ₹401', tests: ['Vitamin B12', 'Serum Calcium'], comboPrice: 1799 },
    'Liver Function Test (LFT)': { name: 'Organ Health Pack', saveLabel: 'Save ₹301', tests: ['Kidney Function Test (KFT)', 'Lipid Profile'], comboPrice: 1499 },
    'Kidney Function Test (KFT)': { name: 'Organ Health Pack', saveLabel: 'Save ₹301', tests: ['Liver Function Test (LFT)', 'Lipid Profile'], comboPrice: 1499 },
  };

  window.__allTests = seedTests;
  window.__packagesByAxis = getPackagesByAxis(seedTests);

  const load = async () => {
    setLoading(true);
    let filtered = [...seedTests];
    if (mode === 'packages' && !search && !selectedCategoryFilter) {
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

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [search, category, mode, selectedCategoryFilter]);

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
        prescriptionFile: prescription?.dataUrl || null,
      });
      const generatedId = 'JHC-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.random().toString(36).slice(2,6).toUpperCase();
      setOrderId(generatedId);
      setBookingStep(5);
      setBookingSubmitted(true);
    } catch {} finally { setPlacing(false); }
  };

  const countdownMinutes = 47;

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
    <div style={{ paddingBottom: 100, position: 'relative' }}>
      {/* ─── HERO BANNER ─── */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #0F5DA8 0%, #1565C0 50%, #1a73e8 100%)',
        padding: '24px 16px 28px',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Limited Time Offer Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ background: '#FF6B35', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4 }}>
              🔥 Limited Time Offer
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: 600, background: 'rgba(255,255,255,0.12)', padding: '3px 10px', borderRadius: 20 }}>
                <MapPin size={10} weight="fill" />
                {city}
                <CaretDown size={8} />
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: 0, lineHeight: 1.2, letterSpacing: -0.5 }}>
            Health Checkups at Home{' '}
            <span style={{ color: '#FFD54F' }}>in {city}</span>
          </h1>

          {/* Subtext features */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '12px 0 16px' }}>
            {['Free Home Collection', 'NABL Certified Labs', 'Starting at ₹799', 'Up to 60% OFF'].map((text, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle size={10} weight="fill" color={i === 3 ? '#FFD54F' : '#81C784'} />
                {text}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <button onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 700,
                background: '#FF3B30', color: '#fff', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(255,59,48,0.35)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
              <Sparkle size={16} weight="fill" /> Book Now
            </button>
            <button onClick={() => setMode('packages')}
              style={{
                padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)',
                cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
              View Health Packages
            </button>
          </div>

          {/* Countdown / Stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#FFD54F', fontSize: 11, fontWeight: 700 }}>
              <Clock size={12} weight="fill" /> Offer ends in {countdownMinutes}:00 mins
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>•</div>
            <div style={{ color: '#81C784', fontSize: 11, fontWeight: 600 }}>{totalBookedToday} booked today</div>
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', maxWidth: '100%' }}>
            <MagnifyingGlass size={18} style={{ position: 'absolute', left: 16, top: 13, color: '#0F5DA8', zIndex: 2 }} />
            <input type="text" placeholder="Search tests or packages..."
              value={search}
              onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
              onFocus={() => { setFocused(true); setShowSuggestions(true); }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              style={{
                width: '100%', padding: '11px 16px 11px 46px', borderRadius: 14,
                border: 'none', fontSize: 14, outline: 'none', background: '#fff',
                fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                boxSizing: 'border-box', zIndex: 2, position: 'relative',
              }} />
            {showSuggestions && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                background: '#fff', borderRadius: 14, boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
                border: '1px solid #e8edf2', overflow: 'hidden', zIndex: 999, textAlign: 'left',
              }}>
                {search.trim() && suggestions.length > 0 ? (
                  suggestions.map(t => (
                    <button key={t.id} onMouseDown={() => handleSuggestionClick(t.name)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 16px',
                        border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                        borderBottom: '1px solid #f5f5f5',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f0f5ff'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                      <MagnifyingGlass size={16} color="#0F5DA8" />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-dark)' }}>{t.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{t.category} • ₹{t.offerPrice || t.price}</div>
                      </div>
                    </button>
                  ))
                ) : !search.trim() && focused ? (
                  <div style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Popular Tests</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {popularTests.map(name => (
                        <button key={name} onMouseDown={() => handleSuggestionClick(name)}
                          style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: '#e8f0fe', color: '#0F5DA8', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : search.trim() && suggestions.length === 0 ? (
                  <div style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-light)', textAlign: 'center' }}>
                    No tests found — try a different name
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── MOST BOOKED PACKAGES (HORIZONTAL SCROLL) ─── */}
      <div style={{ padding: '20px 0 12px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              🔥 Most Booked Packages
            </h2>
            <button onClick={() => setMode('packages')} style={{ fontSize: 12, fontWeight: 600, color: '#0F5DA8', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 2 }}>
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
            {mostBookedPackages.map((pkg, i) => (
              <div key={i} style={{
                minWidth: 280, maxWidth: 280, scrollSnapAlign: 'start',
                background: '#fff', borderRadius: 16, border: '1px solid #e8edf2',
                overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                flexShrink: 0,
              }}>
                {/* Card header */}
                <div style={{
                  background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)', padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{ fontSize: 32 }}>{pkg.image}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', background: '#22C55E', padding: '2px 8px', borderRadius: 10 }}>MOST BOOKED</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#166534' }}>{pkg.name}</div>
                  </div>
                </div>
                {/* Card body */}
                <div style={{ padding: '12px 16px' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 6, lineHeight: 1.4 }}>{pkg.tests}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div>
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#e53935' }}>₹{pkg.price}</span>
                      <span style={{ fontSize: 12, color: '#bbb', textDecoration: 'line-through', marginLeft: 6 }}>₹{pkg.mrp}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 12, fontWeight: 600, color: '#FF8A00' }}>
                      <Star size={12} weight="fill" color="#FF8A00" /> {pkg.rating}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: '#22C55E', fontWeight: 600 }}>👥 {pkg.booked}</span>
                    <button onClick={() => { addToCart({ id: `pkg_${i}`, name: pkg.name, price: pkg.price, category: 'Package' }); setShowForm(true); setBookingStep(1); }}
                      style={{
                        padding: '6px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                        background: '#0F5DA8', color: '#fff', border: 'none', cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}>
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── OFFERS & PROMOTIONS ─── */}
      <div style={{ padding: '8px 0 16px' }}>
        <div className="container">
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            🎁 Offers & Promotions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {offers.map((offer, i) => (
              <div key={i} style={{
                background: offer.gradient, borderRadius: 16, padding: '16px 18px',
                color: '#fff', position: 'relative', overflow: 'hidden', cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              }}
                onClick={() => { setMode('packages'); setSelectedCategoryFilter(''); }}>
                <span style={{
                  position: 'absolute', top: 8, right: 8, fontSize: 9, fontWeight: 700,
                  background: 'rgba(255,255,255,0.25)', padding: '2px 10px', borderRadius: 12,
                  backdropFilter: 'blur(4px)',
                }}>{offer.tag}</span>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{offer.emoji}</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{offer.title}</div>
                <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>{offer.price}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, opacity: 0.7, textDecoration: 'line-through' }}>{offer.mrp}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(255,255,255,0.25)', padding: '1px 8px', borderRadius: 8 }}>{offer.discount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── HEALTH CATEGORY NAVIGATION ─── */}
      <div style={{ padding: '8px 0 16px' }}>
        <div className="container">
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            🧭 Browse by Category
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 }}>
            {categoryList.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <button key={i} onClick={() => { setCategory(cat.name); setMode('tests'); setSearch(''); }}
                  style={{
                    padding: '14px 8px', borderRadius: 14, background: selectedCategoryFilter === cat.name ? '#e8f0fe' : '#f8f9fa',
                    border: selectedCategoryFilter === cat.name ? '2px solid #0F5DA8' : '1px solid #e8edf2',
                    cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}>
                  <Icon size={24} color={cat.color} style={{ display: 'block', margin: '0 auto 6px' }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dark)' }}>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── STICKY TAB BAR ─── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: '#fff', borderBottom: '1px solid #e8edf2', borderTop: '1px solid #e8edf2',
        padding: '0 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div className="container" style={{ display: 'flex', gap: 0 }}>
          <button onClick={() => { setMode('tests'); setSearch(''); setCategory(''); setSelectedCategoryFilter(''); }}
            style={{
              flex: 1, padding: '12px 12px', fontSize: 13, fontWeight: 600,
              background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              color: mode === 'tests' ? '#0F5DA8' : '#8b9bb5',
              borderBottom: mode === 'tests' ? '2.5px solid #0F5DA8' : '2.5px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.2s',
            }}>
            <Flask size={16} weight={mode === 'tests' ? 'fill' : 'regular'} />
            Diagnostic Tests
            {mode === 'tests' && <span style={{ fontSize: 10, background: '#e8f0fe', color: '#0F5DA8', fontWeight: 700, padding: '1px 7px', borderRadius: 10 }}>{seedTests.length - 3}</span>}
          </button>
          <button onClick={() => { setMode('packages'); setSearch(''); setCategory(''); setSelectedCategoryFilter(''); }}
            style={{
              flex: 1, padding: '12px 12px', fontSize: 13, fontWeight: 600,
              background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              color: mode === 'packages' ? '#22C55E' : '#8b9bb5',
              borderBottom: mode === 'packages' ? '2.5px solid #22C55E' : '2.5px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.2s',
            }}>
            <Gift size={16} weight={mode === 'packages' ? 'fill' : 'regular'} />
            Health Packages
            {mode === 'packages' && <span style={{ fontSize: 10, background: '#22C55E', color: '#fff', fontWeight: 700, padding: '1px 7px', borderRadius: 10 }}>SAVE 60%</span>}
          </button>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div style={{ padding: '16px 16px 80px' }}>
        <div className="container" id="booking-section">

          {/* Cart bar */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14, padding: '10px 14px', background: '#fff', borderRadius: 12, border: '1px solid var(--border)' }}>
            <ShoppingCart size={18} color="var(--primary)" />
            <span style={{ fontSize: 13, fontWeight: 600 }}>{cart.length} tests</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>₹{cartTotal}</span>
            <button onClick={() => setShowCart(!showCart)} style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              {showCart ? 'Hide' : 'View'} Cart
            </button>
{cart.length > 0 && (
  <button onClick={() => { setShowForm(true); setBookingStep(1); }}
    style={{ padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, background: '#0F5DA8', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', marginLeft: 'auto' }}>
    Book Tests
  </button>
)}
          </div>

          {/* Cart dropdown */}
          {showCart && cart.length > 0 && (
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)', padding: 14, marginBottom: 14 }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                  <Flask size={18} color="var(--primary)" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600 }}>{item.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-light)' }}>{item.category}</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>₹{item.price}</span>
                  <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--text-light)', padding: 4, background: 'none', border: 'none', cursor: 'pointer' }}><Trash size={14} /></button>
                </div>
              ))}
            </div>
          )}

          {/* Prescription Upload */}
          <div style={{ marginBottom: 14 }}>
            <div style={{
              background: 'linear-gradient(135deg, #eef4ff, #f5f9ff)',
              borderRadius: 14, border: '1px solid #c7d9f0', padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #0F5DA8, #0C6BC4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={20} weight="fill" color="#fff" />
              </div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F5DA8' }}>Have a Prescription? Upload Here</div>
                <div style={{ fontSize: 11, color: 'var(--text-light)' }}>Upload your doctor's prescription and we'll match the right tests for you</div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {prescription ? (
                  <>
                    <span style={{ fontSize: 11, color: '#2e7d32', fontWeight: 600 }}><CheckCircle size={12} weight="fill" /> {prescription.name.length > 12 ? prescription.name.slice(0, 12) + '…' : prescription.name}</span>
                    <button onClick={() => { setPrescription(null); if (prescriptionRef.current) prescriptionRef.current.value = ''; }}
                      style={{ background: '#fee2e2', border: 'none', borderRadius: 5, padding: '3px 8px', fontSize: 10, color: '#dc2626', cursor: 'pointer', fontWeight: 500 }}>Remove</button>
                  </>
                ) : (
                  <button onClick={() => prescriptionRef.current?.click()}
                    style={{ padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: 'linear-gradient(135deg, #0F5DA8, #0C6BC4)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input ref={prescriptionRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }}
                      onChange={e => { const f = e.target.files?.[0]; if (f) { const reader = new FileReader(); reader.onload = () => { setPrescription({ name: f.name, dataUrl: reader.result }); if (window?.gtag) window.gtag('event', 'prescription_upload'); }; reader.readAsDataURL(f); } }} />
                    📄 Upload Prescription
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mode content: Tests or Packages */}
          {mode === 'tests' ? (
            <div>
              {/* Tests: Sort + Category filter bar */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
                <button onClick={() => setSortBy(sortBy === 'popular' ? 'price-low' : sortBy === 'price-low' ? 'price-high' : sortBy === 'price-high' ? 'name' : 'popular')}
                  style={{ padding: '6px 14px', borderRadius: 10, fontSize: 11, fontWeight: 600, background: '#f0f5ff', color: '#0F5DA8', border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                  {sortOptions.find(o => o.value === sortBy)?.label || 'Popular'}
                </button>
                {mostBookedTests.slice(0, 5).map(name => (
                  <button key={name} onClick={() => { setSearch(name); load(); }}
                    style={{ padding: '6px 14px', borderRadius: 10, fontSize: 11, fontWeight: 500, background: '#fff', color: 'var(--text-dark)', border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                    {name}
                  </button>
                ))}
              </div>

              {/* Test cards */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: 30 }}>
                  <div style={{ display: 'inline-block', width: 32, height: 32, border: '3px solid #e0e0e0', borderTopColor: '#0F5DA8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  <style>{'@keyframes spin { to { transform: rotate(360deg) } }'}</style>
                </div>
              ) : sortedTests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-light)', fontSize: 13 }}>No tests found</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {sortedTests.map(test => {
                    const inCartItem = cart.find(i => i.id === test.id);
                    const count = bookingCounts[test.name];
                    return (
                      <div key={test.id} style={{
                        background: '#fff', borderRadius: 14, border: '1px solid var(--border)',
                        padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                      }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Flask size={20} color="#0F5DA8" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 1 }}>{test.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 2 }}>{test.category} {test.fasting_required ? '• Fasting Required' : ''}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 15, fontWeight: 800, color: '#e53935' }}>₹{test.offerPrice || test.price}</span>
                            {test.mrp ? <span style={{ fontSize: 11, color: '#bbb', textDecoration: 'line-through' }}>₹{test.mrp}</span> : null}
                            {count ? <span style={{ fontSize: 10, color: '#22C55E', fontWeight: 600 }}>👥 {count} booked</span> : null}
                          </div>
                        </div>
                        <button onClick={() => inCartItem ? removeFromCart(test.id) : addToCart(test)}
                          style={{
                            padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                            background: inCartItem ? '#fee2e2' : '#0F5DA8',
                            color: inCartItem ? '#dc2626' : '#fff', border: 'none', cursor: 'pointer',
                            fontFamily: 'inherit', whiteSpace: 'nowrap', minWidth: 70,
                          }}>
                          {inCartItem ? 'Remove' : 'Add'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Package search */}
              <div style={{ marginBottom: 14, position: 'relative' }}>
                <MagnifyingGlass size={16} color="#aaa" style={{ position: 'absolute', left: 12, top: 11, zIndex: 1 }} />
                <input type="text" placeholder="Search packages by name or category..."
                  value={packageSearch}
                  onChange={e => { setPackageSearch(e.target.value); setShowPackageSuggestions(true); }}
                  onFocus={() => setShowPackageSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowPackageSuggestions(false), 200)}
                  style={{
                    width: '100%', padding: '9px 12px 9px 36px', borderRadius: 10,
                    border: '1px solid var(--border)', fontSize: 13, fontFamily: 'inherit',
                    outline: 'none', boxSizing: 'border-box', background: '#fff',
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
                            display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 14px',
                            border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                            borderBottom: '1px solid #f5f5f5',
                          }}>
                          <Gift size={16} color="#22C55E" />
                          <div style={{ textAlign: 'left', flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{pkg.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{pkg.testCount} tests • ₹{pkg.bundlePrice?.toLocaleString()}</div>
                          </div>
                          <span style={{ fontSize: 9, fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg, #22C55E, #16a34a)', padding: '2px 7px', borderRadius: 4 }}>{pkg.discountPct}% off</span>
                        </button>
                      ))
                    ) : !packageSearch.trim() ? (
                      <div style={{ padding: '10px 14px', fontSize: 11, color: 'var(--text-light)' }}>
                        <div style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5, fontSize: 10 }}>Popular Categories</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                          {['Full Body', 'Heart', 'Diabetes', 'Thyroid', 'Vitamin', 'Liver', 'Kidney'].map(cat => (
                            <button key={cat} onMouseDown={() => { setPackageSearch(cat); }}
                              style={{ padding: '4px 10px', borderRadius: 14, fontSize: 11, fontWeight: 500, background: '#e8f5e9', color: '#2e7d32', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-light)', textAlign: 'center' }}>
                        No packages match "<strong>{packageSearch}</strong>"
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Packages by axis */}
              {Object.keys(packagesByAxis).length === 0 ? (
                <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-light)', fontSize: 12 }}>Loading packages...</div>
              ) : (
                (() => {
                  const axisOrder = ['organ', 'disease', 'disorder', 'age', 'gender', 'lifestyle', 'lifeStage', 'symptom', 'occupation', 'medication', 'familyHistory', 'seasonal', 'diet', 'postRecovery', 'travel', 'insurance', 'preventive', 'budget', 'risk', 'duration', 'mentalHealth', 'fitness', 'sleep', 'environmental', 'vaccination', 'preSurgical', 'ethnicity', 'fertility'];
                  const axisMeta = {
                    organ: { icon: Heartbeat, color: '#0F5DA8', label: 'Organ Wise' },
                    disease: { icon: Warning, color: '#c62828', label: 'Disease Wise' },
                    disorder: { icon: Shield, color: '#7b1fa2', label: 'Disorder Wise' },
                    age: { icon: User, color: '#2e7d32', label: 'Age Wise' },
                    gender: { icon: Heart, color: '#e65100', label: 'Gender Wise' },
                    lifestyle: { icon: Lightbulb, color: '#FF8A00', label: 'Lifestyle Wise' },
                    lifeStage: { icon: Baby, color: '#ec407a', label: 'Life Stage Wise' },
                    symptom: { icon: Warning, color: '#ff7043', label: 'Symptom Wise' },
                    occupation: { icon: Suitcase, color: '#5c6bc0', label: 'Occupation Wise' },
                    medication: { icon: Pill, color: '#26a69a', label: 'Medication Monitoring' },
                    familyHistory: { icon: Heartbeat, color: '#ef5350', label: 'Family History / Genetic' },
                    seasonal: { icon: Cloud, color: '#42a5f5', label: 'Seasonal Wise' },
                    diet: { icon: ForkKnife, color: '#66bb6a', label: 'Diet Wise' },
                    postRecovery: { icon: Heartbeat, color: '#ab47bc', label: 'Post-Recovery Wise' },
                    travel: { icon: Airplane, color: '#ffa726', label: 'Travel Wise' },
                    insurance: { icon: Briefcase, color: '#78909c', label: 'Insurance / Corporate' },
                    preventive: { icon: Shield, color: '#26c6da', label: 'Preventive Screening' },
                    budget: { icon: Coin, color: '#ffca28', label: 'Budget / Price Tier' },
                    risk: { icon: Warning, color: '#ef5350', label: 'Risk Profile' },
                    duration: { icon: Clock, color: '#8d6e63', label: 'Duration / Urgency' },
                    mentalHealth: { icon: Heart, color: '#7e57c2', label: 'Mental Health' },
                    fitness: { icon: Lightning, color: '#ff7043', label: 'Fitness & Sports' },
                    sleep: { icon: Moon, color: '#5c6bc0', label: 'Sleep Health' },
                    environmental: { icon: Leaf, color: '#66bb6a', label: 'Environmental / Toxin' },
                    vaccination: { icon: Syringe, color: '#42a5f5', label: 'Vaccination & Immunity' },
                    preSurgical: { icon: FirstAid, color: '#ef5350', label: 'Pre-Surgical' },
                    ethnicity: { icon: Globe, color: '#ab47bc', label: 'Ethnicity / Region' },
                    fertility: { icon: Heart, color: '#ec407a', label: 'Fertility & Reproductive' },
                  };
                  const visibleAxes = axisOrder.filter(ax => packagesByAxis[ax]?.length > 0);
                  const filteredPkg = packageSearch.trim()
                    ? Object.fromEntries(
                        Object.entries(packagesByAxis).map(([ax, pkgs]) => [ax, pkgs.filter(p => p.name.toLowerCase().includes(packageSearch.toLowerCase()) || p.desc?.toLowerCase().includes(packageSearch.toLowerCase()))])
                      )
                    : packagesByAxis;
                  return visibleAxes.map(ax => {
                    const pkgs = filteredPkg[ax] || [];
                    if (pkgs.length === 0) return null;
                    const meta = axisMeta[ax] || {};
                    const Icon = meta.icon || Gift;
                    return (
                      <div key={ax} style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: meta.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon size={14} color={meta.color} />
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 700, color: meta.color }}>{meta.label}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-light)' }}>({pkgs.length})</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {pkgs.map(pkg => (
                            <div key={pkg.slug} style={{
                              background: '#fff', borderRadius: 14, border: '1px solid var(--border)',
                              padding: '12px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <Gift size={20} color="#22C55E" />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{pkg.name}</div>
                                  <div style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 2 }}>{pkg.desc?.slice(0, 80)}{pkg.desc?.length > 80 ? '…' : ''}</div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 15, fontWeight: 800, color: '#e53935' }}>₹{pkg.bundlePrice?.toLocaleString()}</span>
                                    <span style={{ fontSize: 11, color: '#bbb', textDecoration: 'line-through' }}>₹{pkg.mrpPrice?.toLocaleString()}</span>
                                    <span style={{ fontSize: 10, fontWeight: 600, color: '#fff', background: '#22C55E', padding: '1px 7px', borderRadius: 4 }}>{pkg.discountPct}% off</span>
                                  </div>
                                  <div style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 2 }}>{pkg.testCount} tests • Home Collection</div>
                                </div>
                                <button onClick={() => navigate(`/package/${pkg.slug}`)}
                                  style={{
                                    padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                                    background: '#22C55E', color: '#fff', border: 'none', cursor: 'pointer',
                                    fontFamily: 'inherit', whiteSpace: 'nowrap',
                                  }}>
                                  View Details
                                </button>
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

          {/* ─── TRUST BUILDING SECTION ─── */}
          <div style={{
            background: 'linear-gradient(135deg, #f0f5ff, #e8f0fe)', borderRadius: 16,
            padding: '20px 16px', margin: '16px 0',
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, textAlign: 'center', margin: '0 0 14px', color: '#0F5DA8' }}>
              🛡️ Why Choose Jeevan HealthCare?
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {trustStats.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} style={{ textAlign: 'center', background: '#fff', borderRadius: 12, padding: '14px 10px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                    <Icon size={24} color="#0F5DA8" style={{ marginBottom: 6 }} />
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dark)' }}>{item.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── HOW IT WORKS ─── */}
          <div style={{ margin: '16px 0' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, textAlign: 'center', margin: '0 0 14px' }}>
              ⚙️ How It Works
            </h3>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
              {howItWorks.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} style={{
                    minWidth: 180, flex: 1, background: '#fff', borderRadius: 14,
                    border: '1px solid var(--border)', padding: '16px 14px', textAlign: 'center',
                  }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #0F5DA8, #1a73e8)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                      <Icon size={22} color="#fff" weight="fill" />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{item.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── FAQ ─── */}
          <div style={{ margin: '16px 0' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, textAlign: 'center', margin: '0 0 14px' }}>
              ❓ Frequently Asked Questions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{
                  background: '#fff', borderRadius: 12, border: '1px solid var(--border)',
                  overflow: 'hidden',
                }}>
                  <button onClick={() => setFaqOpen(prev => ({ ...prev, [i]: !prev[i] }))}
                    style={{
                      width: '100%', padding: '12px 14px', display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', gap: 8, border: 'none', background: '#fff',
                      cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
                      color: 'var(--text-dark)', textAlign: 'left',
                    }}>
                    {faq.q}
                    <CaretDown size={14} style={{ transform: `rotate(${faqOpen[i] ? 180 : 0}deg)`, transition: 'transform 0.2s', flexShrink: 0 }} />
                  </button>
                  {faqOpen[i] && (
                    <div style={{ padding: '0 14px 12px', fontSize: 12, color: 'var(--text-light)', lineHeight: 1.5 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ─── BOOKING FORM ─── */}
          {showForm && bookingStep < 5 && (
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', padding: 18, marginTop: 16 }}>
              {/* Step indicator */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 16, overflowX: 'auto' }}>
                {['Review', 'Patient', 'Address', 'Payment'].map((label, i) => (
                  <button key={label} onClick={() => bookingStep > i && setBookingStep(i + 1)}
                    style={{
                      flex: 1, minWidth: 0, padding: '5px 4px', borderRadius: 6,
                      fontSize: 10, fontWeight: 600, border: 'none', cursor: bookingStep > i ? 'pointer' : 'default',
                      background: bookingStep >= i + 1 ? '#0F5DA8' : '#f0f0f0',
                      color: bookingStep >= i + 1 ? '#fff' : '#999',
                      fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.15s',
                    }}>
                    {bookingStep > i + 1 ? '✓ ' : ''}{i + 1}. {label}
                  </button>
                ))}
              </div>

              {bookingStep === 1 && (
                <>
                  <h3 style={{ fontSize: 14, marginBottom: 10 }}>Review Your Order</h3>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                      <Flask size={18} color="var(--primary)" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 600 }}>{item.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-light)' }}>{item.category} • Qty: {item.qty || 1}</p>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>₹{item.price}</span>
                      <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--text-light)', padding: 4, background: 'none', border: 'none', cursor: 'pointer' }}><Trash size={14} /></button>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: '2px solid #0F5DA8', marginTop: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>Total</span>
                    <span style={{ fontSize: 17, fontWeight: 800, color: '#0F5DA8' }}>₹{cartTotal}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 600, background: '#fff', color: '#0F5DA8', border: '1px solid #0F5DA8', cursor: 'pointer', fontFamily: 'inherit' }}>Back</button>
                    <button onClick={() => setBookingStep(2)} style={{ flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 700, background: '#0F5DA8', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Continue</button>
                  </div>
                </>
              )}

              {bookingStep === 2 && (
                <>
                  <h3 style={{ fontSize: 14, marginBottom: 10 }}>Patient Details</h3>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 11 }}>Booking for</label>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                      <button onClick={() => { setBookedFor(null); setPatientInfo({ name: '', age: '', gender: '' }); }}
                        style={{ padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 500, background: !bookedFor ? '#0F5DA8' : '#f0f0f0', color: !bookedFor ? '#fff' : 'var(--text-dark)', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                        <User size={14} style={{ marginRight: 3 }} /> Myself
                      </button>
                      {familyMembers.map(m => (
                        <button key={m.id} onClick={() => { setBookedFor(m); setPatientInfo({ name: m.name || '', age: m.age || '', gender: m.gender || '' }); }}
                          style={{ padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 500, background: bookedFor?.id === m.id ? '#0F5DA8' : '#f0f0f0', color: bookedFor?.id === m.id ? '#fff' : 'var(--text-dark)', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                          <User size={14} style={{ marginRight: 3 }} /> {m.name}
                        </button>
                      ))}
                      <button onClick={() => navigate('/add-family')}
                        style={{ padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 500, background: '#e8f0fe', color: '#0F5DA8', border: '1px dashed #0F5DA8', cursor: 'pointer', fontFamily: 'inherit' }}>
                        + Add Member
                      </button>
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
                  <div style={{ marginTop: 10, marginBottom: 12, borderTop: '1px solid #f0f0f0', paddingTop: 10 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dark)', marginBottom: 4 }}><FileText size={12} color="#0F5DA8" /> Upload Prescription (optional)</p>
                    {prescription ? (
                      <div style={{ border: '1px solid #d1d5db', borderRadius: 7, padding: '8px 10px', background: '#f9fafb', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>📎</span>
                        <div style={{ flex: 1, minWidth: 0, fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prescription.name}</div>
                        <span style={{ fontSize: 10, color: '#2e7d32', display: 'flex', alignItems: 'center', gap: 2 }}><CheckCircle size={10} weight="fill" /> Uploaded</span>
                        <button onClick={() => { setPrescription(null); if (prescriptionRef.current) prescriptionRef.current.value = ''; }} style={{ background: '#fee2e2', border: 'none', borderRadius: 3, padding: '2px 6px', fontSize: 10, color: '#dc2626', cursor: 'pointer', fontWeight: 500 }}>Remove</button>
                      </div>
                    ) : (
                      <div style={{ border: '1px dashed #d1d5db', borderRadius: 7, padding: '10px', textAlign: 'center', cursor: 'pointer', background: '#fafafa' }} onClick={() => prescriptionRef.current?.click()}>
                        <input ref={prescriptionRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }}
                          onChange={e => { const f = e.target.files?.[0]; if (f) { const reader = new FileReader(); reader.onload = () => { setPrescription({ name: f.name, dataUrl: reader.result }); }; reader.readAsDataURL(f); } }} />
                        <span style={{ fontSize: 10, color: '#6b7280' }}>📄 Click to upload prescription (PDF or image)</span>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => setBookingStep(1)} style={{ flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 600, background: '#fff', color: '#0F5DA8', border: '1px solid #0F5DA8', cursor: 'pointer', fontFamily: 'inherit' }}>Back</button>
<button onClick={() => setBookingStep(3)} style={{ flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 700, background: '#0F5DA8', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Continue</button>
              </div>
            </>
          )}

          {bookingStep === 3 && (
                <>
                  <h3 style={{ fontSize: 14, marginBottom: 2 }}>Schedule Home Collection</h3>
                  <p style={{ fontSize: 11, color: '#e65100', fontWeight: 600, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} weight="fill" color="#FF8A00" /> Next available: {nextSlot} — Limited slots
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
                        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 10, background: '#fff', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid var(--border)', maxHeight: 180, overflowY: 'auto' }}>
                          {addressSuggestions.map((s, i) => (
                            <button key={i} onMouseDown={() => { setAddress({ line1: s.display, city: s.city, pincode: s.pincode }); setShowAddressSuggestions(false); }}
                              style={{ display: 'block', width: '100%', padding: '8px 12px', fontSize: 12, textAlign: 'left', border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', borderBottom: i < addressSuggestions.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
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
                            setAddress({ line1: [addr.road, addr.suburb, addr.neighbourhood].filter(Boolean).join(', ') || '📍 Current location', city: addr.city || addr.town || addr.village || addr.state_district || '', pincode: addr.postcode || '' });
                          } catch {}
                          setLocating(false);
                        }, () => setLocating(false), { enableHighAccuracy: true });
                      }} style={{ padding: '7px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: '#e8f0fe', color: '#0F5DA8', border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 3 }}>
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
                        background: placing || !paymentMethod ? '#ccc' : '#0F5DA8', color: '#fff', border: 'none',
                        cursor: placing || !paymentMethod ? 'default' : 'pointer', fontFamily: 'inherit',
                      }}>
                      {placing ? 'Booking...' : 'Confirm Booking'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── FLOATING CTA + WHATSAPP ─── */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999, padding: '10px 16px 12px', background: '#fff', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)', display: 'flex', gap: 10, alignItems: 'center' }}>
        <a href="https://wa.me/919700104108" target="_blank" rel="noopener noreferrer"
          style={{
            width: 44, height: 44, borderRadius: '50%', background: '#25d366', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 2px 12px rgba(37,211,102,0.35)',
          }}>
          <WhatsappLogo size={22} weight="fill" color="#fff" />
        </a>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{cart.length} test{cart.length !== 1 ? 's' : ''} selected</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e53935' }}>₹{cartTotal}</div>
        </div>
        <button onClick={() => { if (cart.length > 0) { setShowForm(true); setBookingStep(1); } else { document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' }); } }}
          style={{
            padding: '10px 28px', borderRadius: 10, fontSize: 13, fontWeight: 700,
            background: cart.length > 0 ? '#FF3B30' : '#0F5DA8', color: '#fff', border: 'none',
            cursor: 'pointer', fontFamily: 'inherit', boxShadow: cart.length > 0 ? '0 4px 16px rgba(255,59,48,0.3)' : 'none',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
          <Sparkle size={16} weight="fill" /> {cart.length > 0 ? 'Book Now' : 'Start Booking'}
        </button>
      </div>
    </div>
  );
}
