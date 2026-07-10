import { useParams, Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { nursingServices, nurseLevels, nurses, nursingFAQs } from '../data/nursingData';

const C = { primary: '#7C3AED', accent: '#EC4899', bg: '#F5F3FF' };

const SEO_KEYWORDS = [
  { slug: 'nurse-at-home-hyderabad', keyword: 'nurse at home in Hyderabad', title: 'Qualified Nurse at Home in Hyderabad — Jeevan HealthCare', h1: 'Nurse at Home in Hyderabad', desc: 'Book qualified nurses for home care in Hyderabad. Wound care, injections, elderly care, ICU at home. Same-day service available.' },
  { slug: 'icu-nurse-at-home-hyderabad', keyword: 'ICU nurse at home Hyderabad', title: 'ICU Nurse at Home in Hyderabad — Critical Care at Home', h1: 'ICU Nurse at Home in Hyderabad', desc: 'Critical care nursing at home in Hyderabad. Ventilator care, tracheostomy, central line management by trained ICU nurses.' },
  { slug: 'post-surgery-care-hyderabad', keyword: 'post surgery care at home Hyderabad', title: 'Post-Surgery Care at Home Hyderabad — Jeevan HealthCare', h1: 'Post-Surgery Care at Home in Hyderabad', desc: 'Professional post-surgery nursing care at home in Hyderabad. Wound monitoring, medication, catheter care, recovery support.' },
  { slug: 'elderly-care-nurse-hyderabad', keyword: 'elderly care nurse at home Hyderabad', title: 'Elderly Care Nurse at Home Hyderabad', h1: 'Elderly Care Nurse at Home in Hyderabad', desc: 'Compassionate elderly care nursing at home in Hyderabad. Daily monitoring, medication reminders, fall prevention, family updates.' },
  { slug: '24-hour-nurse-at-home', keyword: '24 hour nurse at home Hyderabad', title: '24-Hour Nurse at Home Hyderabad — Round-the-Clock Care', h1: '24-Hour Nurse at Home in Hyderabad', desc: 'Round-the-clock nursing care at home in Hyderabad. Two nurses in alternating shifts. ICU-level monitoring available.' },
  { slug: 'female-nurse-at-home-hyderabad', keyword: 'female nurse at home Hyderabad', title: 'Female Nurse at Home Hyderabad — Jeevan HealthCare', h1: 'Female Nurse at Home in Hyderabad', desc: 'Professional female nurses for home care in Hyderabad. Trained GNM/B.Sc nurses for all medical needs at home.' },
  { slug: 'male-nurse-at-home-hyderabad', keyword: 'male nurse at home Hyderabad', title: 'Male Nurse at Home Hyderabad — Jeevan HealthCare', h1: 'Male Nurse at Home in Hyderabad', desc: 'Experienced male nurses for home care in Hyderabad. Bedside nursing, ICU care, patient handling, and mobility support.' },
  { slug: 'injection-at-home-hyderabad', keyword: 'injection at home Hyderabad', title: 'Injection at Home Hyderabad — Nurse Visit for Injections', h1: 'Injection at Home in Hyderabad', desc: 'Book a nurse for injections at home in Hyderabad. IV fluids, IM/IV injections, vitamin infusions. Trained nurses with sterile equipment.' },
];

const SEO_SERVICES = [
  { slug: 'nurse-at-home-hyderabad', services: ['wound-care', 'injections', 'elderly-care', 'post-surgery', 'bedside', 'icu-home'] },
  { slug: 'icu-nurse-at-home-hyderabad', services: ['icu-home', 'bedside'] },
  { slug: 'post-surgery-care-hyderabad', services: ['post-surgery', 'wound-care'] },
  { slug: 'elderly-care-nurse-hyderabad', services: ['elderly-care', 'palliative'] },
  { slug: '24-hour-nurse-at-home', services: ['bedside', 'icu-home'] },
  { slug: 'female-nurse-at-home-hyderabad', services: ['mother-baby', 'injections', 'elderly-care'] },
  { slug: 'male-nurse-at-home-hyderabad', services: ['bedside', 'icu-home', 'post-surgery'] },
  { slug: 'injection-at-home-hyderabad', services: ['injections'] },
];

export default function NurseSeoLanding() {
  const t = useT();
  const { slug } = useParams();
  const page = SEO_KEYWORDS.find(k => k.slug === slug);
  const seoServices = SEO_SERVICES.find(s => s.slug === slug);

  if (!page) {
    return (
      <div className="page-section container text-center" style={{ padding: '80px 16px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>{t('not.found', 'Page Not Found')}</h2>
        <Link to="/nurse-at-home" style={{ color: C.primary, fontWeight: 600 }}>← {t('back.to.nursing', 'Back to Nurse at Home')}</Link>
      </div>
    );
  }

  const filteredServices = nursingServices.filter(s => seoServices?.services.includes(s.category));
  const featuredNurses = nurses.filter(n => n.verified);

  return (
    <div>
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org', '@type': 'MedicalBusiness',
        name: 'Jeevan HealthCare - ' + page.h1, description: page.desc,
        url: 'https://www.jeevanhealthcare.com/nurse-at-home/seo/' + slug,
        telephone: '+919700104108', areaServed: 'Hyderabad',
        address: { '@type': 'PostalAddress', addressLocality: 'Hyderabad', addressRegion: 'Telangana', addressCountry: 'IN' },
      })}</script>

      <div style={{ background: `linear-gradient(135deg, ${C.primary} 0%, #A855F7 50%, ${C.accent} 100%)`, padding: '52px 0 48px', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.15 }}>{t('nurse.seo.' + slug + '.h1', page.h1)}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: '0 auto 16px', maxWidth: 560 }}>{t('nurse.seo.' + slug + '.desc', page.desc)}</p>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            {['Verified Nurses', 'Trained Professionals', '24/7 Support', 'Hyderabad Coverage'].map(b => (
              <span key={b} style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: 20 }}>
                ✓ {b}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/nurse-at-home/book" className="btn btn-lg" style={{ background: C.accent, border: 'none', color: '#fff', height: 48, padding: '0 28px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 10 }}>
              {t('nurse.bookNow', 'Book Now')} →
            </Link>
            <a href="tel:+919700104108" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)', color: '#fff', height: 48, padding: '0 28px', fontSize: 16, fontWeight: 600, textDecoration: 'none', borderRadius: 10 }}>
              📞 {t('nurse.callNow', 'Call +91-9700104108')}
            </a>
          </div>
        </div>
      </div>

      <div className="page-section container">
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>{t('nurse.seo.services', 'Services Available')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
          {filteredServices.map(s => (
            <div key={s.id} style={{ padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#0f172a' }}>{s.name}</h3>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.primary }}>₹{s.price}</div>
              </div>
              <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 8px' }}>{s.description}</p>
              <Link to={`/nurse-at-home/book?service=${s.slug}`} style={{ fontSize: 12, color: C.primary, fontWeight: 600, textDecoration: 'none' }}>
                {t('nurse.bookNow', 'Book Now')} →
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="page-section" style={{ background: C.bg }}>
        <div className="container">
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, textAlign: 'center' }}>{t('nurse.why.choose', 'Why Choose Jeevan Nurse at Home?')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {[
              { icon: '👩‍⚕️', title: 'Qualified Nurses', desc: 'GNM/B.Sc/M.Sc trained professionals' },
              { icon: '✅', title: 'Police Verified', desc: 'All nurses undergo background verification' },
              { icon: '🩺', title: 'Doctor Coordinated', desc: 'Care plans reviewed by medical team' },
              { icon: '📱', title: 'Digital Reports', desc: 'Daily care reports shared with family' },
              { icon: '🚑', title: 'Emergency Support', desc: '24/7 escalation and ambulance support' },
              { icon: '🏠', title: 'Complete Coverage', desc: 'All areas of Hyderabad & suburbs' },
            ].map(item => (
              <div key={item.title} style={{ textAlign: 'center', padding: 18, borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 32, marginBottom: 6 }}>{item.icon}</div>
                <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 2px', color: '#0f172a' }}>{item.title}</h3>
                <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {featuredNurses.length > 0 && (
        <div className="page-section container">
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>{t('nurse.our.nurses', 'Our Qualified Nurses')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {featuredNurses.map(n => {
              const lvl = nurseLevels.find(l => l.id === n.level);
              return (
                <div key={n.id} style={{ padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 32 }}>{n.image}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{n.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{n.qualifications} · {n.experience} yrs{lvl && <span style={{ marginLeft: 4, padding: '1px 6px', borderRadius: 4, background: lvl.color + '20', color: lvl.color, fontSize: 9 }}>{lvl.name}</span>}</div>
                    <div style={{ fontSize: 11, color: '#d97706' }}>★ {n.rating} ({n.sessions}+ sessions)</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="page-section" style={{ background: C.bg }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, textAlign: 'center' }}>{t('faq.heading', 'Frequently Asked Questions')}</h2>
          <div style={{ display: 'grid', gap: 8 }}>
            {nursingFAQs.slice(0, 5).map(f => (
              <div key={f.q} style={{ padding: '12px 16px', borderRadius: 8, background: '#fff', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 4px', color: '#0f172a' }}>{f.q}</p>
                <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.5 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, padding: '40px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{t('nurse.cta.title', 'Book ' + page.keyword + ' Today')}</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 16 }}>{t('nurse.cta.subtitle', 'Same-day service available across Hyderabad')}</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/nurse-at-home/book" style={{ padding: '14px 32px', background: C.accent, color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>{t('nurse.bookNow', 'Book Now')} →</Link>
            <a href={"https://wa.me/919700104108?text=Hi%2C%20I%20want%20to%20know%20more%20about%20" + encodeURIComponent(page.keyword)} target="_blank" rel="noopener noreferrer" style={{ padding: '14px 32px', background: '#25d366', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>💬 {t('nurse.whatsapp', 'WhatsApp Us')}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
