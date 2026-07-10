import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { nurses, nurseLevels, nursingCategories, nursingServices, nurseCRMStages } from '../data/nursingData';

const C = { primary: '#7C3AED', accent: '#EC4899', bg: '#F5F3FF' };

const REVIEWS_KEY = 'jh_service_reviews';

function loadReviews() {
  try { return JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]'); } catch { return []; }
}

const SAMPLE_REVIEWS = [
  { id: 1, patient: 'Ramesh K.', rating: 5, text: 'Excellent care and very professional. Highly recommend!', date: '2 weeks ago' },
  { id: 2, patient: 'Srinivas R.', rating: 5, text: 'Very compassionate and skilled. Made my recovery much easier.', date: '1 month ago' },
  { id: 3, patient: 'Lakshmi P.', rating: 4, text: 'Good experience. Punctual and knowledgeable.', date: '2 months ago' },
];

export default function NurseProfile() {
  const t = useT();
  const { slug } = useParams();

  const nurse = useMemo(() => nurses.find(n => n.slug === slug), [slug]);
  const level = useMemo(() => nurseLevels.find(l => l.id === nurse?.level), [nurse]);
  const specialties = useMemo(() =>
    (nurse?.specialties || []).map(s => nursingCategories.find(c => c.slug === s)).filter(Boolean),
    [nurse]
  );
  const services = useMemo(() =>
    (nurse?.specialties || []).flatMap(s => nursingServices.filter(svc => svc.category === s)),
    [nurse]
  );

  if (!nurse) {
    return (
      <div className="page-section container" style={{ maxWidth: 600, textAlign: 'center', paddingTop: 60 }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🔍</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{t('nurse.not.found', 'Nurse Not Found')}</h2>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>{t('nurse.not.found.desc', 'The nurse profile you are looking for does not exist.')}</p>
        <Link to="/nurse-at-home" style={{ padding: '10px 24px', borderRadius: 8, background: C.primary, color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>← {t('nurse.back', 'Back to Nurse at Home')}</Link>
      </div>
    );
  }

  const hourlyRate = level?.hourlyRate || 599;
  const sessionRate = level ? level.hourlyRate + 200 : 799;
  const allReviews = [...loadReviews(), ...SAMPLE_REVIEWS];

  return (
    <div className="page-section container" style={{ maxWidth: 720 }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${C.primary}, #A78BFA)`, margin: '-32px -24px 24px', padding: '32px 24px 28px', borderRadius: '0 0 24px 24px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 72, lineHeight: 1, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>{nurse.image}</div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 2px' }}>{nurse.name}</h1>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 4 }}>
              {nurse.qualifications} · {nurse.experience} {t('nurse.profile.years', 'years')}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {level && <span style={{ padding: '3px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 700 }}>{level.name}</span>}
              {nurse.verified && <span style={{ padding: '3px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 700 }}>✅ {t('nurse.verified', 'Verified')}</span>}
              {nurse.policeVerified && <span style={{ padding: '3px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 700 }}>🛡️ {t('nurse.police.verified', 'Police Verified')}</span>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center', flex: 1, padding: '8px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.15)' }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>⭐ {nurse.rating}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{t('nurse.profile.rating', 'Rating')}</div>
          </div>
          <div style={{ textAlign: 'center', flex: 1, padding: '8px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.15)' }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{nurse.sessions.toLocaleString()}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{t('nurse.profile.sessions', 'Sessions')}</div>
          </div>
          <div style={{ textAlign: 'center', flex: 1, padding: '8px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.15)' }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{nurse.experience}+</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{t('nurse.profile.years.exp', 'Years Exp')}</div>
          </div>
          <div style={{ textAlign: 'center', flex: 1, padding: '8px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.15)' }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>₹{hourlyRate}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{t('nurse.profile.hourly', '/hr')}</div>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div style={{ padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', marginBottom: 14 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>{t('nurse.profile.about', 'About')}</h3>
        <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>{nurse.bio}</p>
      </div>

      {/* Certifications */}
      {nurse.certs?.length > 0 && (
        <div style={{ padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', marginBottom: 14 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px', color: '#0f172a' }}>📜 {t('nurse.profile.certs', 'Certifications')}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {nurse.certs.map((c, i) => (
              <span key={i} style={{ padding: '5px 12px', borderRadius: 8, background: C.bg, border: `1px solid ${C.primary}20`, fontSize: 11, fontWeight: 600, color: C.primary }}>✓ {c}</span>
            ))}
          </div>
        </div>
      )}

      {/* Specialties */}
      <div style={{ padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', marginBottom: 14 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px', color: '#0f172a' }}>🩺 {t('nurse.profile.specialties', 'Specialties')}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {specialties.map(cat => (
            <span key={cat.slug} style={{ padding: '5px 12px', borderRadius: 8, background: `${cat.color}10`, border: `1px solid ${cat.color}30`, fontSize: 11, fontWeight: 600, color: cat.color }}>
              {cat.icon} {cat.name}
            </span>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div style={{ padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', marginBottom: 14 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px', color: '#0f172a' }}>📅 {t('nurse.profile.availability', 'Availability')}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {nurse.availability.map((a, i) => (
            <span key={i} style={{ padding: '6px 14px', borderRadius: 8, background: '#fefce8', border: '1px solid #fde68a', fontSize: 12, fontWeight: 600, color: '#92400e' }}>📅 {a}</span>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div style={{ padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', marginBottom: 14 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px', color: '#0f172a' }}>🗣️ {t('nurse.profile.languages', 'Languages')}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {nurse.languages.map((lang, i) => (
            <span key={i} style={{ padding: '5px 12px', borderRadius: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: 11, fontWeight: 600, color: '#166534' }}>{lang}</span>
          ))}
        </div>
      </div>

      {/* Services this nurse can provide */}
      {services.length > 0 && (
        <div style={{ padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', marginBottom: 14 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px', color: '#0f172a' }}>💼 {t('nurse.profile.services', 'Services Offered')}</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {services.slice(0, 8).map(svc => {
              const cat = nursingCategories.find(c => c.slug === svc.category);
              return (
                <Link key={svc.id} to={`/nurse-at-home/service/${svc.slug}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', textDecoration: 'none', background: '#f8fafc' }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{svc.name}</span>
                    {cat && <span style={{ marginLeft: 6, fontSize: 10, color: '#64748b' }}>{cat.icon}</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: C.primary }}>₹{svc.price}</span>
                    <span style={{ color: '#94a3b8', fontSize: 10 }}>{svc.duration}</span>
                    <span style={{ color: C.primary, fontSize: 11, fontWeight: 600 }}>→</span>
                  </div>
                </Link>
              );
            })}
          </div>
          {services.length > 8 && (
            <Link to="/nurse-at-home/services" style={{ display: 'block', textAlign: 'center', marginTop: 8, fontSize: 12, color: C.primary, fontWeight: 600, textDecoration: 'none' }}>
              +{services.length - 8} {t('nurse.profile.more', 'more services')} →
            </Link>
          )}
        </div>
      )}

      {/* Reviews */}
      <div style={{ padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', marginBottom: 14 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px', color: '#0f172a' }}>⭐ {t('nurse.profile.reviews', 'Patient Reviews')}</h3>
        <div style={{ display: 'grid', gap: 10 }}>
          {allReviews.map(r => (
            <div key={r.id} style={{ padding: 10, borderRadius: 8, background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{r.patient}</span>
                <span style={{ fontSize: 10, color: '#94a3b8' }}>{r.date}</span>
              </div>
              <div style={{ fontSize: 11, color: '#f59e0b', marginBottom: 3 }}>{'⭐'.repeat(r.rating)}</div>
              <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.4 }}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Link to={`/nurse-at-home/book?nurse=${nurse.slug}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 10, background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, color: '#fff', textDecoration: 'none', fontSize: 15, fontWeight: 700, boxShadow: `0 4px 14px ${C.primary}40` }}>
          📋 {t('nurse.profile.book', 'Book')} {nurse.name.split(' ').slice(-1)[0]}
        </Link>
        <p style={{ fontSize: 11, color: '#64748b', marginTop: 8 }}>
          {t('nurse.profile.rate', 'Rate')}: ₹{sessionRate}/{t('nurse.profile.session', 'session')} · {t('nurse.profile.free.cancel', 'Free cancellation')}
        </p>
      </div>
    </div>
  );
}
