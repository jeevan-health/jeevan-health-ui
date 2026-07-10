import { useT } from '../i18n/LanguageProvider';
import { useParams, Link } from 'react-router-dom';
import useCmsStore from '../stores/cmsStore';

export default function BlogPost() {
  const t = useT();
  const { slug } = useParams();
  const blog = useCmsStore(s => s.content?.blog) || {};
  const post = (blog.posts || []).find(p => p.slug === slug && p.active !== false);

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 16px' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{t('blogPost.notFound', 'Post Not Found')}</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>{t('blogPost.notFoundDesc', "The blog post you're looking for doesn't exist or has been removed.")}</p>
        <Link to="/blog" style={{ padding: '10px 24px', borderRadius: 8, background: '#1866C9', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600, display: 'inline-block' }}>{t('blogPost.backToBlog', '← Back to Blog')}</Link>
      </div>
    );
  }

  const paragraphs = post.content.split('\n').filter(Boolean);

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1866C9 0%, #0F4A96 100%)', padding: '28px 16px 32px', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <Link to="/blog" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, textDecoration: 'none', marginBottom: 12, display: 'inline-block' }}>{t('blogPost.backToBlog', '← Back to Blog')}</Link>
          <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.3 }}>{post.title}</h1>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
            <span>{t('blogPost.by', 'By')} {post.author}</span>
            <span>•</span>
            <span>{post.publishedAt}</span>
            <span>•</span>
            <span style={{ color: '#FFD54F', fontWeight: 600 }}>{post.category}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px' }}>
        {post.image && <img src={post.image} alt="" style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 14, marginBottom: 20 }} />}
        <div style={{ fontSize: 14, lineHeight: 1.8, color: '#334155' }}>
          {paragraphs.map((p, i) => <p key={i} style={{ margin: '0 0 12px' }}>{p}</p>)}
        </div>
        {post.tags && post.tags.length > 0 && (
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {post.tags.map(t => <span key={t} style={{ fontSize: 11, background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: 6 }}>#{t}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}
