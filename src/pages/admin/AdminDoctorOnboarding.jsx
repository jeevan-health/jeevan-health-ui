import { useState, useMemo } from 'react';
import useDoctorOnboardingStore from '../../stores/doctorOnboardingStore';

const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };
const inputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', background: '#fff' };
const sectionLabel = { fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, borderBottom: '1px solid #e2e8f0', paddingBottom: 6 };

const LABELS = ['Basic Information', 'Professional Details', 'Availability & Consultation Mode', 'Charges & Bank Details', 'Declaration & Consent'];

export default function AdminDoctorOnboarding() {
  const entries = useDoctorOnboardingStore(s => s.entries);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewEntry, setViewEntry] = useState(null);

  const filtered = useMemo(() => {
    let d = entries;
    if (search) { const q = search.toLowerCase(); d = d.filter(e => (e.name + e.mobile + e.email + e.specialization + e.id).toLowerCase().includes(q)); }
    if (statusFilter === 'new') d = d.filter(e => !e.status || e.status === 'new');
    else if (statusFilter === 'reviewed') d = d.filter(e => e.status === 'reviewed');
    else if (statusFilter === 'approved') d = d.filter(e => e.status === 'approved');
    else if (statusFilter === 'rejected') d = d.filter(e => e.status === 'rejected');
    return d;
  }, [entries, search, statusFilter]);

  const updateStatus = (id, status) => {
    const all = useDoctorOnboardingStore.getState().entries;
    const updated = all.map(e => e.id === id ? { ...e, status, reviewedAt: new Date().toISOString() } : e);
    localStorage.setItem('jh_doctor_onboarding', JSON.stringify(updated));
    useDoctorOnboardingStore.setState({ entries: updated });
    if (viewEntry?.id === id) setViewEntry({ ...viewEntry, status, reviewedAt: new Date().toISOString() });
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      new: { bg: '#fef3c7', color: '#92400e', label: 'New' },
      reviewed: { bg: '#dbeafe', color: '#1e40af', label: 'Reviewed' },
      approved: { bg: '#dcfce7', color: '#166534', label: 'Approved' },
      rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Rejected' },
    };
    const s = styles[status] || styles.new;
    return <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>;
  };

  if (viewEntry) {
    const e = viewEntry;
    const Row = ({ label, value }) => value ? <div style={{ fontSize: 13, padding: '5px 0', borderBottom: '1px solid #f8fafc' }}><span style={{ color: '#64748b', minWidth: 130, display: 'inline-block' }}>{label}</span><span style={{ color: '#0f172a', fontWeight: 500 }}>{Array.isArray(value) ? value.join(', ') : value}</span></div> : null;

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <button onClick={() => setViewEntry(null)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b' }}>← Back</button>
          <div style={{ flex: 1 }} />
          <StatusBadge status={e.status} />
          <div style={{ fontSize: 12, color: '#64748b' }}>{new Date(e.submittedAt).toLocaleString()}</div>
        </div>

        <div style={card}><div style={sectionLabel}>{LABELS[0]}</div>
          <Row label="Name" value={e.name} /><Row label="Gender" value={e.gender} /><Row label="DOB" value={e.dob} />
          <Row label="Mobile" value={e.mobile} /><Row label="Alt Phone" value={e.altPhone} /><Row label="Email" value={e.email} /><Row label="Address" value={e.address} />
        </div>
        <div style={card}><div style={sectionLabel}>{LABELS[1]}</div>
          <Row label="Qualification" value={e.qualification} /><Row label="Specialization" value={e.specialization} />
          {e.specOther && <Row label="Spec (Other)" value={e.specOther} />}<Row label="Experience" value={e.experience} />
          <Row label="Reg Number" value={e.regNumber} /><Row label="Council" value={e.council} />
          <Row label="Degree Upload" value={e.degreeUpload} /><Row label="Reg Upload" value={e.regUpload} />
        </div>
        <div style={card}><div style={sectionLabel}>{LABELS[2]}</div>
          <Row label="Consult Modes" value={e.modes} /><Row label="Days" value={e.days} /><Row label="Slots" value={e.slots} />
          <Row label="Home Visits" value={e.homeVisits} /><Row label="Home Areas" value={e.homeAreas} />
        </div>
        <div style={card}><div style={sectionLabel}>{LABELS[3]}</div>
          <Row label="Online Fee" value={e.onlineFee ? `₹${e.onlineFee}` : ''} /><Row label="Clinic Fee" value={e.clinicFee ? `₹${e.clinicFee}` : ''} />
          <Row label="Home Visit Fee" value={e.homeFee ? `₹${e.homeFee}` : ''} /><Row label="Account Holder" value={e.accHolder} />
          <Row label="Bank Name" value={e.bankName} /><Row label="Account Number" value={e.accNumber} /><Row label="IFSC" value={e.ifsc} />
          <Row label="Cheque Upload" value={e.chequeUpload} />
        </div>
        <div style={card}><div style={sectionLabel}>{LABELS[4]}</div>
          <Row label="Agreed" value={e.agree ? 'Yes' : 'No'} /><Row label="Signature" value={e.signature} />
          <Row label="Submitted At" value={new Date(e.submittedAt).toLocaleString()} />
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          {['new', 'reviewed', 'approved', 'rejected'].map(s => (
            <button key={s} onClick={() => updateStatus(e.id, s)} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: e.status === s ? (s === 'rejected' ? '#ef4444' : s === 'approved' ? '#22c55e' : s === 'reviewed' ? '#3b82f6' : '#f59e0b') : '#f1f5f9',
              color: e.status === s ? '#fff' : '#475569', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600,
            }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>🩺 Doctor Onboarding ({entries.length})</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: 200, fontSize: 12 }} placeholder="🔍 Search name/spec/phone..." />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputStyle, width: 130, fontSize: 12 }}>
            <option value="all">All Status</option><option value="new">New</option><option value="reviewed">Reviewed</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      {filtered.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 40 }}>No applications found.</p>}
      {filtered.map(e => (
        <div key={e.id} style={{ ...card, cursor: 'pointer' }} onClick={() => setViewEntry(e)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, flexShrink: 0 }}>{(e.name || '?')[0]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  {e.name} <StatusBadge status={e.status} />
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{e.specialization} | {e.qualification} | {e.experience} yrs | {e.mobile}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{e.email} | ₹{e.onlineFee}/consult</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right', whiteSpace: 'nowrap' }}>{new Date(e.submittedAt).toLocaleDateString()}</div>
          </div>
        </div>
      ))}
    </div>
  );
}