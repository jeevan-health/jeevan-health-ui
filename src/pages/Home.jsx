import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useT } from '../i18n/LanguageProvider';
import { Link } from 'react-router-dom';
import useUploadModal from '../stores/uploadModalStore';
import { seedTests, subscribe, ensureLoaded, getPopularTests, getCategoriesSorted, makeSlug } from '../data/seedData';
import { packageList, ensurePackagesLoaded, subscribePackages } from '../data/healthPackages';
import SmartSearch from '../components/layout/SmartSearch';
import TestCard from '../components/TestCard';
import useCmsStore from '../stores/cmsStore';
import { nursingCategories, nurses, nursingServices } from '../data/nursingData';

export default function Home() {
  const t = useT();
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    ensureLoaded();
    ensurePackagesLoaded();
    const unsub1 = subscribe(() => forceUpdate(n => n + 1));
    const unsub2 = subscribePackages(() => forceUpdate(n => n + 1));
    return () => { unsub1(); unsub2(); };
  }, []);
  // Prefer well-known popular names from Neon catalog (not first alphabetical rows)
  const popular = getPopularTests(8);
  const pkgs = packageList.slice(0, 4);
  const cms = useCmsStore();
  const featured = cms.content?.healthPackages?.featured || [];
  const liveCategories = getCategoriesSorted(15);

  return (
    <div className="home-page-root">
      <HeroSection />
      <TrustStrip />
      <QuickActions />
      <PopularTests popular={popular} catalogCount={seedTests.length} />
      <CategoriesSection liveCategories={liveCategories} />
      <PackagesSection pkgs={pkgs} featured={featured} />
      <NurseAtHomeSection />
      <WhyChooseJeevan />
      <HowItWorks />
      <StatsSection />
      <Testimonials />
      <HealthLibrarySection />
      <FaqSection />
      <style>{`
        /* ── Home hero redesign (beats global .hero rules) ── */
        .hero.home-hero {
          position: relative; z-index: 30; overflow: visible;
          text-align: left; color: #fff;
          background: linear-gradient(145deg, #0B4F96 0%, #0F5DA8 28%, #1866C9 62%, #1A7AD4 100%);
          padding: 52px 16px 56px;
        }
        .hero.home-hero::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 55% 70% at 100% 0%, rgba(0, 217, 255, 0.18) 0%, transparent 55%),
            radial-gradient(ellipse 40% 50% at 0% 100%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
        }
        .hero.home-hero::after {
          content: ''; position: absolute; right: -80px; top: -60px; width: 320px; height: 320px;
          border-radius: 50%; border: 1px solid rgba(255,255,255,0.08); pointer-events: none;
        }
        .home-hero-grid {
          display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px;
          align-items: center; max-width: 1120px; margin: 0 auto; position: relative; z-index: 2;
        }
        .home-hero-copy { min-width: 0; position: relative; z-index: 2; }
        .home-hero-stats {
          display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px;
          margin-bottom: 20px;
        }
        .home-hero-stat {
          display: flex; flex-direction: column; gap: 2px;
          padding: 10px 12px; border-radius: 14px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.14);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          min-width: 0;
        }
        .home-hero-stat-icon { font-size: 16px; line-height: 1; margin-bottom: 2px; }
        .home-hero-stat-label {
          font-size: 13px; font-weight: 800; color: #fff; letter-spacing: -0.2px;
          line-height: 1.2;
        }
        .home-hero-stat-sub {
          font-size: 10px; font-weight: 500; color: rgba(255,255,255,0.72);
          line-height: 1.25;
        }
        .home-hero-eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
          color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.16); border-radius: 999px;
          padding: 5px 12px; margin-bottom: 14px;
        }
        .home-hero-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #4ade80;
          box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.25);
        }
        .hero.home-hero h1 {
          font-size: clamp(26px, 3.6vw, 40px); font-weight: 800; color: #fff;
          line-height: 1.18; margin: 0 0 12px; letter-spacing: -0.6px;
          max-width: 16em; text-align: left;
        }
        .hero.home-hero .home-hero-sub {
          font-size: 15px; color: rgba(255,255,255,0.88); margin: 0 0 22px;
          line-height: 1.65; max-width: 46ch; opacity: 1;
          text-align: left; margin-left: 0; margin-right: 0;
        }
        .home-hero-ctas {
          display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; align-items: center;
        }
        .home-hero-cta-primary {
          background: #FF3B30 !important; border: none !important; color: #fff !important;
          font-size: 14px !important; font-weight: 700 !important;
          padding: 12px 22px !important; min-height: 48px; border-radius: 12px !important;
          box-shadow: 0 8px 20px rgba(255, 59, 48, 0.35);
        }
        .home-hero-cta-primary:hover { filter: brightness(1.05); }
        .home-hero-cta-secondary {
          color: #fff !important; border: 1.5px solid rgba(255,255,255,0.55) !important;
          background: rgba(255,255,255,0.1) !important;
          font-size: 14px !important; font-weight: 600 !important;
          padding: 12px 18px !important; min-height: 48px; border-radius: 12px !important;
          display: inline-flex; align-items: center; gap: 6px;
          cursor: pointer; font-family: inherit;
        }
        .home-hero-cta-secondary:hover { background: rgba(255,255,255,0.16) !important; }
        .home-hero-cta-tertiary {
          color: rgba(255,255,255,0.95) !important;
          border: 1px solid rgba(255,255,255,0.28) !important;
          background: transparent !important;
          font-size: 13px !important; font-weight: 600 !important;
          padding: 10px 16px !important; min-height: 44px; border-radius: 12px !important;
          display: inline-flex; align-items: center;
        }
        .home-hero-cta-tertiary:hover { background: rgba(255,255,255,0.08) !important; }
        .home-hero-search {
          margin-bottom: 18px; max-width: 520px; position: relative; z-index: 50; overflow: visible;
        }
        .home-hero-search .smart-search-root > div:first-child {
          border-radius: 14px !important; border-width: 0 !important;
          box-shadow: 0 10px 28px rgba(8, 40, 80, 0.22);
        }
        .home-hero-proof {
          display: inline-flex; align-items: center; gap: 10px; flex-wrap: wrap;
          background: rgba(0,0,0,0.12); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px; padding: 8px 14px 8px 10px;
        }
        .home-hero-stars { display: flex; gap: 1px; }
        .home-hero-stars span { font-size: 13px; color: #FFD54F; line-height: 1; }
        .home-hero-rating { font-size: 13px; font-weight: 800; color: #fff; }
        .home-hero-rating-label { font-size: 12px; color: rgba(255,255,255,0.78); font-weight: 500; }
        .home-hero-proof-sep { width: 1px; height: 14px; background: rgba(255,255,255,0.22); }
        .home-hero-side {
          display: flex; flex-direction: column; gap: 10px;
        }
        .home-hero-feature {
          display: flex; align-items: center; gap: 12px;
          padding: 13px 14px; border-radius: 14px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: background 0.15s, transform 0.15s, border-color 0.15s;
          text-decoration: none;
        }
        .home-hero-feature:hover {
          background: rgba(255,255,255,0.16);
          border-color: rgba(255,255,255,0.22);
          transform: translateY(-1px);
        }
        .home-hero-feature-icon {
          width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 18px;
          background: rgba(255,255,255,0.14);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
        }
        .home-hero-feature-body { flex: 1; min-width: 0; }
        .home-hero-feature-label { font-size: 13px; font-weight: 700; color: #fff; line-height: 1.25; }
        .home-hero-feature-desc { font-size: 11px; color: rgba(255,255,255,0.72); line-height: 1.35; margin-top: 2px; }
        .home-hero-feature-arrow { color: rgba(255,255,255,0.45); font-size: 16px; flex-shrink: 0; }

        /* ── Landing page sections ── */
        .home-page-root { --home-bottom-bar: 64px; }
        .home-popular-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; align-items: stretch; }
        .home-cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; }
        .home-section-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 18px; flex-wrap: wrap; gap: 10px; }
        .home-section-head .section-title { margin: 0; }
        .home-section-head .section-subtitle { margin: 4px 0 0; }
        .home-page-section { scroll-margin-top: 72px; }
        .home-faq details { transition: border-color 0.15s; }
        .home-faq details[open] { border-color: #cbd5e1; box-shadow: 0 2px 10px rgba(15,23,42,0.04); }
        .home-faq summary { list-style: none; display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 48px; cursor: pointer; }
        .home-faq summary::-webkit-details-marker { display: none; }
        .home-faq summary::after { content: '+'; font-size: 18px; font-weight: 500; color: #1866C9; flex-shrink: 0; }
        .home-faq details[open] summary::after { content: '−'; }
        .home-services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        /* 4 how-it-works steps — not 6 empty columns */
        .home-timeline-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .home-nh-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
        .home-why-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .home-trust-scroll { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; align-items: center; }
        .home-pkg-empty, .home-empty-soft {
          text-align: center; padding: 36px 20px; border-radius: 14px; border: 1px dashed #cbd5e1;
          background: #fafbfc; color: #64748b; font-size: 13px;
        }
        .home-sticky-cta {
          display: none; position: fixed; left: 0; right: 0;
          bottom: calc(var(--home-bottom-bar) + env(safe-area-inset-bottom, 0px));
          z-index: 8990; padding: 8px 12px; background: rgba(255,255,255,0.97);
          border-top: 1px solid #e8edf2; box-shadow: 0 -4px 16px rgba(15,23,42,0.06);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
        }
        .home-sticky-cta-inner { display: flex; gap: 8px; max-width: 480px; margin: 0 auto; }
        .home-sticky-cta a, .home-sticky-cta button {
          flex: 1; min-height: 44px; border-radius: 12px; font-weight: 700; font-size: 13px;
          display: flex; align-items: center; justify-content: center; font-family: inherit; cursor: pointer;
          text-decoration: none; border: none;
        }
        .home-sticky-cta a:focus-visible, .home-sticky-cta button:focus-visible,
        .home-hero-feature:focus-visible, .home-hero-cta-primary:focus-visible {
          outline: 2px solid #FFD54F; outline-offset: 2px;
        }
        body.mobile-nav-open .home-sticky-cta { display: none !important; }
        @media (max-width: 768px) {
          /* room for sticky CTA (~60) + bottom bar (64) + safe area */
          .home-page-root { padding-bottom: calc(120px + env(safe-area-inset-bottom, 0px)); }
        }

        @media (max-width: 1100px) {
          .home-timeline-grid { grid-template-columns: repeat(2, 1fr); }
          .home-nh-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 900px) {
          .hero.home-hero { padding: 40px 16px 44px; }
          .home-hero-grid { grid-template-columns: 1fr; gap: 22px; }
          .hero.home-hero h1 { max-width: none; font-size: clamp(24px, 5.5vw, 32px); }
          .home-hero-side { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
          .home-popular-grid { grid-template-columns: repeat(2, 1fr); }
          .home-services-grid { grid-template-columns: repeat(2, 1fr); }
          .home-why-grid { grid-template-columns: repeat(2, 1fr); }
          .testimonials-layout { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .hero.home-hero { padding: 32px 14px 36px; }
          .home-hero-stats { grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 16px; }
          .home-hero-stat { padding: 10px 12px; border-radius: 12px; }
          .home-hero-stat-label { font-size: 14px; }
          .hero.home-hero .home-hero-sub { font-size: 14px; margin-bottom: 16px; }
          .home-hero-ctas { gap: 8px; margin-bottom: 14px; }
          .home-hero-cta-primary,
          .home-hero-cta-secondary { flex: 1 1 calc(50% - 4px); justify-content: center; min-height: 46px; }
          .home-hero-cta-tertiary { flex: 1 1 100%; justify-content: center; min-height: 42px; }
          .home-hero-search { max-width: none; margin-bottom: 14px; }
          .home-hero-search .smart-search-root > div:first-child { border-radius: 12px !important; }
          .home-hero-proof { width: 100%; justify-content: center; border-radius: 12px; padding: 10px 12px; }
          .home-hero-side { grid-template-columns: 1fr 1fr; }
          .home-hero-feature { padding: 12px; border-radius: 12px; min-height: 56px; }
          .home-hero-feature-icon { width: 36px; height: 36px; border-radius: 10px; font-size: 16px; }
          .home-hero-feature-arrow { display: none; }
          .hero-search { border-radius: 12px !important; }
          .home-qa-mobile { display: block !important; padding: 0 12px 8px; margin-top: 0; }
          .home-qa-desktop { display: none !important; }
          .home-sticky-cta { display: block; }
          .home-trust-scroll {
            flex-wrap: nowrap; justify-content: flex-start; overflow-x: auto;
            -webkit-overflow-scrolling: touch; scrollbar-width: none;
            padding-bottom: 2px; mask-image: linear-gradient(to right, #000 88%, transparent);
          }
          .home-trust-scroll::-webkit-scrollbar { display: none; }
          .home-trust-scroll > span { flex-shrink: 0; }
          .home-timeline-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
          .home-timeline-grid .timeline-card { min-height: auto !important; }
          .timeline-line { display: none !important; }
          .home-nh-grid { grid-template-columns: 1fr 1fr; }
          .home-section-head { flex-direction: column; align-items: flex-start !important; }
          .home-section-head .btn { align-self: stretch; text-align: center; justify-content: center; }
          .page-section { padding: 28px 0 !important; }
          .section-title { font-size: 20px !important; }
          .section-subtitle { font-size: 13px !important; margin-bottom: 14px !important; }
          /* packages: horizontal snap scroll for readable cards */
          .home-pkg-scroll {
            display: flex !important; gap: 12px; overflow-x: auto; -webkit-overflow-scrolling: touch;
            scroll-snap-type: x mandatory; padding-bottom: 6px; margin: 0 -4px;
            scrollbar-width: none;
          }
          .home-pkg-scroll::-webkit-scrollbar { display: none; }
          .home-pkg-scroll > * { flex: 0 0 min(78vw, 280px); scroll-snap-align: start; max-width: 300px; }
          .home-popular-grid.home-pkg-scroll { grid-template-columns: none; }
        }
        @media (max-width: 600px) {
          .hero.home-hero { padding: 28px 12px 32px; }
          .hero.home-hero h1 { font-size: 22px; letter-spacing: -0.4px; }
          .hero.home-hero .home-hero-sub { font-size: 13px; line-height: 1.55; }
          .home-hero-eyebrow { font-size: 10px; margin-bottom: 12px; }
          .home-hero-stat-label { font-size: 13px; }
          .home-hero-stat-sub { font-size: 10px; }
          .home-hero-cta-primary, .home-hero-cta-secondary { font-size: 13px !important; padding: 11px 14px !important; }
          .trust-strip-inner span { font-size: 11px !important; padding: 6px 10px !important; }
          .home-qa-mobile { padding: 0 8px 8px; }
          .home-cat-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; }
          .home-services-grid { grid-template-columns: 1fr; }
          .home-why-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
          .stats-glass-card { padding: 16px 12px !important; }
        }
        @media (max-width: 480px) {
          .hero.home-hero { padding: 24px 12px 28px; }
          .hero.home-hero h1 { font-size: 20px; }
          .home-hero-stats { gap: 6px; }
          .home-hero-stat { padding: 9px 10px; }
          .home-hero-feature-desc { display: none; }
          .home-hero-feature { justify-content: flex-start; }
          .home-hero-feature-label { font-size: 12px; }
          /* keep 2-col for tests — 1-col was too long to scroll */
          .home-popular-grid:not(.home-pkg-scroll) { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .home-timeline-grid { grid-template-columns: 1fr 1fr; }
          .home-cat-grid { grid-template-columns: repeat(2, 1fr); }
          .home-why-grid { grid-template-columns: 1fr; }
          .home-nh-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
          .how-cta .btn, .testimonials-cta .btn, .why-cta-section .btn, .nh-cta .btn { width: 100% !important; }
          .how-cta, .testimonials-cta, .nh-cta { padding: 18px 14px !important; }
          .how-cta > div, .testimonials-cta > div { width: 100%; flex-direction: column; }
        }
        @media (hover: none) {
          .home-hero-feature:hover { transform: none; }
        }
      `}</style>
      {/* Mobile sticky book CTA above bottom nav */}
      <div className="home-sticky-cta" aria-label="Quick book">
        <div className="home-sticky-cta-inner">
          <Link to="/diagnostics" style={{ background: '#FF3B30', color: '#fff' }}>{t('home.sticky.book', 'Book Lab Test')}</Link>
          <button type="button" onClick={() => useUploadModal.getState().setOpen(true)} style={{ background: '#fff', color: '#1866C9', border: '1.5px solid #1866C9' }}>{t('home.sticky.upload', 'Upload Rx')}</button>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  const t = useT();
  const hero = useCmsStore(s => s.content?.hero);
  const h = hero || {};
  if (h.active === false) return null;

  const defaultStats = [
    { icon: '🧪', label: '5000+', sublabel: t('home.hero.statBadges.testsSub', 'Tests') },
    { icon: '🏠', label: t('home.hero.statBadges.freeHome', 'Free Home'), sublabel: t('home.hero.statBadges.collection', 'Collection') },
    { icon: '🏅', label: t('home.hero.statBadges.nabl', 'NABL Certified'), sublabel: t('home.hero.statBadges.labs', 'Labs') },
    { icon: '⏱️', label: t('home.hero.statBadges.reportsIn', 'Reports in'), sublabel: t('home.hero.statBadges.hours', '24 Hours') },
  ];
  const statBadges = (Array.isArray(h.statBadges) && h.statBadges.length > 0 ? h.statBadges : defaultStats).map((s, i) => ({
    icon: s.icon || defaultStats[i]?.icon || '🔬',
    label: s.label || defaultStats[i]?.label || '',
    sublabel: s.sublabel || defaultStats[i]?.sublabel || '',
  }));

  // Map CMS icons (often missing path) → real public routes
  const FEATURE_ROUTE_MAP = {
    family: { path: '/health-packages', desc: 'Book tests & packages for your family', color: '#7c3aed' },
    doctor: { path: '/consult-doctor', desc: 'Consult top doctors online or at home', color: '#1866C9' },
    'doctor consultation': { path: '/consult-doctor', desc: 'Consult top doctors online or at home', color: '#1866C9' },
    phlebotomist: { path: '/diagnostics', desc: 'Free home sample collection', color: '#0d9488' },
    'senior citizen': { path: '/package/senior-citizen', desc: 'Special packages for age 60+', color: '#c2410c' },
    senior: { path: '/package/senior-citizen', desc: 'Special packages for age 60+', color: '#c2410c' },
    diagnostics: { path: '/diagnostics', desc: '5000+ lab tests at your doorstep', color: '#0F5DA8' },
    nursing: { path: '/nurse-at-home', desc: 'Skilled nursing care at home', color: '#0891b2' },
    physiotherapy: { path: '/physiotherapy', desc: 'Recover with expert physiotherapists', color: '#16a34a' },
    vaccination: { path: '/vaccination', desc: 'Vaccination for all age groups & travel', color: '#dc2626' },
    pharmacy: { path: '/contact', desc: 'Medicines delivered to your home', color: '#e65100' },
  };

  const defaultFeatures = [
    { icon: '👪', label: 'Family', desc: 'Book tests & packages for your family', path: '/health-packages', color: '#7c3aed' },
    { icon: '🩺', label: 'Doctor', desc: 'Consult top doctors online or at home', path: '/consult-doctor', color: '#1866C9' },
    { icon: '💉', label: 'Phlebotomist', desc: 'Free home sample collection', path: '/diagnostics', color: '#0d9488' },
    { icon: '👴', label: 'Senior Citizen', desc: 'Special packages for age 60+', path: '/package/senior-citizen', color: '#c2410c' },
  ];

  const featureIcons = (Array.isArray(h.featureIcons) && h.featureIcons.length > 0 ? h.featureIcons : defaultFeatures).map(f => {
    const key = String(f.label || '').toLowerCase().trim();
    const mapped = FEATURE_ROUTE_MAP[key] || {};
    // Never use staff portals for marketing tiles
    let path = f.path || f.link || mapped.path || '/diagnostics';
    if (path.startsWith('/phlebotomist') || path.startsWith('/admin') || path === '/book-appointment') {
      path = mapped.path || '/diagnostics';
    }
    return {
      icon: f.icon || '🔬',
      label: f.label || 'Service',
      desc: f.desc || f.description || mapped.desc || '',
      path,
      color: f.color || mapped.color || '#1866C9',
    };
  });

  const headingRaw = h.heading || t('home.hero.heading', 'Your Health, Our Priority — Trusted Diagnostics at Your Doorstep');
  // Prefer a cleaner break on em-dash for long CMS titles
  const headingHtml = String(headingRaw).includes('<')
    ? String(headingRaw)
    : String(headingRaw)
      .replace(/\s*[—–]\s*/g, '<br />')
      .replace(/\n/g, '<br />');

  const bgStyle = h.backgroundImage
    ? { backgroundImage: `linear-gradient(145deg, rgba(11,79,150,0.88) 0%, rgba(15,93,168,0.82) 40%, rgba(26,122,212,0.78) 100%), url(${h.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined;

  return (
    <section className="hero home-hero" style={bgStyle} aria-label={t('home.hero.aria', 'Book lab tests at home')}>
      <div className="container home-hero-grid">
        <div className="home-hero-copy">
          <div className="home-hero-eyebrow">
            <span className="home-hero-eyebrow-dot" aria-hidden />
            {t('home.hero.eyebrow', 'Trusted diagnostics at your doorstep')}
          </div>

          <div className="home-hero-stats" role="list" aria-label={t('home.hero.statsAria', 'Key highlights')}>
            {statBadges.map((s) => (
              <div key={`${s.label}-${s.sublabel}`} className="home-hero-stat" role="listitem">
                <span className="home-hero-stat-icon" aria-hidden>{s.icon}</span>
                <span className="home-hero-stat-label">{s.label}</span>
                {s.sublabel ? <span className="home-hero-stat-sub">{s.sublabel}</span> : null}
              </div>
            ))}
          </div>

          <h1 dangerouslySetInnerHTML={{ __html: headingHtml }} />
          <p className="home-hero-sub">
            {h.subheading || t('home.hero.subheading', 'Book lab tests from home with free sample collection. 5000+ tests, NABL certified labs, reports in 24 hours.')}
          </p>

          <div className="home-hero-ctas">
            <Link to={h.ctaLink || '/diagnostics'} className="btn btn-primary btn-lg home-hero-cta-primary">
              {h.ctaText || t('home.hero.cta', 'Book Lab Tests')}
            </Link>
            <button
              type="button"
              onClick={() => useUploadModal.getState().setOpen(true)}
              className="btn btn-outline btn-lg home-hero-cta-secondary"
            >
              {h.ctaSecondaryText || t('home.hero.ctaSecondary', 'Upload Prescription')}
            </button>
            <Link to={h.ctaTertiaryLink || '/health-packages'} className="btn btn-outline home-hero-cta-tertiary">
              {h.ctaTertiaryText || t('home.hero.ctaTertiary', 'Book Health Package')}
            </Link>
          </div>

          <div className="home-hero-search hero-search-slot">
            <SmartSearch placeholder={t('home.hero.searchPlaceholder', 'Search tests, symptoms, diseases...')} />
          </div>

          <div className="home-hero-proof">
            <div className="home-hero-stars" aria-label={`${h.rating || '4.9'} stars`}>
              {[1, 2, 3, 4, 5].map((i) => <span key={i}>★</span>)}
            </div>
            <span className="home-hero-rating">{h.rating || '4.9'}</span>
            <span className="home-hero-proof-sep" aria-hidden />
            <span className="home-hero-rating-label">
              {h.ratingLabel || t('home.hero.ratingLabel', '50,000+ Happy Patients')}
            </span>
          </div>
        </div>

        <div className="home-hero-side" aria-label={t('home.hero.servicesAria', 'Popular services')}>
          {featureIcons.map((f) => (
            <Link key={f.label} to={f.path || '/diagnostics'} className="home-hero-feature">
              <div className="home-hero-feature-icon" style={{ boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.08), 0 0 0 2px ${f.color}33` }}>
                {f.icon}
              </div>
              <div className="home-hero-feature-body">
                <div className="home-hero-feature-label">{f.label}</div>
                {f.desc ? <div className="home-hero-feature-desc">{f.desc}</div> : null}
              </div>
              <span className="home-hero-feature-arrow" aria-hidden>→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
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
    <div style={{ background: '#fff', borderBottom: '1px solid #eef2f7', padding: '12px 0' }}>
      <div className="container home-trust-scroll trust-strip-inner">
        {items.map(item => (
          <span key={item.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 500, color: '#475569', padding: '6px 12px', background: '#f8fafc', borderRadius: 999, border: '1px solid #eef2f7' }}>
            <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 11 }} aria-hidden>{item.icon || '✔'}</span> {item.label}
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
  const mobileTiles = [
    { to: '/diagnostics', icon: '🧪', label: t('home.quickActions.mobile.bookTest', 'Book Test'), sub: t('home.quickActions.mobile.homeCollection', 'Home Collection') },
    { to: null, icon: '📄', label: t('home.quickActions.mobile.upload', 'Upload Rx'), sub: t('home.quickActions.mobile.prescription', 'Prescription'), upload: true },
    { to: '/health-packages', icon: '📦', label: t('home.quickActions.mobile.packages', 'Packages'), sub: t('home.quickActions.mobile.packagesSub', 'Full body & more') },
    { to: '/consult-doctor', icon: '🩺', label: t('home.quickActions.mobile.doctor', 'Doctor'), sub: t('home.quickActions.mobile.doctorSub', 'Online consult') },
    { to: '/nurse-at-home', icon: '👩‍⚕️', label: t('home.quickActions.mobile.nursing', 'Nursing'), sub: t('home.quickActions.mobile.nursingSub', 'Care at home') },
    { to: '/physiotherapy', icon: '💪', label: t('home.quickActions.mobile.physio', 'Physio'), sub: t('home.quickActions.mobile.physioSub', 'Home rehab') },
    { to: '/vaccination', icon: '💉', label: t('home.quickActions.mobile.vaccine', 'Vaccines'), sub: t('home.quickActions.mobile.vaccineSub', 'At home') },
    { to: '/services', icon: '➕', label: t('home.quickActions.mobile.more', 'All services'), sub: t('home.quickActions.mobile.moreSub', 'Browse full list') },
  ];

  return (
    <div className="page-section home-page-section" style={{ background: '#F8FAFC', paddingTop: 20, paddingBottom: 28 }}>
      {/* Mobile-only quick actions — services, not dashboard clutter */}
      <div className="home-qa-mobile" style={{ display: 'none' }}>
        <div style={{ padding: '0 4px 10px' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 4px', color: '#0f172a' }}>{t('home.quickActions.mobile.title', 'What do you need?')}</h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{t('home.quickActions.mobile.sub', 'Book services in a few taps')}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {mobileTiles.map(tile => {
            const inner = (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, padding: '14px 12px',
                background: '#fff', borderRadius: 14, border: '1px solid #e8edf2',
                boxShadow: '0 1px 4px rgba(15,23,42,0.04)', minHeight: 96, height: '100%',
              }}>
                <span style={{ fontSize: 24, lineHeight: 1 }} aria-hidden>{tile.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{tile.label}</span>
                <span style={{ fontSize: 11, color: '#64748b' }}>{tile.sub}</span>
              </div>
            );
            if (tile.upload) {
              return (
                <button key={tile.label} type="button" onClick={() => useUploadModal.getState().setOpen(true)} style={{ fontFamily: 'inherit', cursor: 'pointer', border: 'none', background: 'none', padding: 0, width: '100%', textAlign: 'left' }}>
                  {inner}
                </button>
              );
            }
            return <Link key={tile.label} to={tile.to} style={{ textDecoration: 'none' }}>{inner}</Link>;
          })}
        </div>
      </div>

      {/* Desktop / tablet service cards */}
      <div className="container home-qa-desktop">
        <div className="home-section-head" style={{ marginBottom: 16 }}>
          <div>
            <h2 className="section-title">{t('home.quickActions.title', 'Our Services')}</h2>
            <p className="section-subtitle">{t('home.quickActions.subtitle', 'Complete healthcare at your doorstep')}</p>
          </div>
        </div>
        <div className="home-services-grid">
          {actions.map(a => {
            const Tag = a.path ? Link : 'button';
            const extraProps = a.path ? { to: a.path } : { onClick: () => useUploadModal.getState().setOpen(true), type: 'button' };
            return (
              <Tag key={a.label} {...extraProps}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
                  background: '#fff', borderRadius: 14, textDecoration: 'none',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e8edf2',
                  transition: 'all 0.15s', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', textAlign: 'left', width: '100%',
                  minHeight: 84,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.boxShadow = `0 4px 16px ${a.color}20`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8edf2'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${a.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>
                  {a.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.4 }}>{a.desc}</div>
                </div>
                <span style={{ color: a.color, fontSize: 18 }} aria-hidden>→</span>
              </Tag>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PopularTests({ popular, catalogCount = 0 }) {
  const tr = useT();
  const badges = ['Most Booked', 'Trending', 'Recommended', 'Most Booked', 'Trending', 'Recommended', 'Most Booked', 'Trending'];
  return (
    <div className="page-section" style={{ background: '#FFFFFF', position: 'relative', zIndex: 1 }}>
      <div className="container">
        <div className="home-section-head">
          <div>
            <h2 className="section-title">{tr('home.popularTests.title', 'Popular Tests')}</h2>
            <p className="section-subtitle">
              {tr('home.popularTests.subtitle', 'Most booked diagnostic tests')}
              {catalogCount > 0 && (
                <span style={{ marginLeft: 6, fontWeight: 600, color: '#1866C9' }}>
                  · {catalogCount} {tr('home.popularTests.inCatalog', 'in catalog')}
                </span>
              )}
            </p>
          </div>
          <Link to="/diagnostics" className="btn btn-outline" style={{ fontSize: 12 }}>{tr('home.popularTests.viewAll', 'View All Tests →')}</Link>
        </div>
        {popular.length === 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ height: 260, borderRadius: 14, background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'homeShimmer 1.2s infinite', border: '1px solid #e8edf2' }} />
            ))}
            <style>{`@keyframes homeShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
          </div>
        ) : (
          <div className="home-popular-grid">
            {popular.map((test, i) => (
              <TestCard key={test.id} test={test} badge={badges[i % badges.length]} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoriesSection({ liveCategories = [] }) {
  const t = useT();
  // Prefer live Neon categories (with counts); fall back to static marketing list
  const fallback = [
    { icon: '🩸', label: t('home.categories.diabetes', 'Diabetes'), cat: 'Diabetes', slug: 'diabetes' },
    { icon: '❤️', label: t('home.categories.heart', 'Heart'), cat: 'Cardiac', slug: 'cardiac' },
    { icon: '🫘', label: t('home.categories.kidney', 'Kidney'), cat: 'Kidney', slug: 'kidney' },
    { icon: '🫁', label: t('home.categories.liver', 'Liver'), cat: 'Liver', slug: 'liver' },
    { icon: '💊', label: t('home.categories.vitamin', 'Vitamin'), cat: 'Vitamins', slug: 'vitamins' },
    { icon: '🧪', label: t('home.categories.hormones', 'Hormones'), cat: 'Hormones', slug: 'hormones' },
    { icon: '🩸', label: t('home.categories.anemia', 'Anemia'), cat: 'Anemia', slug: 'anemia' },
    { icon: '🦴', label: t('home.categories.arthritis', 'Arthritis'), cat: 'Arthritis', slug: 'arthritis' },
    { icon: '🤰', label: t('home.categories.pregnancy', 'Pregnancy'), cat: 'Pregnancy', slug: 'pregnancy' },
    { icon: '🎗️', label: t('home.categories.cancerScreening', 'Cancer Screening'), cat: 'Cancer', slug: 'cancer' },
    { icon: '🤧', label: t('home.categories.allergy', 'Allergy'), cat: 'Allergy', slug: 'allergy' },
    { icon: '🌡️', label: t('home.categories.fever', 'Fever'), cat: 'Fever', slug: 'fever' },
    { icon: '🦠', label: t('home.categories.infection', 'Infection'), cat: 'Infections', slug: 'infections' },
    { icon: '🦋', label: t('home.categories.thyroid', 'Thyroid'), cat: 'Thyroid', slug: 'thyroid' },
    { icon: '🧬', label: t('home.categories.fullBody', 'Full Body'), cat: 'Full Body', slug: 'full-body' },
  ];
  const cats = liveCategories.length > 0
    ? liveCategories.map(c => ({
        icon: c.icon || '🔬',
        label: c.name,
        cat: c.name,
        slug: c.slug || c.id || makeSlug(c.name),
        count: c.count || c.tests?.length || 0,
      }))
    : fallback;
  return (
    <div className="page-section" style={{ background: 'linear-gradient(180deg, #E8F4FC 0%, #F0F9FF 100%)' }}>
      <div className="container">
        <div className="home-section-head" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className="section-title">{t('home.categories.title', 'Browse by Category')}</h2>
          <p className="section-subtitle">{t('home.categories.subtitle', 'Find the right test by health concern')}</p>
        </div>
        <div className="home-cat-grid">
          {cats.map(c => (
            <Link key={c.slug || c.cat} to={`/tests/${c.slug || makeSlug(c.cat)}`}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '16px 10px', borderRadius: 14, textDecoration: 'none',
                background: '#fff', border: '1px solid #e2e8f0', minHeight: 108,
                transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#1866C9'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(24,102,201,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(15, 23, 42, 0.04)'; e.currentTarget.style.transform = 'none'; }}>
              <span style={{ fontSize: 26, lineHeight: 1 }} aria-hidden>{c.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#0f172a', textAlign: 'center', lineHeight: 1.25 }}>{c.label}</span>
              {c.count > 0 && (
                <span style={{ fontSize: 10, fontWeight: 600, color: '#1866C9' }}>{c.count}</span>
              )}
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <Link to="/diagnostics" className="btn btn-outline" style={{ fontSize: 12, background: '#fff' }}>
            {t('home.categories.viewAll', 'View All Tests →')}
          </Link>
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
        <div className="home-section-head">
          <div>
            <h2 className="section-title">{t('home.packages.title', 'Health Packages')}</h2>
            <p className="section-subtitle">{t('home.packages.subtitle', 'Comprehensive health checkup packages')}</p>
          </div>
          <Link to="/health-packages" className="btn btn-outline" style={{ fontSize: 12 }}>{t('home.packages.viewAll', 'View All Packages →')}</Link>
        </div>
        {pkgs.filter(Boolean).length === 0 ? (
          <div className="home-pkg-empty">
            <div style={{ fontSize: 28, marginBottom: 8 }} aria-hidden>📦</div>
            <p style={{ margin: '0 0 12px', fontWeight: 600, color: '#334155' }}>{t('home.packages.empty', 'Packages are loading or temporarily unavailable.')}</p>
            <Link to="/health-packages" className="btn btn-primary btn-sm">{t('home.packages.browse', 'Browse packages')}</Link>
          </div>
        ) : (
        <div className="home-popular-grid home-pkg-scroll">
          {pkgs.filter(Boolean).slice(0, 4).map((p) => {
            const discPct = p.discount || (p.mrp ? Math.round((1 - p.offerPrice / p.mrp) * 100) : 0);
            return (
              <div key={p.slug || p.name} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', transition: 'box-shadow 0.2s, transform 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(24,102,201,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ background: p.color || 'linear-gradient(135deg, #1866C9, #0F4A96)', padding: '16px 14px 18px', position: 'relative', minHeight: 120 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                    <span style={{ background: '#FFD54F', color: '#1a1a1a', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>{discPct >= 50 ? t('home.packages.bestValue', 'Best Value') : t('home.packages.popular', 'Popular')}</span>
                    {discPct > 0 && <span style={{ background: 'rgba(255,255,255,0.22)', color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>{discPct}% OFF</span>}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 }}>{p.testCount || t('home.packages.multiple', 'Multiple')} {t('home.packages.tests', 'Tests')}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 8px', lineHeight: 1.25, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>₹{p.offerPrice}</span>
                    {p.mrp > p.offerPrice && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', textDecoration: 'line-through' }}>₹{p.mrp}</span>}
                  </div>
                </div>
                <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14, flex: 1 }}>
                    {[
                      { icon: '🚚', label: t('home.packages.freeCollection', 'Free Home Collection') },
                      { icon: '👨‍⚕️', label: t('home.packages.doctorConsult', 'Doctor Consultation') },
                      { icon: '⏱️', label: `${t('home.packages.reportIn', 'Report in')} ${p.reportTime || t('home.packages.hours24', '24 Hours')}` },
                    ].map(f => (
                      <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#475569' }}>
                        <span style={{ width: 16, textAlign: 'center' }} aria-hidden>{f.icon}</span>
                        <span>{f.label}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to={`/package/${p.slug}`} style={{ flex: 1, textAlign: 'center', padding: '10px 0', background: '#1866C9', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none', minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t('home.packages.bookNow', 'Book Now')}</Link>
                    <Link to={`/package/${p.slug}`} style={{ padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 11, fontWeight: 600, color: '#475569', textDecoration: 'none', minHeight: 40, display: 'flex', alignItems: 'center' }}>{t('home.packages.viewDetails', 'Details')}</Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}

function HowItWorks() {
  const t = useT();
  // 4 clear steps — easier on mobile than 6 dense cards
  const steps = [
    { icon: '🛒', title: t('home.howItWorks.step1.title', 'Book Your Test'), desc: t('home.howItWorks.step1.short', 'Search 5000+ tests or upload a prescription. Book online in minutes.'), badge: t('home.howItWorks.step1.badge', 'Easy Online Booking') },
    { icon: '🏠', title: t('home.howItWorks.step3.title', 'Home Collection'), desc: t('home.howItWorks.step3.short', 'Trained phlebotomists collect samples at your doorstep — free & hygienic.'), badge: t('home.howItWorks.step3.badge', 'Hygienic Collection') },
    { icon: '🔬', title: t('home.howItWorks.step4.title', 'Lab Testing'), desc: t('home.howItWorks.step4.short', 'NABL-certified labs process your samples with quality checks.'), badge: t('home.howItWorks.step4.badge', 'Quality Checked') },
    { icon: '📱', title: t('home.howItWorks.step5.title', 'Digital Reports'), desc: t('home.howItWorks.step5.short', 'Get reports on WhatsApp, email, or dashboard — usually within 24 hours.'), badge: t('home.howItWorks.step5.badge', 'Anytime Access') },
  ];
  return (
    <div className="page-section home-page-section" style={{ background: '#FFFFFF' }}>
      <div className="container">
        <h2 className="section-title text-center">{t('home.howItWorks.sectionTitle', 'How it works')}</h2>
        <p className="section-subtitle text-center">{t('home.howItWorks.sectionSubtitle', 'Book · Collect · Test · Report — simple healthcare at home.')}</p>
        <div className="journey-banner" style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 22, padding: '8px 14px', background: 'rgba(24, 102, 201,0.06)', borderRadius: 30, fontSize: 11, fontWeight: 600, color: '#1866C9', maxWidth: 420, marginLeft: 'auto', marginRight: 'auto' }}>
          <span>{t('home.howItWorks.journey.book', 'Book')}</span><span style={{ color: '#20B7F5' }}>→</span>
          <span>{t('home.howItWorks.journey.collect', 'Collect')}</span><span style={{ color: '#20B7F5' }}>→</span>
          <span>{t('home.howItWorks.journey.test', 'Test')}</span><span style={{ color: '#20B7F5' }}>→</span>
          <span>{t('home.howItWorks.journey.report', 'Report')}</span>
          <span style={{ background: '#22C55E', color: '#fff', fontSize: 9, padding: '2px 8px', borderRadius: 10, marginLeft: 4 }}>{t('home.howItWorks.completed', '24–48 hrs')}</span>
        </div>
        <div className="home-timeline-grid timeline-grid" style={{ position: 'relative', zIndex: 1 }}>
          {steps.map((s, i) => (
            <div key={s.title} className="timeline-step" style={{ textAlign: 'center' }}>
              <div className="timeline-dot" style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #1866C9, #0F4A96)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, margin: '0 auto 10px', boxShadow: '0 4px 12px rgba(24, 102, 201,0.25)' }}>
                {s.icon}
              </div>
              <div className="timeline-card" style={{ background: '#fff', borderRadius: 16, padding: '16px 14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e8edf2', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#1866C9', background: '#E8F1FC', borderRadius: 10, padding: '2px 8px', display: 'inline-block', marginBottom: 8, alignSelf: 'center' }}>{t('home.howItWorks.step', 'Step')} {i + 1}</div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 6, lineHeight: 1.25 }}>{s.title}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 10, flex: 1 }}>{s.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 11, color: '#16a34a', fontWeight: 600 }}>
                  <span aria-hidden>✓</span> {s.badge}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="how-cta" style={{ textAlign: 'center', marginTop: 28, padding: '22px 18px', background: 'linear-gradient(135deg, #0F5DA8, #20B7F5)', borderRadius: 16, color: '#fff' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{t('home.howItWorks.cta.title', 'Ready to Start Your Health Check?')}</h3>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/diagnostics" className="btn btn-lg" style={{ background: '#FF3B30', border: 'none', color: '#fff', padding: '12px 22px', fontSize: 13, fontWeight: 700 }}>{t('home.howItWorks.cta.bookTest', 'Book Test Now')}</Link>
            <button type="button" onClick={() => useUploadModal.getState().setOpen(true)} className="btn btn-lg" style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.5)', color: '#fff', padding: '12px 22px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>{t('home.howItWorks.cta.upload', 'Upload Prescription')}</button>
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

  const [activeReview, setActiveReview] = useState(0);
  const next = useCallback(() => setActiveReview(i => (i + 1) % Math.max(reviews.length, 1)), [reviews.length]);
  useEffect(() => { const timer = setInterval(next, 5000); return () => clearInterval(timer); }, [next]);

  const review = reviews[activeReview] || reviews[0] || { name: '', text: '', rating: 5, tag: '' };

  return (
    <div className="page-section home-page-section" style={{ background: '#F8FAFC' }}>
      <div className="container">
        <h2 className="section-title text-center">{t('home.testimonials.sectionTitle', 'Trusted by thousands of families')}</h2>
        <p className="section-subtitle text-center">{t('home.testimonials.sectionSubtitle', 'Real experiences from patients who chose home diagnostics with Jeevan.')}</p>

        <div className="grid-4" style={{ gap: 10, marginBottom: 20 }}>
          {[
            { label: '2,00,000+', sub: t('home.testimonials.stat.homeCollections', 'Home Collections') },
            { label: '50,000+', sub: t('home.testimonials.stat.happyFamilies', 'Happy Families') },
            { label: '4.9 ★', sub: t('home.testimonials.stat.googleRating', 'Google Rating') },
            { label: '10+ Years', sub: t('home.testimonials.stat.experience', 'Experience') },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 14, padding: '14px 10px', textAlign: 'center', border: '1px solid #e8edf2' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#1866C9', marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="testimonials-layout" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16, marginBottom: 20, alignItems: 'stretch' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '22px 18px', textAlign: 'center', border: '1px solid #e8edf2', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1866C9', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{t('home.testimonials.googleRating', 'Patient rating')}</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>4.9</div>
            <div style={{ fontSize: 16, margin: '8px 0', color: '#F59E0B' }} aria-hidden>★★★★★</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{t('home.testimonials.basedOn', 'Based on')} <strong style={{ color: '#0f172a' }}>{t('home.testimonials.reviewsCount', '500+ reviews')}</strong></div>
          </div>

          <div style={{ background: '#fff', borderRadius: 16, padding: '20px 18px', border: '1px solid #e8edf2', minHeight: 180 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, gap: 10, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E8F1FC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }} aria-hidden>{getImg(review)}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{review.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{review.tag || t('home.testimonials.verifiedPatient', 'Verified Patient')}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: '#F59E0B' }} aria-label={`${review.rating} stars`}>{'★'.repeat(review.rating || 5)}</div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: '#334155', margin: '0 0 14px' }}>&ldquo;{review.text}&rdquo;</p>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              {reviews.map((_, i) => (
                <button key={i} type="button" aria-label={`Review ${i + 1}`} onClick={() => setActiveReview(i)} style={{ width: i === activeReview ? 22 : 8, height: 8, borderRadius: 4, border: 'none', background: i === activeReview ? '#1866C9' : '#d0d5dd', cursor: 'pointer', transition: 'all 0.25s', padding: 0 }} />
              ))}
            </div>
          </div>
        </div>

        <div className="testimonials-cta" style={{ textAlign: 'center', padding: '22px 16px', background: 'linear-gradient(135deg, #0F5DA8, #1A7AD4)', borderRadius: 16, color: '#fff' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{t('home.testimonials.cta.title', 'Join families who trust Jeevan HealthCare at Home')}</h3>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/diagnostics" className="btn btn-lg" style={{ background: '#FF3B30', border: 'none', color: '#fff', padding: '12px 22px', fontSize: 13, fontWeight: 700 }}>{t('home.testimonials.cta.bookTest', 'Book Health Test')}</Link>
            <button type="button" onClick={() => useUploadModal.getState().setOpen(true)} className="btn btn-lg" style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.5)', color: '#fff', padding: '12px 22px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>{t('home.testimonials.cta.upload', 'Upload Prescription')}</button>
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
    <div className="page-section home-page-section home-faq" style={{ background: '#FFFFFF' }}>
      <div className="container" style={{ maxWidth: 720, margin: '0 auto' }}>
        <h2 className="section-title text-center">{t('home.faq.title', 'Frequently Asked Questions')}</h2>
        <p className="section-subtitle text-center">{t('home.faq.subtitle', 'Everything you need to know about booking and home collection')}</p>
        <div style={{ marginTop: 8 }}>
          {items.map((faq, i) => (
            <details key={i} style={{ marginBottom: 10, border: '1px solid #e8edf2', borderRadius: 12, background: '#fff', overflow: 'hidden' }}>
              <summary style={{ padding: '14px 16px', fontWeight: 600, cursor: 'pointer', fontSize: 13, color: '#0f172a' }}>{faq.question || faq.q}</summary>
              <p style={{ padding: '0 16px 14px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>{faq.answer || faq.a}</p>
            </details>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <Link to="/contact" style={{ fontSize: 13, fontWeight: 600, color: '#1866C9', textDecoration: 'none' }}>{t('home.faq.moreHelp', 'Still have questions? Contact us →')}</Link>
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
        <div className="home-nh-grid nh-grid">
          {cats.map(c => (
            <Link key={c.id} to={`/nurse-at-home/book?cat=${c.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff', borderRadius: 16, padding: '16px 12px', textAlign: 'center', border: '1px solid #e8edf2', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.15s', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 120 }}
                className="nh-cat-card">
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{c.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.25 }}>{t(`nurse.cat.${c.id}`, c.name)}</div>
                <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.3 }}>{(c.services || []).slice(0, 2).join(' · ')}</div>
              </div>
            </Link>
          ))}
          <Link to="/nurse-at-home" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'linear-gradient(135deg, #0D9488, #14B8A6)', borderRadius: 16, padding: '16px 12px', textAlign: 'center', boxShadow: '0 4px 16px rgba(13,148,136,0.2)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 120 }}>
              <span style={{ fontSize: 26 }} aria-hidden>📋</span>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{t('home.nurseAtHome.viewAll', 'View All Services')}</div>
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
  // Keep top 6 benefits — less wall of cards on mobile
  const features = [
    { icon: '🏅', title: t('home.whyChoose.feature.NABL.title', 'NABL Certified Labs'), desc: t('home.whyChoose.feature.NABL.short', 'Accurate reports from quality-controlled partner labs.'), badge: t('home.whyChoose.feature.NABL.badge', 'Quality Assured') },
    { icon: '🏠', title: t('home.whyChoose.feature.homeCollection.title', 'Free Home Collection'), desc: t('home.whyChoose.feature.homeCollection.short', 'Book online — trained phlebotomists come to you.'), badge: t('home.whyChoose.feature.homeCollection.badge', '7 Days a Week') },
    { icon: '⏱️', title: t('home.whyChoose.feature.digitalReports.title', 'Reports in 24 Hours'), desc: t('home.whyChoose.feature.digitalReports.short', 'Digital reports on WhatsApp, email & dashboard.'), badge: t('home.whyChoose.feature.digitalReports.badge', 'Anytime Access') },
    { icon: '💰', title: t('home.whyChoose.feature.pricing.title', 'Transparent Pricing'), desc: t('home.whyChoose.feature.pricing.short', 'Clear rates with no hidden collection charges.'), badge: t('home.whyChoose.feature.pricing.badge', 'No Hidden Fees') },
    { icon: '👨‍⚕️', title: t('home.whyChoose.feature.doctorConsult.title', 'Doctor Support'), desc: t('home.whyChoose.feature.doctorConsult.short', 'Understand results with expert medical guidance.'), badge: t('home.whyChoose.feature.doctorConsult.badge', 'Expert Support') },
    { icon: '🛡️', title: t('home.whyChoose.feature.safety.title', 'Safe & Hygienic'), desc: t('home.whyChoose.feature.safety.short', 'Sterile kits and strict collection protocols.'), badge: t('home.whyChoose.feature.safety.badge', 'Safety First') },
  ];
  return (
    <div className="page-section home-page-section" style={{ background: '#FFFFFF' }}>
      <div className="container">
        <h2 className="section-title text-center">{t('home.whyChoose.sectionTitle', 'Why families choose Jeevan')}</h2>
        <p className="section-subtitle text-center">{t('home.whyChoose.sectionSubtitle', 'Reliable diagnostics and home healthcare — designed around your family.')}</p>
        <div className="home-why-grid" style={{ marginTop: 8 }}>
          {features.map(f => (
            <div key={f.title} className="trust-feature-card" style={{
              background: '#fff', borderRadius: 16, padding: '18px 16px', textAlign: 'left',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)', border: '1px solid #e8edf2',
            }}>
              <div style={{ fontSize: 28, marginBottom: 10, lineHeight: 1 }} aria-hidden>{f.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: '#0f172a' }}>{f.title}</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 10 }}>{f.desc}</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#f0fdf4', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: '#16a34a' }}>
                ✔ {f.badge}
              </div>
            </div>
          ))}
        </div>
        <div className="why-cta-section" style={{ textAlign: 'center', marginTop: 28, padding: '24px 18px', background: 'linear-gradient(135deg, #0F5DA8, #20B7F5)', borderRadius: 16, color: '#fff' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>{t('home.whyChoose.cta.title', 'Experience trusted healthcare at your doorstep')}</h3>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/diagnostics" className="btn btn-lg" style={{ background: '#FF3B30', border: 'none', color: '#fff', padding: '12px 24px', fontSize: 13, fontWeight: 700 }}>{t('home.whyChoose.cta.bookTest', 'Book Health Test')}</Link>
            <button type="button" onClick={() => useUploadModal.getState().setOpen(true)} className="btn btn-lg" style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.5)', color: '#fff', padding: '12px 24px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>{t('home.whyChoose.cta.upload', 'Upload Prescription')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
