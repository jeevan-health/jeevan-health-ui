import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import VaccineCrossSell from '../components/VaccineCrossSell';
import {
  physioCategories,
  trustFeatures,
  physioFAQs,
  therapists,
  physioPackages,
  treatmentModes,
  STORAGE_KEYS,
} from '../data/physiotherapyData';

const STEPS = [
  { icon: '🩺', title: 'choose.condition', desc: 'Select your condition from our specialized categories.' },
  { icon: '📋', title: 'select.mode', desc: 'Choose home visit, clinic, or online consultation.' },
  { icon: '📅', title: 'book.session', desc: 'Pick a convenient date and time slot for therapy.' },
  { icon: '🩻', title: 'therapist.visit', desc: 'Expert physiotherapist evaluates & starts treatment.' },
  { icon: '💪', title: 'recover.strengthen', desc: 'Follow your personalized plan and track progress.' },
];

const COLORS = {
  heroFrom: '#0D9488',
  heroTo: '#14B8A6',
  heroMid: '#2DD4BF',
  accent: '#F59E0B',
  accentHover: '#D97706',
  primary: '#0D9488',
  primaryLight: '#CCFBF1',
  bg: '#F0FDFA',
  text: '#0F172A',
  textMuted: '#64748B',
};

export default function PhysiotherapyAtHome() {
  const t = useT();
  const [quickForm, setQuickForm] = useState({ condition: '', pincode: '', mode: 'home' });
  const [quickSubmitted, setQuickSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickForm.condition || !quickForm.pincode) return;
    const bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
    bookings.push({
      ...quickForm,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'Quick Request',
      source: 'quick-booking-widget',
    });
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    setQuickSubmitted(true);
    setTimeout(() => {
      setQuickSubmitted(false);
      setQuickForm({ condition: '', pincode: '', mode: 'home' });
    }, 4000);
  };

  return (
    <div>
      {/* HERO SECTION */}
      <div className="v-hero" style={{ background: `linear-gradient(135deg, ${COLORS.heroFrom} 0%, ${COLORS.heroMid} 50%, ${COLORS.heroTo} 100%)`, padding: '48px 0 56px', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 36 }}>🩻</span>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Jeevan Healthcare</div>
              <h1 className="v-hero-title" style={{ color: '#fff', fontSize: 48, fontWeight: 800, margin: 0, lineHeight: 1.15 }}>{t('physiotherapy.at.home', 'Expert Physiotherapy Care At Your Doorstep')}</h1>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: '0 0 12px', maxWidth: 480 }}>
            {t('physio.for')} <strong>{t('pain.relief', 'Pain Relief')}</strong> | <strong>{t('rehabilitation', 'Rehabilitation')}</strong> | <strong>{t('sports.injury', 'Sports Injury')}</strong> | <strong>{t('elderly.care', 'Elderly Care')}</strong> | <strong>{t('neurological', 'Neurological')}</strong>
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {[
              t('certified.therapists', 'Certified Therapists'),
              t('home.visits', 'Home Visits'),
              t('personalized.plans', 'Personalized Plans'),
              t('track.progress', 'Track Progress'),
            ].map(b => (
              <span key={b} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: 20 }}>
                <span style={{ color: '#22C55E', fontSize: 12 }}>✓</span> {b}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/physiotherapy/book" className="btn btn-lg" style={{ background: COLORS.accent, border: 'none', color: '#fff', height: 48, padding: '0 28px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{t('book.physiotherapy.session', 'Book Physiotherapy Session')}</Link>
            <a href="https://wa.me/919700104108?text=Hi%2C%20I%20want%20a%20free%20physiotherapy%20consultation" target="_blank" rel="noopener noreferrer" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)', color: '#fff', height: 48, padding: '0 28px', fontSize: 16, fontWeight: 600, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{t('get.free.consultation', 'Get Free Consultation')}</a>
          </div>
        </div>
      </div>

      {/* QUICK BOOKING WIDGET */}
      <div className="page-section" style={{ background: '#fff', borderBottom: `1px solid #CCFBF1` }}>
        <div className="container" style={{ maxWidth: 560 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>{t('quick.physio.booking', 'Quick Physiotherapy Booking')}</h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px', textAlign: 'center' }}>{t('quick.booking.physio', 'Tell us your condition — we\'ll match you with the best therapist')}</p>
          {quickSubmitted ? (
            <div style={{ padding: 20, background: '#dcfce7', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>✅</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px', color: '#166534' }}>{t('request.submitted')}</h3>
              <p style={{ fontSize: 12, color: '#166534', margin: 0 }}>{t('quick.booking.confirm', 'We\'ll contact you shortly to confirm your appointment.')}</p>
            </div>
          ) : (
            <form onSubmit={handleQuickSubmit} style={{ display: 'grid', gap: 10 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('select.condition', 'Select Your Condition')} *</label>
                <select required value={quickForm.condition} onChange={e => setQuickForm(f => ({ ...f, condition: e.target.value }))} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="">{t('choose.condition.placeholder', 'Choose a condition category')}</option>
                  {physioCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('pincode', 'Pincode')} *</label>
                <input required value={quickForm.pincode} onChange={e => setQuickForm(f => ({ ...f, pincode: e.target.value }))} placeholder="Enter your area pincode" type="text" pattern="[0-9]{6}" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>{t('preferred.mode', 'Preferred Mode')}</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {treatmentModes.slice(0, 3).map(m => (
                    <label key={m.id} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4, padding: '8px 10px', borderRadius: 8, border: quickForm.mode === m.id ? `2px solid ${COLORS.primary}` : '1px solid #d0d5dd', background: quickForm.mode === m.id ? COLORS.primaryLight : '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                      <input type="radio" name="q-mode" value={m.id} checked={quickForm.mode === m.id} onChange={e => setQuickForm(f => ({ ...f, mode: e.target.value }))} style={{ accentColor: COLORS.primary }} />
                      {m.icon} {m.label}
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" style={{ height: 48, padding: '0 24px', borderRadius: 8, border: 'none', background: COLORS.accent, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{t('book.now').toUpperCase()} →</button>
            </form>
          )}
        </div>
      </div>

      {/* TRUST SECTION */}
      <div className="page-section container">
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>{t('why.choose.jeevan.physio', 'Why Choose Jeevan Physiotherapy?')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
          {trustFeatures.map(item => (
            <div key={item.title} style={{ textAlign: 'center', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
              <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{item.title}</h3>
              <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.4 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES SECTION */}
      <div className="page-section" style={{ background: COLORS.bg }}>
        <div className="container">
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{t('physiotherapy.services', 'Physiotherapy Services')}</h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{t('comprehensive.physio', 'Comprehensive care for every condition')}</p>
          <div className="v-cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {physioCategories.map(c => (
              <Link key={c.id} to={`/physiotherapy/category/${c.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ padding: 18, borderRadius: 14, border: `1px solid ${c.color}20`, background: `${c.color}06`, borderTop: `3px solid ${c.color}`, height: '100%' }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{c.icon}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>{c.name}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 6 }}>
                    {c.conditions.slice(0, 3).map(co => (
                      <span key={co} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: `${c.color}12`, color: c.color, fontWeight: 600 }}>{co}</span>
                    ))}
                    {c.conditions.length > 3 && (
                      <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#f1f5f9', color: '#64748b', fontWeight: 600 }}>+{c.conditions.length - 3}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 6 }}>
                    {c.treatments.slice(0, 2).map(tr => (
                      <span key={tr} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 500 }}>{tr}</span>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.4 }}>{c.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="v-cat-scroll">
            {physioCategories.map(c => (
              <Link key={c.id} to={`/physiotherapy/category/${c.slug}`} style={{ textDecoration: 'none', flex: '0 0 160px' }}>
                <div style={{ padding: 14, borderRadius: 12, border: `1px solid ${c.color}20`, background: `${c.color}06`, borderTop: `3px solid ${c.color}`, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{c.icon}</div>
                  <h3 style={{ fontSize: 12, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{c.name}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                    {c.conditions.slice(0, 2).map(co => (
                      <span key={co} style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: `${c.color}12`, color: c.color, fontWeight: 600 }}>{co}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* POPULAR THERAPISTS */}
      <div className="page-section container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{t('popular.therapists', 'Popular Physiotherapists')}</h2>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{t('popular.therapists.subtitle', 'Our expert physiotherapists with years of experience')}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}>
          {therapists.map(th => (
            <div key={th.id} style={{ flex: '0 0 240px', padding: 16, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff', scrollSnapAlign: 'start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: COLORS.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{th.image}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{th.name}</div>
                  <div style={{ fontSize: 11, color: COLORS.primary, fontWeight: 600 }}>{th.qualifications}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ color: '#F59E0B', fontSize: 13 }}>★</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{th.rating}</span>
                <span style={{ fontSize: 11, color: '#64748b' }}>({th.sessions} sessions)</span>
                <span style={{ fontSize: 11, color: '#059669', fontWeight: 600, marginLeft: 'auto' }}>{th.experience} yrs</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 8 }}>
                {th.specialties.slice(0, 2).map(s => (
                  <span key={s} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: COLORS.primaryLight, color: COLORS.primary, fontWeight: 600 }}>{s}</span>
                ))}
              </div>
              <div style={{ fontSize: 11, color: '#059669', fontWeight: 600, marginBottom: 8 }}>
                {th.availability.join(' • ')}
              </div>
              <Link to={`/physiotherapy/therapist/${th.id}`} style={{ display: 'block', textAlign: 'center', height: 36, lineHeight: '36px', borderRadius: 8, background: COLORS.primary, color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>{t('book.session', 'Book Session')} →</Link>
            </div>
          ))}
        </div>
      </div>

      {/* PACKAGES */}
      <div className="page-section" style={{ background: COLORS.bg }}>
        <div className="container">
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>{t('physio.packages', 'Physiotherapy Packages')}</h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px', textAlign: 'center' }}>{t('packages.subtitle', 'Choose a plan that suits your recovery needs')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {physioPackages.map(pkg => (
              <div key={pkg.id} style={{ padding: 20, borderRadius: 14, border: pkg.popular ? `2px solid ${COLORS.primary}` : '1px solid #e2e8f0', background: '#fff', position: 'relative' }}>
                {pkg.popular && (
                  <div style={{ position: 'absolute', top: 10, right: 10, background: COLORS.accent, color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>{t('popular', 'POPULAR')}</div>
                )}
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{pkg.name}</h3>
                {pkg.isMonthly ? (
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontWeight: 800, color: '#059669', fontSize: 22 }}>₹{pkg.price}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>/month</span>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}><s>₹{pkg.originalPrice}</s> <span style={{ color: '#dc2626', fontWeight: 600 }}>Save ₹{pkg.originalPrice - pkg.price}</span></div>
                  </div>
                ) : (
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontWeight: 800, color: '#059669', fontSize: 22 }}>₹{pkg.price}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>/{pkg.sessions} sessions</span>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}><s>₹{pkg.originalPrice}</s> <span style={{ color: '#dc2626', fontWeight: 600 }}>Save ₹{pkg.originalPrice - pkg.price}</span></div>
                  </div>
                )}
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 11, color: '#475569', marginBottom: 14, lineHeight: 1.8 }}>
                  {pkg.includes.map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: '#22C55E', fontSize: 12 }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
                <Link to={`/physiotherapy/book?package=${pkg.id}`} style={{ display: 'block', textAlign: 'center', height: 38, lineHeight: '38px', borderRadius: 8, background: pkg.popular ? COLORS.accent : COLORS.primary, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>{t('book.now')}</Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="page-section container">
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, textAlign: 'center' }}>{t('how.it.works')}</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          {STEPS.map((s, i) => (
            <div key={s.title} style={{ textAlign: 'center', padding: 20, background: '#fff', borderRadius: 14, flex: '1 1 160px', maxWidth: 200, position: 'relative' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: COLORS.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, margin: '0 auto 10px' }}>{i + 1}</div>
              <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
              <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{t(s.title)}</h3>
              <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.4 }}>{t(s.desc, s.desc)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="page-section" style={{ background: COLORS.bg }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>{t('faq.heading', 'Frequently Asked Questions')}</h2>
          <div style={{ display: 'grid', gap: 8 }}>
            {physioFAQs.map(f => (
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

      {/* FINAL CTA */}
      <div className="page-section" style={{ background: `linear-gradient(135deg, ${COLORS.heroFrom}, ${COLORS.heroMid})`, textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{t('start.recovery.today', 'Start Your Recovery Today')}</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 16 }}>{t('book.physio.stay.active', 'Book your physiotherapy session and get back to an active life with Jeevan Healthcare')}</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/physiotherapy/book" className="btn btn-lg" style={{ background: COLORS.accent, border: 'none', color: '#fff', height: 48, padding: '0 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{t('book.physiotherapy.session', 'Book Physiotherapy Session')}</Link>
            <a href="https://wa.me/919700104108?text=Hi%2C%20I%20want%20to%20know%20more%20about%20physiotherapy%20services" target="_blank" rel="noopener noreferrer" className="btn btn-lg" style={{ background: '#25d366', border: 'none', color: '#fff', height: 48, padding: '0 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{t('talk.to.expert', 'Talk to Expert')}</a>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 20 }}>
        <VaccineCrossSell source="physiotherapy-page" compact={true} />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .v-hero { padding: 28px 0 36px !important; }
          .v-hero-title { font-size: 30px !important; }
          .v-cat-scroll { display: flex !important; gap: 10px; overflow-x: auto; -webkit-overflow-scrolling: touch; scroll-snap-type: x mandatory; padding-bottom: 4px; }
          .v-cat-scroll > * { flex: 0 0 160px; scroll-snap-align: start; }
          .v-cat-grid { display: none !important; }
        }
        @media (min-width: 769px) {
          .v-cat-scroll { display: none !important; }
        }
      `}</style>
    </div>
  );
}
