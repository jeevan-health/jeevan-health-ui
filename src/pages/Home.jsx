import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useT } from '../i18n/LanguageProvider';
import { Link } from 'react-router-dom';
import useUploadModal from '../stores/uploadModalStore';
import { seedTests } from '../data/seedData';
import { packageList } from '../data/healthPackages';
import SmartSearch from '../components/layout/SmartSearch';
import useCmsStore from '../stores/cmsStore';
import { nursingCategories, nurses, nursingServices } from '../data/nursingData';

export default function Home() {
  const t = useT();
  const popular = seedTests.slice(0, 8);
  const pkgs = packageList.slice(0, 4);
  const cms = useCmsStore();
  const featured = cms.content?.healthPackages?.featured || [];

  return (
    <div>
      <HeroSection />
      <TrustStrip />
      <QuickActions />
      <PopularTests popular={popular} />
      <CategoriesSection />
      <PackagesSection pkgs={pkgs} featured={featured} />
      <NurseAtHomeSection />
      <WhyChooseJeevan />
      <HowItWorks />
      <StatsSection />
      <Testimonials />
      <HealthLibrarySection />
      <FaqSection />
      <style>{`
        @media (max-width: 768px) {
          .hero-search { border-radius: 12px !important; }
          .home-qa-mobile { display: block !important; padding: 0 12px; margin-top: -8px; }
        }
        @media (max-width: 600px) {
          .trust-strip-inner { gap: 4px !important; }
          .trust-strip-inner span { font-size: 10px !important; padding: 3px 8px !important; }
          .quick-action-card { padding: 12px 14px !important; gap: 10px !important; }
          .quick-action-card > div:first-child { width: 36px !important; height: 36px !important; font-size: 16px !important; }
          .quick-action-card > div:last-child > div:first-child { font-size: 12px !important; }
          .quick-action-card > div:last-child > div:last-child { font-size: 10px !important; }
          .home-qa-mobile { padding: 0 8px; }
        }
        @media (max-width: 480px) {
          .popular-test-grid { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .why-choose-grid { grid-template-columns: 1fr !important; }
          .why-cta-section { padding: 20px 16px !important; }
          .why-cta-section h3 { font-size: 15px !important; }
          .why-cta-section .btn { width: 100% !important; }
          .hero .hero-stats-grid { gap: 6px !important; }
          .hero .hero-stat { padding: 8px !important; font-size: 10px !important; }
        }
      `}</style>
    </div>
  );
}

function HeroSection() {
  const t = useT();
  const hero = useCmsStore(s => s.content?.hero);
  const h = hero || {};
  if (h.active === false) return null;
  const statBadges = h.statBadges || [
    { icon: '🔬', label: t('home.hero.statBadges.tests', '5000+ Tests'), sublabel: '' },
    { icon: '🚚', label: t('home.hero.statBadges.freeCollection', 'Free Home Collection'), sublabel: '' },
    { icon: '🏥', label: t('home.hero.statBadges.labs', 'NABL Certified Labs'), sublabel: '' },
    { icon: '⏱️', label: t('home.hero.statBadges.reports', 'Reports in 24 Hours'), sublabel: '' },
  ];
  const featureIcons = h.featureIcons || [
    { icon: '👪', label: t('home.hero.features.family', 'Family') },
    { icon: '🩺', label: t('home.hero.features.doctor', 'Doctor') },
    { icon: '💉', label: t('home.hero.features.phlebotomist', 'Phlebotomist') },
    { icon: '👴', label: t('home.hero.features.senior', 'Senior Citizen') },
  ];
  return (
    <div className="hero" style={{ background: h.backgroundImage ? `url(${h.backgroundImage})` : 'linear-gradient(135deg, #0F5DA8 0%, #20B7F5 50%, #00D9FF 100%)', padding: '40px 16px 48px', overflow: 'hidden', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="container" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
            {statBadges.map(s => (
              <span key={s.label} style={{ background: 'rgba(255,255,255,0.12)', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: 4 }}>
                {s.icon} {s.label}
              </span>
            ))}
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1.15, margin: '0 0 6px', letterSpacing: -0.5 }}>
            {h.heading || t('home.hero.heading', 'Book Lab Tests <br />At Home')}
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 20, lineHeight: 1.6, maxWidth: 480 }}>
            {h.subheading || t('home.hero.subheading', "India's most trusted diagnostics platform. Free sample collection by trained phlebotomists. NABL certified labs. Accurate digital reports delivered to your doorstep.")}
          </p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <Link to={h.ctaLink || '/diagnostics'} className="btn btn-primary btn-lg" style={{ background: '#FF3B30', border: 'none', fontSize: 14, padding: '12px 28px' }}>{h.ctaText || t('home.hero.cta', 'Book Lab Tests')}</Link>
            <button onClick={() => useUploadModal.getState().setOpen(true)} className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: '#22C55E', borderWidth: 2, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}>{h.ctaSecondaryText || t('home.hero.ctaSecondary', '📄 Upload Prescription')}</button>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <Link to={h.ctaTertiaryLink || '/services'} className="btn btn-outline" style={{ color: 'rgba(255,255,255,0.9)', borderColor: 'rgba(255,255,255,0.3)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>{h.ctaTertiaryText || t('home.hero.ctaTertiary', '📦 Book Health Package')}</Link>
          </div>
          <div style={{ marginBottom: 20, maxWidth: 480 }}>
            <SmartSearch placeholder={t('home.hero.searchPlaceholder', '🔍 Search tests, symptoms, diseases...')} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize: 16, color: '#FFD54F' }}>★</span>)}
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{h.rating || '4.9'}</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{h.ratingLabel || t('home.hero.ratingLabel', '50,000+ Happy Patients')}</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {featureIcons.map(f => (
            <div key={f.label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, textAlign: 'center', backdropFilter: 'blur(4px)' }}>
              <div style={{ marginBottom: 6, fontSize: 40 }}>{f.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>{f.label}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>{f.sublabel || ''}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrustStrip() {
  const t = useT();
  const trustStrip = useCmsStore(s => s.content?.trustStrip);
  const items = trustStrip?.items || [
    { icon: '✔', label: t('home.trustStrip.NABL', 'NABL Certified') },
    { icon: '✔', label: t('home.trustStrip.freeCollection', 'Free Home Collection') },
    { icon: '✔', label: t('home.trustStrip.sameDay', 'Same Day Collection') },
    { icon: '✔', label: t('home.trustStrip.securePayment', 'Secure Payment') },
    { icon: '✔', label: t('home.trustStrip.doctorSupport', 'Doctor Support') },
    { icon: '✔', label: t('home.trustStrip.digitalReports', 'Digital Reports') },
    { icon: '✔', label: t('home.trustStrip.support', '24x7 Support') },
  ];
  if (trustStrip?.active === false) return null;
  return (
    <div style={{ background: 'linear-gradient(90deg, #FFFFFF 0%, #F8FAFC 50%, #FFFFFF 100%)', borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
      <div className="container" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
        {items.map(item => (
          <span key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', padding: '4px 10px', background: '#f0fdf4', borderRadius: 6 }}>
            <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 11 }}>{item.icon || '✔'}</span> {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function QuickActions() {
  const t = useT();
  const services = useCmsStore(s => s.content?.services);
  const svcs = (services || []).filter(s => s.active !== false);
  const actions = svcs.length > 0 ? svcs.map(s => ({
    icon: s.icon || '🔬', label: s.label || 'Service', desc: s.description || '',
    path: s.link || '/diagnostics', color: s.color || '#1866C9',
  })) : [
    { icon: '👪', label: t('home.quickActions.consultation', 'Consultation'), desc: t('home.quickActions.consultationDesc', 'Consult top doctors from home'), path: '/consult-doctor', color: '#7c3aed' },
    { icon: '🔬', label: t('home.quickActions.diagnostics', 'Diagnostics'), desc: t('home.quickActions.diagnosticsDesc', '5000+ lab tests at your doorstep'), path: '/diagnostics', color: '#1866C9' },
    { icon: '💊', label: t('home.quickActions.pharmacy', 'Pharmacy'), desc: t('home.quickActions.pharmacyDesc', 'Medicines delivered to your home'), path: '/contact', color: '#e65100' },
    { icon: '👩‍⚕️', label: t('home.quickActions.nursing', 'Nursing'), desc: t('home.quickActions.nursingDesc', 'Skilled nursing care at home'), path: '/nurse-at-home', color: '#0891b2' },
    { icon: '🏋️', label: t('home.quickActions.physiotherapy', 'Physiotherapy'), desc: t('home.quickActions.physiotherapyDesc', 'Recover with expert physiotherapists'), path: '/physiotherapy', color: '#16a34a' },
    { icon: '💉', label: t('home.quickActions.vaccination', 'Vaccination at Home'), desc: t('home.quickActions.vaccinationDesc', 'Vaccination for all age groups & travel'), path: '/vaccination', color: '#dc2626' },
  ];
  return (
    <div className="page-section" style={{ background: '#F8FAFC' }}>
      {/* Mobile Quick Actions Grid — 2x2 */}
      <div className="home-qa-mobile" style={{ display: 'none', marginBottom: 10 }}>
        {/* Today's Health Mini Card */}
        <Link to="/dashboard?tab=health" style={{ textDecoration: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg, #1866C9, #2B7BE8)', borderRadius: 14, padding: '14px 16px', marginBottom: 10, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.85 }}>{t('home.quickActions.mobile.journey', '🌿 Jeevan HealthCare at Home Journey')}</div>
              <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2 }}>
                {(() => {
                  try {
                    const ds = JSON.parse(localStorage.getItem('jh_daily_activity') || '{}');
                    return ds.lastScore != null ? `${ds.lastScore}/100` : '--/100';
                  } catch { return '--/100'; }
                })()}
              </div>
              <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>
                {(() => {
                  try {
                    const ds = JSON.parse(localStorage.getItem('jh_daily_activity') || '{}');
                    return ds.streak ? `${t('home.quickActions.mobile.streak', '🔥 {streak} day streak').replace('{streak}', ds.streak)}` : t('home.quickActions.mobile.startTracking', 'Start tracking today →');
                  } catch { return t('home.quickActions.mobile.startTracking', 'Start tracking today →'); }
                })()}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: 6 }}>🚶</span>
              <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: 6 }}>💧</span>
              <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: 6 }}>😴</span>
            </div>
          </div>
        </Link>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Link to="/diagnostics" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '16px 12px', background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: 28 }}>🧪</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dark)' }}>{t('home.quickActions.mobile.bookTest', 'Book Test')}</span>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{t('home.quickActions.mobile.homeCollection', 'Home Collection')}</span>
            </div>
          </Link>
          <button onClick={() => useUploadModal.getState().setOpen(true)} style={{ fontFamily: 'inherit', cursor: 'pointer', border: 'none', background: 'none', padding: 0, width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '16px 12px', background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: 28 }}>📄</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dark)' }}>{t('home.quickActions.mobile.upload', 'Upload')}</span>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{t('home.quickActions.mobile.prescription', 'Prescription')}</span>
            </div>
          </button>
          <Link to="/dashboard?tab=bookings" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '16px 12px', background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: 28 }}>📅</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dark)' }}>{t('home.quickActions.mobile.myBookings', 'My Bookings')}</span>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{t('home.quickActions.mobile.trackStatus', 'Track Status')}</span>
            </div>
          </Link>
          <Link to="/dashboard?tab=health" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '16px 12px', background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: 28 }}>🩺</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dark)' }}>{t('home.quickActions.mobile.healthScore', 'Health Score')}</span>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{t('home.quickActions.mobile.checkNow', 'Check Now')}</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="container">
        <div className="grid-3" style={{ gap: 14 }}>
          {actions.map(a => {
            const Tag = a.path ? Link : 'button';
            const extraProps = a.path ? { to: a.path } : { onClick: () => useUploadModal.getState().setOpen(true), type: 'button' };
            return (
              <Tag key={a.label} {...extraProps}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px',
                  background: '#fff', borderRadius: 14, textDecoration: 'none',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e8edf2',
                  transition: 'all 0.15s', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', textAlign: 'left', width: '100%',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.boxShadow = `0 4px 16px ${a.color}20`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8edf2'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${a.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>
                  {a.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{a.desc}</div>
                </div>
                <span style={{ color: a.color, fontSize: 18 }}>→</span>
              </Tag>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PopularTests({ popular }) {
  const tr = useT();
  const catIcons = { Hematology: '🩸', Diabetes: '🩸', Thyroid: '🦋', Cardiac: '❤️', Vitamins: '💊', Fever: '🌡️', 'Full Body': '🧬', Anemia: '🩸', Hormones: '🧪', Arthritis: '🦴', Pregnancy: '🤰', Cancer: '🎗️', STD: '🔬', Allergy: '🤧', Liver: '🫁' };
  const badges = [tr('home.popularTests.badge.trending', 'Trending'), tr('home.popularTests.badge.mostBooked', 'Most Booked'), tr('home.popularTests.badge.recommended', 'Recommended'), tr('home.popularTests.badge.trending', 'Trending'), tr('home.popularTests.badge.mostBooked', 'Most Booked'), tr('home.popularTests.badge.recommended', 'Recommended'), tr('home.popularTests.badge.trending', 'Trending'), tr('home.popularTests.badge.mostBooked', 'Most Booked')];
  const badgeColors = { Trending: '#dc2626', 'Most Booked': '#16a34a', Recommended: '#7c3aed' };
  return (
    <div className="page-section" style={{ background: '#FFFFFF' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h2 className="section-title" style={{ margin: 0 }}>{tr('home.popularTests.title', 'Popular Tests')}</h2>
            <p className="section-subtitle" style={{ margin: '4px 0 0' }}>{tr('home.popularTests.subtitle', 'Most booked diagnostic tests')}</p>
          </div>
          <Link to="/diagnostics" className="btn btn-outline" style={{ fontSize: 12 }}>{tr('home.popularTests.viewAll', 'View All Tests →')}</Link>
        </div>
        <div className="grid-4" style={{ gap: 14 }}>
          {popular.map((test, i) => {
            const slug = test.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            const mrp = test.mrp || Math.round(test.price * 2.2);
            const offerPrice = test.offerPrice || test.price;
            const icon = catIcons[test.category] || '🔬';
            const badge = badges[i];
            return (
              <div key={test.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <Link to={`/test/${slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{ background: `linear-gradient(135deg, #1866C9, #0F4A96)`, padding: '20px 16px', position: 'relative' }}>
                    {badge && <span style={{ position: 'absolute', top: 8, left: 8, background: badgeColors[badge], color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>{badge}</span>}
                    <span style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 4 }}>🔬 {test.category}</span>
                    <div style={{ fontSize: 36, textAlign: 'center' }}>{icon}</div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', textAlign: 'center', margin: '6px 0 0' }}>{test.name}</h3>
                  </div>
                </Link>
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#dc2626' }}>₹{offerPrice}</span>
                    {offerPrice < mrp && <span style={{ fontSize: 12, color: '#aaa', textDecoration: 'line-through' }}>₹{mrp}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#16a34a', background: '#f0fdf4', padding: '2px 8px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 3 }}>{tr('home.popularTests.freeHomeCollection', '🚚 Free Home Collection')}</span>
                    {test.report_time && <span style={{ fontSize: 10, color: 'var(--text-secondary)', background: '#f5f6fa', padding: '2px 8px', borderRadius: 4 }}>⏱️ {test.report_time}</span>}
                  </div>
                  {test.preparation_instructions && (
                    <p style={{ fontSize: 10, color: '#999', marginBottom: 10, lineHeight: 1.4 }}>
                      📋 {test.preparation_instructions.length > 60 ? test.preparation_instructions.slice(0, 60) + '...' : test.preparation_instructions}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link to={`/test/${slug}`} style={{ flex: 1, textAlign: 'center', padding: '7px 0', background: '#1866C9', color: '#fff', borderRadius: 8, fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>{tr('home.popularTests.bookNow', 'Book Now')}</Link>
                    <button style={{ padding: '7px 10px', border: '1px solid #e0e3eb', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', fontFamily: 'inherit' }}>{tr('home.popularTests.compare', 'Compare')}</button>
                    <button style={{ padding: '7px 10px', border: '1px solid #e0e3eb', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', fontFamily: 'inherit' }}>{tr('home.popularTests.add', '+ Add')}</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CategoriesSection() {
  const t = useT();
  const cats = [
    { icon: '🩸', label: t('home.categories.diabetes', 'Diabetes'), cat: 'Diabetes' },
    { icon: '❤️', label: t('home.categories.heart', 'Heart'), cat: 'Cardiac' },
    { icon: '🫘', label: t('home.categories.kidney', 'Kidney'), cat: 'Full Body' },
    { icon: '🫁', label: t('home.categories.liver', 'Liver'), cat: 'Liver' },
    { icon: '💊', label: t('home.categories.vitamin', 'Vitamin'), cat: 'Vitamins' },
    { icon: '🧪', label: t('home.categories.hormones', 'Hormones'), cat: 'Hormones' },
    { icon: '🩸', label: t('home.categories.anemia', 'Anemia'), cat: 'Anemia' },
    { icon: '🦴', label: t('home.categories.arthritis', 'Arthritis'), cat: 'Arthritis' },
    { icon: '🤰', label: t('home.categories.pregnancy', 'Pregnancy'), cat: 'Pregnancy' },
    { icon: '🎗️', label: t('home.categories.cancerScreening', 'Cancer Screening'), cat: 'Cancer' },
    { icon: '🤧', label: t('home.categories.allergy', 'Allergy'), cat: 'Allergy' },
    { icon: '🌡️', label: t('home.categories.fever', 'Fever'), cat: 'Fever' },
    { icon: '🦠', label: t('home.categories.infection', 'Infection'), cat: 'STD' },
    { icon: '🦋', label: t('home.categories.thyroid', 'Thyroid'), cat: 'Thyroid' },
    { icon: '🧬', label: t('home.categories.fullBody', 'Full Body'), cat: 'Full Body' },
  ];
  return (
    <div className="page-section" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)' }}>
      <div className="container">
      <h2 className="section-title">{t('home.categories.title', 'Browse by Category')}</h2>
      <p className="section-subtitle">{t('home.categories.subtitle', 'Find the right test by health concern')}</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
        {cats.map(c => (
          <Link key={c.cat} to={`/diagnostics?cat=${c.cat}`}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              padding: '14px 16px', borderRadius: 12, textDecoration: 'none',
              background: '#fff', border: '1px solid #e8edf2', minWidth: 90,
              transition: 'all 0.15s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#1866C9'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(11,93,168,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8edf2'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'none'; }}>
            <span style={{ fontSize: 28 }}>{c.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a', textAlign: 'center', lineHeight: 1.2 }}>{c.label}</span>
          </Link>
        ))}
      </div>
    </div>
    </div>
  );
}

function PackagesSection({ pkgs, featured }) {
  const t = useT();
  return (
    <div className="page-section" style={{ background: '#FFFFFF' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h2 className="section-title" style={{ margin: 0 }}>{t('home.packages.title', 'Health Packages')}</h2>
            <p className="section-subtitle" style={{ margin: '4px 0 0' }}>{t('home.packages.subtitle', 'Comprehensive health checkup packages')}</p>
          </div>
          <Link to="/services" className="btn btn-outline" style={{ fontSize: 12 }}>{t('home.packages.viewAll', 'View All Packages →')}</Link>
        </div>
        <div className="grid-4" style={{ gap: 14 }}>
          {pkgs.filter(Boolean).slice(0, 4).map((p, i) => {
            const discPct = p.discount || Math.round((1 - p.offerPrice / p.mrp) * 100);
            return (
              <div key={p.name} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ background: p.color || '#1866C9', padding: '16px 16px 20px', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: 8, left: 8, background: '#FFD54F', color: '#1a1a1a', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>{discPct >= 50 ? t('home.packages.bestValue', 'Best Value') : t('home.packages.popular', 'Popular')}</span>
                  <span style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>{discPct}% OFF</span>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{p.testCount || t('home.packages.multiple', 'Multiple')} {t('home.packages.tests', 'Tests')}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 8px', lineHeight: 1.2 }}>{p.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>₹{p.offerPrice}</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', textDecoration: 'line-through' }}>₹{p.mrp}</span>
                  </div>
                </div>
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 12 }}>
                    {[
                      { icon: '🚚', label: t('home.packages.freeCollection', 'Free Home Collection') },
                      { icon: '👨‍⚕️', label: t('home.packages.doctorConsult', 'Doctor Consultation') },
                      { icon: '⏱️', label: `${t('home.packages.reportIn', 'Report in')} ${p.reportTime || t('home.packages.hours24', '24 Hours')}` },
                    ].map(f => (
                      <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
                        <span style={{ width: 14, textAlign: 'center' }}>{f.icon}</span>
                        <span>{f.label}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link to={`/package/${p.slug}`} style={{ flex: 1, textAlign: 'center', padding: '8px 0', background: '#1866C9', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>{t('home.packages.bookNow', 'Book Now')}</Link>
                    <Link to={`/package/${p.slug}`} style={{ padding: '8px 12px', border: '1px solid #e0e3eb', borderRadius: 8, fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('home.packages.viewDetails', 'View Details')}</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  const t = useT();
  const steps = [
    { icon: '🛒', title: t('home.howItWorks.step1.title', 'Book Your Test'), desc: t('home.howItWorks.step1.desc', 'Search from 2000+ tests and health packages. Book instantly online or upload your prescription.'), badge: t('home.howItWorks.step1.badge', 'Easy Online Booking'), badge2: t('home.howItWorks.step1.badge2', 'Prescription Upload') },
    { icon: '📅', title: t('home.howItWorks.step2.title', 'Choose Your Slot'), desc: t('home.howItWorks.step2.desc', 'Select your preferred date and convenient home collection time.'), badge: t('home.howItWorks.step2.badge', 'Flexible Time Slots'), badge2: t('home.howItWorks.step2.badge2', 'Same Day Availability') },
    { icon: '🏠', title: t('home.howItWorks.step3.title', 'Home Sample Collection'), desc: t('home.howItWorks.step3.desc', 'Certified healthcare professionals collect samples safely at your doorstep.'), badge: t('home.howItWorks.step3.badge', 'Hygienic Collection'), badge2: t('home.howItWorks.step3.badge2', 'Trained Phlebotomists') },
    { icon: '🔬', title: t('home.howItWorks.step4.title', 'Advanced Lab Testing'), desc: t('home.howItWorks.step4.desc', 'Your samples are processed using advanced technology and quality-controlled laboratories.'), badge: t('home.howItWorks.step4.badge', 'Quality Checked'), badge2: t('home.howItWorks.step4.badge2', 'Accurate Results') },
    { icon: '📱', title: t('home.howItWorks.step5.title', 'Get Digital Reports'), desc: t('home.howItWorks.step5.desc', 'Receive your reports securely through WhatsApp, email, or patient dashboard.'), badge: t('home.howItWorks.step5.badge', 'Anytime Access'), badge2: t('home.howItWorks.step5.badge2', 'Download & Share') },
    { icon: '👨‍⚕️', title: t('home.howItWorks.step6.title', 'Doctor Consultation'), desc: t('home.howItWorks.step6.desc', 'Understand your results with expert medical guidance and follow-up recommendations.'), badge: t('home.howItWorks.step6.badge', 'Expert Consultation'), badge2: t('home.howItWorks.step6.badge2', 'Health Guidance') },
  ];
  return (
    <div className="page-section" style={{ background: '#FFFFFF' }}>
      <div className="how-bg-decoration" />
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 6 }}>
          <span style={{ fontSize: 24 }}>🏥</span>
          <h2 className="section-title" style={{ margin: 0, fontSize: 22 }}>{t('home.howItWorks.sectionTitle', 'How Jeevan Makes Healthcare Simple')}</h2>
        </div>
        <p className="section-subtitle text-center">{t('home.howItWorks.sectionSubtitle', 'From booking your test to receiving expert medical advice, we make your healthcare journey smooth, safe, and convenient.')}</p>
        <div className="journey-banner" style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 24, padding: '8px 16px', background: 'rgba(24, 102, 201,0.06)', borderRadius: 30, fontSize: 11, fontWeight: 600, color: '#1866C9', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
          <span>{t('home.howItWorks.journey.book', 'Book')}</span><span style={{ color: '#20B7F5' }}>→</span><span>{t('home.howItWorks.journey.collect', 'Collect')}</span><span style={{ color: '#20B7F5' }}>→</span><span>{t('home.howItWorks.journey.test', 'Test')}</span><span style={{ color: '#20B7F5' }}>→</span><span>{t('home.howItWorks.journey.report', 'Report')}</span><span style={{ color: '#20B7F5' }}>→</span><span>{t('home.howItWorks.journey.consult', 'Consult')}</span>
          <span style={{ background: '#22C55E', color: '#fff', fontSize: 9, padding: '1px 8px', borderRadius: 10, marginLeft: 6 }}>{t('home.howItWorks.completed', 'Completed in 24-48 Hours')}</span>
        </div>
        <div className="timeline-wrapper" style={{ position: 'relative', paddingTop: 20 }}>
          <div className="timeline-line" style={{ position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)', width: '80%', height: 3, background: 'linear-gradient(90deg, #1866C9, #20B7F5, #1866C9)', borderRadius: 2, zIndex: 0 }} />
          <div className="timeline-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, position: 'relative', zIndex: 1 }}>
            {steps.map((s, i) => (
              <div key={s.title} className="timeline-step" style={{ textAlign: 'center' }}>
                <div className="timeline-dot" style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #1866C9, #0F4A96)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, margin: '0 auto 10px', boxShadow: '0 4px 12px rgba(24, 102, 201,0.25)', position: 'relative', zIndex: 2 }}>
                  {s.icon}
                </div>
                <div className="timeline-card" style={{ background: '#fff', borderRadius: 16, padding: '14px 10px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e8edf2', minHeight: 200, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#1866C9', background: '#E8F1FC', borderRadius: 10, padding: '2px 8px', display: 'inline-block', marginBottom: 6, alignSelf: 'center' }}>{t('home.howItWorks.step', 'Step')} {String(i + 1).padStart(2, '0')}</div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 6, lineHeight: 1.2 }}>{s.title}</h3>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10, flex: 1 }}>{s.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#16a34a', fontWeight: 600 }}>
                      <span>✓</span> {s.badge}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#16a34a', fontWeight: 600 }}>
                      <span>✓</span> {s.badge2}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="how-cta" style={{ textAlign: 'center', marginTop: 32, padding: '24px', background: 'linear-gradient(135deg, #0F5DA8, #20B7F5)', borderRadius: 16, color: '#fff' }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>{t('home.howItWorks.cta.title', 'Ready to Start Your Health Check?')}</h3>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/diagnostics" className="btn btn-lg" style={{ background: '#FF3B30', border: 'none', color: '#fff', padding: '10px 24px', fontSize: 13 }}>{t('home.howItWorks.cta.bookTest', '🔵 Book Test Now')}</Link>
            <button onClick={() => useUploadModal.getState().setOpen(true)} className="btn btn-lg" style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.5)', color: '#fff', padding: '10px 24px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>{t('home.howItWorks.cta.upload', '📄 Upload Prescription')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  const t = useT();
  const testimonials = useCmsStore(s => s.content?.testimonials);
  const reviews = (testimonials || []).length > 0 ? testimonials : [
    { name: 'Priya Sharma', text: t('home.testimonials.review1.text', 'Excellent home collection service. The phlebotomist was on time and very professional. Reports came within 24 hours.'), rating: 5, tag: t('home.testimonials.review1.tag', '🩸 Blood Test at Home'), img: '👩' },
    { name: 'Rajesh Kumar', text: t('home.testimonials.review2.text', 'I have been using Jeevan HealthCare at Home for all my family health checkups. Great prices and reliable reports every time.'), rating: 5, tag: t('home.testimonials.review2.tag', '👨‍👩‍👧 Full Body Checkup'), img: '👨' },
    { name: 'Anita Desai', text: t('home.testimonials.review3.text', 'The home collection service is a lifesaver for my elderly parents. So convenient and safe. Highly recommend!'), rating: 5, tag: t('home.testimonials.review3.tag', '👵 Senior Care Package'), img: '👵' },
    { name: 'Vikram Singh', text: t('home.testimonials.review4.text', 'Corporate health camp was well organised. All employees got their reports on time with detailed analysis.'), rating: 5, tag: t('home.testimonials.review4.tag', '🏢 Corporate Health Camp'), img: '👨‍💼' },
    { name: 'Sneha Patel', text: t('home.testimonials.review5.text', 'The doctor consultation after my reports helped me understand my health better. Truly comprehensive care.'), rating: 5, tag: t('home.testimonials.review5.tag', '👨‍⚕️ Doctor Consultation'), img: '👩‍⚕️' },
  ];
  const getImg = (t) => t.image || (t.name ? t.name[0] === 'P' ? '👩' : t.name[0] === 'R' ? '👨' : t.name[0] === 'A' ? '👵' : t.name[0] === 'V' ? '👨‍💼' : '👩‍⚕️' : '👤');

  const videos = [
    { title: t('home.testimonials.video1.title', 'My Jeevan Experience'), name: 'Meera Joshi', location: 'Mumbai', topic: t('home.testimonials.video1.topic', 'Home Sample Collection') },
    { title: t('home.testimonials.video2.title', 'Care for My Parents'), name: 'Arun Kapoor', location: 'Delhi', topic: t('home.testimonials.video2.topic', 'Elderly Care Experience') },
    { title: t('home.testimonials.video3.title', 'Corporate Wellness'), name: 'Neha Gupta', location: 'Pune', topic: t('home.testimonials.video3.topic', 'Corporate Health Camp') },
  ];

  const stories = [
    { icon: '🩸', title: t('home.testimonials.story1.title', 'Diabetes Management Journey'), before: t('home.testimonials.story1.before', 'High sugar levels (HbA1c 8.5)'), after: t('home.testimonials.story1.after', 'Regular testing + doctor guidance'), result: t('home.testimonials.story1.result', 'Better health monitoring (HbA1c 6.8)'), color: '#dc2626' },
    { icon: '👴', title: t('home.testimonials.story2.title', 'Senior Citizen Care Story'), before: t('home.testimonials.story2.before', '80-yr-old with limited mobility'), after: t('home.testimonials.story2.after', 'Home diagnostics support'), result: t('home.testimonials.story2.result', 'Regular monitoring, family peace of mind'), color: '#1866C9' },
  ];

  const photos = [
    { emoji: '👩', label: t('home.testimonials.photo.patient', 'Patient') },
    { emoji: '👴', label: t('home.testimonials.photo.seniorCare', 'Senior Care') },
    { emoji: '👨‍👩‍👧', label: t('home.testimonials.photo.family', 'Family') },
    { emoji: '🏠', label: t('home.testimonials.photo.homeCollection', 'Home Collection') },
  ];

  const [activeReview, setActiveReview] = useState(0);
  const next = useCallback(() => setActiveReview(i => (i + 1) % reviews.length), [reviews.length]);
  useEffect(() => { const t = setInterval(next, 4000); return () => clearInterval(t); }, [next]);

  return (
    <div className="page-section" style={{ background: '#FFFFFF' }}>
      <div className="container">
        <h2 className="section-title text-center">{t('home.testimonials.sectionTitle', '❤️ Loved by Thousands of Happy Patients')}</h2>
        <p className="section-subtitle text-center">{t('home.testimonials.sectionSubtitle', 'Real experiences from patients who trusted Jeevan for their healthcare journey.')}</p>

        <div className="grid-4" style={{ gap: 12, marginBottom: 24 }}>
          {[
            { label: '2,00,000+', sub: t('home.testimonials.stat.homeCollections', 'Home Collections') },
            { label: '50,000+', sub: t('home.testimonials.stat.happyFamilies', 'Happy Families') },
            { label: '4.9 ⭐', sub: t('home.testimonials.stat.googleRating', 'Google Rating') },
            { label: '10+ Years', sub: t('home.testimonials.stat.experience', 'Healthcare Experience') },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 14, padding: '14px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', border: '1px solid #e8edf2' }}>
              <div className="stats-count" style={{ fontSize: 20, fontWeight: 800, color: '#1866C9', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="testimonials-layout" style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, marginBottom: 24 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '24px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e8edf2' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1866C9', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{t('home.testimonials.googleRating', 'Google Rating')}</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#1a1a1a', marginBottom: 4 }}>4.9</div>
            <div style={{ fontSize: 22, marginBottom: 8, letterSpacing: 4 }}>⭐⭐⭐⭐⭐</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 12 }}>{t('home.testimonials.basedOn', 'Based on')} <strong style={{ color: '#1a1a1a' }}>{t('home.testimonials.reviewsCount', '500+ Reviews')}</strong></div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#E8F1FC', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: '#1866C9', marginBottom: 14 }}>
              <span>✅</span> {t('home.testimonials.verifiedPatients', 'Verified Patients')}
            </div>
            <div style={{ width: 32, height: 32, margin: '0 auto', background: '#1a1a1a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700 }}>G</div>
          </div>

          <div style={{ background: '#fff', borderRadius: 20, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e8edf2', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>{getImg(reviews[activeReview])}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{reviews[activeReview].name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{reviews[activeReview].tag || t('home.testimonials.verifiedPatient', 'Verified Patient')}</div>
                </div>
              </div>
              <div style={{ fontSize: 14, letterSpacing: 2 }}>{'⭐'.repeat(reviews[activeReview].rating)}</div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: '#1a1a1a', fontStyle: 'italic', marginBottom: 14 }}>"{reviews[activeReview].text}"</p>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              {reviews.map((_, i) => (
                <button key={i} onClick={() => setActiveReview(i)} style={{ width: i === activeReview ? 24 : 8, height: 8, borderRadius: 4, border: 'none', background: i === activeReview ? '#1866C9' : '#d0d5dd', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
              ))}
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: '#1a1a1a' }}>{t('home.testimonials.patientMoments', '📸 Patient Moments')}</h3>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {photos.map(p => (
            <div key={p.emoji} style={{ flex: 1, minWidth: 100, background: '#fff', borderRadius: 14, padding: '14px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', border: '1px solid #e8edf2' }}>
              <div style={{ fontSize: 36, marginBottom: 4 }}>{p.emoji}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)' }}>{p.label}</div>
            </div>
          ))}
        </div>

        <div className="videos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          {videos.map(v => (
            <div key={v.name} style={{ background: 'linear-gradient(135deg, #1866C9, #0F4A96)', borderRadius: 16, padding: '20px 16px', color: '#fff', cursor: 'pointer', transition: 'all 0.2s' }}
              className="video-card">
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, fontSize: 18 }}>▶</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{v.title}</div>
              <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 2 }}>{v.name}, {v.location}</div>
              <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 10, marginTop: 4 }}>{v.topic}</div>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: '#1a1a1a' }}>{t('home.testimonials.successStories', '🏆 Success Stories')}</h3>
        <div className="stories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 24 }}>
          {stories.map(s => (
            <div key={s.title} style={{ background: '#fff', borderRadius: 16, padding: '18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', border: '1px solid #e8edf2', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 24 }}>{s.icon}</span>
                <h4 style={{ fontSize: 13, fontWeight: 700 }}>{s.title}</h4>
              </div>
              <div style={{ fontSize: 11, lineHeight: 1.8 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}><span style={{ color: '#dc2626' }}>⬤</span> {t('home.testimonials.before', 'Before')}: {s.before}</div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}><span style={{ color: '#20B7F5' }}>⬤</span> {t('home.testimonials.process', 'Process')}: {s.after}</div>
                <div style={{ display: 'flex', gap: 6 }}><span style={{ color: '#16a34a' }}>⬤</span> {t('home.testimonials.result', 'Result')}: {s.result}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="testimonials-cta" style={{ textAlign: 'center', padding: '24px', background: 'linear-gradient(135deg, #0F5DA8, #00D9FF)', borderRadius: 16, color: '#fff' }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>{t('home.testimonials.cta.title', 'Join Thousands of Families Who Trust Jeevan HealthCare at Home')}</h3>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/diagnostics" className="btn btn-lg" style={{ background: '#FF3B30', border: 'none', color: '#fff', padding: '10px 24px', fontSize: 13 }}>{t('home.testimonials.cta.bookTest', '🔵 Book Health Test')}</Link>
            <button onClick={() => useUploadModal.getState().setOpen(true)} className="btn btn-lg" style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.5)', color: '#fff', padding: '10px 24px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>{t('home.testimonials.cta.upload', '📄 Upload Prescription')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsSection() {
  const t = useT();
  const stats = [
    { icon: '👨‍👩‍👧', value: 100000, suffix: '+', label: t('home.stats.patientsServed', 'Patients Served'), desc: t('home.stats.patientsServedDesc', 'Trusted by over one lakh patients for diagnostics and healthcare services.') },
    { icon: '🧪', value: 5000, suffix: '+', label: t('home.stats.testsAvailable', 'Tests Available'), desc: t('home.stats.testsAvailableDesc', 'Wide range of diagnostic tests covering preventive and specialized healthcare needs.') },
    { icon: '📦', value: 150, suffix: '+', label: t('home.stats.healthPackages', 'Health Packages'), desc: t('home.stats.healthPackagesDesc', 'Customized health checkup packages for individuals, families, and corporates.') },
    { icon: '❤️', value: 98, suffix: '%', label: t('home.stats.satisfiedPatients', 'Satisfied Patients'), desc: t('home.stats.satisfiedPatientsDesc', 'High patient satisfaction through quality service and reliable healthcare support.') },
    { icon: '🏆', value: 15, suffix: '+', label: t('home.stats.yearsOfExperience', 'Years of Healthcare Experience'), desc: t('home.stats.yearsOfExperienceDesc', 'Years of dedicated service delivering trusted healthcare solutions.') },
    { icon: '🏢', value: 100, suffix: '+', label: t('home.stats.corporateClients', 'Corporate Clients'), desc: t('home.stats.corporateClientsDesc', 'Supporting organizations with employee health checkups and wellness programs.') },
  ];
  const [visible, setVisible] = useState(false);
  const [counts, setCounts] = useState(stats.map(() => 0));
  const ref = useRef();
  const badges = [
    t('home.stats.badge.NABL', 'NABL Certified Labs'),
    t('home.stats.badge.trainedProfessionals', 'Trained Healthcare Professionals'),
    t('home.stats.badge.secureReports', 'Secure Digital Reports'),
    t('home.stats.badge.homeCollection', 'Home Collection Available'),
    t('home.stats.badge.doctorSupport', 'Doctor Support Available'),
  ];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const durations = [2000, 1500, 1200, 1000, 1000, 1200];
    const startTimes = stats.map(() => Date.now());
    const initial = stats.map(() => 0);
    const raf = () => {
      const now = Date.now();
      const next = stats.map((s, i) => {
        const elapsed = now - startTimes[i];
        const progress = Math.min(elapsed / durations[i], 1);
        return Math.round(progress * s.value);
      });
      setCounts(next);
      if (next.some((c, i) => c < stats[i].value)) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [visible]);

  return (
    <div className="page-section" style={{ background: 'linear-gradient(135deg, #0F5DA8 0%, #20B7F5 50%, #00D9FF 100%)', position: 'relative', overflow: 'hidden' }}>
      <div ref={ref} className="container" style={{ position: 'relative', zIndex: 1 }}>
        <h2 className="section-title text-center" style={{ color: '#fff' }}>{t('home.stats.sectionTitle', 'Trusted Healthcare Partner for Thousands of Families')}</h2>
        <p className="section-subtitle text-center" style={{ color: 'rgba(255,255,255,0.8)' }}>{t('home.stats.sectionSubtitle', 'Delivering reliable diagnostics and healthcare services with quality, convenience, and compassion.')}</p>
        <div className="grid-3" style={{ gap: 14, marginTop: 20 }}>
          {stats.map((s, i) => (
            <div key={s.label} className="stats-glass-card" style={{
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', borderRadius: 20, padding: '22px 16px', textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}>
              <div style={{ fontSize: 36, marginBottom: 8, lineHeight: 1 }}>{s.icon}</div>
              <div className="stats-counter" style={{ fontSize: 30, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                {counts[i].toLocaleString()}{s.suffix}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#FFD54F', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginTop: 20, marginBottom: 24 }}>
          {badges.map(b => (
            <span key={b} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: 20 }}>
              <span style={{ color: '#22C55E', fontSize: 12 }}>✓</span> {b}
            </span>
          ))}
        </div>
        <div style={{ textAlign: 'center', padding: '22px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.12)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{t('home.stats.cta.title', 'Experience Trusted Healthcare at Your Doorstep')}</h3>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/diagnostics" className="btn btn-lg" style={{ background: '#FF3B30', border: 'none', color: '#fff', padding: '10px 24px', fontSize: 13 }}>{t('home.stats.cta.bookTest', '🔵 Book Health Test')}</Link>
            <button onClick={() => useUploadModal.getState().setOpen(true)} className="btn btn-lg" style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.5)', color: '#fff', padding: '10px 24px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>{t('home.stats.cta.upload', '📄 Upload Prescription')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthLibrarySection() {
  const t = useT();
  const categories = [
    { icon: '🧪', label: t('home.healthLibrary.testsAZ', 'Tests A-Z'), desc: t('home.healthLibrary.testsAZDesc', '500+ diagnostic tests with normal ranges & preparation guides'), color: '#1866C9' },
    { icon: '🦠', label: t('home.healthLibrary.diseases', 'Diseases'), desc: t('home.healthLibrary.diseasesDesc', 'Diabetes, thyroid, heart disease & more health conditions'), color: '#dc2626' },
    { icon: '🤒', label: t('home.healthLibrary.symptomChecker', 'Symptom Checker'), desc: t('home.healthLibrary.symptomCheckerDesc', 'Check symptoms & find recommended diagnostic tests'), color: '#7c3aed' },
    { icon: '📝', label: t('home.healthLibrary.healthBlogs', 'Health Blogs'), desc: t('home.healthLibrary.healthBlogsDesc', 'Expert articles on preventive care, nutrition & wellness'), color: '#16a34a' },
    { icon: '📋', label: t('home.healthLibrary.preparationGuides', 'Preparation Guides'), desc: t('home.healthLibrary.preparationGuidesDesc', 'Fasting rules, medication guidance & test-day tips'), color: '#e65100' },
    { icon: '📊', label: t('home.healthLibrary.normalValues', 'Normal Values'), desc: t('home.healthLibrary.normalValuesDesc', 'Reference ranges for all lab tests by age & gender'), color: '#0891b2' },
  ];
  return (
    <div className="page-section" style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 22 }}>🩺</span>
          <h2 className="section-title" style={{ margin: 0, fontSize: 20 }}>{t('home.healthLibrary.title', 'Jeevan HealthCare at Home Library')}</h2>
        </div>
        <p className="section-subtitle text-center">{t('home.healthLibrary.subtitle', 'Your trusted source for medical information, diagnostic test details, health tips, and expert guidance.')}</p>
        <div style={{ maxWidth: 540, margin: '0 auto 20px' }}>
          <SmartSearch placeholder={t('home.healthLibrary.searchPlaceholder', '🔍 Search health topics, tests, symptoms, diseases...')} />
        </div>
        <div className="grid-3" style={{ gap: 12 }}>
          {categories.map(c => (
            <Link key={c.label} to="/health-library" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#f8f9fa', borderRadius: 14, border: '1px solid #e8edf2', transition: 'all 0.2s' }}
                className="hl-cat-card">
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${c.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>
                  {c.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 2 }}>{c.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{c.desc}</div>
                </div>
                <span style={{ color: '#ccc', fontSize: 16 }}>→</span>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/health-library" className="btn btn-primary btn-lg" style={{ fontSize: 13, padding: '10px 28px' }}>{t('home.healthLibrary.explore', '🔵 Explore Health Library')}</Link>
        </div>
      </div>
    </div>
  );
}

function FaqSection() {
  const t = useT();
  const faqs = useCmsStore(s => s.content?.faqs);
  const items = (faqs || []).length > 0 ? faqs : [
    { question: t('home.faq.q1', 'How do I book a test?'), answer: t('home.faq.a1', 'Simply search for the test you need, select a convenient time slot, and our phlebotomist will visit your home for sample collection.') },
    { question: t('home.faq.q2', 'Is home sample collection free?'), answer: t('home.faq.a2', 'Yes, home sample collection is completely free for all tests and packages booked through our platform.') },
    { question: t('home.faq.q3', 'How will I receive my reports?'), answer: t('home.faq.a3', 'Reports are delivered via WhatsApp, Email, and can be downloaded from your account on our website.') },
    { question: t('home.faq.q4', 'Are your labs certified?'), answer: t('home.faq.a4', 'All our partner labs are NABL-accredited and use state-of-the-art equipment for accurate results.') },
    { question: t('home.faq.q5', 'Can I cancel or reschedule?'), answer: t('home.faq.a5', 'Yes, you can cancel or reschedule your booking up to 2 hours before the scheduled collection time.') },
  ];
  return (
    <div className="page-section" style={{ background: '#FFFFFF' }}>
      <div className="container" style={{ maxWidth: 700, margin: '0 auto' }}>
        <h2 className="section-title text-center">{t('home.faq.title', 'Frequently Asked Questions')}</h2>
        <p className="section-subtitle text-center">{t('home.faq.subtitle', 'Everything you need to know')}</p>
        <div style={{ marginTop: 16 }}>
          {items.map((faq, i) => (
            <details key={i} style={{ marginBottom: 8, border: '1px solid var(--border)', borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
              <summary style={{ padding: '12px 16px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>{faq.question || faq.q}</summary>
              <p style={{ padding: '0 16px 12px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{faq.answer || faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

function NurseAtHomeSection() {
  const t = useT();
  const cats = nursingCategories.filter(c => ['wound-care', 'injections', 'elderly-care', 'bedside', 'mother-baby'].includes(c.id));
  const nCount = nurses.length;
  const sCount = nursingServices.length;
  return (
    <div className="page-section" style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)', overflow: 'hidden' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 26 }}>👩‍⚕️</span>
          <h2 className="section-title" style={{ margin: 0, fontSize: 22 }}>{t('home.nurseAtHome.title', 'Nurse at Home — Professional Care at Your Doorstep')}</h2>
        </div>
        <p className="section-subtitle text-center">{t('home.nurseAtHome.subtitle', 'Skilled nurses for wound care, injections, elderly support, ICU at home & more. Same-day service across Hyderabad.')}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {[
            { icon: '👩‍⚕️', label: nCount + '+ Nurses' },
            { icon: '🩺', label: sCount + '+ Services' },
            { icon: '🏠', label: 'Same-day Availability' },
            { icon: '⭐', label: '4.8\u2605 Rating' },
          ].map(s => (
            <span key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#0D9488', background: 'rgba(13,148,136,0.08)', padding: '5px 12px', borderRadius: 20 }}>
              {s.icon} {s.label}
            </span>
          ))}
        </div>
        <div className="nh-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {cats.map(c => (
            <Link key={c.id} to={`/nurse-at-home/book?cat=${c.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff', borderRadius: 16, padding: '18px 12px', textAlign: 'center', border: '1px solid #e8edf2', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.15s', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                className="nh-cat-card">
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{c.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>{t(`nurse.cat.${c.id}`, c.name)}</div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.3 }}>{c.services.slice(0, 3).join(' · ')}</div>
              </div>
            </Link>
          ))}
          <Link to="/nurse-at-home" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'linear-gradient(135deg, #0D9488, #14B8A6)', borderRadius: 16, padding: '18px 12px', textAlign: 'center', boxShadow: '0 4px 16px rgba(13,148,136,0.2)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <span style={{ fontSize: 28 }}>📋</span>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{t('home.nurseAtHome.viewAll', 'View All Services')}</div>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>→</span>
            </div>
          </Link>
        </div>
        <div className="nh-cta" style={{ textAlign: 'center', marginTop: 24, padding: '22px', background: 'linear-gradient(135deg, #0D9488, #0F766E)', borderRadius: 16, color: '#fff' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{t('home.nurseAtHome.cta.title', 'Need a Nurse at Home? Book in 2 Minutes')}</h3>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/nurse-at-home/book" className="btn btn-lg" style={{ background: '#F59E0B', border: 'none', color: '#fff', padding: '10px 24px', fontSize: 13, fontWeight: 700, borderRadius: 10 }}>{t('home.nurseAtHome.cta.book', '📅 Book a Nurse')}</Link>
            <a href="tel:+919700104108" className="btn btn-lg" style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.5)', color: '#fff', padding: '10px 24px', fontSize: 13, fontWeight: 600, borderRadius: 10, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>📞 {t('home.nurseAtHome.cta.call', 'Call Care Manager')}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function WhyChooseJeevan() {
  const t = useT();
  const features = [
    { icon: '🏅', title: t('home.whyChoose.feature.NABL.title', 'NABL Certified Labs'), desc: t('home.whyChoose.feature.NABL.desc', 'Advanced testing facilities following strict quality standards for accurate and reliable results.'), badge: t('home.whyChoose.feature.NABL.badge', 'Quality Assured Reports') },
    { icon: '🩺', title: t('home.whyChoose.feature.phlebotomists.title', 'Expert Phlebotomists'), desc: t('home.whyChoose.feature.phlebotomists.desc', 'Trained healthcare professionals ensuring safe, hygienic, and painless sample collection.'), badge: t('home.whyChoose.feature.phlebotomists.badge', 'Trained Professionals') },
    { icon: '🏠', title: t('home.whyChoose.feature.homeCollection.title', 'Convenient Home Collection'), desc: t('home.whyChoose.feature.homeCollection.desc', 'Book lab tests from your home without waiting in queues or visiting diagnostic centers.'), badge: t('home.whyChoose.feature.homeCollection.badge', 'Available 7 Days a Week') },
    { icon: '💰', title: t('home.whyChoose.feature.pricing.title', 'Affordable Pricing'), desc: t('home.whyChoose.feature.pricing.desc', 'Transparent pricing with quality diagnostics at competitive rates. No hidden charges.'), badge: t('home.whyChoose.feature.pricing.badge', 'No Hidden Charges') },
    { icon: '📱', title: t('home.whyChoose.feature.digitalReports.title', 'Digital Reports'), desc: t('home.whyChoose.feature.digitalReports.desc', 'Receive secure reports online anytime through WhatsApp, email, or patient dashboard.'), badge: t('home.whyChoose.feature.digitalReports.badge', 'Anytime Access') },
    { icon: '👨‍⚕️', title: t('home.whyChoose.feature.doctorConsult.title', 'Doctor Consultation'), desc: t('home.whyChoose.feature.doctorConsult.desc', 'Get expert medical guidance and understand your health reports better.'), badge: t('home.whyChoose.feature.doctorConsult.badge', 'Expert Medical Support') },
    { icon: '👨‍👩‍👧', title: t('home.whyChoose.feature.familyCare.title', 'Complete Family Care'), desc: t('home.whyChoose.feature.familyCare.desc', 'Manage healthcare needs for parents, children, and loved ones under one platform.'), badge: t('home.whyChoose.feature.familyCare.badge', 'Family Health Records') },
    { icon: '🛡️', title: t('home.whyChoose.feature.safety.title', 'Safe & Hygienic Collection'), desc: t('home.whyChoose.feature.safety.desc', 'Strict safety protocols with sterile equipment and infection control practices.'), badge: t('home.whyChoose.feature.safety.badge', 'Safety First') },
  ];
  return (
    <div className="page-section" style={{ background: '#FFFFFF' }}>
      <div className="container">
        <div className="grid-4" style={{ gap: 12, marginBottom: 20 }}>
          {[
            { label: t('home.whyChoose.stat.years', '10+ Years'), sub: t('home.whyChoose.stat.experience', 'Experience') },
            { label: t('home.whyChoose.stat.collections', '2 Lakh+'), sub: t('home.whyChoose.stat.homeCollections', 'Home Collections') },
            { label: t('home.whyChoose.stat.corporate', '500+'), sub: t('home.whyChoose.stat.corporateClients', 'Corporate Clients') },
            { label: t('home.whyChoose.stat.tests', '2000+'), sub: t('home.whyChoose.stat.diagnosticTests', 'Diagnostic Tests') },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 14, padding: '16px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', border: '1px solid #e8edf2' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1866C9', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <h2 className="section-title text-center">{t('home.whyChoose.sectionTitle', 'Why Thousands of Families Trust Jeevan HealthCare at Home')}</h2>
        <p className="section-subtitle text-center">{t('home.whyChoose.sectionSubtitle', 'Reliable diagnostics, expert healthcare professionals, and convenient home healthcare services designed around your family\'s needs.')}</p>
        <div className="grid-4" style={{ gap: 14, marginTop: 20 }}>
          {features.map(f => (
            <div key={f.title} className="trust-feature-card" style={{
              background: '#fff', borderRadius: 20, padding: '24px 18px', textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e8edf2',
              transition: 'all 0.2s',
            }}>
              <div style={{ fontSize: 48, marginBottom: 12, lineHeight: 1 }}>{f.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: '#1a1a1a' }}>{f.title}</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>{f.desc}</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#f0fdf4', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: '#16a34a' }}>
                ✔ {f.badge}
              </div>
            </div>
          ))}
        </div>
          <div style={{ textAlign: 'center', marginTop: 32, padding: '28px', background: 'linear-gradient(135deg, #0F5DA8, #20B7F5)', borderRadius: 20, color: '#fff' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>{t('home.whyChoose.cta.title', 'Experience Trusted Healthcare at Your Doorstep')}</h3>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/diagnostics" className="btn btn-lg" style={{ background: '#FF3B30', border: 'none', color: '#fff', padding: '12px 28px', fontSize: 14 }}>{t('home.whyChoose.cta.bookTest', '🔵 Book Health Test Now')}</Link>
            <button onClick={() => useUploadModal.getState().setOpen(true)} className="btn btn-lg" style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.5)', color: '#fff', padding: '12px 28px', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>{t('home.whyChoose.cta.upload', '📄 Upload Prescription')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
