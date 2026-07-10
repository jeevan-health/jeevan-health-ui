import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { vaccines } from '../data/vaccinationData';
import { getPendingNotifications, getWALink, markNotificationSent, clearNotifications } from '../services/waService';

const FAMILY_KEY = 'jh_vaccination_family';
const BOOKINGS_KEY = 'jh_vaccination_bookings';

function downloadReceipt(booking) {
  const receipt = `
JEEVAN HEALTHCARE - VACCINATION RECEIPT
=========================================
Booking ID:     ${booking.id}
Patient:        ${booking.patientName || booking.name || '-'}
Vaccine:        ${booking.vaccineName || booking.vaccine || '-'}
Date:           ${booking.appointmentDate || booking.date || '-'}
Time:           ${booking.appointmentSlot || '-'}
Service:        ${booking.serviceType === 'home' ? 'Home Vaccination' : 'Clinic Visit'}
Amount:         ₹${booking.vaccinePrice || 0}
Status:         ${booking.status}
Date of Issue:  ${new Date().toLocaleDateString('en-IN')}
=========================================
Jeevan HealthCare at Home
www.jeevanhealthcare.com
  `.trim();
  const blob = new Blob([receipt], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `vaccination-receipt-${booking.id}.txt`;
  a.click(); URL.revokeObjectURL(url);
}

function generateCertificate(booking) {
  const cert = `
══════════════════════════════════════════════
         JEEVAN HEALTHCARE
   VACCINATION CERTIFICATE
══════════════════════════════════════════════

Certificate ID:  JHC-VAC-${booking.id}

This is to certify that

   ${booking.patientName || booking.name || 'Patient'}

has been vaccinated with

   ${booking.vaccineName || booking.vaccine || 'Vaccine'}

Date of Vaccination:  ${booking.appointmentDate || booking.date || '-'}
Service Type:         ${booking.serviceType === 'home' ? 'Home Vaccination' : 'Clinic Visit'}
Booking Reference:    ${booking.id}

                         Authorized Signatory
                         Jeevan HealthCare at Home

──────────────────────────────────────────────
Verified at: www.jeevanhealthcare.com/verify
  `.trim();
  const blob = new Blob([cert], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `vaccination-certificate-${booking.id}.txt`;
  a.click(); URL.revokeObjectURL(url);
}

export default function VaccineWallet() {
  const [activeTab, setActiveTab] = useState('records');
  const [family, setFamily] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', dob: '', gender: '', relation: '' });

  useEffect(() => {
    try { setFamily(JSON.parse(localStorage.getItem(FAMILY_KEY) || '[]')); } catch { setFamily([]); }
    try { setBookings(JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]')); } catch { setBookings([]); }
    setNotifications(getPendingNotifications());
  }, []);

  const refreshNotifs = () => setNotifications(getPendingNotifications());

  const saveFamily = (list) => {
    setFamily(list);
    localStorage.setItem(FAMILY_KEY, JSON.stringify(list));
  };

  const addMember = () => {
    if (!newMember.name || !newMember.dob) return;
    const member = { ...newMember, id: 'fam-' + Date.now().toString(36) };
    saveFamily([...family, member]);
    setNewMember({ name: '', dob: '', gender: '', relation: '' });
    setShowAddMember(false);
  };

  const removeMember = (id) => {
    if (!confirm(`Remove ${family.find(m => m.id === id)?.name}?`)) return;
    saveFamily(family.filter(m => m.id !== id));
  };

  const confirmedBookings = useMemo(() => {
    return bookings.filter(b => b.status === 'Confirmed' || b.status === 'Quick Request');
  }, [bookings]);

  const dueVaccines = useMemo(() => {
    const takenNames = new Set(confirmedBookings.map(b => (b.vaccineName || b.vaccine).toLowerCase()));
    return vaccines.filter(v => !takenNames.has(v.name.toLowerCase())).slice(0, 6);
  }, [confirmedBookings]);

  return (
    <div className="page-section container" style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: 28 }}>💉</span>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#0f172a' }}>My Vaccine Wallet</h1>
          <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>Your family's vaccination records in one place</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #e2e8f0', marginBottom: 16, overflowX: 'auto' }}>
        {[
          { id: 'records', label: 'Vaccination Records', icon: '📋' },
          { id: 'family', label: 'Family Members', icon: '👨‍👩‍👧' },
          { id: 'due', label: 'Due Vaccines', icon: '🔔' },
          { id: 'notifications', label: `Notifications (${notifications.filter(n => !n.sent).length})`, icon: '💬' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', color: activeTab === tab.id ? '#2563eb' : '#64748b', borderBottom: activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent', whiteSpace: 'nowrap' }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* RECORDS TAB */}
      {activeTab === 'records' && (
        <div>
          {confirmedBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>💉</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>No Vaccination Records Yet</h3>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Book your first vaccination to start maintaining your digital records.</p>
              <Link to="/vaccination" style={{ height: 44, padding: '0 24px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Browse Vaccines</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {confirmedBookings.slice().reverse().map(b => (
                <div key={b.id} style={{ padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: 16 }}>💉</span>
                        <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#0f172a' }}>{b.vaccineName || b.vaccine}</h4>
                        <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: '#dcfce7', color: '#166534' }}>{b.status}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#64748b', flexWrap: 'wrap' }}>
                        <span>👤 {b.patientName || b.name || '-'}</span>
                        <span>📅 {b.appointmentDate || b.date || '-'}</span>
                        {b.appointmentSlot && <span>⏰ {b.appointmentSlot}</span>}
                        <span>🏠 {b.serviceType === 'home' ? 'Home' : 'Clinic'}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => downloadReceipt(b)}
                        style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer', fontSize: 10, fontWeight: 600, fontFamily: 'inherit', color: '#475569' }}>📄 Receipt</button>
                      <button onClick={() => generateCertificate(b)}
                        style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontSize: 10, fontWeight: 600, fontFamily: 'inherit' }}>🎓 Certificate</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FAMILY TAB */}
      {activeTab === 'family' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Manage vaccination records for your family members</p>
            <button onClick={() => setShowAddMember(true)}
              style={{ height: 36, padding: '0 14px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>+ Add Member</button>
          </div>
          {showAddMember && (
            <div style={{ padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', marginBottom: 12 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 10px', color: '#0f172a' }}>Add Family Member</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 2 }}>Name *</label><input value={newMember.name} onChange={e => setNewMember(f => ({ ...f, name: e.target.value }))} placeholder="Full name" style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} /></div>
                <div><label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 2 }}>Date of Birth *</label><input type="date" value={newMember.dob} onChange={e => setNewMember(f => ({ ...f, dob: e.target.value }))} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} /></div>
                <div><label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 2 }}>Gender</label><select value={newMember.gender} onChange={e => setNewMember(f => ({ ...f, gender: e.target.value }))} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}><option value="">Select</option><option value="male">Male</option><option value="female">Female</option></select></div>
                <div><label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 2 }}>Relation</label><select value={newMember.relation} onChange={e => setNewMember(f => ({ ...f, relation: e.target.value }))} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}><option value="">Select</option><option value="self">Self</option><option value="child">Child</option><option value="spouse">Spouse</option><option value="parent">Parent</option></select></div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button onClick={addMember} style={{ padding: '8px 20px', borderRadius: 6, border: 'none', background: '#2563eb', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Save</button>
                <button onClick={() => setShowAddMember(false)} style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>Cancel</button>
              </div>
            </div>
          )}
          {family.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>👨‍👩‍👧</div>
              <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>No family members added yet. Add members to track their vaccination records.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {family.map(m => {
                const memberBookings = confirmedBookings.filter(b => (b.patientName || '').toLowerCase() === m.name.toLowerCase());
                return (
                  <div key={m.id} style={{ padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{m.gender === 'female' ? '👩' : '👨'}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{m.relation} · {m.dob} · {memberBookings.length} vaccine{memberBookings.length !== 1 ? 's' : ''}</div>
                      </div>
                    </div>
                    <button onClick={() => removeMember(m.id)} style={{ padding: '4px 10px', borderRadius: 4, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: 10, fontWeight: 600, fontFamily: 'inherit' }}>Remove</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* NOTIFICATIONS TAB */}
      {activeTab === 'notifications' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>WhatsApp notification history for this device</p>
            {notifications.length > 0 && (
              <button onClick={() => { clearNotifications(); refreshNotifs(); }}
                style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit' }}>Clear All</button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>💬</div>
              <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>No notifications yet. Book a vaccination to receive WhatsApp updates.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 8 }}>
              {notifications.slice().reverse().map(n => (
                <div key={n.id} style={{ padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', background: n.sent ? '#f0fdf4' : '#fffbeb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{n.label}</span>
                      <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, marginLeft: 6, background: n.sent ? '#dcfce7' : '#fef3c7', color: n.sent ? '#166534' : '#92400e', fontWeight: 600 }}>{n.sent ? 'Sent' : 'Pending'}</span>
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>{new Date(n.createdAt).toLocaleDateString('en-IN')}</div>
                  </div>
                  <p style={{ fontSize: 11, color: '#475569', margin: '0 0 6px', lineHeight: 1.5, whiteSpace: 'pre-wrap', maxHeight: 60, overflow: 'hidden' }}>{n.message}</p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <a href={getWALink(n.message)} target="_blank" rel="noopener noreferrer"
                      style={{ padding: '5px 12px', borderRadius: 6, border: 'none', background: '#25d366', color: '#fff', fontSize: 10, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      💬 Send on WhatsApp
                    </a>
                    {!n.sent && (
                      <button onClick={() => { markNotificationSent(n.id); refreshNotifs(); }}
                        style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit' }}>
                        Mark Sent
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DUE VACCINES TAB */}
      {activeTab === 'due' && (
        <div>
          {dueVaccines.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, borderRadius: 12, border: '1px solid #e2e8f0', background: '#f0fdf4' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#166534' }}>All Vaccines Completed!</h3>
              <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>You've taken all available vaccines. Check back later for new recommendations.</p>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>Based on your records, these vaccines may be due:</p>
              <div style={{ display: 'grid', gap: 10 }}>
                {dueVaccines.map(v => (
                  <Link key={v.id} to={`/vaccination/book?vaccine=${v.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{ padding: 12, borderRadius: 10, border: '1px solid #fef3c7', background: '#fffbeb', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 24 }}>💉</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{v.name}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{v.disease} · {v.ageGroup} · {v.doseCount} dose{v.doseCount > 1 ? 's' : ''}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#059669' }}>₹{v.price}</div>
                        <span style={{ fontSize: 10, color: '#d97706', fontWeight: 600 }}>Due →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Link to="/vaccination" style={{ fontSize: 12, color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>← Back to Vaccination</Link>
      </div>
    </div>
  );
}
