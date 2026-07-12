import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as labReportService from '../../services/labReportService';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const b64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(b64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Camp ops: find patient by email → upload PDF → email + push.
 */
export default function AdminLabReports() {
  const [q, setQ] = useState('');
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [testName, setTestName] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [history, setHistory] = useState([]);

  const loadHistory = useCallback(async () => {
    try {
      const { data } = await labReportService.listAdminReports({ limit: 30 });
      setHistory(data.reports || []);
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  useEffect(() => {
    if (q.trim().length < 2) {
      setPatients([]);
      return undefined;
    }
    const tmr = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await labReportService.searchPatients(q.trim());
        setPatients(data.users || []);
      } catch {
        setPatients([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(tmr);
  }, [q]);

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.type && f.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }
    if (f.size > 8 * 1024 * 1024) {
      setError('PDF must be under 8 MB');
      return;
    }
    setError('');
    setFile(f);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selected?.id) {
      setError('Select a registered patient');
      return;
    }
    if (!testName.trim()) {
      setError('Enter test / report name');
      return;
    }
    if (!file) {
      setError('Choose a PDF report');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(null);
    try {
      const pdfBase64 = await fileToBase64(file);
      const { data } = await labReportService.uploadReport({
        userId: selected.id,
        testName: testName.trim(),
        fileName: file.name,
        mimeType: 'application/pdf',
        pdfBase64,
        notes: notes.trim() || undefined,
        sendEmail: true,
        sendPush: true,
      });
      setSuccess(data);
      setFile(null);
      setTestName('');
      setNotes('');
      await loadHistory();
    } catch (err) {
      setError(err?.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700 }}>📄 Lab reports (camp)</h2>
          <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
            Upload PDF → email to patient + PWA push. QR booth:{' '}
            <Link to="/admin/camp-qr" style={{ color: '#1866C9' }}>Camp QR</Link>
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="admin-lab-grid">
        <form onSubmit={handleUpload} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 18 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>Upload report</h3>

          <label style={label}>Find patient (email / phone / name)</label>
          <input
            value={q}
            onChange={e => { setQ(e.target.value); setSelected(null); }}
            placeholder="search@email.com or phone"
            style={input}
          />
          {searching && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Searching…</div>}
          {patients.length > 0 && !selected && (
            <div style={{ marginTop: 8, border: '1px solid #e2e8f0', borderRadius: 8, maxHeight: 160, overflowY: 'auto' }}>
              {patients.map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => { setSelected(u); setQ(u.email || u.phone || u.name || ''); setPatients([]); }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px', border: 'none',
                    borderBottom: '1px solid #f1f5f9', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12,
                  }}
                >
                  <strong>{u.name || '—'}</strong>
                  <div style={{ color: '#64748b' }}>{u.email || 'no email'} · {u.phone || 'no phone'}</div>
                </button>
              ))}
            </div>
          )}
          {selected && (
            <div style={{ marginTop: 8, padding: 10, background: '#F0F7FF', borderRadius: 8, fontSize: 12 }}>
              Selected: <strong>{selected.name || '—'}</strong> · {selected.email || '⚠️ no email'}
              {!selected.email && <div style={{ color: '#b91c1c', marginTop: 4 }}>Patient must register with email to receive PDF.</div>}
            </div>
          )}

          <label style={{ ...label, marginTop: 12 }}>Test / report name *</label>
          <input value={testName} onChange={e => setTestName(e.target.value)} placeholder="e.g. Complete Blood Count" style={input} required />

          <label style={{ ...label, marginTop: 12 }}>PDF report * (max 8 MB)</label>
          <input type="file" accept="application/pdf,.pdf" onChange={onFile} style={{ fontSize: 13, width: '100%' }} />
          {file && <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{file.name} ({Math.round(file.size / 1024)} KB)</div>}

          <label style={{ ...label, marginTop: 12 }}>Notes (optional)</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} style={{ ...input, resize: 'vertical' }} />

          {error && <div style={{ marginTop: 12, padding: 10, background: '#FEF2F2', color: '#b91c1c', borderRadius: 8, fontSize: 12 }}>{error}</div>}
          {success && (
            <div style={{ marginTop: 12, padding: 10, background: '#f0fdf4', color: '#166534', borderRadius: 8, fontSize: 12 }}>
              <strong>Report #{success.report?.id} uploaded.</strong>
              <div>Email: {success.email?.sent ? `sent to ${success.email.to}` : `failed — ${success.email?.error || 'n/a'}`}</div>
              <div>
                Push: {success.push?.skipped
                  ? `skipped (${success.push.reason})`
                  : `${success.push?.sent || 0} device(s)`}
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: 14, minHeight: 46 }}>
            {loading ? 'Uploading & notifying…' : 'Upload · email PDF · notify'}
          </button>
        </form>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 18 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>Recent uploads</h3>
          {history.length === 0 && <p style={{ fontSize: 12, color: '#94a3b8' }}>No reports yet.</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 480, overflowY: 'auto' }}>
            {history.map(r => (
              <div key={r.id} style={{ padding: 10, borderRadius: 8, border: '1px solid #f1f5f9', fontSize: 12 }}>
                <div style={{ fontWeight: 700 }}>#{r.id} · {r.testName}</div>
                <div style={{ color: '#64748b' }}>{r.patientName || '—'} · {r.patientEmail || r.userEmail}</div>
                <div style={{ color: '#94a3b8', marginTop: 2 }}>
                  {r.createdAt ? new Date(r.createdAt).toLocaleString('en-IN') : ''}
                  {' · '}
                  Email {r.emailedAt ? '✓' : (r.emailError ? '✗' : '—')}
                  {' · '}
                  Push {r.pushSentAt ? '✓' : (r.pushError ? '✗' : '—')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .admin-lab-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const label = { fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 };
const input = {
  width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0',
  fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box',
};
