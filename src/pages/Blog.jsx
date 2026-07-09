import { Link } from 'react-router-dom';
import useCmsStore from '../stores/cmsStore';

export default function Blog() {
  const blog = useCmsStore(s => s.content?.blog) || {};
  const posts = (blog.posts || []).filter(p => p.active !== false);
  const bgColors = ['#1866C9', '#16a34a', '#7c3aed', '#dc2626', '#0891b2', '#e65100'];

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1866C9 0%, #0F4A96 100%)', padding: '28px 16px 32px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: '0 0 8px', letterSpacing: -0.5 }}>{blog.pageTitle || 'Health Blog'}</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{blog.pageSubtitle || ''}</p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px' }}>
        {posts.length === 0 && <p style={{ textAlign: 'center', color: '#64748b', fontSize: 13, padding: 40 }}>No blog posts yet.</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {posts.map((post, i) => (
            <Link key={post.id} to={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'box-shadow 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}>
                <div style={{ display: 'flex', gap: 16, padding: 16, flexWrap: 'wrap' }}>
                  {post.image && <img src={post.image} alt="" style={{ width: 120, height: 90, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', background: bgColors[i % bgColors.length], padding: '2px 8px', borderRadius: 4 }}>{post.category}</span>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>{post.publishedAt}</span>
                    </div>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 6px', lineHeight: 1.3 }}>{post.title}</h2>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.5 }}>{post.excerpt}</p>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>By {post.author}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}