import React from 'react';
import { Link } from 'react-router-dom';
import useCartStore from '../../stores/cartStore';
import useUploadModal from '../../stores/uploadModalStore';
import { seedTests } from '../../data/seedData';

const RELATED = {
  'Complete Blood Count (CBC)': ['HbA1c', 'Lipid Profile', 'Vitamin D Total'],
  'HbA1c': ['Lipid Profile', 'Liver Function Test (LFT)', 'Kidney Function Test (KFT)'],
  'Thyroid Profile (T3, T4, TSH)': ['Vitamin D Total', 'Vitamin B12', 'Iron Studies'],
};

const PACKAGE_UPGRADES = [
  { name: 'Executive Health Checkup', tests: 78, price: 1999, mrp: 4999, includes: ['All selected tests', '18 additional tests', 'ECG', 'Doctor Consultation'] },
];

function itemTotal(i) { return (i.offerPrice || i.price) * (i.qty || 1); }

export default function CartDrawer() {
  const { items, cartOpen, setCartOpen, removeItem, updateQty, coupon, discount, applyCoupon, getTotal, clearCart } = useCartStore();
  const { subtotal, discount: discAmt, total } = getTotal();
  const [couponVal, setCouponVal] = React.useState('');
  const [couponMsg, setCouponMsg] = React.useState('');

  const testNames = items.map(i => {
    const t = seedTests.find(s => s.name === i.name || s.id === i.id);
    return t ? t.name : i.name;
  });

  const recommendations = [];
  testNames.forEach(n => {
    const rel = RELATED[n];
    if (rel) rel.forEach(r => { if (!testNames.includes(r) && !recommendations.includes(r)) recommendations.push(r); });
  });

  const recTests = recommendations.slice(0, 3).map(name => seedTests.find(t => t.name === name)).filter(Boolean);

  const handleCoupon = () => {
    if (applyCoupon(couponVal)) { setCouponMsg('Coupon applied!'); setCouponVal(''); }
    else setCouponMsg('Invalid coupon code');
    setTimeout(() => setCouponMsg(''), 3000);
  };

  if (!cartOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000 }}>
      <div onClick={() => setCartOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 420, background: '#fff', boxShadow: '-4px 0 24px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', zIndex: 1, animation: 'cartSlideIn 0.25s ease' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #e8edf2', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <span style={{ fontSize: 18, marginRight: 6 }}>🛒</span>
            <span style={{ fontSize: 15, fontWeight: 700 }}>Your Cart ({items.length})</span>
          </div>
          <button onClick={() => setCartOpen(false)} style={{ background: '#f5f6fa', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🛒</div>
              <p style={{ fontSize: 13, marginBottom: 12 }}>Your cart is empty</p>
              <Link to="/diagnostics" onClick={() => setCartOpen(false)} className="btn btn-primary">Browse Tests</Link>
            </div>
          ) : (
            <>
              {items.map(i => {
                const test = seedTests.find(t => t.name === i.name || t.id === i.id);
                return (
                  <div key={`${i.id}-${i.type}`} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                    <div style={{ fontSize: 24, flexShrink: 0, paddingTop: 2 }}>🩸</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', marginBottom: 2 }}>{i.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 4 }}>
                        {test?.report_time && <span>⏱ {test.report_time} · </span>}
                        {test?.fasting_required ? <span style={{ color: '#E65100' }}>🕐 Fasting</span> : <span style={{ color: '#16a34a' }}>✅ No Fasting</span>}
                        {test?.preparation_instructions && <span> · 📋 {test.preparation_instructions.substring(0, 30)}...</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid #d0d5dd', borderRadius: 6, overflow: 'hidden' }}>
                          <button onClick={() => { if ((i.qty || 1) <= 1) removeItem(i.id, i.type); else updateQty(i.id, i.type, (i.qty || 1) - 1); }} style={{ border: 'none', background: '#f5f6fa', padding: '4px 8px', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>−</button>
                          <span style={{ padding: '4px 10px', fontSize: 12, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{i.qty || 1}</span>
                          <button onClick={() => updateQty(i.id, i.type, (i.qty || 1) + 1)} style={{ border: 'none', background: '#f5f6fa', padding: '4px 8px', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>+</button>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#1866C9' }}>₹{itemTotal(i).toLocaleString()}</span>
                        <button onClick={() => removeItem(i.id, i.type)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>🗑️</button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {recTests.length > 0 && (
                <div style={{ marginTop: 16, background: '#F5FAFF', borderRadius: 12, padding: '12px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#1866C9', marginBottom: 8 }}>⚡ Frequently Added Together</div>
                  {recTests.map(t => (
                    <div key={t.name} onClick={() => { const s = useCartStore.getState(); s.addItem({ id: t.id, name: t.name, price: t.price || t.mrp, offerPrice: t.offerPrice, type: 'test' }); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', cursor: 'pointer' }}>
                      <span style={{ width: 16, height: 16, borderRadius: 4, border: '2px solid #1866C9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#1866C9' }}>+</span>
                      <span style={{ fontSize: 12, flex: 1 }}>{t.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#1866C9' }}>₹{t.offerPrice || t.price}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 16, background: '#FFF8E1', borderRadius: 12, padding: '12px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#E65100', marginBottom: 8 }}>⭐ Smart Savings</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>Upgrade to <strong>Executive Health Checkup</strong> — includes all selected tests + 18 more at a lower price.</div>
                <Link to="/services" onClick={() => setCartOpen(false)} style={{ fontSize: 11, fontWeight: 600, color: '#E65100', textDecoration: 'none' }}>View Package →</Link>
              </div>

              <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
                <input value={couponVal} onChange={e => setCouponVal(e.target.value.toUpperCase())} placeholder="Promo Code" style={{ flex: 1, border: '1px solid #d0d5dd', borderRadius: 8, padding: '8px 10px', fontSize: 11, outline: 'none', fontFamily: 'inherit' }} />
                <button onClick={handleCoupon} style={{ padding: '8px 14px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>Apply</button>
              </div>
              {couponMsg && <div style={{ fontSize: 10, color: couponMsg === 'Coupon applied!' ? '#16a34a' : '#dc2626', marginTop: 4 }}>{couponMsg}</div>}
            </>
          )}
        </div>

        {items.length > 0 && (
          <div style={{ borderTop: '1px solid #e8edf2', padding: '14px 16px', flexShrink: 0, background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4, color: '#16a34a' }}><span>Home Collection</span><span>FREE</span></div>
            {discAmt > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4, color: '#dc2626' }}><span>Discount ({discount}%)</span><span>-₹{discAmt.toLocaleString()}</span></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, margin: '6px 0 10px', borderTop: '1px solid #e8edf2', paddingTop: 6 }}><span>Total</span><span>₹{total.toLocaleString()}</span></div>
            {discAmt > 0 && <div style={{ fontSize: 11, fontWeight: 600, color: '#16a34a', marginBottom: 8 }}>🎁 You Saved ₹{discAmt.toLocaleString()}</div>}
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/diagnostics" onClick={() => setCartOpen(false)} className="btn btn-outline" style={{ flex: 1, fontSize: 12, padding: '10px', textAlign: 'center' }}>Continue Shopping</Link>
              <Link to="/checkout" onClick={() => setCartOpen(false)} className="btn btn-primary" style={{ flex: 1, fontSize: 12, padding: '10px', textAlign: 'center' }}>Proceed to Book →</Link>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes cartSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </div>
  );
}
