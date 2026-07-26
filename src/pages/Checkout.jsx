import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore.js';
import useCartStore from '../stores/cartStore.js';
import { placeOrder, formatInr } from '../services/ordersService.js';
import { listFamily, addFamilyMember } from '../services/familyService.js';
import './checkout.css';

const STEPS = ['Address', 'Patient', 'Schedule', 'Review', 'Payment'];

const TIME_SLOTS = [
  { label: '7:00 AM – 8:00 AM', value: '7-8', type: 'Morning', endHour: 8 },
  { label: '8:00 AM – 9:00 AM', value: '8-9', type: 'Morning', endHour: 9 },
  { label: '9:00 AM – 10:00 AM', value: '9-10', type: 'Morning', endHour: 10 },
  { label: '10:00 AM – 11:00 AM', value: '10-11', type: 'Morning', endHour: 11 },
  { label: '11:00 AM – 12:00 PM', value: '11-12', type: 'Midday', endHour: 12 },
  { label: '12:00 PM – 1:00 PM', value: '12-13', type: 'Midday', endHour: 13 },
  { label: '1:00 PM – 2:00 PM', value: '13-14', type: 'Afternoon', endHour: 14 },
  { label: '2:00 PM – 3:00 PM', value: '14-15', type: 'Afternoon', endHour: 15 },
  { label: '3:00 PM – 4:00 PM', value: '15-16', type: 'Afternoon', endHour: 16 },
  { label: '4:00 PM – 5:00 PM', value: '16-17', type: 'Evening', endHour: 17 },
  { label: '5:00 PM – 6:00 PM', value: '17-18', type: 'Evening', endHour: 18 },
  { label: '6:00 PM – 7:00 PM', value: '18-19', type: 'Evening', endHour: 19 },
  { label: '7:00 PM – 8:00 PM', value: '19-20', type: 'Evening', endHour: 20 },
];

const QUICK_AREAS = [
  { label: 'Gachibowli', pincode: '500032', area: 'Gachibowli, Hyderabad' },
  { label: 'HITEC City', pincode: '500081', area: 'HITEC City, Hyderabad' },
  { label: 'Madhapur', pincode: '500081', area: 'Madhapur, Hyderabad' },
  { label: 'Kukatpally', pincode: '500072', area: 'Kukatpally, Hyderabad' },
  { label: 'Jubilee Hills', pincode: '500033', area: 'Jubilee Hills, Hyderabad' },
  { label: 'Banjara Hills', pincode: '500034', area: 'Banjara Hills, Hyderabad' },
  { label: 'Kondapur', pincode: '500084', area: 'Kondapur, Hyderabad' },
  { label: 'Secunderabad', pincode: '500003', area: 'Secunderabad' },
];

const PAY_OPTIONS = [
  {
    value: 'cod',
    label: 'Cash on Collection',
    desc: 'Pay when the phlebotomist arrives at your doorstep',
    icon: '💵',
  },
  {
    value: 'card',
    label: 'Card on Collection',
    desc: 'Pay by card at the time of sample collection',
    icon: '💳',
  },
  {
    value: 'online',
    label: 'Online Payment',
    desc: 'Pay now via UPI / Net Banking / Card (gateway parked — order saved as pending)',
    icon: '📱',
  },
];

function generateDates() {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function isSlotAvailable(slot, date) {
  if (!date) return true;
  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  if (!sameDay) return true;
  return now.getHours() * 60 + now.getMinutes() < slot.endHour * 60;
}

function fmtDateShort(d) {
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

function fmtDateFull(d) {
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function isToday(d) {
  const t = new Date();
  return (
    d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear()
  );
}

export default function Checkout() {
  const { user, isAuthenticated } = useAuthStore();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);

  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);
  const [locating, setLocating] = useState(false);

  // Address / contact
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [addressLine1, setAddressLine1] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [state, setState] = useState('Telangana');
  const [pincode, setPincode] = useState('');

  // Patient / dependents
  const [family, setFamily] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'Male',
    relation: 'Spouse',
  });

  // Schedule
  const dates = useMemo(() => generateDates(), []);
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Payment
  const [paymentMode, setPaymentMode] = useState('cod');

  const selfPatient = useMemo(() => {
    if (!user) return null;
    return {
      id: 'self',
      name: user.name || 'Myself',
      relation: 'Self',
      age: null,
      gender: null,
      isSelf: true,
      phone: user.phone || '',
    };
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated()) return;
    listFamily()
      .then(setFamily)
      .catch(() => setFamily([]));
    if (selfPatient && !selectedPatient) setSelectedPatient(selfPatient);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (!isAuthenticated()) {
    return <Navigate to="/signup" replace state={{ from: '/checkout' }} />;
  }

  if (done) {
    const payLabel =
      PAY_OPTIONS.find((p) => p.value === done.paymentMode)?.label || done.paymentMode;
    return (
      <div className="checkout-page container">
        <div className="checkout-success">
          <div className="checkout-success-emoji" aria-hidden>
            🎉
          </div>
          <h1>Order confirmed</h1>
          <p className="muted">Your home collection booking is placed successfully.</p>
          <p className="checkout-code">{done.orderCode}</p>
          <div className="checkout-success-card">
            <div>
              <span>Patient</span>
              <strong>
                {done.patientName}
                {done.patientRelation ? ` · ${done.patientRelation}` : ''}
              </strong>
            </div>
            <div>
              <span>Collection</span>
              <strong>
                {done.collectionDate || '—'}
                {done.collectionSlot ? ` · ${done.collectionSlot}` : ''}
              </strong>
            </div>
            <div>
              <span>Payment</span>
              <strong>
                {payLabel} · {done.paymentStatus}
              </strong>
            </div>
            <div>
              <span>Total</span>
              <strong>{formatInr(done.total)}</strong>
            </div>
          </div>
          <div className="checkout-next">
            <p className="checkout-next-title">What happens next?</p>
            <ol>
              <li>We confirm your slot</li>
              <li>Phlebotomist visits for free home collection</li>
              <li>Samples go to partner lab</li>
              <li>Reports shared when ready</li>
            </ol>
          </div>
          <div className="checkout-actions">
            <Link to="/my-orders" className="btn btn-primary">
              My orders
            </Link>
            <Link to="/diagnostics" className="btn btn-outline-dark">
              Book more tests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="checkout-page container">
        <div className="checkout-empty">
          <h1>Your cart is empty</h1>
          <p className="muted">Add tests before checkout.</p>
          <Link to="/diagnostics" className="btn btn-primary">
            Browse tests
          </Link>
        </div>
      </div>
    );
  }

  const availableSlots = TIME_SLOTS.filter((s) => isSlotAvailable(s, selectedDate));
  const slotGroups = availableSlots.reduce((acc, s) => {
    if (!acc[s.type]) acc[s.type] = [];
    acc[s.type].push(s);
    return acc;
  }, {});

  const canProceed = () => {
    switch (step) {
      case 0:
        return (
          contactName.trim().length >= 2 &&
          contactPhone.trim().length >= 10 &&
          addressLine1.trim().length >= 5 &&
          pincode.trim().length >= 5
        );
      case 1:
        return Boolean(selectedPatient?.name);
      case 2:
        return Boolean(selectedDate && selectedSlot);
      case 3:
        return true;
      case 4:
        return Boolean(paymentMode);
      default:
        return false;
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported on this device');
      return;
    }
    setLocating(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&addressdetails=1`,
          );
          const data = await res.json();
          const a = data.address || {};
          setAddressLine1(
            [a.house_number || a.building || '', a.road || a.street || '', a.suburb || a.neighbourhood || '']
              .filter(Boolean)
              .join(', ') || addressLine1,
          );
          setCity(a.city || a.town || a.county || city);
          setState(a.state || state);
          setPincode(a.postcode || pincode);
        } catch {
          setAddressLine1(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        }
        setLocating(false);
      },
      () => {
        setError('Location access denied. Please enter address manually.');
        setLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  };

  const saveNewPatient = async () => {
    if (!newPatient.name.trim() || !newPatient.age) {
      setError('Please enter dependent name and age');
      return;
    }
    setError('');
    try {
      const member = await addFamilyMember({
        name: newPatient.name.trim(),
        age: Number(newPatient.age),
        gender: newPatient.gender,
        relation: newPatient.relation,
      });
      setFamily((prev) => [...prev, member]);
      setSelectedPatient(member);
      setShowNewPatient(false);
      setNewPatient({ name: '', age: '', gender: 'Male', relation: 'Spouse' });
    } catch (e) {
      setError(e?.response?.data?.error?.message || e.message || 'Could not save dependent');
    }
  };

  const next = () => {
    setError('');
    if (!canProceed()) {
      setError('Please complete the required fields for this step.');
      return;
    }
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const back = () => {
    setError('');
    if (step > 0) setStep((s) => s - 1);
  };

  const onPlaceOrder = async () => {
    if (!canProceed()) {
      setError('Please choose a payment method.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const slot = TIME_SLOTS.find((s) => s.value === selectedSlot);
      const collectionDate = selectedDate.toISOString().slice(0, 10);
      const patientPhone = selectedPatient?.isSelf
        ? contactPhone.trim()
        : contactPhone.trim();
      const order = await placeOrder({
        patientName: selectedPatient.name,
        patientPhone,
        patientAge:
          selectedPatient.age != null && selectedPatient.age !== ''
            ? Number(selectedPatient.age)
            : null,
        patientGender: selectedPatient.gender || null,
        patientRelation: selectedPatient.relation || (selectedPatient.isSelf ? 'Self' : null),
        contactName: contactName.trim(),
        contactPhone: contactPhone.trim(),
        addressLine1: addressLine1.trim(),
        city: city.trim() || 'Hyderabad',
        state: state.trim() || 'Telangana',
        pincode: pincode.trim() || null,
        landmark: landmark.trim() || null,
        collectionDate,
        collectionSlot: slot?.label || selectedSlot,
        paymentMode,
        notes: [
          `Patient: ${selectedPatient.name}`,
          selectedPatient.age != null && selectedPatient.age !== ''
            ? `Age: ${selectedPatient.age}`
            : null,
          selectedPatient.gender ? `Gender: ${selectedPatient.gender}` : null,
          selectedPatient.relation ? `Relation: ${selectedPatient.relation}` : null,
          landmark ? `Landmark: ${landmark}` : null,
        ]
          .filter(Boolean)
          .join(' | '),
        items: items.map((i) => ({ testId: i.testId, quantity: i.quantity })),
      });
      clear();
      setDone(order);
    } catch (err) {
      setError(err?.response?.data?.error?.message || err.message || 'Could not place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container checkout-wizard">
        <header className="checkout-wizard-head">
          <h1>Home collection checkout</h1>
          <p className="muted">Book lab tests with free sample collection at your doorstep.</p>
          <ol className="checkout-steps" aria-label="Checkout steps">
            {STEPS.map((label, i) => (
              <li key={label} className={i === step ? 'active' : i < step ? 'done' : ''}>
                <button type="button" disabled={i > step} onClick={() => i < step && setStep(i)}>
                  <span className="step-num">{i + 1}</span>
                  <span className="step-label">{label}</span>
                </button>
              </li>
            ))}
          </ol>
        </header>

        <div className="checkout-wizard-grid">
          <section className="checkout-panel">
            {step === 0 && (
              <div>
                <h2>Home collection address</h2>
                <p className="muted">We&apos;ll collect samples from your doorstep at the selected time.</p>
                <button
                  type="button"
                  className="btn-detect"
                  onClick={detectLocation}
                  disabled={locating}
                >
                  {locating ? 'Detecting…' : '📍 Detect my location'}
                </button>
                <div className="quick-areas">
                  <span className="field-label">Popular areas in Hyderabad</span>
                  <div className="chip-row">
                    {QUICK_AREAS.map((a) => (
                      <button
                        key={a.label}
                        type="button"
                        className={addressLine1 === a.area ? 'chip active' : 'chip'}
                        onClick={() => {
                          setAddressLine1(a.area);
                          setPincode(a.pincode);
                          setCity('Hyderabad');
                        }}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-row">
                  <label>
                    Full name *
                    <input
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Contact person name"
                      required
                    />
                  </label>
                  <label>
                    Phone *
                    <input
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="10-digit mobile"
                      maxLength={15}
                      required
                    />
                  </label>
                </div>
                <label>
                  Address *
                  <textarea
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    rows={3}
                    placeholder="House / Flat / Street / Area"
                    required
                  />
                </label>
                <label>
                  Landmark (optional)
                  <input
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Nearby landmark"
                  />
                </label>
                <div className="form-row">
                  <label>
                    City
                    <input value={city} onChange={(e) => setCity(e.target.value)} />
                  </label>
                  <label>
                    State
                    <input value={state} onChange={(e) => setState(e.target.value)} />
                  </label>
                </div>
                <label className="field-narrow">
                  Pincode *
                  <input
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    maxLength={6}
                    placeholder="6-digit pincode"
                  />
                </label>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2>Select patient</h2>
                <p className="muted">Who is this test for? Yourself, a dependent, or add someone new.</p>
                <div className="patient-list">
                  {selfPatient && (
                    <button
                      type="button"
                      className={
                        selectedPatient?.isSelf && !showNewPatient
                          ? 'patient-card active'
                          : 'patient-card'
                      }
                      onClick={() => {
                        setSelectedPatient(selfPatient);
                        setShowNewPatient(false);
                      }}
                    >
                      <span className="patient-avatar">👤</span>
                      <span>
                        <strong>
                          {selfPatient.name} (Myself)
                        </strong>
                        <em>Self</em>
                      </span>
                    </button>
                  )}
                  {family.map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      className={
                        selectedPatient?.id === m.id && !showNewPatient
                          ? 'patient-card active'
                          : 'patient-card'
                      }
                      onClick={() => {
                        setSelectedPatient(m);
                        setShowNewPatient(false);
                      }}
                    >
                      <span className="patient-avatar">{m.name?.[0]?.toUpperCase() || '?'}</span>
                      <span>
                        <strong>{m.name}</strong>
                        <em>
                          {m.relation || '—'}
                          {m.age != null ? ` · ${m.age} yrs` : ''}
                          {m.gender ? ` · ${m.gender}` : ''}
                        </em>
                      </span>
                    </button>
                  ))}
                  <button
                    type="button"
                    className={showNewPatient ? 'patient-card add active' : 'patient-card add'}
                    onClick={() => {
                      setShowNewPatient((v) => !v);
                      setSelectedPatient(null);
                    }}
                  >
                    <span className="patient-avatar">+</span>
                    <span>
                      <strong>Add dependent</strong>
                      <em>Spouse, parent, child…</em>
                    </span>
                  </button>
                </div>
                {showNewPatient && (
                  <div className="new-patient-form">
                    <div className="form-row">
                      <label>
                        Full name *
                        <input
                          value={newPatient.name}
                          onChange={(e) => setNewPatient((p) => ({ ...p, name: e.target.value }))}
                        />
                      </label>
                      <label>
                        Age *
                        <input
                          type="number"
                          min={0}
                          max={120}
                          value={newPatient.age}
                          onChange={(e) => setNewPatient((p) => ({ ...p, age: e.target.value }))}
                        />
                      </label>
                    </div>
                    <div className="form-row">
                      <label>
                        Gender
                        <select
                          value={newPatient.gender}
                          onChange={(e) => setNewPatient((p) => ({ ...p, gender: e.target.value }))}
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </label>
                      <label>
                        Relation
                        <select
                          value={newPatient.relation}
                          onChange={(e) =>
                            setNewPatient((p) => ({ ...p, relation: e.target.value }))
                          }
                        >
                          <option>Spouse</option>
                          <option>Son</option>
                          <option>Daughter</option>
                          <option>Father</option>
                          <option>Mother</option>
                          <option>Sibling</option>
                          <option>Other</option>
                        </select>
                      </label>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={saveNewPatient}>
                      Save &amp; select
                    </button>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="schedule-banner">
                  <h2>Schedule collection</h2>
                  <p>Pick a date and 1-hour slot for free home sample collection</p>
                </div>
                <h3 className="subhead">Select date</h3>
                <div className="date-scroller">
                  {dates.map((d) => {
                    const active = selectedDate?.toDateString() === d.toDateString();
                    const parts = fmtDateShort(d).split(' ');
                    return (
                      <button
                        key={d.toISOString()}
                        type="button"
                        className={active ? 'date-chip active' : 'date-chip'}
                        onClick={() => {
                          setSelectedDate(d);
                          setSelectedSlot(null);
                        }}
                      >
                        <span>{isToday(d) ? 'Today' : parts[0]}</span>
                        <strong>{parts[1]}</strong>
                        <em>{parts[2]}</em>
                      </button>
                    );
                  })}
                </div>
                <h3 className="subhead">Select time slot</h3>
                {availableSlots.length === 0 ? (
                  <div className="slot-empty">
                    No time slots left for today. Please select tomorrow or a later date.
                  </div>
                ) : (
                  ['Morning', 'Midday', 'Afternoon', 'Evening'].map((group) => {
                    const slots = slotGroups[group];
                    if (!slots?.length) return null;
                    return (
                      <div key={group} className="slot-group">
                        <div className="slot-group-label">{group}</div>
                        <div className="slot-grid">
                          {slots.map((s) => (
                            <button
                              key={s.value}
                              type="button"
                              className={selectedSlot === s.value ? 'slot-btn active' : 'slot-btn'}
                              onClick={() => setSelectedSlot(s.value)}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
                {selectedDate && selectedSlot && (
                  <div className="schedule-confirm">
                    ✓ Collection scheduled:{' '}
                    <strong>
                      {fmtDateFull(selectedDate)} at{' '}
                      {TIME_SLOTS.find((s) => s.value === selectedSlot)?.label}
                    </strong>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div>
                <h2>Review your order</h2>
                <div className="review-card">
                  <div className="review-card-head">
                    <span>Items</span>
                  </div>
                  {items.map((i) => (
                    <div key={i.testId} className="review-line">
                      <span>
                        {i.name} {i.quantity > 1 ? `×${i.quantity}` : ''}
                      </span>
                      <strong>{formatInr(i.price * i.quantity)}</strong>
                    </div>
                  ))}
                </div>
                <div className="review-card">
                  <div className="review-card-head">
                    <span>Address</span>
                    <button type="button" className="linkish" onClick={() => setStep(0)}>
                      Change
                    </button>
                  </div>
                  <p>
                    <strong>{contactName}</strong>
                    <br />
                    {addressLine1}
                    {landmark ? `, ${landmark}` : ''}
                    <br />
                    {city}, {state} – {pincode}
                    <br />
                    📞 {contactPhone}
                  </p>
                </div>
                <div className="review-card">
                  <div className="review-card-head">
                    <span>Patient &amp; schedule</span>
                    <button type="button" className="linkish" onClick={() => setStep(1)}>
                      Change
                    </button>
                  </div>
                  <p>
                    <strong>
                      {selectedPatient?.name}
                      {selectedPatient?.relation ? ` (${selectedPatient.relation})` : ''}
                    </strong>
                    <br />
                    {fmtDateFull(selectedDate)}
                    <br />
                    {TIME_SLOTS.find((s) => s.value === selectedSlot)?.label}
                  </p>
                </div>
                <div className="review-card">
                  <div className="review-line">
                    <span>Subtotal</span>
                    <span>{formatInr(subtotal)}</span>
                  </div>
                  <div className="review-line free">
                    <span>Home collection</span>
                    <span>FREE</span>
                  </div>
                  <div className="review-line total">
                    <span>Total</span>
                    <strong>{formatInr(subtotal)}</strong>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2>Choose payment method</h2>
                <p className="muted">
                  Online prepaid gateway is parked — you can still select a method; collection
                  modes are collected at the doorstep.
                </p>
                <div className="pay-list">
                  {PAY_OPTIONS.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      className={paymentMode === m.value ? 'pay-card active' : 'pay-card'}
                      onClick={() => setPaymentMode(m.value)}
                    >
                      <span className="pay-icon" aria-hidden>
                        {m.icon}
                      </span>
                      <span>
                        <strong>{m.label}</strong>
                        <em>{m.desc}</em>
                      </span>
                    </button>
                  ))}
                </div>
                {paymentMode === 'online' && (
                  <div className="pay-note">
                    🔐 Online prepaid is coming soon. Your order will be saved as{' '}
                    <strong>pending</strong> and our team will confirm payment/collection.
                  </div>
                )}
                <div className="pay-secure">
                  🔒 Your data is secure. We use encrypted connections for order information.
                </div>
              </div>
            )}

            {error && <div className="checkout-error">{error}</div>}

            <div className="checkout-nav">
              {step > 0 ? (
                <button type="button" className="btn btn-outline-dark" onClick={back}>
                  Back
                </button>
              ) : (
                <Link to="/diagnostics" className="btn btn-outline-dark">
                  Add tests
                </Link>
              )}
              {step < STEPS.length - 1 ? (
                <button type="button" className="btn btn-primary" onClick={next}>
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-accent"
                  disabled={loading}
                  onClick={onPlaceOrder}
                >
                  {loading ? 'Placing order…' : `Place order · ${formatInr(subtotal)}`}
                </button>
              )}
            </div>
          </section>

          <aside className="checkout-cart">
            <h2>Cart</h2>
            <ul>
              {items.map((i) => (
                <li key={i.testId}>
                  <div>
                    <strong>{i.name}</strong>
                    <span className="code">{i.jhcCode}</span>
                  </div>
                  <div className="checkout-line-actions">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={i.quantity}
                      onChange={(e) => setQty(i.testId, Number(e.target.value))}
                      aria-label={`Quantity for ${i.name}`}
                    />
                    <span>{formatInr(i.price * i.quantity)}</span>
                    <button type="button" onClick={() => remove(i.testId)} aria-label="Remove">
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <p className="checkout-total">
              Total <strong>{formatInr(subtotal)}</strong>
            </p>
            <p className="muted" style={{ marginBottom: 0 }}>
              Home collection FREE · Payment at collection available
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
