import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretLeft, Upload, FileText, Trash, Pill, Flask, Heart, Syringe, Clipboard } from '@phosphor-icons/react';
import { getRecords, uploadRecord, deleteRecord, getHealthInfo, saveHealthInfo } from '../services/healthService';

const recordTypes = [
  { value: 'prescription', label: 'Prescription', icon: Pill },
  { value: 'lab_report', label: 'Lab Report', icon: Flask },
  { value: 'scan', label: 'Scan/Imaging', icon: Clipboard },
  { value: 'vaccination', label: 'Vaccination', icon: Syringe },
  { value: 'other', label: 'Other', icon: FileText },
];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function HealthRecords() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [healthInfo, setHealthInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: '', recordType: 'prescription', notes: '' });
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    try {
      const [{ data: recs }, { data: info }] = await Promise.all([getRecords(), getHealthInfo()]);
      setRecords(recs);
      setHealthInfo(info || {});
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async () => {
    setUploading(true);
    try {
      await uploadRecord(uploadForm);
      setUploadForm({ title: '', recordType: 'prescription', notes: '' });
      setShowUpload(false);
      load();
    } catch {} finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return;
    await deleteRecord(id);
    load();
  };

  const handleSaveInfo = async () => {
    await saveHealthInfo(healthInfo);
    load();
  };

  const getTypeIcon = (type) => {
    const t = recordTypes.find(r => r.value === type);
    return t ? t.icon : FileText;
  };

  return (
    <div className="page-section">
      <div className="container">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1.5 text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          <CaretLeft size={16} /> Back to Dashboard
        </button>
        <h1>Health Records</h1>

        {loading ? (
          <div className="card p-10 text-center" style={{ marginTop: 20 }}>Loading...</div>
        ) : (
          <>
            {/* Health Info */}
            <div className="card p-5" style={{ marginTop: 16 }}>
              <h3 style={{ fontSize: 15, marginBottom: 12 }}>Health Profile</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12 }}>Blood Group</label>
                  <select value={healthInfo.blood_group || ''} onChange={e => setHealthInfo({ ...healthInfo, blood_group: e.target.value })} className="input" style={{ padding: '8px 10px', fontSize: 13 }}>
                    <option value="">Select</option>
                    {bloodGroups.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12 }}>Height (cm)</label>
                  <input type="number" value={healthInfo.height || ''} onChange={e => setHealthInfo({ ...healthInfo, height: e.target.value ? parseFloat(e.target.value) : null })} className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12 }}>Weight (kg)</label>
                  <input type="number" value={healthInfo.weight || ''} onChange={e => setHealthInfo({ ...healthInfo, weight: e.target.value ? parseFloat(e.target.value) : null })} className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
                {[
                  { key: 'diabetes', label: 'Diabetes' },
                  { key: 'hypertension', label: 'Hypertension' },
                  { key: 'smoker', label: 'Smoker' },
                  { key: 'alcohol', label: 'Alcohol' },
                ].map(cond => (
                  <label key={cond.key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                    <input type="checkbox" checked={healthInfo[cond.key] || false} onChange={e => setHealthInfo({ ...healthInfo, [cond.key]: e.target.checked })} />
                    {cond.label}
                  </label>
                ))}
              </div>
              <button onClick={handleSaveInfo} className="btn-primary" style={{ marginTop: 12, padding: '8px 20px', fontSize: 13 }}>Save</button>
            </div>

            {/* Upload Section */}
            <div style={{ margin: '16px 0', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowUpload(!showUpload)} className="btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>
                <Upload size={16} /> Upload Record
              </button>
            </div>

            {showUpload && (
              <div className="card p-5" style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, marginBottom: 12 }}>Upload New Record</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input placeholder="Record title (e.g., Blood Test Jan 2026)" value={uploadForm.title} onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })} className="input" />
                  <select value={uploadForm.recordType} onChange={e => setUploadForm({ ...uploadForm, recordType: e.target.value })} className="input">
                    {recordTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <textarea placeholder="Notes (optional)" value={uploadForm.notes} onChange={e => setUploadForm({ ...uploadForm, notes: e.target.value })} className="input" rows={2} style={{ resize: 'vertical' }} />
                  <button onClick={handleUpload} disabled={uploading || !uploadForm.title} className="btn btn-accent">
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </div>
            )}

            {/* Records List */}
            {records.length === 0 ? (
              <div className="card p-10 text-center">
                <FileText size={40} style={{ color: 'var(--text-light)', marginBottom: 12 }} />
                <p style={{ color: 'var(--text-light)' }}>No health records yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {records.map(rec => {
                  const Icon = getTypeIcon(rec.record_type);
                  return (
                    <div key={rec.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        <Icon size={20} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600 }}>{rec.title}</p>
                        <p style={{ fontSize: 12, color: 'var(--text-light)' }}>
                          {rec.record_type.replace('_', ' ')} — {new Date(rec.recorded_at).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <button onClick={() => handleDelete(rec.id)} style={{ color: 'var(--text-light)', padding: 6, background: 'none' }}>
                        <Trash size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
