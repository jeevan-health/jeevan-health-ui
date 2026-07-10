import { useParams, Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { getDisease } from '../data/seoContent';

export default function DiseaseCarePage() {
  const t = useT();
  const { slug } = useParams();
  const disease = getDisease(slug);

  if (!disease) {
    return (
      <div className="page-section container text-center" style={{ padding: '80px 16px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>{t('not.found', 'Page Not Found')}</h2>
        <Link to="/" style={{ color: '#1866C9', fontWeight: 600 }}>← {t('back.to.home', 'Back to Home')}</Link>
      </div>
    );
  }

  const c = disease.color;

  return (
    <div>
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org', '@type': 'MedicalCondition',
        name: disease.name, description: disease.description,
        associatedAnatomy: disease.tests?.join(', '),
        possibleTreatment: disease.care?.join(', '),
      })}</script>

      <div style={{ background: `linear-gradient(135deg, ${c} 0%, ${c}dd 100%)`, padding: '48px 0 40px', textAlign: 'center' }}>
        <div className="container">
          <div style={{ fontSize: 48, marginBottom: 8 }}>{disease.icon}</div>
          <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.15 }}>
            {disease.name} — {t('disease.careAtHome', 'Care at Home')}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: '0 auto 20px', maxWidth: 560 }}>
            {disease.description}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/diagnostics" className="btn btn-lg" style={{ background: '#FF3B30', border: 'none', color: '#fff', height: 48, padding: '0 28px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 10, display: 'inline-flex', alignItems: 'center' }}>
              {t('disease.bookTest', 'Book Test')} →
            </Link>
            <a href={`https://wa.me/919700104108?text=${encodeURIComponent(`Hi Jeevan Health! I need help managing ${disease.name} at home.`)}`} target="_blank" rel="noopener noreferrer" style={{ background: '#25d366', border: 'none', color: '#fff', height: 48, padding: '0 28px', fontSize: 16, fontWeight: 600, textDecoration: 'none', borderRadius: 10, display: 'inline-flex', alignItems: 'center' }}>
              💬 {t('disease.consult', 'Consult Now')}
            </a>
          </div>
        </div>
      </div>

      <div className="page-section container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12, color: c }}>
              {t('disease.symptoms', 'Common Symptoms')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {disease.symptoms.map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-body)' }}>
                  <span style={{ color: c, fontSize: 14 }}>⚠️</span> {s}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12, color: c }}>
              {t('disease.tests', 'Recommended Tests')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {disease.tests.map(test => (
                <div key={test} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-body)' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: `${c}20`, color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>🔬</span>
                  <Link to={`/test/${test.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`} style={{ color: c, textDecoration: 'underline' }}>
                    {test}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: `${c}08`, borderRadius: 12, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12, color: c }}>
            {t('disease.management', 'Management & Care at Home')}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {disease.care.map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-body)', padding: 10, background: '#fff', borderRadius: 8 }}>
                <span style={{ fontSize: 16 }}>✅</span> {item}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: `linear-gradient(135deg, ${c}12, ${c}08)`, borderRadius: 12, padding: 24, textAlign: 'center' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: c }}>
            {t('disease.needHelp', 'Need Help Managing')} {disease.name}?
          </h3>
          <p style={{ fontSize: 13, color: '#666', marginBottom: 16, maxWidth: 480, margin: '0 auto 16px' }}>
            {t('disease.needHelpDesc', 'Book lab tests from home. Our team will help you monitor and manage your condition.')}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/diagnostics" className="btn btn-primary btn-lg" style={{ background: c, border: 'none', fontSize: 14, padding: '12px 28px', textDecoration: 'none' }}>
              {t('disease.bookNow', 'Book Lab Tests')} →
            </Link>
            <a href="tel:+919700104108" className="btn btn-lg" style={{ background: '#fff', border: `2px solid ${c}`, color: c, fontSize: 14, padding: '12px 28px', textDecoration: 'none' }}>
              📞 {t('disease.callNow', 'Call Now')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
