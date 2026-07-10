import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { therapists, physioCategories } from '../data/physiotherapyData';

const C = {
  primary: '#0D9488',
  primaryLight: '#CCFBF1',
  accent: '#F59E0B',
  heroFrom: '#0D9488',
  heroTo: '#14B8A6',
  heroMid: '#2DD4BF',
};

export default function PhysioTherapist() {
  const t = useT();
  const { id } = useParams();
  const therapist = therapists.find(th => th.id === Number(id));
  const [selectedSlot, setSelectedSlot] = useState(null);

  if (!therapist) {
    return (
      <div className="page-section container" style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{'👨‍⚕️'}</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{t('therapist.not.found', 'Therapist Not Found')}</h2>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>{t('therapist.not.found.desc', 'The therapist you are looking for does not exist.')}</p>
        <Link to="/physiotherapy" style={{ textDecoration: 'none' }}>
          <span style={{ display: 'inline-block', height: 44, lineHeight: '44px', padding: '0 24px', borderRadius: 8, background: C.primary, color: '#fff', fontSize: 13, fontWeight: 700 }}>{t('back.to.physiotherapy')} →</span>
        </Link>
      </div>
    );
  }

  const modeIcons = { home: '🏠', clinic: '🏥', online: '💻' };
  const modeLabels = { home: t('home', 'Home'), clinic: t('clinic', 'Clinic'), online: t('online', 'Online') };

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${C.heroFrom} 0%, ${C.heroMid} 50%, ${C.heroTo} 100%)`, padding: '28px 0 32px' }}>
        <div className="container">
          <Link to="/physiotherapy" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textDecoration: 'none', display: 'inline-block', marginBottom: 10 }}>← {t('back.to.physiotherapy', 'Back to Physiotherapy')}</Link>
        </div>
      </div>

      <div className="page-section container">
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: 80 }}>
            <div style={{ padding: 20, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff', textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, margin: '0 auto 12px' }}>{therapist.image}</div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>{therapist.name}</h2>
              <p style={{ fontSize: 13, color: C.primary, fontWeight: 600, margin: '0 0 12px' }}>{therapist.qualifications}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 12, fontSize: 13 }}>
                <span style={{ color: '#F59E0B', fontWeight: 700 }}>★ {therapist.rating}</span>
                <span style={{ color: '#64748b' }}>{therapist.experience} {t('years.exp', 'yrs')}</span>
                <span style={{ color: '#059669', fontWeight: 600 }}>{therapist.sessions} {t('sessions', 'sessions')}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center', marginBottom: 12 }}>
                {(therapist.mode || []).map(m => (
                  <span key={m} style={{ padding: '3px 10px', borderRadius: 16, background: '#F0FDF4', color: '#166534', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    {modeIcons[m]} {modeLabels[m]}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                <strong>{t('languages', 'Languages')}:</strong> {(therapist.languages || []).join(', ')}
              </div>
              <Link to={`/physiotherapy/book?therapist=${therapist.id}`} style={{ display: 'block', height: 48, lineHeight: '48px', borderRadius: 8, background: C.accent, color: '#fff', textDecoration: 'none', fontSize: 16, fontWeight: 700 }}>
                {t('book.appointment', 'Book Appointment')} →
              </Link>
            </div>
          </div>

          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px', color: '#0f172a' }}>{therapist.name}</h1>
            <p style={{ fontSize: 14, color: '#475569', margin: '0 0 20px', lineHeight: 1.6 }}>
              {t('therapist.profile.desc', 'Experienced physiotherapist specializing in')} {(therapist.specialties || []).join(', ')}.
            </p>

            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: '#0f172a' }}>{t('specialties', 'Specialties')}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(therapist.specialties || []).map(s => (
                  <span key={s} style={{ padding: '6px 14px', borderRadius: 8, background: C.primaryLight, color: C.primary, fontSize: 12, fontWeight: 600 }}>{s}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: '#0f172a' }}>{t('availability', 'Availability')}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(therapist.availability || []).map(slot => (
                  <button key={slot} onClick={() => setSelectedSlot(slot)}
                    style={{ padding: '10px 18px', borderRadius: 10, border: selectedSlot === slot ? `2px solid ${C.primary}` : '1px solid #e2e8f0', background: selectedSlot === slot ? C.primaryLight : '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: selectedSlot === slot ? 700 : 500, color: '#0f172a', transition: 'all 0.15s' }}>
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: '#0f172a' }}>{t('categories.title', 'Treatment Categories')}</h3>
              <div style={{ display: 'grid', gap: 8 }}>
                {physioCategories.filter(c => (therapist.specialties || []).some(s => c.conditions.includes(s) || c.treatments.includes(s))).slice(0, 4).map(c => (
                  <div key={c.id} style={{ padding: '12px 16px', borderRadius: 10, border: `1px solid ${c.color}20`, background: `${c.color}06`, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 24 }}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{c.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .page-section { padding: 20px 12px !important; }
          div[style*="grid-template-columns: 300px 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="position: sticky"] { position: static !important; }
        }
      `}</style>
    </div>
  );
}
