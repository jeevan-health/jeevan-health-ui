import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import useDashboardStore from '../stores/dashboardStore';
import { seedTests } from '../data/seedData';

const STEPS = ['Address', 'Patient', 'Date & Time', 'Review', 'Payment'];

const TIME_SLOTS = [
  { label: '7:00 AM – 9:00 AM', value: '7-9', type: 'Morning' },
  { label: '9:00 AM – 11:00 AM', value: '9-11', type: 'Morning' },
  { label: '11:00 AM – 1:00 PM', value: '11-13', type: 'Midday' },
  { label: '4:00 PM – 6:00 PM', value: '16-18', type: 'Evening' },
  { label: '6:00 PM – 8:00 PM', value: '18-20', type: 'Evening' },
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
  const navigate = useNavigate();
  const { items, coupon, discount, getTotal, clearCart } = useCartStore();
  const family = useDashboardStore(s => s.family);
  const { subtotal, discount: discAmt, total } = getTotal();

  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [locating, setLocating] = useState(false);

  // Address
  const [address, setAddress] = useState({
    fullName: '', phone: '', pincode: '', addressLine: '', city: 'Hyderabad', state: 'Telangana', landmark: '',
  });

  const detectLocation = () => {
    if (!navigator.geolocation) { setError('Geolocation not supported'); return; }
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
      () => { setError('Location access denied. Please enter manually.'); setLocating(false); },
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
      setError('Please fill in all required fields.');
      return;
    }
    if (step < STEPS.length - 1) setStep(s => s + 1);
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    setError('');

    // Simulate API call
    await new Promise(r => setTimeout(r, 2000));

    const orderId = `JH${Date.now().toString(36).toUpperCase()}`;
    const booking = {
      id: `BK${Date.now().toString(36).toUpperCase()}`,
      orderId,
      items: itemDetails,
      patient: selectedPatient,
      address,
      date: fmtDateFull(selectedDate),
      time: TIME_SLOTS.find(s => s.value === selectedSlot)?.label,
      total,
      paymentMethod,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    setOrderPlaced(booking);
    clearCart();
    setProcessing(false);

    // Add to dashboard bookings
    const store = useDashboardStore.getState();
    const newBooking = {
      id: booking.id,
      test: itemDetails.map(i => i.name).join(' + '),
      date: fmtDateFull(selectedDate),
      time: TIME_SLOTS.find(s => s.value === selectedSlot)?.label,
      location: 'Home Collection',
      status: 'Confirmed',
    };
    useDashboardStore.setState({ upcomingBookings: [...store.upcomingBookings, newBooking] });
  };

  // If cart is empty and no order just placed
  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="page-section container text-center" style={{ padding: '80px 16px' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Your cart is empty</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>Add tests or packages to your cart before proceeding to checkout.</p>
        <Link to="/diagnostics" className="btn btn-primary">Browse Tests</Link>
      </div>
    );
  }

  // Order Confirmation view
  if (orderPlaced) {
    return (
      <div className="page-section container" style={{ padding: '40px 16px', maxWidth: 640, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-dark)', marginBottom: 4 }}>Order Confirmed!</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Your booking has been placed successfully.</p>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Order Details</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Order ID</span>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{orderPlaced.orderId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Tests</span>
            <span style={{ fontWeight: 600 }}>{itemDetails.map(i => i.name).join(', ')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Patient</span>
            <span style={{ fontWeight: 600 }}>{selectedPatient?.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Collection</span>
            <span style={{ fontWeight: 600 }}>{fmtDateFull(selectedDate)} · {TIME_SLOTS.find(s => s.value === selectedSlot)?.label}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Location</span>
            <span style={{ fontWeight: 600 }}>Home Collection</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Payment</span>
            <span style={{ fontWeight: 600 }}>
              {paymentMethod === 'cod' ? 'Cash on Collection' : paymentMethod === 'online' ? 'Online Payment' : 'Card on Collection'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 8 }}>
            <span style={{ color: 'var(--text-secondary)' }}>Total Paid</span>
            <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--primary)' }}>₹{total.toLocaleString()}</span>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20, background: '#F5FAFF' }}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>What happens next?</div>
          <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-body)' }}>
            <div style={{ textAlign: 'center', minWidth: 60 }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>📞</div>
              <div style={{ fontWeight: 600 }}>Contact</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>We'll call to confirm</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: 60 }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>🏠</div>
              <div style={{ fontWeight: 600 }}>Collection</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Phlebotomist arrives</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: 60 }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>🔬</div>
              <div style={{ fontWeight: 600 }}>Testing</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Processed at lab</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: 60 }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>📋</div>
              <div style={{ fontWeight: 600 }}>Reports</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Shared via WhatsApp</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/my-orders" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>View Orders</Link>
          <Link to="/dashboard" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Go to Dashboard</Link>
        </div>
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
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--text-dark)' }}>📍 Home Collection Address</h3>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14 }}>We'll collect samples from your doorstep at the selected time.</p>

      {/* Detect Location */}
      <button onClick={detectLocation} disabled={locating}
        style={{ width: '100%', padding: '10px', borderRadius: 10, border: '1px dashed var(--primary)', background: 'var(--primary-light)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 14, opacity: locating ? 0.7 : 1 }}>
        {locating ? '⏳ Detecting...' : '📍 Detect My Location'}
      </button>

      {/* Quick Location Suggestions */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Popular Areas in Hyderabad</label>
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
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Full Name *</label>
          <input className="input" value={address.fullName} onChange={e => setAddress({ ...address, fullName: e.target.value })} placeholder="Enter full name" />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Phone Number *</label>
          <input className="input" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} placeholder="10-digit mobile number" maxLength={10} />
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Pincode *</label>
        <input className="input" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} placeholder="6-digit pincode" maxLength={6} style={{ maxWidth: 200 }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Address *</label>
        <textarea className="input" value={address.addressLine} onChange={e => setAddress({ ...address, addressLine: e.target.value })} placeholder="House / Flat / Street / Area" rows={3} style={{ resize: 'vertical' }} />
      </div>
      <div className="grid-2">
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>City</label>
          <input className="input" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>State</label>
          <input className="input" value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} />
        </div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>Landmark (Optional)</label>
        <input className="input" value={address.landmark} onChange={e => setAddress({ ...address, landmark: e.target.value })} placeholder="Nearby landmark" />
      </div>
    </div>
  );

  const renderPatient = () => (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-dark)' }}>👤 Select Patient</h3>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>Who is this test for? Select an existing member or add a new one.</p>
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
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{m.relation} · {m.age} yrs · {m.bloodGroup}</div>
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
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>Add New Patient</div>
        </div>

        {/* New Patient Form */}
        {showNewPatient && (
          <div style={{ padding: 14, background: '#f8f9fa', borderRadius: 12, marginTop: 4 }}>
            <div className="grid-2" style={{ marginBottom: 10 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Full Name *</label>
                <input className="input" value={newPatient.name} onChange={e => setNewPatient(p => ({ ...p, name: e.target.value }))} placeholder="Patient name" style={{ fontSize: 12 }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Age *</label>
                <input className="input" type="number" value={newPatient.age} onChange={e => setNewPatient(p => ({ ...p, age: e.target.value }))} placeholder="Age" style={{ fontSize: 12 }} />
              </div>
            </div>
            <div className="grid-2" style={{ marginBottom: 10 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Gender</label>
                <select className="select" value={newPatient.gender} onChange={e => setNewPatient(p => ({ ...p, gender: e.target.value }))} style={{ fontSize: 12 }}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Relation</label>
                <select className="select" value={newPatient.relation} onChange={e => setNewPatient(p => ({ ...p, relation: e.target.value }))} style={{ fontSize: 12 }}>
                  <option value="Self">Self</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <button onClick={() => {
              if (!newPatient.name || !newPatient.age) { setError('Please enter name and age'); return; }
              const member = { ...newPatient, age: parseInt(newPatient.age), bloodGroup: '--', lastCheckup: 'N/A', abhaId: '' };
              useDashboardStore.getState().addFamilyMember(member);
              setSelectedPatient({ ...member, id: `FM${Date.now()}` });
              setShowNewPatient(false);
              setNewPatient({ name: '', age: '', gender: 'Male', relation: 'Other' });
              setError('');
            }} className="btn btn-primary btn-block" style={{ fontSize: 12 }}>Save & Select</button>
          </div>
        )}
      </div>
    </div>
  );

  const renderDateTime = () => (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-dark)' }}>📅 Select Date & Time</h3>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>Choose a convenient slot for home sample collection.</p>

      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Date</div>
      <div style={{ display: 'flex', gap: 6, overflow: 'auto', paddingBottom: 8, marginBottom: 16 }}>
        {dates.map(d => (
          <button
            key={d.toISOString()}
            onClick={() => { setSelectedDate(d); setSelectedSlot(null); }}
            style={{
              flexShrink: 0, padding: '8px 14px', borderRadius: 10, border: `2px solid ${selectedDate?.toDateString() === d.toDateString() ? 'var(--primary)' : 'var(--border)'}`,
              background: selectedDate?.toDateString() === d.toDateString() ? 'var(--primary)' : '#fff',
              color: selectedDate?.toDateString() === d.toDateString() ? '#fff' : 'var(--text-body)',
              cursor: 'pointer', fontSize: 12, fontWeight: selectedDate?.toDateString() === d.toDateString() ? 700 : 500,
              fontFamily: 'inherit', textAlign: 'center', minWidth: 80,
            }}
          >
            <div style={{ fontSize: 10, opacity: 0.8, marginBottom: 2 }}>{isToday(d) ? 'Today' : fmtDate(d).split(' ')[0]}</div>
            <div>{fmtDate(d).split(' ').slice(1).join(' ')}</div>
          </button>
        ))}
      </div>

      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Time Slot</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {TIME_SLOTS.map(s => (
          <button
            key={s.value}
            onClick={() => setSelectedSlot(s.value)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10,
              border: `2px solid ${selectedSlot === s.value ? 'var(--primary)' : 'var(--border)'}`,
              background: selectedSlot === s.value ? 'var(--primary-light)' : '#fff',
              cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, textAlign: 'left',
            }}
          >
            <span style={{ fontSize: 16 }}>{s.type === 'Morning' ? '🌅' : s.type === 'Midday' ? '☀️' : '🌆'}</span>
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: selectedSlot === s.value ? 700 : 500, color: 'var(--text-dark)' }}>{s.label}</span>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)', marginLeft: 6 }}>{s.type}</span>
            </div>
            <div style={{
              width: 18, height: 18, borderRadius: '50%', border: `2px solid ${selectedSlot === s.value ? 'var(--primary)' : '#d0d5dd'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: selectedSlot === s.value ? 'var(--primary)' : 'transparent',
            }}>
              {selectedSlot === s.value && <span style={{ color: '#fff', fontSize: 10 }}>✓</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderReview = () => (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-dark)' }}>📋 Review Your Order</h3>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Items</div>
        {itemDetails.map((i, idx) => (
          <div key={`${i.id}-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: idx < itemDetails.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dark)' }}>{i.name}</div>
              {i.qty > 1 && <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Qty: {i.qty}</div>}
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>₹{((i.offerPrice || i.price) * (i.qty || 1)).toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Address</div>
        <div style={{ fontSize: 12 }}>
          <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{address.fullName}</div>
          <div style={{ color: 'var(--text-body)' }}>{address.addressLine}</div>
          <div style={{ color: 'var(--text-body)' }}>{address.landmark && `${address.landmark}, `}{address.city}, {address.state} – {address.pincode}</div>
          <div style={{ color: 'var(--text-secondary)' }}>📞 {address.phone}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Patient & Schedule</div>
        <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div><span style={{ color: 'var(--text-secondary)' }}>Patient: </span><span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{selectedPatient?.name} ({selectedPatient?.relation})</span></div>
          <div><span style={{ color: 'var(--text-secondary)' }}>Date: </span><span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{fmtDateFull(selectedDate)}</span></div>
          <div><span style={{ color: 'var(--text-secondary)' }}>Time: </span><span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{TIME_SLOTS.find(s => s.value === selectedSlot)?.label}</span></div>
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Payment Summary</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}><span style={{ color: 'var(--text-secondary)' }}>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4, color: '#16a34a' }}><span>Home Collection</span><span>FREE</span></div>
        {discAmt > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4, color: '#dc2626' }}><span>Discount ({discount}%)</span><span>-₹{discAmt.toLocaleString()}</span></div>}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, margin: '6px 0 0', borderTop: '1px solid var(--border)', paddingTop: 6, color: 'var(--text-dark)' }}><span>Total</span><span>₹{total.toLocaleString()}</span></div>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-dark)' }}>💰 Choose Payment Method</h3>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>Select how you'd like to pay.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { value: 'cod', label: 'Cash on Collection', desc: 'Pay when the phlebotomist arrives at your doorstep', icon: '💵' },
          { value: 'card', label: 'Card on Collection', desc: 'Pay by card at the time of sample collection', icon: '💳' },
          { value: 'online', label: 'Online Payment', desc: 'Pay now via UPI, Net Banking, or Card', icon: '📱' },
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
          🔒 Secure payment via <strong style={{ color: 'var(--primary)' }}>Razorpay</strong>. All transactions are encrypted.
        </div>
      )}

      <div style={{ marginTop: 20, padding: 14, background: '#FFF8E1', borderRadius: 12, fontSize: 11, color: '#B45309' }}>
        <strong>🔒 Your data is secure.</strong> We use encrypted connections for all order and payment information.
      </div>
    </div>
  );

  return (
    <div className="page-section container" style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Link to="/diagnostics" style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, display: 'inline-block', textDecoration: 'none' }}>← Back to Tests</Link>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-dark)' }}>Checkout</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Complete your booking in a few easy steps</p>
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
                {s}
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
        {step > 0 ? (
          <button onClick={() => { setStep(s => s - 1); setError(''); }} className="btn btn-outline" style={{ padding: '10px 24px' }}>
            ← Back
          </button>
        ) : (
          <Link to="/diagnostics" className="btn btn-outline" style={{ padding: '10px 24px', textDecoration: 'none' }}>
            ← Cancel
          </Link>
        )}
        {step < STEPS.length - 1 ? (
          <button onClick={handleNext} className="btn btn-primary" style={{ padding: '10px 28px' }}>
            Continue →
          </button>
        ) : (
          <button onClick={handlePlaceOrder} disabled={processing} className="btn btn-primary" style={{ padding: '10px 28px', opacity: processing ? 0.7 : 1 }}>
            {processing ? '⏳ Placing Order...' : `Pay ₹${total.toLocaleString()} →`}
          </button>
        )}
      </div>

      {/* Order summary sidebar on desktop */}
      {step < 4 && (
        <div style={{ marginTop: 20, padding: 14, background: '#F5FAFF', borderRadius: 12, fontSize: 12 }}>
          <div style={{ fontWeight: 700, color: 'var(--text-dark)', marginBottom: 8 }}>Order Summary</div>
          {itemDetails.map((i, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: 'var(--text-body)' }}>{i.name}{i.qty > 1 ? ` × ${i.qty}` : ''}</span>
              <span style={{ fontWeight: 600, color: 'var(--primary)' }}>₹{((i.offerPrice || i.price) * (i.qty || 1)).toLocaleString()}</span>
            </div>
          ))}
          {discAmt > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#16a34a' }}>
              <span>Discount ({discount}%)</span>
              <span>-₹{discAmt.toLocaleString()}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #d0d5dd', paddingTop: 6, marginTop: 4 }}>
            <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>Total</span>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--primary)' }}>₹{total.toLocaleString()}</span>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
