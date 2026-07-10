import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';

const STORAGE_KEY = 'jh_vaccine_marketing_campaigns';
const WA_PHONE = '919700104108';

const loadData = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
};

const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const formatDate = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const TARGET_SEGMENTS = [
  {
    id: 'new-parents',
    icon: '👶',
    label: 'New Parents',
    message: 'Protect your baby with our at-home vaccination service. Complete immunization schedule from the comfort of your home. Book now!',
    badgeColor: { bg: '#fef2f2', text: '#991b1b' },
  },
  {
    id: 'seniors',
    icon: '👴',
    label: 'Senior Citizens',
    message: 'Stay protected this season. Flu, Pneumonia & Shingles vaccines at home. Specially priced packages for senior citizens.',
    badgeColor: { bg: '#fff7ed', text: '#c2410c' },
  },
  {
    id: 'travellers',
    icon: '✈️',
    label: 'Travellers',
    message: 'Planning travel? Get all required vaccines at home — Haji/Umrah, International travel, and more. Book your travel vaccination package.',
    badgeColor: { bg: '#eef2ff', text: '#3730a3' },
  },
  {
    id: 'corporate',
    icon: '🏢',
    label: 'Corporate',
    message: 'On-site vaccination camp for your employees. Boost immunity, reduce absenteeism. Corporate packages starting at ₹299/person.',
    badgeColor: { bg: '#f0fdfa', text: '#0f766e' },
  },
  {
    id: 'general',
    icon: '📱',
    label: 'General',
    message: 'Vaccination at home. Certified nurses, safe storage, digital records. Book your appointment today!',
    badgeColor: { bg: '#f5f3ff', text: '#6d28d9' },
  },
];

const segmentIconMap = {
  'new-parents': '👶',
  seniors: '👴',
  travellers: '✈️',
  corporate: '🏢',
  general: '📱',
};

const statusBadge = (status) => {
  const map = {
    draft: { bg: '#f1f5f9', text: '#475569', label: 'Draft' },
    active: { bg: '#dcfce7', text: '#166534', label: 'Active' },
    completed: { bg: '#dbeafe', text: '#1e40af', label: 'Completed' },
  };
  return map[status] || map.draft;
};

export default function VaccineWhatsAppMarketing() {
  const t = useT();

  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState({ name: '', segment: 'general', message: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setCampaigns(loadData(STORAGE_KEY, []));
  }, []);

  const persist = (updated) => {
    setCampaigns(updated);
    saveData(STORAGE_KEY, updated);
  };

  const segmentCampaigns = (segId) => campaigns.filter(c => c.targetSegment === segId);

  const createCampaign = (segmentObj, customName, customMessage) => {
    const now = new Date().toISOString();
    const newCamp = {
      id: 'v_' + Date.now(),
      name: customName || segmentObj.label + ' Campaign',
      targetSegment: segmentObj.id,
      message: customMessage || segmentObj.message,
      status: 'draft',
      sentCount: 0,
      openedCount: 0,
      convertedCount: 0,
      createdAt: now,
    };
    const updated = [...campaigns, newCamp];
    persist(updated);
    return newCamp;
  };

  const launchCampaign = (segmentObj) => {
    const camp = createCampaign(segmentObj, '', '');
    window.open(`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(camp.message)}`, '_blank');
  };

  const handleSendNow = (camp) => {
    const updated = campaigns.map(c => {
      if (c.id === camp.id) return { ...c, sentCount: c.sentCount + 1, status: c.status === 'draft' ? 'active' : c.status };
      return c;
    });
    persist(updated);
    window.open(`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(camp.message)}`, '_blank');
  };

  const markComplete = (id) => {
    persist(campaigns.map(c => c.id === id ? { ...c, status: 'completed' } : c));
  };

  const handleCreateCustom = () => {
    if (!form.name.trim()) return;
    const seg = TARGET_SEGMENTS.find(s => s.id === form.segment) || TARGET_SEGMENTS[4];
    createCampaign(seg, form.name.trim(), form.message || seg.message);
    setForm({ name: '', segment: 'general', message: '' });
    setShowForm(false);
  };

  const selectSegment = (segId) => {
    const seg = TARGET_SEGMENTS.find(s => s.id === segId) || TARGET_SEGMENTS[4];
    setForm(f => ({ ...f, segment: segId, message: seg.message }));
  };

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'active').length,
    totalSent: campaigns.reduce((a, c) => a + c.sentCount, 0),
    totalConverted: campaigns.reduce((a, c) => a + c.convertedCount, 0),
  };

  const statsCards = [
    { label: t('vaccine.whatsapp.total_campaigns', 'Total Campaigns'), value: stats.total, color: '#1866C9' },
    { label: t('vaccine.whatsapp.active_campaigns', 'Active Campaigns'), value: stats.active, color: '#059669' },
    { label: t('vaccine.whatsapp.total_sent', 'Total Sent'), value: stats.totalSent, color: '#0D9488' },
    { label: t('vaccine.whatsapp.total_conversions', 'Total Conversions'), value: stats.totalConverted, color: '#7C3AED' },
  ];

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1866C9 0%, #3B82F6 100%)', margin: '-32px -24px 24px', padding: '32px 24px 28px', borderRadius: '0 0 24px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Link to="/vaccination" style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontWeight: 600 }}>
            ← {t('vaccine.whatsapp.back', 'Back to Vaccination')}
          </Link>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#fff' }}>
          {t('vaccine.whatsapp.title', 'WhatsApp Marketing – Vaccination Campaigns')}
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10, marginBottom: 20 }}>
        {statsCards.map(s => (
          <div key={s.label} style={{ padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>
          {t('vaccine.whatsapp.target_segments', 'Target Segments')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
          {TARGET_SEGMENTS.map(seg => {
            const segCount = segmentCampaigns(seg.id).length;
            return (
              <div key={seg.id} style={{ padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 22 }}>{seg.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{seg.label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 600, color: '#94a3b8', background: '#f1f5f9', padding: '1px 8px', borderRadius: 10 }}>
                    {segCount} {t('vaccine.whatsapp.campaigns', 'campaigns')}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.5, marginBottom: 10, background: '#f8fafc', padding: 8, borderRadius: 6, border: '1px solid #eef2f6' }}>
                  <span style={{ fontWeight: 600, color: '#1866C9', fontSize: 10 }}>{t('vaccine.whatsapp.message', 'Message')}: </span>
                  {seg.message}
                </div>
                <button onClick={() => launchCampaign(seg)}
                  style={{ padding: '7px 14px', borderRadius: 6, border: 'none', background: '#25D366', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  📤 {t('vaccine.whatsapp.launch_campaign', 'Launch Campaign')}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
          {t('vaccine.whatsapp.active_campaigns_title', 'Active Campaigns')}
        </div>
        <button onClick={() => setShowForm(true)}
          style={{ padding: '7px 14px', borderRadius: 6, border: 'none', background: '#1866C9', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          + {t('vaccine.whatsapp.new_campaign', 'New Campaign')}
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div style={{ padding: 30, borderRadius: 10, border: '1px dashed #e2e8f0', background: '#fafafa', textAlign: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>{t('vaccine.whatsapp.no_campaigns', 'No campaigns yet. Launch one from the segments above.')}</span>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', marginBottom: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>{t('vaccine.whatsapp.campaign_name', 'Campaign')}</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>{t('vaccine.whatsapp.segment', 'Segment')}</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>{t('vaccine.whatsapp.status', 'Status')}</th>
                <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>{t('vaccine.whatsapp.sent', 'Sent')}</th>
                <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>{t('vaccine.whatsapp.opened', 'Opened')}</th>
                <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#475569' }}>{t('vaccine.whatsapp.converted', 'Converted')}</th>
                <th style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#475569' }}>{t('vaccine.whatsapp.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.slice().reverse().map(camp => {
                const seg = TARGET_SEGMENTS.find(s => s.id === camp.targetSegment);
                const sb = statusBadge(camp.status);
                return (
                  <tr key={camp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>
                      <div>{camp.name}</div>
                      <div style={{ fontSize: 9, color: '#94a3b8' }}>{formatDate(camp.createdAt)}</div>
                    </td>
                    <td style={{ padding: '8px 10px' }}>
                      <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 9, fontWeight: 600, background: seg?.badgeColor?.bg || '#f1f5f9', color: seg?.badgeColor?.text || '#475569' }}>
                        {seg?.icon} {seg?.label || camp.targetSegment}
                      </span>
                    </td>
                    <td style={{ padding: '8px 10px' }}>
                      <span style={{ padding: '2px 6px', borderRadius: 4, fontSize: 9, fontWeight: 600, background: sb.bg, color: sb.text }}>{sb.label}</span>
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', color: '#0f172a', fontWeight: 600 }}>{camp.sentCount}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', color: '#0f172a', fontWeight: 600 }}>{camp.openedCount}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center', color: '#0f172a', fontWeight: 600 }}>{camp.convertedCount}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button onClick={() => handleSendNow(camp)}
                          style={{ padding: '4px 10px', borderRadius: 4, border: 'none', background: '#25D366', color: '#fff', fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                          📤 {t('vaccine.whatsapp.send_now', 'Send Now')}
                        </button>
                        {camp.status !== 'completed' && (
                          <button onClick={() => markComplete(camp.id)}
                            style={{ padding: '4px 10px', borderRadius: 4, border: '1px solid #d0d5dd', background: '#fff', color: '#475569', fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                            {t('vaccine.whatsapp.mark_complete', 'Mark Complete')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>
          {t('vaccine.whatsapp.bulk_links', 'Bulk WhatsApp Links')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
          {TARGET_SEGMENTS.map(seg => (
            <div key={seg.id} style={{ padding: 10, borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>{seg.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#0f172a' }}>{seg.label}</div>
                <div style={{ fontSize: 9, color: '#94a3b8', wordBreak: 'break-all' }}>wa.me/{WA_PHONE}?text=...</div>
              </div>
              <a href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(seg.message)}`} target="_blank" rel="noopener noreferrer"
                style={{ padding: '6px 12px', borderRadius: 6, background: '#25D366', color: '#fff', fontSize: 11, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                {t('vaccine.whatsapp.open_whatsapp', 'Open WhatsApp')}
              </a>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 20, minWidth: 420, maxWidth: 480, boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#0f172a' }}>{t('vaccine.whatsapp.create_campaign', 'Create Campaign')}</h3>
              <button onClick={() => setShowForm(false)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>×</button>
            </div>
            <div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('vaccine.whatsapp.campaign_name', 'Campaign Name')} *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={t('vaccine.whatsapp.campaign_placeholder', 'e.g. New Parents Campaign')}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('vaccine.whatsapp.target_segment', 'Target Segment')}</label>
                <select value={form.segment} onChange={e => selectSegment(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                  {TARGET_SEGMENTS.map(seg => <option key={seg.id} value={seg.id}>{seg.icon} {seg.label}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('vaccine.whatsapp.message', 'Message')}</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={4} placeholder={t('vaccine.whatsapp.message_placeholder', 'Type your WhatsApp message...')}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleCreateCustom}
                  style={{ padding: '8px 24px', borderRadius: 6, border: 'none', background: '#25D366', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  📤 {t('vaccine.whatsapp.launch', 'Launch')}
                </button>
                <button onClick={() => setShowForm(false)}
                  style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid #d0d5dd', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
                  {t('vaccine.whatsapp.cancel', 'Cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
