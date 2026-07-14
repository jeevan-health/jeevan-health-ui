import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../../i18n/LanguageProvider';
import * as staffApplicationService from '../../services/staffApplicationService';
import { notify } from '../../lib/toastBus';

const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };
const inputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', background: '#fff' };
const sectionLabel = { fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, borderBottom: '1px solid #e2e8f0', paddingBottom: 6 };

function StatusBadge({ status }) {
  const styles = {
    new: { bg: '#fef3c7', color: '#92400e', label: 'New' },
    reviewed: { bg: '#dbeafe', color: '#1e40af', label: 'Reviewed' },
    shortlisted: { bg: '#dcfce7', color: '#166534', label: 'Shortlisted' },
    rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Rejected' },
  };
  const s = styles[status] || styles.new;
  return <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>;
}

function TypeBadge({ type }) {
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600,
      background: type === 'phlebotomist' ? '#ccfbf1' : '#f1f5f9',
      color: type === 'phlebotomist' ? '#0f766e' : '#475569',
    }}
    >
      {type === 'phlebotomist' ? '💉 Phlebotomist' : '🩺 Staff'}
    </span>
  );
}

function Row({ label, value }) {
  if (value == null || value === '') return null;
  return (
    <div style={{ fontSize: 13, padding: '5px 0', borderBottom: '1px solid #f8fafc' }}>
      <span style={{ color: '#64748b', minWidth: 140, display: 'inline-block' }}>{label}</span>
      <span style={{ color: '#0f172a', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export default function AdminStaffOnboarding() {
  const t = useT();
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewEntry, setViewEntry] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await staffApplicationService.listApplications({
        type: typeFilter === 'all' ? undefined : typeFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search || undefined,
        limit: 100,
      });
      setEntries(data.applications || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load applications from server');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, statusFilter, search]);

  useEffect(() => {
    const tmr = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(tmr);
  }, [load, search]);

  const openDetail = async (e) => {
    try {
      const { data } = await staffApplicationService.getApplication(e.id);
      setViewEntry(data);
    } catch {
      setViewEntry(e);
    }
  };

  const updateStatus = async (id, status) => {
    setBusy(true);
    try {
      const { data } = await staffApplicationService.updateApplication(id, { status });
      setViewEntry((prev) => (prev?.id === id ? { ...prev, ...data } : prev));
      await load();
      notify.success(`Status → ${status}`);
    } catch (err) {
      notify.error(err?.response?.data?.error || 'Update failed');
    } finally {
      setBusy(false);
    }
  };

  const promoteToRoster = async (e) => {
    setBusy(true);
    try {
      const { data } = await staffApplicationService.promoteToPhlebotomist(e.id);
      notify.success(
        data.alreadyPromoted
          ? `Already on roster as ${data.phlebotomist?.employeeId}`
          : `Added to roster: ${data.phlebotomist?.employeeId} — ${data.phlebotomist?.name}`
      );
      setViewEntry((prev) => (prev ? { ...prev, ...data.application, phlebotomistId: data.phlebotomist?.id } : prev));
      await load();
    } catch (err) {
      notify.error(err?.response?.data?.error || 'Could not promote to roster');
    } finally {
      setBusy(false);
    }
  };

  const downloadFile = async (appId, fileKey, fileName) => {
    try {
      const { data } = await staffApplicationService.downloadApplicationFile(appId, fileKey);
      if (!data.dataBase64) {
        notify.warning('File content not available');
        return;
      }
      const byteChars = atob(data.dataBase64);
      const bytes = new Uint8Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);
      const blob = new Blob([bytes], { type: data.mimeType || 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.name || fileName || 'download';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      notify.error('Download failed');
    }
  };

  if (viewEntry) {
    const e = viewEntry;
    const d = e.data || {};
    const isPhlebo = (e.applicationType || e.application_type) === 'phlebotomist';
    const present = d.presentAddress || e.presentAddress || {};
    const permanent = d.permanentAddress || e.permanentAddress || {};
    const files = e.files || [];

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <button type="button" onClick={() => setViewEntry(null)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b' }}>← Back to List</button>
          <div style={{ flex: 1 }} />
          <TypeBadge type={e.applicationType || 'staff'} />
          <StatusBadge status={e.status} />
          <div style={{ fontSize: 12, color: '#64748b' }}>
            #{e.id} · {e.submittedAt || e.createdAt ? new Date(e.submittedAt || e.createdAt).toLocaleString() : ''}
          </div>
        </div>

        <div style={card}>
          <div style={sectionLabel}>Personal</div>
          <Row label="Name" value={e.fullName || e.name || d.fullName} />
          <Row label="DOB / Age" value={[e.dob || d.dob, (e.age || d.age) ? `${e.age || d.age} yrs` : ''].filter(Boolean).join(' · ')} />
          <Row label="Gender" value={e.gender || d.gender} />
          <Row label="Marital Status" value={e.maritalStatus || d.maritalStatus} />
          <Row label="Mobile" value={e.phone || e.mobile || d.phone} />
          <Row label="Email" value={e.email || d.email} />
          <Row label="Aadhaar" value={e.aadhaar || d.aadhaar} />
        </div>

        <div style={card}>
          <div style={sectionLabel}>Qualifications &amp; experience</div>
          <Row label="Education" value={e.education || d.education || e.qualification} />
          <Row label="Paramedical Reg" value={d.paramedicalRegNo || d.regNumber} />
          <Row label="Work Experience" value={d.workExperience || d.experience || e.experience} />
          <Row label="Vacutainer method" value={d.vacutainerMethod} />
        </div>

        <div style={card}>
          <div style={sectionLabel}>Job preference</div>
          <Row label="Preferred jobs" value={(d.preferredJobs || d.services || e.preferredJobs || []).join?.(', ') || (d.preferredJobs || []).toString()} />
          <Row label="Preferred area" value={e.preferredLocation || d.preferredLocation || e.workAreas} />
          <Row label="PIN" value={e.preferredPincode || d.preferredPincode} />
          <Row label="Driving license" value={d.drivingLicense} />
          <Row label="Owns 2-wheeler" value={d.ownsTwoWheeler} />
          <Row label="Vehicle reg" value={d.vehicleRegNo} />
          <Row label="References" value={d.references} />
          <Row label="Feedback" value={d.feedback} />
        </div>

        <div style={card}>
          <div style={sectionLabel}>Address</div>
          <Row label="Present" value={[present.house, present.street, present.area, present.district, present.state, present.pincode].filter(Boolean).join(', ') || d.address || e.address} />
          <Row label="Permanent" value={[permanent.house, permanent.street, permanent.area, permanent.district, permanent.state, permanent.pincode].filter(Boolean).join(', ')} />
        </div>

        {files.length > 0 && (
          <div style={card}>
            <div style={sectionLabel}>Uploaded documents (server)</div>
            {files.map((f) => (
              <div key={f.key || f.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: 13 }}>
                <span>
                  <strong style={{ textTransform: 'capitalize' }}>{f.key}</strong>
                  {' — '}
                  {f.name}
                  <span style={{ color: '#94a3b8', marginLeft: 6 }}>({Math.round((f.size || 0) / 1024)} KB)</span>
                </span>
                {f.hasData !== false && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => downloadFile(e.id, f.key, f.name)}
                    style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #0d9488', background: '#fff', color: '#0d9488', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', fontWeight: 600 }}
                  >
                    Download
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {e.phlebotomistId && (
          <div style={{ ...card, background: '#f0fdfa', borderColor: '#99f6e4' }}>
            <div style={{ fontSize: 13, color: '#0f766e', fontWeight: 600 }}>
              ✓ On phlebotomist roster (id #{e.phlebotomistId})
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {isPhlebo && (
            <button
              type="button"
              disabled={busy}
              onClick={() => promoteToRoster(e)}
              style={{
                padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0d9488',
                color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600,
              }}
            >
              ✓ Shortlist + Add to Phlebotomist roster
            </button>
          )}
          {['new', 'reviewed', 'shortlisted', 'rejected'].map((s) => (
            <button
              key={s}
              type="button"
              disabled={busy}
              onClick={() => updateStatus(e.id, s)}
              style={{
                padding: '8px 16px', borderRadius: 8, border: 'none',
                background: e.status === s ? (s === 'rejected' ? '#ef4444' : s === 'shortlisted' ? '#22c55e' : s === 'reviewed' ? '#3b82f6' : '#f59e0b') : '#f1f5f9',
                color: e.status === s ? '#fff' : '#475569', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600,
              }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        {isPhlebo && (
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 12 }}>
            Roster ops also at <Link to="/admin/collection" style={{ color: '#0d9488' }}>Admin → Phlebotomists</Link>
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
            {t('admin.staffOnboarding.title', '📋 Staff / Phlebo Onboarding')} ({total})
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
            Production queue (Neon) · Public form:{' '}
            <Link to="/onboarding-phlebotomist" target="_blank" style={{ color: '#0d9488' }}>/onboarding-phlebotomist</Link>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...inputStyle, width: 180, fontSize: 12 }} placeholder="🔍 Search..." />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ ...inputStyle, width: 140, fontSize: 12 }}>
            <option value="all">All types</option>
            <option value="phlebotomist">Phlebotomist</option>
            <option value="staff">Other staff</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ ...inputStyle, width: 130, fontSize: 12 }}>
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
          </select>
          <button type="button" onClick={load} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
            Refresh
          </button>
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Loading applications…</div>}
      {error && !loading && <div style={{ textAlign: 'center', padding: 24, color: '#dc2626', fontSize: 13 }}>{error}</div>}
      {!loading && !error && entries.length === 0 && (
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 40 }}>No applications yet.</p>
      )}

      {!loading && entries.map((e) => (
        <div
          key={e.id}
          style={{ ...card, cursor: 'pointer' }}
          onClick={() => openDetail(e)}
          onKeyDown={(ev) => ev.key === 'Enter' && openDetail(e)}
          role="button"
          tabIndex={0}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: e.applicationType === 'phlebotomist' ? '#0d9488' : '#0f172a',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 700, flexShrink: 0,
              }}
              >
                {(e.fullName || e.name || '?')[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  {e.fullName || e.name}
                  <TypeBadge type={e.applicationType || 'staff'} />
                  <StatusBadge status={e.status} />
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
                  #{e.id} | {e.phone || e.mobile} | {e.email}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>
                  {e.preferredLocation || e.education || e.role || '—'}
                  {e.phlebotomistId ? ' · On roster' : ''}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right', whiteSpace: 'nowrap' }}>
              {e.createdAt || e.submittedAt ? new Date(e.createdAt || e.submittedAt).toLocaleDateString() : ''}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
