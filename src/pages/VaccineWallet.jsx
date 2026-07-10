import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
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

const NOTIF_KEY = 'jh_vaccination_notif_settings';

function getDefaultNotifSettings() {
  try { return JSON.parse(localStorage.getItem(NOTIF_KEY) || '{}'); } catch { return {}; }
}

function printVaccinationCard(bookingsList) {
  const printWin = window.open('', '_blank');
  if (!printWin) return alert('Please allow pop-ups to print');
  const rows = bookingsList.map(b => `
    <tr>
      <td style="padding:6px 10px;border:1px solid #ddd;font-size:11px">${b.vaccineName || b.vaccine || '-'}</td>
      <td style="padding:6px 10px;border:1px solid #ddd;font-size:11px">${b.patientName || b.name || '-'}</td>
      <td style="padding:6px 10px;border:1px solid #ddd;font-size:11px">${b.appointmentDate || b.date || '-'}</td>
      <td style="padding:6px 10px;border:1px solid #ddd;font-size:11px">${b.appointmentSlot || '-'}</td>
      <td style="padding:6px 10px;border:1px solid #ddd;font-size:11px">${b.serviceType === 'home' ? 'Home' : 'Clinic'}</td>
      <td style="padding:6px 10px;border:1px solid #ddd;font-size:11px">${b.status}</td>
    </tr>
  `).join('');
  printWin.document.write(`
    <html><head><title>Vaccination Card</title>
    <style>body{font-family:Arial,sans-serif;padding:20px;max-width:800px;margin:auto}h1{font-size:18px;color:#1a56db}table{width:100%;border-collapse:collapse}th{background:#1a56db;color:#fff;padding:8px 10px;font-size:12px;text-align:left}.header{text-align:center;margin-bottom:20px;border-bottom:2px solid #1a56db;padding-bottom:15px}.footer{text-align:center;margin-top:20px;font-size:10px;color:#999}.watermark{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:80px;color:rgba(26,86,219,0.06);pointer-events:none;z-index:-1}@media print{button{display:none}}</style></head>
    <body><div class="watermark">JEEVAN HEALTH</div>
    <div class="header"><h1>💉 JEEVAN HEALTHCARE</h1><h2 style="font-size:14px;margin:4px 0 0;color:#555">Vaccination Record Card</h2></div>
    <table><thead><tr><th>Vaccine</th><th>Patient</th><th>Date</th><th>Time</th><th>Type</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>
    <div class="footer"><p>Generated on ${new Date().toLocaleDateString('en-IN')} · Jeevan HealthCare at Home</p><p>www.jeevanhealthcare.com</p></div>
    <button onclick="window.print()" style="display:block;margin:20px auto;padding:10px 30px;background:#1a56db;color:#fff;border:none;border-radius:6px;font-size:14px;cursor:pointer">🖨️ Print</button>
    </body></html>
  `);
  printWin.document.close();
}

export default function VaccineWallet() {
  const t = useT();
  const [activeTab, setActiveTab] = useState('records');
  const [family, setFamily] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', dob: '', gender: '', relation: '' });
  const [notifSettings, setNotifSettings] = useState(getDefaultNotifSettings);

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

  const saveNotifSettings = (settings) => {
    const next = { ...notifSettings, ...settings };
    setNotifSettings(next);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(next));
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
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#0f172a' }}>{t('vaccine.wallet')}</h1>
          <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{t('family.records')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #e2e8f0', marginBottom: 16, overflowX: 'auto' }}>
          {[
            { id: 'records', label: t('records'), icon: '📋' },
            { id: 'family', label: t('family.members'), icon: '👨‍👩‍👧' },
            { id: 'due', label: t('due.vaccines'), icon: '🔔' },
            { id: 'notifications', label: `${t('notifications')} (${notifications.filter(n => !n.sent).length})`, icon: '💬' },
            { id: 'settings', label: t('reminder.settings'), icon: '⚙️' },
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
          {confirmedBookings.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <button onClick={() => printVaccinationCard(confirmedBookings)}
                style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                {t('print.card')}
              </button>
            </div>
          )}
          {confirmedBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>💉</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>{t('no.records')}</h3>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>{t('no.records.desc', 'Book your first vaccination to start maintaining your digital records.')}</p>
              <Link to="/vaccination" style={{ height: 44, padding: '0 24px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>{t('browse.vaccines')}</Link>
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
              <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{t('family.manage', 'Manage vaccination records for your family members')}</p>
            <button onClick={() => setShowAddMember(true)}
              style={{ height: 36, padding: '0 14px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>+ Add Member</button>
          </div>
          {showAddMember && (
            <div style={{ padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', marginBottom: 12 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 10px', color: '#0f172a' }}>{t('add.family.member', 'Add Family Member')}</h4>
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
              <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{t('notification.history', 'WhatsApp notification history for this device')}</p>
            {notifications.length > 0 && (
              <button onClick={() => { clearNotifications(); refreshNotifs(); }}
                style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer', fontSize: 10, fontFamily: 'inherit' }}>Clear All</button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, borderRadius: 12, border: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>💬</div>
              <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{t('no.notifications', 'No notifications yet. Book a vaccination to receive WhatsApp updates.')}</p>
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

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>{t('notification.settings', 'Notification Settings')}</h3>
              <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 16px' }}>{t('notif.settings.desc', 'Choose how you want to receive vaccination reminders and updates.')}</p>
          <div style={{ display: 'grid', gap: 10 }}>
            {[
              { key: 'whatsapp', label: 'WhatsApp', icon: '💬', desc: 'Receive reminders via WhatsApp on +91-9700104108' },
              { key: 'sms', label: 'SMS', icon: '📱', desc: 'Receive SMS reminders on your registered mobile number' },
              { key: 'email', label: 'Email', icon: '📧', desc: 'Receive email reminders and digital certificates' },
              { key: 'dueReminders', label: 'Due Vaccine Reminders', icon: '🔔', desc: 'Get notified when vaccines are due based on records' },
              { key: 'campAlerts', label: 'Camp Alerts', icon: '📍', desc: 'Get notified about vaccination camps near you' },
            ].map(s => {
              const enabled = notifSettings[s.key] !== false;
              return (
                <div key={s.key} style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{s.label}</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>{s.desc}</div>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
                    <input type="checkbox" checked={enabled} onChange={e => saveNotifSettings({ [s.key]: e.target.checked })}
                      style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{
                      position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                      background: enabled ? '#2563eb' : '#cbd5e1', borderRadius: 24, transition: '0.3s',
                    }}>
                      <span style={{
                        position: 'absolute', height: 20, width: 20, left: enabled ? 22 : 2, bottom: 2,
                        background: '#fff', borderRadius: '50%', transition: '0.3s',
                      }} />
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 14, padding: 12, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fffbeb', fontSize: 11, color: '#92400e' }}>
            <strong>📱 Mobile:</strong> +91-9700104108 (WhatsApp) · SMS will use your registered number<br />
            <strong>✉️ Email reminders</strong> will be sent to your account email. Update in your profile settings.
          </div>
        </div>
      )}

      {/* DUE VACCINES TAB */}
      {activeTab === 'due' && (
        <div>
          {dueVaccines.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, borderRadius: 12, border: '1px solid #e2e8f0', background: '#f0fdf4' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#166534' }}>{t('all.completed', 'All Vaccines Completed!')}</h3>
              <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{t('all.completed.desc', 'You\'ve taken all available vaccines. Check back later for new recommendations.')}</p>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>{t('based.on.records', 'Based on your records, these vaccines may be due:')}</p>
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
        <Link to="/vaccination" style={{ fontSize: 12, color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>{t('back.to.vaccination')}</Link>
      </div>
    </div>
  );
}

