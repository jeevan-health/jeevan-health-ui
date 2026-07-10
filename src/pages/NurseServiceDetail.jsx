import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { nursingCategories, nursingServices, nurses, nursingFAQs, nurseLevels, nursingPackages, equipmentItems } from '../data/nursingData';

const C = { primary: '#0D9488', accent: '#F59E0B', dark: '#0F766E', bg: '#F0FDFA' };

export default function NurseServiceDetail() {
  const t = useT();
  const { slug } = useParams();
  const [openSections, setOpenSections] = useState({});

  const service = useMemo(() => nursingServices.find(s => s.slug === slug), [slug]);
  const catMeta = useMemo(() => service ? nursingCategories.find(c => c.id === service.category) : null, [service]);
  const theme = catMeta ? catMeta.color : C.primary;

  const toggle = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  const relatedServices = useMemo(() => {
    if (!service) return [];
    return nursingServices.filter(s => s.category === service.category && s.id !== service.id).slice(0, 6);
  }, [service]);

  const serviceFAQs = useMemo(() => {
    if (!service) return [];
    const keywords = service.name.toLowerCase().split(' ');
    return nursingFAQs.filter(faq =>
      keywords.some(kw => faq.q.toLowerCase().includes(kw) || faq.a.toLowerCase().includes(kw))
    ).slice(0, 4);
  }, [service]);

  const specialistNurses = useMemo(() => {
    if (!service) return [];
    const matched = nurses.filter(n => n.specialties.includes(service.category));
    return matched.length >= 2 ? matched.slice(0, 2) : nurses.slice(0, 2);
  }, [service]);

  const categoryEquipment = useMemo(() => {
    if (!catMeta) return [];
    const catName = catMeta.name.toLowerCase();
    if (catName.includes('wound') || catName.includes('bedside')) return equipmentItems.filter(e => e.category === 'monitoring');
    if (catName.includes('icu') || catName.includes('respiratory') || catName.includes('oxygen')) return equipmentItems.filter(e => e.category === 'respiratory');
    if (catName.includes('elderly') || catName.includes('rehab') || catName.includes('mobility')) return equipmentItems.filter(e => e.category === 'mobility');
    return [];
  }, [catMeta]);

  if (!service || !catMeta) {
    return (
      <div className="page-section" style={{ background: C.bg, minHeight: '100vh' }}>
        <div className="container" style={{ textAlign: 'center', padding: '60px 16px' }}>
          <span style={{ fontSize: 48 }}>👩‍⚕️</span>
          <p style={{ color: '#999', marginTop: 12 }}>{t('nurse.service.notFound', 'Service not found')}</p>
          <Link to="/nurse-at-home" className="btn btn-primary" style={{ display: 'inline-block', marginTop: 16, padding: '10px 24px', background: C.primary, color: '#fff', textDecoration: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
            {t('nurse.service.backToHome', '← Back to Nurse at Home')}
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = service.originalPrice && service.originalPrice !== service.price;
  const shareText = `${service.name} - Book nurse at home ₹${service.price} | Jeevan HealthCare`;
  const levelPricing = nurseLevels.map(l => ({
    ...l,
    price: Math.round(service.price * (l.hourlyRate / 599) * 100) / 100,
  }));

  const upcomingSlots = ['Today 2 PM', 'Today 5 PM', 'Tomorrow 9 AM', 'Tomorrow 2 PM', 'Day after 10 AM'];

  return (
    <div className="page-section" style={{ background: C.bg, minHeight: '100vh', paddingBottom: 120 }}>
      <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>

        <Link to="/nurse-at-home" style={{ display: 'flex', alignItems: 'center', gap: 4, color: C.primary, textDecoration: 'none', fontSize: 12, fontWeight: 600, padding: '16px 0 8px' }}>
          ← {t('nurse.service.backToNurseAtHome', 'Back to Nurse at Home')}
        </Link>

        <div style={{ marginBottom: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: `${theme}15`, color: theme }}>{catMeta.name}</span>
          <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: `${C.primary}15`, color: C.primary }}>{service.nurseLevel}</span>
          {service.popular && <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: '#fef3c7', color: '#92400e' }}>{t('nurse.service.popular', 'Most Booked')}</span>}
        </div>

        <div style={{ background: `linear-gradient(135deg, ${theme} 0%, ${theme}dd 100%)`, borderRadius: 16, padding: '24px 20px', color: '#fff', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 32 }}>{catMeta.icon}</span>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: -0.3 }}>{service.name}</h1>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: '2px 0 0' }}>{catMeta.name}</p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', margin: '8px 0 12px', lineHeight: 1.5 }}>{service.description}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12, fontSize: 11 }}>
            <span>⭐ 4.8 Rating</span>
            <span>👥 10,000+ Bookings</span>
            <span>🏠 Home Visit</span>
            <span>✅ Certified Nurses</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div>
              {hasDiscount && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textDecoration: 'line-through' }}>₹{service.originalPrice}</div>}
              <div style={{ fontSize: 28, fontWeight: 800 }}>₹{service.price}</div>
              {hasDiscount && <div style={{ fontSize: 11, color: '#4ade80', fontWeight: 600 }}>Save ₹{service.originalPrice - service.price}</div>}
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px' }}>
              <span>⏱</span><span style={{ fontSize: 12 }}>{service.duration}</span>
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px' }}>
              <span>👩‍⚕️</span><span style={{ fontSize: 12 }}>{service.nurseLevel}</span>
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px' }}>
              <span>🏠</span><span style={{ fontSize: 12 }}>Hyderabad</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            <Link to={`/nurse-at-home/book?service=${slug}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: C.accent, border: 'none', fontSize: 13, fontWeight: 700, padding: '10px 24px', borderRadius: 10, color: '#fff', textDecoration: 'none', boxShadow: `0 4px 14px ${C.accent}40` }}>
              📋 {t('nurse.service.bookNow', 'Book Now')}
            </Link>
            <a href={`https://wa.me/919700104108?text=${encodeURIComponent(`Hi, I want to know more about ${service.name}`)}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px', borderRadius: 10, fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none' }}>
              💬 {t('nurse.service.whatsapp', 'WhatsApp')}
            </a>
          </div>
        </div>

        <div style={{ background: `${C.accent}10`, borderRadius: 14, border: `1px solid ${C.accent}30`, padding: '12px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <span style={{ fontSize: 18 }}>🕐</span>
            <span><strong>{t('nurse.service.availableSlots', 'Available Slots')}:</strong> {upcomingSlots.join(' · ')}</span>
          </div>
          <Link to={`/nurse-at-home/book?service=${slug}&urgent=true`} style={{ padding: '6px 16px', background: C.accent, color: '#fff', borderRadius: 8, fontSize: 11, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            {t('nurse.service.bookUrgent', '🚀 Book Urgent')}
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 6, marginBottom: 14 }}>
          {[
            { icon: '💰', label: t('nurse.service.price', 'Price'), value: `₹${service.price}` },
            { icon: '⏱️', label: t('nurse.service.duration', 'Duration'), value: service.duration },
            { icon: '👩‍⚕️', label: t('nurse.service.nurseLevel', 'Nurse Level'), value: service.nurseLevel },
            { icon: '🏠', label: t('nurse.service.homeVisit', 'Home Visit'), value: t('nurse.service.available', 'Available'), color: '#059669' },
          ].map(item => (
            <div key={item.label} style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8edf2', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, marginBottom: 2 }}>{item.icon}</div>
              <div style={{ fontSize: 9, color: '#999', marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: item.color || '#1a1a1a' }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', overflow: 'hidden', marginBottom: 10 }}>
          <button onClick={() => toggle('whatIs')} style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, color: '#1a1a1a', textAlign: 'left' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 16 }}>🩺</span>{t('nurse.service.whatIs', 'What Is This Service?')}</span>
            <span style={{ fontSize: 12, transition: 'transform 0.2s', transform: openSections.whatIs ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0, color: '#999' }}>▾</span>
          </button>
          {openSections.whatIs && <div style={{ padding: '0 16px 16px', fontSize: 12, color: '#555', lineHeight: 1.6 }}>
            <p style={{ margin: '0 0 10px' }}>{service.longDesc}</p>
            <div style={{ padding: '8px 12px', background: '#f0fdf4', borderRadius: 8, fontSize: 11, color: '#166534', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
              <span>✅</span> {t('nurse.service.whatIsInfo', 'All services delivered by qualified, experienced nurses in the comfort of your home.')}
            </div>
          </div>}
        </div>

        {service.includes && service.includes.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', overflow: 'hidden', marginBottom: 10 }}>
            <button onClick={() => toggle('includes')} style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, color: '#1a1a1a', textAlign: 'left' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 16 }}>📋</span>{t('nurse.service.includes', "What's Included")}</span>
              <span style={{ fontSize: 12, transition: 'transform 0.2s', transform: openSections.includes ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0, color: '#999' }}>▾</span>
            </button>
            {openSections.includes && <div style={{ padding: '0 16px 16px', fontSize: 12, color: '#555', lineHeight: 1.6 }}>
              <p style={{ margin: '0 0 8px', fontSize: 11, color: '#999' }}>{t('nurse.service.includesDesc', 'This service includes:')}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {service.includes.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                    <span style={{ color: '#059669', fontSize: 14 }}>✓</span>
                    <span style={{ fontSize: 12 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>}
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', overflow: 'hidden', marginBottom: 10 }}>
          <button onClick={() => toggle('whoNeeds')} style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, color: '#1a1a1a', textAlign: 'left' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 16 }}>👤</span>{t('nurse.service.whoNeeds', 'Who Needs This?')}</span>
            <span style={{ fontSize: 12, transition: 'transform 0.2s', transform: openSections.whoNeeds ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0, color: '#999' }}>▾</span>
          </button>
          {openSections.whoNeeds && <div style={{ padding: '0 16px 16px', fontSize: 12, color: '#555', lineHeight: 1.6 }}>
            <p style={{ margin: '0 0 8px', fontSize: 11, color: '#999' }}>Ideal for:</p>
            <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li style={{ fontSize: 12, lineHeight: 1.5 }}>Patients requiring {service.name.toLowerCase()} at home</li>
              <li style={{ fontSize: 12, lineHeight: 1.5 }}>Individuals with limited mobility</li>
              <li style={{ fontSize: 12, lineHeight: 1.5 }}>Family caregivers needing professional support</li>
              <li style={{ fontSize: 12, lineHeight: 1.5 }}>Post-surgery or post-hospitalization recovery</li>
              <li style={{ fontSize: 12, lineHeight: 1.5 }}>Chronic condition management at home</li>
            </ul>
            <div style={{ padding: '8px 12px', background: '#f0fdf4', borderRadius: 8, fontSize: 11, color: '#166534', display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 8 }}>
              <span>💡</span> Our nurse will assess the patient's condition before starting any procedure.
            </div>
          </div>}
        </div>

        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', overflow: 'hidden', marginBottom: 10 }}>
          <button onClick={() => toggle('expect')} style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, color: '#1a1a1a', textAlign: 'left' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 16 }}>📅</span>{t('nurse.service.whatToExpect', 'What To Expect')}</span>
            <span style={{ fontSize: 12, transition: 'transform 0.2s', transform: openSections.expect ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0, color: '#999' }}>▾</span>
          </button>
          {openSections.expect && <div style={{ padding: '0 16px 16px', fontSize: 12, color: '#555', lineHeight: 1.6 }}>
            <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: 12 }}>Before the Visit</p>
            <ul style={{ margin: '0 0 10px', paddingLeft: 18 }}>
              <li style={{ fontSize: 12, lineHeight: 1.5 }}>Our team will confirm your appointment and share nurse details</li>
              <li style={{ fontSize: 12, lineHeight: 1.5 }}>Keep your prescriptions and medical records ready</li>
              <li style={{ fontSize: 12, lineHeight: 1.5 }}>Ensure a clean, well-lit space for the procedure</li>
            </ul>
            <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: 12 }}>During the Visit</p>
            <ul style={{ margin: '0 0 10px', paddingLeft: 18 }}>
              <li style={{ fontSize: 12, lineHeight: 1.5 }}>Nurse will verify your identity and explain the procedure</li>
              <li style={{ fontSize: 12, lineHeight: 1.5 }}>All equipment will be sterile and fresh for each session</li>
              <li style={{ fontSize: 12, lineHeight: 1.5 }}>Vitals may be checked before and after the procedure</li>
            </ul>
            <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: 12 }}>After the Visit</p>
            <ul style={{ margin: '0 0 10px', paddingLeft: 18 }}>
              <li style={{ fontSize: 12, lineHeight: 1.5 }}>Nurse will provide aftercare instructions and guidance</li>
              <li style={{ fontSize: 12, lineHeight: 1.5 }}>You will receive a care summary via WhatsApp/Email</li>
              <li style={{ fontSize: 12, lineHeight: 1.5 }}>Follow-up booking can be scheduled easily</li>
            </ul>
          </div>}
        </div>

        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', padding: 16, marginBottom: 10 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16 }}>💰</span> {t('nurse.service.pricingByLevel', 'Pricing by Nurse Level')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {levelPricing.map(l => (
              <div key={l.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: `#f8f9fa`, borderRadius: 8, gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>{l.name}</div>
                    <div style={{ fontSize: 10, color: '#888' }}>{l.description}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: theme }}>₹{l.price}</div>
                  <div style={{ fontSize: 9, color: '#888' }}>{t('nurse.service.perVisit', '/visit')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {categoryEquipment.length > 0 && (
          <div style={{ background: `#fff`, borderRadius: 14, border: `1px solid #e8edf2`, padding: 16, marginBottom: 10 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>🛒</span> {t('nurse.service.equipmentRental', 'Equipment Rental Available')}
            </h3>
            <p style={{ fontSize: 11, color: '#999', margin: '0 0 10px' }}>{t('nurse.service.equipmentDesc', 'Rent medical equipment for home use:')}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {categoryEquipment.map(eq => (
                <Link key={eq.id} to="/medical-equipment" style={{ padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: `${C.primary}10`, border: `1px solid ${C.primary}30`, color: C.primary, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {eq.icon} {eq.name} — ₹{eq.price}{eq.duration}
                </Link>
              ))}
            </div>
            <Link to="/medical-equipment" style={{ display: 'inline-block', marginTop: 8, fontSize: 11, fontWeight: 600, color: C.primary, textDecoration: 'underline' }}>
              {t('nurse.service.viewAllEquipment', 'View all equipment →')}
            </Link>
          </div>
        )}

        <div style={{ background: '#fff8e1', borderRadius: 14, border: '1px solid #ffe082', padding: 16, marginBottom: 10 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16 }}>📦</span> {t('nurse.service.recommendedPackage', 'Save with a Package')}
          </h3>
          <p style={{ fontSize: 11, color: '#888', margin: '0 0 8px' }}>{t('nurse.service.packageDesc', 'Bundle services and save up to 30%:')}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {nursingPackages.slice(0, 3).map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a' }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: '#888' }}>{p.description}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#e65100' }}>₹{p.price}</div>
                  {p.originalPrice > p.price && <div style={{ fontSize: 10, color: '#999', textDecoration: 'line-through' }}>₹{p.originalPrice}</div>}
                </div>
              </div>
            ))}
          </div>
          <Link to={`/nurse-at-home/book?package=recovery`} style={{ display: 'block', textAlign: 'center', marginTop: 10, padding: '10px 0', background: C.accent, color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
            {t('nurse.service.viewPackages', 'View All Packages')} →
          </Link>
        </div>

        {relatedServices.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', padding: 16, marginBottom: 10 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>🔗</span> {t('nurse.service.relatedServices', 'Related Services')}
            </h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {relatedServices.map(rs => (
                <Link key={rs.id} to={`/nurse-at-home/service/${rs.slug}`} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: `${theme}10`, border: `1px solid ${theme}30`, color: theme, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {rs.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {specialistNurses.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', padding: 16, marginBottom: 10 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>🧑‍⚕️</span> {t('nurse.service.specialistNurses', 'Specialist Nurses')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {specialistNurses.map(n => (
                <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#f8f9fa', borderRadius: 8 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${theme}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{n.image}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>{n.name}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{n.qualifications} · {n.experience} years</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <span style={{ color: '#f59e0b', fontSize: 11 }}>★</span>
                      <span style={{ fontSize: 11, fontWeight: 600 }}>{n.rating}</span>
                      <span style={{ fontSize: 10, color: '#999' }}>({n.sessions} sessions)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {serviceFAQs.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', overflow: 'hidden', marginBottom: 10 }}>
            <button onClick={() => toggle('faq')} style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, color: '#1a1a1a', textAlign: 'left' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 16 }}>❓</span>{t('nurse.service.faq', 'Frequently Asked Questions')}</span>
              <span style={{ fontSize: 12, transition: 'transform 0.2s', transform: openSections.faq ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0, color: '#999' }}>▾</span>
            </button>
            {openSections.faq && <div style={{ padding: '0 16px 16px', fontSize: 12, color: '#555', lineHeight: 1.6 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {serviceFAQs.map((faq, i) => (
                  <div key={i} style={{ border: '1px solid #e8edf2', borderRadius: 8, overflow: 'hidden' }}>
                    <button onClick={() => setOpenSections(prev => ({ ...prev, [`faq_${i}`]: !prev[`faq_${i}`] }))} style={{ width: '100%', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 600, color: '#1a1a1a', textAlign: 'left' }}>
                      {faq.q}
                      <span style={{ fontSize: 10, transition: 'transform 0.2s', transform: openSections[`faq_${i}`] ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0, color: '#999' }}>▾</span>
                    </button>
                    {openSections[`faq_${i}`] && <div style={{ padding: '0 12px 10px', fontSize: 11, color: '#888', lineHeight: 1.5 }}>{faq.a}</div>}
                  </div>
                ))}
              </div>
            </div>}
          </div>
        )}

        <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.dark})`, borderRadius: 16, padding: '20px', textAlign: 'center', color: '#fff', marginBottom: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px' }}>{t('nurse.service.needHelp', 'Need Help Choosing?')}</h3>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', margin: '0 0 12px' }}>{t('nurse.service.needHelpDesc', 'Call our care manager for free guidance')}</p>
          <a href="tel:+919700104108" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', background: '#fff', color: C.primary, borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            📞 +91 9700104108
          </a>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MedicalWebPage',
            name: `${service.name} at Home - Hyderabad`,
            description: service.description,
            url: typeof window !== 'undefined' ? window.location.href : '',
            about: { '@type': 'MedicalSpecialty', name: catMeta.name, relevantSpecialty: 'Nursing' },
            offers: { '@type': 'Offer', price: service.price, priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
          })
        }} />
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999, background: '#fff', boxShadow: '0 -4px 16px rgba(0,0,0,0.08)', padding: '8px 16px 12px', display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid #eee' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{service.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: C.accent }}>₹{service.price}</span>
            {hasDiscount && <span style={{ fontSize: 11, color: '#999', textDecoration: 'line-through' }}>₹{service.originalPrice}</span>}
            <span style={{ fontSize: 10, color: '#059669', fontWeight: 600 }}>{t('nurse.service.homeVisit', 'Home Visit')}</span>
          </div>
        </div>
        <a href="tel:+919700104108" style={{ width: 40, height: 40, borderRadius: '50%', background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none', color: '#fff', fontSize: 18 }}>📞</a>
        <Link to={`/nurse-at-home/book?service=${slug}`} style={{ background: C.accent, border: 'none', fontSize: 12, fontWeight: 700, padding: '10px 20px', borderRadius: 10, color: '#fff', textDecoration: 'none', boxShadow: `0 4px 14px ${C.accent}40`, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center' }}>
          📋 {t('nurse.service.bookNow', 'Book Now')}
        </Link>
      </div>
    </div>
  );
}
