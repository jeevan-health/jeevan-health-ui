import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { equipmentItems } from '../data/nursingData';

const C = { primary: '#0D9488', accent: '#14B8A6', bg: '#F0FDFA' };

const categoryLabels = { respiratory: 'Respiratory', mobility: 'Mobility & Comfort', monitoring: 'Monitoring' };
const equipmentSpecs = {
  'Oxygen Concentrator': { brand: 'Philips/Drive', weight: '14 kg', warranty: '1 Year', delivery: 'Free Setup', minRent: '3 days' },
  'Hospital Bed': { brand: 'Merryfair', weight: '85 kg', warranty: '2 Years', delivery: 'Free Installation', minRent: '7 days' },
  'Wheelchair': { brand: 'Karma/Sunrise', weight: '12 kg', warranty: '1 Year', delivery: 'Free Delivery', minRent: '3 days' },
  'Suction Machine': { brand: 'RECMED', weight: '4 kg', warranty: '1 Year', delivery: 'Free Setup', minRent: '3 days' },
  'Multipara Monitor': { brand: 'BPL/Philips', weight: '3 kg', warranty: '1 Year', delivery: 'Free Setup', minRent: '7 days' },
  'Nebulizer': { brand: 'Omron', weight: '1.5 kg', warranty: '1 Year', delivery: 'Free Delivery', minRent: '1 day' },
  'Patient Lift': { brand: 'Invacare', weight: '35 kg', warranty: '2 Years', delivery: 'Free Installation', minRent: '7 days' },
  'Commode Chair': { brand: 'Karma', weight: '8 kg', warranty: '1 Year', delivery: 'Free Delivery', minRent: '3 days' },
};
const equipmentFAQs = {
  'Oxygen Concentrator': [
    { q: 'How long can I use the concentrator daily?', a: 'Most concentrators are designed for 24/7 continuous use. We recommend periodic maintenance every 500 hours.' },
    { q: 'Do you provide refills for oxygen?', a: 'No refills needed — oxygen concentrators extract oxygen from room air, so there is no cylinder to refill.' },
    { q: 'Can I use it while sleeping?', a: 'Yes, most models are sleep-safe and operate quietly (< 45 dB). A pulse oximeter is recommended for monitoring.' },
  ],
  'Hospital Bed': [
    { q: 'Is assembly included?', a: 'Yes, our team delivers and sets up the bed at your home. We also provide a demonstration of all functions.' },
    { q: 'Can the bed be adjusted?', a: 'Yes, electric semi-fowler beds allow independent head and knee adjustment with a remote control.' },
  ],
  'Wheelchair': [
    { q: 'Is the wheelchair foldable?', a: 'Yes, all our wheelchairs are foldable for easy storage and transport.' },
    { q: 'What is the weight capacity?', a: 'Our standard wheelchairs support up to 120 kg. Heavy-duty options available on request.' },
  ],
  'Suction Machine': [
    { q: 'Is training provided?', a: 'Yes, our nurse provides hands-on training for using the suction machine safely at home.' },
    { q: 'How often should I clean the canister?', a: 'The canister should be cleaned daily with warm soapy water and disinfected weekly.' },
  ],
  'Multipara Monitor': [
    { q: 'What parameters does it measure?', a: 'It measures BP, pulse rate, SpO2, temperature, and ECG in real time.' },
    { q: 'Can I connect it to my phone?', a: 'Yes, all our monitors come with Bluetooth connectivity for data tracking on your smartphone.' },
  ],
  'Nebulizer': [
    { q: 'What medications can I use?', a: 'Most prescribed respiratory medications (bronchodilators, steroids) can be used. Consult your doctor for specific medications.' },
    { q: 'How do I clean the nebulizer?', a: 'Rinse the medication cup and mouthpiece with warm water after each use and air dry. Weekly disinfection with vinegar solution is recommended.' },
  ],
  'Patient Lift': [
    { q: 'Is training provided?', a: 'Yes, we provide full training for caregivers on safe patient transfer techniques.' },
    { q: 'What is the weight capacity?', a: 'Our hydraulic patient lifts support up to 200 kg.' },
  ],
  'Commode Chair': [
    { q: 'Is it height adjustable?', a: 'Yes, the commode chair has adjustable height legs to fit over most standard toilets.' },
    { q: 'Is the bucket removable?', a: 'Yes, the collection bucket is removable and easy to clean.' },
  ],
};

export default function MedicalEquipmentDetail() {
  const t = useT();
  const { slug } = useParams();
  const [qty, setQty] = useState(1);
  const [rentalPeriod, setRentalPeriod] = useState('daily');

  const equip = useMemo(() => equipmentItems.find(e => e.slug === slug || e.name.toLowerCase().replace(/\s+/g, '-') === slug), [slug]);
  const specs = equip ? equipmentSpecs[equip.name] : null;
  const faqs = equip ? (equipmentFAQs[equip.name] || []) : [];
  const related = useMemo(() => {
    if (!equip) return [];
    return equipmentItems.filter(e => e.category === equip.category && e.id !== equip.id).slice(0, 4);
  }, [equip]);

  const periodMultiplier = { daily: 1, weekly: 7, monthly: 30 };
  const totalPrice = equip ? equip.price * qty * periodMultiplier[rentalPeriod] : 0;

  if (!equip) {
    return (
      <div className="page-section" style={{ background: C.bg, minHeight: '100vh' }}>
        <div className="container" style={{ textAlign: 'center', padding: '60px 16px' }}>
          <span style={{ fontSize: 48 }}>🔧</span>
          <p style={{ color: '#999', marginTop: 12 }}>{t('nurse.equipment.notFound', 'Equipment not found')}</p>
          <Link to="/medical-equipment" style={{ display: 'inline-block', marginTop: 16, padding: '10px 24px', background: C.primary, color: '#fff', textDecoration: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
            {t('nurse.equipment.backTo', '← Browse All Equipment')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section" style={{ background: C.bg, minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 800, paddingBottom: 120, margin: '0 auto' }}>

        <Link to="/medical-equipment" style={{ display: 'flex', alignItems: 'center', gap: 4, color: C.primary, textDecoration: 'none', fontSize: 12, fontWeight: 600, padding: '16px 0 8px' }}>
          ← {t('nurse.equipment.backToAll', 'Back to All Equipment')}
        </Link>

        <div style={{ marginBottom: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <span style={{ padding: '2px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: `${C.primary}15`, color: C.primary }}>{categoryLabels[equip.category] || equip.category}</span>
          <span style={{ padding: '2px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: '#F0FDF4', color: '#059669' }}>{t('nurse.equipment.homeDelivery', 'Free Home Delivery')}</span>
          <span style={{ padding: '2px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: '#FFF7ED', color: '#ea580c' }}>{specs?.warranty || t('nurse.equipment.warranty', 'Warranty Included')}</span>
        </div>

        <div style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.accent} 100%)`, borderRadius: 16, padding: '24px 20px', color: '#fff', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 40 }}>{equip.icon}</span>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{equip.name}</h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: '2px 0 0' }}>{equip.description}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 10, fontSize: 11 }}>
            <span>⭐ 4.8 Rating</span>
            <span>🚚 Free Delivery</span>
            <span>🔧 Free Setup</span>
            <span>✅ Quality Assured</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 32, fontWeight: 800 }}>₹{equip.price}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{t('nurse.equipment.perDay', '/day')}</div>
            </div>
            {[
              { icon: '💰', label: t('nurse.equipment.securityDeposit', 'Security Deposit'), value: `₹${equip.price * 2}` },
              { icon: '🚚', label: t('nurse.equipment.minRent', 'Min Rental'), value: specs?.minRent || '1 day' },
            ].map(i => (
              <div key={i.label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px', fontSize: 11 }}>
                <div style={{ opacity: 0.7, fontSize: 10 }}>{i.label}</div>
                <div style={{ fontWeight: 700 }}>{i.value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link to={`/nurse-at-home/book?equipment=${slug}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: 'none', fontSize: 13, fontWeight: 700, padding: '10px 24px', borderRadius: 10, color: C.primary, textDecoration: 'none' }}>
              📋 {t('nurse.equipment.rentNow', 'Rent Now')}
            </Link>
            <a href="tel:+919700104108" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px', borderRadius: 10, fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', textDecoration: 'none' }}>
              📞 {t('nurse.equipment.callEnquire', 'Call to Enquire')}
            </a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 6, marginBottom: 14 }}>
          {[
            { icon: '💰', label: t('nurse.equipment.rentalRate', 'Rental Rate'), value: '₹' + equip.price + '/day' },
            { icon: '🛡️', label: t('nurse.equipment.deposit', 'Deposit'), value: '₹' + equip.price * 2 },
            { icon: '🚚', label: t('nurse.equipment.delivery', 'Delivery'), value: t('nurse.equipment.free', 'Free') },
            { icon: '🔧', label: t('nurse.equipment.setup', 'Setup'), value: t('nurse.equipment.included', 'Included') },
          ].map(item => (
            <div key={item.label} style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, marginBottom: 2 }}>{item.icon}</div>
              <div style={{ fontSize: 9, color: '#94a3b8', marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#0f172a' }}>{item.value}</div>
            </div>
          ))}
        </div>

        {specs && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 16, marginBottom: 10 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>📋</span> {t('nurse.equipment.specs', 'Specifications')}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {Object.entries(specs).map(([key, val]) => (
                <div key={key} style={{ padding: '8px 10px', background: '#f8fafc', borderRadius: 8, fontSize: 12 }}>
                  <div style={{ color: '#94a3b8', fontSize: 10, marginBottom: 2, textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 16, marginBottom: 10 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16 }}>💰</span> {t('nurse.equipment.rentalCalculator', 'Rental Calculator')}
          </h3>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{t('nurse.equipment.quantity', 'Quantity')}</div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>−</button>
                <span style={{ width: 40, textAlign: 'center', fontSize: 16, fontWeight: 700 }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>+</button>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{t('nurse.equipment.rentalPeriod', 'Rental Period')}</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {['daily', 'weekly', 'monthly'].map(p => (
                  <button key={p} onClick={() => setRentalPeriod(p)} style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid ' + (rentalPeriod === p ? C.primary : '#e2e8f0'), background: rentalPeriod === p ? C.primary + '15' : '#fff', color: rentalPeriod === p ? C.primary : '#64748b', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}>
                    {p === 'daily' ? t('nurse.equipment.daily', 'Daily') : p === 'weekly' ? t('nurse.equipment.weekly', 'Weekly') : t('nurse.equipment.monthly', 'Monthly')}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ padding: '12px 16px', background: C.bg, borderRadius: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{t('nurse.equipment.totalRent', 'Total Rental')}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: C.primary }}>₹{totalPrice.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>₹{equip.price}/day × {qty} unit{qty > 1 ? 's' : ''} × {rentalPeriod === 'daily' ? '1' : rentalPeriod === 'weekly' ? '7' : '30'} days</div>
          </div>
        </div>

        {faqs.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 16, marginBottom: 10 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>❓</span> {t('nurse.equipment.faq', 'Frequently Asked Questions')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                  <button onClick={() => { const key = 'faq_' + i; }} style={{ width: '100%', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, color: '#0f172a', textAlign: 'left' }}>
                    {faq.q}
                    <span style={{ fontSize: 10, flexShrink: 0, color: '#94a3b8' }}>▾</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', padding: 16, marginBottom: 10 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>🔗</span> {t('nurse.equipment.related', 'Related Equipment')}
            </h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {related.map(re => {
                const rSlug = re.name.toLowerCase().replace(/\s+/g, '-');
                return (
                  <Link key={re.id} to={`/medical-equipment/${rSlug}`} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: `${C.primary}10`, border: `1px solid ${C.primary}30`, color: C.primary, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {re.icon} {re.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.accent})`, borderRadius: 16, padding: '20px', textAlign: 'center', color: '#fff', marginBottom: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 6px' }}>{t('nurse.equipment.needHelp', 'Need Help Choosing?')}</h3>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', margin: '0 0 12px' }}>{t('nurse.equipment.needHelpDesc', 'Call our equipment specialist for free advice')}</p>
          <a href="tel:+919700104108" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', background: '#fff', color: C.primary, borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            📞 +91 9700104108
          </a>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: equip.name + ' - Rent',
            description: equip.description,
            offers: { '@type': 'Offer', price: equip.price, priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
          })
        }} />
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999, background: '#fff', boxShadow: '0 -4px 16px rgba(0,0,0,0.08)', padding: '8px 16px 12px', display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid #eee' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#0f172a' }}>{equip.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: C.primary }}>₹{equip.price}</span>
            <span style={{ fontSize: 10, color: '#64748b' }}>{t('nurse.equipment.perDay', '/day')}</span>
          </div>
        </div>
        <a href="tel:+919700104108" style={{ width: 40, height: 40, borderRadius: '50%', background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none', color: '#fff', fontSize: 18 }}>📞</a>
        <Link to={`/nurse-at-home/book?equipment=${slug}`} style={{ background: C.primary, border: 'none', fontSize: 12, fontWeight: 700, padding: '10px 20px', borderRadius: 10, color: '#fff', textDecoration: 'none', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center' }}>
          📋 {t('nurse.equipment.rentNow', 'Rent Now')}
        </Link>
      </div>
    </div>
  );
}
