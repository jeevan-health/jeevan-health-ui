import { useState } from 'react';
import { menstrualCycle, pregnancyDueDate, getRecommendedTests } from '../../utils/healthCalculations';
import useHealthToolsStore from '../../stores/healthToolsStore';
import useCartStore from '../../stores/cartStore';
import { useT } from '../../i18n/LanguageProvider';

export default function WomenHealth() {
  const t = useT();
  const [tab, setTab] = useState('cycle');
  const [lmp, setLmp] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [periodDuration, setPeriodDuration] = useState('5');
  const addItem = useCartStore(s => s.addItem);
  const pregnancyData = useHealthToolsStore(s => s.pregnancyData);
  const updatePregnancy = useHealthToolsStore(s => s.updatePregnancy);

  const cycle = menstrualCycle(lmp, cycleLength, periodDuration);
  const due = pregnancyDueDate(lmp, cycleLength);
  const recs = getRecommendedTests(tab === 'pregnancy' ? 'pregnancy' : 'women');

  const btnStyle = { padding: '6px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#334155' };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[
          { key: 'cycle', label: `📅 ${t('women.cycleCalculator', 'Cycle Calculator')}`, color: '#EC4899' },
          { key: 'pregnancy', label: `🤰 ${t('women.dueDate', 'Due Date')}`, color: '#8B5CF6' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            ...btnStyle, flex: 1, background: tab === t.key ? t.color : '#fff',
            color: tab === t.key ? '#fff' : '#334155', border: tab === t.key ? 'none' : '1px solid #e2e8f0',
            fontWeight: tab === t.key ? 700 : 400,
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'cycle' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>{t('women.lastPeriod', 'Last Period Start')}</label>
              <input className="input" type="date" value={lmp} onChange={e => setLmp(e.target.value)} style={{ fontSize: 12 }} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>{t('women.cycleLength', 'Cycle Length (days)')}</label>
              <input className="input" type="number" value={cycleLength} onChange={e => setCycleLength(e.target.value)} style={{ fontSize: 12 }} min="21" max="35" />
            </div>
            <div>
              <label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>{t('women.periodDuration', 'Period Duration (days)')}</label>
              <input className="input" type="number" value={periodDuration} onChange={e => setPeriodDuration(e.target.value)} style={{ fontSize: 12 }} min="3" max="10" />
            </div>
          </div>

          {cycle && (
            <div style={{ background: '#fdf2f8', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: t('women.nextPeriod', 'Next Period'), value: cycle.nextPeriod?.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), icon: '📅' },
                  { label: t('women.ovulation', 'Ovulation'), value: cycle.ovulation?.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' }), icon: '🥚' },
                  { label: t('women.fertileWindow', 'Fertile Window'), value: `${cycle.fertileStart?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} – ${cycle.fertileEnd?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`, icon: '🌱' },
                  { label: t('women.pmsStart', 'PMS Start'), value: cycle.pmsStart?.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' }), icon: '💫' },
                ].map(item => (
                  <div key={item.label} style={{ padding: '8px 12px', background: '#fff', borderRadius: 10 }}>
                    <div style={{ fontSize: 10, color: '#be185d', fontWeight: 600 }}>{item.icon} {item.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>{item.value || '—'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'pregnancy' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>{t('women.lastMenstrual', 'Last Menstrual Period')}</label>
              <input className="input" type="date" value={lmp} onChange={e => setLmp(e.target.value)} style={{ fontSize: 12 }} />
            </div>
            <div>
              <label style={{ fontSize: 10, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 2 }}>{t('women.cycleLengthPreg', 'Cycle Length (days)')}</label>
              <input className="input" type="number" value={cycleLength} onChange={e => setCycleLength(e.target.value)} style={{ fontSize: 12 }} />
            </div>
          </div>

          {due && (
            <div style={{ background: '#f5f3ff', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: '#6d28d9', fontWeight: 600 }}>{t('women.expectedDelivery', 'EXPECTED DELIVERY DATE')}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#4c1d95' }}>{due.dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ textAlign: 'center', padding: '8px', background: '#fff', borderRadius: 10 }}>
                  <div style={{ fontSize: 10, color: '#6d28d9' }}>{t('women.pregnancyWeek', 'Pregnancy Week')}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{due.weeks}w {due.days}d</div>
                </div>
                <div style={{ textAlign: 'center', padding: '8px', background: '#fff', borderRadius: 10 }}>
                  <div style={{ fontSize: 10, color: '#6d28d9' }}>{t('women.trimester', 'Trimester')}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: due.trimester.color }}>{due.trimester.label}</div>
                </div>
              </div>
            </div>
          )}

          {/* Pregnancy Tracker */}
          <div style={{ background: '#f0fdf4', borderRadius: 10, padding: 12, marginBottom: 16, border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#166534', marginBottom: 8 }}>🤰 {t('women.pregnancyTracker', 'Pregnancy Health Tracker')}</div>
            <div style={{ fontSize: 11, color: '#166534', lineHeight: 1.7 }}>
              <div>✅ {t('women.tracker1', 'Track weight gain, blood pressure, and blood sugar regularly')}</div>
              <div>✅ {t('women.tracker2', 'Monitor baby growth milestones during each trimester')}</div>
              <div>✅ {t('women.tracker3', 'Keep a record of all doctor visits and vaccinations')}</div>
              <div>✅ {t('women.tracker4', 'Schedule regular antenatal check-ups as recommended')}</div>
            </div>
          </div>

          {due && (
            <div style={{ background: '#fff7ed', borderRadius: 10, padding: 12, border: '1px solid #fed7aa' }}>
              <div style={{ fontSize: 11, color: '#9a3412', marginBottom: 4 }}>📋 {t('women.recommendedPrenatal', 'Recommended Prenatal Tests')}</div>
              <div style={{ fontSize: 11, color: '#78350f', lineHeight: 1.6 }}>
                {t('women.prenatalDesc', 'Based on your stage of pregnancy, consider: CBC, Blood Group & Rh, Blood Sugar, Thyroid Profile, Urine Routine, Vitamin D')}
              </div>
            </div>
          )}
        </>
      )}

      {/* Recommendations */}
      {recs && recs.tests.length > 0 && (
        <div style={{ background: '#fdf8f0', borderRadius: 10, padding: 12, border: '1px solid #fde68a', marginTop: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', marginBottom: 6 }}>🩺 {t('women.healthScreening', 'Health Screening')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
            {recs.tests.map(t => (
              <div key={t.name} style={{ fontSize: 12, color: '#334155' }}>✔ {t.name} <span style={{ fontSize: 10, color: '#94a3b8' }}>— {t.reason}</span></div>
            ))}
          </div>
          <button onClick={() => recs.tests.forEach(t => addItem({ id: t.name, type: 'test', name: t.name, price: t.price, offerPrice: t.price }))} style={{ ...btnStyle, width: '100%', background: '#1866C9', color: '#fff', border: 'none', fontWeight: 600 }}>
            🛒 {t('women.bookTests', 'Book Tests')} (₹{recs.totalCost})
          </button>
        </div>
      )}
    </div>
  );
}
