import { useState, useMemo } from 'react';
import useStaffStore from '../../stores/staffStore';

const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };
const inputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', background: '#fff' };
const sectionLabel = { fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, borderBottom: '1px solid #e2e8f0', paddingBottom: 6 };

const SECTION_LABELS = {
  basic: 'Basic Information',
  qualifications: 'Educational & Professional Qualifications',
  preferences: 'Service Preferences & Availability',
  bank: 'Bank Details',
  declaration: 'Declaration & Consent',
};

export default function AdminStaffOnboarding() {
  const entries = useStaffStore(s => s.entries);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewEntry, setViewEntry] = useState(null);

  const filtered = useMemo(() => {
    let d = entries;
    if (search) { const q = search.toLowerCase(); d = d.filter(e => (e.name + e.mobile + e.email + e.role + e.id).toLowerCase().includes(q)); }
    if (statusFilter === 'new') d = d.filter(e => !e.status || e.status === 'new');
    else if (statusFilter === 'reviewed') d = d.filter(e => e.status === 'reviewed');
    else if (statusFilter === 'shortlisted') d = d.filter(e => e.status === 'shortlisted');
    else if (statusFilter === 'rejected') d = d.filter(e => e.status === 'rejected');
    return d;
  }, [entries, search, statusFilter]);

  const updateStatus = (id, status) => {
    const all = useStaffStore.getState().entries;
    const updated = all.map(e => e.id === id ? { ...e, status, reviewedAt: new Date().toISOString() } : e);
    localStorage.setItem('jh_staff_onboarding', JSON.stringify(updated));
    useStaffStore.setState({ entries: updated });
    if (viewEntry?.id === id) setViewEntry({ ...viewEntry, status, reviewedAt: new Date().toISOString() });
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      new: { bg: '#fef3c7', color: '#92400e', label: 'New' },
      reviewed: { bg: '#dbeafe', color: '#1e40af', label: 'Reviewed' },
      shortlisted: { bg: '#dcfce7', color: '#166534', label: 'Shortlisted' },
      rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Rejected' },
    };
    const s = styles[status] || styles.new;
    return <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 10, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>;
  };

  // Detail view
  if (viewEntry) {
    const e = viewEntry;
    const Row = ({ label, value }) => value ? <div style={{ fontSize: 13, padding: '5px 0', borderBottom: '1px solid #f8fafc' }}><span style={{ color: '#64748b', minWidth: 120, display: 'inline-block' }}>{label}</span><span style={{ color: '#0f172a', fontWeight: 500 }}>{value}</span></div> : null;

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <button onClick={() => setViewEntry(null)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b' }}>← Back to List</button>
          <div style={{ flex: 1 }} />
          <StatusBadge status={e.status} />
          <div style={{ fontSize: 12, color: '#64748b' }}>{new Date(e.submittedAt).toLocaleString()}</div>
        </div>

        {/* Basic Info */}
        <div style={card}>
          <div style={sectionLabel}>{SECTION_LABELS.basic}</div>
          <Row label="Name" value={e.name} />
          <Row label="Gender" value={e.gender} />
          <Row label="DOB" value={e.dob} />
          <Row label="Mobile" value={e.mobile} />
          <Row label="Alt Phone" value={e.altPhone} />
          <Row label="Email" value={e.email} />
          <Row label="Address" value={e.address} />
          <Row label="City" value={e.city} />
          <Row label="State" value={e.state} />
          <Row label="PIN" value={e.pincode} />
        </div>

        {/* Qualifications */}
        <div style={card}>
          <div style={sectionLabel}>{SECTION_LABELS.qualifications}</div>
          <Row label="Role" value={e.role} />
          {e.roleOther && <Row label="Role (Other)" value={e.roleOther} />}
          <Row label="Qualification" value={e.qualification} />
          <Row label="Course" value={e.course} />
          <Row label="University" value={e.university} />
          <Row label="Year" value={e.yearPassing} />
          <Row label="Certificate" value={e.certificate} />
          <Row label="Council" value={e.council} />
          {e.councilOther && <Row label="Council (Other)" value={e.councilOther} />}
          <Row label="Reg Number" value={e.regNumber} />
          <Row label="Certificate Upload" value={e.certificate2} />
          <Row label="Experience" value={e.experience} />
          <Row label="Workplaces" value={e.workplaces} />
          <Row label="Home Care Exp" value={e.homeCare} />
          <Row label="Exp Certificate" value={e.experienceCert} />
          <Row label="Languages" value={(e.languages || []).join(', ')} />
        </div>

        {/* Preferences */}
        <div style={card}>
          <div style={sectionLabel}>{SECTION_LABELS.preferences}</div>
          <Row label="Services" value={(e.services || []).join(', ')} />
          <Row label="Engagement" value={e.engagement} />
          <Row label="Shift" value={e.shift} />
          <Row label="Areas" value={e.workAreas} />
          <Row label="PIN Codes" value={e.workPincodes} />
        </div>

        {/* Bank Details */}
        <div style={card}>
          <div style={sectionLabel}>{SECTION_LABELS.bank}</div>
          <Row label="Account Holder" value={e.accHolder} />
          <Row label="Bank Name" value={e.bankName} />
          <Row label="IFSC" value={e.ifsc} />
          <Row label="Account Number" value={e.accNumber} />
          <Row label="Account Type" value={e.accType} />
          <Row label="Cheque Upload" value={e.chequeUpload} />
          <Row label="ID Type" value={e.idType} />
          <Row label="ID Number" value={e.idNumber} />
          <Row label="ID Upload" value={e.idUpload} />
          <Row label="Photo" value={e.photo} />
        </div>

        {/* Declaration */}
        <div style={card}>
          <div style={sectionLabel}>{SECTION_LABELS.declaration}</div>
          <Row label="Agreed" value={e.agree ? 'Yes' : 'No'} />
          <Row label="Digital Signature" value={e.signature} />
          <Row label="Submitted At" value={new Date(e.submittedAt).toLocaleString()} />
        </div>

        {/* Status Actions */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          {['new', 'reviewed', 'shortlisted', 'rejected'].map(s => (
            <button key={s} onClick={() => updateStatus(e.id, s)} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: e.status === s ? (s === 'rejected' ? '#ef4444' : s === 'shortlisted' ? '#22c55e' : s === 'reviewed' ? '#3b82f6' : '#f59e0b') : '#f1f5f9',
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
        <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>📋 Staff Onboarding ({entries.length})</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, width: 200, fontSize: 12 }} placeholder="🔍 Search name/phone/role..." />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputStyle, width: 130, fontSize: 12 }}>
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
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
                  {e.name}
                  <StatusBadge status={e.status} />
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
                  {e.role} | {e.mobile} | {e.email}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>
                  {e.city}, {e.state} | {e.engagement} | {e.experience} exp
                </div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right', whiteSpace: 'nowrap' }}>
              {new Date(e.submittedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}