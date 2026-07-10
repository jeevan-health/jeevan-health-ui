import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { vaccineCategories, vaccines, getVaccinesByCategory } from '../data/vaccinationData';

const STEPS = [
  { icon: '📅', title: 'choose.vaccine', desc: 'Choose the vaccine you need from our comprehensive list.' },
  { icon: '📋', title: 'book.appointment', desc: 'Pick a convenient date & time. Home or clinic visit.' },
  { icon: '👨‍⚕️', title: 'Nurse Visits / Clinic Visit', desc: 'Trained healthcare professional administers the vaccine.' },
  { icon: '💉', title: 'Vaccination Done', desc: 'Safe vaccination with full aseptic protocol. Certificate provided.' },
  { icon: '🔔', title: 'Reminder Set', desc: 'Get automated reminders for the next dose or booster schedule.' },
];

const FAQS = [
  { q: 'What vaccines are available?', a: 'We offer all major vaccines across categories — childhood (IAP schedule), adult, travel, seasonal flu, pregnancy (Tdap), and senior vaccines (pneumococcal, shingles). View our full list above.' },
  { q: 'Can I get vaccination at home?', a: 'Yes, most vaccines can be administered at home by our trained nurses. Some live vaccines may require a clinic visit for safety reasons.' },
  { q: 'Are vaccines genuine?', a: 'All our vaccines are sourced from WHO-approved manufacturers and stored in temperature-controlled cold chains. We only use government-certified vaccines.' },
  { q: 'How long does vaccination take?', a: 'The vaccination itself takes only a few minutes. After vaccination, we recommend a 15-30 minute observation period to monitor for any immediate reactions.' },
  { q: 'What documents are required?', a: 'No special documents are needed. For child vaccinations, please bring the child\'s immunization record if available. For travel vaccines, your passport and travel itinerary.' },
  { q: 'Can I book vaccination for my child?', a: 'Yes, we offer complete childhood immunization as per the IAP schedule. We track doses and send reminders for upcoming vaccines.' },
  { q: 'Do you provide vaccination certificates?', a: 'Yes, digital vaccination certificates are provided. Travel vaccines include the International Certificate of Vaccination (Yellow Card) where applicable.' },
  { q: 'What is the cancellation policy?', a: 'Free cancellation up to 4 hours before the appointment. Late cancellations may incur a ₹100 fee.' },
];

export default function VaccinationAtHome() {
  const t = useT();
  const [activeCategory, setActiveCategory] = useState('all');
  const [quickForm, setQuickForm] = useState({ category: '', age: '', location: '', mobile: '' });
  const [quickSubmitted, setQuickSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const quickRef = useRef();

  const filteredVaccines = activeCategory === 'all'
    ? vaccines.slice(0, 8)
    : getVaccinesByCategory(activeCategory);

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickForm.category || !quickForm.mobile) return;
    const bookings = JSON.parse(localStorage.getItem('jh_vaccination_bookings') || '[]');
    bookings.push({
      ...quickForm,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'Quick Request',
      source: 'quick-booking-widget',
    });
    localStorage.setItem('jh_vaccination_bookings', JSON.stringify(bookings));
    setQuickSubmitted(true);
    setTimeout(() => {
      setQuickSubmitted(false);
      setQuickForm({ category: '', age: '', location: '', mobile: '' });
    }, 4000);
  };

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

  return (
    <div>
      {/* HERO SECTION */}
      <div className="v-hero" style={{ background: `linear-gradient(135deg, ${COLORS.heroFrom} 0%, ${COLORS.heroMid} 50%, ${COLORS.heroTo} 100%)`, padding: '48px 0 56px', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 36 }}>💉</span>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Jeevan Healthcare</div>
              <h1 className="v-hero-title" style={{ color: '#fff', fontSize: 48, fontWeight: 800, margin: 0, lineHeight: 1.15 }}>{t('protect.family')}</h1>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: '0 0 12px', maxWidth: 480 }}>
            {t('vaccines.for')} <strong>{t('babies')}</strong> | <strong>{t('children')}</strong> | <strong>{t('adults')}</strong> | <strong>{t('seniors')}</strong> | <strong>{t('travellers')}</strong>
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {[t('certified'), t('genuine'), t('home.vaccination'), t('digital.records')].map(b => (
              <span key={b} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: 20 }}>
                <span style={{ color: '#22C55E', fontSize: 12 }}>✓</span> {b}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/vaccination/all-vaccines" className="btn btn-lg" style={{ background: COLORS.accent, border: 'none', color: '#fff', height: 48, padding: '0 28px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{t('book.vaccination')}</Link>
            <Link to="/vaccination/vaccine-finder" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)', color: '#fff', height: 48, padding: '0 28px', fontSize: 16, fontWeight: 600, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{t('find.my.vaccine')}</Link>
            <Link to="/vaccination/wallet" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', height: 48, padding: '0 28px', fontSize: 16, fontWeight: 600, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{t('my.wallet')}</Link>
            <Link to="/vaccination/corporate" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', height: 48, padding: '0 28px', fontSize: 16, fontWeight: 600, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{t('corporate')}</Link>
          </div>
        </div>
      </div>

      {/* QUICK LINKS */}
      <div style={{ background: COLORS.bg, borderBottom: '1px solid #CCFBF1', padding: '12px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link to="/vaccination/schedule" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 14px', borderRadius: 8, background: '#fff', border: '1px solid #e2e8f0', textDecoration: 'none', fontSize: 11, fontWeight: 600, color: '#0f172a' }}>📋 {t('schedule')}</Link>
            <Link to="/vaccination/compare" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 14px', borderRadius: 8, background: '#fff', border: '1px solid #e2e8f0', textDecoration: 'none', fontSize: 11, fontWeight: 600, color: '#0f172a' }}>📊 {t('compare')}</Link>
            <Link to="/vaccination/camps" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 14px', borderRadius: 8, background: '#fff', border: '1px solid #e2e8f0', textDecoration: 'none', fontSize: 11, fontWeight: 600, color: '#0f172a' }}>📍 {t('camps')}</Link>
            <Link to="/vaccination/bulk-booking" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 14px', borderRadius: 8, background: '#fff', border: '1px solid #e2e8f0', textDecoration: 'none', fontSize: 11, fontWeight: 600, color: '#0f172a' }}>🏥 {t('bulk.booking')}</Link>
            <Link to="/vaccination/vaccine-finder" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 14px', borderRadius: 8, background: '#fff', border: '1px solid #e2e8f0', textDecoration: 'none', fontSize: 11, fontWeight: 600, color: '#0f172a' }}>🔍 {t('vaccine.finder')}</Link>
            <Link to="/vaccination/wallet" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 14px', borderRadius: 8, background: '#fff', border: '1px solid #e2e8f0', textDecoration: 'none', fontSize: 11, fontWeight: 600, color: '#0f172a' }}>💳 {t('wallet')}</Link>
          </div>
        </div>
      </div>

      {/* QUICK BOOKING WIDGET */}
      <div className="page-section" style={{ background: '#fff', borderBottom: `1px solid #CCFBF1` }} ref={quickRef}>
        <div className="container" style={{ maxWidth: 560 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>{t('book.your.vaccination', 'Book Your Vaccination')}</h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px', textAlign: 'center' }}>{t('quick.booking', 'Quick booking — we\'ll call you to confirm')}</p>
          {quickSubmitted ? (
            <div style={{ padding: 20, background: '#dcfce7', borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>✅</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px', color: '#166534' }}>{t('request.submitted')}</h3>
              <p style={{ fontSize: 12, color: '#166534', margin: 0 }}>{t('quick.booking.confirm', 'We\'ll contact you shortly to confirm your appointment.')}</p>
            </div>
          ) : (
            <form onSubmit={handleQuickSubmit} style={{ display: 'grid', gap: 10 }}>
              <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('who.is.for', 'Who is the vaccine for?')}</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {vaccineCategories.map(c => (
                    <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, border: quickForm.category === c.id ? `2px solid ${COLORS.primary}` : '1px solid #d0d5dd', background: quickForm.category === c.id ? COLORS.primaryLight : '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                      <input type="radio" name="q-cat" value={c.id} checked={quickForm.category === c.id} onChange={e => setQuickForm(f => ({ ...f, category: e.target.value }))} style={{ accentColor: COLORS.primary }} />
                      {c.icon} {c.name}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('age.label', 'Age')}</label>
                  <select value={quickForm.age} onChange={e => setQuickForm(f => ({ ...f, age: e.target.value }))} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                    <option value="">Select</option>
                    <option value="0-1">0-1 Year</option>
                    <option value="1-5">1-5 Years</option>
                    <option value="5-18">5-18 Years</option>
                    <option value="18-45">18-45 Years</option>
                    <option value="45+">45+ Years</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('location', 'Location')}</label>
                  <input value={quickForm.location} onChange={e => setQuickForm(f => ({ ...f, location: e.target.value }))} placeholder="Your area / city" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('mobile.number', 'Mobile Number')} *</label>
                <input required value={quickForm.mobile} onChange={e => setQuickForm(f => ({ ...f, mobile: e.target.value }))} placeholder="10-digit mobile number" type="tel" pattern="[0-9]{10}" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" style={{ height: 48, padding: '0 24px', borderRadius: 8, border: 'none', background: COLORS.accent, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{t('book.now').toUpperCase()} →</button>
            </form>
          )}
        </div>
      </div>

      {/* VACCINATION CATEGORIES */}
      <div className="page-section container">
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{t('vaccination.categories')}</h2>
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{t('comprehensive')}</p>
        <div className="v-cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          {vaccineCategories.map(c => {
            const count = getVaccinesByCategory(c.id).length;
            return (
              <Link key={c.id} to={`/vaccination/category/${c.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ padding: 18, borderRadius: 14, border: `1px solid ${c.color}20`, background: `${c.color}06`, borderTop: `3px solid ${c.color}`, height: '100%' }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{c.icon}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 2px', color: '#0f172a' }}>{c.name}</h3>
                  <p style={{ fontSize: 11, color: c.color, fontWeight: 600, margin: '0 0 4px' }}>{c.age}</p>
                  <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 6px', lineHeight: 1.4 }}>{c.description}</p>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: `${c.color}15`, color: c.color, fontWeight: 600 }}>{count} Vaccines</span>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="v-cat-scroll">
          {vaccineCategories.map(c => {
            const count = getVaccinesByCategory(c.id).length;
            return (
              <Link key={c.id} to={`/vaccination/category/${c.slug}`} style={{ textDecoration: 'none', flex: '0 0 160px' }}>
                <div style={{ padding: 14, borderRadius: 12, border: `1px solid ${c.color}20`, background: `${c.color}06`, borderTop: `3px solid ${c.color}`, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{c.icon}</div>
                  <h3 style={{ fontSize: 12, fontWeight: 700, margin: '0 0 2px', color: '#0f172a' }}>{c.name}</h3>
                  <p style={{ fontSize: 10, color: c.color, fontWeight: 600, margin: '0 0 4px' }}>{c.age}</p>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: `${c.color}15`, color: c.color, fontWeight: 600 }}>{count} Vaccines</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* POPULAR VACCINES */}
      <div className="page-section" style={{ background: COLORS.bg }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>{t('popular.vaccines')}</h2>
              <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{t('popular.subtitle', 'Most booked vaccines on Jeevan Healthcare')}</p>
            </div>
            <Link to="/vaccination/all-vaccines" style={{ fontSize: 12, color: COLORS.primary, fontWeight: 600, textDecoration: 'none' }}>{t('view.all', 'View All')} →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {vaccines.slice(0, 8).map(v => (
              <Link key={v.id} to={`/vaccination/${v.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ padding: 0, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '14px 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: COLORS.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>💉</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{v.name}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{v.disease}</div>
                    </div>
                  </div>
                  <div style={{ padding: '8px 16px 0', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: COLORS.primaryLight, color: COLORS.primary, fontWeight: 600 }}>Age: {v.ageGroup}</span>
                    <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: '#F0FDF4', color: '#16a34a', fontWeight: 600 }}>{v.doseCount} Dose{v.doseCount > 1 ? 's' : ''}</span>
                    <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: '#FFF7ED', color: '#ea580c', fontWeight: 600 }}>{v.availability}</span>
                  </div>
                  <div style={{ padding: '8px 16px 0', fontSize: 12, color: '#64748b', lineHeight: 1.5, flex: 1 }}>{v.description}</div>
                  <div style={{ padding: '10px 16px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', marginTop: 10 }}>
                    <div>
                      <span style={{ fontWeight: 800, color: '#059669', fontSize: 18 }}>₹{v.price}</span>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>/dose</span>
                    </div>
                    <span style={{ height: 36, padding: '0 16px', borderRadius: 8, background: COLORS.primary, color: '#fff', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{t('view.details')} →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* WHY CHOOSE JEEVAN VACCINATION */}
      <div className="page-section container">
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>{t('why.choose', 'Why Choose Jeevan Vaccination')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
          {[
            { icon: '👨‍⚕️', title: 'Certified Healthcare Team', desc: 'Trained nurses and doctors with clinical experience' },
            { icon: '🌡️', title: 'Temperature Controlled Storage', desc: 'Cold chain maintained from storage to administration' },
            { icon: '✅', title: 'Genuine Vaccines', desc: 'WHO-approved, government-certified vaccine sources' },
            { icon: '🏠', title: 'Home Service Available', desc: 'Get vaccinated at your doorstep, free home visit' },
            { icon: '📱', title: 'Digital Records', desc: 'Secure digital vaccination certificate and history' },
            { icon: '🔔', title: 'Reminder Support', desc: 'Automated reminders for next doses and boosters' },
          ].map(item => (
            <div key={item.title} style={{ textAlign: 'center', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
              <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{item.title}</h3>
              <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.4 }}>{item.desc}</p>
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

      {/* FAQ */}
      <div className="page-section container" style={{ maxWidth: 700 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>{t('faq.heading', 'Frequently Asked Questions')}</h2>
        <div style={{ display: 'grid', gap: 8 }}>
          {FAQS.map(f => (
            <div key={f.q} style={{ borderRadius: 10, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
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

      {/* FINAL CTA */}
      <div className="page-section" style={{ background: `linear-gradient(135deg, ${COLORS.heroFrom}, ${COLORS.heroMid})`, textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{t('protect.today', 'Protect Your Family Today')}</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 16 }}>{t('book.stay.protected', 'Book your vaccination and stay protected with Jeevan Healthcare')}</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/vaccination/all-vaccines" className="btn btn-lg" style={{ background: COLORS.accent, border: 'none', color: '#fff', height: 48, padding: '0 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{t('book.vaccination')}</Link>
            <a href="https://wa.me/919700104108?text=Hi%2C%20I%20want%20to%20know%20more%20about%20vaccination%20services" target="_blank" rel="noopener noreferrer" className="btn btn-lg" style={{ background: '#25d366', border: 'none', color: '#fff', height: 48, padding: '0 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{t('talk.to.expert', 'Talk to Expert')}</a>
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

