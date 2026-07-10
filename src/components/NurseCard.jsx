import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { nursingCategories } from '../data/nursingData';

export default function NurseCard({ nurse, compact = false }) {
  const t = useT();

  const catLabel = (id) => {
    const cat = nursingCategories.find(c => c.id === id);
    return cat ? cat.name : id;
  };

  if (compact) {
    return (
      <div style={{
        background: '#fff',
        borderRadius: 10,
        border: '1px solid #e2e8f0',
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <span style={{ fontSize: 28 }}>{nurse.image || '👩‍⚕️'}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{nurse.name}</div>
          <div style={{ fontSize: 11, color: '#f59e0b' }}>⭐ {nurse.rating}</div>
        </div>
        <Link
          to={`/nursing-care/book?nurse=${nurse.id}`}
          style={{
            padding: '6px 12px',
            background: '#0D9488',
            color: '#fff',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 700,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >{t('nurseCard.bookNow', 'Book Now')}</Link>
      </div>
    );
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      transition: 'all 0.25s',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 40 }}>{nurse.image || '👩‍⚕️'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{nurse.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#f59e0b', fontWeight: 600 }}>
              <span>⭐</span>
              <span>{nurse.rating}</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: '#64748b' }}>
            <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{nurse.qualifications}</span>
          </div>
          <div style={{ fontSize: 11, color: '#64748b' }}>
            {t('nurseCard.experience', '{yrs} yrs exp')}{nurse.experience}
          </div>
          <div style={{ fontSize: 11, color: '#64748b' }}>
            {t('nurseCard.sessions', '{n} sessions')}{nurse.sessions}
          </div>
        </div>
        {nurse.languages && nurse.languages.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
            {nurse.languages.map((lang, i) => (
              <span key={i} style={{ background: '#f0f9ff', color: '#0369a1', fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 10 }}>{lang}</span>
            ))}
          </div>
        )}
        {nurse.specialties && nurse.specialties.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
            {nurse.specialties.map((sp, i) => (
              <span key={i} style={{ background: '#f0fdf4', color: '#15803d', fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 4 }}>{catLabel(sp)}</span>
            ))}
          </div>
        )}
        {nurse.availability && nurse.availability.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
            {nurse.availability.slice(0, 3).map((slot, i) => (
              <span key={i} style={{ background: '#fef2f2', color: '#b91c1c', fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 4 }}>{slot}</span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 6 }}>
          <Link
            to={`/nursing-care/nurse/${nurse.id}`}
            style={{
              flex: 1,
              padding: '8px 0',
              background: '#f8f9fa',
              color: '#555',
              border: '1px solid #e0e3eb',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 500,
              textAlign: 'center',
              textDecoration: 'none',
            }}
          >{t('nurseCard.viewProfile', 'View Profile')}</Link>
          <Link
            to={`/nursing-care/book?nurse=${nurse.id}`}
            style={{
              flex: 1,
              padding: '8px 0',
              background: '#0D9488',
              color: '#fff',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              textAlign: 'center',
              textDecoration: 'none',
            }}
          >{t('nurseCard.bookNow', 'Book Now')}</Link>
        </div>
      </div>
    </div>
  );
}
