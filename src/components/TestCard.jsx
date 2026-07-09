import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import { categoryMeta, makeSlug } from '../data/seedData';

const BADGES = ['Most Booked', 'Recommended', 'Trending'];
const BADGE_STYLES = {
  'Most Booked': { bg: '#fef3c7', color: '#92400e' },
  'Recommended': { bg: '#dbeafe', color: '#1e40af' },
  'Trending': { bg: '#fce7f3', color: '#9d174d' },
};

export default function TestCard({ test, badge, showActions = true, searchQuery }) {
  const navigate = useNavigate();
  const addItem = useCartStore(s => s.addItem);
  const catMeta = categoryMeta[test.category] || {};
  const icon = catMeta.icon || '🔬';
  const color = catMeta.color || '#1866C9';
  const offerPrice = test.offerPrice || test.price;
  const hasDiscount = test.mrp && test.mrp !== offerPrice;
  const badgeText = badge || BADGES[Math.abs(test.id || 0) % BADGES.length];
  const badgeStyle = BADGE_STYLES[badgeText] || BADGE_STYLES['Most Booked'];

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 14,
        border: '1px solid #e8edf2',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      }}
      onClick={() => navigate(`/test/${makeSlug(test.name)}`)}
    >
      <div style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`, padding: '14px 16px 10px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 28 }}>{icon}</span>
          <span style={{ background: badgeStyle.bg, color: badgeStyle.color, fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{badgeText}</span>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 4, fontSize: 10, color: '#fff', fontWeight: 600 }}>
          <span style={{ fontSize: 10 }}>🔬</span>
          <span>{test.category}</span>
        </div>
      </div>
      <div style={{ padding: '12px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.3 }}>{test.name}</h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#1866C9' }}>₹{offerPrice}</span>
          {hasDiscount && <span style={{ fontSize: 12, color: '#999', textDecoration: 'line-through' }}>₹{test.mrp}</span>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#555' }}><span>🚚</span><span>Free Home Collection</span></div>
          {test.report_time && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#555' }}><span>⏱️</span><span>{test.report_time}</span></div>}
          {test.preparation_instructions && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#555' }}><span>📋</span><span style={{ lineHeight: 1.3 }}>{test.preparation_instructions}</span></div>}
        </div>
        {showActions && (
          <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => { addItem({ id: test.id, name: test.name, price: test.price, offerPrice: test.offerPrice, type: 'test' }); navigate('/checkout'); }}
              style={{ flex: 1, padding: '8px 0', background: '#1866C9', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >Book Now</button>
            <button
              onClick={() => alert('Compare feature coming soon')}
              style={{ padding: '8px 12px', background: '#f8f9fa', color: '#555', border: '1px solid #e0e3eb', borderRadius: 8, fontSize: 11, fontWeight: 500, cursor: 'pointer' }}
            >Compare</button>
            <button
              onClick={() => { addItem({ id: test.id, name: test.name, price: test.price, offerPrice: test.offerPrice, type: 'test' }); }}
              style={{ padding: '8px 12px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
            >+ Add</button>
          </div>
        )}
      </div>
    </div>
  );
}
