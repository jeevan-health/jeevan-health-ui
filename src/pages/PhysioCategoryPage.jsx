import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import {
  physioCategories,
  therapists,
  physioPackages,
  STORAGE_KEYS,
} from '../data/physiotherapyData';

function getRecommendedPackage(category) {
  const catId = category?.id || '';
  const conds = (category?.conditions || []).join(' ').toLowerCase();
  const surgeryTerms = ['surgery', 'replacement', 'reconstruction', 'acl', 'fracture'];
  const painTerms = ['pain', 'injury', 'sports', 'arthritis', 'muscle'];
  if (catId.includes('surgery') || catId === 'orthopedic' || surgeryTerms.some(t => conds.includes(t))) {
    return physioPackages.find(p => p.id === 'surgery-recovery');
  }
  if (catId === 'geriatric' || catId === 'home') {
    return physioPackages.find(p => p.id === 'senior-care');
  }
  if (catId === 'sports' || painTerms.some(t => conds.includes(t))) {
    return physioPackages.find(p => p.id === 'pain-relief');
  }
  return physioPackages.find(p => p.id === 'basic');
}

export default function PhysioCategoryPage() {
  const t = useT();
  const { slug } = useParams();
  const category = physioCategories.find(c => c.slug === slug);
  const cat = category;

  if (!cat) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🔍</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px', color: '#0F172A' }}>
            {t('physio.category.notfound', 'Category Not Found')}
          </h1>
          <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 20px' }}>
            {t('physio.category.notfound.desc', 'The physiotherapy category you are looking for does not exist.')}
          </p>
          <Link to="/physiotherapy" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 24px', background: '#0D9488', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>
            ← {t('back.to.physiotherapy', 'Back to Physiotherapy')}
          </Link>
        </div>
      </div>
    );
  }

  const heroFrom = cat.color;
  const heroTo = cat.color + '99';
  const heroMid = cat.color + 'cc';
  const accent = '#F59E0B';

  const catConditionsLC = cat.conditions.map(c => c.toLowerCase());
  const relatedTherapists = therapists
    .filter(th => th.specialties.some(s => catConditionsLC.some(cc => s.toLowerCase().includes(cc) || cc.includes(s.toLowerCase()))))
    .slice(0, 4);

  const recommendedPkg = getRecommendedPackage(cat);
  const [expandedTreat, setExpandedTreat] = useState(false);

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${heroFrom} 0%, ${heroMid} 50%, ${heroTo} 100%)`, padding: '28px 0 36px', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/physiotherapy" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
            ← {t('back.to.physiotherapy', 'Back to Physiotherapy')}
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <span style={{ fontSize: 42 }}>{cat.icon}</span>
            <div>
              <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                {t(`physio.cat.${cat.id}.name`, cat.name)}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: '4px 0 0', maxWidth: 520 }}>
                {t(`physio.cat.${cat.id}.desc`, cat.description)}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 14px', textAlign: 'center', minWidth: 72 }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{cat.conditions.length}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>{t('conditions', 'Conditions')}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 14px', textAlign: 'center', minWidth: 72 }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{cat.treatments.length}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>{t('treatments', 'Treatments')}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 14px', textAlign: 'center', minWidth: 72 }}>
              <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>✓</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10 }}>{t('home.visit', 'Home Visit')}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-section" style={{ background: '#F0FDFA' }}>
        <div className="container">
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
            {t('physio.category.conditions', 'Conditions We Treat')}
          </h2>
          <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 16px' }}>
            {t('physio.category.conditions.sub', `Specialized care for ${cat.name} conditions`)}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10 }}>
            {cat.conditions.map(cond => (
              <div key={cond} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 10, border: `1px solid ${cat.color}20`, background: '#fff', borderLeft: `3px solid ${cat.color}` }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{cat.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', lineHeight: 1.3 }}>{cond}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="page-section container">
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
          {t('physio.category.treatments', 'Our Treatment Approach')}
        </h2>
        <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 16px' }}>
          {t('physio.category.treatments.sub', `Proven treatment methods for ${cat.name}`)}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {cat.treatments.map((tr, i) => (
            <div key={tr} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#fff' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: cat.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{tr}</div>
                <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>
                  {t(`physio.cat.${cat.id}.treatment.${i}.desc`, `Evidence-based ${tr.toLowerCase()} tailored to your recovery needs.`)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {relatedTherapists.length > 0 && (
        <div className="page-section" style={{ background: '#F0FDFA' }}>
          <div className="container">
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
              {t('physio.category.therapists', 'Our Expert Therapists')}
            </h2>
            <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 16px' }}>
              {t('physio.category.therapists.sub', `Specialized therapists for ${cat.name}`)}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {relatedTherapists.map(th => (
                <div key={th.id} style={{ padding: 16, borderRadius: 14, border: '1px solid #E2E8F0', background: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${cat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{th.image}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{th.name}</div>
                      <div style={{ fontSize: 11, color: cat.color, fontWeight: 600 }}>{th.qualifications}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <span style={{ color: '#F59E0B', fontSize: 13 }}>★</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{th.rating}</span>
                    <span style={{ fontSize: 11, color: '#64748B' }}>({th.sessions} sessions)</span>
                    <span style={{ fontSize: 11, color: '#059669', fontWeight: 600, marginLeft: 'auto' }}>{th.experience} yrs</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 8 }}>
                    {th.specialties.slice(0, 3).map(s => (
                      <span key={s} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: `${cat.color}12`, color: cat.color, fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: '#059669', fontWeight: 600, marginBottom: 10 }}>
                    {th.availability.join(' • ')}
                  </div>
                  <Link to={`/physiotherapy/book?condition=${encodeURIComponent(cat.name)}`} style={{ display: 'block', textAlign: 'center', height: 36, lineHeight: '36px', borderRadius: 8, background: cat.color, color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                    {t('book.session', 'Book Session')} →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {recommendedPkg && (
        <div className="page-section container">
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>
            {t('physio.category.recommended', 'Recommended Package')}
          </h2>
          <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 16px', textAlign: 'center' }}>
            {t('physio.category.recommended.sub', `Best value plan for ${cat.name}`)}
          </p>
          <div style={{ maxWidth: 360, margin: '0 auto' }}>
            <div style={{ padding: 22, borderRadius: 14, border: `2px solid ${cat.color}`, background: '#fff', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 10, right: 10, background: accent, color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 10px', borderRadius: 6 }}>
                {t('recommended', 'RECOMMENDED')}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px', color: '#0F172A', paddingRight: 80 }}>{recommendedPkg.name}</h3>
              {recommendedPkg.isMonthly ? (
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontWeight: 800, color: '#059669', fontSize: 22 }}>₹{recommendedPkg.price}</span>
                  <span style={{ fontSize: 11, color: '#94A3B8' }}>/month</span>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}><s>₹{recommendedPkg.originalPrice}</s> <span style={{ color: '#DC2626', fontWeight: 600 }}>Save ₹{recommendedPkg.originalPrice - recommendedPkg.price}</span></div>
                </div>
              ) : (
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontWeight: 800, color: '#059669', fontSize: 22 }}>₹{recommendedPkg.price}</span>
                  <span style={{ fontSize: 11, color: '#94A3B8' }}>/{recommendedPkg.sessions} sessions</span>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}><s>₹{recommendedPkg.originalPrice}</s> <span style={{ color: '#DC2626', fontWeight: 600 }}>Save ₹{recommendedPkg.originalPrice - recommendedPkg.price}</span></div>
                </div>
              )}
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 11, color: '#475569', marginBottom: 14, lineHeight: 1.8 }}>
                {recommendedPkg.includes.map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: '#22C55E', fontSize: 12 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <Link to={`/physiotherapy/book?package=${recommendedPkg.id}&condition=${encodeURIComponent(cat.name)}`} style={{ display: 'block', textAlign: 'center', height: 40, lineHeight: '40px', borderRadius: 8, background: cat.color, color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                {t('book.now', 'Book Now')}
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="page-section" style={{ background: `linear-gradient(135deg, #0D9488, #14B8A6)`, textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
            {t('physio.category.cta.title', 'Ready to Start Your Recovery?')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 16 }}>
            {t('physio.category.cta.sub', `Book your ${cat.name} session today and take the first step toward recovery.`)}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/physiotherapy/book" className="btn btn-lg" style={{ background: accent, border: 'none', color: '#fff', height: 48, padding: '0 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {t('book.physiotherapy.session', 'Book Physiotherapy Session')}
            </Link>
            <a href="https://wa.me/919700104108?text=Hi%2C%20I%20want%20to%20know%20more%20about%20${encodeURIComponent(cat.name)}" target="_blank" rel="noopener noreferrer" className="btn btn-lg" style={{ background: '#25d366', border: 'none', color: '#fff', height: 48, padding: '0 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {t('chat.on.whatsapp', 'Chat on WhatsApp')}
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .v-hero-title { font-size: 26px !important; }
        }
      `}</style>
    </div>
  );
}
