import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import { categoryList, makeSlug } from '../data/seedData';
import { useT } from '../i18n/LanguageProvider';

const BADGES = ['Most Booked', 'Recommended', 'Trending'];
const BADGE_STYLES = {
  'Most Booked': { bg: '#fef3c7', color: '#92400e' },
  'Recommended': { bg: '#dbeafe', color: '#1e40af' },
  'Trending': { bg: '#fce7f3', color: '#9d174d' },
};

export default function TestCard({ test, badge, showActions = true }) {
  const t = useT();
  const navigate = useNavigate();
  const addItem = useCartStore(s => s.addItem);
  const [added, setAdded] = useState(false);

  const cat = categoryList.find(c => c.name === test.category) || {};
  const icon = cat.icon || '🔬';
  const color = cat.color || '#1866C9';
  const offerPrice = Number(test.offerPrice || test.price) || 0;
  const mrp = Number(test.mrp) || 0;
  const hasDiscount = mrp > offerPrice && offerPrice > 0;
  const badgeText = badge || BADGES[Math.abs(Number(test.id) || 0) % BADGES.length];
  const badgeStyle = BADGE_STYLES[badgeText] || BADGE_STYLES['Most Booked'];
  const slug = makeSlug(test.name);
  const prep = (test.preparation_instructions || '').trim();
  const shortPrep = prep.length > 48 ? `${prep.slice(0, 48)}…` : prep;

  const cartPayload = {
    id: test.id,
    name: test.name,
    price: test.price,
    offerPrice: test.offerPrice || test.price,
    type: 'test',
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem(cartPayload);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleBook = (e) => {
    e.stopPropagation();
    addItem(cartPayload);
    navigate('/checkout');
  };

  return (
    <div
      className="test-card-pro"
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/test/${slug}`)}
      onKeyDown={e => { if (e.key === 'Enter') navigate(`/test/${slug}`); }}
      style={{
        background: '#fff',
        borderRadius: 14,
        border: '1px solid #e8edf2',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        height: '100%',
        minHeight: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(24, 102, 201, 0.12)';
        e.currentTarget.style.borderColor = '#c7d7f0';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#e8edf2';
        e.currentTarget.style.transform = 'none';
      }}
    >
      <div style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`, padding: '12px 14px', position: 'relative', minHeight: 72 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <span style={{ fontSize: 26, lineHeight: 1 }} aria-hidden>{icon}</span>
          <span style={{ background: badgeStyle.bg, color: badgeStyle.color, fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.3px', flexShrink: 0 }}>
            {badgeText}
          </span>
        </div>
        {test.category && (
          <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.22)', padding: '2px 8px', borderRadius: 4, fontSize: 10, color: '#fff', fontWeight: 600, maxWidth: '100%' }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{test.category}</span>
          </div>
        )}
      </div>

      <div style={{ padding: '12px 14px 14px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <h3 style={{
          fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 8px', lineHeight: 1.35,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.7em',
        }}>
          {test.name}
        </h3>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#1866C9' }}>₹{offerPrice.toLocaleString('en-IN')}</span>
          {hasDiscount && (
            <span style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>₹{mrp.toLocaleString('en-IN')}</span>
          )}
          {hasDiscount && (
            <span style={{ fontSize: 10, fontWeight: 700, color: '#16a34a', background: '#f0fdf4', padding: '1px 6px', borderRadius: 4 }}>
              {Math.round((1 - offerPrice / mrp) * 100)}% off
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#475569' }}>
            <span aria-hidden>🚚</span>
            <span>{t('testCard.freeHomeCollection', 'Free Home Collection')}</span>
          </div>
          {test.report_time && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#475569' }}>
              <span aria-hidden>⏱️</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{test.report_time}</span>
            </div>
          )}
          {shortPrep && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 11, color: '#64748b' }}>
              <span aria-hidden style={{ flexShrink: 0 }}>📋</span>
              <span style={{ lineHeight: 1.35 }}>{shortPrep}</span>
            </div>
          )}
        </div>

        {showActions && (
          <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }} onClick={e => e.stopPropagation()}>
            <button
              type="button"
              onClick={handleBook}
              style={{
                flex: 1, padding: '10px 0', background: '#1866C9', color: '#fff', border: 'none',
                borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', minHeight: 40,
              }}
            >
              {t('testCard.bookNow', 'Book Now')}
            </button>
            <button
              type="button"
              onClick={handleAdd}
              style={{
                padding: '10px 14px', background: added ? '#dcfce7' : '#f8fafc', color: added ? '#166534' : '#334155',
                border: `1px solid ${added ? '#86efac' : '#e2e8f0'}`, borderRadius: 8, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', minHeight: 40, whiteSpace: 'nowrap',
              }}
            >
              {added ? t('testCard.added', '✓ Added') : t('testCard.add', '+ Cart')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
