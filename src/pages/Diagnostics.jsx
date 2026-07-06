import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlass, Flask, ShoppingCart, Plus, Trash, CheckCircle, Clock, Info, WarningCircle, MapPin,
  Heartbeat, Heart, Drop, Shield, Bone, Baby, User,
  Microscope, Truck, Sparkle,
  CaretRight, FileText, CalendarDots, ChatCircle,
} from '@phosphor-icons/react';
import TestDetailModal from '../components/test/TestDetailModal';
import useAuthStore from '../store/authStore';
import { getFamilyMembers } from '../services/authService';
import { searchTests, placeDiagnosticOrder } from '../services/diagnosticsService';

const categoryList = [
  { name: 'Full Body', icon: User, color: '#0F5DA8' },
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
  const nextSlot = ['2:00 PM', '4:00 PM', '6:00 PM', 'Tomorrow 8:00 AM'][cart.length % 4];
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focused, setFocused] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

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
  const mostBookedTests = ['Complete Blood Count (CBC)', 'HbA1c', 'Thyroid Profile (T3, T4, TSH)', 'Lipid Profile', 'Vitamin D Total', 'Blood Sugar (Fasting)', 'Liver Function Test (LFT)', 'Kidney Function Test (KFT)'];
  const bookingCounts = {
    'Complete Blood Count (CBC)': '2,847',
    'HbA1c': '4,216',
    'Thyroid Profile (T3, T4, TSH)': '3,591',
    'Lipid Profile': '3,128',
    'Vitamin D Total': '2,964',
    'Blood Sugar (Fasting)': '1,873',
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
    'Liver Function Test (LFT)': ['Kidney Function Test (KFT)', 'Lipid Profile'],
    'Kidney Function Test (KFT)': ['Liver Function Test (LFT)', 'Uric Acid'],
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

  const seedTests = [
    { id: 1, name: 'Complete Blood Count (CBC)', category: 'Hematology', subcategory: 'Complete Blood Count', price: 399, description: 'Measures red blood cells, white blood cells, hemoglobin, platelets, and more to assess overall health.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 2, name: 'HbA1c', category: 'Diabetes', subcategory: 'Diabetes', price: 599, description: 'Measures average blood sugar levels over the past 2-3 months to monitor diabetes control.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No fasting required. Continue regular medication.' },
    { id: 3, name: 'Thyroid Profile (T3, T4, TSH)', category: 'Thyroid', subcategory: 'Thyroid Profile', price: 499, description: 'Evaluates thyroid gland function by measuring T3, T4, and TSH hormone levels.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 8-10 hours recommended.' },
    { id: 4, name: 'Lipid Profile', category: 'Cardiac', subcategory: 'Lipid Profile', price: 449, description: 'Measures cholesterol, HDL, LDL, and triglycerides to assess heart disease risk.', fasting_required: true, report_time: '12 hrs', preparation_instructions: 'Fasting for 9-12 hours required. Water is allowed.' },
    { id: 5, name: 'Vitamin D Total', category: 'Vitamins', subcategory: 'Vitamin D', price: 799, description: 'Measures 25-hydroxyvitamin D levels to assess vitamin D deficiency or excess.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No fasting required.' },
    { id: 6, name: 'Blood Sugar (Fasting)', category: 'Diabetes', subcategory: 'Diabetes', price: 199, description: 'Measures blood glucose levels after an overnight fast to screen for diabetes.', fasting_required: true, report_time: '6 hrs', preparation_instructions: 'Fasting for 8-12 hours required. Only water permitted.' },
    { id: 7, name: 'Liver Function Test (LFT)', category: 'Full Body', subcategory: 'Liver Function', price: 549, description: 'Measures enzymes, proteins, and bilirubin to evaluate liver health and function.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 8-10 hours recommended.' },
    { id: 8, name: 'Kidney Function Test (KFT)', category: 'Full Body', subcategory: 'Kidney Function', price: 499, description: 'Measures creatinine, BUN, uric acid, and electrolytes to assess kidney function.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 8 hours recommended.' },
    { id: 9, name: 'Iron Studies', category: 'Anemia', subcategory: 'Iron Studies', price: 699, description: 'Measures serum iron, ferritin, TIBC, and transferrin saturation to evaluate iron status.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 10-12 hours required.' },
    { id: 10, name: 'Vitamin B12', category: 'Vitamins', subcategory: 'Vitamin B12', price: 699, description: 'Measures vitamin B12 levels to detect deficiency causing anemia or neurological issues.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No fasting required.' },
    { id: 11, name: 'TSH', category: 'Thyroid', subcategory: 'Thyroid', price: 349, description: 'Measures thyroid-stimulating hormone as a first-line screening for thyroid disorders.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 12, name: 'Total Cholesterol', category: 'Cardiac', subcategory: 'Lipid Profile', price: 249, description: 'Measures total cholesterol levels as part of heart health assessment.', fasting_required: true, report_time: '12 hrs', preparation_instructions: 'Fasting for 9-12 hours recommended.' },
    { id: 13, name: 'hs-CRP', category: 'Cardiac', subcategory: 'Cardiac Risk', price: 549, description: 'High-sensitivity C-reactive protein test detects low-level inflammation and heart disease risk.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No fasting required.' },
    { id: 14, name: 'Uric Acid', category: 'Arthritis', subcategory: 'Uric Acid', price: 299, description: 'Measures uric acid levels to diagnose gout and monitor kidney function.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 8 hours recommended.' },
    { id: 15, name: 'Serum Calcium', category: 'Full Body', subcategory: 'Minerals', price: 249, description: 'Measures calcium levels essential for bones, muscles, and nerve function.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No fasting required.' },
    { id: 16, name: 'Dengue NS1 Antigen', category: 'Fever', subcategory: 'Infections', price: 899, description: 'Detects dengue virus antigen in early stages of infection (1-5 days of fever).', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 17, name: 'Malaria Antigen', category: 'Fever', subcategory: 'Infections', price: 499, description: 'Detects malaria parasite antigens in blood for rapid diagnosis.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 18, name: 'Typhoid IgM/IgG', category: 'Fever', subcategory: 'Infections', price: 449, description: 'Detects antibodies against Salmonella typhi for typhoid fever diagnosis.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 19, name: 'Chikungunya IgM', category: 'Fever', subcategory: 'Infections', price: 799, description: 'Detects IgM antibodies against Chikungunya virus for recent infection diagnosis.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 20, name: 'PAP Smear', category: 'Cancer', subcategory: 'Cancer Screening', price: 1499, description: 'Screens for cervical cancer by detecting abnormal cells in the cervix.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'Avoid intercourse, douching, or vaginal creams for 48 hours before.' },
    { id: 21, name: 'CA 125', category: 'Cancer', subcategory: 'Tumor Markers', price: 1199, description: 'Tumor marker primarily used to monitor ovarian cancer treatment response.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 22, name: 'PSA (Prostate Specific Antigen)', category: 'Cancer', subcategory: 'Tumor Markers', price: 999, description: 'Screens for prostate cancer by measuring prostate-specific antigen levels.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Avoid ejaculation for 48 hours before the test.' },
    { id: 23, name: 'Prolactin', category: 'Hormones', subcategory: 'Hormones', price: 599, description: 'Measures prolactin hormone levels to evaluate pituitary function and reproductive health.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 8 hours recommended. Avoid stress before collection.' },
    { id: 24, name: 'Cortisol (Morning)', category: 'Hormones', subcategory: 'Hormones', price: 799, description: 'Measures morning cortisol levels to assess adrenal gland function.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 8 hours. Sample collected between 6-9 AM.' },
    { id: 25, name: 'Testosterone (Total)', category: 'Hormones', subcategory: 'Hormones', price: 899, description: 'Measures total testosterone levels for evaluating hypogonadism and hormone health.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 8 hours. Sample collected before 10 AM.' },
    { id: 26, name: 'Allergy Panel (Food)', category: 'Allergy', subcategory: 'Allergy', price: 2499, description: 'Tests for IgE antibodies against common food allergens including milk, egg, peanut, wheat, soy.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 27, name: 'Allergy Panel (Inhalant)', category: 'Allergy', subcategory: 'Allergy', price: 2799, description: 'Tests for IgE antibodies against common inhaled allergens like pollen, dust, mold, pet dander.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 28, name: 'Rheumatoid Factor (RF)', category: 'Arthritis', subcategory: 'Arthritis', price: 499, description: 'Detects rheumatoid factor antibodies to aid in rheumatoid arthritis diagnosis.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 29, name: 'Vitamin B12 & Folate', category: 'Anemia', subcategory: 'Anemia', price: 999, description: 'Measures vitamin B12 and folate levels to identify causes of anemia.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 8-10 hours recommended.' },
    { id: 30, name: 'Pregnancy Test (hCG)', category: 'Pregnancy', subcategory: 'Pregnancy', price: 299, description: 'Detects human chorionic gonadotropin (hCG) for early pregnancy detection.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'Best taken after a missed period. First morning urine preferred.' },
  ];

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
    try {
      const params = {};
      if (search) params.name = search;
      if (category) params.category = category;
      const { data } = await searchTests(params);
      setTests(data && data.length ? data : seedTests);
    } catch { setTests(seedTests); } finally { setLoading(false); }
  };

  useEffect(() => {
    load();

  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getFamilyMembers().then(({ data }) => setFamilyMembers(data || [])).catch(() => {});
    }
  }, [isAuthenticated]);

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [search, category]);

  const sortedTests = [...tests].sort((a, b) => {
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    return (bookingCounts[b.name] ? parseInt(bookingCounts[b.name].replace(/,/g, '')) : 0) - (bookingCounts[a.name] ? parseInt(bookingCounts[a.name].replace(/,/g, '')) : 0);
  });

  const suggestions = search.trim()
    ? tests.filter(t => t.name.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
    : [];

  const handleSuggestionClick = (name) => {
    setSearch(name);
    setShowSuggestions(false);
    setShowAllTests(true);
    load();
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
    if (!isAuthenticated) { navigate('/signup'); return; }
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
      const generatedId = 'JH' + Date.now().toString(36).toUpperCase();
      setOrderId(generatedId);
      setBookingStep(5);
    } catch {} finally { setPlacing(false); }
  };

  
  return (
    <>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0F5DA8 0%, #0C6BC4 100%)',
        padding: '48px 20px 40px', textAlign: 'center',
      }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <h1 style={{ color: '#fff', fontSize: 32, marginBottom: 8 }}>Looking for a Test?</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, marginBottom: 24 }}>
            Book diagnostic tests at home — accurate reports, doorstep collection
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowCityPicker(!showCityPicker)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                  borderRadius: 20, background: 'rgba(255,255,255,0.15)', color: '#fff',
                  border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 13,
                  fontFamily: 'inherit', fontWeight: 500, backdropFilter: 'blur(4px)',
                }}>
                <MapPin size={14} weight="fill" />
                {city}
                <span style={{ fontSize: 10, marginLeft: 2 }}>▾</span>
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
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Home collection available</span>
          </div>
          <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
            <MagnifyingGlass size={20} style={{ position: 'absolute', left: 16, top: 14, color: '#0F5DA8' }} />
              <input type="text" placeholder="Search tests (e.g., CBC, Thyroid, Lipid)..."
                value={search}
                onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
                onFocus={() => { setFocused(true); setShowSuggestions(true); }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={e => { if (e.key === 'Enter') { setShowAllTests(true); setShowSuggestions(false); } }}
              style={{
                width: '100%', padding: '14px 16px 14px 48px', borderRadius: 50,
                border: 'none', fontSize: 15, outline: 'none', background: '#fff',
                fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }} />
            {/* Suggestions dropdown */}
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
                        display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 18px',
                        border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                        borderBottom: '1px solid #f5f5f5', transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f0f5ff'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                      <MagnifyingGlass size={16} color="#0F5DA8" />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-dark)' }}>{t.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{t.category} • ₹{t.price}</div>
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
                    No tests found — try a different name
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Urgency banner */}
      <div style={{ background: 'linear-gradient(90deg, #fff8e1, #fff3e0)', borderBottom: '1px solid #ffecb3', padding: '10px 20px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap', fontSize: 13 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#e65100', fontWeight: 600 }}>
            <Clock size={16} weight="fill" color="#FF8A00" />
            <strong style={{ fontSize: 16 }}>{totalBookedToday}</strong> tests booked today
          </span>
          <span style={{ color: '#888' }}>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2e7d32', fontWeight: 500 }}>
            <CheckCircle size={14} weight="fill" color="#22C55E" />
            Free home collection
          </span>
          <span style={{ color: '#888' }}>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0F5DA8', fontWeight: 500 }}>
            <MapPin size={14} weight="fill" />
            Available in {city}
          </span>
        </div>
      </div>

      <div style={{ padding: '28px 20px' }}>
        <div className="container">
          {/* Cart bar */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, padding: '12px 16px', background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <ShoppingCart size={20} color="var(--primary)" />
            <span style={{ fontSize: 14, fontWeight: 600 }}>{cart.length} tests</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>₹{cartTotal}</span>
            <button onClick={() => setShowCart(!showCart)} style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              {showCart ? 'Hide' : 'View'} Cart
            </button>
            {cart.length > 0 && (
              <button onClick={() => isAuthenticated ? (setShowForm(true), setBookingStep(1)) : navigate('/signup')}
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

          {/* Booking Form — Multi Step */}
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
                    {bookingStep > i + 1 ? '✓ ' : ''}{i + 1}. {label}
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
                        <p style={{ fontSize: 11, color: 'var(--text-light)' }}>{item.category} • Qty: {item.qty || 1}</p>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>₹{item.price}</span>
                      <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--text-light)', padding: 4, background: 'none', border: 'none', cursor: 'pointer' }}><Trash size={16} /></button>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '2px solid var(--primary)' }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>Total</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>₹{cartTotal}</span>
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
                    Next available slot: {nextSlot} — Limited slots
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
                              line1: [addr.road, addr.suburb, addr.neighbourhood].filter(Boolean).join(', ') || '📍 Current location',
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
                        Continue — ₹{cartTotal}
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
                      { value: 'phonepe', label: 'PhonePe / Google Pay / UPI', icon: '📱', desc: 'Pay via any UPI app' },
                      { value: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
                      { value: 'pay_at_collection', label: 'Pay at Collection', icon: '💵', desc: 'Cash or card at your doorstep' },
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
                      {placing ? 'Placing Order...' : `Pay ₹${cartTotal}`}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Confirmation */}
          {showForm && bookingStep === 5 && (
            <div style={{ padding: '32px 20px', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle size={32} weight="fill" color="#2e7d32" />
              </div>
              <h2>Order Confirmed!</h2>
              {orderId && <p style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 4 }}>Order ID: <strong>{orderId}</strong></p>}
              {paymentMethod === 'pay_at_collection' ? (
                <p style={{ fontSize: 13, color: '#e65100', marginTop: 8, fontWeight: 500 }}>Pay ₹{cartTotal} at the time of collection</p>
              ) : (
                <p style={{ fontSize: 13, color: '#22C55E', marginTop: 8, fontWeight: 500 }}>Payment of ₹{cartTotal} received ✓</p>
              )}
              <p style={{ color: 'var(--text-light)', marginTop: 8 }}>We'll send you a confirmation via WhatsApp.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
                <button onClick={() => {
                  const msg = encodeURIComponent(`Hi! I've booked tests on Jeevan HealthCare. Order ID: ${orderId}. Total: ₹${cartTotal}.`);
                  window.open(`https://wa.me/?text=${msg}`, '_blank');
                }} style={{
                  padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  background: '#25D366', color: '#fff', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  Share on WhatsApp
                </button>
                <button onClick={() => navigate('/my-test-orders')} style={{
                  padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  background: '#0F5DA8', color: '#fff', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit',
                }}>
                  Track Order
                </button>
                <button onClick={() => { setBookingStep(1); setCart([]); setShowForm(false); setOrderId(null); setPaymentMethod(''); }} className="btn-outline">
                  Book More Tests
                </button>
              </div>
            </div>
          )}

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

          {/* Test Grid */}
          {loading ? (
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
                return (
                   <div key={test.id} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 16, position: 'relative' }}>
                    {mostBookedTests.includes(test.name) && (
                      <span style={{
                        position: 'absolute', top: 8, right: 8,
                        background: 'linear-gradient(135deg, #FF8A00, #FF4D6D)', color: '#fff',
                        fontSize: 9, fontWeight: 700, padding: '2px 10px', borderRadius: 4,
                        textTransform: 'uppercase', letterSpacing: 0.3,
                      }}>
                        Most Booked
                      </span>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
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
                                {inCart ? `✓ ${name}` : `+ ${name}`}
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
          )}
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

