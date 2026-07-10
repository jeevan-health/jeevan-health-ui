import React, { useState, useMemo, useEffect } from 'react';
import useDailyActivityStore, { computeDailyScore } from '../stores/dailyActivityStore';
import { useT } from '../i18n/LanguageProvider';

const fmtDate = (iso) => { const d = new Date(iso + 'T00:00:00'); return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); };

function ScoreCircle({ score, size = 100, t }) {
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? '#16a34a' : score >= 75 ? '#22C55E' : score >= 50 ? '#EAB308' : '#EF4444';
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#e8edf2" strokeWidth="8" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeLinecap="round" transform="rotate(-90 50 50)"
        strokeDasharray={circumference} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      <text x="50" y="48" textAnchor="middle" fontSize="22" fontWeight="800" fill="#1e293b">{score}</text>
      <text x="50" y="64" textAnchor="middle" fontSize="8" fill="#94a3b8">{t('dailyTracker.outOf100', '/ 100')}</text>
    </svg>
  );
}

function ProgressBar({ value, max, color = '#1866C9', height = 6 }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ height, background: '#e8edf2', borderRadius: height / 2, overflow: 'hidden', width: '100%' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: height / 2, transition: 'width 0.4s ease' }} />
    </div>
  );
}

function ActivityRow({ icon, label, score, max, color, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8edf2', padding: '12px 14px', marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{score}/{max}</span>
      </div>
      {children}
    </div>
  );
}

function TrackerSection({ title, icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 10 }}>
      <button onClick={() => setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 14px', background: '#f8f9fa', border: '1px solid #e8edf2', borderRadius: 10, fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'left', color: '#1e293b' }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ flex: 1 }}>{title}</span>
        <span style={{ fontSize: 12, color: '#94a3b8', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
      </button>
      {open && <div style={{ padding: '10px 0' }}>{children}</div>}
    </div>
  );
}

function StepsTracker({ steps, onUpdate }) {
  const t = useT();
  const canAdd = [500, 1000, 2000, 5000];
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1866C9' }}>{steps.count.toLocaleString()}</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{t('dailyTracker.ofSteps', 'of')} {steps.goal.toLocaleString()} {t('dailyTracker.steps', 'steps')}</div>
        </div>
        <div style={{ flex: 1 }}>
          <ProgressBar value={steps.count} max={steps.goal} color={steps.count >= steps.goal ? '#16a34a' : '#1866C9'} height={8} />
          <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>
            {steps.count >= steps.goal ? t('dailyTracker.goalReached', 'Goal reached! 🎉') : `${(steps.goal - steps.count).toLocaleString()} ${t('dailyTracker.moreToGoal', 'more to goal')}`}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {canAdd.map(n => (
          <button key={n} onClick={() => onUpdate('steps', { count: Math.min(steps.count + n, 20000) })}
            style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e8edf2', background: '#f8f9fa', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
            +{n.toLocaleString()}
          </button>
        ))}
        <button onClick={() => onUpdate('steps', { count: 0 })}
          style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #ef4444', background: '#fff', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: '#ef4444' }}>
          {t('dailyTracker.reset', 'Reset')}
        </button>
      </div>
    </div>
  );
}

function WaterTracker({ water, onUpdate }) {
  const t = useT();
  const glasses = [];
  for (let i = 0; i < water.goal; i++) {
    glasses.push(
      <button key={i} onClick={() => onUpdate('water', { glasses: i < water.glasses ? i : i + 1 })}
        style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid', borderColor: i < water.glasses ? '#3B82F6' : '#e8edf2', background: i < water.glasses ? '#EFF6FF' : '#fff', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {i < water.glasses ? '💧' : '○'}
      </button>
    );
  }
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#3B82F6' }}>{water.glasses} <span style={{ fontSize: 13, color: '#94a3b8' }}>/ {water.goal}</span></div>
        <div style={{ flex: 1 }}>
          <ProgressBar value={water.glasses} max={water.goal} color="#3B82F6" height={8} />
          <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>
            {water.glasses >= water.goal ? t('dailyTracker.hydrationMet', 'Hydration goal met! 💧') : `${water.goal - water.glasses} ${t('dailyTracker.moreGlasses', 'more glasses')}`}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{glasses}</div>
    </div>
  );
}

function SleepTracker({ sleep, onUpdate }) {
  const t = useT();
  const hours = [5, 6, 7, 8, 9, 10];
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#7C3AED' }}>{sleep.hours}h</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: sleep.hours >= 7 && sleep.hours <= 9 ? '#16a34a' : '#EAB308' }}>
            {sleep.hours >= 7 && sleep.hours <= 9 ? t('dailyTracker.sleepExcellent', '🟢 Excellent') : sleep.hours >= 6 ? t('dailyTracker.sleepFair', '🟡 Fair') : t('dailyTracker.sleepLow', '🔴 Low')}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {hours.map(h => (
          <button key={h} onClick={() => onUpdate('sleep', { hours: h })}
            style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e8edf2', background: sleep.hours === h ? '#EDE9FE' : '#f8f9fa', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: sleep.hours === h ? 700 : 400, color: sleep.hours === h ? '#7C3AED' : '#1e293b' }}>
            {h}h
          </button>
        ))}
      </div>
    </div>
  );
}

function NutritionTracker({ nutrition, onUpdate }) {
  const t = useT();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 500, minWidth: 80 }}>{t('dailyTracker.fruits', '🍎 Fruits')}</span>
        <button onClick={() => onUpdate('nutrition', { fruits: !nutrition.fruits })}
          style={{ padding: '4px 16px', borderRadius: 8, border: 'none', background: nutrition.fruits ? '#DCFCE7' : '#F3F4F6', color: nutrition.fruits ? '#16a34a' : '#6B7280', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          {nutrition.fruits ? t('dailyTracker.yes', '✅ Yes') : t('dailyTracker.no', '❌ No')}
        </button>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 500, minWidth: 80 }}>{t('dailyTracker.vegetables', '🥦 Vegetables')}</span>
        <button onClick={() => onUpdate('nutrition', { vegetables: !nutrition.vegetables })}
          style={{ padding: '4px 16px', borderRadius: 8, border: 'none', background: nutrition.vegetables ? '#DCFCE7' : '#F3F4F6', color: nutrition.vegetables ? '#16a34a' : '#6B7280', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          {nutrition.vegetables ? t('dailyTracker.yes', '✅ Yes') : t('dailyTracker.no', '❌ No')}
        </button>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 500, minWidth: 80 }}>{t('dailyTracker.junkFood', '🍔 Junk Food')}</span>
        <div style={{ display: 'flex', gap: 4 }}>
              {['never', 'sometimes', 'frequent'].map(opt => {
                const optLabels = { never: t('dailyTracker.never', 'never'), sometimes: t('dailyTracker.sometimes', 'sometimes'), frequent: t('dailyTracker.frequent', 'frequent') };
                return (
                <button key={opt} onClick={() => onUpdate('nutrition', { junkFood: opt })}
                  style={{ padding: '4px 10px', borderRadius: 8, border: '1px solid #e8edf2', background: nutrition.junkFood === opt ? '#FEF3C7' : '#f8f9fa', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', fontWeight: nutrition.junkFood === opt ? 600 : 400 }}>
                  {optLabels[opt]}
                </button>
              );
              })}
            </div>
      </div>
    </div>
  );
}

function StressTracker({ stress, onUpdate }) {
  const t = useT();
  const moods = [
    { key: 'great', icon: '😊', label: t('dailyTracker.great', 'Great') },
    { key: 'good', icon: '🙂', label: t('dailyTracker.good', 'Good') },
    { key: 'okay', icon: '😐', label: t('dailyTracker.okay', 'Okay') },
    { key: 'stressed', icon: '😟', label: t('dailyTracker.stressed', 'Stressed') },
    { key: 'low', icon: '😞', label: t('dailyTracker.low', 'Low') },
  ];
  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{t('dailyTracker.howFeeling', 'How are you feeling?')}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {moods.map(m => (
            <button key={m.key} onClick={() => onUpdate('stress', { mood: m.key })}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid', borderColor: stress.mood === m.key ? '#1866C9' : '#e8edf2', background: stress.mood === m.key ? '#E8F0FE' : '#f8f9fa', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: stress.mood === m.key ? 600 : 400 }}>
              {m.icon} {m.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{t('dailyTracker.meditation', '🧘 Meditation (minutes)')}</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 5, 10, 20].map(m => (
            <button key={m} onClick={() => onUpdate('stress', { meditation: m })}
              style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e8edf2', background: stress.meditation === m ? '#EDE9FE' : '#f8f9fa', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: stress.meditation === m ? 700 : 400 }}>
              {m === 0 ? t('dailyTracker.no', 'No') : `${m}m`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MedicineTracker({ medicine, onUpdate }) {
  const t = useT();
  const slots = [
    { key: 'morning', icon: '🌅', label: t('dailyTracker.morning', 'Morning') },
    { key: 'afternoon', icon: '☀️', label: t('dailyTracker.afternoon', 'Afternoon') },
    { key: 'night', icon: '🌙', label: t('dailyTracker.night', 'Night') },
  ];
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {slots.map(s => (
        <button key={s.key} onClick={() => onUpdate('medicine', { [s.key]: !medicine[s.key] })}
          style={{ flex: 1, padding: '12px 8px', borderRadius: 10, border: '2px solid', borderColor: medicine[s.key] ? '#16a34a' : '#e8edf2', background: medicine[s.key] ? '#F0FDF4' : '#f8f9fa', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center' }}>
          <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
          <div>{s.label}</div>
          <div style={{ fontSize: 10, marginTop: 2, color: medicine[s.key] ? '#16a34a' : '#94a3b8' }}>{medicine[s.key] ? t('dailyTracker.done', '✅ Done') : t('dailyTracker.pending', '○ Pending')}</div>
        </button>
      ))}
    </div>
  );
}

function SmokingTracker({ smoking, onUpdate }) {
  const t = useT();
  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 500 }}>{t('dailyTracker.didYouSmoke', 'Did you smoke today?')}</span>
        <button onClick={() => onUpdate('smoking', { today: false })}
          style={{ padding: '6px 16px', borderRadius: 8, border: 'none', background: !smoking.today ? '#DCFCE7' : '#F3F4F6', color: !smoking.today ? '#16a34a' : '#6B7280', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          {t('dailyTracker.noSmoke', '✅ No')}
        </button>
        <button onClick={() => onUpdate('smoking', { today: true })}
          style={{ padding: '6px 16px', borderRadius: 8, border: 'none', background: smoking.today ? '#FEE2E2' : '#F3F4F6', color: smoking.today ? '#EF4444' : '#6B7280', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          {t('dailyTracker.yesSmoke', '⚠️ Yes')}
        </button>
      </div>
      {!smoking.today && smoking.smokeFreeDays > 0 && (
        <div style={{ padding: '8px 12px', background: '#F0FDF4', borderRadius: 8, fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
          🔥 {smoking.smokeFreeDays} {t('dailyTracker.smokeFreeDays', 'smoke-free days')}
        </div>
      )}
    </div>
  );
}

function AlcoholTracker({ alcohol, onUpdate }) {
  const t = useT();
  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 500 }}>{t('dailyTracker.consumedAlcohol', 'Consumed alcohol today?')}</span>
        <button onClick={() => onUpdate('alcohol', { today: false })}
          style={{ padding: '6px 16px', borderRadius: 8, border: 'none', background: !alcohol.today ? '#DCFCE7' : '#F3F4F6', color: !alcohol.today ? '#16a34a' : '#6B7280', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          {t('dailyTracker.noAlcohol', '✅ No')}
        </button>
        <button onClick={() => onUpdate('alcohol', { today: true })}
          style={{ padding: '6px 16px', borderRadius: 8, border: 'none', background: alcohol.today ? '#FEE2E2' : '#F3F4F6', color: alcohol.today ? '#EF4444' : '#6B7280', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          {t('dailyTracker.yesAlcohol', '⚠️ Yes')}
        </button>
      </div>
    </div>
  );
}

function VitalsTracker({ vitals, onUpdate }) {
  const t = useT();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 2 }}>{t('dailyTracker.bloodPressure', 'Blood Pressure')}</label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input className="input" type="number" placeholder={t('dailyTracker.systolic', 'Systolic')} value={vitals.bpSystolic} onChange={e => onUpdate('vitals', { bpSystolic: e.target.value })}
            style={{ width: '50%', padding: '8px 10px', fontSize: 13, borderRadius: 8, border: '1px solid #e8edf2', fontFamily: 'inherit' }} />
          <span style={{ color: '#94a3b8' }}>/</span>
          <input className="input" type="number" placeholder={t('dailyTracker.diastolic', 'Diastolic')} value={vitals.bpDiastolic} onChange={e => onUpdate('vitals', { bpDiastolic: e.target.value })}
            style={{ width: '50%', padding: '8px 10px', fontSize: 13, borderRadius: 8, border: '1px solid #e8edf2', fontFamily: 'inherit' }} />
        </div>
      </div>
      <div>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 2 }}>{t('dailyTracker.bloodSugar', 'Blood Sugar (Fasting)')}</label>
        <input className="input" type="number" placeholder={t('dailyTracker.mgdl', 'mg/dL')} value={vitals.bloodSugar} onChange={e => onUpdate('vitals', { bloodSugar: e.target.value })}
          style={{ width: '100%', padding: '8px 10px', fontSize: 13, borderRadius: 8, border: '1px solid #e8edf2', fontFamily: 'inherit' }} />
      </div>
      <div>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 2 }}>{t('dailyTracker.weight', 'Weight (kg)')}</label>
        <input className="input" type="number" step="0.1" placeholder={t('dailyTracker.weightPlaceholder', 'e.g. 72')} value={vitals.weight} onChange={e => onUpdate('vitals', { weight: e.target.value })}
          style={{ width: '100%', padding: '8px 10px', fontSize: 13, borderRadius: 8, border: '1px solid #e8edf2', fontFamily: 'inherit' }} />
      </div>
    </div>
  );
}

function WeekSummary() {
  const t = useT();
  const store = useDailyActivityStore();
  const week = store.getWeekSummary();
  if (!week) return <div style={{ padding: 16, textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>{t('dailyTracker.noDataYet', 'No data yet')}</div>;
  const color = week.avg >= 75 ? '#16a34a' : week.avg >= 50 ? '#EAB308' : '#EF4444';
  return (
    <div>
      <div style={{ textAlign: 'center', padding: '12px 0', marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>{t('dailyTracker.weeklyAvg', 'WEEKLY AVERAGE')}</div>
        <div style={{ fontSize: 36, fontWeight: 800, color }}>{week.avg}<span style={{ fontSize: 16, fontWeight: 500, color: '#94a3b8' }}>{t('dailyTracker.outOf100Short', '/100')}</span></div>
        <div style={{ fontSize: 13, fontWeight: 600, color, marginTop: 2 }}>
          {week.trend > 0 ? `${t('dailyTracker.improved', '↑ Improved')} ${week.trend}%` : week.trend < 0 ? `${t('dailyTracker.declined', '↓ Declined')} ${Math.abs(week.trend)}%` : t('dailyTracker.noChange', 'No change')}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {week.days.map(d => (
          <div key={d.date} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: 'var(--text-secondary)', marginBottom: 2 }}>{fmtDate(d.date)}</div>
            <div style={{ width: 28, height: 28, borderRadius: '50%', margin: '0 auto',
              background: d.score >= 75 ? '#DCFCE7' : d.score >= 50 ? '#FEF9C3' : '#FEE2E2',
              color: d.score >= 75 ? '#16a34a' : d.score >= 50 ? '#A16207' : '#DC2626',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>
              {d.score}
            </div>
          </div>
        ))}
      </div>
      {week.weakAreas.length > 0 && (
        <div style={{ padding: '8px 12px', background: '#FEF3C7', borderRadius: 8, fontSize: 11, color: '#92400E' }}>
          ⚠️ {t('dailyTracker.areasNeedingAttention', 'Areas needing attention')}: {week.weakAreas.join(', ')}
        </div>
      )}
    </div>
  );
}

function AchievementSection({ achievements }) {
  return (
    <div style={{ marginTop: 4 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>{t('dailyTracker.achievements', '🏆 Achievements')}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {achievements.map(a => (
          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: '#f8f9fa', borderRadius: 8 }}>
            <span style={{ fontSize: 18, opacity: a.earned ? 1 : 0.4 }}>{a.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: a.earned ? '#1e293b' : '#94a3b8' }}>{a.label}</div>
              {!a.earned && a.progress != null && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ProgressBar value={a.progress} max={a.target} height={4} />
                  <span style={{ fontSize: 9, color: '#94a3b8', whiteSpace: 'nowrap' }}>{a.progress}/{a.target}</span>
                </div>
              )}
            </div>
            {a.earned && <span style={{ fontSize: 14 }}>✅</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function CoachMessage({ message }) {
  if (!message) return null;
  return (
    <div style={{ padding: '12px 14px', background: 'linear-gradient(135deg, #E0F2FE, #F0FDF4)', borderRadius: 12, marginBottom: 12, border: '1px solid #BAE6FD' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 24 }}>{message.icon}</span>
        <div style={{ fontSize: 12, color: '#0F4A96', lineHeight: 1.4, fontWeight: 500 }}>{message.text}</div>
      </div>
    </div>
  );
}

export default function DailyTracker() {
  const store = useDailyActivityStore();
  const [tab, setTab] = useState('today');
  const [savedAt, setSavedAt] = useState(null);

  const todayScore = useMemo(() => {
    if (store.currentScore) return store.currentScore.total;
    const s = computeDailyScore(store.today);
    return s.total;
  }, [store.currentScore, store.today]);

  const week = store.getWeekSummary();

  useEffect(() => {
    setSavedAt(new Date());
    const timer = setInterval(() => setSavedAt(new Date()), 60000);
    return () => clearInterval(timer);
  }, [store.history.length]);

  const timeAgo = savedAt ? Math.floor((Date.now() - savedAt) / 1000) : 0;
  const autoSaveLabel = timeAgo < 5 ? t('dailyTracker.autoSaving', 'Auto-saving...') : timeAgo < 60 ? `${t('dailyTracker.saved', 'Saved')} ${timeAgo}s ${t('dailyTracker.ago', 'ago')}` : `${t('dailyTracker.saved', 'Saved')} ${Math.floor(timeAgo / 60)}m ${t('dailyTracker.ago', 'ago')}`;

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Tab Nav */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14, background: '#f3f4f6', borderRadius: 10, padding: 3 }}>
        {[
          { key: 'today', label: t('dailyTracker.tabToday', 'Today'), icon: '📊' },
          { key: 'activities', label: t('dailyTracker.tabActivities', 'Activities'), icon: '🏃' },
          { key: 'report', label: t('dailyTracker.tabReport', 'Report'), icon: '📋' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ flex: 1, padding: '8px 12px', border: 'none', borderRadius: 8, background: tab === t.key ? '#fff' : 'transparent', fontSize: 12, fontWeight: tab === t.key ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit', color: tab === t.key ? '#1866C9' : '#6B7280', boxShadow: tab === t.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* TAB: Today Summary */}
      {tab === 'today' && (
        <div>
          <CoachMessage message={store.lastCoachMessage} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <ScoreCircle score={todayScore} size={96} t={t} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{t('dailyTracker.todaysHealthScore', "Today's Health Score")}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                {todayScore >= 75 ? t('dailyTracker.scoreGreat', '🟢 Great day! Keep it up.') : todayScore >= 50 ? t('dailyTracker.scoreGood', '🟡 Good, room for improvement.') : t('dailyTracker.scoreNeedsAttention', '🔴 Needs attention')}
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 22 }}>🔥</span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#EA580C' }}>{store.streak}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{t('dailyTracker.dayStreak', 'Day Streak')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time auto-save indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, padding: '6px 12px', background: '#F0FDF4', borderRadius: 8, fontSize: 11, color: '#16a34a' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ flex: 1 }}>{t('dailyTracker.liveTracking', 'Live tracking')} — {autoSaveLabel}</span>
            <span style={{ fontSize: 10, color: '#94a3b8' }}>⚡ {t('dailyTracker.realTime', 'real-time')}</span>
          </div>

          {/* Activity summaries */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[ 
              { icon: '🚶', label: t('dailyTracker.stepsLabel', 'Steps'), value: `${store.today.steps.count.toLocaleString()}`, max: store.today.steps.goal.toLocaleString(), pct: Math.min(store.today.steps.count / store.today.steps.goal * 100, 100), color: '#1866C9' },
              { icon: '💧', label: t('dailyTracker.waterLabel', 'Water'), value: `${store.today.water.glasses}`, max: `${store.today.water.goal} ${t('dailyTracker.glasses', 'glasses')}`, pct: (store.today.water.glasses / store.today.water.goal) * 100, color: '#3B82F6' },
              { icon: '😴', label: t('dailyTracker.sleepLabel', 'Sleep'), value: `${store.today.sleep.hours}h`, max: t('dailyTracker.sleepGoal', '7–9h goal'), pct: (store.today.sleep.hours / 8) * 100, color: '#7C3AED' },
              { icon: '🥗', label: t('dailyTracker.nutritionLabel', 'Nutrition'), value: store.today.nutrition.fruits && store.today.nutrition.vegetables ? t('dailyTracker.good', 'Good') : t('dailyTracker.partial', 'Partial'), max: '', pct: ((store.today.nutrition.fruits ? 1 : 0) + (store.today.nutrition.vegetables ? 1 : 0) + (store.today.nutrition.junkFood === 'never' ? 1 : store.today.nutrition.junkFood === 'sometimes' ? 0.5 : 0)) / 3 * 100, color: '#22C55E' },
              { icon: '🧘', label: t('dailyTracker.stressLabel', 'Stress'), value: store.today.stress.mood, max: '', pct: ({ great: 100, good: 80, okay: 60, stressed: 30, low: 10 }[store.today.stress.mood] || 50), color: '#F97316' },
              { icon: '💊', label: t('dailyTracker.medicineLabel', 'Medicine'), value: [store.today.medicine.morning, store.today.medicine.afternoon, store.today.medicine.night].filter(Boolean).length + '/3', max: '', pct: ([store.today.medicine.morning, store.today.medicine.afternoon, store.today.medicine.night].filter(Boolean).length / 3) * 100, color: '#A855F7' },
            ].map(item => (
              <div key={item.label} style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8edf2', padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{item.icon} {item.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.value}</span>
                </div>
                <ProgressBar value={item.pct} max={100} color={item.color} height={4} />
                {item.max && <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 2 }}>{t('dailyTracker.goal', 'Goal')}: {item.max}</div>}
              </div>
            ))}
          </div>

          <AchievementSection achievements={store.achievements} />
        </div>
      )}

      {/* TAB: Activities */}
      {tab === 'activities' && (
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>{t('dailyTracker.trackActivities', 'Track your daily activities to improve your health score')}</div>

          <TrackerSection title={t('dailyTracker.stepsTracker', '🚶 Steps Tracker')} icon="🚶" defaultOpen>
            <StepsTracker steps={store.today.steps} onUpdate={store.setActivity} />
          </TrackerSection>

          <TrackerSection title={t('dailyTracker.waterIntake', '💧 Water Intake')} icon="💧">
            <WaterTracker water={store.today.water} onUpdate={store.setActivity} />
          </TrackerSection>

          <TrackerSection title={t('dailyTracker.sleepTracker', '😴 Sleep Tracker')} icon="😴">
            <SleepTracker sleep={store.today.sleep} onUpdate={store.setActivity} />
          </TrackerSection>

          <TrackerSection title={t('dailyTracker.nutritionTracker', '🥗 Nutrition Tracker')} icon="🥗">
            <NutritionTracker nutrition={store.today.nutrition} onUpdate={store.setActivity} />
          </TrackerSection>

          <TrackerSection title={t('dailyTracker.stressWellness', '🧘 Stress & Wellness')} icon="🧘">
            <StressTracker stress={store.today.stress} onUpdate={store.setActivity} />
          </TrackerSection>

          <TrackerSection title={t('dailyTracker.medicineAdherence', '💊 Medicine Adherence')} icon="💊">
            <MedicineTracker medicine={store.today.medicine} onUpdate={store.setActivity} />
          </TrackerSection>

          <TrackerSection title={t('dailyTracker.smokingTracker', '🚭 Smoking Tracker')} icon="🚭">
            <SmokingTracker smoking={store.today.smoking} onUpdate={store.setActivity} />
          </TrackerSection>

          <TrackerSection title={t('dailyTracker.alcoholTracker', '🍺 Alcohol Tracker')} icon="🍺">
            <AlcoholTracker alcohol={store.today.alcohol} onUpdate={store.setActivity} />
          </TrackerSection>

          <TrackerSection title={t('dailyTracker.healthVitals', '🩸 Health Vitals')} icon="🩸">
            <VitalsTracker vitals={store.today.vitals} onUpdate={store.setActivity} />
          </TrackerSection>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, padding: '8px 12px', background: '#F0FDF4', borderRadius: 8, fontSize: 11, color: '#16a34a' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span>{t('dailyTracker.autoSavingRealTime', 'Auto-saving in real-time')} — {autoSaveLabel}</span>
          </div>
        </div>
      )}

      {/* TAB: Weekly Report */}
      {tab === 'report' && (
        <div>
          <WeekSummary />
          <CoachMessage message={store.lastCoachMessage} />

          {week && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>🔥 {t('dailyTracker.streak', 'Streak')}: {store.streak} {t('dailyTracker.days', 'days')}</div>
              <AchievementSection achievements={store.achievements} />
              <div style={{ marginTop: 12, padding: '10px 14px', background: '#F0F7FF', borderRadius: 10, border: '1px solid #BAE6FD', fontSize: 11, color: '#0F4A96' }}>
                🌿 {t('dailyTracker.journeyMsg', 'Jeevan HealthCare at Home Journey — Every day counts towards a healthier you. Your daily activities build your long-term health score.')}
              </div>
            </div>
          )}
        </div>
      )}
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}
