import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../../i18n/LanguageProvider';
import useStaffStore from '../../stores/staffStore';
import { savePhlebotomist, getPhlebotomists } from '../../services/localOrderService';
import { notify } from '../../lib/toastBus';

const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };
const inputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', background: '#fff' };
const sectionLabel = { fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, borderBottom: '1px solid #e2e8f0', paddingBottom: 6 };

const SECTION_LABELS = {
  basic: 'Basic Information',
  qualifications: 'Educational & Professional Qualifications',
  preferences: 'Service Preferences & Availability',
  bank: 'Bank Details',
  declaration: 'Declaration & Consent',
  phleboPersonal: 'Phlebotomist — Personal',
  phleboDocs: 'Phlebotomist — Documents & skills',
  phleboJob: 'Phlebotomist — Job preference',
  phleboAddress: 'Phlebotomist — Address',
};

function FileLink({ meta, label }) {
  if (!meta?.name) return null;
  if (meta.dataUrl) {
    return (
      <div style={{ fontSize: 13, padding: '5px 0', borderBottom: '1px solid #f8fafc' }}>
        <span style={{ color: '#64748b', minWidth: 140, display: 'inline-block' }}>{label}</span>
        <a href={meta.dataUrl} download={meta.name} style={{ color: '#0d9488', fontWeight: 600, fontSize: 12 }}>
          📎 {meta.name}
        </a>
      </div>
    );
  }
  return (
    <div style={{ fontSize: 13, padding: '5px 0', borderBottom: '1px solid #f8fafc' }}>
      <span style={{ color: '#64748b', minWidth: 140, display: 'inline-block' }}>{label}</span>
      <span style={{ color: '#0f172a', fontWeight: 500 }}>{meta.name}{meta.note ? ` (${meta.note})` : ''}</span>
    </div>
  );
}

export default function AdminStaffOnboarding() {
  const t = useT();
  const entries = useStaffStore((s) => s.entries);
  const updateEntry = useStaffStore((s) => s.updateEntry);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewEntry, setViewEntry] = useState(null);

  const filtered = useMemo(() => {
    let d = entries;
    if (typeFilter === 'phlebotomist') d = d.filter((e) => e.applicationType === 'phlebotomist');
    else if (typeFilter === 'staff') d = d.filter((e) => e.applicationType !== 'phlebotomist');
    if (search) {
      const q = search.toLowerCase();
      d = d.filter((e) => (e.name + e.mobile + e.phone + e.email + e.role + e.id + (e.preferredLocation || '')).toLowerCase().includes(q));
    }
    if (statusFilter === 'new') d = d.filter((e) => !e.status || e.status === 'new');
    else if (statusFilter === 'reviewed') d = d.filter((e) => e.status === 'reviewed');
    else if (statusFilter === 'shortlisted') d = d.filter((e) => e.status === 'shortlisted');
    else if (statusFilter === 'rejected') d = d.filter((e) => e.status === 'rejected');
    return d;
  }, [entries, search, statusFilter, typeFilter]);

  const phleboCount = entries.filter((e) => e.applicationType === 'phlebotomist').length;

  const updateStatus = (id, status) => {
    const updated = updateEntry(id, { status });
    if (viewEntry?.id === id && updated) setViewEntry(updated);
  };

  const promoteToRoster = (e) => {
    if (e.applicationType !== 'phlebotomist') return;
    const list = getPhlebotomists();
    const phone = e.mobile || e.phone || '';
    if (list.some((p) => p.phone === phone && phone)) {
      notify.warning('A phlebotomist with this phone already exists in the roster');
      return;
    }
    const autoId = 'PHB' + String(list.length + 1).padStart(5, '0');
    const present = e.presentAddress || {};
    savePhlebotomist({
      id: autoId,
      employeeId: autoId,
      name: e.name || e.fullName,
      phone,
      email: e.email || '',
      gender: e.gender || '',
      dateOfBirth: e.dob || '',
      qualification: e.education || e.qualification || '',
      experience: e.workExperience || e.experience || '',
      aadhaar: e.aadhaar || '',
      drivingLicense: e.drivingLicense || '',
      vehicleNumber: e.vehicleRegNo || '',
      transportType: e.ownsTwoWheeler === 'Yes' ? 'Bike' : '',
      areas: e.preferredLocation || e.workAreas || '',
      preferredWorkingAreas: e.preferredLocation || '',
      status: 'available',
      employmentType: (e.preferredJobs || []).includes('Home Sample Collection') ? 'Full Time' : 'Part Time',
      joiningDate: new Date().toISOString().slice(0, 10),
      backgroundVerification: 'Pending',
      bankAccountHolder: e.accHolder || e.name || '',
      notes: `Onboarded from application ${e.id}. Jobs: ${(e.preferredJobs || []).join(', ')}. Vacutainer: ${e.vacutainerMethod || '—'}. Refs: ${e.references || '—'}`,
      address: e.address || [present.house, present.street, present.area, present.district, present.state, present.pincode].filter(Boolean).join(', '),
      onboardingId: e.id,
      createdAt: new Date().toISOString(),
    });
    updateStatus(e.id, 'shortlisted');
    notify.success(`Added ${e.name} to Phlebotomists roster (${autoId})`);
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

  const TypeBadge = ({ type }) => (
    <span style={{
      padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600,
      background: type === 'phlebotomist' ? '#ccfbf1' : '#f1f5f9',
      color: type === 'phlebotomist' ? '#0f766e' : '#475569',
    }}
    >
      {type === 'phlebotomist' ? '💉 Phlebotomist' : '🩺 Staff'}
    </span>
  );

  // Detail view
  if (viewEntry) {
    const e = viewEntry;
    const isPhlebo = e.applicationType === 'phlebotomist';
    const Row = ({ label, value }) => (value ? (
      <div style={{ fontSize: 13, padding: '5px 0', borderBottom: '1px solid #f8fafc' }}>
        <span style={{ color: '#64748b', minWidth: 140, display: 'inline-block' }}>{label}</span>
        <span style={{ color: '#0f172a', fontWeight: 500 }}>{value}</span>
      </div>
    ) : null);
    const present = e.presentAddress || {};
    const permanent = e.permanentAddress || {};

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <button type="button" onClick={() => setViewEntry(null)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b' }}>← Back to List</button>
          <div style={{ flex: 1 }} />
          <TypeBadge type={e.applicationType || 'staff'} />
          <StatusBadge status={e.status} />
          <div style={{ fontSize: 12, color: '#64748b' }}>{new Date(e.submittedAt).toLocaleString()}</div>
        </div>

        {isPhlebo ? (
          <>
            <div style={card}>
              <div style={sectionLabel}>{SECTION_LABELS.phleboPersonal}</div>
              <Row label="Name" value={e.name || e.fullName} />
              <Row label="DOB / Age" value={[e.dob, e.age ? `${e.age} yrs` : ''].filter(Boolean).join(' · ')} />
              <Row label="Gender" value={e.gender} />
              <Row label="Marital Status" value={e.maritalStatus} />
              <Row label="Mobile" value={e.mobile || e.phone} />
              <Row label="Email" value={e.email} />
              <Row label="Aadhaar" value={e.aadhaar} />
              <FileLink label="Aadhaar file" meta={e.aadhaarFile} />
            </div>
            <div style={card}>
              <div style={sectionLabel}>{SECTION_LABELS.phleboDocs}</div>
              <Row label="Education" value={e.education || e.qualification} />
              <FileLink label="Certificates" meta={e.certificateFile} />
              <Row label="Paramedical Reg No" value={e.paramedicalRegNo || e.regNumber} />
              <FileLink label="Paramedical cert" meta={e.paramedicalCertFile} />
              <Row label="Work Experience" value={e.workExperience || e.experience} />
              <FileLink label="Resume / CV" meta={e.resumeFile} />
              <Row label="Vacutainer method" value={e.vacutainerMethod} />
            </div>
            <div style={card}>
              <div style={sectionLabel}>{SECTION_LABELS.phleboJob}</div>
              <Row label="Preferred jobs" value={(e.preferredJobs || e.services || []).join(', ')} />
              <Row label="Preferred area" value={e.preferredLocation || e.workAreas} />
              <Row label="PIN" value={e.preferredPincode || e.workPincodes} />
              <Row label="Driving license" value={e.drivingLicense} />
              <Row label="Owns 2-wheeler" value={e.ownsTwoWheeler} />
              <Row label="Vehicle reg" value={e.vehicleRegNo} />
              <Row label="References" value={e.references} />
              <Row label="Feedback" value={e.feedback} />
            </div>
            <div style={card}>
              <div style={sectionLabel}>{SECTION_LABELS.phleboAddress}</div>
              <Row label="Present" value={[present.house, present.street, present.area, present.district, present.state, present.pincode].filter(Boolean).join(', ') || e.address} />
              <Row label="Permanent" value={[permanent.house, permanent.street, permanent.area, permanent.district, permanent.state, permanent.pincode].filter(Boolean).join(', ')} />
            </div>
          </>
        ) : (
          <>
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
            <div style={card}>
              <div style={sectionLabel}>{SECTION_LABELS.preferences}</div>
              <Row label="Services" value={(e.services || []).join(', ')} />
              <Row label="Engagement" value={e.engagement} />
              <Row label="Shift" value={e.shift} />
              <Row label="Areas" value={e.workAreas} />
              <Row label="PIN Codes" value={e.workPincodes} />
            </div>
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
            <div style={card}>
              <div style={sectionLabel}>{SECTION_LABELS.declaration}</div>
              <Row label="Agreed" value={e.agree ? 'Yes' : 'No'} />
              <Row label="Digital Signature" value={e.signature} />
              <Row label="Submitted At" value={new Date(e.submittedAt).toLocaleString()} />
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {isPhlebo && (
            <button
              type="button"
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
            After adding to roster, manage ops at{' '}
            <Link to="/admin/collection" style={{ color: '#0d9488' }}>Admin → Phlebotomists</Link>
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
            {t('admin.staffOnboarding.title', '📋 Staff Onboarding')} ({entries.length})
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
            Phlebotomist applications: {phleboCount} · Public form:{' '}
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
        </div>
      </div>

      {filtered.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, padding: 40 }}>No applications found.</p>}

      {filtered.map((e) => (
        <div key={e.id} style={{ ...card, cursor: 'pointer' }} onClick={() => setViewEntry(e)} onKeyDown={(ev) => ev.key === 'Enter' && setViewEntry(e)} role="button" tabIndex={0}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: e.applicationType === 'phlebotomist' ? '#0d9488' : '#0f172a',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 700, flexShrink: 0,
              }}
              >
                {(e.name || '?')[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  {e.name}
                  <TypeBadge type={e.applicationType || 'staff'} />
                  <StatusBadge status={e.status} />
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>
                  {e.role || '—'} | {e.mobile || e.phone} | {e.email}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>
                  {e.applicationType === 'phlebotomist'
                    ? `${e.preferredLocation || e.city || '—'} · ${(e.preferredJobs || []).join(', ') || e.education || ''}`
                    : `${e.city || ''}, ${e.state || ''} | ${e.engagement || ''} | ${e.experience || ''} exp`}
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
