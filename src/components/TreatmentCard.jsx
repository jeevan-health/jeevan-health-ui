import { useNavigate } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';

const BADGES = ['Popular', 'Recommended', 'Most Booked'];
const BADGE_STYLES = {
  'Popular': { bg: '#fef3c7', color: '#92400e' },
  'Recommended': { bg: '#dbeafe', color: '#1e40af' },
  'Most Booked': { bg: '#fce7f3', color: '#9d174d' },
};

export default function TreatmentCard({ treatment, searchQuery, showActions = true }) {
  const t = useT();
  const navigate = useNavigate();
  const color = treatment.color || '#0D9488';
  const hasDiscount = treatment.originalPrice && treatment.originalPrice !== treatment.price;
  const badgeText = BADGES[Math.abs(treatment.id || 0) % BADGES.length];
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
      onClick={() => navigate(`/physiotherapy/treatment/${treatment.slug}`)}
    >
      <div style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`, padding: '14px 16px 10px', position: 'relative', minHeight: 60 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 28 }}>{treatment.icon || ''}</span>
          <span style={{ background: badgeStyle.bg, color: badgeStyle.color, fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{t('treatmentCard.badge', badgeText)}</span>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 4, fontSize: 10, color: '#fff', fontWeight: 600 }}>
          <span style={{ fontSize: 10 }}>{treatment.icon || '💪'}</span>
          <span>{treatment.category}</span>
        </div>
      </div>
      <div style={{ padding: '12px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px', lineHeight: 1.3 }}>{treatment.name}</h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#0D9488' }}>₹{treatment.price}</span>
          {hasDiscount && <span style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>₹{treatment.originalPrice}</span>}
        </div>
        {treatment.sessions && (
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8, fontWeight: 500 }}>
            {t('treatmentCard.sessions', '{count} sessions')}{treatment.sessions}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#555' }}><span>🏠</span><span>{t('treatmentCard.homeVisit', 'Home Visit Available')}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#555' }}><span>⏱️</span><span>{t('treatmentCard.duration', '45 min/session')}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#555' }}><span>📋</span><span>{t('treatmentCard.noPrep', 'No prep needed')}</span></div>
        </div>
        {treatment.treatments && treatment.treatments.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
            {treatment.treatments.slice(0, 3).map((tr, i) => (
              <span key={i} style={{ background: `${color}18`, color: color, fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 10 }}>{tr}</span>
            ))}
          </div>
        )}
        {showActions && (
          <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => navigate(`/physiotherapy/book?treatment=${treatment.slug}`)}
              style={{ flex: 1, padding: '8px 0', background: '#0D9488', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
            >{t('treatmentCard.bookNow', 'Book Now')}</button>
            <button
              onClick={() => navigate(`/physiotherapy/treatment/${treatment.slug}`)}
              style={{ padding: '8px 12px', background: '#f8f9fa', color: '#555', border: '1px solid #e0e3eb', borderRadius: 8, fontSize: 11, fontWeight: 500, cursor: 'pointer' }}
            >{t('treatmentCard.viewDetails', 'View Details')}</button>
          </div>
        )}
      </div>
    </div>
  );
}
