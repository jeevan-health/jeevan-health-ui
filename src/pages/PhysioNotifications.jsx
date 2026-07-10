import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { STORAGE_KEYS } from '../data/physiotherapyData';

const C = {
  primary: '#0D9488',
  primaryLight: '#CCFBF1',
  accent: '#F59E0B',
  heroFrom: '#0D9488',
  heroTo: '#14B8A6',
  heroMid: '#2DD4BF',
};

const TYPE_CONFIG = {
  booking_confirmation: { icon: '✅', labelKey: 'notif.type.booking', defaultLabel: 'Booking' },
  reminder: { icon: '⏰', labelKey: 'notif.type.reminder', defaultLabel: 'Reminder' },
  follow_up: { icon: '📋', labelKey: 'notif.type.follow_up', defaultLabel: 'Follow-up' },
  general: { icon: '💬', labelKey: 'notif.type.general', defaultLabel: 'General' },
};

function formatTime(iso) {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diff = (now - d) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch {
    return iso;
  }
}

function getNotifications() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
  } catch {
    return [];
  }
}

function saveNotifications(list) {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
}

export default function PhysioNotifications() {
  const t = useT();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications(getNotifications());
  }, []);

  const updateNotif = (id, patch) => {
    const next = notifications.map(n => n.id === id ? { ...n, ...patch } : n);
    setNotifications(next);
    saveNotifications(next);
  };

  const markAllRead = () => {
    const next = notifications.map(n => ({ ...n, read: true }));
    setNotifications(next);
    saveNotifications(next);
  };

  const total = notifications.length;
  const unread = notifications.filter(n => !n.read).length;
  const pendingSend = notifications.filter(n => !n.sent).length;

  const sorted = [...notifications].reverse();

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${C.heroFrom} 0%, ${C.heroMid} 50%, ${C.heroTo} 100%)`, padding: '28px 0 32px' }}>
        <div className="container">
          <Link to="/physiotherapy" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textDecoration: 'none', display: 'inline-block', marginBottom: 10 }}>
            ← {t('back.to.physiotherapy', 'Back to Physiotherapy')}
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 32 }}>{'🔔'}</span>
            <div>
              <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: 0 }}>{t('physio.notif.title', 'Notifications')}</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, margin: '2px 0 0' }}>{t('physio.notif.subtitle', 'WhatsApp and in-app notifications for physiotherapy')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="page-section container" style={{ maxWidth: 720 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          <div style={{ borderRadius: 10, padding: 14, background: '#fff', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{t('physio.notif.total', 'Total')}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{total}</div>
          </div>
          <div style={{ borderRadius: 10, padding: 14, background: '#fff', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{t('physio.notif.unread', 'Unread')}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#f59e0b' }}>{unread}</div>
          </div>
          <div style={{ borderRadius: 10, padding: 14, background: '#fff', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{t('physio.notif.pending', 'Pending Send')}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#ef4444' }}>{pendingSend}</div>
          </div>
        </div>

        {unread > 0 && (
          <button onClick={markAllRead}
            style={{ width: '100%', padding: '10px 16px', borderRadius: 8, border: `1px solid ${C.primaryLight}`, background: C.primaryLight, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', color: C.primary, marginBottom: 12, textAlign: 'center' }}>
            {t('physio.notif.mark_all_read', 'Mark All as Read')}
          </button>
        )}

        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>{'🔔'}</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>{t('physio.notif.empty_title', 'No Notifications')}</h3>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>{t('physio.notif.empty_desc', 'You have no physiotherapy notifications yet. They will appear here when there are booking updates, reminders, or follow-ups.')}</p>
            <Link to="/physiotherapy" style={{ height: 44, padding: '0 24px', borderRadius: 8, border: 'none', background: C.primary, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              {t('back.to.physiotherapy', 'Back to Physiotherapy')}
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {sorted.map(n => {
              const tc = TYPE_CONFIG[n.type] || TYPE_CONFIG.general;
              return (
                <div key={n.id}
                  style={{
                    padding: 14,
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                    background: n.read ? '#fff' : '#F0FDFA',
                    position: 'relative',
                    transition: 'background 0.2s',
                  }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{tc.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{t(tc.labelKey, tc.defaultLabel)}</span>
                        {n.patientName && (
                          <span style={{ fontSize: 11, color: '#64748b' }}>{'·'} {n.patientName}</span>
                        )}
                        <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 'auto' }}>{formatTime(n.createdAt)}</span>
                      </div>

                      <p style={{ fontSize: 12, color: '#475569', margin: '0 0 8px', lineHeight: 1.4 }}>{n.message}</p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {!n.sent && (
                          <button onClick={() => updateNotif(n.id, { sent: true })}
                            style={{ padding: '5px 12px', borderRadius: 6, border: 'none', background: C.primary, color: '#fff', cursor: 'pointer', fontSize: 10, fontWeight: 600, fontFamily: 'inherit' }}>
                            {t('physio.notif.send_now', 'Send Now')}
                          </button>
                        )}
                        {!n.read && (
                          <button onClick={() => updateNotif(n.id, { read: true })}
                            style={{ padding: '5px 12px', borderRadius: 6, border: `1px solid ${C.primary}`, background: 'transparent', color: C.primary, cursor: 'pointer', fontSize: 10, fontWeight: 600, fontFamily: 'inherit' }}>
                            {t('physio.notif.mark_read', 'Mark as Read')}
                          </button>
                        )}
                        {n.bookingId && (
                          <Link to={`/physiotherapy/bookings/${n.bookingId}`}
                            style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a', cursor: 'pointer', fontSize: 10, fontWeight: 600, fontFamily: 'inherit', textDecoration: 'none' }}>
                            {t('physio.notif.open_booking', 'Open Booking')}
                          </Link>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                      {!n.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />}
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 600,
                        background: n.sent ? '#dcfce7' : '#fee2e2',
                        color: n.sent ? '#166534' : '#991b1b',
                      }}>
                        {n.sent ? t('physio.notif.sent', 'Sent') : t('physio.notif.unsent', 'Unsent')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link to="/physiotherapy" style={{ fontSize: 12, color: C.primary, fontWeight: 600, textDecoration: 'none' }}>← {t('back.to.physiotherapy', 'Back to Physiotherapy')}</Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .page-section { padding: 20px 12px !important; }
        }
      `}</style>
    </div>
  );
}
