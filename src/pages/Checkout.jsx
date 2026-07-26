import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore.js';
import useCartStore from '../stores/cartStore.js';
import { placeOrder, formatInr } from '../services/ordersService.js';
import './checkout.css';

const SLOTS = [
  '6:00 AM – 8:00 AM',
  '8:00 AM – 10:00 AM',
  '10:00 AM – 12:00 PM',
  '12:00 PM – 2:00 PM',
  '2:00 PM – 4:00 PM',
  '4:00 PM – 6:00 PM',
  '6:00 PM – 8:00 PM',
];

export default function Checkout() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);

  const [patientName, setPatientName] = useState(user?.name || '');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [pincode, setPincode] = useState('');
  const [collectionDate, setCollectionDate] = useState('');
  const [collectionSlot, setCollectionSlot] = useState(SLOTS[2]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(null);

  if (!isAuthenticated()) {
    return <Navigate to="/signup" replace state={{ from: '/checkout' }} />;
  }

  if (done) {
    return (
      <div className="checkout-page container">
        <div className="checkout-success">
          <h1>Order placed</h1>
          <p className="checkout-code">{done.orderCode}</p>
          <p>
            Status: <strong>{done.status}</strong> · Payment: <strong>{done.paymentStatus}</strong>{' '}
            (prepaid gateway parked — collect later / COD)
          </p>
          <p>Total: {formatInr(done.total)}</p>
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
        <h1>Checkout</h1>
        <p className="muted">Your cart is empty.</p>
        <Link to="/diagnostics" className="btn btn-primary">
          Browse tests
        </Link>
      </div>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const order = await placeOrder({
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        addressLine1: addressLine1.trim(),
        city: city.trim() || 'Hyderabad',
        pincode: pincode.trim() || null,
        collectionDate: collectionDate || null,
        collectionSlot: collectionSlot || null,
        notes: notes.trim() || null,
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
      <div className="container checkout-grid">
        <form className="checkout-form" onSubmit={onSubmit}>
          <h1>Home collection checkout</h1>
          <p className="muted">Payment gateway is parked — order is saved as pending / COD-ready.</p>

          <h2>Patient</h2>
          <label>
            Full name
            <input value={patientName} onChange={(e) => setPatientName(e.target.value)} required />
          </label>
          <label>
            Phone
            <input value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} required />
          </label>

          <h2>Collection address</h2>
          <label>
            Address
            <input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} required />
          </label>
          <div className="checkout-row">
            <label>
              City
              <input value={city} onChange={(e) => setCity(e.target.value)} />
            </label>
            <label>
              Pincode
              <input value={pincode} onChange={(e) => setPincode(e.target.value)} />
            </label>
          </div>

          <h2>Preferred slot</h2>
          <div className="checkout-row">
            <label>
              Date
              <input type="date" value={collectionDate} onChange={(e) => setCollectionDate(e.target.value)} />
            </label>
            <label>
              Slot
              <select value={collectionSlot} onChange={(e) => setCollectionSlot(e.target.value)}>
                {SLOTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Notes (optional)
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </label>

          {error && <div className="checkout-error">{error}</div>}

          <button type="submit" className="btn btn-accent btn-block" disabled={loading}>
            {loading ? 'Placing order…' : `Place order · ${formatInr(subtotal)}`}
          </button>
        </form>

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
                  />
                  <span>{formatInr(i.price * i.quantity)}</span>
                  <button type="button" onClick={() => remove(i.testId)}>
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <p className="checkout-total">
            Total <strong>{formatInr(subtotal)}</strong>
          </p>
          <Link to="/diagnostics" className="btn btn-outline-dark btn-block">
            Add more tests
          </Link>
        </aside>
      </div>
    </div>
  );
}
