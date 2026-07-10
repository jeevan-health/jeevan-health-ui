import { useParams, Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { getTestInfo } from '../data/seoContent';

export default function TestInfoPage() {
  const t = useT();
  const { slug } = useParams();
  const test = getTestInfo(slug);

  if (!test) {
    return (
      <div className="page-section container text-center" style={{ padding: '80px 16px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>{t('not.found', 'Page Not Found')}</h2>
        <Link to="/diagnostics" style={{ color: '#1866C9', fontWeight: 600 }}>← {t('back.to.tests', 'Back to Tests')}</Link>
      </div>
    );
  }

  return (
    <div>
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org', '@type': 'MedicalTest',
        name: test.name, description: test.description,
        howPerformed: 'Blood sample collected at home by trained phlebotomist',
        preparation: test.fasting,
      })}</script>

      <div style={{ background: 'linear-gradient(135deg, #1866C9, #0F4A96)', padding: '48px 0 40px', textAlign: 'center' }}>
        <div className="container">
          <div style={{ fontSize: 48, marginBottom: 8 }}>🔬</div>
          <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.15 }}>
            {test.name}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: '0 auto 12px', maxWidth: 560 }}>
            {test.description}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', background: 'rgba(255,255,255,0.15)', padding: '4px 14px', borderRadius: 20 }}>💰 {test.price}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', background: 'rgba(255,255,255,0.15)', padding: '4px 14px', borderRadius: 20 }}>⏱️ Reports in {test.reportTime}</span>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/diagnostics" className="btn btn-lg" style={{ background: '#FF3B30', border: 'none', color: '#fff', height: 48, padding: '0 28px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 10, display: 'inline-flex', alignItems: 'center' }}>
              {t('testInfo.bookTest', 'Book This Test')} →
            </Link>
            <a href="tel:+919700104108" style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)', color: '#fff', height: 48, padding: '0 28px', fontSize: 16, fontWeight: 600, textDecoration: 'none', borderRadius: 10, display: 'inline-flex', alignItems: 'center' }}>
              📞 {t('testInfo.callNow', 'Call +91-9700104108')}
            </a>
          </div>
        </div>
      </div>

      <div className="page-section container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>
              {t('testInfo.whatItMeasures', 'What This Test Measures')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {test.whatItMeasures.map(m => (
                <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-body)', padding: 8, background: '#f8f9fa', borderRadius: 8 }}>
                  <span style={{ color: '#1866C9', fontSize: 14 }}>📊</span> {m}
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#f0f7ff', borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#1866C9' }}>
              {t('testInfo.testDetails', 'Test Details')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid #dce8f5' }}>
                <span style={{ color: '#666' }}>{t('testInfo.price', 'Price')}</span>
                <span style={{ fontWeight: 700, color: '#1a1a1a' }}>{test.price}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid #dce8f5' }}>
                <span style={{ color: '#666' }}>{t('testInfo.fasting', 'Fasting Required')}</span>
                <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{test.fasting}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid #dce8f5' }}>
                <span style={{ color: '#666' }}>{t('testInfo.reportTime', 'Report Time')}</span>
                <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{test.reportTime}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0' }}>
                <span style={{ color: '#666' }}>{t('testInfo.collection', 'Collection')}</span>
                <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{t('testInfo.homeCollection', 'Free Home')}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: '#f8f9fa', borderRadius: 12, padding: 24, marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#1866C9' }}>
            {t('testInfo.howItWorks', 'How It Works')}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 16 }}>
            {[
              { step: '1', title: t('testInfo.step1', 'Book Online'), desc: t('testInfo.step1Desc', 'Select test & schedule pickup') },
              { step: '2', title: t('testInfo.step2', 'Free Collection'), desc: t('testInfo.step2Desc', 'Phlebotomist visits your home') },
              { step: '3', title: t('testInfo.step3', 'Lab Processing'), desc: t('testInfo.step3Desc', 'Sample tested at NABL lab') },
              { step: '4', title: t('testInfo.step4', 'Digital Report'), desc: t('testInfo.step4Desc', 'Report on WhatsApp & email') },
            ].map(s => (
              <div key={s.step} style={{ textAlign: 'center', padding: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1866C9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, margin: '0 auto 8px' }}>{s.step}</div>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 11, color: '#666' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1866C9, #0F4A96)', borderRadius: 12, padding: 24, textAlign: 'center' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#fff' }}>
            {t('testInfo.readyToBook', 'Ready to Book')} {test.name}?
          </h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 16, maxWidth: 480, margin: '0 auto 16px' }}>
            {t('testInfo.readyDesc', 'Free home sample collection. Accurate reports in 24 hours.')}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/diagnostics" className="btn btn-lg" style={{ background: '#FF3B30', border: 'none', color: '#fff', fontSize: 14, padding: '12px 28px', textDecoration: 'none' }}>
              {t('testInfo.bookNow', 'Book Now at')} {test.price} →
            </Link>
            <a href={`https://wa.me/919700104108?text=${encodeURIComponent(`Hi Jeevan Health! I want to book ${test.name} at home.`)}`} target="_blank" rel="noopener noreferrer" style={{ background: '#25d366', border: 'none', color: '#fff', fontSize: 14, padding: '12px 28px', textDecoration: 'none', borderRadius: 10, display: 'inline-flex', alignItems: 'center' }}>
              💬 {t('testInfo.whatsapp', 'Book via WhatsApp')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
