import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { STORAGE_KEYS } from '../data/physiotherapyData';
import { confirmDialog } from '../stores/dialogStore';

const C = {
  primary: '#0D9488',
  primaryLight: '#CCFBF1',
  accent: '#F59E0B',
  heroFrom: '#0D9488',
  heroTo: '#14B8A6',
  heroMid: '#2DD4BF',
};

const statusColors = {
  'Quick Request': { bg: '#fef3c7', text: '#92400e' },
  pending: { bg: '#fef3c7', text: '#92400e' },
  confirmed: { bg: '#dbeafe', text: '#1e40af' },
  'in-progress': { bg: '#dcfce7', text: '#166534' },
  completed: { bg: '#e0e7ff', text: '#3730a3' },
  cancelled: { bg: '#fee2e2', text: '#991b1b' },
};

export default function PhysioDashboard() {
  const t = useT();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
      setBookings(data);
    } catch {
      setBookings([]);
    }
  }, []);

  const tabs = [
    { id: 'upcoming', label: t('upcoming.sessions', 'Upcoming Sessions'), icon: '📅' },
    { id: 'treatment', label: t('treatment.plan', 'Treatment Plan'), icon: '📋' },
    { id: 'progress', label: t('progress', 'Progress'), icon: '📈' },
    { id: 'payments', label: t('payments', 'Payments'), icon: '💰' },
  ];

  const upcomingBookings = bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  const handleCancel = async (id) => { if (!(await confirmDialog(t('cancel.confirm', 'Cancel this session?')))) return;
    const next = bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b);
    setBookings(next);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(next));
  };

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${C.heroFrom} 0%, ${C.heroMid} 50%, ${C.heroTo} 100%)`, padding: '28px 0 32px' }}>
        <div className="container">
          <Link to="/physiotherapy" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textDecoration: 'none', display: 'inline-block', marginBottom: 10 }}>← {t('back.to.physiotherapy', 'Back to Physiotherapy')}</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 32 }}>{'📊'}</span>
            <div>
              <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: 0 }}>{t('my.physio.sessions', 'My Physio Sessions')}</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, margin: '2px 0 0' }}>{t('track.sessions.plans', 'Track your sessions, plans, and progress')}</p>
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
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>{t('no.upcoming.sessions', 'No Upcoming Sessions')}</h3>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>{t('no.upcoming.desc', 'You have no upcoming physiotherapy sessions. Book one now to start your recovery journey.')}</p>
                <Link to="/physiotherapy/book" style={{ height: 44, padding: '0 24px', borderRadius: 8, border: 'none', background: C.primary, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>{t('book.session', 'Book Session')} →</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {upcomingBookings.slice().reverse().map(b => {
                  const sc = statusColors[b.status] || { bg: '#f1f5f9', text: '#475569' };
                  return (
                    <div key={b.id} style={{ padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <span style={{ fontSize: 16 }}>{'🩻'}</span>
                            <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#0f172a' }}>{b.therapistName || b.therapist || t('therapist.assigned', 'Therapist Assigned')}</h4>
                            <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: sc.bg, color: sc.text }}>{b.status}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#64748b', flexWrap: 'wrap' }}>
                            <span>{'📅'} {b.date || b.appointmentDate || '-'}</span>
                            <span>{'⏰'} {b.time || b.appointmentSlot || '-'}</span>
                            <span>{'🏠'} {b.mode ? (b.mode.charAt(0).toUpperCase() + b.mode.slice(1)) : '-'}</span>
                            {b.condition && <span>{'🩺'} {b.condition}</span>}
                          </div>
                        </div>
                        {b.status !== 'cancelled' && (
                          <button onClick={() => handleCancel(b.id)}
                            style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #fee2e2', background: '#fff', cursor: 'pointer', fontSize: 10, fontWeight: 600, fontFamily: 'inherit', color: '#dc2626' }}>
                            {t('cancel', 'Cancel')}
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

        {activeTab === 'treatment' && (
          <div>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>{'📋'}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>{t('no.treatment.plan', 'No Treatment Plan Yet')}</h3>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>{t('no.treatment.desc', 'Your personalized treatment plan will appear here after your first session.')}</p>
                <Link to="/physiotherapy" style={{ height: 44, padding: '0 24px', borderRadius: 8, border: 'none', background: C.primary, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>{t('explore.services', 'Explore Services')}</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {bookings.slice().reverse().map(b => {
                  const exercises = b.exercises || [
                    { name: t('assessment.exercise', 'Initial Assessment & Evaluation'), status: b.status === 'completed' ? 'done' : 'pending' },
                    { name: t('stretching.exercise', 'Stretching & Mobility Exercises'), status: 'pending' },
                    { name: t('strength.exercise', 'Strengthening Routine'), status: 'pending' },
                  ];
                  return (
                    <div key={b.id} style={{ padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{t('session.from', 'Session from')} {b.date || b.appointmentDate || '-'}</div>
                      <div style={{ display: 'grid', gap: 6 }}>
                        {exercises.map((ex, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 6, background: ex.status === 'done' ? '#F0FDF4' : '#f8fafc' }}>
                            <span style={{ color: ex.status === 'done' ? '#16a34a' : '#94a3b8', fontSize: 14 }}>{ex.status === 'done' ? '✓' : '○'}</span>
                            <span style={{ fontSize: 12, color: '#0f172a', flex: 1 }}>{ex.name}</span>
                            <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: ex.status === 'done' ? '#dcfce7' : '#f1f5f9', color: ex.status === 'done' ? '#166534' : '#64748b', fontWeight: 600 }}>
                              {ex.status === 'done' ? t('done', 'Done') : t('pending', 'Pending')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'progress' && (
          <div>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>{'📈'}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>{t('no.progress.data', 'No Progress Data Yet')}</h3>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>{t('no.progress.desc', 'Your pain score history and recovery timeline will appear here after your sessions.')}</p>
                <Link to="/physiotherapy" style={{ height: 44, padding: '0 24px', borderRadius: 8, border: 'none', background: C.primary, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>{t('learn.more', 'Learn More')}</Link>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>{t('pain.score.history', 'Your pain score history from assessments:')}</p>
                <div style={{ position: 'relative', paddingLeft: 20 }}>
                  <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 2, background: C.primaryLight }} />
                  {bookings.slice().reverse().map((b, i) => {
                    const painScore = b.painScore ?? null;
                    const scoreLabel = painScore !== null
                      ? (painScore <= 3 ? t('mild', 'Mild') : painScore <= 6 ? t('moderate', 'Moderate') : t('severe', 'Severe'))
                      : t('not.recorded', 'Not recorded');
                    const dotColor = painScore !== null
                      ? (painScore <= 3 ? '#22c55e' : painScore <= 6 ? '#f59e0b' : '#ef4444')
                      : '#94a3b8';
                    return (
                      <div key={b.id} style={{ position: 'relative', padding: '0 0 16px 24px' }}>
                        <div style={{ position: 'absolute', left: -16, top: 4, width: 14, height: 14, borderRadius: '50%', background: dotColor, border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{t('session', 'Session')} {i + 1}</div>
                        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>{b.date || b.appointmentDate || '-'}</div>
                        <div style={{ display: 'flex', gap: 8, fontSize: 11 }}>
                          <span style={{ fontWeight: 600 }}>{t('pain', 'Pain')}: {painScore !== null ? `${painScore}/10 (${scoreLabel})` : scoreLabel}</span>
                          {b.mode && <span>{'·'} {b.mode}</span>}
                        </div>
                        {b.notes && <p style={{ fontSize: 10, color: '#64748b', margin: '2px 0 0', fontStyle: 'italic' }}>{b.notes}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>{'💰'}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>{t('no.payments', 'No Payment History')}</h3>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>{t('no.payments.desc', 'Your payment history for physiotherapy sessions will appear here once you book.')}</p>
                <Link to="/physiotherapy/book" style={{ height: 44, padding: '0 24px', borderRadius: 8, border: 'none', background: C.primary, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>{t('book.now')} →</Link>
              </div>
            ) : (
              <div>
                <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, minWidth: 500 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('booking.id', 'Booking ID')}</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('amount', 'Amount')}</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>{t('date', 'Date')}</th>
                        <th style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 600, color: '#475569' }}>{t('status', 'Status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice().reverse().map(b => {
                        const sc = statusColors[b.status] || { bg: '#f1f5f9', text: '#475569' };
                        return (
                          <tr key={b.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td style={{ padding: '8px 10px', fontWeight: 600, color: C.primary, fontSize: 10 }}>{b.id || '-'}</td>
                            <td style={{ padding: '8px 10px', fontWeight: 700, color: '#059669' }}>₹{b.amount || 0}</td>
                            <td style={{ padding: '8px 10px', color: '#64748b' }}>{b.date || b.createdAt ? new Date(b.createdAt || b.date).toLocaleDateString('en-IN') : '-'}</td>
                            <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                              <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: sc.bg, color: sc.text, textTransform: 'capitalize' }}>{b.status}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 16 }}>
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
