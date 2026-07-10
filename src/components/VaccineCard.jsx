import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { vaccineCategories } from '../data/vaccinationData';

const BADGES = ['Most Booked', 'Recommended', 'Trending'];
const BADGE_STYLES = {
  'Most Booked': { bg: '#fef3c7', color: '#92400e' },
  'Recommended': { bg: '#dbeafe', color: '#1e40af' },
  'Trending': { bg: '#fce7f3', color: '#9d174d' },
};

export default function VaccineCard({ vaccine, badge, showActions = true }) {
  const t = useT();
  const catMeta = vaccineCategories.find(c => c.id === vaccine.category) || {};
  const icon = catMeta.icon || '💉';
  const color = catMeta.color || '#0891b2';
  const badgeText = badge || BADGES[Math.abs(vaccine.id || 0) % BADGES.length];
  const badgeStyle = BADGE_STYLES[badgeText] || BADGE_STYLES['Most Booked'];

  return (
    <Link to={`/vaccination/${vaccine.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div style={{
        background: '#fff', borderRadius: 14, border: '1px solid #e8edf2',
        overflow: 'hidden', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column', cursor: 'pointer',
      }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
      >
        <div style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`, padding: '14px 16px 10px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 28 }}>{icon}</span>
            <span style={{ background: badgeStyle.bg, color: badgeStyle.color, fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{badgeText}</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 4, fontSize: 10, color: '#fff', fontWeight: 600 }}>
            <span style={{ fontSize: 10 }}>{icon}</span>
            <span>{catMeta.name || vaccine.category}</span>
          </div>
        </div>
        <div style={{ padding: '12px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px', lineHeight: 1.3 }}>{vaccine.name}</h3>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>{vaccine.disease}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#1866C9' }}>₹{vaccine.price}</span>
            <span style={{ fontSize: 11, color: '#64748b' }}>{t('per.dose', '/ dose')}</span>
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
            <span style={{ background: '#f0f9ff', color: '#0369a1', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4 }}>{vaccine.ageGroup}</span>
            <span style={{ background: '#f0fdf4', color: '#15803d', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4 }}>{vaccine.doseCount} Dose{vaccine.doseCount > 1 ? 's' : ''}</span>
            <span style={{ background: '#fef2f2', color: '#b91c1c', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4 }}>{vaccine.availability}</span>
          </div>
          <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{vaccine.description}</p>
          {showActions && (
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }} onClick={e => e.stopPropagation()}>
              <div style={{ flex: 1, padding: '8px 0', background: '#1866C9', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>{t('view.details')}</div>
              <div style={{ padding: '8px 12px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 8, fontSize: 11, fontWeight: 600, textAlign: 'center' }}>{t('book.now')}</div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
