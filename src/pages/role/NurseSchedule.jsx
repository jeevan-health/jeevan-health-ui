import { useState, useMemo } from 'react';
import { useT } from '../../i18n/LanguageProvider';
import useAuthStore from '../../stores/authStore';

const C = {
  teal: '#0891b2',
  tealLight: '#ecfeff',
  tealBg: '#e0f2fe',
  slate: '#0f172a',
  gray: '#64748b',
  lightGray: '#94a3b8',
  border: '#e2e8f0',
  white: '#fff',
  green: '#22C55E',
  orange: '#F59E0B',
  red: '#EF4444',
  greenBg: '#f0fdf4',
  orangeBg: '#fffbeb',
  redBg: '#fef2f2',
  cardBg: '#f8fafc',
};

const STATUS_STYLES = {
  Confirmed: { bg: C.tealBg, color: C.teal },
  'In Progress': { bg: C.orangeBg, color: C.orange },
  Completed: { bg: C.greenBg, color: C.green },
  Cancelled: { bg: C.redBg, color: C.red },
};

const STATUS_ICONS = {
  Confirmed: '✓',
  'In Progress': '⟳',
  Completed: '✓',
  Cancelled: '✕',
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SERVICE_ICONS = {
  'General Nursing Care': '🏥',
  'Wound Care': '🩹',
  'Injections': '💉',
  'Catheter Care': '📋',
  'Post-Surgery Care': '🔬',
  'Elderly Care': '👴',
  'IV Therapy': '💧',
  'Bedside Care': '🛏️',
  'Vaccination': '🌡️',
  'Health Checkup': '🩺',
};

const TIME_SLOTS = [
  { key: 'morning', label: 'Morning', time: '6:00 AM - 12:00 PM', start: 6, end: 12 },
  { key: 'afternoon', label: 'Afternoon', time: '12:00 PM - 5:00 PM', start: 12, end: 17 },
  { key: 'evening', label: 'Evening', time: '5:00 PM - 9:00 PM', start: 17, end: 21 },
];

const loadBookings = () => { try { return JSON.parse(localStorage.getItem('jh_nursing_bookings') || '[]'); } catch { return []; } };

const formatDateStr = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const to24h = (timeStr) => {
  if (!timeStr) return 12;
  const [h, m] = timeStr.split(':').map(Number);
  if (timeStr.toLowerCase().includes('pm') && h !== 12) return h + 12;
  if (timeStr.toLowerCase().includes('am') && h === 12) return 0;
  return h;
};

const getTimeSlot = (timeStr) => {
  const h = to24h(timeStr);
  if (h >= 6 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  return 'evening';
};

export default function NurseSchedule() {
  const t = useT();
  const user = useAuthStore(s => s.user);
  const nurseName = user?.name || '';

  const today = new Date();
  const todayStr = formatDateStr(today);

  const [selectedDay, setSelectedDay] = useState(todayStr);

  const bookings = loadBookings();

  const nurseBookings = useMemo(() =>
    bookings.filter(b => {
      if (!nurseName) return true;
      const bn = (b.nurseName || b.nurse || b.assignedTo || '').toLowerCase();
      return bn.includes(nurseName.toLowerCase());
    }),
    [bookings, nurseName]
  );

  const weekDates = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      return d;
    }),
    []
  );

  const visitsByDay = useMemo(() => {
    const map = {};
    nurseBookings.forEach(b => {
      const d = b.date || b.visitDate || b.scheduledDate;
      if (d) {
        if (!map[d]) map[d] = [];
        map[d].push(b);
      }
    });
    return map;
  }, [nurseBookings]);

  const selectedVisits = useMemo(() => {
    const dayVisits = visitsByDay[selectedDay] || [];
    const morning = [];
    const afternoon = [];
    const evening = [];
    dayVisits.forEach(b => {
      const slot = getTimeSlot(b.time || b.startTime || '12:00');
      const entry = {
        id: b.id || Math.random().toString(36).slice(2),
        time: b.time || b.startTime || '--:--',
        patientName: b.patientName || b.patient || b.name || 'Unknown',
        service: b.service || b.serviceName || b.serviceType || 'Nursing Care',
        serviceIcon: SERVICE_ICONS[b.service || b.serviceName] || '🏥',
        address: b.address || b.location || b.patientAddress || 'Address not available',
        duration: b.duration || b.visitDuration || '30 min',
        status: b.status || 'Confirmed',
        phone: b.phone || b.patientPhone || b.contact || '',
        notes: b.notes || b.instructions || '',
      };
      if (slot === 'morning') morning.push(entry);
      else if (slot === 'afternoon') afternoon.push(entry);
      else evening.push(entry);
    });
    return { morning, afternoon, evening };
  }, [selectedDay, visitsByDay]);

  const weekVisitCounts = useMemo(() => {
    const counts = {};
    weekDates.forEach(d => {
      const ds = formatDateStr(d);
      counts[ds] = (visitsByDay[ds] || []).length;
    });
    return counts;
  }, [weekDates, visitsByDay]);

  const todayVisits = useMemo(() => {
    const v = visitsByDay[todayStr] || [];
    const completed = v.filter(b => b.status === 'Completed').length;
    const cancelled = v.filter(b => b.status === 'Cancelled').length;
    const inProgress = v.filter(b => b.status === 'In Progress').length;
    return { total: v.length, completed, cancelled, inProgress, pending: v.length - completed - cancelled };
  }, [visitsByDay, todayStr]);

  const weekStats = useMemo(() => {
    let total = 0, completed = 0, cancelled = 0, onTime = 0, totalWithTime = 0;
    weekDates.forEach(d => {
      const ds = formatDateStr(d);
      const v = visitsByDay[ds] || [];
      v.forEach(b => {
        total++;
        if (b.status === 'Completed') completed++;
        if (b.status === 'Cancelled') cancelled++;
        if (b.status === 'Completed' || b.status === 'In Progress') {
          totalWithTime++;
          const expectedH = to24h(b.time || b.startTime || '09:00');
          const actualH = to24h(b.actualStartTime || b.startTime || b.time || '09:00');
          if (Math.abs(expectedH - actualH) <= 1) onTime++;
        }
      });
    });
    return { total, completed, cancelled, onTimeRate: totalWithTime > 0 ? Math.round((onTime / totalWithTime) * 100) : 100 };
  }, [weekDates, visitsByDay]);

  const selectedDateObj = weekDates.find(d => formatDateStr(d) === selectedDay) || today;
  const isToday = selectedDay === todayStr;

  const getStatusStyle = (status) => STATUS_STYLES[status] || STATUS_STYLES.Confirmed;
  const getStatusIcon = (status) => STATUS_ICONS[status] || '•';

  const allVisitsToday = [...selectedVisits.morning, ...selectedVisits.afternoon, ...selectedVisits.evening];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.slate, margin: 0 }}>{t('role.nurseSchedule.title', 'Schedule')}</h2>
          <p style={{ fontSize: 13, color: C.gray, margin: '2px 0 0' }}>
            {t('role.nurseSchedule.subtitle', 'Your patient visits and shifts')}
          </p>
        </div>
        {allVisitsToday.length > 0 && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: C.gray }}>
              {t('role.nurseSchedule.viewing', 'Viewing')}:
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>
              {isToday ? t('role.nurseSchedule.today', 'Today') : `${WEEKDAYS[selectedDateObj.getDay()]}, ${selectedDateObj.getDate()} ${MONTHS[selectedDateObj.getMonth()]}`}
            </span>
          </div>
        )}
      </div>

      {allVisitsToday.length > 0 && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 180px', background: C.white, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: C.tealLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🕐</div>
              <div>
                <div style={{ fontSize: 11, color: C.gray }}>{t('role.nurseSchedule.currentShift', 'Current Shift')}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.slate }}>7:00 AM - 3:00 PM</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: C.gray, borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>
              <span>{t('role.nurseSchedule.break', 'Break')}: 12:00 PM - 12:30 PM</span>
              <span style={{ color: C.teal, fontWeight: 600 }}>{t('role.nurseSchedule.active', 'Active')}</span>
            </div>
          </div>

          <div style={{ flex: '1 1 180px', background: C.white, borderRadius: 12, padding: 16, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, color: C.gray, marginBottom: 6 }}>{t('role.nurseSchedule.todayOverview', "Today's Overview")}</div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.teal }}>{todayVisits.total}</div>
                <div style={{ fontSize: 10, color: C.gray }}>{t('role.nurseSchedule.totalVisits', 'Total')}</div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.green }}>{todayVisits.completed}</div>
                <div style={{ fontSize: 10, color: C.gray }}>{t('role.nurseSchedule.completed', 'Done')}</div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.orange }}>{todayVisits.pending}</div>
                <div style={{ fontSize: 10, color: C.gray }}>{t('role.nurseSchedule.pending', 'Pending')}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, fontSize: 12, fontWeight: 600, color: C.gray }}>
          {t('role.nurseSchedule.weekView', 'Week View')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0 }}>
          {weekDates.map((d, i) => {
            const ds = formatDateStr(d);
            const count = weekVisitCounts[ds] || 0;
            const isSelected = ds === selectedDay;
            const dayIsToday = ds === todayStr;
            return (
              <button
                key={i}
                onClick={() => setSelectedDay(ds)}
                style={{
                  all: 'unset', cursor: 'pointer', padding: '12px 4px', textAlign: 'center',
                  borderRight: i < 6 ? `1px solid ${C.border}` : 'none',
                  borderBottom: `1px solid ${C.border}`,
                  background: isSelected ? C.tealLight : C.white,
                  transition: 'all 0.15s',
                  position: 'relative',
                }}
              >
                <div style={{ fontSize: 11, color: isSelected ? C.teal : C.gray, fontWeight: isSelected ? 600 : 400 }}>
                  {t(`role.nurseSchedule.day.${i}`, WEEKDAYS[d.getDay()])}
                </div>
                <div style={{
                  fontSize: 16, fontWeight: 700, color: isSelected ? C.teal : C.slate,
                  margin: '4px 0',
                  width: 32, height: 32, lineHeight: '32px', borderRadius: '50%',
                  display: 'inline-block',
                  background: dayIsToday && !isSelected ? C.tealLight : 'transparent',
                  border: dayIsToday ? `2px solid ${C.teal}` : '2px solid transparent',
                }}>
                  {d.getDate()}
                </div>
                <div style={{ fontSize: 10, color: isSelected ? C.teal : C.lightGray, marginTop: 2 }}>
                  {count > 0
                    ? `${count} ${t('role.nurseSchedule.visit', count > 1 ? 'visits' : 'visit')}`
                    : t('role.nurseSchedule.noVisits', '—')}
                </div>
                {dayIsToday && !isSelected && (
                  <div style={{
                    position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)',
                    width: 4, height: 4, borderRadius: '50%', background: C.teal,
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {allVisitsToday.length === 0 ? (
        <div style={{
          background: C.white, borderRadius: 12, border: `1px solid ${C.border}`,
          textAlign: 'center', padding: '60px 20px',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: C.slate, margin: '0 0 4px' }}>
            {t('role.nurseSchedule.emptyTitle', 'No Visits Scheduled')}
          </h3>
          <p style={{ fontSize: 13, color: C.gray, margin: 0 }}>
            {isToday
              ? t('role.nurseSchedule.emptyToday', "You have no patient visits scheduled for today. Enjoy your day off!")
              : t('role.nurseSchedule.emptyDay', 'No visits scheduled for this day.')}
          </p>
        </div>
      ) : (
        <>
          {TIME_SLOTS.map(slot => {
            const visits = selectedVisits[slot.key];
            if (!visits.length) return null;
            return (
              <div key={slot.key} style={{ marginBottom: 20 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
                  paddingLeft: 4,
                }}>
                  <div style={{ width: 4, height: 20, borderRadius: 2, background: C.teal }} />
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.slate }}>
                    {t(`role.nurseSchedule.slot.${slot.key}`, slot.label)}
                  </div>
                  <div style={{ fontSize: 11, color: C.gray }}>
                    ({slot.time})
                  </div>
                  <div style={{
                    fontSize: 11, fontWeight: 600, color: C.teal,
                    background: C.tealLight, borderRadius: 10, padding: '2px 8px',
                  }}>
                    {visits.length} {t('role.nurseSchedule.visits', 'visits')}
                  </div>
                </div>

                {visits.map((v) => {
                  const sStyle = getStatusStyle(v.status);
                  return (
                    <div
                      key={v.id}
                      style={{
                        background: C.white, borderRadius: 12, border: `1px solid ${C.border}`,
                        padding: 16, marginBottom: 10,
                        transition: 'box-shadow 0.15s',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ minWidth: 48, textAlign: 'center' }}>
                          <div style={{
                            fontSize: 13, fontWeight: 700, color: C.teal,
                            background: C.tealLight, borderRadius: 8, padding: '6px 10px',
                            display: 'inline-block',
                          }}>
                            {v.time}
                          </div>
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 600, color: C.slate, marginBottom: 2 }}>
                            {v.patientName}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: C.gray, marginBottom: 6 }}>
                            <span>{v.serviceIcon}</span>
                            <span>{v.service}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: C.gray, flexWrap: 'wrap' }}>
                            <span>📍 {v.address}</span>
                            <span>⏱ {v.duration}</span>
                          </div>
                          {v.notes && (
                            <div style={{ fontSize: 11, color: C.gray, marginTop: 6, fontStyle: 'italic', background: C.cardBg, borderRadius: 6, padding: '6px 8px' }}>
                              📝 {v.notes}
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 6,
                            background: sStyle.bg, color: sStyle.color, whiteSpace: 'nowrap',
                          }}>
                            <span>{getStatusIcon(v.status)}</span>
                            <span>{v.status}</span>
                          </div>

                          <div style={{ display: 'flex', gap: 4 }}>
                            <button
                              style={{
                                padding: '5px 12px', borderRadius: 6, border: `1px solid ${C.teal}`,
                                background: C.teal, color: C.white, fontSize: 11, fontWeight: 600,
                                cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s',
                              }}
                              onClick={() => {}}
                            >
                              {t('role.nurseSchedule.start', 'Start')}
                            </button>
                            <button
                              style={{
                                padding: '5px 12px', borderRadius: 6, border: `1px solid ${C.border}`,
                                background: C.white, color: C.slate, fontSize: 11, fontWeight: 600,
                                cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s',
                              }}
                              onClick={() => {
                                if (v.phone) window.location.href = `tel:${v.phone}`;
                              }}
                            >
                              {t('role.nurseSchedule.call', 'Call')}
                            </button>
                            <button
                              style={{
                                padding: '5px 12px', borderRadius: 6, border: `1px solid ${C.border}`,
                                background: C.white, color: C.slate, fontSize: 11, fontWeight: 600,
                                cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s',
                              }}
                              onClick={() => {
                                const q = encodeURIComponent(v.address);
                                window.open(`https://www.google.com/maps/search/${q}`, '_blank');
                              }}
                            >
                              {t('role.nurseSchedule.navigate', 'Navigate')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </>
      )}

      {allVisitsToday.length > 0 && (
        <div style={{
          background: C.white, borderRadius: 12, border: `1px solid ${C.border}`,
          padding: 16, marginBottom: 20,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.gray, marginBottom: 12 }}>
            {t('role.nurseSchedule.weekStats', 'This Week Summary')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <div style={{ textAlign: 'center', padding: '8px 0', borderRight: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.teal }}>{weekStats.total}</div>
              <div style={{ fontSize: 11, color: C.gray }}>{t('role.nurseSchedule.totalVisits', 'Total Visits')}</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px 0', borderRight: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.green }}>{weekStats.completed}</div>
              <div style={{ fontSize: 11, color: C.gray }}>{t('role.nurseSchedule.completed', 'Completed')}</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px 0', borderRight: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.red }}>{weekStats.cancelled}</div>
              <div style={{ fontSize: 11, color: C.gray }}>{t('role.nurseSchedule.cancelled', 'Cancelled')}</div>
            </div>
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.green }}>{weekStats.onTimeRate}%</div>
              <div style={{ fontSize: 11, color: C.gray }}>{t('role.nurseSchedule.onTimeRate', 'On-Time Rate')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
