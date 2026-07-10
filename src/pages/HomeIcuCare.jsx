import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { nurses, nursingServices } from '../data/nursingData';

const C = { primary: '#DC2626', primaryLight: '#FEE2E2', accent: '#EF4444', bg: '#FEF2F2' };
const ICON = '🆘';

const ICUServices = [
  { icon: '🫁', title: 'Ventilator Patient Care', desc: 'Complete ventilator management including settings monitoring, alarm response, and weaning protocols by trained ICU nurses.' },
  { icon: '💨', title: 'Oxygen Monitoring', desc: 'Continuous oxygen saturation monitoring with pulse oximetry and ABG interpretation. Oxygen concentrator management.' },
  { icon: '🫀', title: 'Tracheostomy Care', desc: 'Tracheostomy tube cleaning, suctioning, humidification, stoma care, and emergency tube change protocols.' },
  { icon: '💉', title: 'IV Line Management', desc: 'IV cannula care, fluid administration, IV antibiotic infusion, TPN management, and central line care.' },
  { icon: '📊', title: 'Continuous Vital Monitoring', desc: 'Multipara monitor for BP, pulse, temperature, SpO2, ECG. Real-time vital tracking and trend analysis.' },
  { icon: '🚨', title: 'Emergency Escalation', desc: 'Immediate escalation protocol for any deterioration. Direct line to Jeevan critical care team and ambulance dispatch.' },
];

const icuNurses = nurses.filter(n => n.specialties.includes('icu-home'));

export default function HomeIcuCare() {
  const t = useT();

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${C.primary} 0%, #EF4444 100%)`, padding: '52px 0 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.15 }}>{t('nurse.icu.title', 'ICU at Home – Critical Care Nursing')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: '0 0 16px', maxWidth: 520, lineHeight: 1.5 }}>
            {t('nurse.icu.subtitle', 'Hospital-grade intensive care in the comfort of your home. Trained critical care nurses, continuous monitoring, and doctor coordination.')}
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {['ICU Trained Nurses', 'Multipara Monitor', 'Ventilator Support', 'Doctor Tele-consult', '24/7 Backup'].map(b => (
              <span key={b} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: 20 }}>
                <span style={{ color: '#22C55E', fontSize: 12 }}>✓</span> {b}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/nurse-at-home/book?plan=24hr" style={{ background: '#fff', color: C.primary, height: 48, padding: '0 28px', borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              {t('nurse.icu.book', 'Book ICU Nurse')} →
            </Link>
            <a href="tel:+919700104108" style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)', color: '#fff', height: 48, padding: '0 28px', borderRadius: 10, fontSize: 16, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              📞 {t('nurse.icu.emergency', 'Emergency: +91-9700104108')}
            </a>
          </div>
        </div>
      </div>

      <div className="page-section container">
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, textAlign: 'center' }}>{t('nurse.icu.services.title', 'ICU at Home Services')}</h2>
        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px', textAlign: 'center' }}>{t('nurse.icu.services.subtitle', 'Complete critical care infrastructure delivered at your doorstep')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {ICUServices.map(svc => (
            <div key={svc.title} style={{ padding: 20, borderRadius: 12, border: `1px solid ${C.primary}20`, background: `${C.primary}04`, borderTop: `3px solid ${C.primary}` }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>{svc.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{svc.title}</h3>
              <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.5 }}>{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="page-section" style={{ background: C.bg }}>
        <div className="container">
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, textAlign: 'center' }}>{t('nurse.icu.equipment.title', 'ICU Equipment at Home')}</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px', textAlign: 'center' }}>{t('nurse.icu.equipment.subtitle', 'All necessary medical equipment provided as part of ICU at Home service')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {[
              { icon: '📊', name: 'Multipara Monitor', desc: 'BP, pulse, SpO2, temp, ECG' },
              { icon: '🫁', name: 'Ventilator', desc: 'Volume/pressure control modes' },
              { icon: '💨', name: 'Oxygen Concentrator', desc: '5L-10L with humidifier' },
              { icon: '🩺', name: 'Suction Machine', desc: 'Portable suction unit' },
              { icon: '💉', name: 'Infusion Pump', desc: 'IV medication delivery' },
              { icon: '🛏️', name: 'ICU Bed', desc: 'Electric ICU bed' },
              { icon: '⚡', name: 'Defibrillator', desc: 'Emergency backup' },
              { icon: '🫀', name: 'ECG Machine', desc: '12-lead ECG' },
            ].map(item => (
              <div key={item.name} style={{ padding: 16, borderRadius: 10, background: '#fff', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>{item.icon}</div>
                <h4 style={{ fontSize: 12, fontWeight: 700, margin: '0 0 2px', color: '#0f172a' }}>{item.name}</h4>
                <p style={{ fontSize: 10, color: '#64748b', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {icuNurses.length > 0 && (
        <div className="page-section container">
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12, textAlign: 'center' }}>{t('nurse.icu.nurses', 'Our ICU Nurses')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {icuNurses.map(n => (
              <div key={n.id} style={{ padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 32 }}>{n.image}</span>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 2px', color: '#0f172a' }}>{n.name}</h3>
                    <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 4px' }}>{n.qualifications} · {n.experience} yrs</p>
                    <div style={{ fontSize: 11, color: '#d97706' }}>★ {n.rating} ({n.sessions}+ sessions)</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{n.languages.join(', ')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: `linear-gradient(135deg, ${C.primary}, #EF4444)`, padding: '40px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{t('nurse.icu.cta', 'Need Critical Care at Home?')}</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 16 }}>{t('nurse.icu.cta.subtitle', 'Our ICU team is available 24/7. Call us for immediate assistance.')}</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/nurse-at-home/book?plan=24hr" style={{ padding: '14px 32px', background: '#fff', color: C.primary, borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>{t('nurse.icu.book', 'Book ICU Nurse')} →</Link>
            <a href="tel:+919700104108" style={{ padding: '14px 32px', background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>📞 {t('nurse.callNow', 'Call +91-9700104108')}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
