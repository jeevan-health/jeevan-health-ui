import { useState } from 'react';
import { useT } from '../../i18n/LanguageProvider';
const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function NurseSchedule() {
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i); return d;
  });
  const days = [t('role.nurseSchedule.sun', 'Sun'), t('role.nurseSchedule.mon', 'Mon'), t('role.nurseSchedule.tue', 'Tue'), t('role.nurseSchedule.wed', 'Wed'), t('role.nurseSchedule.thu', 'Thu'), t('role.nurseSchedule.fri', 'Fri'), t('role.nurseSchedule.sat', 'Sat')];
  const t = useT();
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{t('role.nurseSchedule.title', '📅 Schedule')}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{t('role.nurseSchedule.subtitle', 'Your nursing shifts and patient visits')}</p>
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))' }}>
        {week.map((d, i) => (
          <div key={i} style={{ ...card, padding: 12, textAlign: 'center', marginBottom: 0, border: i === 0 ? '2px solid #0891b2' : '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>{days[d.getDay()]}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>{d.getDate()}</div>
            <div style={{ fontSize: 10, color: i === 0 ? '#0891b2' : '#94a3b8' }}>{i === 0 ? t('role.nurseSchedule.today', 'Today') : ''}</div>
          </div>
        ))}
      </div>
      <div style={{ ...card, marginTop: 16 }}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>{t('role.nurseSchedule.todaysPlan', "Today's Plan")}</h4>
        <div style={{ fontSize: 13, color: '#64748b' }}>{t('role.nurseSchedule.shift', 'Shift: 7:00 AM - 3:00 PM')}</div>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{t('role.nurseSchedule.visits', 'Patient visits scheduled: 3')}</div>
      </div>
    </div>
  );
}