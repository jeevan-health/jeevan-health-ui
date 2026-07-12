import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import useCartStore from '../stores/cartStore';
import useDashboardStore from '../stores/dashboardStore';
import useAuthStore from '../stores/authStore';
import { seedTests } from '../data/seedData';
import * as diagnosticsService from '../services/diagnosticsService';
import PhysioCrossSell from '../components/PhysioCrossSell';
import VaccineCrossSell from '../components/VaccineCrossSell';

const STEPS = ['Address', 'Patient', 'Date & Time', 'Review', 'Payment'];

const TIME_SLOTS = [
  { label: '7:00 AM – 8:00 AM', value: '7-8', type: 'Morning', icon: '🌅' },
  { label: '8:00 AM – 9:00 AM', value: '8-9', type: 'Morning', icon: '🌅' },
  { label: '9:00 AM – 10:00 AM', value: '9-10', type: 'Morning', icon: '🌅' },
  { label: '10:00 AM – 11:00 AM', value: '10-11', type: 'Morning', icon: '🌤️' },
  { label: '11:00 AM – 12:00 PM', value: '11-12', type: 'Midday', icon: '☀️' },
  { label: '12:00 PM – 1:00 PM', value: '12-13', type: 'Midday', icon: '☀️' },
  { label: '1:00 PM – 2:00 PM', value: '13-14', type: 'Afternoon', icon: '🌤️' },
  { label: '2:00 PM – 3:00 PM', value: '14-15', type: 'Afternoon', icon: '🌤️' },
  { label: '3:00 PM – 4:00 PM', value: '15-16', type: 'Afternoon', icon: '🌤️' },
  { label: '4:00 PM – 5:00 PM', value: '16-17', type: 'Evening', icon: '🌆' },
  { label: '5:00 PM – 6:00 PM', value: '17-18', type: 'Evening', icon: '🌆' },
  { label: '6:00 PM – 7:00 PM', value: '18-19', type: 'Evening', icon: '🌆' },
  { label: '7:00 PM – 8:00 PM', value: '19-20', type: 'Evening', icon: '🌆' },
];

const generateDates = () => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const fmtDate = (d) => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
const fmtDateFull = (d) => d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const isToday = (d) => {
  const t = new Date();
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
};

export default function Checkout() {
  const t = useT();
  const navigate = useNavigate();
  const { items, coupon, discount, getTotal, clearCart } = useCartStore();
  const family = useDashboardStore(s => s.family);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const fetchDashboard = useDashboardStore(s => s.fetchDashboard);
  const { subtotal, discount: discAmt, total } = getTotal();

  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [locating, setLocating] = useState(false);

  // Address
  const [address, setAddress] = useState({
    fullName: '', phone: '', pincode: '', addressLine: '', city: 'Hyderabad', state: 'Telangana', landmark: '',
  });

  const detectLocation = () => {
    if (!navigator.geolocation) { setError(t('checkout.error.geolocation', 'Geolocation not supported')); return; }
    setLocating(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&addressdetails=1`);
          const data = await res.json();
          const a = data.address || {};
          setAddress(prev => ({
            ...prev,
            addressLine: [a.house_number || a.building || '', a.road || a.street || '', a.suburb || a.neighbourhood || ''].filter(Boolean).join(', '),
            city: a.city || a.town || a.county || a.state_district || prev.city,
            state: a.state || prev.state,
            pincode: a.postcode || prev.pincode,
          }));
        } catch {
          setAddress(prev => ({ ...prev, addressLine: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` }));
        }
        setLocating(false);
      },
      () => { setError(t('checkout.error.locationDenied', 'Location access denied. Please enter manually.')); setLocating(false); },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const quickLocations = [
    { label: 'Gachibowli', pincode: '500032', area: 'Gachibowli, Hyderabad' },
    { label: 'HITEC City', pincode: '500081', area: 'HITEC City, Hyderabad' },
    { label: 'Madhapur', pincode: '500081', area: 'Madhapur, Hyderabad' },
    { label: 'Kukatpally', pincode: '500072', area: 'Kukatpally, Hyderabad' },
    { label: 'Jubilee Hills', pincode: '500033', area: 'Jubilee Hills, Hyderabad' },
    { label: 'Banjara Hills', pincode: '500034', area: 'Banjara Hills, Hyderabad' },
    { label: 'Kondapur', pincode: '500084', area: 'Kondapur, Hyderabad' },
    { label: 'Secunderabad', pincode: '500003', area: 'Secunderabad' },
  ];

  // Patient
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: 'Male', relation: 'Other' });

  // Date & Time
  const dates = useMemo(() => generateDates(), []);
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);

  const itemDetails = useMemo(() => items.map(i => {
    const test = seedTests.find(t => t.name === i.name || t.id === i.id);
    return { ...i, details: test };
  }), [items]);

  const canProceed = () => {
    switch (step) {
      case 0: return address.fullName && address.phone && address.pincode && address.addressLine;
      case 1: return selectedPatient;
      case 2: return selectedDate && selectedSlot;
      case 3: return true;
      case 4: return paymentMethod;
      default: return false;
    }
  };

  const handleNext = () => {
    setError('');
    if (!canProceed()) {
      setError(t('checkout.error.requiredFields', 'Please fill in all required fields.'));
      return;
    }
    if (step < STEPS.length - 1) setStep(s => s + 1);
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    setError('');

    if (!isAuthenticated) {
      setProcessing(false);
      navigate('/signup', { state: { from: '/checkout' } });
      return;
    }

    if (!items.length) {
      setError(t('checkout.error.emptyCart', 'Your cart is empty.'));
      setProcessing(false);
      return;
    }

    const slotLabel = TIME_SLOTS.find(s => s.value === selectedSlot)?.label || selectedSlot;
    const collectionDate = selectedDate instanceof Date
      ? selectedDate.toISOString().slice(0, 10)
      : String(selectedDate).slice(0, 10);

    const tests = itemDetails.map(i => ({
      id: i.id,
      name: i.name,
      price: Number(i.offerPrice || i.price) || 0,
      quantity: i.qty || 1,
      type: i.type || 'test',
      testCount: i.testCount,
    }));

    const hasPackage = itemDetails.some(i => i.type === 'package');
    const notesParts = [
      selectedPatient ? `Patient: ${selectedPatient.name || selectedPatient}${selectedPatient.age ? `, Age: ${selectedPatient.age}` : ''}` : '',
      coupon ? `Coupon: ${coupon}` : '',
      hasPackage ? `Includes package order(s)` : '',
    ].filter(Boolean);

    try {
      const { data: order } = await diagnosticsService.placeDiagnosticOrder({
        tests,
        totalAmount: total,
        collectionDate,
        collectionTime: slotLabel,
        collectionAddress: {
          ...address,
          patient: selectedPatient,
          paymentMethod,
        },
        notes: notesParts.join(' | '),
      });

      const orderId = order.id || order.orderId;
      const booking = {
        id: orderId,
        orderId,
        items: itemDetails,
        patient: selectedPatient,
        address,
        date: fmtDateFull(selectedDate),
        time: slotLabel,
        total: Number(order.total_amount ?? order.totalAmount ?? total),
        paymentMethod,
        status: order.status || 'pending',
        createdAt: order.created_at || order.createdAt || new Date().toISOString(),
      };

      setOrderPlaced(booking);
      clearCart();
      try { await fetchDashboard?.(); } catch { /* non-blocking */ }
      setTimeout(() => navigate('/my-orders'), 2500);
    } catch (err) {
      const msg = err?.response?.data?.message
        || err?.response?.data?.error
        || (err?.response?.status === 401
          ? t('checkout.error.auth', 'Please sign in to place your order.')
          : t('checkout.error.failed', 'Failed to place order. Please try again.'));
      setError(msg);
      if (err?.response?.status === 401) {
        navigate('/signup', { state: { from: '/checkout' } });
      }
    } finally {
      setProcessing(false);
    }
  };

  // If cart is empty and no order just placed
  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="page-section container text-center" style={{ padding: '80px 16px' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{t('checkout.emptyCart.title', 'Your cart is empty')}</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>{t('checkout.emptyCart.subtitle', 'Add tests or packages to your cart before proceeding to checkout.')}</p>
        <Link to="/diagnostics" className="btn btn-primary">{t('checkout.emptyCart.browse', 'Browse Tests')}</Link>
      </div>
    );
  }

  // Order Confirmation view
  if (orderPlaced) {
    return (
      <div className="page-section container" style={{ padding: '40px 16px', maxWidth: 640, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-dark)', marginBottom: 4 }}>{t('checkout.confirmed.title', 'Order Confirmed!')}</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{t('checkout.confirmed.subtitle', 'Your booking has been placed successfully.')}</p>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('checkout.confirmed.orderDetails', 'Order Details')}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>{t('checkout.confirmed.orderId', 'Order ID')}</span>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{orderPlaced.orderId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>{t('checkout.confirmed.tests', 'Tests')}</span>
            <span style={{ fontWeight: 600 }}>{itemDetails.map(i => i.name).join(', ')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>{t('checkout.confirmed.patient', 'Patient')}</span>
            <span style={{ fontWeight: 600 }}>{selectedPatient?.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>{t('checkout.confirmed.collection', 'Collection')}</span>
            <span style={{ fontWeight: 600 }}>{fmtDateFull(selectedDate)} · {TIME_SLOTS.find(s => s.value === selectedSlot)?.label}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>{t('checkout.confirmed.location', 'Location')}</span>
            <span style={{ fontWeight: 600 }}>{t('checkout.homeCollection', 'Home Collection')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>{t('checkout.confirmed.payment', 'Payment')}</span>
            <span style={{ fontWeight: 600 }}>
              {paymentMethod === 'cod' ? t('checkout.payment.cod', 'Cash on Collection') : paymentMethod === 'online' ? t('checkout.payment.online', 'Online Payment') : t('checkout.payment.card', 'Card on Collection')}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 8 }}>
            <span style={{ color: 'var(--text-secondary)' }}>{t('checkout.confirmed.totalPaid', 'Total Paid')}</span>
            <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--primary)' }}>₹{total.toLocaleString()}</span>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20, background: '#F5FAFF' }}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('checkout.confirmed.whatNext', 'What happens next?')}</div>
          <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-body)' }}>
            <div style={{ textAlign: 'center', minWidth: 60 }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>📞</div>
              <div style={{ fontWeight: 600 }}>{t('checkout.confirmed.step.contact', 'Contact')}</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{t('checkout.confirmed.step.contactDesc', "We'll call to confirm")}</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: 60 }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>🏠</div>
              <div style={{ fontWeight: 600 }}>{t('checkout.confirmed.step.collection', 'Collection')}</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{t('checkout.confirmed.step.collectionDesc', 'Phlebotomist arrives')}</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: 60 }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>🔬</div>
              <div style={{ fontWeight: 600 }}>{t('checkout.confirmed.step.testing', 'Testing')}</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{t('checkout.confirmed.step.testingDesc', 'Processed at lab')}</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: 60 }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>📋</div>
              <div style={{ fontWeight: 600 }}>{t('checkout.confirmed.step.reports', 'Reports')}</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{t('checkout.confirmed.step.reportsDesc', 'Shared via WhatsApp')}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/my-orders" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>{t('checkout.confirmed.viewOrders', 'View Orders')}</Link>
          <Link to="/dashboard" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>{t('checkout.confirmed.dashboard', '📊 Dashboard')}</Link>
        </div>
        <div style={{ marginTop: 16 }}>
          <PhysioCrossSell
            testResults={itemDetails.map(i => ({ testName: i.name, value: '', status: '' }))}
            patientCondition=""
            source="checkout-confirmation"
            compact={true}
          />
          <div style={{ marginTop: 8 }}>
            <VaccineCrossSell
              testResults={itemDetails.map(i => ({ testName: i.name, value: '', status: '' }))}
              patientCondition=""
              source="checkout-confirmation"
              compact={true}
            />
          </div>
        </div>
        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-secondary)', marginTop: 12 }}>{t('checkout.confirmed.redirecting', 'Redirecting to dashboard automatically...')}</p>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 0: return renderAddress();
      case 1: return renderPatient();
      case 2: return renderDateTime();
      case 3: return renderReview();
      case 4: return renderPayment();
      default: return null;
    }
  };

  const renderAddress = () => (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--text-dark)' }}>{t('checkout.address.title', '📍 Home Collection Address')}</h3>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14 }}>{t('checkout.address.subtitle', "We'll collect samples from your doorstep at the selected time.")}</p>

      {/* Detect Location */}
      <button onClick={detectLocation} disabled={locating}
        style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1px dashed var(--primary)', background: 'var(--primary-light)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 14, opacity: locating ? 0.7 : 1 }}>
        {locating ? t('checkout.address.detecting', '⏳ Detecting...') : t('checkout.address.detectLocation', '📍 Detect My Location')}
      </button>

      {/* Quick Location Suggestions */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>{t('checkout.address.popularAreas', 'Popular Areas in Hyderabad')}</label>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {quickLocations.map(l => (
            <button key={l.label} type="button" onClick={() => setAddress(prev => ({ ...prev, addressLine: l.area, pincode: l.pincode }))}
              style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)', background: address.addressLine === l.area ? 'var(--primary)' : '#fff', color: address.addressLine === l.area ? '#fff' : 'var(--text-body)', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit', fontWeight: 500 }}>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>{t('checkout.address.fullName', 'Full Name')} *</label>
          <input className="input" value={address.fullName} onChange={e => setAddress({ ...address, fullName: e.target.value })} placeholder={t('checkout.address.fullNamePlaceholder', 'Enter full name')} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>{t('checkout.address.phone', 'Phone Number')} *</label>
          <input className="input" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} placeholder={t('checkout.address.phonePlaceholder', '10-digit mobile number')} maxLength={10} />
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>{t('checkout.address.pincode', 'Pincode')} *</label>
        <input className="input" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} placeholder={t('checkout.address.pincodePlaceholder', '6-digit pincode')} maxLength={6} style={{ maxWidth: 200 }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>{t('checkout.address.addressLabel', 'Address')} *</label>
        <textarea className="input" value={address.addressLine} onChange={e => setAddress({ ...address, addressLine: e.target.value })} placeholder={t('checkout.address.addressPlaceholder', 'House / Flat / Street / Area')} rows={3} style={{ resize: 'vertical' }} />
      </div>
      <div className="grid-2">
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>{t('checkout.address.city', 'City')}</label>
          <input className="input" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>{t('checkout.address.state', 'State')}</label>
          <input className="input" value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} />
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>{t('checkout.address.landmark', 'Landmark (Optional)')}</label>
        <input className="input" value={address.landmark} onChange={e => setAddress({ ...address, landmark: e.target.value })} placeholder={t('checkout.address.landmarkPlaceholder', 'Nearby landmark')} />
      </div>
    </div>
  );

  const renderPatient = () => (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-dark)' }}>{t('checkout.patient.title', '👤 Select Patient')}</h3>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>{t('checkout.patient.subtitle', 'Who is this test for? Select an existing member or add a new one.')}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {family.map(m => (
          <div
            key={m.id}
            onClick={() => { setSelectedPatient(m); setShowNewPatient(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, border: `2px solid ${selectedPatient?.id === m.id && !showNewPatient ? 'var(--primary)' : 'var(--border)'}`,
              background: selectedPatient?.id === m.id && !showNewPatient ? 'var(--primary-light)' : '#fff',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: '50%', background: selectedPatient?.id === m.id && !showNewPatient ? 'var(--primary)' : '#f0f4f8',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700,
              color: selectedPatient?.id === m.id && !showNewPatient ? '#fff' : 'var(--text-body)',
            }}>
              {m.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)' }}>{m.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{m.relation} · {m.age} {t('checkout.patient.years', 'yrs')} · {m.bloodGroup}</div>
            </div>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selectedPatient?.id === m.id && !showNewPatient ? 'var(--primary)' : '#d0d5dd'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: selectedPatient?.id === m.id && !showNewPatient ? 'var(--primary)' : 'transparent',
            }}>
              {selectedPatient?.id === m.id && !showNewPatient && <span style={{ color: '#fff', fontSize: 11 }}>✓</span>}
            </div>
          </div>
        ))}

        {/* Add New Patient Button */}
        <div onClick={() => { setShowNewPatient(!showNewPatient); setSelectedPatient(null); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12,
            border: `2px dashed ${showNewPatient ? 'var(--primary)' : 'var(--border)'}`,
            background: showNewPatient ? 'var(--primary-light)' : '#fff',
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', background: showNewPatient ? 'var(--primary)' : '#f0f4f8',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700,
            color: showNewPatient ? '#fff' : 'var(--primary)',
          }}>+</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>{t('checkout.patient.addNew', 'Add New Patient')}</div>
        </div>

        {/* New Patient Form */}
        {showNewPatient && (
          <div style={{ padding: 14, background: '#f8f9fa', borderRadius: 12, marginTop: 4 }}>
            <div className="grid-2" style={{ marginBottom: 10 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t('checkout.patient.fullName', 'Full Name')} *</label>
                <input className="input" value={newPatient.name} onChange={e => setNewPatient(p => ({ ...p, name: e.target.value }))} placeholder={t('checkout.patient.namePlaceholder', 'Patient name')} style={{ fontSize: 12 }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t('checkout.patient.age', 'Age')} *</label>
                <input className="input" type="number" value={newPatient.age} onChange={e => setNewPatient(p => ({ ...p, age: e.target.value }))} placeholder={t('checkout.patient.agePlaceholder', 'Age')} style={{ fontSize: 12 }} />
              </div>
            </div>
            <div className="grid-2" style={{ marginBottom: 10 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t('checkout.patient.gender', 'Gender')}</label>
                <select className="select" value={newPatient.gender} onChange={e => setNewPatient(p => ({ ...p, gender: e.target.value }))} style={{ fontSize: 12 }}>
                  <option value="Male">{t('checkout.patient.genderMale', 'Male')}</option>
                  <option value="Female">{t('checkout.patient.genderFemale', 'Female')}</option>
                  <option value="Other">{t('checkout.patient.genderOther', 'Other')}</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t('checkout.patient.relation', 'Relation')}</label>
                <select className="select" value={newPatient.relation} onChange={e => setNewPatient(p => ({ ...p, relation: e.target.value }))} style={{ fontSize: 12 }}>
                  <option value="Self">{t('checkout.patient.relationSelf', 'Self')}</option>
                  <option value="Spouse">{t('checkout.patient.relationSpouse', 'Spouse')}</option>
                  <option value="Son">{t('checkout.patient.relationSon', 'Son')}</option>
                  <option value="Daughter">{t('checkout.patient.relationDaughter', 'Daughter')}</option>
                  <option value="Father">{t('checkout.patient.relationFather', 'Father')}</option>
                  <option value="Mother">{t('checkout.patient.relationMother', 'Mother')}</option>
                  <option value="Sibling">{t('checkout.patient.relationSibling', 'Sibling')}</option>
                  <option value="Other">{t('checkout.patient.relationOther', 'Other')}</option>
                </select>
              </div>
            </div>
            <button onClick={() => {
              if (!newPatient.name || !newPatient.age) { setError(t('checkout.error.nameAge', 'Please enter name and age')); return; }
              const member = { ...newPatient, age: parseInt(newPatient.age), bloodGroup: '--', lastCheckup: 'N/A', abhaId: '' };
              useDashboardStore.getState().addFamilyMember(member);
              setSelectedPatient({ ...member, id: `FM${Date.now()}` });
              setShowNewPatient(false);
              setNewPatient({ name: '', age: '', gender: 'Male', relation: 'Other' });
              setError('');
            }} className="btn btn-primary btn-block" style={{ fontSize: 12 }}>{t('checkout.patient.saveSelect', 'Save & Select')}</button>
          </div>
        )}
      </div>
    </div>
  );

  const renderDateTime = () => {
    const timeGroups = TIME_SLOTS.reduce((acc, s) => {
      if (!acc[s.type]) acc[s.type] = [];
      acc[s.type].push(s);
      return acc;
    }, {});
    const groupOrder = ['Morning', 'Midday', 'Afternoon', 'Evening'];
    const groupIcons = { Morning: '🌅', Midday: '☀️', Afternoon: '🌤️', Evening: '🌆' };

    return (
      <div>
        <div style={{ background: 'linear-gradient(135deg, #0b2a4a 0%, #1a4a7a 100%)', borderRadius: 16, padding: '18px 18px 20px', marginBottom: 20, color: '#fff' }}>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 2 }}>{t('checkout.schedule.title', '📅 Schedule Collection')}</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>{t('checkout.schedule.subtitle', 'Pick a date and time for your free home sample collection')}</div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📅</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{t('checkout.schedule.selectDate', 'Select Date')}</div>
              <div style={{ fontSize: 11, color: '#888' }}>{t('checkout.schedule.selectDateDesc', 'Choose your preferred collection day')}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, overflow: 'auto', paddingBottom: 8, scrollSnapType: 'x mandatory' }}>
            {dates.map(d => {
              const active = selectedDate?.toDateString() === d.toDateString();
              const today = isToday(d);
              const parts = fmtDate(d).split(' ');
              return (
                <button
                  key={d.toISOString()}
                  onClick={() => { setSelectedDate(d); setSelectedSlot(null); }}
                  style={{
                    flexShrink: 0, scrollSnapAlign: 'start',
                    padding: '10px 6px', borderRadius: 14,
                    border: `2px solid ${active ? '#1a4a7a' : '#e8edf2'}`,
                    background: active ? '#1a4a7a' : '#fff',
                    color: active ? '#fff' : '#333',
                    cursor: 'pointer', fontSize: 12, fontWeight: active ? 700 : 500,
                    fontFamily: 'inherit', textAlign: 'center', minWidth: 72,
                    transition: 'all 0.2s', boxShadow: active ? '0 4px 12px rgba(26,74,122,0.25)' : 'none',
                  }}
                >
                  <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4, opacity: active ? 0.9 : 0.6 }}>
                    {today ? t('checkout.schedule.today', 'Today') : parts[0]}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.2 }}>{parts[1]}</div>
                  <div style={{ fontSize: 9, opacity: active ? 0.8 : 0.5, marginTop: 2 }}>{parts[2]}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⏰</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{t('checkout.schedule.selectTime', 'Select Time Slot')}</div>
              <div style={{ fontSize: 11, color: '#888' }}>{t('checkout.schedule.selectTimeDesc', '1-hour slots available throughout the day')}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {groupOrder.map(group => {
              const slots = timeGroups[group];
              if (!slots) return null;
              return (
                <div key={group}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, padding: '0 2px' }}>
                    <span style={{ fontSize: 14 }}>{groupIcons[group]}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t(`checkout.schedule.group.${group.toLowerCase()}`, group)}</span>
                    <div style={{ flex: 1, height: 1, background: '#f0f0f0' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {slots.map(s => {
                      const active = selectedSlot === s.value;
                      return (
                        <button
                          key={s.value}
                          onClick={() => setSelectedSlot(s.value)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '8px 10px', borderRadius: 10,
                            border: `2px solid ${active ? '#1a4a7a' : '#e8edf2'}`,
                            background: active ? '#f0f7ff' : '#fff',
                            cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, textAlign: 'left',
                            transition: 'all 0.15s',
                          }}
                        >
                          <div style={{
                            width: 20, height: 20, borderRadius: '50%',
                            border: `2px solid ${active ? '#1a4a7a' : '#d0d5dd'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: active ? '#1a4a7a' : 'transparent', flexShrink: 0,
                          }}>
                            {active && <span style={{ color: '#fff', fontSize: 9 }}>✓</span>}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: active ? 700 : 500, color: active ? '#1a4a7a' : '#333', fontSize: 11 }}>
                              {s.label}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedDate && selectedSlot && (
          <div style={{ marginTop: 16, padding: '10px 14px', background: '#e8f5e9', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#2e7d32' }}>
            <span>✅</span>
            <span><strong>{t('checkout.schedule.scheduled', 'Collection scheduled:')}</strong> {fmtDateFull(selectedDate)} {t('checkout.schedule.at', 'at')} {TIME_SLOTS.find(s => s.value === selectedSlot)?.label}</span>
          </div>
        )}
      </div>
    );
  };

  const renderReview = () => (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-dark)' }}>{t('checkout.review.title', '📋 Review Your Order')}</h3>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>{t('checkout.review.items', 'Items')}</div>
        {itemDetails.map((i, idx) => (
          <div key={`${i.id}-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: idx < itemDetails.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)' }}>{i.name}</div>
              {i.qty > 1 && <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{t('checkout.review.qty', 'Qty:')} {i.qty}</div>}
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>₹{((i.offerPrice || i.price) * (i.qty || 1)).toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('checkout.review.address', 'Address')}</span>
          <button onClick={() => setStep(0)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}>{t('checkout.review.change', 'Change')}</button>
        </div>
        <div style={{ fontSize: 12 }}>
          <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{address.fullName}</div>
          <div style={{ color: 'var(--text-body)' }}>{address.addressLine}</div>
          <div style={{ color: 'var(--text-body)' }}>{address.landmark && `${address.landmark}, `}{address.city}, {address.state} – {address.pincode}</div>
          <div style={{ color: 'var(--text-secondary)' }}>📞 {address.phone}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('checkout.review.patientSchedule', 'Patient & Schedule')}</span>
          <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}>{t('checkout.review.change', 'Change')}</button>
        </div>
        <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div><span style={{ color: 'var(--text-secondary)' }}>{t('checkout.review.patientLabel', 'Patient:')} </span><span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{selectedPatient?.name} ({selectedPatient?.relation})</span></div>
          <div><span style={{ color: 'var(--text-secondary)' }}>{t('checkout.review.dateLabel', 'Date:')} </span><span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{fmtDateFull(selectedDate)}</span></div>
          <div><span style={{ color: 'var(--text-secondary)' }}>{t('checkout.review.timeLabel', 'Time:')} </span><span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{TIME_SLOTS.find(s => s.value === selectedSlot)?.label}</span></div>
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>{t('checkout.review.paymentSummary', 'Payment Summary')}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}><span style={{ color: 'var(--text-secondary)' }}>{t('checkout.review.subtotal', 'Subtotal')}</span><span>₹{subtotal.toLocaleString()}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4, color: '#16a34a' }}><span>{t('checkout.review.homeCollection', 'Home Collection')}</span><span>{t('checkout.review.free', 'FREE')}</span></div>
        {discAmt > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4, color: '#dc2626' }}><span>{t('checkout.review.discount', 'Discount')} ({discount}%)</span><span>-₹{discAmt.toLocaleString()}</span></div>}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, margin: '6px 0 0', borderTop: '1px solid var(--border)', paddingTop: 6, color: 'var(--text-dark)' }}><span>{t('checkout.review.total', 'Total')}</span><span>₹{total.toLocaleString()}</span></div>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-dark)' }}>{t('checkout.payment.title', '💰 Choose Payment Method')}</h3>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>{t('checkout.payment.subtitle', "Select how you'd like to pay.")}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { value: 'cod', label: t('checkout.payment.cod', 'Cash on Collection'), desc: t('checkout.payment.codDesc', 'Pay when the phlebotomist arrives at your doorstep'), icon: '💵' },
          { value: 'card', label: t('checkout.payment.card', 'Card on Collection'), desc: t('checkout.payment.cardDesc', 'Pay by card at the time of sample collection'), icon: '💳' },
          { value: 'online', label: t('checkout.payment.online', 'Online Payment'), desc: t('checkout.payment.onlineDesc', 'Pay now via UPI, Net Banking, or Card'), icon: '📱' },
        ].map(m => (
          <div
            key={m.value}
            onClick={() => setPaymentMethod(m.value)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12,
              border: `2px solid ${paymentMethod === m.value ? 'var(--primary)' : 'var(--border)'}`,
              background: paymentMethod === m.value ? 'var(--primary-light)' : '#fff',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: 24 }}>{m.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)' }}>{m.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{m.desc}</div>
            </div>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', border: `2px solid ${paymentMethod === m.value ? 'var(--primary)' : '#d0d5dd'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: paymentMethod === m.value ? 'var(--primary)' : 'transparent',
            }}>
              {paymentMethod === m.value && <span style={{ color: '#fff', fontSize: 11 }}>✓</span>}
            </div>
          </div>
        ))}
      </div>

      {paymentMethod === 'online' && (
        <div style={{ marginTop: 16, padding: 16, background: '#F5FAFF', borderRadius: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
          {t('checkout.payment.securePayment', '🔒 Secure payment via')} <strong style={{ color: 'var(--primary)' }}>Razorpay</strong>. {t('checkout.payment.encrypted', 'All transactions are encrypted.')}
        </div>
      )}

      <div style={{ marginTop: 20, padding: 14, background: '#FFF8E1', borderRadius: 12, fontSize: 11, color: '#B45309' }}>
        <strong>{t('checkout.payment.dataSecure', '🔒 Your data is secure.')}</strong> {t('checkout.payment.encryptionDesc', 'We use encrypted connections for all order and payment information.')}
      </div>
    </div>
  );

  return (
    <div className="page-section container" style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Link to="/diagnostics" style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, display: 'inline-block', textDecoration: 'none' }}>{t('checkout.backToTests', '← Back to Tests')}</Link>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-dark)' }}>{t('checkout.title', 'Checkout')}</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t('checkout.subtitle', 'Complete your booking in a few easy steps')}</p>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', marginBottom: 24, position: 'relative' }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
            {i < STEPS.length - 1 && (
              <div style={{
                position: 'absolute', top: 14, left: 'calc(50% + 16px)', right: 'calc(-50% + 16px)',
                height: 2, background: i < step ? 'var(--secondary)' : 'var(--border)', zIndex: 0,
              }} />
            )}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
                background: i < step ? 'var(--secondary)' : i === step ? 'var(--primary)' : 'var(--border)',
                color: i <= step ? '#fff' : 'var(--text-secondary)',
                transition: 'all 0.3s',
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              <div style={{
                fontSize: 9, marginTop: 4, color: i === step ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: i === step ? 700 : 400, whiteSpace: 'nowrap',
              }}>
                {t(`checkout.step.${s.toLowerCase().replace(/\s+&\s+/g, '_').replace(/\s+/g, '_')}`, s)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="card" style={{ marginBottom: 20 }}>
        {renderStep()}
      </div>

      {error && (
        <div style={{ padding: '10px 14px', background: '#FDE8E8', borderRadius: 10, fontSize: 12, color: '#DC2626', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Navigation buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <button onClick={() => { if (step > 0) { setStep(s => s - 1); setError(''); } else { navigate(-1); } }} className="btn btn-outline" style={{ padding: '10px 24px' }}>
          {t('checkout.back', '← Back')}
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={handleNext} className="btn btn-primary" style={{ padding: '10px 28px' }}>
            {t('checkout.continue', 'Continue →')}
          </button>
        ) : (
          <button onClick={handlePlaceOrder} disabled={processing} className="btn btn-primary" style={{ padding: '10px 28px', opacity: processing ? 0.7 : 1 }}>
            {processing ? t('checkout.placing', '⏳ Placing Order...') : `${t('checkout.pay', 'Pay')} ₹${total.toLocaleString()} →`}
          </button>
        )}
      </div>

      {/* Order summary sidebar on desktop */}
      {step < 4 && (
        <div style={{ marginTop: 20, padding: 14, background: '#F5FAFF', borderRadius: 12, fontSize: 12 }}>
          <div style={{ fontWeight: 700, color: 'var(--text-dark)', marginBottom: 8 }}>{t('checkout.summary.title', 'Order Summary')}</div>
          {itemDetails.map((i, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: 'var(--text-body)' }}>{i.name}{i.qty > 1 ? ` × ${i.qty}` : ''}</span>
              <span style={{ fontWeight: 600, color: 'var(--primary)' }}>₹{((i.offerPrice || i.price) * (i.qty || 1)).toLocaleString()}</span>
            </div>
          ))}
          {discAmt > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#16a34a' }}>
              <span>{t('checkout.summary.discount', 'Discount')} ({discount}%)</span>
              <span>-₹{discAmt.toLocaleString()}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #d0d5dd', paddingTop: 6, marginTop: 4 }}>
            <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{t('checkout.summary.total', 'Total')}</span>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--primary)' }}>₹{total.toLocaleString()}</span>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .checkout-step-card { padding: 16px !important; }
          .checkout-actions { flex-direction: column !important; gap: 8px !important; }
          .checkout-actions .btn { width: 100% !important; justify-content: center !important; }
          .checkout-review-card { padding: 14px !important; }
          .checkout-items-list > div { flex-wrap: wrap !important; gap: 6px !important; }
          .checkout-payment-options { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .grid-2 { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .checkout-main { padding: 12px 10px !important; }
          .checkout-main h3 { font-size: 14px !important; }
          .checkout-main .card { padding: 12px !important; border-radius: 14px !important; }
          .checkout-patient-list > div { padding: 10px !important; }
          .checkout-add-patient-btn { flex-direction: column !important; gap: 6px !important; }
          .checkout-add-patient-btn input { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
