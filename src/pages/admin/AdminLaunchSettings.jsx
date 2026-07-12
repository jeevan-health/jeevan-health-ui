import { useEffect, useState } from 'react';
import * as settingsService from '../../services/settingsService';

const MODES = [
  {
    id: 'reports_only_camp_users',
    title: 'Camp users → reports only (recommended now)',
    desc: 'People who registered via a camp QR can only use lab reports, profile, and notifications. Everyone else keeps full booking (when those modules are used). Perfect while you launch camps first.',
  },
  {
    id: 'reports_only',
    title: 'All patients → reports only',
    desc: 'Every patient account is limited to reports/profile. No doctor, nursing, physio, vaccine, or diagnostic checkout — until you switch to Full app.',
  },
  {
    id: 'full',
    title: 'Full app open for everyone',
    desc: 'When you are ready: booking and all patient features enabled for all users (including camp registrants).',
  },
];

/**
 * Admin control for soft-launch: camp reports first, full product later.
 */
export default function AdminLaunchSettings() {
  const [accessMode, setAccessMode] = useState('reports_only_camp_users');
  const [accessMessage, setAccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    settingsService.adminGetSettings()
      .then(({ data }) => {
        if (cancelled) return;
        setAccessMode(data.settings?.accessMode || 'reports_only_camp_users');
        setAccessMessage(data.settings?.accessMessage || '');
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.error || 'Failed to load settings');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const { data } = await settingsService.adminUpdateSettings({
        accessMode,
        accessMessage: accessMessage.trim(),
      });
      setAccessMode(data.settings.accessMode);
      setAccessMessage(data.settings.accessMessage);
      setSaved(true);
    } catch (err) {
      setError(err?.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ color: '#94a3b8', fontSize: 13 }}>Loading launch settings…</p>;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700 }}>🚀 App launch control</h2>
        <p style={{ margin: 0, fontSize: 12, color: '#64748b', maxWidth: 560 }}>
          Soft-launch camps first: registered camp patients can receive reports and push alerts,
          without opening doctor / nursing / physio / test checkout until you flip this to Full app.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 18, maxWidth: 640 }}
      >
        <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>Patient access mode</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {MODES.map((m) => {
            const active = accessMode === m.id;
            return (
              <label
                key={m.id}
                style={{
                  display: 'block',
                  padding: 14,
                  borderRadius: 10,
                  border: active ? '2px solid #1866C9' : '1px solid #e2e8f0',
                  background: active ? '#F0F7FF' : '#fff',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <input
                    type="radio"
                    name="accessMode"
                    value={m.id}
                    checked={active}
                    onChange={() => { setAccessMode(m.id); setSaved(false); }}
                    style={{ marginTop: 3 }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{m.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, lineHeight: 1.45 }}>{m.desc}</div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        <label style={{ display: 'block', marginTop: 16, fontSize: 11, fontWeight: 600, color: '#64748b' }}>
          Message shown when a feature is blocked
        </label>
        <textarea
          value={accessMessage}
          onChange={(e) => { setAccessMessage(e.target.value); setSaved(false); }}
          rows={3}
          style={{
            width: '100%', marginTop: 6, padding: '10px 12px', borderRadius: 8,
            border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box',
          }}
        />

        {error && (
          <div style={{ marginTop: 12, padding: 10, background: '#FEF2F2', color: '#b91c1c', borderRadius: 8, fontSize: 12 }}>
            {error}
          </div>
        )}
        {saved && (
          <div style={{ marginTop: 12, padding: 10, background: '#f0fdf4', color: '#166534', borderRadius: 8, fontSize: 12 }}>
            Saved. Changes apply immediately for new API calls and next UI load.
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={saving} style={{ marginTop: 16, minHeight: 44 }}>
          {saving ? 'Saving…' : 'Save launch settings'}
        </button>
      </form>

      <div style={{ marginTop: 16, padding: 14, background: '#FFFBEB', borderRadius: 10, border: '1px solid #fde68a', fontSize: 12, color: '#92400e', maxWidth: 640, lineHeight: 1.5 }}>
        <strong>What stays available in reports-only modes:</strong> camp registration, lab report PDF email + push,
        dashboard reports tab, profile/family, PWA install.
        <br />
        <strong>Blocked:</strong> new doctor appointments, diagnostic checkout orders, nursing / physio / vaccine bookings (API + UI).
      </div>
    </div>
  );
}
