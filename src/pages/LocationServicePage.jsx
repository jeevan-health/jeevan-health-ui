import { useParams, Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { getLocation, getService } from '../data/seoContent';

export default function LocationServicePage() {
  const t = useT();
  const { type, location } = useParams();
  const loc = getLocation(location);
  const svc = getService(type);

  if (!loc || !svc) {
    return (
      <div className="page-section container text-center" style={{ padding: '80px 16px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>{t('not.found', 'Page Not Found')}</h2>
        <Link to="/" style={{ color: '#1866C9', fontWeight: 600 }}>← {t('back.to.home', 'Back to Home')}</Link>
      </div>
    );
  }

  const displayName = loc.name;
  const c = svc.color;

  return (
    <div>
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org', '@type': 'MedicalBusiness',
        name: `Jeevan HealthCare — ${svc.heading(displayName)}`,
        description: svc.description(displayName),
        url: `https://www.jeevanhealthcare.com/service/${type}/in/${location}`,
        telephone: '+919700104108',
        areaServed: displayName,
        address: { '@type': 'PostalAddress', addressLocality: displayName, addressRegion: loc.state || 'Telangana', addressCountry: 'IN' },
      })}</script>

      <div style={{ background: `linear-gradient(135deg, ${c} 0%, ${c}dd 100%)`, padding: '48px 0 40px', textAlign: 'center' }}>
        <div className="container">
          <div style={{ fontSize: 48, marginBottom: 8 }}>{svc.icon}</div>
          <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.15 }}>
            {svc.heading(displayName)}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: '0 auto 20px', maxWidth: 560 }}>
            {svc.description(displayName)}
          </p>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            {['Free Home Collection', 'Trained Professionals', 'Digital Reports', 'NABL Certified'].map(b => (
              <span key={b} style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: 20 }}>✓ {b}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={svc.bookingLink} className="btn btn-lg" style={{ background: '#FF3B30', border: 'none', color: '#fff', height: 48, padding: '0 28px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 10, display: 'inline-flex', alignItems: 'center' }}>
              {t('seo.bookNow', 'Book Now')} →
            </Link>
            <a href="tel:+919700104108" style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)', color: '#fff', height: 48, padding: '0 28px', fontSize: 16, fontWeight: 600, textDecoration: 'none', borderRadius: 10, display: 'inline-flex', alignItems: 'center' }}>
              📞 {t('seo.callNow', 'Call +91-9700104108')}
            </a>
          </div>
        </div>
      </div>

      <div className="page-section container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>
              {t('seo.whyChoose', 'Why Choose Jeevan HealthCare?')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {svc.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-body)' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: `${c}20`, color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>✓</span>
                  {f}
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#f8f9fa', borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, color: c }}>
              {t('seo.serviceIn', 'Service Available in')} {displayName}
            </h3>
            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, marginBottom: 12 }}>
              {t('seo.coverageDesc', 'We serve all areas including')}: {loc.areas?.join(', ') || displayName}.
            </p>
            <div style={{ fontSize: 13, color: '#666', lineHeight: 1.8 }}>
              <div>📍 {t('seo.homeCollection', 'Free home sample collection')}</div>
              <div>📋 {t('seo.digitalReports', 'Digital reports via WhatsApp & email')}</div>
              <div>⏱️ {t('seo.fastResults', 'Same-day collection available')}</div>
              <div>🔬 {t('seo.certified', 'NABL & CAP certified labs')}</div>
            </div>
          </div>
        </div>

        <div style={{ background: `linear-gradient(135deg, ${c}08, ${c}04)`, borderRadius: 12, padding: 24, marginBottom: 32, textAlign: 'center' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: c }}>
            {t('seo.readyToBook', 'Ready to Book?')}
          </h3>
          <p style={{ fontSize: 13, color: '#666', marginBottom: 16, maxWidth: 480, margin: '0 auto 16px' }}>
            {t('seo.readyDesc', 'Book online or call us. Our team will confirm your appointment within 30 minutes.')}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={svc.bookingLink} className="btn btn-primary btn-lg" style={{ background: c, border: 'none', fontSize: 14, padding: '12px 28px', textDecoration: 'none' }}>
              {t('seo.bookOnline', 'Book Online')} →
            </Link>
            <a href={`https://wa.me/919700104108?text=${encodeURIComponent(`Hi Jeevan Health! I am looking for ${svc.label.toLowerCase()} in ${displayName}. Please help.`)}`} target="_blank" rel="noopener noreferrer" className="btn btn-lg" style={{ background: '#25d366', border: 'none', color: '#fff', fontSize: 14, padding: '12px 28px', textDecoration: 'none' }}>
              💬 {t('seo.whatsapp', 'WhatsApp Us')}
            </a>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
            {t('seo.otherLocations', 'Other Locations We Serve')}
          </h3>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['hyderabad', 'gachibowli', 'hitech-city', 'madhapur', 'kondapur', 'kukatpally', 'miyapur', 'jubilee-hills'].filter(s => s !== location).map(s => {
              const l = getLocation(s);
              if (!l) return null;
              return (
                <Link key={s} to={`/service/${type}/in/${s}`} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 20, background: '#f0f7ff', color: c, textDecoration: 'none', fontWeight: 500 }}>
                  {svc.label} — {l.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
