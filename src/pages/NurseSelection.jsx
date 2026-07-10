import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';

const C = { primary: '#7C3AED', primaryLight: '#EDE9FE', accent: '#EC4899', bg: '#F5F3FF' };

const careTypes = [
  { id: 'visit', icon: '🩺', title: 'Nurse Visit', desc: 'One-time visit for specific procedures', price: '₹499+', color: '#3B82F6' },
  { id: '8hr', icon: '☀️', title: '8-Hour Care', desc: 'Day shift nursing support', price: '₹2,999', color: '#F59E0B' },
  { id: '12hr', icon: '🌙', title: '12-Hour Care', desc: 'Extended shift care', price: '₹4,499', color: '#8B5CF6' },
  { id: '24hr', icon: '⭐', title: '24-Hour ICU Care', desc: 'Round-the-clock critical care', price: '₹8,999', color: '#E11D48' },
  { id: 'icu', icon: '🆘', title: 'ICU Nurse at Home', desc: 'Ventilator, tracheostomy, central line care', price: '₹14,999', color: '#DC2626' },
  { id: 'elder', icon: '👴', title: 'Elder Care Nurse', desc: 'Dedicated senior care companion', price: '₹3,999', color: '#F59E0B' },
  { id: 'surgery', icon: '🏥', title: 'Post Surgery Nurse', desc: 'Recovery assistance after surgery', price: '₹999', color: '#8B5CF6' },
];

export default function NurseSelection() {
  const t = useT();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSelect = (type) => {
    setSelected(type);
    setShowConfirm(true);
  };

  const handleProceed = () => {
    if (selected) {
      navigate(`/nurse-at-home/book?plan=${selected.id}`);
    }
  };

  return (
    <div className="page-section container" style={{ maxWidth: 800 }}>
      <div style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.accent} 100%)`, margin: '-32px -24px 24px', padding: '32px 24px 28px', borderRadius: '0 0 24px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', color: '#fff' }}>{t('nurse.selection.title', 'What Care Do You Need?')}</h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: 0 }}>{t('nurse.selection.subtitle', 'Select the type of nursing care that best fits your needs')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
        {careTypes.map(type => (
          <button key={type.id} onClick={() => handleSelect(type)}
            style={{ padding: 20, borderRadius: 14, border: selected?.id === type.id ? `2px solid ${type.color}` : '1px solid #e2e8f0', background: selected?.id === type.id ? `${type.color}08` : '#fff', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center', transition: 'all 0.15s' }}>
            <div style={{ fontSize: 36, marginBottom: 6 }}>{type.icon}</div>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 2px', color: '#0f172a' }}>{type.title}</h3>
            <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 4px' }}>{type.desc}</p>
            <div style={{ fontSize: 20, fontWeight: 800, color: type.color }}>{type.price}</div>
          </button>
        ))}
      </div>

      {showConfirm && selected && (
        <div style={{ marginTop: 20, padding: 20, borderRadius: 12, background: C.bg, border: `1px solid ${C.primaryLight}`, textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 6 }}>{selected.icon}</div>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{t('nurse.selection.selected', 'You selected')}: {selected.title}</h3>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 14px' }}>{selected.desc} — {selected.price}</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={handleProceed} style={{ height: 44, padding: '0 28px', borderRadius: 8, border: 'none', background: C.primary, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              {t('nurse.selection.proceed', 'Proceed to Book')} →
            </button>
            <button onClick={() => { setShowConfirm(false); setSelected(null); }} style={{ height: 44, padding: '0 20px', borderRadius: 8, border: '1px solid #d0d5dd', background: '#fff', color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {t('nurse.selection.change', 'Change Selection')}
            </button>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Link to="/nurse-at-home" style={{ fontSize: 12, color: C.primary, fontWeight: 600, textDecoration: 'none' }}>← {t('nurse.back', 'Back to Nurse at Home')}</Link>
      </div>
    </div>
  );
}
