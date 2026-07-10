import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import {
  nursingCategories,
  nursingServices,
  nurseLevels,
  nurses,
  nursingPackages,
  trustFeatures,
  nursingFAQs,
  equipmentItems,
} from '../data/nursingData';
import NursingServiceCard from '../components/NursingServiceCard';

const C = {
  heroFrom: '#7C3AED',
  heroTo: '#EC4899',
  heroMid: '#A855F7',
  accent: '#F59E0B',
  accentHover: '#D97706',
  primary: '#7C3AED',
  primaryLight: '#EDE9FE',
  bg: '#F5F3FF',
  text: '#0F172A',
  textMuted: '#64748B',
  green: '#10B981',
};

const STEPS = [
  { icon: '🩺', title: 'Select Service', desc: 'Choose the nursing care you need from our categories.' },
  { icon: '📄', title: 'Upload Documents', desc: 'Upload prescription, discharge summary, reports.' },
  { icon: '📞', title: 'Care Assessment', desc: 'Care manager reviews and calls you for assessment.' },
  { icon: '👩‍⚕️', title: 'Nurse Assigned', desc: 'Best-matched nurse assigned based on your needs.' },
  { icon: '🏠', title: 'Care at Home', desc: 'Professional nursing care delivered at your doorstep.' },
];

export default function NurseAtHome() {
  const t = useT();
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeCondition, setActiveCondition] = useState(0);

  const firstServiceForCategory = (catSlug) => {
    const svc = nursingServices.find(s => s.category === catSlug);
    return svc ? `/nurse-at-home/service/${svc.slug}` : `/nurse-at-home/category/${catSlug}`;
  };

  const conditions = [
    { icon: '🏥', label: t('nurse.postSurgery', 'Post-Surgery Recovery'), desc: t('nurse.postSurgeryDesc', 'Expert nursing after surgery'), color: '#8B5CF6' },
    { icon: '👴', label: t('nurse.elderlyCare', 'Elderly Care'), desc: t('nurse.elderlyCareDesc', 'Compassionate senior care'), color: '#F59E0B' },
    { icon: '💉', label: t('nurse.injections', 'Injections & IV'), desc: t('nurse.injectionsDesc', 'IV fluids, injections, infusions'), color: '#3B82F6' },
    { icon: '🩹', label: t('nurse.woundCare', 'Wound Care'), desc: t('nurse.woundCareDesc', 'Dressing, pressure ulcer care'), color: '#E11D48' },
    { icon: '👶', label: t('nurse.motherBaby', 'Mother & Baby'), desc: t('nurse.motherBabyDesc', 'Postnatal, newborn care'), color: '#EC4899' },
    { icon: '🛏️', label: t('nurse.bedside', 'Bedside Nursing'), desc: t('nurse.bedsideDesc', '24/7 ICU-level at home'), color: '#0D9488' },
    { icon: '💪', label: t('nurse.rehab', 'Rehabilitation'), desc: t('nurse.rehabDesc', 'Speech, occupational therapy'), color: '#F97316' },
  ];

  const carePlans = [
    { id: 'visit', icon: '🩺', title: t('nurse.visitPlan', 'Nurse Visit'), price: '₹499+', desc: t('nurse.visitPlanDesc', 'One-time or periodic nurse visits for specific procedures'), color: '#3B82F6', features: ['Vital monitoring', 'Injections', 'Wound dressing'] },
    { id: '8hr', icon: '☀️', title: t('nurse.8hrPlan', '8-Hour Care'), price: '₹2,999', desc: t('nurse.8hrPlanDesc', 'Full shift care — day support for elderly or recovery'), color: '#F59E0B', features: ['Medication management', 'Personal care', 'Doctor coordination'] },
    { id: '12hr', icon: '🌙', title: t('nurse.12hrPlan', '12-Hour Care'), price: '₹4,499', desc: t('nurse.12hrPlanDesc', 'Extended care — ideal for post-surgery recovery'), color: '#8B5CF6', features: ['Two shifts available', 'Night duty option', 'Family updates'] },
    { id: '24hr', icon: '⭐', title: t('nurse.24hrPlan', '24-Hour ICU Care'), price: '₹8,999', desc: t('nurse.24hrPlanDesc', 'Round-the-clock critical care with trained ICU nurses'), color: '#E11D48', popular: true, features: ['ICU nurse', 'Multipara monitoring', 'Ventilator care', 'Emergency support'] },
  ];

  const testimonials = [
    { name: 'Mrs. Lakshmi Reddy', relation: t('nurse.daughter', 'Daughter of patient'), text: t('nurse.test1', 'The ICU-at-home service was a blessing. Trained nurse stayed 24/7 and handled everything professionally.'), rating: 5, location: 'Banjara Hills' },
    { name: 'Mr. Ravi Kumar', relation: t('nurse.son', 'Son of patient'), text: t('nurse.test2', 'Post-surgery care for my father was excellent. The nurse was punctual and very knowledgeable.'), rating: 5, location: 'Gachibowli' },
    { name: 'Mrs. Sunita', relation: t('nurse.mother', 'New mother'), text: t('nurse.test3', 'The postnatal care package made my recovery so smooth. Lactation support was incredibly helpful.'), rating: 5, location: 'Madhapur' },
  ];

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <div style={{ background: `linear-gradient(135deg, ${C.heroFrom} 0%, ${C.heroMid} 40%, ${C.heroTo} 100%)`, padding: '56px 0 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 14 }}>🏥</span>
            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: 600 }}>Jeevan HealthCare</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 44, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.15, maxWidth: 600 }}>
            {t('nurse.hero.title', 'Professional Nurse Care at Home')}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: '0 0 16px', maxWidth: 520, lineHeight: 1.5 }}>
            {t('nurse.hero.subtitle', 'Hospital-quality nursing care delivered safely at your home by trained healthcare professionals.')}
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {[
              { icon: '✓', text: t('nurse.trust.verified', 'Verified Nurses'), color: '#22C55E' },
              { icon: '✓', text: t('nurse.trust.experienced', 'Experienced Healthcare Team'), color: '#22C55E' },
              { icon: '✓', text: t('nurse.trust.support247', '24/7 Support'), color: '#22C55E' },
              { icon: '✓', text: t('nurse.trust.doctorCoordination', 'Doctor Coordination'), color: '#22C55E' },
              { icon: '✓', text: t('nurse.trust.hyderabad', 'Home Care Across Hyderabad'), color: '#22C55E' },
              { icon: '✓', text: t('nurse.trust.monitoring', 'Digital Patient Monitoring'), color: '#22C55E' },
            ].map(item => (
              <span key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: 20 }}>
                <span style={{ color: item.color, fontSize: 12 }}>{item.icon}</span> {item.text}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/nurse-at-home/book" className="btn btn-lg" style={{ background: C.accent, border: 'none', color: '#fff', height: 48, padding: '0 28px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(245,158,11,0.4)' }}>
              {t('nurse.bookNow', 'Book Nurse Now')}
            </Link>
            <a href="tel:+919700104108" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)', color: '#fff', height: 48, padding: '0 28px', fontSize: 16, fontWeight: 600, textDecoration: 'none', borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              📞 {t('nurse.talkToCareManager', 'Talk to Care Manager')}
            </a>
            <Link to="/upload-prescription" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.3)', color: '#fff', height: 48, padding: '0 28px', fontSize: 16, fontWeight: 600, textDecoration: 'none', borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              📄 {t('nurse.uploadPrescription', 'Upload Prescription')}
            </Link>
          </div>
        </div>
      </div>

      {/* ===== TRUST BADGES STRIP ===== */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '16px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { icon: '👩‍⚕️', count: '50+', label: t('nurse.trust.nurses', 'Qualified Nurses') },
              { icon: '🏠', count: '5000+', label: t('nurse.trust.visits', 'Home Visits Done') },
              { icon: '⭐', count: '4.9', label: t('nurse.trust.rating', 'Average Rating') },
              { icon: '🕐', count: '2-4 hrs', label: t('nurse.trust.booking', 'Booking Time') },
              { icon: '📍', count: '20+', label: t('nurse.trust.areas', 'Areas Covered') },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center', padding: '0 8px' }}>
                <div style={{ fontSize: 20, marginBottom: 2 }}>{item.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.primary }}>{item.count}</div>
                <div style={{ fontSize: 10, color: '#64748B' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== QUICK CARE PLANS SECTION ===== */}
      <div className="page-section container">
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, textAlign: 'center' }}>{t('nurse.carePlans.title', 'Choose Your Care Plan')}</h2>
        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 20px', textAlign: 'center' }}>{t('nurse.carePlans.subtitle', 'Flexible care plans designed for every need and budget')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 16 }}>
          {carePlans.map(plan => (
            <div key={plan.id} style={{ padding: 20, borderRadius: 14, border: plan.popular ? `2px solid ${C.accent}` : '1px solid #e2e8f0', background: plan.popular ? '#FFFBEB' : '#fff', position: 'relative', textAlign: 'center' }}>
              {plan.popular && (
                <div style={{ position: 'absolute', top: -10, right: '50%', transform: 'translateX(50%)', background: C.accent, color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 12px', borderRadius: 6, whiteSpace: 'nowrap' }}>
                  {t('nurse.mostPopular', 'Most Popular')}
                </div>
              )}
              <div style={{ fontSize: 36, marginBottom: 6 }}>{plan.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{plan.title}</h3>
              <div style={{ fontSize: 24, fontWeight: 800, color: plan.color, marginBottom: 6 }}>{plan.price}</div>
              <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 10px', lineHeight: 1.4 }}>{plan.desc}</p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 11, color: '#475569', marginBottom: 14, lineHeight: 1.8 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                    <span style={{ color: '#22C55E', fontSize: 12 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link to={`/nurse-at-home/book?plan=${plan.id}`} style={{ display: 'block', textAlign: 'center', height: 40, lineHeight: '40px', borderRadius: 8, background: plan.popular ? C.accent : C.primary, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                {t('nurse.selectPlan', 'Select Plan')}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <div className="page-section" style={{ background: C.bg }}>
        <div className="container">
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, textAlign: 'center' }}>{t('nurse.howItWorks', 'How It Works')}</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            {STEPS.map((s, i) => (
              <div key={s.title} style={{ textAlign: 'center', padding: 20, background: '#fff', borderRadius: 14, flex: '1 1 160px', maxWidth: 200, position: 'relative', border: '1px solid #e2e8f0' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, margin: '0 auto 10px' }}>{i + 1}</div>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{t(s.title)}</h3>
                <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.4 }}>{t(s.desc, s.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== SERVICE CATEGORIES ===== */}
      <div className="page-section container">
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{t('nurse.categories.title', 'Our Nursing Services')}</h2>
        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 16px' }}>{t('nurse.categories.subtitle', 'Comprehensive nursing care — from basic support to critical ICU at home')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {nursingCategories.map(cat => (
            <Link key={cat.id} to={firstServiceForCategory(cat.slug)} style={{ textDecoration: 'none' }}>
              <div style={{ padding: 20, borderRadius: 14, border: `1px solid ${cat.color}20`, background: `${cat.color}06`, borderTop: `3px solid ${cat.color}`, height: '100%', transition: 'transform 0.15s, box-shadow 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                <div style={{ fontSize: 32, marginBottom: 6 }}>{cat.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{t(cat.id, cat.name)}</h3>
                <p style={{ fontSize: 11, color: cat.color, fontWeight: 600, margin: '0 0 8px' }}>{cat.services.length} {t('nurse.services', 'services')}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 6 }}>
                  {cat.services.slice(0, 4).map(co => (
                    <span key={co} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: `${cat.color}12`, color: cat.color, fontWeight: 600 }}>{co}</span>
                  ))}
                  {cat.services.length > 4 && (
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: '#f1f5f9', color: '#64748b', fontWeight: 600 }}>+{cat.services.length - 4}</span>
                  )}
                </div>
                <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.4 }}>{t(cat.description, cat.description)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ===== CONDITIONS CARDS ===== */}
      <div className="page-section" style={{ background: C.bg }}>
        <div className="container">
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, textAlign: 'center' }}>{t('nurse.forConditions.title', 'Who Needs Nurse at Home?')}</h2>
          <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 16px', textAlign: 'center' }}>{t('nurse.forConditions.subtitle', 'Personalized nursing care for every medical need')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {conditions.map((c, i) => (
              <div key={c.label} onClick={() => setActiveCondition(i)}
                style={{ padding: 18, borderRadius: 12, border: activeCondition === i ? `2px solid ${c.color}` : '1px solid #e2e8f0', background: activeCondition === i ? `${c.color}08` : '#fff', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
                <div style={{ fontSize: 32, marginBottom: 4 }}>{c.icon}</div>
                <h3 style={{ fontSize: 12, fontWeight: 700, margin: '0 0 2px', color: '#0f172a' }}>{c.label}</h3>
                <p style={{ fontSize: 10, color: '#64748b', margin: 0, lineHeight: 1.3 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== OUR NURSES ===== */}
      <div className="page-section container">
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, textAlign: 'center' }}>{t('nurse.ourNurses', 'Meet Our Nursing Team')}</h2>
        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 16px', textAlign: 'center' }}>{t('nurse.ourNurses.subtitle', 'Trained, verified, and experienced healthcare professionals')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {nurses.map(n => {
            const level = nurseLevels.find(l => l.id === n.level);
            return (
              <div key={n.id} style={{ padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 36 }}>{n.image}</span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 2px', color: '#0f172a' }}>{n.name}</h3>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>
                      {n.qualifications} · {n.experience} yrs
                      {level && <span style={{ marginLeft: 6, padding: '1px 6px', borderRadius: 4, background: level.color + '20', color: level.color, fontWeight: 600, fontSize: 10 }}>{level.name}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#64748b', marginBottom: 4 }}>
                      <span style={{ color: '#d97706' }}>★ {n.rating}</span>
                      <span>· {n.sessions} sessions</span>
                    </div>
                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      {n.languages.map(l => <span key={l} style={{ fontSize: 9, padding: '1px 6px', borderRadius: 4, background: '#f1f5f9', color: '#64748b' }}>{l}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== NURSE LEVELS ===== */}
      <div className="page-section" style={{ background: C.bg }}>
        <div className="container">
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, textAlign: 'center' }}>{t('nurse.levels.title', 'Nurse Levels')}</h2>
          <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 16px', textAlign: 'center' }}>{t('nurse.levels.subtitle', 'Choose from our range of qualified nursing professionals')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 14 }}>
            {nurseLevels.map(level => (
              <div key={level.id} style={{ padding: 20, borderRadius: 14, border: `1px solid ${level.color}30`, background: `${level.color}06`, borderTop: `3px solid ${level.color}`, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 6 }}>👩‍⚕️</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{t(level.id, level.name)}</h3>
                <div style={{ fontSize: 22, fontWeight: 800, color: level.color, marginBottom: 6 }}>₹{level.hourlyRate}<span style={{ fontSize: 12, fontWeight: 400, color: '#94a3b8' }}>/hr</span></div>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.4 }}>{t(level.id + '.desc', level.description)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== PRICING PACKAGES ===== */}
      <div className="page-section container">
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, textAlign: 'center' }}>{t('nurse.packages.title', 'Nursing Packages')}</h2>
        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 16px', textAlign: 'center' }}>{t('nurse.packages.subtitle', 'Save more with our curated nursing packages')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 16 }}>
          {nursingPackages.map(pkg => (
            <div key={pkg.id} style={{ padding: 20, borderRadius: 14, border: pkg.popular ? `2px solid ${C.primary}` : '1px solid #e2e8f0', background: '#fff', position: 'relative' }}>
              {pkg.popular && (
                <div style={{ position: 'absolute', top: 10, right: 10, background: C.accent, color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>{t('popular', 'POPULAR')}</div>
              )}
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{t(pkg.id, pkg.name)}</h3>
              <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 8px' }}>{t(pkg.description, pkg.description)}</p>
              {pkg.isMonthly ? (
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontWeight: 800, color: '#059669', fontSize: 22 }}>₹{pkg.price}</span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>/month</span>
                </div>
              ) : (
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontWeight: 800, color: '#059669', fontSize: 22 }}>₹{pkg.price}</span>
                  {pkg.services > 0 && <span style={{ fontSize: 11, color: '#94a3b8' }}>/{pkg.services} services</span>}
                </div>
              )}
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 11, color: '#475569', marginBottom: 14, lineHeight: 1.8 }}>
                {pkg.includes.map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ color: '#22C55E', fontSize: 12 }}>✓</span> {item}</li>
                ))}
              </ul>
              <Link to={`/nurse-at-home/book?package=${pkg.id}`} style={{ display: 'block', textAlign: 'center', height: 38, lineHeight: '38px', borderRadius: 8, background: pkg.popular ? C.accent : C.primary, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                {t('book.package', 'Book Package')}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ===== INTEGRATED ECOSYSTEM ===== */}
      <div className="page-section" style={{ background: `linear-gradient(135deg, #0F4A96, #1866C9)`, color: '#fff' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, color: '#fff' }}>{t('nurse.ecosystem.title', 'The Jeevan Home Care Ecosystem')}</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: '0 0 20px', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
            {t('nurse.ecosystem.subtitle', 'We integrate all home healthcare services for a complete hospital-like experience at home.')}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, maxWidth: 800, margin: '0 auto' }}>
            {[
              { icon: '👩‍⚕️', label: t('nurse.eco.nurse', 'Nurse at Home') },
              { icon: '🩺', label: t('nurse.eco.doctor', 'Doctor Visit') },
              { icon: '🔬', label: t('nurse.eco.diagnostics', 'Diagnostics') },
              { icon: '💊', label: t('nurse.eco.pharmacy', 'Pharmacy') },
              { icon: '🦴', label: t('nurse.eco.physio', 'Physiotherapy') },
              { icon: '🛏️', label: t('nurse.eco.equipment', 'Medical Equipment') },
              { icon: '📊', label: t('nurse.eco.monitoring', 'Remote Monitoring') },
              { icon: '💉', label: t('nurse.eco.vaccination', 'Vaccination') },
            ].map(item => (
              <div key={item.label} style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>{item.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{item.label}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', fontSize: 13, fontWeight: 700, color: '#FFD54F' }}>
            {t('nurse.ecosystem.tagline', 'Complete Home Hospital Experience — Jeevan HealthCare')}
          </div>
        </div>
      </div>

      {/* ===== TESTIMONIALS ===== */}
      <div className="page-section container">
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, textAlign: 'center' }}>{t('nurse.testimonials.title', 'What Our Patients Say')}</h2>
        <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 16px', textAlign: 'center' }}>{t('nurse.testimonials.subtitle', 'Real stories from families who trusted Jeevan Nurse at Home')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {testimonials.map(tm => (
            <div key={tm.name} style={{ padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
              <div style={{ fontSize: 14, color: '#d97706', marginBottom: 8 }}>{'★'.repeat(tm.rating)}</div>
              <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.5, margin: '0 0 12px', fontStyle: 'italic' }}>"{tm.text}"</p>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{tm.name}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{tm.relation} · {tm.location}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== FAQ ===== */}
      <div className="page-section" style={{ background: C.bg }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, textAlign: 'center' }}>{t('faq.heading', 'Frequently Asked Questions')}</h2>
          <div style={{ display: 'grid', gap: 8 }}>
            {nursingFAQs.map(f => (
              <div key={f.q} style={{ borderRadius: 10, border: '1px solid #e2e8f0', overflow: 'hidden', background: '#fff' }}>
                <button onClick={() => setExpandedFaq(expandedFaq === f.q ? null : f.q)} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, fontFamily: 'inherit', textAlign: 'left' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', flex: 1 }}>{t(f.q, f.q)}</span>
                  <span style={{ fontSize: 16, color: '#94a3b8', transition: 'transform 0.2s', transform: expandedFaq === f.q ? 'rotate(180deg)' : 'none' }}>▼</span>
                </button>
                {expandedFaq === f.q && (
                  <div style={{ padding: '0 16px 12px', fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{t(f.a, f.a)}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== FINAL CTA ===== */}
      <div style={{ background: `linear-gradient(135deg, ${C.heroFrom}, ${C.heroTo})`, padding: '48px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{t('nurse.cta.title', 'Ready to Get Started?')}</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 16, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
            {t('nurse.cta.subtitle', 'Book a nurse and get professional care at home. Same-day service available across Hyderabad.')}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/nurse-at-home/book" className="btn btn-lg" style={{ background: C.accent, border: 'none', color: '#fff', height: 48, padding: '0 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(245,158,11,0.4)' }}>
              {t('nurse.bookNow', 'Book Nurse Now')}
            </Link>
            <a href="https://wa.me/919700104108?text=Hi%2C%20I%20want%20to%20know%20more%20about%20nursing%20services" target="_blank" rel="noopener noreferrer" className="btn btn-lg" style={{ background: '#25d366', border: 'none', color: '#fff', height: 48, padding: '0 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              💬 {t('nurse.whatsapp', 'WhatsApp Us')}
            </a>
            <a href="tel:+919700104108" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)', color: '#fff', height: 48, padding: '0 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              📞 {t('nurse.callNow', 'Call +91-9700104108')}
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .container { padding-left: 12px; padding-right: 12px; }
          h1 { font-size: 30px !important; }
        }
      `}</style>
    </div>
  );
}
