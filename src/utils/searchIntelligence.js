import { seedTests, applyPricing } from '../data/seedData';

const tests = applyPricing(seedTests);

const aliasMap = {
  'cbc': { id: 1, aliases: ['complete blood count', 'complete blood picture', 'cbp', 'hemogram', 'full blood count', 'fbc', 'blood routine', 'hematology profile', 'blood count test', 'complete blood cell count'], misspellings: ['cbcc', 'c b c', 'hemogramm', 'blooc count'], related: ['esr', 'cbc with differential', 'peripheral smear', 'platelet count'], diseases: ['Anemia', 'Infection', 'Inflammation', 'Blood Disorders', 'Nutritional Deficiencies'], symptoms: ['Fatigue', 'Fever', 'Weakness', 'Pale skin', 'Easy bruising'] },
  'hba1c': { id: 2, aliases: ['hemoglobin a1c', 'a1c', 'glycated hemoglobin', 'glycosylated hemoglobin', 'diabetes test', 'sugar test 3 month', 'hba1c test'], misspellings: ['hb1c', 'hbaic', 'hba1c test', 'a1c test', 'hemoglobine a1c'], related: ['fasting blood sugar', 'post prandial blood sugar', 'blood sugar random'], diseases: ['Diabetes', 'Prediabetes', 'Insulin Resistance'], symptoms: ['Frequent urination', 'Excessive thirst', 'Fatigue', 'Blurred vision', 'Slow healing'] },
  'thyroid': { id: 3, aliases: ['thyroid profile', 't3 t4 tsh', 'thyroid function test', 'tft', 'thyroid panel', 'thyroid screening'], misspellings: ['thyriod', 'thyroids', 'thiroyd', 't3 t4 test'], related: ['tsh', 'free t3', 'free t4', 'tpo antibody'], diseases: ['Hypothyroidism', 'Hyperthyroidism', 'Hashimoto\'s Thyroiditis', 'Graves Disease'], symptoms: ['Weight gain', 'Fatigue', 'Hair fall', 'Mood swings', 'Irregular periods'] },
  'lipid': { id: 4, aliases: ['lipid profile', 'lipid panel', 'cholesterol test', 'lipid test', 'heart profile', 'cardiac risk profile', 'lipid profile test'], misspellings: ['lipied', 'lipd profile', 'cholestrol', 'cholesterol test'], related: ['total cholesterol', 'hdl', 'ldl', 'triglycerides', 'vldl', 'hs crp'], diseases: ['High Cholesterol', 'Heart Disease', 'Atherosclerosis', 'Hypertension'], symptoms: ['Chest pain', 'Shortness of breath', 'Obesity', 'Family history of heart disease'] },
  'vitamin d': { id: 5, aliases: ['vitamin d total', '25 oh vitamin d', '25 hydroxy vitamin d', 'calcidiol', 'vitamin d test', 'vit d'], misspellings: ['vitamin d3', 'vit d test', 'vitamine d', 'vitamin d deficiency test'], related: ['calcium', 'vitamin b12', 'iron studies', 'pth'], diseases: ['Vitamin D Deficiency', 'Osteoporosis', 'Rickets', 'Osteomalacia'], symptoms: ['Bone pain', 'Muscle weakness', 'Fatigue', 'Hair loss', 'Mood changes'] },
  'blood sugar': { id: 6, aliases: ['fasting blood sugar', 'fbs', 'fasting glucose', 'blood glucose fasting', 'sugar fasting', 'fbs test'], misspellings: ['bloood sugar', 'sugar test fast', 'fasting suger'], related: ['hba1c', 'ppbs', 'rbs', 'oral glucose tolerance test'], diseases: ['Diabetes', 'Prediabetes', 'Gestational Diabetes', 'Hypoglycemia'], symptoms: ['Excessive thirst', 'Frequent urination', 'Blurred vision', 'Fatigue', 'Weight loss'] },
  'lft': { id: 7, aliases: ['liver function test', 'liver function', 'liver test', 'hepatic profile', 'liver panel', 'hepatic function test'], misspellings: ['liver func test', 'lft test', 'liver profile'], related: ['sgpt', 'sgot', 'ggt', 'alp', 'bilirubin', 'total protein'], diseases: ['Fatty Liver', 'Hepatitis', 'Cirrhosis', 'Liver Disease'], symptoms: ['Jaundice', 'Abdominal pain', 'Nausea', 'Dark urine', 'Fatigue'] },
  'kft': { id: 8, aliases: ['kidney function test', 'renal function test', 'rft', 'kidney profile', 'renal profile', 'kidney test', 'kft test'], misspellings: ['kideny test', 'renel function', 'kft profile'], related: ['creatinine', 'bun', 'uric acid', 'electrolytes', 'egfr'], diseases: ['Kidney Disease', 'Chronic Kidney Disease', 'Kidney Stones', 'UTI'], symptoms: ['Swelling in legs', 'Fatigue', 'Changes in urination', 'Back pain', 'High blood pressure'] },
  'iron': { id: 9, aliases: ['iron studies', 'iron profile', 'iron panel', 'iron deficiency test', 'iron blood test', 'ferritin'], misspellings: ['iiron test', 'iron study', 'iron deficency test'], related: ['ferritin', 'tibc', 'transferrin', 'hemoglobin', 'cbc'], diseases: ['Iron Deficiency Anemia', 'Thalassemia', 'Hemochromatosis', 'Anemia'], symptoms: ['Fatigue', 'Weakness', 'Pale skin', 'Shortness of breath', 'Cold hands and feet'] },
  'vitamin b12': { id: 10, aliases: ['vitamin b12', 'cobalamin', 'b12 test', 'vitamin b12 level', 'b12'], misspellings: ['b12 vitamin', 'vitamin b 12', 'b 12 test', 'vitamine b12'], related: ['folate', 'vitamin d', 'cbc', 'homocysteine'], diseases: ['Vitamin B12 Deficiency', 'Pernicious Anemia', 'Anemia', 'Neuropathy'], symptoms: ['Fatigue', 'Numbness in hands/feet', 'Memory problems', 'Weakness', 'Dizziness'] },
  'tsh': { id: 11, aliases: ['thyroid stimulating hormone', 'tsh test', 'tsh level', 'thyroid screening test'], misspellings: ['tSh', 'tsh test', 'thsh'], related: ['free t3', 'free t4', 'thyroid profile', 'tpo antibody'], diseases: ['Hypothyroidism', 'Hyperthyroidism', 'Subclinical Thyroid Disease'], symptoms: ['Fatigue', 'Weight changes', 'Hair changes', 'Mood swings', 'Temperature sensitivity'] },
  'esr': { id: 36, aliases: ['sedimentation rate', 'erythrocyte sedimentation rate', 'sed rate', 'esr test'], misspellings: ['esr rate', 'sedimination rate'], related: ['crp', 'cbc', 'rheumatoid factor'], diseases: ['Inflammation', 'Autoimmune Disease', 'Infection', 'Arthritis'], symptoms: ['Joint pain', 'Fever', 'Fatigue', 'Body aches'] },
  'crp': { id: 13, aliases: ['c reactive protein', 'crp test', 'hs crp', 'high sensitivity crp', 'c-reactive protein'], misspellings: ['crp blood test', 'c reaction protein'], related: ['esr', 'cbc', 'rheumatoid factor'], diseases: ['Inflammation', 'Heart Disease', 'Infection', 'Autoimmune Disease'], symptoms: ['Fever', 'Joint pain', 'Swelling', 'Fatigue'] },
  'uric acid': { id: 14, aliases: ['urate', 'serum uric acid', 'uric acid test', 'uric acid level'], misspellings: ['urik acid', 'uric aicd'], related: ['creatinine', 'rft', 'lft'], diseases: ['Gout', 'Kidney Stones', 'Hyperuricemia'], symptoms: ['Joint pain (big toe)', 'Swelling', 'Redness', 'Warm joints'] },
  'dengue': { id: 16, aliases: ['dengue test', 'dengue ns1', 'dengue fever test', 'dengue antigen', 'ns1 antigen'], misspellings: ['dengu', 'dengue test', 'denge'], related: ['cbc', 'platelet count', 'typhoid test'], diseases: ['Dengue Fever', 'Dengue Hemorrhagic Fever'], symptoms: ['High fever', 'Severe headache', 'Joint pain', 'Rash', 'Bleeding'] },
  'malaria': { id: 17, aliases: ['malaria test', 'malaria antigen', 'malaria parasite', 'mp test'], misspellings: ['maleria', 'maliria', 'malaia'], related: ['cbc', 'platelet count', 'dengue test'], diseases: ['Malaria', 'Vivax Malaria', 'Falciparum Malaria'], symptoms: ['Fever with chills', 'Sweating', 'Headache', 'Nausea', 'Muscle pain'] },
  'ecg': { id: 31, aliases: ['electrocardiogram', 'ekg', 'heart ecg', 'electrocardiograph', 'cardiac ecg', '12 lead ecg'], misspellings: ['ekg test', 'ecg test', 'electro'], related: ['lipid profile', 'troponin', 'echocardiogram'], diseases: ['Heart Attack', 'Arrhythmia', 'Heart Disease', 'Ischemia'], symptoms: ['Chest pain', 'Palpitations', 'Shortness of breath', 'Dizziness'] },
  'pregnancy': { id: 30, aliases: ['pregnancy test', 'hcg test', 'beta hcg', 'pregnancy hcg', 'urine pregnancy test'], misspellings: ['pregnency', 'preg test', 'hcg test'], related: ['ultrasound', 'blood group', 'urine routine'], diseases: ['Pregnancy', 'Ectopic Pregnancy'], symptoms: ['Missed period', 'Nausea', 'Breast tenderness', 'Fatigue'] },
  'prostate': { id: 22, aliases: ['psa', 'prostate specific antigen', 'psa test', 'prostate cancer test'], misspellings: ['prostrate', 'psa level', 'prostate test'], related: ['free psa', 'psa ratio', 'urine routine'], diseases: ['Prostate Cancer', 'BPH', 'Prostatitis'], symptoms: ['Frequent urination', 'Difficulty urinating', 'Weak urine stream'] },
  'rheumatoid': { id: 28, aliases: ['rheumatoid factor', 'rf test', 'ra factor', 'rheumatoid arthritis test'], misspellings: ['rheumatod', 'ra test', 'rheumatoif factor'], related: ['anti ccp', 'crp', 'esr'], diseases: ['Rheumatoid Arthritis', 'Autoimmune Disease'], symptoms: ['Joint pain', 'Morning stiffness', 'Swelling', 'Fatigue'] },
  'allergy': { id: 26, aliases: ['allergy test', 'allergy panel', 'food allergy test', 'ig e test', 'allergy screening'], misspellings: ['allergy', 'allerjy test'], related: ['eosinophil count', 'cbc', 'ig e levels'], diseases: ['Allergies', 'Food Allergy', 'Seasonal Allergy'], symptoms: ['Sneezing', 'Itching', 'Rash', 'Hives', 'Watery eyes'] },
};

const symptomToTests = {
  'fatigue': ['CBC', 'Vitamin B12', 'Vitamin D', 'Thyroid Profile', 'HbA1c', 'Iron Studies', 'FSH'],
  'weakness': ['CBC', 'Iron Studies', 'Vitamin B12', 'Vitamin D', 'Thyroid Profile'],
  'fever': ['CBC', 'CRP', 'Malaria Test', 'Dengue Test', 'Typhoid Test', 'Urine Routine'],
  'weight gain': ['Thyroid Profile', 'Lipid Profile', 'Blood Sugar', 'HbA1c'],
  'weight loss': ['Thyroid Profile', 'Blood Sugar', 'HbA1c', 'CBC', 'Stool Test'],
  'hair fall': ['Thyroid Profile', 'Vitamin D', 'Iron Studies', 'Hormone Panel'],
  'chest pain': ['ECG', 'Lipid Profile', 'Troponin', 'CK-MB', 'hs-CRP'],
  'joint pain': ['Uric Acid', 'Rheumatoid Factor', 'Vitamin D', 'CRP', 'Anti-CCP'],
  'headache': ['CBC', 'Blood Sugar', 'Thyroid Profile', 'Vitamin B12'],
  'dizziness': ['CBC', 'Blood Sugar', 'Iron Studies', 'Thyroid Profile', 'Vitamin B12'],
  'anemia': ['CBC', 'Iron Studies', 'Vitamin B12', 'Folate', 'Hemoglobin Electrophoresis'],
  'diabetes': ['HbA1c', 'Fasting Blood Sugar', 'Post Prandial Blood Sugar', 'Lipid Profile'],
  'thyroid': ['TSH', 'Free T3', 'Free T4', 'Thyroid Profile', 'TPO Antibody'],
  'cough': ['CBC', 'Chest X-Ray', 'CRP', 'Sputum Test'],
  'skin rash': ['Allergy Panel', 'CBC', 'IgE Levels', 'Skin Biopsy'],
  'abdominal pain': ['Liver Function Test', 'Amylase', 'Lipase', 'Stool Test', 'Ultrasound'],
  'back pain': ['Urine Routine', 'KFT', 'X-Ray', 'Vitamin D'],
  'swelling': ['KFT', 'Serum Protein', 'Thyroid Profile', 'Urine Routine'],
};

function normalize(str) {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export function searchTests(query) {
  const q = normalize(query);
  if (!q) return [];
  const results = [];
  const seen = new Set();

  const aliasEntry = aliasMap[q];
  if (aliasEntry) {
    const test = tests.find(t => t.id === aliasEntry.id);
    if (test && !seen.has(test.id)) {
      seen.add(test.id);
      results.push({ test, aliases: aliasEntry.aliases, matchType: 'exact', diseases: aliasEntry.diseases, symptoms: aliasEntry.symptoms, related: aliasEntry.related });
    }
  }

  for (const [key, entry] of Object.entries(aliasMap)) {
    if (seen.has(entry.id)) continue;
    const allNames = [key, ...entry.aliases, ...entry.misspellings];
    const match = allNames.some(name => normalize(name) === q || normalize(name).includes(q) || q.includes(normalize(name)));
    if (match) {
      const test = tests.find(t => t.id === entry.id);
      if (test) {
        seen.add(test.id);
        results.push({ test, aliases: entry.aliases, matchType: 'alias', diseases: entry.diseases, symptoms: entry.symptoms, related: entry.related });
      }
    }
  }

  const symptomMatch = Object.entries(symptomToTests).find(([sym]) => normalize(sym) === q || normalize(sym).includes(q) || q.includes(normalize(sym)));
  if (symptomMatch) {
    const [symptom, testNames] = symptomMatch;
    const matchedTests = testNames.map(name => {
      const lower = normalize(name);
      const test = tests.find(t => normalize(t.name).includes(lower) || lower.includes(normalize(t.name)));
      return test || null;
    }).filter(Boolean).filter(t => !seen.has(t.id));
    matchedTests.forEach(t => seen.add(t.id));
    results.push({ symptom, tests: matchedTests, matchType: 'symptom' });
  }

  for (const test of tests) {
    if (seen.has(test.id)) continue;
    const tName = normalize(test.name);
    const tCat = normalize(test.category);
    const tSubcat = normalize(test.subcategory);
    if (tName.includes(q) || tCat.includes(q) || tSubcat.includes(q) || q.includes(tName)) {
      const matchEntry = Object.values(aliasMap).find(e => e.id === test.id);
      seen.add(test.id);
      results.push({ test, aliases: matchEntry?.aliases || [], matchType: 'partial', diseases: matchEntry?.diseases || [], symptoms: matchEntry?.symptoms || [], related: matchEntry?.related || [] });
    }
  }

  for (const test of tests) {
    if (seen.has(test.id)) continue;
    const tName = normalize(test.name);
    if (levenshtein(tName, q) <= 2) {
      seen.add(test.id);
      results.push({ test, aliases: [], matchType: 'fuzzy', diseases: [], symptoms: [], related: [] });
    }
  }

  return results.slice(0, 10);
}

export function getPopularSearches(query) {
  const q = normalize(query);
  if (!q) return [];
  return [
    `${q} test price`,
    `${q} normal range`,
    `${q} test preparation`,
    `${q} test meaning`,
    `${q} symptoms`,
  ].filter(s => s.length > q.length);
}

export default aliasMap;
