import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { STORAGE_KEYS } from '../data/physiotherapyData';
import { exercises } from '../data/exerciseData';

const C = {
  primary: '#0D9488',
  primaryLight: '#CCFBF1',
  primaryDark: '#0F766E',
  heroFrom: '#0D9488',
  heroTo: '#14B8A6',
  heroMid: '#2DD4BF',
  accent: '#F59E0B',
  danger: '#EF4444',
  success: '#22C55E',
};

const CAT_COLORS = {
  'Back Pain': { bg: '#F0FDF4', border: '#22C55E', text: '#166534' },
  'Knee Pain': { bg: '#EFF6FF', border: '#3B82F6', text: '#1E40AF' },
  'Neck Pain': { bg: '#F3E8FF', border: '#A855F7', text: '#6B21A8' },
  Shoulder: { bg: '#FFF1F2', border: '#EF4444', text: '#991B1B' },
  'Post Surgery': { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
  Balance: { bg: '#FCE7F3', border: '#EC4899', text: '#9D174D' },
  'Full Body': { bg: '#ECFDF5', border: '#059669', text: '#065F46' },
};

const DIFF_COLORS = {
  Beginner: { bg: '#F0FDF4', text: '#166534' },
  Intermediate: { bg: '#FEF3C7', text: '#92400E' },
  Advanced: { bg: '#FEF2F2', text: '#991B1B' },
};

const CATEGORIES = ['All', 'Back Pain', 'Knee Pain', 'Neck Pain', 'Shoulder', 'Post Surgery', 'Balance', 'Full Body'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function getLogFromStorage() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.EXERCISE_LOG) || '[]'); }
  catch { return []; }
}

function getFavoritesFromStorage() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]'); }
  catch { return []; }
}

function calcStreak(log) {
  if (!log.length) return 0;
  const dates = [...new Set(log.map(e => e.date))].sort().reverse();
  let streak = 0;
  const today = getToday();
  let checkDate = new Date(today);
  for (const d of dates) {
    const expected = checkDate.toISOString().split('T')[0];
    if (d === expected) { streak++; checkDate.setDate(checkDate.getDate() - 1); }
    else if (streak === 0 && d < today) break;
    else break;
  }
  return streak;
}

export default function PhysioExercises() {
  const t = useT();
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [completedSteps, setCompletedSteps] = useState({});
  const [favorites, setFavorites] = useState(getFavoritesFromStorage);
  const [log, setLog] = useState(getLogFromStorage);
  const [saving, setSaving] = useState(false);
  const [logging, setLogging] = useState(false);
  const [favToast, setFavToast] = useState('');

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites)); } catch {}
  }, [favorites]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.EXERCISE_LOG, JSON.stringify(log)); } catch {}
  }, [log]);

  const todayLog = log.filter(e => e.date === getToday());
  const streak = calcStreak(log);

  const filtered = exercises.filter(ex => {
    if (category !== 'All' && ex.category !== category) return false;
    if (difficulty !== 'All' && ex.difficulty !== difficulty) return false;
    if (search && !ex.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openDetail = (ex) => {
    setSelected(ex);
    setCompletedSteps({});
  };

  const toggleStep = (idx) => {
    setCompletedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleFavorite = (ex) => {
    const exists = favorites.find(f => f.id === ex.id);
    if (exists) {
      setFavorites(prev => prev.filter(f => f.id !== ex.id));
      setFavToast(t('removed.fav', 'Removed from favorites'));
    } else {
      setFavorites(prev => [...prev, { id: ex.id, name: ex.name, category: ex.category, image: ex.image, addedAt: new Date().toISOString() }]);
      setFavToast(t('saved.fav', 'Saved to favorites'));
    }
    setTimeout(() => setFavToast(''), 2000);
  };

  const isFavorited = (id) => favorites.some(f => f.id === id);

  const logExercise = () => {
    if (!selected) return;
    const total = selected.steps.length;
    const done = Object.keys(completedSteps).filter(k => completedSteps[k]).length;
    setLog(prev => [...prev, {
      id: selected.id,
      name: selected.name,
      date: getToday(),
      completedSteps: done,
      totalSteps: total,
      timestamp: Date.now(),
    }]);
    setLogging(true);
    setTimeout(() => { setLogging(false); setSelected(null); }, 800);
  };

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${C.heroFrom} 0%, ${C.heroMid} 50%, ${C.heroTo} 100%)`, padding: '28px 0 32px' }}>
        <div className="container">
          <Link to="/physiotherapy" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textDecoration: 'none', display: 'inline-block', marginBottom: 10 }}>← {t('back.to.physiotherapy', 'Back to Physiotherapy')}</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 32 }}>{'🏋️'}</span>
            <div>
              <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: 0 }}>{t('exercise.library', 'Exercise Library')}</h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, margin: '2px 0 0' }}>{t('physio.at.home', 'Physiotherapy at Home — Step-by-step guided exercises')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="page-section container" style={{ maxWidth: 820 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', marginTop: -16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={category} onChange={e => setCategory(e.target.value)}
            style={{ flex: '0 0 auto', minWidth: 140, padding: '8px 10px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12, fontFamily: 'inherit', background: '#fff', color: '#0f172a', cursor: 'pointer' }}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
            style={{ flex: '0 0 auto', minWidth: 120, padding: '8px 10px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12, fontFamily: 'inherit', background: '#fff', color: '#0f172a', cursor: 'pointer' }}>
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t('search.exercises', 'Search exercises...')}
            style={{ flex: '1 1 160px', padding: '8px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12, fontFamily: 'inherit', outline: 'none', minWidth: 120 }} />
          <span style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap' }}>{filtered.length} {t('exercises', 'exercises')}</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>{'🔍'}</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>{t('no.exercises.found', 'No exercises found')}</h3>
            <p style={{ fontSize: 12, color: '#64748b' }}>{t('try.different.filters', 'Try different filters or search terms')}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginTop: 16 }}>
            {filtered.map(ex => {
              const cc = CAT_COLORS[ex.category] || { bg: '#f8fafc', border: '#cbd5e1', text: '#475569' };
              const dc = DIFF_COLORS[ex.difficulty] || { bg: '#f8fafc', text: '#475569' };
              return (
                <div key={ex.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                  onClick={() => openDetail(ex)}>
                  <div style={{ padding: '20px 16px 12px', textAlign: 'center', background: 'linear-gradient(180deg, #f0fdfa 0%, #fff 100%)' }}>
                    <div style={{ fontSize: 48, lineHeight: 1 }}>{ex.image}</div>
                  </div>
                  <div style={{ padding: '12px 14px 14px' }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', color: '#0f172a', lineHeight: 1.3 }}>{ex.name}</h3>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 600, background: cc.bg, color: cc.text, border: `1px solid ${cc.border}` }}>{ex.category}</span>
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 600, background: dc.bg, color: dc.text }}>{ex.difficulty}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, fontSize: 10, color: '#64748b', marginBottom: 10 }}>
                      <span>{'⏱'} {ex.duration}</span>
                      <span>{'🧰'} {ex.equipment}</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 10px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ex.description}</p>
                    <button onClick={e => { e.stopPropagation(); openDetail(ex); }}
                      style={{ width: '100%', padding: '8px 0', borderRadius: 6, border: 'none', background: C.primary, color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                      {t('view.details', 'View Details')} →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 28, padding: '18px 20px', background: 'linear-gradient(135deg, #F0FDFA 0%, #ECFDF5 100%)', borderRadius: 12, border: '1px solid #D1FAE5' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 12px', color: '#065F46', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{'📊'}</span> {t('my.progress', 'My Progress')}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            <div style={{ background: '#fff', borderRadius: 8, padding: '14px 16px', textAlign: 'center', border: '1px solid #D1FAE5' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.primary }}>{todayLog.length}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('today.exercises', 'Today\'s Exercises')}</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 8, padding: '14px 16px', textAlign: 'center', border: '1px solid #D1FAE5' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.accent }}>{streak}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('day.streak', 'Day Streak')}</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 8, padding: '14px 16px', textAlign: 'center', border: '1px solid #D1FAE5' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#3B82F6' }}>{favorites.length}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('saved.exercises', 'Saved Exercises')}</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 8, padding: '14px 16px', textAlign: 'center', border: '1px solid #D1FAE5' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#8B5CF6' }}>{log.length}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t('total.logged', 'Total Logged')}</div>
            </div>
          </div>
        </div>

        {favorites.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>{'❤️'}</span> {t('my.favorites', 'My Favorites')}
            </h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {favorites.map(fav => (
                <div key={fav.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: '#FFF1F2', borderRadius: 6, fontSize: 11, fontWeight: 600, color: '#9D174D', cursor: 'pointer' }}
                  onClick={() => {
                    const ex = exercises.find(e => e.id === fav.id);
                    if (ex) openDetail(ex);
                  }}>
                  <span>{fav.image}</span>
                  <span>{fav.name}</span>
                  <span style={{ cursor: 'pointer', color: '#F43F5E', fontSize: 13, marginLeft: 2 }} onClick={e => { e.stopPropagation(); setFavorites(prev => prev.filter(f => f.id !== fav.id)); }}>✕</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <Link to="/physiotherapy" style={{ fontSize: 12, color: C.primary, fontWeight: 600, textDecoration: 'none' }}>← {t('back.to.physiotherapy', 'Back to Physiotherapy')}</Link>
        </div>
      </div>

      {favToast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#0f172a', color: '#fff', padding: '10px 18px', borderRadius: 8, fontSize: 12, fontWeight: 600, zIndex: 9999, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          {favToast}
        </div>
      )}

      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', overflowY: 'auto' }}
          onClick={() => { if (!logging) setSelected(null); }}>
          <div style={{ background: '#fff', borderRadius: 16, maxWidth: 560, width: '100%', padding: '24px 22px', position: 'relative', marginTop: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => { if (!logging) setSelected(null); }}
              style={{ position: 'absolute', top: 12, right: 14, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#94a3b8', fontFamily: 'inherit' }}>✕</button>

            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 56, lineHeight: 1 }}>{selected.image}</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '8px 0 4px', color: '#0f172a' }}>{selected.name}</h2>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, fontWeight: 600, background: CAT_COLORS[selected.category]?.bg || '#f8fafc', color: CAT_COLORS[selected.category]?.text || '#475569', border: `1px solid ${CAT_COLORS[selected.category]?.border || '#cbd5e1'}` }}>{selected.category}</span>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, fontWeight: 600, background: DIFF_COLORS[selected.difficulty]?.bg || '#f8fafc', color: DIFF_COLORS[selected.difficulty]?.text || '#475569' }}>{selected.difficulty}</span>
              </div>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', fontSize: 11, color: '#64748b' }}>
                <span>{'⏱'} {selected.duration}</span>
                <span>{'🧰'} {selected.equipment}</span>
              </div>
            </div>

            <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.5, margin: '0 0 14px', textAlign: 'center' }}>{selected.description}</p>

            <div style={{ marginBottom: 14 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>{t('steps', 'Steps')}</h4>
              <div style={{ display: 'grid', gap: 4 }}>
                {selected.steps.map((step, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 10px', borderRadius: 6, background: completedSteps[i] ? '#F0FDF4' : '#f8fafc', cursor: 'pointer', fontSize: 11, color: '#0f172a', lineHeight: 1.4 }}>
                    <input type="checkbox" checked={!!completedSteps[i]} onChange={() => toggleStep(i)}
                      style={{ marginTop: 2, accentColor: C.primary }} />
                    <span style={{ textDecoration: completedSteps[i] ? 'line-through' : 'none', color: completedSteps[i] ? '#16a34a' : '#0f172a' }}>
                      <strong>{i + 1}.</strong> {step}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>{t('benefits', 'Benefits')}</h4>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 11, color: '#475569', lineHeight: 1.6 }}>
                {selected.benefits.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 6, background: '#FEF2F2', border: '1px solid #FECACA' }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>{'⚠️'}</span>
                <div>
                  <strong style={{ fontSize: 11, color: '#991B1B' }}>{t('precautions', 'Precautions')}:</strong>
                  <p style={{ fontSize: 11, color: '#7F1D1D', margin: '2px 0 0' }}>{selected.precautions}</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => toggleFavorite(selected)}
                style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: isFavorited(selected.id) ? '2px solid #F43F5E' : '2px solid #e2e8f0', background: isFavorited(selected.id) ? '#FFF1F2' : '#fff', color: isFavorited(selected.id) ? '#BE123C' : '#475569', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                {isFavorited(selected.id) ? '❤️ ' + t('saved', 'Saved') : '🤍 ' + t('save.to.favorites', 'Save to Favorites')}
              </button>
              <button onClick={logExercise} disabled={logging}
                style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: logging ? '#94a3b8' : C.primary, color: '#fff', fontSize: 12, fontWeight: 700, cursor: logging ? 'default' : 'pointer', fontFamily: 'inherit' }}>
                {logging ? '✓ ' + t('logged', 'Logged!') : '📝 ' + t('log.this.exercise', 'Log This Exercise')}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .page-section { padding: 20px 12px !important; }
        }
        select:focus, input:focus { border-color: ${C.primary} !important; box-shadow: 0 0 0 2px ${C.primaryLight} !important; }
      `}</style>
    </div>
  );
}
