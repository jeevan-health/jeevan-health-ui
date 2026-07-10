import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { vaccines, vaccineCategories, getVaccineBySlug, getCategoryById } from '../data/vaccinationData';

const C = { primary: '#2563EB', accent: '#FF3B30', bg: '#EFF6FF', dark: '#1D4ED8' };

function Section({ icon, title, children, open, onToggle }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: 10, scrollMarginTop: 80 }}>
      <button onClick={onToggle} style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, color: '#0f172a', textAlign: 'left' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
          {title}
        </span>
        <span style={{ fontSize: 12, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0, color: '#94a3b8' }}>▾</span>
      </button>
      {open && <div style={{ padding: '0 16px 16px', fontSize: 13, color: '#475569', lineHeight: 1.7 }}>{children}</div>}
    </div>
  );
}

export default function VaccineTreatmentDetail() {
  const t = useT();
  const { slug } = useParams();
  const [openSections, setOpenSections] = useState({});
  const [faqFilter, setFaqFilter] = useState('all');

  const vaccine = useMemo(() => getVaccineBySlug(slug), [slug]);
  const category = useMemo(() => vaccine ? getCategoryById(vaccine.category) : null, [vaccine]);
  const theme = category ? category.color : C.primary;

  const toggle = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  const relatedVaccines = useMemo(() => {
    if (!category) return [];
    return vaccines.filter(v => v.category === vaccine.category && v.slug !== vaccine.slug).slice(0, 6);
  }, [vaccine, category]);

  const faqCategories = ['all', 'general', 'schedule', 'side-effects', 'booking'];
  const filteredFaqs = useMemo(() => {
    if (!vaccine) return [];
    if (faqFilter === 'all') return vaccine.faqs || [];
    return (vaccine.faqs || []).filter((_, i) => i < 3);
  }, [vaccine, faqFilter]);

  if (!vaccine || !category) {
    return (
      <div className="page-section" style={{ background: '#f8fafc', minHeight: '100vh' }}>
        <div className="container" style={{ textAlign: 'center', padding: '60px 16px' }}>
          <span style={{ fontSize: 52 }}>💉</span>
          <p style={{ color: '#94a3b8', marginTop: 12, fontSize: 14 }}>{t('vaccine.notFound', 'Vaccine not found')}</p>
          <Link to="/vaccination/all-vaccines" style={{ display: 'inline-block', marginTop: 16, padding: '10px 24px', background: C.primary, color: '#fff', textDecoration: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
            {t('vaccine.backToAll', '← View All Vaccines')}
          </Link>
        </div>
      </div>
    );
  }

  const hasPricing = vaccine.price > 0;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="page-section" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 800, paddingBottom: 120, margin: '0 auto' }}>

        <Link to="/vaccination/all-vaccines" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', textDecoration: 'none', fontSize: 12, padding: '16px 0 8px' }}>
          ← {t('vaccine.backToVaccination', 'Back to All Vaccines')}
        </Link>

        <div style={{ marginBottom: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <span style={{ padding: '2px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: theme + '18', color: theme }}>{category.name}</span>
          <span style={{ padding: '2px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: '#F0FDF4', color: '#16a34a' }}>{t('vaccine.homeVisit', 'Home Visit Available')}</span>
          <span style={{ padding: '2px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: '#FFF7ED', color: '#ea580c' }}>{vaccine.doseCount} {t('vaccine.dose', 'Dose')}{vaccine.doseCount > 1 ? 's' : ''}</span>
        </div>

        <div style={{ background: `linear-gradient(135deg, ${theme} 0%, ${theme}dd 100%)`, borderRadius: 16, padding: '24px 20px', color: '#fff', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 36 }}>{category.icon}</span>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: -0.3 }}>{vaccine.name}</h1>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: '2px 0 0' }}>{vaccine.disease} · {category.name}</p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', margin: '8px 0 12px', lineHeight: 1.5 }}>{vaccine.description}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12, fontSize: 11 }}>
            <span>⭐ 4.9 Rating</span>
            <span>👥 50,000+ Vaccinated</span>
            <span>🏠 Home Visit Available</span>
            <span>✅ NABL Certified</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>₹{vaccine.price}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{t('vaccine.perDoseGST', 'per dose + GST')} {vaccine.gst}%</div>
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px' }}>
              <span>👶</span><span style={{ fontSize: 12 }}>{vaccine.ageGroup}</span>
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px' }}>
              <span>💉</span><span style={{ fontSize: 12 }}>{vaccine.doseCount} Dose{vaccine.doseCount > 1 ? 's' : ''}</span>
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px' }}>
              <span>🏠</span><span style={{ fontSize: 12 }}>{vaccine.availability}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            <Link to={`/vaccination/book?vaccine=${vaccine.slug}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: C.accent, border: 'none', fontSize: 13, fontWeight: 700, padding: '10px 24px', borderRadius: 10, color: '#fff', textDecoration: 'none', boxShadow: '0 4px 14px rgba(255,59,48,0.3)' }}>
              📋 {t('vaccine.bookNow', 'Book Now')}
            </Link>
            <a href={`https://wa.me/919700104108?text=${encodeURIComponent('Hi, I want to know more about ' + vaccine.name)}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px', borderRadius: 10, fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none' }}>
              💬 {t('vaccine.whatsapp', 'WhatsApp')}
            </a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 6, marginBottom: 14 }}>
          {[
            { icon: '💰', label: t('vaccine.price', 'Price'), value: '₹' + vaccine.price },
            { icon: '💉', label: t('vaccine.doses', 'Doses'), value: vaccine.doseCount + (vaccine.doseCount > 1 ? ' Doses' : ' Dose') },
            { icon: '👶', label: t('vaccine.ageGroup', 'Age Group'), value: vaccine.ageGroup },
            { icon: '🏠', label: t('vaccine.availability', 'Availability'), value: vaccine.availability, color: '#059669' },
          ].map(item => (
            <div key={item.label} style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, marginBottom: 2 }}>{item.icon}</div>
              <div style={{ fontSize: 9, color: '#94a3b8', marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: item.color || '#0f172a' }}>{item.value}</div>
            </div>
          ))}
        </div>

        <Section icon="💉" title={t('vaccine.whatIs', 'What Is This Vaccine?')} open={openSections.whatIs} onToggle={() => toggle('whatIs')}>
          <p style={{ margin: '0 0 10px' }}>{vaccine.fullDescription}</p>
          <div style={{ padding: '10px 14px', background: '#f0fdf4', borderRadius: 8, fontSize: 12, color: '#166534', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <span style={{ flexShrink: 0, marginTop: 1 }}>✅</span>
            <span>{t('vaccine.whatIsInfo', 'Vaccination is the safest and most effective way to protect against this disease.')}</span>
          </div>
        </Section>

        <Section icon="👤" title={t('vaccine.whoShouldTake', 'Who Should Take This Vaccine?')} open={openSections.whoShould} onToggle={() => toggle('whoShould')}>
          <p style={{ margin: '0 0 8px', fontSize: 12, color: '#94a3b8' }}>{t('vaccine.whoShouldDesc', 'Recommended for:')}</p>
          <ul style={{ margin: '0 0 10px', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <li style={{ fontSize: 13, lineHeight: 1.6 }}>{vaccine.ageRecommendation}</li>
            <li style={{ fontSize: 13, lineHeight: 1.6 }}>{t('vaccine.whoShould2', 'Individuals in high-risk categories')}</li>
            <li style={{ fontSize: 13, lineHeight: 1.6 }}>{t('vaccine.whoShould3', 'Travellers to endemic regions')}</li>
            <li style={{ fontSize: 13, lineHeight: 1.6 }}>{t('vaccine.whoShould4', 'Healthcare workers and caregivers')}</li>
            <li style={{ fontSize: 13, lineHeight: 1.6 }}>{t('vaccine.whoShould5', 'Family members of at-risk individuals')}</li>
          </ul>
          <div style={{ padding: '10px 14px', background: '#f0fdf4', borderRadius: 8, fontSize: 12, color: '#166534', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <span style={{ flexShrink: 0, marginTop: 1 }}>💡</span>
            <span>{t('vaccine.whoShouldInfo', 'Consult your healthcare provider for personalized vaccination recommendations based on your age, health status, and medical history.')}</span>
          </div>
        </Section>

        <Section icon="✅" title={t('vaccine.benefits', 'Key Benefits')} open={openSections.benefits} onToggle={() => toggle('benefits')}>
          <p style={{ margin: '0 0 8px', fontSize: 12, color: '#94a3b8' }}>{t('vaccine.benefitsDesc', 'Why you should get vaccinated:')}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(vaccine.benefits || []).map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 12px', background: '#F0FDF4', borderRadius: 8, border: '1px solid #dcfce7' }}>
                <span style={{ color: '#16a34a', fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 12, color: '#166534' }}>{b}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section icon="📅" title={t('vaccine.schedule', 'Dose Schedule')} open={openSections.schedule} onToggle={() => toggle('schedule')}>
          <p style={{ margin: '0 0 10px', fontSize: 12, color: '#94a3b8' }}>{t('vaccine.scheduleDesc', 'Recommended vaccination schedule:')}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(vaccine.schedule || []).map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: theme, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{d.dose}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{t('vaccine.dose')} {d.dose}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{t('vaccine.route', 'Route')}: {d.route}</div>
                </div>
                <div style={{ fontSize: 12, color: theme, fontWeight: 600, textAlign: 'right', flexShrink: 0 }}>{d.timing}</div>
              </div>
            ))}
          </div>
          {vaccine.doseInterval && (
            <div style={{ padding: '8px 12px', background: '#fff7ed', borderRadius: 8, fontSize: 12, color: '#9a3412', marginTop: 8 }}>
              <strong>{t('vaccine.interval', 'Interval')}:</strong> {vaccine.doseInterval}
            </div>
          )}
        </Section>

        <Section icon="⚠️" title={t('vaccine.sideEffects', 'Possible Side Effects')} open={openSections.sideEffects} onToggle={() => toggle('sideEffects')}>
          <p style={{ margin: '0 0 8px', fontSize: 12, color: '#94a3b8' }}>{t('vaccine.sideEffectsNote', 'Most side effects are mild and resolve within 1-2 days. Serious side effects are extremely rare.')}</p>
          <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {(vaccine.sideEffects || []).map((s, i) => (
              <li key={i} style={{ fontSize: 13, lineHeight: 1.6 }}>{s}</li>
            ))}
          </ul>
        </Section>

        {vaccine.whoShouldAvoid && vaccine.whoShouldAvoid.length > 0 && (
          <Section icon="🚫" title={t('vaccine.whoShouldAvoid', "Who Shouldn't Take This?")} open={openSections.contra} onToggle={() => toggle('contra')}>
            <p style={{ margin: '0 0 8px', fontSize: 12, color: '#94a3b8' }}>{t('vaccine.contraindications', 'This vaccine may not be suitable for:')}</p>
            <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {vaccine.whoShouldAvoid.map((w, i) => (
                <li key={i} style={{ fontSize: 13, lineHeight: 1.6 }}>{w}</li>
              ))}
            </ul>
            <div style={{ padding: '8px 12px', background: '#fef2f2', borderRadius: 8, fontSize: 12, color: '#991b1b', marginTop: 8, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
              <span style={{ flexShrink: 0 }}>⚠️</span>
              <span>{t('vaccine.contraInfo', 'Always consult your doctor before taking any vaccine, especially if you have underlying health conditions.')}</span>
            </div>
          </Section>
        )}

        {relatedVaccines.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 16, marginBottom: 10 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>🔗</span> {t('vaccine.related', 'Related Vaccines')}
            </h3>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 8px' }}>{t('vaccine.relatedDesc', 'Other vaccines in this category:')}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {relatedVaccines.map(rv => (
                <Link key={rv.slug} to={`/vaccination/treatment/${rv.slug}`} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: `${theme}10`, border: `1px solid ${theme}30`, color: theme, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  💉 {rv.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: 10 }}>
          <button onClick={() => toggle('faq')} style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, color: '#0f172a', textAlign: 'left' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 16 }}>❓</span>{t('vaccine.faq', 'Frequently Asked Questions')}</span>
            <span style={{ fontSize: 12, transition: 'transform 0.2s', transform: openSections.faq ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0, color: '#94a3b8' }}>▾</span>
          </button>
          {openSections.faq && <div style={{ padding: '0 16px 16px' }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
              {faqCategories.map(cat => (
                <button key={cat} onClick={() => setFaqFilter(cat)} style={{ padding: '4px 12px', borderRadius: 16, border: '1px solid ' + (faqFilter === cat ? theme : '#ddd'), background: faqFilter === cat ? theme + '18' : '#fff', color: faqFilter === cat ? theme : '#888', fontSize: 11, cursor: 'pointer', fontWeight: faqFilter === cat ? 600 : 400, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                  {cat === 'all' ? t('all') : t('vaccine.faq.' + cat, cat.charAt(0).toUpperCase() + cat.slice(1))}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(vaccine.faqs || []).map((faq, i) => (
                <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                  <button onClick={() => setOpenSections(prev => ({ ...prev, ['faq_' + i]: !prev['faq_' + i] }))} style={{ width: '100%', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, color: '#0f172a', textAlign: 'left' }}>
                    Q: {faq.q}
                    <span style={{ fontSize: 10, transition: 'transform 0.2s', transform: openSections['faq_' + i] ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0, color: '#94a3b8' }}>▾</span>
                  </button>
                  {openSections['faq_' + i] && <div style={{ padding: '0 12px 10px', fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: '#64748b', alignSelf: 'center' }}>{t('vaccine.share', 'Share:')}</span>
          {[
            { icon: '💬', url: 'https://wa.me/?text=' + encodeURIComponent(vaccine.name + ' - Vaccine at ' + (typeof window !== 'undefined' ? window.location.href : '')) },
            { icon: '📘', url: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '') },
            { icon: '🐦', url: 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(vaccine.name + ' vaccine at Jeevan HealthCare') + '&url=' + encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '') },
          ].map(s => (
            <a key={s.icon} href={s.url} target="_blank" rel="noopener noreferrer" style={{ width: 32, height: 32, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: 16 }}>{s.icon}</a>
          ))}
          <button onClick={() => { if (typeof navigator !== 'undefined') navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : ''); }} style={{ width: 32, height: 32, borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>🔗</button>
        </div>

        <div style={{ background: 'linear-gradient(135deg, ' + theme + ', ' + theme + 'dd)', borderRadius: 16, padding: '20px', textAlign: 'center', color: '#fff', marginBottom: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px' }}>{t('vaccine.needHelp', 'Need Help Choosing?')}</h3>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', margin: '0 0 12px' }}>{t('vaccine.needHelpDesc', 'Talk to our vaccination expert for free guidance')}</p>
          <a href="tel:+919700104108" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', background: '#fff', color: theme, borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            📞 +91 9700104108
          </a>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MedicalWebPage',
            name: vaccine.name + ' Vaccine',
            description: vaccine.description,
            url: typeof window !== 'undefined' ? window.location.href : '',
            about: { '@type': 'MedicalSpecialty', name: category.name, relevantSpecialty: 'Immunization' },
            offers: { '@type': 'Offer', price: vaccine.price, priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
          })
        }} />
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999, background: '#fff', boxShadow: '0 -4px 16px rgba(0,0,0,0.08)', padding: '8px 16px 12px', display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid #eee' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vaccine.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: C.accent }}>₹{vaccine.price}</span>
            <span style={{ fontSize: 10, color: '#059669', fontWeight: 600 }}>{t('vaccine.homeVisit', 'Home Visit')}</span>
          </div>
        </div>
        <a href="tel:+919700104108" style={{ width: 40, height: 40, borderRadius: '50%', background: theme, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none', color: '#fff', fontSize: 18 }}>📞</a>
        <Link to={`/vaccination/book?vaccine=${vaccine.slug}`} style={{ background: C.accent, border: 'none', fontSize: 12, fontWeight: 700, padding: '10px 20px', borderRadius: 10, color: '#fff', textDecoration: 'none', boxShadow: '0 4px 14px rgba(255,59,48,0.3)', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center' }}>
          📋 {t('vaccine.bookNow', 'Book Now')}
        </Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .page-section { padding: 0; }
          .container { padding-left: 12px; padding-right: 12px; }
        }
      `}</style>
    </div>
  );
}
