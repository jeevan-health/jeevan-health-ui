import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { equipmentItems } from '../data/nursingData';

const C = { primary: '#0D9488', primaryLight: '#CCFBF1', accent: '#14B8A6', bg: '#F0FDFA' };

const categories = [
  { id: 'all', label: 'All Equipment', icon: '📦' },
  { id: 'respiratory', label: 'Respiratory', icon: '🫁' },
  { id: 'mobility', label: 'Mobility & Comfort', icon: '♿' },
  { id: 'monitoring', label: 'Monitoring', icon: '📊' },
];

export default function MedicalEquipment() {
  const t = useT();
  const [filter, setFilter] = useState('all');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const filtered = filter === 'all' ? equipmentItems : equipmentItems.filter(e => e.category === filter);

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => setCart(cart.filter(c => c.id !== id));

  const totalRent = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.accent} 100%)`, padding: '48px 0 44px' }}>
        <div className="container">
          <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 800, margin: '0 0 6px' }}>{t('nurse.equipment.title', 'Medical Equipment on Rent')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: '0 0 16px', maxWidth: 480 }}>
            {t('nurse.equipment.subtitle', 'High-quality medical equipment delivered to your home. Daily, weekly, and monthly rental options available.')}
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link to="/nurse-at-home/book" style={{ background: '#fff', color: C.primary, height: 44, padding: '0 24px', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              {t('nurse.equipment.book', 'Book Nurse + Equipment')} →
            </Link>
            <a href="tel:+919700104108" style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)', color: '#fff', height: 44, padding: '0 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              📞 {t('nurse.equipment.enquire', 'Enquire Now')}
            </a>
          </div>
          {cart.length > 0 && (
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => setShowCart(!showCart)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: C.accent, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                🛒 {t('nurse.equipment.cart', 'Cart')} ({cart.length}) — ₹{totalRent}/day
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="page-section container">
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setFilter(cat.id)}
              style={{ padding: '8px 16px', borderRadius: 8, border: filter === cat.id ? `2px solid ${C.primary}` : '1px solid #e2e8f0', background: filter === cat.id ? C.bg : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: filter === cat.id ? 700 : 400, color: filter === cat.id ? C.primary : '#334155', display: 'flex', alignItems: 'center', gap: 4 }}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {filtered.map(item => (
            <div key={item.id} style={{ padding: 18, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
              <div style={{ fontSize: 36, marginBottom: 6 }}>{item.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 2px', color: '#0f172a' }}>{item.name}</h3>
              <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 8px' }}>{item.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 18, fontWeight: 800, color: C.primary }}>₹{item.price}</span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{item.duration}</span>
                </div>
                <button onClick={() => addToCart(item)}
                  style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: C.primary, color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {t('nurse.equipment.add', 'Add')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCart && cart.length > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', boxShadow: '0 -4px 20px rgba(0,0,0,0.1)', zIndex: 100, padding: '16px 24px' }}>
          <div className="container" style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#0f172a' }}>{t('nurse.equipment.rental.cart', 'Rental Cart')}</h4>
              <button onClick={() => setShowCart(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>×</button>
            </div>
            {cart.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: 12 }}>
                <span style={{ fontWeight: 600 }}>{c.name} × {c.qty}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700, color: C.primary }}>₹{c.price * c.qty}/day</span>
                  <button onClick={() => removeFromCart(c.id)} style={{ padding: '2px 8px', borderRadius: 4, border: '1px solid #fee2e2', background: '#fff', color: '#dc2626', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit' }}>{t('nurse.remove', 'Remove')}</button>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTop: '2px solid #e2e8f0' }}>
              <span style={{ fontWeight: 700 }}>{t('total', 'Total')}: ₹{totalRent}/day</span>
              <Link to="/nurse-at-home/book" style={{ padding: '8px 20px', borderRadius: 6, border: 'none', background: C.primary, color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                {t('nurse.equipment.proceed', 'Proceed with Nurse Booking')} →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
