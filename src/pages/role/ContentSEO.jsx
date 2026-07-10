import { useState, useEffect } from 'react';
import useCmsStore from '../../stores/cmsStore';
import { useT } from '../../i18n/LanguageProvider';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function ContentSEO() {
  const t = useT();
  const cms = useCmsStore(s => s.cms);
  const routes = cms?.seo?.routes || [];
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('contentSeo.title', '🔍 SEO Management')}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{t('contentSeo.subtitle', 'Meta tags and SEO settings for {count} routes').replace('{count}', routes.length)}</p>
      {routes.map((r, i) => (
        <div key={i} style={card}>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{r.route}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{t('contentSeo.titleLabel', 'Title:')} {r.title}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{t('contentSeo.descriptionLabel', 'Description:')} {r.description?.slice(0, 80)}</div>
        </div>
      ))}
    </div>
  );
}