import { useState, useEffect } from 'react';
import useCmsStore from '../../stores/cmsStore';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function ContentSEO() {
  const cms = useCmsStore(s => s.cms);
  const routes = cms?.seo?.routes || [];
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>🔍 SEO Management</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>Meta tags and SEO settings for {routes.length} routes</p>
      {routes.map((r, i) => (
        <div key={i} style={card}>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{r.route}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>Title: {r.title}</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>Description: {r.description?.slice(0, 80)}</div>
        </div>
      ))}
    </div>
  );
}