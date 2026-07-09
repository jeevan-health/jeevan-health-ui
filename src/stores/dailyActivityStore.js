import { create } from 'zustand';
import { computeHealthScore } from './dashboardStore.js';

const today = () => new Date().toISOString().slice(0, 10);
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };
const fmtDate = (iso) => { const d = new Date(iso + 'T00:00:00'); return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); };

const SCORE_WEIGHTS = {
  steps: 20, sleep: 15, water: 10, nutrition: 20,
  stress: 10, medicine: 15, vitals: 10,
};

const ACTIVITY_DEFAULTS = {
  steps: { count: 0, goal: 10000 },
  water: { glasses: 0, goal: 8 },
  sleep: { hours: 0, quality: 'good' },
  nutrition: { fruits: false, vegetables: false, junkFood: 'never' },
  stress: { mood: 'good', meditation: 0 },
  smoking: { today: false, smokeFreeDays: 0 },
  alcohol: { today: false, frequency: 'never' },
  medicine: { morning: false, afternoon: false, night: false },
  vitals: { bpSystolic: '', bpDiastolic: '', bloodSugar: '', weight: '' },
};

const SCORE_DEFAULTS = { steps: 0, sleep: 0, water: 0, nutrition: 0, stress: 0, medicine: 0, vitals: 0, total: 0 };

function computeStepsScore(count) {
  if (count >= 10000) return 20;
  if (count >= 7500) return 15;
  if (count >= 5000) return 10;
  if (count >= 2500) return 5;
  return count > 0 ? 2 : 0;
}

function computeSleepScore(hours) {
  if (hours >= 7 && hours <= 9) return 15;
  if (hours >= 6 && hours < 7) return 12;
  if (hours >= 5 && hours < 6) return 8;
  if (hours >= 9 && hours <= 10) return 12;
  if (hours > 10) return 5;
  return hours > 0 ? 3 : 0;
}

function computeWaterScore(glasses) {
  if (glasses >= 8) return 10;
  if (glasses >= 6) return 8;
  if (glasses >= 4) return 5;
  return glasses > 0 ? 2 : 0;
}

function computeNutritionScore(n) {
  let s = 0;
  if (n.fruits) s += 6;
  if (n.vegetables) s += 6;
  if (n.junkFood === 'never') s += 8;
  else if (n.junkFood === 'sometimes') s += 4;
  else s += 0;
  return s;
}

function computeStressScore(mood, meditation) {
  const moodMap = { great: 5, good: 4, okay: 3, stressed: 1, low: 0 };
  const moodScore = moodMap[mood] || 3;
  const meditationScore = meditation >= 20 ? 5 : meditation >= 10 ? 3 : meditation >= 5 ? 2 : 0;
  return moodScore + meditationScore;
}

function computeMedicineScore(m) {
  let s = 0;
  if (m.morning) s += 5;
  if (m.afternoon) s += 5;
  if (m.night) s += 5;
  return s;
}

function computeVitalsScore(v) {
  let s = 0;
  const sys = parseInt(v.bpSystolic);
  const dia = parseInt(v.bpDiastolic);
  if (!isNaN(sys) && !isNaN(dia)) {
    if (sys >= 90 && sys <= 120 && dia >= 60 && dia <= 80) s += 4;
    else if (sys > 120 && sys <= 140 || dia > 80 && dia <= 90) s += 2;
    else s += 1;
  } else { s += 2; }
  const sugar = parseInt(v.bloodSugar);
  if (!isNaN(sugar)) {
    if (sugar >= 70 && sugar <= 100) s += 3;
    else if (sugar > 100 && sugar <= 140) s += 2;
    else s += 1;
  } else { s += 2; }
  const w = parseFloat(v.weight);
  if (w > 0) s += 3;
  else s += 1;
  return s;
}

function computeDailyScore(activities) {
  const s = {
    steps: computeStepsScore(activities.steps.count),
    sleep: computeSleepScore(activities.sleep.hours),
    water: computeWaterScore(activities.water.glasses),
    nutrition: computeNutritionScore(activities.nutrition),
    stress: computeStressScore(activities.stress.mood, activities.stress.meditation),
    medicine: computeMedicineScore(activities.medicine),
    vitals: computeVitalsScore(activities.vitals),
  };
  s.total = Math.round(Object.values(s).reduce((a, b) => a + b, 0));
  return s;
}

const getStreakFromHistory = (history) => {
  let streak = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].score >= 50) streak++;
    else break;
  }
  return streak;
};

const AI_COACH_MESSAGES = [
  { condition: (s) => s.steps < 10, text: (name) => `Good morning ${name}! Yesterday you completed ${s.steps}% of your step goal. Try a 20-minute walk today to boost your score.`, icon: '🌅' },
  { condition: (s) => s.water < 6, text: () => "You missed your water goal yesterday. Staying hydrated improves energy and skin health.", icon: '💧' },
  { condition: (s) => s.sleep < 8, text: () => "Your sleep was less than optimal. Aim for 7–9 hours tonight for better recovery.", icon: '😴' },
  { condition: (s) => s.total >= 85, text: (name) => `Great job ${name}! You had an excellent day yesterday. Keep it up! 🎉`, icon: '🌟' },
  { condition: () => true, text: (name) => `You're doing well ${name}! Every small step adds to your health journey.`, icon: '💪' },
];

function getCoachMessage(prevScore, name) {
  for (const msg of AI_COACH_MESSAGES) {
    if (msg.condition(prevScore)) return { text: msg.text(name), icon: msg.icon };
  }
  return { text: `${name}, keep tracking daily for better health insights!`, icon: '💪' };
}

const generateLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = daysAgo(i);
    const r = Math.random();
    const base = 40 + Math.round(r * 50);
    days.push({
      date, score: base,
      activities: { ...ACTIVITY_DEFAULTS,
        steps: { count: Math.round(2000 + r * 9000), goal: 10000 },
        water: { glasses: Math.round(3 + r * 6), goal: 8 },
        sleep: { hours: Math.round(5 + r * 4), quality: 'good' },
        nutrition: { fruits: r > 0.3, vegetables: r > 0.4, junkFood: r > 0.7 ? 'never' : r > 0.4 ? 'sometimes' : 'frequent' },
        stress: { mood: r > 0.6 ? 'great' : r > 0.3 ? 'good' : 'okay', meditation: r > 0.5 ? 10 : 0 },
        smoking: { today: false, smokeFreeDays: r > 0.2 ? 14 : 2 },
        alcohol: { today: r < 0.2, frequency: 'occasional' },
        medicine: { morning: true, afternoon: r > 0.5, night: r > 0.4 },
        vitals: { bpSystolic: String(110 + Math.round(r * 20)), bpDiastolic: String(70 + Math.round(r * 15)), bloodSugar: String(85 + Math.round(r * 30)), weight: '' },
      },
      scores: null,
    });
  }
  return days;
};

const useDailyActivityStore = create((set, get) => ({
  today: {
    steps: { count: 7240, goal: 10000 },
    water: { glasses: 5, goal: 8 },
    sleep: { hours: 7.5, quality: 'good' },
    nutrition: { fruits: true, vegetables: false, junkFood: 'sometimes' },
    stress: { mood: 'good', meditation: 10 },
    smoking: { today: false, smokeFreeDays: 14 },
    alcohol: { today: false, frequency: 'never' },
    medicine: { morning: true, afternoon: true, night: false },
    vitals: { bpSystolic: '118', bpDiastolic: '76', bloodSugar: '95', weight: '' },
  },

  currentScore: null,

  history: generateLast7Days(),

  streak: 12,

  achievements: [
    { id: 'a1', label: '7 Days Active', earned: true, icon: '🏆' },
    { id: 'a2', label: '30 Days Walking', earned: false, icon: '🏆', progress: 18, target: 30 },
    { id: 'a3', label: 'Sleep Champion', earned: false, icon: '🏆', progress: 5, target: 14 },
    { id: 'a4', label: 'Hydration Hero', earned: false, icon: '🏆', progress: 3, target: 7 },
  ],

  lastCoachMessage: null,

  updateActivity: (category, field, value) => set(state => {
    const updated = {
      ...state.today,
      [category]: { ...state.today[category], [field]: value },
    };
    const scores = computeDailyScore(updated);
    return { today: updated, currentScore: scores };
  }),

  setActivity: (category, data) => set(state => {
    const updated = { ...state.today, [category]: { ...state.today[category], ...data } };
    const scores = computeDailyScore(updated);
    return { today: updated, currentScore: scores };
  }),

  saveDay: () => set(state => {
    const scores = state.currentScore || computeDailyScore(state.today);
    const todayStr = today();
    const exists = state.history.find(d => d.date === todayStr);
    let newHistory;
    if (exists) {
      newHistory = state.history.map(d => d.date === todayStr ? { date: todayStr, score: scores.total, activities: { ...state.today }, scores } : d);
    } else {
      newHistory = [...state.history, { date: todayStr, score: scores.total, activities: { ...state.today }, scores }];
    }
    const streak = getStreakFromHistory(newHistory);
    const msg = getCoachMessage(scores, 'Ashwin');
    try { localStorage.setItem('jh_daily_activity', JSON.stringify({ lastScore: scores.total, streak, lastUpdated: today() })); } catch {}
    return {
      history: newHistory,
      streak,
      lastCoachMessage: msg,
      currentScore: scores,
      today: { ...ACTIVITY_DEFAULTS, steps: { ...ACTIVITY_DEFAULTS.steps }, water: { ...ACTIVITY_DEFAULTS.water } },
    };
  }),

  resetToday: () => set({
    today: {
      steps: { count: 0, goal: 10000 },
      water: { glasses: 0, goal: 8 },
      sleep: { hours: 0, quality: 'good' },
      nutrition: { fruits: false, vegetables: false, junkFood: 'never' },
      stress: { mood: 'good', meditation: 0 },
      smoking: { today: false, smokeFreeDays: get().today.smoking.smokeFreeDays },
      alcohol: { today: false, frequency: 'never' },
      medicine: { morning: false, afternoon: false, night: false },
      vitals: { bpSystolic: '', bpDiastolic: '', bloodSugar: '', weight: '' },
    },
    currentScore: null,
  }),

  getWeekSummary: () => {
    const history = get().history;
    const last7 = history.slice(-7);
    if (last7.length === 0) return null;
    const avg = Math.round(last7.reduce((s, d) => s + d.score, 0) / last7.length);
    const best = [...last7].sort((a, b) => b.score - a.score)[0];
    const worst = [...last7].sort((a, b) => a.score - b.score)[0];
    const trend = last7.length >= 2 ? last7[last7.length - 1].score - last7[0].score : 0;
    const weakAreas = [];
    const last = last7[last7.length - 1];
    if (last.scores) {
      if (last.scores.steps < 10) weakAreas.push('Walking');
      if (last.scores.water < 5) weakAreas.push('Water Intake');
      if (last.scores.sleep < 8) weakAreas.push('Sleep');
    }
    return { avg, best, worst, trend, weakAreas, days: last7 };
  },

  getHealthScoreImpact: () => {
    const history = get().history;
    const last90 = history.slice(-90);
    if (last90.length < 7) return 0;
    const recentAvg = last90.slice(-7).reduce((s, d) => s + d.score, 0) / Math.min(7, last90.slice(-7).length);
    const lifestylePoints = Math.round((recentAvg / 100) * 5);
    return Math.min(lifestylePoints, 5);
  },
}));

// Init localStorage demo data for Home page card
try {
  const s = computeDailyScore(useDailyActivityStore.getState().today);
  if (s.total > 0) {
    localStorage.setItem('jh_daily_activity', JSON.stringify({
      lastScore: s.total, streak: 12, lastUpdated: today()
    }));
  }
} catch {}

export default useDailyActivityStore;
export { computeDailyScore, ACTIVITY_DEFAULTS, SCORE_WEIGHTS };
