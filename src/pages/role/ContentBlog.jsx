import { useState, useEffect } from 'react';
import useCmsStore from '../../stores/cmsStore';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function ContentBlog() {
  const cms = useCmsStore(s => s.cms);
  const posts = cms?.blog?.posts || [];
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>📝 Blog Posts</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{posts.length} published posts</p>
      {posts.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 40 }}>No blog posts yet.</p>}
      {posts.map((p, i) => (
        <div key={i} style={card}>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{p.title}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{p.excerpt?.slice(0, 100)}</div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>By {p.author} · {p.category} · {p.publishedAt}</div>
        </div>
      ))}
    </div>
  );
}