import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Full-screen QR for diagnostic camps.
 * Patients scan → /camp (register + install PWA).
 */
export default function AdminCampQr() {
  const [origin, setOrigin] = useState(() => (typeof window !== 'undefined' ? window.location.origin : 'https://jeevanhealthcare.com'));
  const campUrl = useMemo(() => `${origin.replace(/\/$/, '')}/camp`, [origin]);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data=${encodeURIComponent(campUrl)}`;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700 }}>📱 Camp QR code</h2>
          <p style={{ margin: 0, fontSize: 12, color: '#64748b', maxWidth: 480 }}>
            Display this screen at the collection camp. Patients scan → register with email → install app.
            After lab work, upload PDFs under{' '}
            <Link to="/admin/lab-reports" style={{ color: '#1866C9' }}>Lab reports</Link>.
          </p>
        </div>
        <Link to="/admin/lab-reports" className="btn btn-primary btn-sm">Upload reports →</Link>
      </div>

      <div style={{
        background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28,
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Jeevan HealthCare</div>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Scan to register & get reports</div>
        <img
          src={qrSrc}
          alt={`QR code for ${campUrl}`}
          width={280}
          height={280}
          style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
        />
        <p style={{ margin: '14px 0 0', fontSize: 13, fontWeight: 600, color: '#1866C9', wordBreak: 'break-all' }}>
          {campUrl}
        </p>
        <p style={{ margin: '8px 0 0', fontSize: 11, color: '#94a3b8' }}>
          Print this page or leave the tablet on this screen at the booth.
        </p>
      </div>

      <div style={{ marginTop: 16, background: '#F8FAFC', borderRadius: 12, padding: 14, border: '1px solid #e2e8f0' }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>QR destination origin (advanced)</label>
        <input
          value={origin}
          onChange={e => setOrigin(e.target.value)}
          style={{ width: '100%', marginTop: 6, padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }}
          placeholder="https://jeevanhealthcare.com"
        />
      </div>
    </div>
  );
}
