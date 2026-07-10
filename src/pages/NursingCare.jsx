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
} from '../data/nursingData';
import NursingServiceCard from '../components/NursingServiceCard';
import NurseCard from '../components/NurseCard';

const STEPS = [
  { icon: '🩺', title: 'Choose Service', desc: 'Select the nursing service you need from our categories.' },
  { icon: '👩‍⚕️', title: 'Book Nurse', desc: 'Pick a qualified nurse and schedule a visit time.' },
  { icon: '🏠', title: 'Nurse Visits', desc: 'Trained nurse arrives at your home at the scheduled time.' },
  { icon: '💚', title: 'Recover at Home', desc: 'Get professional care and recover comfortably at home.' },
];

const COLORS = {
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
};

export default function NursingCare() {
  const t = useT();
  const navigate = useNavigate();
  const [quickForm, setQuickForm] = useState({ category: '', pincode: '', urgency: 'standard' });
  const [quickSubmitted, setQuickSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickForm.category || !quickForm.pincode) return;
    const bookings = JSON.parse(localStorage.getItem('jh_nursing_bookings') || '[]');
    bookings.push({
      ...quickForm,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'Quick Request',
      source: 'quick-booking-widget',
    });
    localStorage.setItem('jh_nursing_bookings', JSON.stringify(bookings));
    setQuickSubmitted(true);
    setTimeout(() => {
      setQuickSubmitted(false);
      setQuickForm({ category: '', pincode: '', urgency: 'standard' });
    }, 4000);
  };

  const firstServiceForCategory = (catSlug) => {
    const svc = nursingServices.find(s => s.category === catSlug);
    return svc ? `/nursing-care/service/${svc.slug}` : `/nursing-care/category/${catSlug}`;
  };

  return (
    <div>
      {/* HERO SECTION */}
      <div className="v-hero" style={{ background: `linear-gradient(135deg, ${COLORS.heroFrom} 0%, ${COLORS.heroMid} 50%, ${COLORS.heroTo} 100%)`, padding: '48px 0 56px', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 36 }}>🩺</span>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Jeevan Healthcare</div>
              <h1 className="v-hero-title" style={{ color: '#fff', fontSize: 48, fontWeight: 800, margin: 0, lineHeight: 1.15 }}>{t('nursing.landing.title', 'Nursing & Caregiver at Home')}</h1>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: '0 0 12px', maxWidth: 480 }}>
            {t('nursing.for')} <strong>{t('wound.care', 'Wound Care')}</strong> | <strong>{t('elderly.care', 'Elderly Care')}</strong> | <strong>{t('post.surgery', 'Post-Surgery')}</strong> | <strong>{t('injections', 'Injections')}</strong> | <strong>{t('mother.baby', 'Mother & Baby')}</strong>
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {[
              t('certified.nurses', 'Certified Nurses'),
              t('same.day.booking', 'Same-Day Booking'),
              t('full.hyderabad.coverage', 'Full Hyderabad Coverage'),
            ].map(b => (
              <span key={b} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: 20 }}>
                <span style={{ color: '#22C55E', fontSize: 12 }}>✓</span> {b}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/nursing-care/book" className="btn btn-lg" style={{ background: COLORS.accent, border: 'none', color: '#fff', height: 48, padding: '0 28px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{t('book.a.nurse', 'Book a Nurse')}</Link>
            <a href="tel:+919700104108" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)', color: '#fff', height: 48, padding: '0 28px', fontSize: 16, fontWeight: 600, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{t('call.now', 'Call +91-9700104108')}</a>
          </div>
        </div>
      </div>

      {/* QUICK BOOKING WIDGET */}
      <div className="page-section" style={{ background: '#fff', borderBottom: `1px solid ${COLORS.primaryLight}` }}>
        <div className="container" style={{ maxWidth: 560 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>{t('nursing.quick.booking', 'Quick Nursing Booking')}</h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px', textAlign: 'center' }}>{t('nursing.quick.booking.desc', 'Tell us your needs — we\'ll match you with the right nurse')}</p>
          {quickSubmitted ? (
            <div style={{ padding: 20, background: '#dcfce7', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>✅</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px', color: '#166534' }}>{t('request.submitted')}</h3>
              <p style={{ fontSize: 12, color: '#166534', margin: 0 }}>{t('quick.booking.confirm', 'We\'ll contact you shortly to confirm your appointment.')}</p>
            </div>
          ) : (
            <form onSubmit={handleQuickSubmit} style={{ display: 'grid', gap: 10 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('select.service.type', 'Select Service Type')} *</label>
                <select required value={quickForm.category} onChange={e => setQuickForm(f => ({ ...f, category: e.target.value }))} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="">{t('choose.service.placeholder', 'Choose a service category')}</option>
                  {nursingCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('pincode', 'Pincode')} *</label>
                <input required value={quickForm.pincode} onChange={e => setQuickForm(f => ({ ...f, pincode: e.target.value }))} placeholder="Enter your area pincode" type="text" pattern="[0-9]{6}" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>{t('urgency', 'Urgency')}</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { id: 'standard', label: t('standard', 'Standard'), icon: '🕐' },
                    { id: 'urgent', label: t('urgent', 'Urgent'), icon: '⚡' },
                    { id: 'emergency', label: t('emergency', 'Emergency'), icon: '🚨' },
                  ].map(m => (
                    <label key={m.id} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4, padding: '8px 10px', borderRadius: 8, border: quickForm.urgency === m.id ? `2px solid ${COLORS.primary}` : '1px solid #d0d5dd', background: quickForm.urgency === m.id ? COLORS.primaryLight : '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                      <input type="radio" name="q-urgency" value={m.id} checked={quickForm.urgency === m.id} onChange={e => setQuickForm(f => ({ ...f, urgency: e.target.value }))} style={{ accentColor: COLORS.primary }} />
                      {m.icon} {m.label}
                    </label>
                  ))}
                </div>
              </div>
              <button type="button" onClick={() => {
                const el = document.getElementById('nursing-services-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }} style={{ height: 48, padding: '0 24px', borderRadius: 8, border: 'none', background: COLORS.accent, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{t('check.availability', 'Check Availability')} →</button>
            </form>
          )}
        </div>
      </div>

      {/* TRUST FEATURES */}
      <div className="page-section container">
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>{t('why.choose.jeevan.nursing', 'Why Choose Jeevan Nursing?')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
          {trustFeatures.map(item => (
            <div key={item.title} style={{ textAlign: 'center', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
              <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{t(item.title, item.title)}</h3>
              <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.4 }}>{t(item.desc, item.desc)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES BY CATEGORY */}
      <div className="page-section" style={{ background: COLORS.bg }}>
        <div className="container">
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{t('nursing.categories', 'Nursing Service Categories')}</h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{t('comprehensive.nursing', 'Comprehensive nursing care for every need')}</p>
          <div className="v-cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {nursingCategories.map(c => (
              <Link key={c.id} to={firstServiceForCategory(c.slug)} style={{ textDecoration: 'none' }}>
                <div style={{ padding: 18, borderRadius: 14, border: `1px solid ${c.color}20`, background: `${c.color}06`, borderTop: `3px solid ${c.color}`, height: '100%' }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{c.icon}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>{t(c.id, c.name)}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 6 }}>
                    {c.services.slice(0, 3).map(co => (
                      <span key={co} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: `${c.color}12`, color: c.color, fontWeight: 600 }}>{co}</span>
                    ))}
                    {c.services.length > 3 && (
                      <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#f1f5f9', color: '#64748b', fontWeight: 600 }}>+{c.services.length - 3}</span>
                    )}
                  </div>
                  <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.4 }}>{t(c.description, c.description)}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="v-cat-scroll">
            {nursingCategories.map(c => (
              <Link key={c.id} to={firstServiceForCategory(c.slug)} style={{ textDecoration: 'none', flex: '0 0 160px' }}>
                <div style={{ padding: 14, borderRadius: 12, border: `1px solid ${c.color}20`, background: `${c.color}06`, borderTop: `3px solid ${c.color}`, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{c.icon}</div>
                  <h3 style={{ fontSize: 12, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{t(c.id, c.name)}</h3>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: `${c.color}15`, color: c.color, fontWeight: 600 }}>{c.services.length} Services</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* POPULAR SERVICES */}
      <div className="page-section container" id="nursing-services-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{t('popular.nursing.services', 'Popular Nursing Services')}</h2>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{t('popular.nursing.subtitle', 'Most booked nursing services on Jeevan Healthcare')}</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {nursingServices.slice(0, 6).map(s => (
            <NursingServiceCard key={s.id} service={s} />
          ))}
        </div>
      </div>

      {/* OUR NURSES */}
      <div className="page-section" style={{ background: COLORS.bg }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{t('our.nurses', 'Our Nurses')}</h2>
              <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{t('our.nurses.subtitle', 'Trained and experienced nursing professionals')}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}>
            {nurses.slice(0, 4).map(n => (
              <div key={n.id} style={{ flex: '0 0 260px', scrollSnapAlign: 'start' }}>
                <NurseCard nurse={n} compact={true} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING PACKAGES */}
      <div className="page-section container">
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>{t('nursing.packages', 'Nursing Packages')}</h2>
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px', textAlign: 'center' }}>{t('packages.subtitle', 'Choose a plan that suits your care needs')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {nursingPackages.map(pkg => (
            <div key={pkg.id} style={{ padding: 20, borderRadius: 14, border: pkg.popular ? `2px solid ${COLORS.primary}` : '1px solid #e2e8f0', background: '#fff', position: 'relative' }}>
              {pkg.popular && (
                <div style={{ position: 'absolute', top: 10, right: 10, background: COLORS.accent, color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>{t('popular', 'POPULAR')}</div>
              )}
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{t(pkg.id, pkg.name)}</h3>
              <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 8px' }}>{t(pkg.description, pkg.description)}</p>
              {pkg.isMonthly ? (
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontWeight: 800, color: '#059669', fontSize: 22 }}>₹{pkg.price}</span>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>/month</span>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}><s>₹{pkg.originalPrice}</s> <span style={{ color: '#dc2626', fontWeight: 600 }}>Save ₹{pkg.originalPrice - pkg.price}</span></div>
                </div>
              ) : (
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontWeight: 800, color: '#059669', fontSize: 22 }}>₹{pkg.price}</span>
                  {pkg.services > 0 && <span style={{ fontSize: 11, color: '#94a3b8' }}>/{pkg.services} services</span>}
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
              <Link to={`/nursing-care/book?package=${pkg.id}`} style={{ display: 'block', textAlign: 'center', height: 38, lineHeight: '38px', borderRadius: 8, background: pkg.popular ? COLORS.accent : COLORS.primary, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>{t('book.package', 'Book Package')}</Link>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="page-section" style={{ background: COLORS.bg }}>
        <div className="container">
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
      </div>

      {/* NURSE LEVELS */}
      <div className="page-section container">
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>{t('nurse.levels', 'Nurse Levels')}</h2>
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px', textAlign: 'center' }}>{t('nurse.levels.subtitle', 'Choose the right level of care for your needs')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {nurseLevels.map(level => (
            <div key={level.id} style={{ padding: 20, borderRadius: 14, border: `1px solid ${level.color}30`, background: `${level.color}06`, borderTop: `3px solid ${level.color}`, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>👩‍⚕️</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{t(level.id, level.name)}</h3>
              <div style={{ fontSize: 20, fontWeight: 800, color: level.color, marginBottom: 6 }}>₹{level.hourlyRate}<span style={{ fontSize: 12, fontWeight: 400, color: '#94a3b8' }}>/hr</span></div>
              <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.4 }}>{t(level.id + '.desc', level.description)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="page-section" style={{ background: COLORS.bg }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>{t('faq.heading', 'Frequently Asked Questions')}</h2>
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

      {/* FINAL CTA */}
      <div className="page-section" style={{ background: `linear-gradient(135deg, ${COLORS.heroFrom}, ${COLORS.heroTo})`, textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{t('ready.to.get.started', 'Ready to Get Started?')}</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 16 }}>{t('book.nurse.stay.cared', 'Book a nurse and get professional care at home with Jeevan Healthcare')}</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/nursing-care/book" className="btn btn-lg" style={{ background: COLORS.accent, border: 'none', color: '#fff', height: 48, padding: '0 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{t('book.a.nurse', 'Book a Nurse')}</Link>
            <a href="https://wa.me/919700104108?text=Hi%2C%20I%20want%20to%20know%20more%20about%20nursing%20services" target="_blank" rel="noopener noreferrer" className="btn btn-lg" style={{ background: '#25d366', border: 'none', color: '#fff', height: 48, padding: '0 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{t('whatsapp.us', 'WhatsApp Us')}</a>
          </div>
        </div>
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
