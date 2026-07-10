import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { equipmentItems, STORAGE_KEYS } from '../data/nursingData';

const C = { primary: '#0D9488', primaryLight: '#CCFBF1', accent: '#14B8A6', bg: '#F0FDFA' };
const CART_KEY = 'jh_equipment_cart';

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export default function EquipmentCart() {
  const t = useT();
  const [cart, setCart] = useState(loadCart);

  const updateItem = (id, key, val) => {
    const next = cart.map(c => c.id === id ? { ...c, [key]: val } : c);
    setCart(next);
    saveCart(next);
  };

  const removeItem = (id) => {
    const next = cart.filter(c => c.id !== id);
    setCart(next);
    saveCart(next);
  };

  const clearCart = () => {
    setCart([]);
    saveCart([]);
  };

  const totalRent = cart.reduce((sum, c) => sum + (c.price || 0) * (c.qty || 1) * (c.days || 1), 0);
  const itemCount = cart.reduce((sum, c) => sum + (c.qty || 1), 0);

  const waMsg = cart.map(c =>
    `• ${c.name} × ${c.qty || 1} — ${c.days || 1} day(s) — ₹${(c.price || 0) * (c.qty || 1) * (c.days || 1)}`
  ).join('%0A');
  const waLink = `https://wa.me/919700104108?text=${encodeURIComponent('Hello Jeevan Health! I want to rent the following equipment:%0A')}${waMsg}${encodeURIComponent(`%0ATotal: ₹${totalRent}%0APlease confirm availability and delivery.`)}`;

  return (
    <div className="page-section container" style={{ maxWidth: 680 }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.accent} 100%)`, margin: '-32px -24px 24px', padding: '32px 24px 28px', borderRadius: '0 0 24px 24px', color: '#fff' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 2px' }}>🛒 {t('equipment.cart.title', 'Equipment Cart')}</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
          {cart.length === 0
            ? t('equipment.cart.empty.desc', 'No items in your cart yet')
            : `${itemCount} ${t('equipment.cart.items', 'item(s)')} · ₹${totalRent} ${t('equipment.cart.total', 'total')}`
          }
        </p>
        <Link to="/medical-equipment" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 10, padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.2)', color: '#fff', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
          ← {t('equipment.cart.browse', 'Browse Equipment')}
        </Link>
      </div>

      {/* Empty state */}
      {cart.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>📦</div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>{t('equipment.cart.empty.title', 'Your cart is empty')}</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px' }}>{t('equipment.cart.empty.subtitle', 'Browse our medical equipment catalog and add items to rent.')}</p>
          <Link to="/medical-equipment" style={{ display: 'inline-flex', padding: '12px 28px', borderRadius: 10, background: C.primary, color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>
            {t('equipment.cart.browseNow', 'Browse Equipment')} →
          </Link>
        </div>
      )}

      {/* Cart items */}
      {cart.length > 0 && (
        <>
          <div style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
            {cart.map(c => {
              const equip = equipmentItems.find(e => e.id === c.id);
              return (
                <div key={c.id} style={{ padding: 14, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <Link to={`/medical-equipment/${c.slug}`} style={{ fontSize: 32, textDecoration: 'none' }}>{c.icon || '📦'}</Link>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <Link to={`/medical-equipment/${c.slug}`} style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', textDecoration: 'none' }}>{c.name}</Link>
                          <div style={{ fontSize: 11, color: '#64748b' }}>{c.description || equip?.description || ''}</div>
                        </div>
                        <button onClick={() => removeItem(c.id)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #fee2e2', background: '#fff', color: '#dc2626', fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                          ✕ {t('equipment.cart.remove', 'Remove')}
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 11, color: '#64748b' }}>{t('equipment.cart.qty', 'Qty')}:</span>
                          <button onClick={() => { if (c.qty > 1) updateItem(c.id, 'qty', c.qty - 1) }}
                            style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>−</button>
                          <span style={{ width: 24, textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{c.qty || 1}</span>
                          <button onClick={() => updateItem(c.id, 'qty', (c.qty || 1) + 1)}
                            style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>+</button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 11, color: '#64748b' }}>{t('equipment.cart.days', 'Days')}:</span>
                          <button onClick={() => { if ((c.days || 1) > 1) updateItem(c.id, 'days', (c.days || 1) - 1) }}
                            style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>−</button>
                          <span style={{ width: 24, textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{c.days || 1}</span>
                          <button onClick={() => updateItem(c.id, 'days', (c.days || 1) + 1)}
                            style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>+</button>
                        </div>
                        <div style={{ fontSize: 13, color: '#64748b' }}>
                          ₹{c.price || 0}/{t('equipment.cart.day', 'day')}
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: C.primary, marginLeft: 'auto' }}>
                          ₹{(c.price || 0) * (c.qty || 1) * (c.days || 1)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div style={{ padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px', color: '#0f172a' }}>{t('equipment.cart.summary', 'Order Summary')}</h3>
            <div style={{ display: 'grid', gap: 6 }}>
              {cart.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#475569' }}>
                  <span>{c.name} × {c.qty || 1} ({c.days || 1} {t('equipment.cart.day', 'day')})</span>
                  <span style={{ fontWeight: 600 }}>₹{(c.price || 0) * (c.qty || 1) * (c.days || 1)}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, color: '#0f172a', borderTop: '2px solid #e2e8f0', marginTop: 8, paddingTop: 8 }}>
              <span>{t('total', 'Total')}</span>
              <span style={{ color: C.primary }}>₹{totalRent}</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24 }}>
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 10, background: '#25D366', color: '#fff', textDecoration: 'none', fontSize: 15, fontWeight: 700, boxShadow: '0 4px 14px rgba(37,211,102,0.3)' }}>
              💬 {t('equipment.cart.proceed', 'Proceed via WhatsApp')}
            </a>
            <Link to="/medical-equipment" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '14px 24px', borderRadius: 10, border: `1px solid ${C.primary}`, background: '#fff', color: C.primary, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              + {t('equipment.cart.addMore', 'Add More Items')}
            </Link>
            <button onClick={clearCart}
              style={{ padding: '14px 24px', borderRadius: 10, border: '1px solid #fee2e2', background: '#fff', color: '#dc2626', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              🗑️ {t('equipment.cart.clear', 'Clear Cart')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
