import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heartbeat, Warning, Shield, User, Heart, Lightbulb, Baby, Suitcase, Pill, Cloud, ForkKnife,
  Airplane, Briefcase, Coin, Moon, Leaf, Syringe, FirstAid, Globe, Lightning, Clock,
  CaretRight, MagnifyingGlass, FileText, CheckCircle, X, Flask, Gift, MapPin, CaretDown,
  ShoppingCart, Trash, Phone, WhatsappLogo, SpinnerGap, ArrowLeft, ChatText, DeviceMobile,
  ClipboardText, UserCircle,
} from '@phosphor-icons/react';

const axisMeta = {
  organ: { label: 'Organ Wise', icon: Heartbeat, color: '#0F5DA8', desc: 'Packages focused on specific organs like liver, heart, kidney, thyroid, lungs, brain, bone, skin, pancreas' },
  disease: { label: 'Disease Wise', icon: Warning, color: '#c62828', desc: 'Packages targeting specific diseases such as diabetes, hypertension, cancer, hepatitis, PCOS, anemia, TB, arthritis' },
  disorder: { label: 'Disorder Wise', icon: Shield, color: '#7b1fa2', desc: 'Packages for broader health disorders including autoimmune, bleeding, metabolic, hormonal, nutritional' },
  age: { label: 'Age Wise', icon: User, color: '#2e7d32', desc: 'Packages tailored to every life stage — newborn, pediatric, adolescent, adult, senior, geriatric' },
  gender: { label: 'Gender Wise', icon: Heart, color: '#e65100', desc: 'Gender-specific health packages — women, men, transgender' },
  lifestyle: { label: 'Lifestyle Wise', icon: Lightbulb, color: '#FF8A00', desc: 'Packages for different lifestyles — corporate, smoker, alcoholic, athlete, sedentary, vegan' },
  lifeStage: { label: 'Life Stage Wise', icon: Baby, color: '#ec407a', desc: 'Packages for key life transitions — pre-marital, pre-conception, pregnancy, postpartum, menopause, andropause' },
  symptom: { label: 'Symptom Wise', icon: Warning, color: '#ff7043', desc: 'Packages based on presenting symptoms — fever, fatigue, hair loss, joint pain, weight loss' },
  occupation: { label: 'Occupation Wise', icon: Suitcase, color: '#5c6bc0', desc: 'Packages for occupational requirements — pre-employment, travel visa, sports, hospital admission, govt schemes' },
  medication: { label: 'Medication Monitoring', icon: Pill, color: '#26a69a', desc: 'Monitoring packages for patients on long-term medications — warfarin, diabetes, thyroid, antiepileptic, lithium' },
  familyHistory: { label: 'Family History / Genetic', icon: Heartbeat, color: '#ef5350', desc: 'Risk assessment based on family history — cardiac, cancer, diabetes, genetic disorders' },
  seasonal: { label: 'Seasonal Wise', icon: Cloud, color: '#42a5f5', desc: 'Season-specific health packages — monsoon, winter, summer' },
  diet: { label: 'Diet Wise', icon: ForkKnife, color: '#66bb6a', desc: 'Diet-based screening packages — vegan, high-protein, keto, malnutrition' },
  postRecovery: { label: 'Post-Recovery Wise', icon: Heartbeat, color: '#ab47bc', desc: 'Recovery monitoring packages — post-COVID, post-surgery, post-chemo, post-heart attack, post-stroke' },
  travel: { label: 'Travel Wise', icon: Airplane, color: '#ffa726', desc: 'Travel-related health packages — pre-travel titers, post-travel screen, visa medicals' },
  insurance: { label: 'Insurance / Corporate', icon: Briefcase, color: '#78909c', desc: 'Insurance and corporate health packages — annual checkups, insurance medicals, govt schemes' },
  preventive: { label: 'Preventive Screening', icon: Shield, color: '#26c6da', desc: 'Preventive health screening — annual master, cancer screening, wellness panel' },
  budget: { label: 'Budget / Price Tier', icon: Coin, color: '#ffca28', desc: 'Affordable packages at different price points — silver, gold, platinum' },
  risk: { label: 'Risk Profile', icon: Warning, color: '#ef5350', desc: 'Risk-based health assessment — high, medium, low risk profiles' },
  duration: { label: 'Duration / Urgency', icon: Clock, color: '#8d6e63', desc: 'Packages based on turnaround time — instant, same-day, 24hr, 72hr, comprehensive week' },
  mentalHealth: { label: 'Mental Health', icon: Heart, color: '#7e57c2', desc: 'Mental wellness assessment — stress, sleep, depression, complete mental wellness' },
  fitness: { label: 'Fitness & Sports', icon: Lightning, color: '#ff7043', desc: 'Sports and fitness packages — pre-marathon, bodybuilding, endurance athlete' },
  sleep: { label: 'Sleep Health', icon: Moon, color: '#5c6bc0', desc: 'Sleep health assessment — sleep apnea, circadian rhythm' },
  environmental: { label: 'Environmental / Toxin', icon: Leaf, color: '#66bb6a', desc: 'Environmental exposure screening — heavy metals, air pollution' },
  vaccination: { label: 'Vaccination & Immunity', icon: Syringe, color: '#42a5f5', desc: 'Immunity assessment — antibody titers, immune status, allergy panel' },
  preSurgical: { label: 'Pre-Surgical', icon: FirstAid, color: '#ef5350', desc: 'Pre-surgery clearance packages — pre-operative, anesthesia clearance' },
  ethnicity: { label: 'Ethnicity / Region', icon: Globe, color: '#ab47bc', desc: 'Region-specific health screening — South Asian, sickle cell/thalassemia, endemic diseases' },
  fertility: { label: 'Fertility & Reproductive', icon: Heart, color: '#ec407a', desc: 'Fertility assessment — pre-conception, male fertility, female fertility' },
};

export default function HealthPackages() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('packages');
  const [grouped, setGrouped] = useState({});
  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [prescription, setPrescription] = useState(null);
  const prescriptionRef = useRef(null);
  const fileRef = useRef(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingPhoneError, setBookingPhoneError] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    const t = window.__allTests;
    if (t && t.length > 0) setTests(t);
    const data = window.__packagesByAxis;
    if (data && Object.keys(data).length > 0) setGrouped(data);
    const check = () => {
      const d = window.__packagesByAxis;
      if (d && Object.keys(d).length > 0) { setGrouped(d); return true; }
      const tt = window.__allTests;
      if (tt && tt.length > 0) { setTests(tt); return true; }
      return false;
    };
    if (Object.keys(grouped).length === 0) {
      const t = setInterval(() => { if (check()) clearInterval(t); }, 200);
      return () => clearInterval(t);
    }
  }, []);

  const handlePhone = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 10);
    setBookingPhone(digits);
    if (!digits) setBookingPhoneError('');
    else if (digits.length < 10) setBookingPhoneError('Enter at least 10 digits.');
    else setBookingPhoneError('');
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setBookingSubmitted(true);
    }, 2000);
  };

  const bookingId = 'JHC-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Date.now().toString(36).toUpperCase().slice(-4);

  const axisOrder = Object.keys(axisMeta);
  const q = search.toLowerCase().trim();

  const matchesSearch = (pkg, axis) => {
    if (!q) return true;
    const meta = axisMeta[axis] || {};
    return pkg.name.toLowerCase().includes(q) || pkg.desc.toLowerCase().includes(q) || meta.label.toLowerCase().includes(q) || pkg.testNames?.some(n => n.toLowerCase().includes(q));
  };

  const filteredGrouped = {};
  axisOrder.filter(a => grouped[a]).forEach(axis => {
    const pkgs = grouped[axis].filter(p => matchesSearch(p, axis));
    if (pkgs.length > 0) filteredGrouped[axis] = pkgs;
  });

  const filteredTests = tests.filter(t => {
    if (!q) return true;
    return t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.subcategory?.toLowerCase().includes(q);
  });

  const sortedTests = [...filteredTests].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

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
            <CheckCircle size={18} weight="fill" /> Booking ID: {bookingId}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:+919700104108" style={{ background: 'linear-gradient(135deg, #0F5DA8, #0C6BC4)', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', boxShadow: '0 4px 14px rgba(10,94,176,0.3)' }}>
              <Phone size={18} weight="fill" /> Call Now
            </a>
            <a href="https://wa.me/919700104108" target="_blank" rel="noopener noreferrer" style={{ background: '#25d366', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', boxShadow: '0 4px 14px rgba(37,211,102,0.3)' }}>
              <WhatsappLogo size={18} weight="fill" /> WhatsApp
            </a>
            <button onClick={() => navigate('/')} style={{ padding: '12px 24px', borderRadius: 10, fontWeight: 600, fontSize: 14, background: '#fff', color: '#0F5DA8', border: '1px solid #0F5DA8', cursor: 'pointer', fontFamily: 'inherit' }}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #0F5DA8 0%, #0C6BC4 100%)', padding: '40px 20px 32px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div style={{ maxWidth: 720, position: 'relative', zIndex: 1, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowCityPicker(!showCityPicker)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 500 }}>
                <MapPin size={12} weight="fill" />
                {city}
                <CaretDown size={10} />
              </button>
              {showCityPicker && (
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, minWidth: 160, background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.15)', overflow: 'hidden', zIndex: 10, textAlign: 'left' }}>
                  {['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'].map(c => (
                    <button key={c} onMouseDown={() => { setCity(c); setShowCityPicker(false); }}
                      style={{ display: 'block', width: '100%', padding: '10px 16px', fontSize: 13, border: 'none', background: city === c ? '#e8f0fe' : '#fff', color: city === c ? '#0F5DA8' : '#333', cursor: 'pointer', fontFamily: 'inherit', fontWeight: city === c ? 600 : 400, textAlign: 'left' }}
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

          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, marginBottom: 4, letterSpacing: -0.3 }}>
            {mode === 'tests' ? 'Looking for a Test?' : 'Health Packages'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, marginBottom: 20, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
            {mode === 'tests' ? 'Book diagnostic tests at home — accurate reports, doorstep collection' : 'Curated health checkup packages across 28 categories — up to 60% off'}
          </p>

          <div style={{ position: 'relative', maxWidth: 520, margin: '0 auto' }}>
            <MagnifyingGlass size={18} style={{ position: 'absolute', left: 18, top: 13, color: '#0F5DA8' }} />
            <input type="text" placeholder={mode === 'tests' ? 'Search tests (e.g., CBC, Thyroid, Lipid)...' : 'Search packages (e.g., liver, diabetes, heart)...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '12px 48px 12px 48px', borderRadius: 50, border: 'none', fontSize: 14, outline: 'none', background: '#fff', fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: '#e0e0e0', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={14} weight="bold" />
              </button>
            )}
          </div>

          {mode === 'packages' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>Starting at ₹799</span>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
              <button onClick={() => { setMode('tests'); setSearch(''); }}
                style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', fontFamily: 'inherit' }}>
                Browse All Tests
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Tab Bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: '#fff', borderBottom: '1px solid #e8edf2', padding: '0 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', gap: 0, maxWidth: 720, margin: '0 auto' }}>
          <button onClick={() => { setMode('tests'); setSearch(''); }}
            style={{ flex: 1, padding: '14px 16px', fontSize: 14, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: mode === 'tests' ? '#0F5DA8' : '#8b9bb5', borderBottom: mode === 'tests' ? '2px solid #0F5DA8' : '2px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}>
            <Flask size={18} weight={mode === 'tests' ? 'fill' : 'regular'} />
            Diagnostic Tests
            {mode === 'tests' && <span style={{ fontSize: 11, background: '#e8f0fe', color: '#0F5DA8', padding: '1px 8px', borderRadius: 10, fontWeight: 700 }}>{tests.length}</span>}
          </button>
          <button onClick={() => { setMode('packages'); setSearch(''); }}
            style={{ flex: 1, padding: '14px 16px', fontSize: 14, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: mode === 'packages' ? '#22C55E' : '#8b9bb5', borderBottom: mode === 'packages' ? '2px solid #22C55E' : '2px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}>
            <Gift size={18} weight={mode === 'packages' ? 'fill' : 'regular'} />
            Health Packages
            {mode === 'packages' && <span style={{ fontSize: 11, background: '#22C55E', color: '#fff', padding: '1px 8px', borderRadius: 10, fontWeight: 700 }}>SAVE 60%</span>}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '20px 16px 40px' }}>
        {/* Prescription Upload Banner */}
        <div style={{ background: 'linear-gradient(135deg, #eef4ff, #f5f9ff, #fff)', borderRadius: 16, border: '1px solid #c7d9f0', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #0F5DA8, #0C6BC4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FileText size={22} weight="fill" color="#fff" />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0F5DA8', margin: 0 }}>Have a Prescription? Upload Here</h3>
            <p style={{ fontSize: 12, color: 'var(--text-light)', margin: '2px 0 0' }}>
              Upload your doctor's prescription and we'll match the right tests for you
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {prescription ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#2e7d32', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle size={14} weight="fill" /> {prescription.name.length > 15 ? prescription.name.slice(0, 15) + '…' : prescription.name}
                </span>
                <button onClick={() => { setPrescription(null); if (prescriptionRef.current) prescriptionRef.current.value = ''; }}
                  style={{ background: '#fee2e2', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: '#dc2626', cursor: 'pointer', fontWeight: 500 }}>Remove</button>
              </div>
            ) : (
              <button onClick={() => prescriptionRef.current?.click()}
                style={{ padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: 'linear-gradient(135deg, #0F5DA8, #0C6BC4)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(15,93,168,0.25)' }}>
                <input ref={prescriptionRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) setPrescription(f); }} />
                📄 Upload Prescription
              </button>
            )}
            <button onClick={() => { setShowBooking(true); setBookingStep(1); }}
              style={{ padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, background: '#fff', color: '#0F5DA8', border: '1px solid #0F5DA8', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              Book Now
            </button>
          </div>
        </div>

        {/* Booking Form (modal style) */}
        {showBooking && (
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', padding: '24px 20px', marginBottom: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, color: '#0F5DA8', margin: 0 }}>Book {mode === 'tests' ? 'Tests' : 'Packages'}</h3>
              <button onClick={() => setShowBooking(false)} style={{ background: '#f0f0f0', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={14} weight="bold" />
              </button>
            </div>

            {/* Steps */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, justifyContent: 'center' }}>
              {['Details', 'Upload', 'Confirm'].map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: bookingStep > i ? '#22C55E' : bookingStep === i + 1 ? '#0F5DA8' : '#e0e0e0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>{i + 1}</div>
                  <span style={{ fontSize: 12, fontWeight: 500, color: bookingStep >= i + 1 ? '#0F5DA8' : '#999' }}>{s}</span>
                  {i < 2 && <div style={{ width: 24, height: 2, background: bookingStep > i ? '#22C55E' : '#e0e0e0' }} />}
                </div>
              ))}
            </div>

            <form onSubmit={handleBookingSubmit}>
              {bookingStep === 1 && (
                <>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <UserCircle size={13} weight="fill" color="#0F5DA8" /> Full Name <span style={{ color: '#0F5DA8' }}>*</span>
                    </label>
                    <input type="text" placeholder="Enter your name" required value={bookingName} onChange={e => setBookingName(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <DeviceMobile size={13} weight="fill" color="#0F5DA8" /> Phone <span style={{ color: '#0F5DA8' }}>*</span>
                    </label>
                    <div style={{ display: 'flex' }}>
                      <span style={{ display: 'flex', alignItems: 'center', padding: '0 10px', background: '#f0f4f8', border: '1px solid #d1d5db', borderRight: 'none', borderRadius: '8px 0 0 8px', fontSize: 13, fontWeight: 600, color: '#374151' }}>+91</span>
                      <input type="tel" inputMode="numeric" placeholder="XXXXXXXXXX" required value={bookingPhone} onChange={e => handlePhone(e.target.value)}
                        style={{ flex: 1, padding: '10px 12px', borderRadius: '0 8px 8px 0', border: `1px solid ${bookingPhoneError ? '#dc2626' : '#d1d5db'}`, fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
                    </div>
                    {bookingPhoneError && <span style={{ fontSize: 11, color: '#dc2626', marginTop: 3, display: 'block' }}>{bookingPhoneError}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <button type="button" onClick={() => setShowBooking(false)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Cancel</button>
                    <button type="button" onClick={() => setBookingStep(2)} disabled={!bookingName || bookingPhone.length < 10}
                      style={{ flex: 2, padding: '10px', borderRadius: 8, background: 'linear-gradient(135deg, #0F5DA8, #0C6BC4)', color: '#fff', border: 'none', cursor: bookingName && bookingPhone.length >= 10 ? 'pointer' : 'not-allowed', opacity: bookingName && bookingPhone.length >= 10 ? 1 : 0.6, fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
                      Continue <CaretRight size={14} weight="bold" />
                    </button>
                  </div>
                </>
              )}

              {bookingStep === 2 && (
                <>
                  <h4 style={{ fontSize: 14, marginBottom: 12 }}>Upload Prescription (optional)</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 14 }}>
                    Have a prescription? Upload it so we can prepare your order accurately.
                  </p>
                  {prescription ? (
                    <div style={{ border: '1px solid #d1d5db', borderRadius: 8, padding: '10px 12px', background: '#f9fafb', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                      <span style={{ fontSize: 20 }}>📎</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prescription.name}</div>
                        <div style={{ fontSize: 11, color: '#2e7d32', display: 'flex', alignItems: 'center', gap: 3 }}><CheckCircle size={11} weight="fill" /> Uploaded</div>
                      </div>
                      <button type="button" onClick={() => { setPrescription(null); if (fileRef.current) fileRef.current.value = ''; }}
                        style={{ background: '#fee2e2', border: 'none', borderRadius: 4, padding: '3px 8px', fontSize: 11, color: '#dc2626', cursor: 'pointer', fontWeight: 500 }}>Remove</button>
                    </div>
                  ) : (
                    <div style={{ border: '1px dashed #d1d5db', borderRadius: 8, padding: '16px', textAlign: 'center', cursor: 'pointer', background: '#fafafa', marginBottom: 14 }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#0F5DA8'; e.currentTarget.style.background = '#eef4ff'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = '#fafafa'; }}
                      onClick={() => fileRef.current?.click()}>
                      <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }}
                        onChange={e => { const f = e.target.files?.[0]; if (f) setPrescription(f); }} />
                      <span style={{ fontSize: 28 }}>📄</span>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 2 }}>Click to upload prescription</p>
                      <p style={{ fontSize: 11, color: '#9ca3af' }}>Supports PDF, JPG, PNG — Max 10 MB</p>
                    </div>
                  )}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ChatText size={13} weight="fill" color="#0F5DA8" /> Your Message <span style={{ color: '#0F5DA8' }}>*</span>
                    </label>
                    <textarea rows={3} placeholder="Describe your query or request..." required value={bookingMessage} onChange={e => setBookingMessage(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                    <button type="button" onClick={() => setBookingStep(1)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Back</button>
                    <button type="submit" disabled={!bookingMessage || submitting}
                      style={{ flex: 2, padding: '10px', borderRadius: 8, background: 'linear-gradient(135deg, #0F5DA8, #0C6BC4)', color: '#fff', border: 'none', cursor: bookingMessage && !submitting ? 'pointer' : 'not-allowed', opacity: bookingMessage && !submitting ? 1 : 0.6, fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
                      {submitting ? <><SpinnerGap size={18} weight="bold" className="spin" /> Processing…</> : <><CheckCircle size={18} weight="fill" /> Confirm Booking</>}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        )}

        {/* Results info */}
        {q && (
          <div style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 16 }}>
            {mode === 'tests'
              ? `Found ${sortedTests.length} tests matching "${q}"`
              : `Found ${Object.values(filteredGrouped).flat().length} packages matching "${q}"`}
          </div>
        )}

        {/* Tests Mode */}
        {mode === 'tests' && (
          <>
            {tests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>
                <Flask size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
                <p style={{ fontSize: 14 }}>Loading tests... Please visit the Diagnostics page first.</p>
                <button onClick={() => navigate('/diagnostics')} style={{ marginTop: 12, padding: '8px 20px', borderRadius: 8, background: '#0F5DA8', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: 13 }}>
                  Go to Diagnostics
                </button>
              </div>
            ) : (
              <>
                {/* Sort bar */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-light)', fontWeight: 500 }}>Sort:</span>
                  {[
                    { value: 'popular', label: 'Popular' },
                    { value: 'price-low', label: 'Price: Low to High' },
                    { value: 'price-high', label: 'Price: High to Low' },
                    { value: 'name', label: 'Name: A-Z' },
                  ].map(o => (
                    <button key={o.value} onClick={() => setSortBy(o.value)}
                      style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, fontFamily: 'inherit', background: sortBy === o.value ? '#0F5DA8' : '#f0f0f0', color: sortBy === o.value ? '#fff' : '#555', border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}>
                      {o.label}
                    </button>
                  ))}
                </div>

                {/* Test grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                  {sortedTests.map(t => (
                    <div key={t.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 14, transition: 'transform 0.15s, box-shadow 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <h3 style={{ fontSize: 14, margin: 0, color: '#0F5DA8', lineHeight: 1.3 }}>{t.name}</h3>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 8 }}>
                        <span style={{ background: '#f0f5ff', padding: '1px 6px', borderRadius: 4, color: '#0F5DA8' }}>{t.category}</span>
                        {t.fasting_required && <span style={{ marginLeft: 6, background: '#fff3e0', padding: '1px 6px', borderRadius: 4, color: '#e65100' }}>Fasting</span>}
                      </div>
                      <p style={{ fontSize: 11, color: '#888', lineHeight: 1.4, marginBottom: 8 }}>{t.description}</p>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8, display: 'flex', gap: 12 }}>
                        <span>⏱ {t.report_time}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>₹{t.price}</span>
                          {t.mrp > t.price && <span style={{ fontSize: 12, color: 'var(--text-light)', textDecoration: 'line-through', marginLeft: 6 }}>₹{t.mrp}</span>}
                        </div>
                        <button onClick={() => { setShowBooking(true); setBookingStep(1); }}
                          style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: 'linear-gradient(135deg, #0F5DA8, #0C6BC4)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                          Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {sortedTests.length === 0 && q && (
                  <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>
                    <p style={{ fontSize: 14 }}>No tests found matching "{q}"</p>
                    <button onClick={() => setSearch('')} style={{ marginTop: 12, padding: '8px 20px', borderRadius: 8, border: '1px solid #0F5DA8', background: '#fff', color: '#0F5DA8', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: 13 }}>Clear Search</button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Packages Mode */}
        {mode === 'packages' && (
          <>
            {Object.keys(filteredGrouped).length === 0 && q && (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>
                <MagnifyingGlass size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
                <p style={{ fontSize: 14 }}>Try searching for "liver", "diabetes", "heart", "senior", or browse categories below</p>
                <button onClick={() => setSearch('')} style={{ marginTop: 12, padding: '8px 20px', borderRadius: 8, border: '1px solid #0F5DA8', background: '#fff', color: '#0F5DA8', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: 13 }}>Clear Search</button>
              </div>
            )}

            {Object.keys(filteredGrouped).length === 0 && !q && (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>⚕️</div>
                <p style={{ fontSize: 14 }}>No packages available. Please visit Diagnostics page first.</p>
              </div>
            )}

            {Object.keys(filteredGrouped).map(axis => {
              const meta = axisMeta[axis] || {};
              const Icon = meta.icon || Heartbeat;
              const packages = filteredGrouped[axis];
              return (
                <div key={axis} style={{ marginBottom: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: meta.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} weight="fill" color={meta.color} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: 17, margin: 0 }}>{meta.label}</h2>
                      <p style={{ fontSize: 12, color: 'var(--text-light)', margin: 0 }}>{meta.desc}</p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                    {packages.map(pkg => (
                      <div key={pkg.slug} onClick={() => navigate(`/package/${pkg.slug}`)}
                        style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', padding: 16, cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <h3 style={{ fontSize: 14, margin: 0, color: meta.color }}>{pkg.name}</h3>
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#fff', background: 'linear-gradient(135deg, #22C55E, #16a34a)', padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>
                            {pkg.discountPct}% off
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--text-light)', lineHeight: 1.5, marginBottom: 10 }}>{pkg.desc}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
                          <span style={{ fontWeight: 600 }}>{pkg.testCount} Tests</span>
                          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#ddd' }} />
                          <span>Save ₹{pkg.savings?.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>₹{pkg.bundlePrice?.toLocaleString()}</span>
                            <span style={{ fontSize: 12, color: 'var(--text-light)', textDecoration: 'line-through', marginLeft: 6 }}>₹{pkg.totalMrp?.toLocaleString()}</span>
                          </div>
                          <CaretRight size={16} color={meta.color} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
