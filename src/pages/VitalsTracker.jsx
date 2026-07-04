import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretLeft, Heartbeat, ChartLine } from '@phosphor-icons/react';
import { getVitals, addVital } from '../services/healthService';

const vitalTypes = [
  { value: 'blood_pressure', label: 'Blood Pressure', unit: 'mmHg', fields: [{ key: 'systolic', label: 'Systolic' }, { key: 'diastolic', label: 'Diastolic' }] },
  { value: 'blood_sugar', label: 'Blood Sugar', unit: 'mg/dL', fields: [{ key: 'value', label: 'Value' }] },
  { value: 'heart_rate', label: 'Heart Rate', unit: 'bpm', fields: [{ key: 'value', label: 'BPM' }] },
  { value: 'weight', label: 'Weight', unit: 'kg', fields: [{ key: 'value', label: 'Weight' }] },
];

export default function VitalsTracker() {
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState('blood_pressure');
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getVitals({ type: activeType, limit: 50 });
      setVitals(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [activeType]);

  const vitalConfig = vitalTypes.find(v => v.value === activeType);

  const handleSave = async () => {
    setSaving(true);
    try {
      const value = {};
      vitalConfig.fields.forEach(f => { value[f.key] = parseFloat(formValues[f.key]); });
      await addVital({ type: activeType, value, notes });
      setFormValues({});
      setNotes('');
      setShowForm(false);
      load();
    } catch {} finally { setSaving(false); }
  };

  const getDisplayValue = (v) => {
    if (v.type === 'blood_pressure') return `${v.value.systolic}/${v.value.diastolic}`;
    if (v.value.value) return v.value.value;
    return Object.values(v.value).join('/');
  };

  const getStatusColor = (v) => {
    if (v.type === 'blood_pressure') {
      const s = v.value.systolic;
      if (s < 120) return '#2e7d32';
      if (s < 130) return '#e65100';
      return '#c62828';
    }
    if (v.type === 'blood_sugar') {
      const val = v.value.value;
      if (val < 100) return '#2e7d32';
      if (val < 126) return '#e65100';
      return '#c62828';
    }
    return 'var(--primary)';
  };

  const latest = vitals[0];

  return (
    <div className="page-section">
      <div className="container">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          <CaretLeft size={16} /> Back to Dashboard
        </button>
        <h1>Vitals Tracker</h1>

        {/* Type tabs */}
        <div style={{ display: 'flex', gap: 8, margin: '16px 0', flexWrap: 'wrap' }}>
          {vitalTypes.map(v => (
            <button key={v.value} onClick={() => { setActiveType(v.value); setShowForm(false); }}
              style={{
                padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: activeType === v.value ? 'var(--primary)' : '#fff',
                color: activeType === v.value ? '#fff' : 'var(--text-body)',
                border: activeType === v.value ? 'none' : '1px solid var(--border)',
              }}>
              {v.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="card p-10 text-center">Loading...</div>
        ) : (
          <>
            {/* Latest reading */}
            {latest && (
              <div className="card p-6" style={{ textAlign: 'center', marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 4 }}>Latest Reading</p>
                <p style={{ fontSize: 36, fontWeight: 700, color: getStatusColor(latest) }}>
                  {getDisplayValue(latest)}
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-light)' }}>{vitalConfig?.unit} — {new Date(latest.recorded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            )}

            <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ marginBottom: 16, padding: '8px 20px', fontSize: 13 }}>
              <ChartLine size={16} /> Add Reading
            </button>

            {showForm && (
              <div className="card p-5" style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, marginBottom: 12 }}>Add {vitalConfig?.label} Reading</h3>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
                  {vitalConfig?.fields.map(f => (
                    <div key={f.key} style={{ flex: 1, minWidth: 120 }}>
                      <label style={{ fontSize: 12 }}>{f.label} ({vitalConfig?.unit})</label>
                      <input type="number" step="0.1" value={formValues[f.key] || ''} onChange={e => setFormValues({ ...formValues, [f.key]: e.target.value })} className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
                    </div>
                  ))}
                </div>
                <input placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} className="input" style={{ padding: '8px 10px', fontSize: 13, marginBottom: 10 }} />
                <button onClick={handleSave} disabled={saving || !vitalConfig?.fields.every(f => formValues[f.key])} className="btn btn-accent">
                  {saving ? 'Saving...' : 'Save Reading'}
                </button>
              </div>
            )}

            {/* History */}
            <h3 style={{ fontSize: 14, marginBottom: 8 }}>History</h3>
            {vitals.length === 0 ? (
              <div className="card p-8 text-center">
                <Heartbeat size={32} style={{ color: 'var(--text-light)', marginBottom: 8 }} />
                <p style={{ color: 'var(--text-light)' }}>No readings yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {vitals.map(v => (
                  <div key={v.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: getStatusColor(v) + '15',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: getStatusColor(v),
                    }}>
                      <Heartbeat size={18} weight="fill" />
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 700, color: getStatusColor(v), minWidth: 80 }}>
                      {getDisplayValue(v)}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-light)' }}>
                      {new Date(v.recorded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {v.notes && <span style={{ fontSize: 12, color: 'var(--text-light)', marginLeft: 'auto' }}>{v.notes}</span>}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
