import { seedTests } from '../data/seedData';
import { getPackagesByAxis } from './packageGenerator';

const relatedMap = {
  'Complete Blood Count (CBC)': [
    { name: 'Iron Studies', priority: 5, reason: 'Evaluate iron deficiency and anemia' },
    { name: 'Ferritin', priority: 5, reason: 'Assess body iron stores' },
    { name: 'Vitamin B12', priority: 4, reason: 'Check nutritional deficiency causing fatigue' },
    { name: 'Folate', priority: 4, reason: 'Evaluate megaloblastic anemia' },
    { name: 'ESR (Erythrocyte Sedimentation Rate)', priority: 4, reason: 'Detect inflammation and infection' },
    { name: 'hs-CRP', priority: 3, reason: 'Assess inflammatory conditions' },
  ],
  'HbA1c': [
    { name: 'Fasting Blood Sugar', priority: 5, reason: 'Current blood glucose level' },
    { name: 'Lipid Profile', priority: 5, reason: 'Diabetes increases heart disease risk' },
    { name: 'Liver Function Test (LFT)', priority: 4, reason: 'Monitor liver health with diabetes' },
    { name: 'Kidney Function Test (KFT)', priority: 4, reason: 'Diabetes can affect kidney function' },
    { name: 'Vitamin D Total', priority: 3, reason: 'Deficiency common in diabetes' },
  ],
  'Thyroid Profile (T3, T4, TSH)': [
    { name: 'TSH', priority: 5, reason: 'Primary thyroid screening' },
    { name: 'Vitamin D Total', priority: 4, reason: 'Autoimmune link with thyroid disorders' },
    { name: 'Vitamin B12', priority: 4, reason: 'Deficiency common in hypothyroidism' },
    { name: 'Lipid Profile', priority: 4, reason: 'Thyroid disorders affect cholesterol' },
    { name: 'Iron Studies', priority: 3, reason: 'Anemia can accompany thyroid issues' },
  ],
  'Lipid Profile': [
    { name: 'hs-CRP', priority: 5, reason: 'Assess heart inflammation' },
    { name: 'Blood Sugar (Fasting)', priority: 5, reason: 'Diabetes increases cardiac risk' },
    { name: 'HbA1c', priority: 4, reason: 'Long-term sugar control' },
    { name: 'Liver Function Test (LFT)', priority: 3, reason: 'Monitor statin effect on liver' },
    { name: 'Uric Acid', priority: 3, reason: 'Associated with metabolic syndrome' },
  ],
  'Vitamin D Total': [
    { name: 'Serum Calcium', priority: 5, reason: 'Calcium metabolism linked to vitamin D' },
    { name: 'Vitamin B12', priority: 4, reason: 'Common dual deficiency' },
    { name: 'Iron Studies', priority: 4, reason: 'Fatigue evaluation' },
    { name: 'Thyroid Profile (T3, T4, TSH)', priority: 3, reason: 'Autoimmune conditions' },
  ],
  'Vitamin B12': [
    { name: 'CBC', priority: 5, reason: 'B12 deficiency causes anemia' },
    { name: 'Folate', priority: 5, reason: 'Often deficient together' },
    { name: 'Vitamin D Total', priority: 4, reason: 'Common dual deficiency' },
    { name: 'Iron Studies', priority: 4, reason: 'Comprehensive anemia panel' },
  ],
  'Liver Function Test (LFT)': [
    { name: 'SGPT / ALT', priority: 5, reason: 'Key liver enzyme' },
    { name: 'Lipid Profile', priority: 4, reason: 'Fatty liver assessment' },
    { name: 'HbA1c', priority: 4, reason: 'Metabolic syndrome evaluation' },
    { name: 'Ultrasound Abdomen', priority: 3, reason: 'Structural liver assessment' },
  ],
  'Kidney Function Test (KFT)': [
    { name: 'Urine Routine & Microscopy', priority: 5, reason: 'Complete kidney assessment' },
    { name: 'Blood Sugar (Fasting)', priority: 5, reason: 'Diabetes is leading cause of kidney disease' },
    { name: 'Serum Electrolytes', priority: 4, reason: 'Electrolyte balance' },
    { name: 'Uric Acid', priority: 4, reason: 'Kidney function affects uric acid' },
  ],
};

const diseaseMap = {
  'Complete Blood Count (CBC)': ['Anemia', 'Infection', 'Inflammation', 'Blood Disorders', 'Nutritional Deficiencies'],
  'HbA1c': ['Diabetes', 'Prediabetes', 'Insulin Resistance', 'Metabolic Syndrome'],
  'Thyroid Profile (T3, T4, TSH)': ['Hypothyroidism', 'Hyperthyroidism', "Hashimoto's Thyroiditis", 'Graves Disease'],
  'Lipid Profile': ['High Cholesterol', 'Heart Disease', 'Atherosclerosis', 'Metabolic Syndrome'],
  'Vitamin D Total': ['Vitamin D Deficiency', 'Osteoporosis', 'Rickets', 'Osteomalacia'],
  'Vitamin B12': ['Vitamin B12 Deficiency', 'Pernicious Anemia', 'Neuropathy', 'Megaloblastic Anemia'],
  'Liver Function Test (LFT)': ['Fatty Liver', 'Hepatitis', 'Cirrhosis', 'Liver Disease'],
  'Kidney Function Test (KFT)': ['Chronic Kidney Disease', 'Kidney Stones', 'UTI', 'Acute Kidney Injury'],
};

const packageMap = {
  'Complete Blood Count (CBC)': ['Anemia Screening Package', 'Executive Health Checkup'],
  'HbA1c': ['Diabetes Care Package', 'Executive Health Checkup'],
  'Thyroid Profile (T3, T4, TSH)': ['Thyroid Wellness Package', 'Executive Health Checkup'],
  'Lipid Profile': ['Cardiac Risk Assessment Package', 'Executive Health Checkup'],
  'Vitamin D Total': ['Vitamin Deficiency Panel', 'Executive Health Checkup'],
  'Vitamin B12': ['Vitamin Deficiency Panel', 'Fatigue Evaluation Package'],
};

export function getRelatedTests(testName) {
  const rel = relatedMap[testName];
  if (!rel) {
    const test = seedTests.find(t => t.name === testName);
    if (!test) return [];
    return seedTests.filter(t => t.category === test.category && t.name !== testName).slice(0, 6).map(t => ({
      name: t.name, priority: 3, reason: `Same category: ${t.category}`,
    }));
  }
  return rel.sort((a, b) => b.priority - a.priority);
}

export function getRelatedDiseases(testName) {
  return diseaseMap[testName] || [];
}

export function getRelatedPackages(testName, allTests) {
  const pkgNames = packageMap[testName] || [];
  const allPkgs = Object.values(getPackagesByAxis(allTests)).flat();
  return pkgNames.map(name => allPkgs.find(p => p.name === name)).filter(Boolean);
}
