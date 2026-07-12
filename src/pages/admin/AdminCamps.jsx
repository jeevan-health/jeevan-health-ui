import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as campService from '../../services/campService';

function slugPreview(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/**
 * Admin: create & manage diagnostic camps.
 * Each camp has its own patient QR (/camp/:slug), registrants, and reports.
 */
export default function AdminCamps() {
  const navigate = useNavigate();
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: '',
    location: '',
    startsAt: '',
    endsAt: '',
    notes: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await campService.listCamps({ limit: 100 });
      setCamps(data.camps || []);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load camps');
      setCamps([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Camp name is required');
      return;
    }
    setCreating(true);
    setError('');
    try {
      const { data } = await campService.createCamp({
        name: form.name.trim(),
        location: form.location.trim() || undefined,
        startsAt: form.startsAt || undefined,
        endsAt: form.endsAt || undefined,
        notes: form.notes.trim() || undefined,
        status: 'active',
      });
      setShowCreate(false);
      setForm({ name: '', location: '', startsAt: '', endsAt: '', notes: '' });
      navigate(`/admin/camps/${data.camp.id}`);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to create camp');
    } finally {
      setCreating(false);
    }
  };

  const statusColor = (s) => {
    if (s === 'active') return { bg: '#f0fdf4', color: '#166534' };
    if (s === 'ended') return { bg: '#f1f5f9', color: '#475569' };
    return { bg: '#FEF2F2', color: '#b91c1c' };
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700 }}>🏕️ Camps</h2>
          <p style={{ margin: 0, fontSize: 12, color: '#64748b', maxWidth: 520 }}>
            Create a camp → download QR card → patients register with email and join this camp
            (they also stay in your full user base). Then upload lab reports per camp.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShowCreate(true)}>
          + Create camp
        </button>
      </div>

      {error && (
        <div style={{ marginBottom: 12, padding: 10, background: '#FEF2F2', color: '#b91c1c', borderRadius: 8, fontSize: 12 }}>
          {error}
        </div>
      )}

      {showCreate && (
        <form
          onSubmit={handleCreate}
          style={{
            background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 18, marginBottom: 16,
          }}
        >
          <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>New camp</h3>
          <label style={label}>Camp name *</label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Tech Park Health Camp — July 2026"
            style={input}
            required
          />
          {form.name && (
            <p style={{ margin: '6px 0 0', fontSize: 11, color: '#64748b' }}>
              Patient link: https://jeevanhealthcare.com/camp/{slugPreview(form.name) || '…'}
            </p>
          )}

          <label style={{ ...label, marginTop: 12 }}>Location (optional)</label>
          <input
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            placeholder="Hyderabad · ABC Corporate"
            style={input}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
            <div>
              <label style={label}>Start date</label>
              <input type="date" value={form.startsAt} onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))} style={input} />
            </div>
            <div>
              <label style={label}>End date</label>
              <input type="date" value={form.endsAt} onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))} style={input} />
            </div>
          </div>

          <label style={{ ...label, marginTop: 12 }}>Internal notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            rows={2}
            style={{ ...input, resize: 'vertical' }}
          />

          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button type="submit" className="btn btn-primary" disabled={creating}>
              {creating ? 'Creating…' : 'Create & open QR'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
          </div>
        </form>
      )}

      {loading && <p style={{ fontSize: 13, color: '#94a3b8' }}>Loading camps…</p>}

      {!loading && camps.length === 0 && (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px dashed #e2e8f0', padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🏕️</div>
          <p style={{ margin: '0 0 12px', color: '#64748b', fontSize: 13 }}>No camps yet. Create one for your next collection day.</p>
          <button type="button" className="btn btn-primary" onClick={() => setShowCreate(true)}>+ Create camp</button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {camps.map((c) => {
          const st = statusColor(c.status);
          return (
            <Link
              key={c.id}
              to={`/admin/camps/${c.id}`}
              style={{
                display: 'block',
                background: '#fff',
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                padding: 16,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                    {c.location || 'No location'} · /camp/{c.slug}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: st.bg, color: st.color }}>
                    {c.status}
                  </span>
                  <span style={{ fontSize: 12, color: '#475569' }}>
                    👥 {c.registrationCount ?? 0} · 📄 {c.reportCount ?? 0}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const label = { fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 };
const input = {
  width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0',
  fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box',
};
