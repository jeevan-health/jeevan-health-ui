import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { STORAGE_KEYS, nursingCategories } from '../data/nursingData';

const C = {
  primary: '#7C3AED',
  primaryLight: '#EDE9FE',
  accent: '#EC4899',
  heroFrom: '#7C3AED',
  heroTo: '#A78BFA',
  heroMid: '#8B5CF6',
};

const statusColors = {
  pending: { bg: '#fef3c7', text: '#92400e' },
  confirmed: { bg: '#dbeafe', text: '#1e40af' },
  'in-progress': { bg: '#dcfce7', text: '#166534' },
  completed: { bg: '#e0e7ff', text: '#3730a3' },
  cancelled: { bg: '#fee2e2', text: '#991b1b' },
};

export default function NursingDashboard() {
  const t = useT();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [settings, setSettings] = useState({
    preferredLevel: 'staff-nurse',
    defaultAddress: '',
    notifications: true,
  });

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
      setBookings(data);
    } catch { setBookings([]); }
    try {
      const f = JSON.parse(localStorage.getItem('jh_nursing_favourites') || '[]');
      setFavourites(f);
    } catch { setFavourites([]); }
    try {
      const s = JSON.parse(localStorage.getItem('jh_nursing_dashboard_settings') || 'null');
      if (s) setSettings(s);
    } catch { /* ignore */ }
  }, []);

  const saveSettings = (next) => {
    setSettings(next);
    localStorage.setItem('jh_nursing_dashboard_settings', JSON.stringify(next));
  };

  const tabs = [
    { id: 'upcoming', label: t('nursing.upcoming.visits', 'Upcoming Visits'), icon: '📅' },
    { id: 'history', label: t('nursing.visit.history', 'Visit History'), icon: '📋' },
    { id: 'favourites', label: t('nursing.favourite.nurses', 'Favourite Nurses'), icon: '❤️' },
    { id: 'settings', label: t('nursing.settings', 'Settings'), icon: '⚙️' },
  ];

  const upcomingBookings = bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled');
  const historyBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  const handleCancel = (id) => {
    if (!confirm(t('nursing.cancel.confirm', 'Cancel this visit?'))) return;
    const next = bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b);
    setBookings(next);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(next));
  };

  const handleReBook = (booking) => {
    const newBooking = { ...booking, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), status: 'pending', createdAt: new Date().toISOString() };
    const next = [...bookings, newBooking];
    setBookings(next);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(next));
    setActiveTab('upcoming');
  };

  const isFavourite = (nurseId) => favourites.some(f => f.id === nurseId);
  const toggleFavourite = (nurse) => {
    let next;
    if (isFavourite(nurse.id)) {
      next = favourites.filter(f => f.id !== nurse.id);
    } else {
      next = [...favourites, { id: nurse.id, name: nurse.nurseName, level: nurse.nurseLevel || '', image: '👩‍⚕️' }];
    }
    setFavourites(next);
    localStorage.setItem('jh_nursing_favourites', JSON.stringify(next));
  };

  const favouriteNurses = favourites.filter(f => bookings.some(b => b.nurseName === f.name));
  const bookedNursesMap = {};
  bookings.forEach(b => {
    if (b.nurseName && !bookedNursesMap[b.nurseName]) {
      bookedNursesMap[b.nurseName] = { name: b.nurseName, level: b.nurseLevel || 'staff-nurse', count: 1 };
    }
  });
  const allFavouriteItems = favouriteNurses.length > 0 ? favouriteNurses : Object.values(bookedNursesMap);

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${C.heroFrom} 0%, ${C.heroMid} 50%, ${C.heroTo} 100%)`, padding: '28px 0 32px' }}>
        <div className="container">
          <Link to="/nursing-care" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textDecoration: 'none', display: 'inline-block', marginBottom: 10 }}>← {t('nursing.back', 'Back to Nursing Care')}</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 32 }}>{'🩺'}</span>
            <div>
              <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: 0 }}>{t('nursing.my.visits', 'My Nursing Visits')}</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, margin: '2px 0 0' }}>{t('nursing.track.visits', 'Track your nursing visits, history, and preferences')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="page-section container" style={{ maxWidth: 720 }}>
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #e2e8f0', marginBottom: 16, overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', color: activeTab === tab.id ? C.primary : '#64748b', borderBottom: activeTab === tab.id ? `2px solid ${C.primary}` : '2px solid transparent', whiteSpace: 'nowrap' }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'upcoming' && (
          <div>
            {upcomingBookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>{'📅'}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>{t('nursing.no.upcoming', 'No Upcoming Visits')}</h3>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>{t('nursing.no.upcoming.desc', 'You have no upcoming nursing visits. Book a nurse now.')}</p>
                <Link to="/nursing-care/book" style={{ height: 44, padding: '0 24px', borderRadius: 8, border: 'none', background: C.primary, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>{t('nursing.book.nurse', 'Book a Nurse')} →</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {upcomingBookings.slice().reverse().map(b => {
                  const sc = statusColors[b.status] || { bg: '#f1f5f9', text: '#475569' };
                  const cat = nursingCategories.find(c => b.serviceName && b.serviceName.toLowerCase().includes(c.name.slice(0, 8).toLowerCase()));
                  return (
                    <div key={b.id} style={{ padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <span style={{ fontSize: 16 }}>{cat?.icon || '🩺'}</span>
                            <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#0f172a' }}>{b.serviceName || t('nursing.service', 'Nursing Service')}</h4>
                            <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: sc.bg, color: sc.text }}>{b.status}</span>
                          </div>
                          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>
                            {b.nurseName && <span style={{ fontWeight: 600, color: C.primary }}>{'👩‍⚕️'} {b.nurseName}</span>}
                          </div>
                          <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#64748b', flexWrap: 'wrap' }}>
                            <span>{'📅'} {b.preferredDate || b.date || '-'}</span>
                            <span>{'⏰'} {b.preferredTime || b.time || '-'}</span>
                            {b.totalAmount !== undefined && <span style={{ fontWeight: 700, color: '#059669' }}>₹{b.totalAmount || b.amount || 0}</span>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <a href={`https://wa.me/?text=${encodeURIComponent('I have a nursing visit on ' + (b.preferredDate || b.date || '') + ' at ' + (b.preferredTime || b.time || '') + ' for ' + (b.serviceName || '') + '. Booking ID: ' + b.id)}`} target="_blank" rel="noopener noreferrer"
                            style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: '#25D366', color: '#fff', fontSize: 10, fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                            {'💬'} {t('nursing.whatsapp', 'WhatsApp')}
                          </a>
                          <button onClick={() => { toggleFavourite({ id: b.nurseName, nurseName: b.nurseName, nurseLevel: b.nurseLevel }); }}
                            style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                            {isFavourite(b.nurseName) ? '❤️' : '🤍'}
                          </button>
                          {b.status !== 'cancelled' && (
                            <button onClick={() => handleCancel(b.id)}
                              style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #fee2e2', background: '#fff', cursor: 'pointer', fontSize: 10, fontWeight: 600, fontFamily: 'inherit', color: '#dc2626' }}>
                              {t('nursing.cancel', 'Cancel')}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            {historyBookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>{'📋'}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>{t('nursing.no.history', 'No Visit History')}</h3>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>{t('nursing.no.history.desc', 'Your completed and cancelled visits will appear here.')}</p>
                <Link to="/nursing-care/book" style={{ height: 44, padding: '0 24px', borderRadius: 8, border: 'none', background: C.primary, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>{t('nursing.book.nurse', 'Book a Nurse')}</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {historyBookings.slice().reverse().map(b => {
                  const sc = statusColors[b.status] || { bg: '#f1f5f9', text: '#475569' };
                  return (
                    <div key={b.id} style={{ padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <span style={{ fontSize: 16 }}>{'🩺'}</span>
                            <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#0f172a' }}>{b.serviceName || t('nursing.service', 'Nursing Service')}</h4>
                            <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: sc.bg, color: sc.text }}>{b.status}</span>
                          </div>
                          {b.nurseName && <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{'👩‍⚕️'} {b.nurseName}</div>}
                          <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#64748b', flexWrap: 'wrap' }}>
                            <span>{'📅'} {b.preferredDate || b.date || '-'}</span>
                            <span>{'⏰'} {b.preferredTime || b.time || '-'}</span>
                            {b.totalAmount !== undefined && <span style={{ fontWeight: 700, color: '#059669' }}>₹{b.totalAmount || b.amount || 0}</span>}
                          </div>
                        </div>
                        {b.status === 'completed' && (
                          <button onClick={() => handleReBook(b)}
                            style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: C.primary, color: '#fff', fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                            {t('nursing.rebook', 'Re-book')} →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favourites' && (
          <div>
            {allFavouriteItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>{'❤️'}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>{t('nursing.no.favourites', 'No Favourite Nurses')}</h3>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>{t('nursing.no.favourites.desc', 'Nurses you book will appear here. Tap the heart icon to save them.')}</p>
                <Link to="/nursing-care/book" style={{ height: 44, padding: '0 24px', borderRadius: 8, border: 'none', background: C.primary, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>{t('nursing.browse.nurses', 'Browse Nurses')}</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {allFavouriteItems.map((n, i) => (
                  <div key={n.name || i} style={{ padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 28 }}>{'👩‍⚕️'}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{n.name || n.nurseName}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{n.level || n.nurseLevel || ''}</div>
                        {n.count && <div style={{ fontSize: 10, color: '#94a3b8' }}>{n.count} {t('nursing.visit.count', 'visit(s)')}</div>}
                      </div>
                    </div>
                    <button onClick={() => { window.location.href = '/nursing-care/book'; }}
                      style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: C.primary, color: '#fff', fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                      {t('nursing.book.again', 'Book Again')}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <div style={{ padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', marginBottom: 12 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }}>{t('nursing.preferences', 'Preferences')}</h4>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('nursing.default.nurse.level', 'Preferred Nurse Level')}</label>
                <select value={settings.preferredLevel} onChange={e => saveSettings({ ...settings, preferredLevel: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', background: '#fff', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="trained-caregiver">{t('nursing.level.trained', 'Trained Caregiver')}</option>
                  <option value="staff-nurse">{t('nursing.level.staff', 'Staff Nurse')}</option>
                  <option value="senior-nurse">{t('nursing.level.senior', 'Senior Staff Nurse')}</option>
                  <option value="specialist">{t('nursing.level.specialist', 'Specialist Nurse')}</option>
                </select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 3 }}>{t('nursing.default.address', 'Default Address')}</label>
                <textarea value={settings.defaultAddress} onChange={e => saveSettings({ ...settings, defaultAddress: e.target.value })} rows={2}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d0d5dd', fontSize: 12, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                  placeholder={t('nursing.address.placeholder', 'Enter your default address for nurse visits')} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#0f172a' }}>{t('nursing.notifications', 'Notification Preferences')}</span>
                <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 22 }}>
                  <input type="checkbox" checked={settings.notifications} onChange={e => saveSettings({ ...settings, notifications: e.target.checked })}
                    style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, background: settings.notifications ? C.primary : '#cbd5e1', borderRadius: 22, transition: '.3s' }}>
                    <span style={{ position: 'absolute', content: '', height: 18, width: 18, borderRadius: '50%', background: '#fff', top: 2, left: settings.notifications ? 24 : 2, transition: '.3s' }} />
                  </span>
                </label>
              </div>
            </div>
            <div style={{ padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>{t('nursing.account.info', 'Account Information')}</h4>
              <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.8 }}>
                <div><strong>{t('nursing.total.bookings', 'Total Bookings')}:</strong> {bookings.length}</div>
                <div><strong>{t('nursing.completed.visits', 'Completed Visits')}:</strong> {bookings.filter(b => b.status === 'completed').length}</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/nursing-care" style={{ fontSize: 12, color: C.primary, fontWeight: 600, textDecoration: 'none' }}>← {t('nursing.back.to.nursing', 'Back to Nursing Care')}</Link>
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
