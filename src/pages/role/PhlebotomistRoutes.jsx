import { useState } from 'react';
import { useT } from '../../i18n/LanguageProvider';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };
const inputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box' };

const SAMPLE_ROUTES = [
  { area: 'Koramangala', stops: 12, estTime: '2.5 hrs', status: 'active' },
  { area: 'Indiranagar', stops: 8, estTime: '1.5 hrs', status: 'pending' },
  { area: 'Whitefield', stops: 15, estTime: '3 hrs', status: 'pending' },
];

export default function PhlebotomistRoutes() {
  const [routes] = useState(SAMPLE_ROUTES);
  const t = useT();
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('role.phlebotomist.routes', '🗺️ Routes')}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{t("role.phlebotomist.subtitle", "Today's collection routes and stops")}</p>
      {routes.map((r, i) => (
        <div key={i} style={{ ...card, border: r.status === 'active' ? '2px solid #059669' : '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>📍 {r.area}</span>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{r.stops} stops · ~{r.estTime}</div>
            </div>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: r.status === 'active' ? '#dcfce7' : '#f1f5f9', color: r.status === 'active' ? '#16a34a' : '#64748b', fontWeight: 600, textTransform: 'capitalize' }}>{r.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}