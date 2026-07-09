import { useParams, Link } from 'react-router-dom';
import policies, { policyMeta } from '../data/policyContent';

const card = { background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0', marginBottom: 16 };
const MAX_WIDTH = 720;

export default function PolicyPage() {
  const { slug } = useParams();
  const policy = policies[slug];
  const meta = policyMeta[slug];

  if (!policy) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 16px' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔬</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Page Not Found</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>The policy page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="page-section container" style={{ maxWidth: MAX_WIDTH, margin: '0 auto', padding: '32px 16px' }}>
      <Link to="/" style={{ fontSize: 12, color: '#1866C9', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
        ← Home
      </Link>
      <div style={card}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>{policy.title}</h1>
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 20px' }}>Last updated: {policy.lastUpdated}</p>
        {policy.sections.map((s, i) => (
          <div key={i} style={{ marginBottom: i < policy.sections.length - 1 ? 20 : 0 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>{s.heading}</h2>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7, margin: 0 }}>{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}