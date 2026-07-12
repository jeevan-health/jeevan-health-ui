import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { physioCategories, STORAGE_KEYS } from '../data/physiotherapyData';
import { confirmDialog } from '../stores/dialogStore';

const LEAD_STATUSES = [
  'New', 'Contacted', 'Assessment Pending', 'Appointment Scheduled',
  'Treatment Started', 'Package Purchased', 'Completed', 'Follow Up',
];

const LEAD_SOURCES = ['All', 'Website', 'WhatsApp', 'Google Ads', 'Referral', 'Diagnostics Cross-sell'];

const statusColors = {
  'New': { bg: '#dbeafe', text: '#1e40af' },
  'Contacted': { bg: '#fef3c7', text: '#92400e' },
  'Assessment Pending': { bg: '#e0e7ff', text: '#3730a3' },
  'Appointment Scheduled': { bg: '#ccfbf1', text: '#0f766e' },
  'Treatment Started': { bg: '#dcfce7', text: '#166534' },
  'Package Purchased': { bg: '#d1fae5', text: '#065f46' },
  'Completed': { bg: '#f1f5f9', text: '#475569' },
  'Follow Up': { bg: '#ffedd5', text: '#9a3412' },
};

const sourceColors = {
  'Website': { bg: '#dbeafe', text: '#1e40af' },
  'WhatsApp': { bg: '#dcfce7', text: '#166534' },
  'Google Ads': { bg: '#fee2e2', text: '#991b1b' },
  'Referral': { bg: '#e0e7ff', text: '#3730a3' },
  'Diagnostics Cross-sell': { bg: '#ccfbf1', text: '#0f766e' },
};

const loadData = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
};

const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const formatDate = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

const emptyLeadForm = { name: '', phone: '', condition: '', source: 'Website' };

export default function PhysioCrmLeads() {
  const t = useT();

  const [leads, setLeads] = useState([]);
  const [sourceFilter, setSourceFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(emptyLeadForm);
  const [selectedLead, setSelectedLead] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editAssignedTo, setEditAssignedTo] = useState('');
  const [editBookingId, setEditBookingId] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    setLeads(loadData(STORAGE_KEYS.LEADS, []));
  }, []);

  const persistLeads = (updated) => {
    setLeads(updated);
    saveData(STORAGE_KEYS.LEADS, updated);
  };

  const filteredLeads = sourceFilter === 'All'
    ? leads
    : leads.filter(l => l.source === sourceFilter);

  const todayStr = new Date().toISOString().slice(0, 10);

  const statsCards = [
    { label: t('physio.crm.total_leads', 'Total Leads'), value: leads.length, color: '#1866C9', icon: '📋' },
    { label: t('physio.crm.new_today', 'New (Today)'), value: leads.filter(l => l.createdAt?.startsWith(todayStr) && l.status === 'New').length, color: '#2563eb', icon: '🆕' },
    { label: t('physio.crm.contacted', 'Contacted'), value: leads.filter(l => l.status === 'Contacted').length, color: '#d97706', icon: '📞' },
    { label: t('physio.crm.appointments', 'Appointments Scheduled'), value: leads.filter(l => l.status === 'Appointment Scheduled').length, color: '#0D9488', icon: '📅' },
    { label: t('physio.crm.conversions', 'Conversions'), value: leads.filter(l => l.status === 'Package Purchased' || l.status === 'Completed').length, color: '#059669', icon: '✅' },
  ];

  const getLeadsByStatus = (status) => filteredLeads.filter(l => l.status === status);

  const openDetailModal = (lead) => {
    setSelectedLead(lead);
    setEditNotes(lead.notes || '');
    setEditStatus(lead.status);
    setEditAssignedTo(lead.assignedTo || '');
    setEditBookingId(lead.bookingId || '');
    setShowDetailModal(true);
  };

  const handleSaveDetail = () => {
    if (!selectedLead) return;
    const updated = leads.map(l => {
      if (l.id === selectedLead.id) {
        return {
          ...l,
          notes: editNotes,
          status: editStatus,
          assignedTo: editAssignedTo,
          bookingId: editBookingId || null,
          updatedAt: new Date().toISOString(),
        };
      }
      return l;
    });
    persistLeads(updated);
    setSelectedLead(updated.find(l => l.id === selectedLead.id));
    setShowDetailModal(false);
  };

  const handleAddLead = () => {
    if (!addForm.name.trim() || !addForm.phone.trim()) return;
    const now = new Date().toISOString();
    const newLead = {
      id: 'LEAD-' + Date.now(),
      name: addForm.name.trim(),
      phone: addForm.phone.trim(),
      condition: addForm.condition.trim(),
      source: addForm.source,
      status: 'New',
      notes: '',
      createdAt: now,
      updatedAt: now,
      assignedTo: '',
      bookingId: null,
    };
    persistLeads([...leads, newLead]);
    setAddForm(emptyLeadForm);
    setShowAddModal(false);
  };

  const deleteLead = async (id) => { if (!(await confirmDialog(t('physio.crm.confirm_delete', 'Delete this lead?')))) return;
    persistLeads(leads.filter(l => l.id !== id));
    if (selectedLead?.id === id) setSelectedLead(null);
  };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)', margin: '-32px -24px 24px', padding: '32px 24px 28px', borderRadius: '0 0 24px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Link to="/physiotherapy" style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: 600 }}>
            ← {t('physio.crm.back', 'Back to Physiotherapy')}
          </Link>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#fff' }}>
          {t('physio.crm.title', 'Physiotherapy CRM - Leads Management')}
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10, marginBottom: 16 }}>
        {statsCards.map(s => (
          <div key={s.label} style={{ padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
            <div style={{ fontSize: 16, marginBottom: 2 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {LEAD_SOURCES.map(src => (
            <button key={src} onClick={() => setSourceFilter(src)}
              style={{ padding: '5px 12px', borderRadius: 16, border: 'none', background: sourceFilter === src ? '#0D9488' : '#e8edf2', color: sourceFilter === src ? '#fff' : '#475569', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}>
              {src === 'All' ? t('physio.crm.all', 'All') : src}
            </button>
          ))}
        </div>
        <button onClick={() => setShowAddModal(true)}
          style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: '#0D9488', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          + {t('physio.crm.add_lead', 'Add Lead')}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, minHeight: 400 }}>
        {LEAD_STATUSES.map(status => {
          const sc = statusColors[status] || { bg: '#f1f5f9', text: '#475569' };
          const statusLeads = getLeadsByStatus(status);
          return (
            <div key={status} style={{ minWidth: 260, maxWidth: 260, flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: sc.bg, border: `2px solid ${sc.text}` }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{status}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', background: '#f1f5f9', padding: '1px 8px', borderRadius: 10 }}>{statusLeads.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {statusLeads.length === 0 && (
                  <div style={{ padding: 20, borderRadius: 8, border: '1px dashed #e2e8f0', background: '#fafafa', textAlign: 'center' }}>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{t('physio.crm.no_leads', 'No leads')}</span>
                  </div>
                )}
                {statusLeads.map(lead => {
                  const srcColor = sourceColors[lead.source] || { bg: '#f1f5f9', text: '#475569' };
                  return (
                    <div key={lead.id} onClick={() => openDetailModal(lead)}
                      style={{ padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{lead.name}</div>
                      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{lead.phone}</div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 4 }}>
                        {lead.condition && (
                          <span style={{ padding: '1px 6px', borderRadius: 3, background: '#f0fdfa', color: '#0D9488', fontSize: 9, fontWeight: 600 }}>{lead.condition}</span>
                        )}
                        <span style={{ padding: '1px 6px', borderRadius: 3, background: srcColor.bg, color: srcColor.text, fontSize: 9, fontWeight: 600 }}>{lead.source}</span>
                      </div>
                      <div style={{ fontSize: 9, color: '#94a3b8', marginBottom: 2 }}>
                        {formatDate(lead.createdAt)} {formatTime(lead.createdAt)}
                      </div>
                      {lead.notes && (
                        <div style={{ fontSize: 10, color: '#64748b', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {lead.notes.length > 50 ? lead.notes.slice(0, 50) + '...' : lead.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, minWidth: 380, maxWidth: 440, boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#0f172a' }}>{t('physio.crm.add_lead', 'Add New Lead')}</h3>
              <button onClick={() => { setShowAddModal(false); setAddForm(emptyLeadForm); }} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>×</button>
            </div>
            <div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('physio.crm.name', 'Name')} *</label>
                <input value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} placeholder={t('physio.crm.name_placeholder', 'Lead name')}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('physio.crm.phone', 'Phone')} *</label>
                <input value={addForm.phone} onChange={e => setAddForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))} placeholder="10-digit mobile"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('physio.crm.condition', 'Condition')}</label>
                <input value={addForm.condition} onChange={e => setAddForm(f => ({ ...f, condition: e.target.value }))} placeholder={t('physio.crm.condition_placeholder', 'e.g. Back Pain, Knee Pain')}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('physio.crm.source', 'Source')}</label>
                <select value={addForm.source} onChange={e => setAddForm(f => ({ ...f, source: e.target.value }))}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                  {LEAD_SOURCES.filter(s => s !== 'All').map(src => <option key={src} value={src}>{src}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleAddLead}
                  style={{ padding: '8px 24px', borderRadius: 6, border: 'none', background: '#0D9488', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {t('physio.crm.save', 'Save')}
                </button>
                <button onClick={() => { setShowAddModal(false); setAddForm(emptyLeadForm); }}
                  style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
                  {t('physio.crm.cancel', 'Cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedLead && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, minWidth: 460, maxWidth: 540, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#0f172a' }}>{t('physio.crm.lead_detail', 'Lead Details')}</h3>
              <button onClick={() => setShowDetailModal(false)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>×</button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>{selectedLead.name}</div>
              <div style={{ fontSize: 11, color: '#1866C9', fontWeight: 600, marginBottom: 6 }}>{selectedLead.id}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: (statusColors[selectedLead.status] || {}).bg || '#f1f5f9', color: (statusColors[selectedLead.status] || {}).text || '#475569' }}>{selectedLead.status}</span>
                <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: (sourceColors[selectedLead.source] || {}).bg || '#f1f5f9', color: (sourceColors[selectedLead.source] || {}).text || '#475569' }}>{selectedLead.source}</span>
                {selectedLead.condition && <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: '#f0fdfa', color: '#0D9488' }}>{selectedLead.condition}</span>}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>
                <strong>{t('physio.crm.phone', 'Phone')}:</strong> {selectedLead.phone || '-'}
              </div>
              {selectedLead.assignedTo && (
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>
                  <strong>{t('physio.crm.assigned_to', 'Assigned To')}:</strong> {selectedLead.assignedTo}
                </div>
              )}
              {selectedLead.bookingId && (
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>
                  <strong>{t('physio.crm.booking_id', 'Booking ID')}:</strong> {selectedLead.bookingId}
                </div>
              )}
              <div style={{ fontSize: 10, color: '#94a3b8' }}>
                {t('physio.crm.created', 'Created')}: {formatDate(selectedLead.createdAt)} {formatTime(selectedLead.createdAt)}
                {selectedLead.updatedAt !== selectedLead.createdAt && ` · ${t('physio.crm.updated', 'Updated')}: ${formatDate(selectedLead.updatedAt)} ${formatTime(selectedLead.updatedAt)}`}
              </div>
            </div>

            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('physio.crm.status', 'Status')}</label>
              <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('physio.crm.notes', 'Notes')}</label>
              <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={3} placeholder={t('physio.crm.notes_placeholder', 'Add notes about this lead...')}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('physio.crm.assigned_to', 'Assign To')}</label>
              <input value={editAssignedTo} onChange={e => setEditAssignedTo(e.target.value)} placeholder={t('physio.crm.assigned_placeholder', 'Therapist name')}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('physio.crm.booking_id', 'Booking ID')}</label>
              <input value={editBookingId} onChange={e => setEditBookingId(e.target.value)} placeholder={t('physio.crm.booking_placeholder', 'Link to booking (e.g. JPH-...)')}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleSaveDetail}
                  style={{ padding: '8px 24px', borderRadius: 6, border: 'none', background: '#0D9488', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {t('physio.crm.save', 'Save')}
                </button>
                <button onClick={() => setShowDetailModal(false)}
                  style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
                  {t('physio.crm.cancel', 'Cancel')}
                </button>
              </div>
              <button onClick={() => { if (selectedLead) deleteLead(selectedLead.id); }}
                style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #fee2e2', background: '#fff', color: '#dc2626', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>
                {t('physio.crm.delete', 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
