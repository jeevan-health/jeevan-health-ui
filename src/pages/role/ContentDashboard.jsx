import { useState } from 'react';
import useAuthStore from '../../stores/authStore';

const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function ContentDashboard() {
  const user = useAuthStore(s => s.user);

  // Check if CMS content exists
  const [cms] = useState(() => {
    try { return JSON.parse(localStorage.getItem('jh_cms_content') || '{}'); } catch { return {}; }
  });

  const blogPosts = cms?.blog?.posts || [];
  const seoRoutes = Object.keys(cms?.seo || {}).length;
  const servicesCount = Object.keys(cms?.servicesPage || {}).length;

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>🖋️ Welcome, {user?.name || 'Content Team'}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: 16 }}>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#c026d3' }}>{blogPosts.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Blog Posts</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#c026d3' }}>{seoRoutes}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>SEO Routes</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#c026d3' }}>{servicesCount}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Service Pages</div></div>
      </div>
      <div style={card}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>📝 Recent Blog Posts</h4>
        {blogPosts.length === 0 ? <p style={{ fontSize: 12, color: '#94a3b8' }}>No blog posts yet. Manage content in Website CMS.</p> : blogPosts.slice(0, 6).map((p, i) => (
          <div key={i} style={{ fontSize: 12, padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontWeight: 600 }}>{p.title || 'Untitled'}</span>
            <span style={{ color: '#64748b', marginLeft: 8 }}>{p.category || '—'} | {p.publishedAt || ''}</span>
          </div>
        ))}
      </div>
    </div>
  );
}