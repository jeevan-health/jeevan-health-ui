export function calcBMI(heightCm, weightKg) {
  if (!heightCm || !weightKg) return null;
  const h = heightCm / 100;
  const bmi = weightKg / (h * h);
  return Math.round(bmi * 10) / 10;
}

export function bmiCategory(bmi) {
  if (bmi === null || bmi === undefined) return null;
  if (bmi < 18.5) return { label: 'Underweight', color: '#F59E0B', icon: '⚠️', range: '< 18.5' };
  if (bmi < 25) return { label: 'Normal', color: '#16A34A', icon: '✅', range: '18.5 – 24.9' };
  if (bmi < 30) return { label: 'Overweight', color: '#F97316', icon: '🟡', range: '25 – 29.9' };
  if (bmi < 35) return { label: 'Obese Class I', color: '#EF4444', icon: '🔴', range: '30 – 34.9' };
  if (bmi < 40) return { label: 'Obese Class II', color: '#DC2626', icon: '🔴', range: '35 – 39.9' };
  return { label: 'Obese Class III', color: '#B91C1C', icon: '⛔', range: '≥ 40' };
}

export function idealWeightRange(heightCm, gender) {
  if (!heightCm) return null;
  const base = heightCm - 100;
  const factor = gender === 'female' ? 0.85 : 0.9;
  const ideal = base * factor;
  return { min: Math.round(ideal - 5), max: Math.round(ideal + 5) };
}

export function bpCategory(systolic, diastolic) {
  if (!systolic && !diastolic) return null;
  const s = Number(systolic) || 0;
  const d = Number(diastolic) || 0;
  if (s < 120 && d < 80) return { label: 'Normal', color: '#16A34A', icon: '🟢' };
  if (s < 130 && d < 80) return { label: 'Elevated', color: '#F59E0B', icon: '🟡' };
  if (s < 140 || d < 90) return { label: 'Stage 1 Hypertension', color: '#F97316', icon: '🟠' };
  if (s < 180 || d < 120) return { label: 'Stage 2 Hypertension', color: '#EF4444', icon: '🔴' };
  return { label: 'Hypertensive Crisis', color: '#DC2626', icon: '⛔' };
}

export function heartRiskScore(age, gender, heightCm, weightKg, systolicBp, smoking, alcohol, diabetes, cholesterol, exercise, familyHistory) {
  let score = 0;
  const bmi = calcBMI(heightCm, weightKg) || 25;
  // Age
  if (age >= 60) score += 25;
  else if (age >= 50) score += 18;
  else if (age >= 40) score += 12;
  else if (age >= 30) score += 6;
  // Gender
  if (gender === 'male') score += 5;
  // BMI
  if (bmi >= 30) score += 15;
  else if (bmi >= 25) score += 8;
  // BP
  if (systolicBp >= 140) score += 15;
  else if (systolicBp >= 130) score += 8;
  // Smoking
  if (smoking === 'yes') score += 15;
  else if (smoking === 'former') score += 5;
  // Alcohol
  if (alcohol === 'daily') score += 8;
  else if (alcohol === 'occasional') score += 3;
  // Diabetes
  if (diabetes === 'yes') score += 15;
  else if (diabetes === 'borderline') score += 8;
  // Cholesterol
  if (cholesterol === 'high') score += 10;
  else if (cholesterol === 'borderline') score += 5;
  // Exercise
  if (exercise === 'sedentary') score += 10;
  else if (exercise === 'light') score += 5;
  // Family history
  if (familyHistory === 'yes') score += 10;

  const maxScore = 100;
  const heartScore = Math.max(0, maxScore - score);
  let category;
  if (heartScore >= 80) category = { label: 'Low Risk', color: '#16A34A', icon: '🟢' };
  else if (heartScore >= 60) category = { label: 'Moderate Risk', color: '#F59E0B', icon: '🟡' };
  else if (heartScore >= 40) category = { label: 'High Risk', color: '#F97316', icon: '🟠' };
  else category = { label: 'Very High Risk', color: '#EF4444', icon: '🔴' };

  return { score: heartScore, max: 100, category, riskFactors: score };
}

export function menstrualCycle(lmp, cycleLength, periodDuration) {
  if (!lmp) return null;
  const lmpDate = new Date(lmp);
  const cl = Number(cycleLength) || 28;
  const pd = Number(periodDuration) || 5;
  const nextPeriod = new Date(lmpDate);
  nextPeriod.setDate(nextPeriod.getDate() + cl);
  const ovulation = new Date(lmpDate);
  ovulation.setDate(ovulation.getDate() + (cl - 14));
  const fertileStart = new Date(ovulation);
  fertileStart.setDate(fertileStart.getDate() - 5);
  const fertileEnd = new Date(ovulation);
  fertileEnd.setDate(fertileEnd.getDate() + 1);
  const pmsStart = new Date(nextPeriod);
  pmsStart.setDate(pmsStart.getDate() - 7);
  return { nextPeriod, ovulation, fertileStart, fertileEnd, pmsStart };
}

export function pregnancyDueDate(lmp, cycleLength) {
  if (!lmp) return null;
  const lmpDate = new Date(lmp);
  const cl = Number(cycleLength) || 28;
  const adjustment = cl - 28;
  const dueDate = new Date(lmpDate);
  dueDate.setDate(dueDate.getDate() + 280 + adjustment);
  const today = new Date();
  const diff = today - lmpDate;
  const daysPregnant = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const weeks = Math.floor(daysPregnant / 7);
  const days = daysPregnant % 7;
  let trimester;
  if (weeks <= 13) trimester = { label: 'First Trimester', color: '#3B82F6' };
  else if (weeks <= 27) trimester = { label: 'Second Trimester', color: '#10B981' };
  else trimester = { label: 'Third Trimester', color: '#8B5CF6' };
  return { dueDate, weeks, days, trimester, daysPregnant };
}

export function childPercentile(height, weight, ageMonths) {
  // Simplified WHO-based reference values
  const refs = [
    { age: 0, h: 50, w: 3.3, hc: 34 },
    { age: 3, h: 60, w: 5.6, hc: 40 },
    { age: 6, h: 66, w: 7.3, hc: 43 },
    { age: 9, h: 71, w: 8.2, hc: 45 },
    { age: 12, h: 75, w: 9.0, hc: 46 },
    { age: 18, h: 82, w: 10.5, hc: 47 },
    { age: 24, h: 87, w: 11.8, hc: 48 },
    { age: 36, h: 96, w: 14.0, hc: 49 },
    { age: 48, h: 103, w: 16.0, hc: 50 },
    { age: 60, h: 110, w: 18.0, hc: 50 },
  ];
  const nearest = refs.reduce((prev, curr) => Math.abs(curr.age - ageMonths) < Math.abs(prev.age - ageMonths) ? curr : prev);
  const heightPct = height ? Math.round((height / nearest.h) * 100) : null;
  const weightPct = weight ? Math.round((weight / nearest.w) * 100) : null;
  const bmi = (height && weight) ? Math.round((weight / ((height / 100) ** 2)) * 10) / 10 : null;
  return { heightPct, weightPct, bmi, ref: nearest };
}

export function dailyCalorie(age, gender, heightCm, weightKg, activityLevel) {
  if (!age || !heightCm || !weightKg) return null;
  const isMale = gender === 'male';
  let bmr = isMale
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9 };
  const factor = multipliers[activityLevel] || 1.375;
  return Math.round(bmr * factor);
}

export function diabetesRisk(age, gender, heightCm, weightKg, familyHistory, exercise, smoking, bloodPressure, bloodSugar) {
  let score = 0;
  if (age >= 60) score += 15;
  else if (age >= 50) score += 10;
  else if (age >= 40) score += 5;
  const bmi = heightCm && weightKg ? calcBMI(heightCm, weightKg) : 0;
  if (bmi >= 30) score += 20;
  else if (bmi >= 25) score += 10;
  if (familyHistory === 'yes') score += 20;
  if (exercise === 'sedentary') score += 10;
  else if (exercise === 'light') score += 5;
  if (smoking === 'yes') score += 10;
  if (bloodPressure === 'high') score += 10;
  else if (bloodPressure === 'elevated') score += 5;
  if (bloodSugar >= 126) score += 25;
  else if (bloodSugar >= 100) score += 15;
  if (score >= 50) return { label: 'High Risk', color: '#EF4444', icon: '🔴', score };
  if (score >= 25) return { label: 'Medium Risk', color: '#F59E0B', icon: '🟡', score };
  return { label: 'Low Risk', color: '#16A34A', icon: '🟢', score };
}

export function boneHealthRisk(age, gender, weight, heightCm, previousFractures, familyHistory, menopauseStatus, vitaminD, calciumIntake, physicalActivity) {
  let score = 0;
  if (age >= 60) score += 25;
  else if (age >= 50) score += 15;
  else if (age >= 40) score += 8;
  if (gender === 'female') score += 15;
  if (weight < 50) score += 15;
  else if (weight < 60) score += 8;
  if (previousFractures === 'yes') score += 25;
  if (familyHistory === 'yes') score += 20;
  if (gender === 'female' && menopauseStatus === 'post') score += 15;
  else if (gender === 'female' && menopauseStatus === 'peri') score += 8;
  if (vitaminD === 'deficient') score += 15;
  else if (vitaminD === 'insufficient') score += 8;
  if (calciumIntake === 'low') score += 15;
  else if (calciumIntake === 'moderate') score += 5;
  if (physicalActivity === 'sedentary') score += 10;
  else if (physicalActivity === 'light') score += 5;
  if (score >= 50) return { label: 'High Risk', color: '#EF4444', icon: '🔴', score };
  if (score >= 25) return { label: 'Moderate Risk', color: '#F59E0B', icon: '🟡', score };
  return { label: 'Low Risk', color: '#16A34A', icon: '🟢', score };
}

export function stressWellnessScore(sleep, stress, exercise, workPattern) {
  let score = 0;
  if (sleep >= 7) score += 25;
  else if (sleep >= 5) score += 12;
  if (stress === 'low') score += 25;
  else if (stress === 'moderate') score += 15;
  else if (stress === 'high') score += 5;
  if (exercise === 'daily') score += 25;
  else if (exercise === 'weekly') score += 15;
  else if (exercise === 'occasional') score += 5;
  if (workPattern === 'balanced') score += 25;
  else if (workPattern === 'flexible') score += 15;
  else if (workPattern === 'demanding') score += 5;
  return score;
}

// Recommended tests based on conditions
export function getRecommendedTests(tool, data = {}) {
  const tests = [];
  const packages = [];

  if (tool === 'bmi' && data.bmi >= 25) {
    tests.push({ name: 'HbA1c', price: 399, reason: 'Screen for diabetes risk' });
    tests.push({ name: 'Lipid Profile', price: 599, reason: 'Check cholesterol levels' });
    tests.push({ name: 'Thyroid Profile', price: 499, reason: 'Metabolic assessment' });
    tests.push({ name: 'Liver Function Test', price: 399, reason: 'Liver health check' });
    tests.push({ name: 'Vitamin D', price: 899, reason: 'Common deficiency in overweight' });
    packages.push({ name: 'Complete Body Check-up', price: 2499 });
  }
  if (tool === 'bp' && (Number(data.systolic) >= 130 || Number(data.diastolic) >= 85)) {
    tests.push({ name: 'Kidney Function Test', price: 499, reason: 'Assess kidney health' });
    tests.push({ name: 'Lipid Profile', price: 599, reason: 'Cardiovascular risk' });
    tests.push({ name: 'HbA1c', price: 399, reason: 'Blood sugar screening' });
    tests.push({ name: 'ECG', price: 399, reason: 'Heart electrical activity' });
    tests.push({ name: 'Serum Electrolytes', price: 299, reason: 'Electrolyte balance' });
    packages.push({ name: 'Cardiac Health Package', price: 3499 });
    packages.push({ name: 'Executive Health Check-up', price: 4999 });
  }
  if (tool === 'heart') {
    tests.push({ name: 'Lipid Profile', price: 599, reason: 'Cholesterol assessment' });
    tests.push({ name: 'ECG', price: 399, reason: 'Heart rhythm check' });
    tests.push({ name: 'hs-CRP', price: 699, reason: 'Inflammation marker' });
    tests.push({ name: 'HbA1c', price: 399, reason: 'Blood sugar screening' });
    tests.push({ name: 'Homocysteine', price: 899, reason: 'Cardiac risk marker' });
    packages.push({ name: 'Cardiac Screening Package', price: 3499 });
    packages.push({ name: 'Executive Health Check-up', price: 4999 });
  }
  if (tool === 'diabetes') {
    tests.push({ name: 'HbA1c', price: 399, reason: '3-month blood sugar average' });
    tests.push({ name: 'Fasting Blood Sugar', price: 199, reason: 'Fasting glucose level' });
    tests.push({ name: 'Postprandial Blood Sugar', price: 199, reason: 'Post-meal glucose' });
    tests.push({ name: 'Urine Routine', price: 199, reason: 'Kidney function screen' });
    tests.push({ name: 'Kidney Function Test', price: 499, reason: 'Kidney health assessment' });
    packages.push({ name: 'Diabetes Screening Package', price: 1999 });
  }
  if (tool === 'bone') {
    tests.push({ name: 'Vitamin D', price: 899, reason: 'Bone health essential' });
    tests.push({ name: 'Calcium', price: 199, reason: 'Bone mineral assessment' });
    tests.push({ name: 'Bone Density Scan (DEXA)', price: 2499, reason: 'Bone density measurement' });
    packages.push({ name: 'Bone Health Package', price: 3999 });
  }
  if (tool === 'women' || tool === 'menstrual' || tool === 'ovulation') {
    tests.push({ name: 'CBC', price: 399, reason: 'Anemia screening' });
    tests.push({ name: 'Thyroid Profile', price: 499, reason: 'Hormonal balance' });
    tests.push({ name: 'Iron Studies', price: 599, reason: 'Iron deficiency check' });
    tests.push({ name: 'Vitamin D', price: 899, reason: 'Bone & immune health' });
    tests.push({ name: 'Vitamin B12', price: 549, reason: 'Energy & nerve health' });
  }
  if (tool === 'pregnancy' || tool === 'pregnancyTracker') {
    tests.push({ name: 'CBC', price: 399, reason: 'Anemia screening' });
    tests.push({ name: 'Blood Group & Rh Typing', price: 299, reason: 'Blood type compatibility' });
    tests.push({ name: 'Blood Sugar Screening', price: 199, reason: 'Gestational diabetes' });
    tests.push({ name: 'Thyroid Profile', price: 499, reason: 'Thyroid function' });
    tests.push({ name: 'Urine Routine', price: 199, reason: 'UTI screening' });
  }
  if (tool === 'child') {
    tests.push({ name: 'CBC', price: 399, reason: 'General health screening' });
    tests.push({ name: 'Vitamin D', price: 899, reason: 'Bone growth essential' });
    tests.push({ name: 'Iron Profile', price: 599, reason: 'Iron deficiency check' });
    tests.push({ name: 'Thyroid Profile', price: 499, reason: 'Growth & metabolism (when indicated)' });
  }
  if (tool === 'calorie') {
    packages.push({ name: 'Weight Management Package', price: 2999 });
  }

  const totalCost = tests.reduce((s, t) => s + (t.price || 0), 0);
  return { tests, packages, totalCost };
}

export const TOOLS = [
  { key: 'bmi', icon: '⚖️', label: 'BMI', color: '#3B82F6' },
  { key: 'bp', icon: '🫀', label: 'Blood Pressure', color: '#EF4444' },
  { key: 'heart', icon: '❤️', label: 'Heart Health', color: '#DC2626' },
  { key: 'menstrual', icon: '📅', label: 'Menstrual Cycle', color: '#EC4899' },
  { key: 'ovulation', icon: '🌸', label: 'Ovulation & Fertility', color: '#F472B6' },
  { key: 'pregnancy', icon: '🤰', label: 'Pregnancy Due Date', color: '#8B5CF6' },
  { key: 'pregnancyTracker', icon: '👶', label: 'Pregnancy Tracker', color: '#A78BFA' },
  { key: 'child', icon: '👶', label: 'Child Growth', color: '#10B981' },
  { key: 'diabetes', icon: '🩸', label: 'Diabetes Risk', color: '#F59E0B' },
  { key: 'calorie', icon: '🔥', label: 'Daily Calories', color: '#F97316' },
  { key: 'bone', icon: '🦴', label: 'Bone Health', color: '#6366F1' },
  { key: 'wellness', icon: '🧠', label: 'Stress & Wellness', color: '#14B8A6' },
  { key: 'idealWeight', icon: '📏', label: 'Ideal Weight', color: '#06B6D4' },
];
