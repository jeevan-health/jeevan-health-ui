import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useCartStore from '../stores/cartStore';
import useUploadModal from '../stores/uploadModalStore';
import { getPackageBySlug, packageList } from '../data/healthPackages';
import { seedTests, subscribe, ensureLoaded } from '../data/seedData';
import { makeSlug } from '../data/seedData';
import { useT } from '../i18n/LanguageProvider';

function Section({ icon, title, children, open, onToggle }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', overflow: 'hidden', marginBottom: 10, scrollMarginTop: 80 }}>
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

function ListItems({ items }) {
  return (
    <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 12, lineHeight: 1.5 }}>{item}</li>
      ))}
    </ul>
  );
}

function Tag({ label, color, bg }) {
  return <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: bg || '#e8f0fe', color: color || '#1866C9', display: 'inline-block' }}>{label}</span>;
}

export default function PackageDetail() {
  const t = useT();
  const [, forceUpdate] = useState(0);
  useEffect(() => { ensureLoaded(); const unsub = subscribe(() => forceUpdate(n => n + 1)); return unsub; }, []);
  const { slug } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const cartItems = useCartStore(s => s.items);
  const addItem = useCartStore(s => s.addItem);
  const removeItem = useCartStore(s => s.removeItem);

  useEffect(() => {
    const found = getPackageBySlug(slug);
    if (found) {
      setPkg(found);
      document.title = `${found.name} | ${t('packageDetail.siteName', 'Jeevan HealthCare at Home')}`;
    }
  }, [slug]);

  if (!pkg) {
    return (
      <div className="page-section" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
        <div className="container" style={{ textAlign: 'center', padding: '40px 16px' }}>
          <span style={{ fontSize: 48 }}>📦</span>
          <p style={{ color: '#999', marginTop: 12 }}>{t('packageDetail.notFound', 'Package not found')}</p>
          <button onClick={() => navigate('/health-packages')} className="btn btn-primary" style={{ marginTop: 16 }}>{t('packageDetail.viewAllPackages', 'View All Packages')}</button>
        </div>
      </div>
    );
  }

  const inCart = cartItems.some(i => i.id === pkg.id);
  const toggle = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  const otherPkgs = packageList.filter(p => p.id !== pkg.id).slice(0, 4);

  const matchedTests = pkg.testsIncluded.filter(n => {
    const t = seedTests.find(s => s.name === n);
    return t;
  });
  const totalValue = matchedTests.reduce((sum, t) => sum + (t.mrp || t.price || 0), 0);

  return (
    <div className="page-section" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 800, paddingBottom: 120, margin: '0 auto' }}>

        <button onClick={() => navigate('/health-packages')} style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, padding: '12px 0' }}>
          {t('packageDetail.backToPackages', '← Back to Packages')}
        </button>

        {/* HERO */}
        <div style={{ background: `linear-gradient(135deg, ${pkg.color} 0%, ${pkg.color}dd 100%)`, borderRadius: 16, padding: '24px 20px', color: '#fff', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 32 }}>{pkg.icon}</span>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: -0.3 }}>{pkg.name}</h1>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: '2px 0 0' }}>{pkg.target}</p>
            </div>
          </div>

          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', margin: '8px 0 12px', lineHeight: 1.5 }}>{pkg.description}</p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 12, fontSize: 11 }}>
            <span>⭐ {pkg.rating} {t('packageDetail.ratingLabel', 'Rating')}</span>
            <span>👥 {pkg.bookings} {t('packageDetail.bookings', 'Bookings')}</span>
            <span>🧪 {pkg.testCount} {t('packageDetail.tests', 'Tests')}</span>
            <span>🏠 {t('packageDetail.freeHomeCollection', 'Free Home Collection')}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textDecoration: 'line-through' }}>{t('packageDetail.mrp', 'MRP')}: ₹{pkg.mrp.toLocaleString()}</div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>₹{pkg.offerPrice.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: '#4ade80', fontWeight: 600 }}>{t('packageDetail.save', 'Save')} ₹{(pkg.mrp - pkg.offerPrice).toLocaleString()} ({pkg.discount}% {t('packageDetail.off', 'OFF')})</div>
            </div>
            {totalValue > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{t('packageDetail.totalTestValue', 'Total Test Value')}</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>₹{totalValue.toLocaleString()}</div>
              </div>
            )}
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{t('packageDetail.reports', 'Reports')}</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>⏱ {pkg.reportTime}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            <button onClick={() => {
              if (inCart) removeItem(pkg.id, 'package');
              else addItem({ id: pkg.id, name: pkg.name, price: pkg.mrp, offerPrice: pkg.offerPrice, type: 'package' });
            }} className="btn btn-primary" style={{ background: '#FF3B30', border: 'none', fontSize: 13, fontWeight: 700, padding: '10px 24px', boxShadow: '0 4px 14px rgba(255,59,48,0.3)' }}>
              {inCart ? t('packageDetail.inCart', '✓ In Cart') : t('packageDetail.bookNow', '📋 Book Now')}
            </button>
            <button onClick={() => useUploadModal.getState().setOpen(true)} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', fontFamily: 'inherit' }}>
              {t('packageDetail.uploadPrescription', '📤 Upload Prescription')}
            </button>
          </div>
        </div>

        {/* WHO SHOULD TAKE */}
        <Section icon="👤" title={t('packageDetail.whoShouldTake', 'Who Should Take This Package?')} open={openSections.who} onToggle={() => toggle('who')}>
          <ListItems items={pkg.whoShouldTake} />
          <Tag label={`${t('packageDetail.for', 'For')}: ${pkg.target}`} color={pkg.color} bg={`${pkg.color}15`} />
        </Section>

        {/* WHY THIS PACKAGE */}
        <Section icon="❓" title={t('packageDetail.whyThisPackage', 'Why This Package?')} open={openSections.why} onToggle={() => toggle('why')}>
          <p style={{ margin: '0 0 8px', fontWeight: 600 }}>{t('packageDetail.benefits', 'Benefits of this package:')}</p>
          <ListItems items={pkg.benefits} />
          {totalValue > 0 && (
            <div style={{ marginTop: 8, padding: '8px 12px', background: '#e8f5e9', borderRadius: 8, fontSize: 11, color: '#2e7d32', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>💰 {t('packageDetail.individualTestValue', 'Individual test value')}: ₹{totalValue.toLocaleString()} — {t('packageDetail.youSave', 'You save')} ₹{(totalValue - pkg.offerPrice).toLocaleString()} {t('packageDetail.withThisPackage', 'with this package!')}</span>
            </div>
          )}
        </Section>

        {/* CONDITIONS COVERED */}
        {pkg.conditions && pkg.conditions.length > 0 && (
          <Section icon="🏥" title={t('packageDetail.conditionsCovered', 'Conditions Covered')} open={openSections.conditions} onToggle={() => toggle('conditions')}>
            <p style={{ margin: '0 0 8px', fontSize: 11, color: '#999' }}>{t('packageDetail.conditionsDesc', 'This package helps screen for and monitor:')}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {pkg.conditions.map((c, i) => (
                <span key={i} style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11, background: '#fef2f2', color: '#dc2626', fontWeight: 500 }}>{c}</span>
              ))}
            </div>
          </Section>
        )}

        {/* TESTS INCLUDED */}
        <Section icon="🧪" title={t('packageDetail.testsIncluded', 'Tests Included') + ` (${pkg.testsIncluded.length})`} open={openSections.tests} onToggle={() => toggle('tests')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {pkg.testsIncluded.map((t, i) => {
              const testData = seedTests.find(s => s.name === t);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ color: '#2e7d32', fontSize: 11 }}>✓</span>
                  <span style={{ fontSize: 12, flex: 1 }}>{t}</span>
                  {testData && (
                    <span style={{ fontSize: 11, color: '#888', whiteSpace: 'nowrap' }}>₹{testData.mrp || testData.price}</span>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 8, padding: '8px 12px', background: '#f0fdf4', borderRadius: 8, fontSize: 11, color: '#166534', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>✅ {t('packageDetail.freeSampleCollection', 'All tests include free home sample collection')}</span>
          </div>
        </Section>

        {/* TEST PREPARATION */}
        <Section icon="📋" title={t('packageDetail.testPreparation', 'Test Preparation')} open={openSections.prep} onToggle={() => toggle('prep')}>
          <p style={{ margin: '0 0 8px' }}>{pkg.preparation}</p>
          <InfoBox bg="#fff3e0" color="#e65100" icon="⚠️">{t('packageDetail.prepInstruction', 'Follow preparation instructions carefully for accurate results.')}</InfoBox>
        </Section>

        {/* SAMPLE COLLECTION */}
        <Section icon="📦" title={t('packageDetail.sampleCollectionReports', 'Sample Collection & Reports')} open={openSections.sample} onToggle={() => toggle('sample')}>
          <p style={{ margin: '0 0 8px', fontWeight: 600 }}>{t('packageDetail.howItWorks', 'How it works:')}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { step: t('packageDetail.stepBookOnline', 'Book Online'), icon: '📱', desc: t('packageDetail.descBookOnline', 'Book in 2 minutes — select your date and time') },
              { step: t('packageDetail.stepHomeVisit', 'Home Visit'), icon: '🏠', desc: t('packageDetail.descHomeVisit', 'Trained phlebotomist arrives at your doorstep') },
              { step: t('packageDetail.stepSampleCollection', 'Sample Collection'), icon: '💉', desc: t('packageDetail.descSampleCollection', 'Blood and urine samples collected in 15-20 minutes') },
              { step: t('packageDetail.stepLabProcessing', 'Lab Processing'), icon: '🔬', desc: t('packageDetail.descLabProcessing', 'Samples processed at NABL certified lab') },
              { step: t('packageDetail.stepQualityCheck', 'Quality Check'), icon: '✅', desc: t('packageDetail.descQualityCheck', 'Results verified by lab professionals') },
              { step: t('packageDetail.stepDigitalReport', 'Digital Report'), icon: '📱', desc: `${t('packageDetail.descDigitalReport', 'Reports in')} ${pkg.reportTime} ${t('packageDetail.viaChannels', 'via WhatsApp/Email/App')}` },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: i < 5 ? '1px dashed #eee' : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${pkg.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>{s.step}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* FAQ */}
        {pkg.faqs && pkg.faqs.length > 0 && (
          <Section icon="❓" title={t('packageDetail.faq', 'Frequently Asked Questions')} open={openSections.faq} onToggle={() => toggle('faq')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {pkg.faqs.map((faq, i) => (
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

        {/* OTHER PACKAGES */}
        {otherPkgs.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', padding: 16, marginBottom: 10 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>📦</span> {t('packageDetail.otherPackages', 'Other Health Packages')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {otherPkgs.map(p => (
                <Link key={p.id} to={`/package/${p.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, border: '1px solid #eee', textDecoration: 'none', transition: 'all 0.2s' }}>
                  <span style={{ fontSize: 24 }}>{p.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>{p.name}</div>
                    <div style={{ fontSize: 10, color: '#888' }}>{p.testCount} {t('packageDetail.testsUnit', 'tests')} · ₹{p.offerPrice.toLocaleString()}</div>
                  </div>
                  <span style={{ fontSize: 11, color: pkg.color, fontWeight: 600 }}>{t('packageDetail.view', 'View →')}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* SHARE */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', padding: 14, marginBottom: 10 }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, margin: '0 0 8px', color: '#888' }}>{t('packageDetail.share', '📤 Share this package')}</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { icon: '💬', url: `https://wa.me/?text=${encodeURIComponent(pkg.name + ' - ₹' + pkg.offerPrice + ' | ' + window.location.href)}`, bg: '#25d366' },
              { icon: 'f', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, bg: '#1877f2' },
              { icon: '𝕏', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(pkg.name + ' - ₹' + pkg.offerPrice)}&url=${encodeURIComponent(window.location.href)}`, bg: '#000' },
            ].map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener" style={{ width: 36, height: 36, borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, textDecoration: 'none', color: '#fff' }}>{s.icon}</a>
            ))}
            <button onClick={() => navigator.clipboard?.writeText(window.location.href)} style={{ width: 36, height: 36, borderRadius: '50%', background: '#f0f0f0', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontFamily: 'inherit' }}>🔗</button>
          </div>
        </div>
      </div>

      {/* STICKY BAR */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999, background: '#fff', boxShadow: '0 -4px 16px rgba(0,0,0,0.08)', padding: '8px 16px 12px', display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid #eee' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pkg.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#e53935' }}>₹{pkg.offerPrice.toLocaleString()}</span>
            <span style={{ fontSize: 11, color: '#999', textDecoration: 'line-through' }}>₹{pkg.mrp.toLocaleString()}</span>
            <span style={{ fontSize: 10, color: '#2e7d32', fontWeight: 600 }}>{pkg.discount}% {t('packageDetail.off', 'OFF')}</span>
          </div>
        </div>
        <a href="tel:+919700104108" style={{ width: 40, height: 40, borderRadius: '50%', background: '#1866C9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none', color: '#fff', fontSize: 18 }}>📞</a>
        <button onClick={() => {
          if (inCart) removeItem(pkg.id, 'package');
          else addItem({ id: pkg.id, name: pkg.name, price: pkg.mrp, offerPrice: pkg.offerPrice, type: 'package' });
        }} className="btn btn-primary" style={{ background: '#FF3B30', border: 'none', fontSize: 12, fontWeight: 700, padding: '10px 20px', boxShadow: '0 4px 14px rgba(255,59,48,0.3)', whiteSpace: 'nowrap' }}>
          {inCart ? t('packageDetail.inCart', '✓ In Cart') : t('packageDetail.bookNow', '📋 Book Now')}
        </button>
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

function InfoBox({ children, bg, color, icon }) {
  return (
    <div style={{ marginTop: 8, padding: '8px 12px', background: bg || '#e8f0fe', borderRadius: 8, fontSize: 11, color: color || '#555', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
      {icon && <span style={{ flexShrink: 0, marginTop: 1 }}>{icon}</span>}
      <span>{children}</span>
    </div>
  );
}
