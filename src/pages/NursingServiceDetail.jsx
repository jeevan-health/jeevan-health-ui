import { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { nursingCategories, nursingServices, nurses, nursingFAQs } from '../data/nursingData';

function Section({ icon, title, children, open, onToggle, id }) {
  return (
    <div id={id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', overflow: 'hidden', marginBottom: 10, scrollMarginTop: 80 }}>
      <button onClick={onToggle} style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, color: '#1a1a1a', textAlign: 'left' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
          {title}
        </span>
        <span style={{ fontSize: 12, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0, color: '#999' }}>▾</span>
      </button>
      {open && <div style={{ padding: '0 16px 16px', fontSize: 12, color: '#555', lineHeight: 1.6 }}>{children}</div>}
    </div>
  );
}

function Tag({ label, color, bg }) {
  return <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: bg || '#e8f0fe', color: color || '#1866C9', display: 'inline-block' }}>{label}</span>;
}

function InfoItem({ icon, label, value, valueColor, bold, strikethrough }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 14, width: 20, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 9, color: '#999', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: bold ? 700 : 600, color: valueColor || '#1a1a1a', textDecoration: strikethrough ? 'line-through' : 'none' }}>{value}</div>
      </div>
    </div>
  );
}

function InfoBox({ children, bg, color, icon }) {
  return (
    <div style={{ marginTop: 8, padding: '8px 12px', background: bg || '#e8f0fe', borderRadius: 8, fontSize: 11, color: color || '#555', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
      {icon && <span style={{ flexShrink: 0, marginTop: 1 }}>{icon}</span>}
      <span>{children}</span>
    </div>
  );
}

function Pill({ children, active, color }) {
  return (
    <button style={{ padding: '4px 12px', borderRadius: 16, border: `1px solid ${active ? (color || '#7C3AED') : '#ddd'}`, background: active ? `${color || '7C3AED'}15` : '#fff', color: active ? (color || '#7C3AED') : '#888', fontSize: 11, cursor: 'pointer', fontWeight: active ? 600 : 400, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
      {children}
    </button>
  );
}

export default function NursingServiceDetail() {
  const t = useT();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState({});

  const service = useMemo(() => nursingServices.find(s => s.slug === slug), [slug]);
  const catMeta = useMemo(() => service ? nursingCategories.find(c => c.id === service.category) : null, [service]);
  const theme = catMeta ? catMeta.color : '#7C3AED';
  const catIcon = catMeta ? catMeta.icon : '🩺';

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

  const recommendedPackage = useMemo(() => {
    const { nursingPackages } = require('../data/nursingData');
    return nursingPackages.find(p => p.popular) || nursingPackages[0];
  }, []);

  const specialistNurses = useMemo(() => {
    if (!service) return [];
    const matched = nurses.filter(n => n.specialties.includes(service.category));
    return matched.length >= 2 ? matched.slice(0, 2) : nurses.slice(0, 2);
  }, [service]);

  if (!service || !catMeta) {
    return (
      <div className="page-section" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
        <div className="container" style={{ textAlign: 'center', padding: '40px 16px' }}>
          <span style={{ fontSize: 48 }}>🩺</span>
          <p style={{ color: '#999', marginTop: 12 }}>{t('nursing.service.detail.notFound', 'Service not found')}</p>
          <Link to="/nursing-care/services" className="btn btn-primary" style={{ display: 'inline-block', marginTop: 16, padding: '10px 24px', background: '#7C3AED', color: '#fff', textDecoration: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
            {t('nursing.service.detail.backToServices', '← Back to Services')}
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = service.originalPrice && service.originalPrice !== service.price;
  const levelColors = {
    'Trained Caregiver': '#10B981',
    'Staff Nurse': '#3B82F6',
    'Senior Staff Nurse': '#8B5CF6',
    'Specialist Nurse': '#E11D48',
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${service.name} - ${t('nursing.service.detail.bookAt', 'Book nursing care at home')} ₹${service.price} | ${t('nursing.service.detail.siteName', 'Jeevan HealthCare at Home')}`;

  return (
    <div className="page-section" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 800, paddingBottom: 120, margin: '0 auto' }}>

        {/* Back */}
        <Link to="/nursing-care/services" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#888', textDecoration: 'none', fontSize: 12, padding: '12px 0' }}>
          {t('nursing.service.detail.back', '← Back to Services')}
        </Link>

        {/* ===== 1. TAGS ROW ===== */}
        <div style={{ marginBottom: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Tag label={catMeta.name} bg={`${theme}15`} color={theme} />
          <Tag label={service.nurseLevel} bg={`${(levelColors[service.nurseLevel] || '#3B82F6')}15`} color={levelColors[service.nurseLevel] || '#3B82F6'} />
          {service.popular && <Tag label={t('nursing.service.detail.popular', 'Popular')} bg="#fef3c7" color="#92400e" />}
        </div>

        {/* ===== 2. HERO SECTION ===== */}
        <div style={{ background: `linear-gradient(135deg, ${theme} 0%, ${theme}dd 100%)`, borderRadius: 16, padding: '24px 20px', color: '#fff', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 32 }}>{catIcon}</span>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: -0.3 }}>{service.name}</h1>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: '2px 0 0' }}>{catMeta.name}</p>
            </div>
          </div>

          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', margin: '8px 0 12px', lineHeight: 1.5 }}>
            {service.description}
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12, fontSize: 11 }}>
            <span>{t('nursing.service.detail.rating', '⭐ 4.8 Rating')}</span>
            <span>{t('nursing.service.detail.bookings', '👥 10,000+ Bookings')}</span>
            <span>{t('nursing.service.detail.homeVisit', '🏠 Home Visit Available')}</span>
            <span>{t('nursing.service.detail.certifiedNurses', '✅ Certified Nurses')}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div>
              {hasDiscount && (
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textDecoration: 'line-through' }}>
                  {t('nursing.service.detail.original', 'Original')}: ₹{service.originalPrice}
                </div>
              )}
              <div style={{ fontSize: 28, fontWeight: 800 }}>₹{service.price}</div>
              {hasDiscount && (
                <div style={{ fontSize: 11, color: '#4ade80', fontWeight: 600 }}>
                  {t('nursing.service.detail.save', 'Save')} ₹{service.originalPrice - service.price}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px' }}>
              <span>⏱</span>
              <span style={{ fontSize: 12 }}>{service.duration}</span>
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px' }}>
              <span>👩‍⚕️</span>
              <span style={{ fontSize: 12 }}>{service.nurseLevel}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            <Link to={`/nursing-care/book?service=${slug}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#FF3B30', border: 'none', fontSize: 13, fontWeight: 700, padding: '10px 24px', borderRadius: 10, color: '#fff', textDecoration: 'none', boxShadow: '0 4px 14px rgba(255,59,48,0.3)' }}>
              {t('nursing.service.detail.bookNow', '📋 Book Now')}
            </Link>
            <a href={`https://wa.me/919700104108?text=${encodeURIComponent(`Hi, I want to know more about ${service.name}`)}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px', borderRadius: 10, fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none' }}>
              {t('nursing.service.detail.whatsapp', '💬 WhatsApp')}
            </a>
          </div>
        </div>

        {/* ===== 3. QUICK INFO CARDS ===== */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 6, marginBottom: 14 }}>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8edf2', padding: '10px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>💰</div>
            <div style={{ fontSize: 9, color: '#999', marginBottom: 2 }}>{t('nursing.service.detail.price', 'Price')}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a' }}>₹{service.price}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8edf2', padding: '10px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>⏱️</div>
            <div style={{ fontSize: 9, color: '#999', marginBottom: 2 }}>{t('nursing.service.detail.duration', 'Duration')}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a' }}>{service.duration}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8edf2', padding: '10px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>👩‍⚕️</div>
            <div style={{ fontSize: 9, color: '#999', marginBottom: 2 }}>{t('nursing.service.detail.nurseLevel', 'Nurse Level')}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a' }}>{service.nurseLevel}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8edf2', padding: '10px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>🏠</div>
            <div style={{ fontSize: 9, color: '#999', marginBottom: 2 }}>{t('nursing.service.detail.homeVisit', 'Home Visit')}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#059669' }}>{t('nursing.service.detail.available', 'Available')}</div>
          </div>
        </div>

        {/* ===== 4. WHAT IS THIS SERVICE ===== */}
        <Section icon="🩺" title={t('nursing.service.detail.whatIs', 'What Is This Service?')} open={openSections.whatIs} onToggle={() => toggle('whatIs')}>
          <p style={{ margin: '0 0 10px' }}>{service.longDesc}</p>
          <InfoBox icon="✅" bg="#f0fdf4" color="#166534">{t('nursing.service.detail.whatIsInfo', 'All services are delivered by qualified, experienced nurses in the comfort of your home.')}</InfoBox>
        </Section>

        {/* ===== 5. WHAT'S INCLUDED ===== */}
        {service.includes && service.includes.length > 0 && (
          <Section icon="📋" title={t('nursing.service.detail.includes', "What's Included")} open={openSections.includes} onToggle={() => toggle('includes')}>
            <p style={{ margin: '0 0 8px', fontSize: 11, color: '#999' }}>{t('nursing.service.detail.includesDesc', 'This service includes the following:')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {service.includes.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                  <span style={{ color: '#059669', fontSize: 14 }}>✓</span>
                  <span style={{ fontSize: 12 }}>{item}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ===== 6. WHO NEEDS THIS ===== */}
        <Section icon="👤" title={t('nursing.service.detail.whoNeeds', 'Who Needs This?')} open={openSections.whoNeeds} onToggle={() => toggle('whoNeeds')}>
          <p style={{ margin: '0 0 8px', fontSize: 11, color: '#999' }}>{t('nursing.service.detail.whoNeedsDesc', 'This service is ideal for:')}</p>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              t('nursing.service.detail.target1', `Patients requiring ${service.name.toLowerCase()} at home`),
              t('nursing.service.detail.target2', 'Individuals with limited mobility or transportation'),
              t('nursing.service.detail.target3', 'Family caregivers needing professional support'),
              t('nursing.service.detail.target4', 'Post-surgery or post-hospitalization recovery'),
              t('nursing.service.detail.target5', 'Chronic condition management at home'),
            ].map((item, i) => (
              <li key={i} style={{ fontSize: 12, lineHeight: 1.5 }}>{item}</li>
            ))}
          </ul>
          <InfoBox icon="💡" bg="#f0fdf4" color="#166534">{t('nursing.service.detail.whoNeedsInfo', 'Our nurse will assess the patients condition before starting any procedure.')}</InfoBox>
        </Section>

        {/* ===== 7. WHAT TO EXPECT ===== */}
        <Section icon="📅" title={t('nursing.service.detail.whatToExpect', 'What To Expect')} open={openSections.expect} onToggle={() => toggle('expect')}>
          <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: 12 }}>{t('nursing.service.detail.beforeVisit', 'Before the Visit')}</p>
          <ul style={{ margin: '0 0 10px', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <li style={{ fontSize: 12, lineHeight: 1.5 }}>{t('nursing.service.detail.expectBefore1', 'Our team will confirm your appointment and share nurse details')}</li>
            <li style={{ fontSize: 12, lineHeight: 1.5 }}>{t('nursing.service.detail.expectBefore2', 'Keep your prescriptions and medical records ready')}</li>
            <li style={{ fontSize: 12, lineHeight: 1.5 }}>{t('nursing.service.detail.expectBefore3', 'Ensure a clean, well-lit space for the procedure')}</li>
          </ul>
          <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: 12 }}>{t('nursing.service.detail.duringVisit', 'During the Visit')}</p>
          <ul style={{ margin: '0 0 10px', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <li style={{ fontSize: 12, lineHeight: 1.5 }}>{t('nursing.service.detail.expectDuring1', 'Nurse will verify your identity and explain the procedure')}</li>
            <li style={{ fontSize: 12, lineHeight: 1.5 }}>{t('nursing.service.detail.expectDuring2', 'All equipment will be sterile and fresh for each session')}</li>
            <li style={{ fontSize: 12, lineHeight: 1.5 }}>{t('nursing.service.detail.expectDuring3', 'Vitals may be checked before and after the procedure')}</li>
          </ul>
          <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: 12 }}>{t('nursing.service.detail.afterVisit', 'After the Visit')}</p>
          <ul style={{ margin: '0 0 10px', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <li style={{ fontSize: 12, lineHeight: 1.5 }}>{t('nursing.service.detail.expectAfter1', 'Nurse will provide aftercare instructions and guidance')}</li>
            <li style={{ fontSize: 12, lineHeight: 1.5 }}>{t('nursing.service.detail.expectAfter2', 'You will receive a care summary via WhatsApp/Email')}</li>
            <li style={{ fontSize: 12, lineHeight: 1.5 }}>{t('nursing.service.detail.expectAfter3', 'Follow-up booking can be scheduled easily')}</li>
          </ul>
          <InfoBox icon="💡" bg="#f0fdf4" color="#166534">{t('nursing.service.detail.expectInfo', 'Our 24/7 support team is available if you have any concerns after the visit.')}</InfoBox>
        </Section>

        {/* ===== 8. NURSE REQUIREMENTS ===== */}
        <Section icon="👩‍⚕️" title={t('nursing.service.detail.nurseRequirements', 'Nurse Requirements')} open={openSections.requirements} onToggle={() => toggle('requirements')}>
          <p style={{ margin: '0 0 8px' }}>{t('nursing.service.detail.nurseRequirementsDesc', `This service is delivered by a ${service.nurseLevel} with relevant expertise.`)}</p>
          <div style={{ padding: '10px 14px', background: `${theme}10`, borderRadius: 8, border: `1px solid ${theme}30`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 28 }}>👩‍⚕️</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{service.nurseLevel}</div>
              <div style={{ fontSize: 11, color: '#888' }}>{t('nursing.service.detail.nurseLevelDesc', 'Qualified professional for this service')}</div>
            </div>
          </div>
          <InfoBox icon="✅" bg="#f0fdf4" color="#166534">{t('nursing.service.detail.requirementsInfo', 'All nurses are verified, registered, and have minimum 3 years of clinical experience.')}</InfoBox>
        </Section>

        {/* ===== 9. RELATED SERVICES ===== */}
        {relatedServices.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', padding: 16, marginBottom: 10 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>🔗</span> {t('nursing.service.detail.relatedServices', 'Related Services')}
            </h3>
            <p style={{ fontSize: 11, color: '#999', margin: '0 0 8px' }}>{t('nursing.service.detail.relatedDesc', 'Other services in this category:')}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {relatedServices.map(rs => (
                <Link key={rs.id} to={`/nursing-care/service/${rs.slug}`} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: `${theme}10`, border: `1px solid ${theme}30`, color: theme, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 12 }}>{catIcon}</span> {rs.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ===== 10. FAQ ===== */}
        {serviceFAQs.length > 0 && (
          <Section icon="❓" title={t('nursing.service.detail.faq', 'Frequently Asked Questions')} open={openSections.faq} onToggle={() => toggle('faq')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {serviceFAQs.map((faq, i) => (
                <div key={i} style={{ border: '1px solid #e8edf2', borderRadius: 8, overflow: 'hidden' }}>
                  <button onClick={() => setOpenSections(prev => ({ ...prev, [`faq_${i}`]: !prev[`faq_${i}`] }))} style={{ width: '100%', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 600, color: '#1a1a1a', textAlign: 'left' }}>
                    {faq.q}
                    <span style={{ fontSize: 10, transition: 'transform 0.2s', transform: openSections[`faq_${i}`] ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0, color: '#999' }}>▾</span>
                  </button>
                  {openSections[`faq_${i}`] && (
                    <div style={{ padding: '0 12px 10px', fontSize: 11, color: '#888', lineHeight: 1.5 }}>{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ===== 11. RECOMMENDED PACKAGE ===== */}
        {recommendedPackage && (
          <div style={{ background: '#fff8e1', borderRadius: 14, border: '1px solid #ffe082', padding: 16, marginBottom: 10 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>📦</span> {t('nursing.service.detail.recommendedPackage', 'Recommended Package')}
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>⭐ {recommendedPackage.name}</div>
                <div style={{ fontSize: 11, color: '#888' }}>{recommendedPackage.description}</div>
                {recommendedPackage.includes && (
                  <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                    {recommendedPackage.includes.map((inc, i) => (
                      <span key={i} style={{ fontSize: 9, padding: '1px 6px', borderRadius: 4, background: '#fff3cd', color: '#856404', fontWeight: 600 }}>{inc}</span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#e65100' }}>₹{recommendedPackage.price}</div>
                {recommendedPackage.originalPrice > recommendedPackage.price && (
                  <div style={{ fontSize: 11, color: '#999', textDecoration: 'line-through' }}>₹{recommendedPackage.originalPrice}</div>
                )}
              </div>
            </div>
            <Link to={`/nursing-care/book?package=${recommendedPackage.id}`} style={{ display: 'block', textAlign: 'center', marginTop: 10, padding: '10px 0', background: theme, color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
              {t('nursing.service.detail.bookThisPackage', 'Book This Package')} →
            </Link>
          </div>
        )}

        {/* ===== 12. SPECIALIST NURSES ===== */}
        {specialistNurses.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', padding: 16, marginBottom: 10 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>🧑‍⚕️</span> {t('nursing.service.detail.specialistNurses', 'Specialist Nurses')}
            </h3>
            <p style={{ fontSize: 11, color: '#999', margin: '0 0 10px' }}>{t('nursing.service.detail.specialistDesc', 'Our expert nurses who can provide this service:')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {specialistNurses.map(n => (
                <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#f8f9fa', borderRadius: 8 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${theme}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{n.image}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>{n.name}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{n.qualifications} · {n.experience} {t('nursing.service.detail.years', 'years')}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <span style={{ color: '#f59e0b', fontSize: 11 }}>★</span>
                      <span style={{ fontSize: 11, fontWeight: 600 }}>{n.rating}</span>
                      <span style={{ fontSize: 10, color: '#999' }}>({n.sessions} {t('nursing.service.detail.sessions', 'sessions')})</span>
                    </div>
                    <div style={{ display: 'flex', gap: 3, marginTop: 2, flexWrap: 'wrap' }}>
                      {n.languages.slice(0, 2).map((lang, i) => (
                        <span key={i} style={{ fontSize: 9, padding: '1px 5px', borderRadius: 4, background: '#e8e8e8', color: '#666', fontWeight: 500 }}>{lang}</span>
                      ))}
                      {n.languages.length > 2 && (
                        <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 4, background: '#e8e8e8', color: '#666' }}>+{n.languages.length - 2}</span>
                      )}
                    </div>
                  </div>
                  <Link to={`/nursing-care/nurse/${n.id}`} style={{ padding: '6px 14px', borderRadius: 6, background: theme, color: '#fff', fontSize: 11, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                    {t('nursing.service.detail.viewProfile', 'View Profile')}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== 13. SEO STRUCTURED DATA ===== */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MedicalWebPage',
            name: `${service.name} Nursing Service`,
            description: service.description,
            url: typeof window !== 'undefined' ? window.location.href : '',
            about: {
              '@type': 'MedicalSpecialty',
              name: catMeta.name,
              relevantSpecialty: 'Nursing',
            },
            offers: {
              '@type': 'Offer',
              price: service.price,
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
            },
          })
        }} />
      </div>

      {/* ===== STICKY MOBILE BOOKING BAR ===== */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999, background: '#fff', boxShadow: '0 -4px 16px rgba(0,0,0,0.08)', padding: '8px 16px 12px', display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid #eee' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{service.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#e53935' }}>₹{service.price}</span>
            {hasDiscount && (
              <span style={{ fontSize: 11, color: '#999', textDecoration: 'line-through' }}>₹{service.originalPrice}</span>
            )}
            <span style={{ fontSize: 10, color: '#059669', fontWeight: 600 }}>{t('nursing.service.detail.homeVisit', 'Home Visit')}</span>
          </div>
        </div>
        <a href="tel:+919700104108" style={{ width: 40, height: 40, borderRadius: '50%', background: theme, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none', color: '#fff', fontSize: 18 }}>📞</a>
        <Link to={`/nursing-care/book?service=${slug}`} className="btn btn-primary" style={{ background: '#FF3B30', border: 'none', fontSize: 12, fontWeight: 700, padding: '10px 20px', borderRadius: 10, color: '#fff', textDecoration: 'none', boxShadow: '0 4px 14px rgba(255,59,48,0.3)', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center' }}>
          {t('nursing.service.detail.bookNow', '📋 Book Now')}
        </Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .page-section { padding: 0; }
          .container { padding-left: 12px; padding-right: 12px; }
        }
        .btn-primary { transition: all 0.2s; border-radius: 10px; cursor: pointer; font-family: inherit; }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
      `}</style>
    </div>
  );
}
