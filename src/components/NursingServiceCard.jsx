import { useNavigate } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { nursingCategories } from '../data/nursingData';

const BADGES = ['Popular', 'Recommended', 'Most Booked'];
const BADGE_STYLES = {
  'Popular': { bg: '#fef3c7', color: '#92400e' },
  'Recommended': { bg: '#dbeafe', color: '#1e40af' },
  'Most Booked': { bg: '#fce7f3', color: '#9d174d' },
};

export default function NursingServiceCard({ service, searchQuery, showActions = true }) {
  const t = useT();
  const navigate = useNavigate();
  const catMeta = nursingCategories.find(c => c.id === service.category) || {};
  const color = catMeta.color || '#0D9488';
  const icon = catMeta.icon || '🩹';
  const hasDiscount = service.originalPrice && service.originalPrice !== service.price;
  const badgeText = BADGES[Math.abs(service.id || 0) % BADGES.length];
  const badgeStyle = BADGE_STYLES[badgeText] || BADGE_STYLES['Popular'];

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        transition: 'all 0.25s',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
      onClick={() => navigate(`/nursing-care/service/${service.slug}`)}
    >
      <div style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`, padding: '14px 16px 10px', position: 'relative', minHeight: 60 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 28 }}>{icon}</span>
          <span style={{ background: badgeStyle.bg, color: badgeStyle.color, fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{t('serviceCard.badge', badgeText)}</span>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 4, fontSize: 10, color: '#fff', fontWeight: 600 }}>
          <span style={{ fontSize: 10 }}>{icon}</span>
          <span>{catMeta.name || service.category}</span>
        </div>
      </div>
      <div style={{ padding: '12px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.3 }}>{service.name}</h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: color }}>₹{service.price}</span>
          {hasDiscount && <span style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>₹{service.originalPrice}</span>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#555' }}><span>🏠</span><span>{t('serviceCard.homeVisit', 'Home Visit')}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#555' }}><span>⏱️</span><span>{service.duration}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#555' }}><span>👩‍⚕️</span><span>{service.nurseLevel}</span></div>
        </div>
        {service.includes && service.includes.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
            {service.includes.slice(0, 3).map((item, i) => (
              <span key={i} style={{ background: `${color}18`, color: color, fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 10 }}>{item}</span>
            ))}
          </div>
        )}
        {showActions && (
          <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => navigate(`/nursing-care/book?service=${service.slug}`)}
              style={{ flex: 1, padding: '8px 0', background: color, color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >{t('serviceCard.bookNow', 'Book Now')}</button>
            <button
              onClick={() => navigate(`/nursing-care/service/${service.slug}`)}
              style={{ padding: '8px 12px', background: '#f8f9fa', color: '#555', border: '1px solid #e0e3eb', borderRadius: 8, fontSize: 11, fontWeight: 500, cursor: 'pointer' }}
            >{t('serviceCard.viewDetails', 'View Details')}</button>
          </div>
        )}
      </div>
    </div>
  );
}
