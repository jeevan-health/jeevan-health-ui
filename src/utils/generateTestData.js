import { seedTests } from '../data/seedData';

const CATEGORY_META = {
  Hematology: { dept: 'Haematology', organ: 'Blood', diseases: ['Anemia', 'Infection', 'Blood Disorders'], bodyFunc: 'Oxygen transport, immunity, clotting' },
  Diabetes: { dept: 'Biochemistry', organ: 'Pancreas', diseases: ['Diabetes', 'Prediabetes', 'Insulin Resistance'], bodyFunc: 'Blood glucose regulation' },
  Thyroid: { dept: 'Biochemistry', organ: 'Thyroid', diseases: ['Hypothyroidism', 'Hyperthyroidism', 'Hashimoto\'s'], bodyFunc: 'Metabolism, growth, development' },
  Cardiac: { dept: 'Biochemistry', organ: 'Heart', diseases: ['Heart Disease', 'Atherosclerosis', 'Hypertension'], bodyFunc: 'Cardiovascular function assessment' },
  Vitamins: { dept: 'Biochemistry', organ: 'Multiorgan', diseases: ['Vitamin Deficiency', 'Malnutrition'], bodyFunc: 'Nutritional status, metabolic cofactors' },
  'Full Body': { dept: 'Clinical Pathology', organ: 'Multiorgan', diseases: ['Multisystem Disorders'], bodyFunc: 'Comprehensive organ function assessment' },
  Anemia: { dept: 'Haematology', organ: 'Blood', diseases: ['Anemia', 'Iron Deficiency', 'Thalassemia'], bodyFunc: 'Erythropoiesis, iron metabolism' },
  Fever: { dept: 'Microbiology', organ: 'Immune System', diseases: ['Infection', 'Dengue', 'Malaria', 'Typhoid'], bodyFunc: 'Infectious disease detection' },
  Cancer: { dept: 'Serology', organ: 'Multiorgan', diseases: ['Cancer Screening', 'Tumor Monitoring'], bodyFunc: 'Tumor marker assessment' },
  Hormones: { dept: 'Biochemistry', organ: 'Endocrine System', diseases: ['Hormonal Imbalance'], bodyFunc: 'Endocrine function evaluation' },
  Allergy: { dept: 'Immunology', organ: 'Immune System', diseases: ['Allergy', 'Atopy'], bodyFunc: 'Immune response to allergens' },
  Arthritis: { dept: 'Immunology', organ: 'Joints', diseases: ['Rheumatoid Arthritis', 'Gout', 'Osteoarthritis'], bodyFunc: 'Joint and autoimmune assessment' },
  Pregnancy: { dept: 'Biochemistry', organ: 'Reproductive', diseases: ['Pregnancy', 'Fertility Assessment'], bodyFunc: 'Pregnancy detection and monitoring' },
  STD: { dept: 'Microbiology', organ: 'Reproductive', diseases: ['Sexually Transmitted Infections'], bodyFunc: 'Sexually transmitted infection screening' },
  Liver: { dept: 'Biochemistry', organ: 'Liver', diseases: ['Liver Disease', 'Hepatitis', 'Fatty Liver'], bodyFunc: 'Liver function and integrity' },
  Kidney: { dept: 'Biochemistry', organ: 'Kidney', diseases: ['Kidney Disease', 'CKD'], bodyFunc: 'Renal function and filtration' },
};

const SAMPLE_INFO = {
  Blood: { volume: '2-5 mL', process: 'Venipuncture from antecubital vein using sterile vacutainer system.', quality: 'Hemolyzed samples rejected. Avoid prolonged tourniquet application.' },
  Urine: { volume: '10-50 mL', process: 'Mid-stream clean-catch sample in sterile container.', quality: 'First morning sample preferred. Transport within 1 hour.' },
  Stool: { volume: '5-10 g', process: 'Collect in clean dry container with leak-proof lid.', quality: 'Avoid contamination with urine or water. Transport within 2 hours.' },
  Semen: { volume: '2-5 mL', process: 'Collected by masturbation after 3-5 days abstinence.', quality: 'Deliver within 1 hour. Keep at body temperature during transport.' },
  Saliva: { volume: '1-2 mL', process: 'Passive drool into sterile container. Avoid eating/drinking 30 min prior.', quality: 'Avoid blood contamination from oral lesions.' },
  Swab: { volume: 'Single swab', process: 'Rotate swab at collection site for 10-15 seconds.', quality: 'Use sterile transport medium. Process within 24 hours.' },
  Tissue: { volume: 'Biopsy specimen', process: 'Fixed in 10% formalin immediately after collection.', quality: 'Adequate tissue size required for accurate diagnosis.' },
  CSF: { volume: '1-2 mL', process: 'Lumbar puncture by qualified physician under aseptic conditions.', quality: 'Transport immediately. Do not refrigerate.' },
  Hair: { volume: '50-100 strands', process: 'Cut from posterior vertex region close to scalp.', quality: 'Roots may be required for certain tests.' },
  Nail: { volume: '10-20 mg', process: 'Clippings from all 10 fingers/clean toenails.', quality: 'Ensure no nail polish or topical medications.' },
};

const REFERENCE_RANGES = {
  'Complete Blood Count (CBC)': { normal: 'Hb: 13-17 g/dL (M), 12-15 g/dL (F), WBC: 4000-11000 cells/µL, Platelets: 1.5-4.5 lakhs/µL', critical: 'Hb <7 or >20 g/dL, WBC <1000 or >50000', unit: 'Various' },
  'HbA1c': { normal: '<5.7% Normal, 5.7-6.4% Prediabetes, ≥6.5% Diabetes', critical: '>9% Poor control, >12% Severe hyperglycemia', unit: '%' },
  'Thyroid Profile (T3, T4, TSH)': { normal: 'TSH: 0.4-4.0 mIU/L, T3: 80-200 ng/dL, T4: 5-12 µg/dL', critical: 'TSH <0.01 or >100', unit: 'mIU/L, ng/dL, µg/dL' },
  'Lipid Profile': { normal: 'TC <200, LDL <100, HDL >40 (M)/>50 (F), TG <150 mg/dL', critical: 'TC >350, TG >500', unit: 'mg/dL' },
  'default': { normal: 'Varies by age and gender. Reference range provided with report.', critical: 'Significantly outside normal range requires immediate attention.', unit: 'As specified' },
};

const RISK_LEVELS = [
  { level: 'Normal', color: 'green', desc: 'All parameters within healthy reference range.' },
  { level: 'Borderline', color: 'orange', desc: 'One or more parameters slightly outside reference range. May require lifestyle modification.' },
  { level: 'Abnormal', color: 'red', desc: 'Parameters significantly outside reference range. Medical consultation recommended.' },
];

const MEDICATION_IMPACT = 'Certain medications may affect test results including antibiotics, steroids, diuretics, anticoagulants, and hormonal preparations. Inform your doctor about all medications and supplements.';
const LIFESTYLE_ADVICE = 'Diet, exercise, sleep, stress, alcohol consumption, and smoking can affect test results. Maintain consistent lifestyle for 48 hours before sample collection.';

function getAbbreviation(name) {
  const m = name.match(/\(([^)]+)\)/);
  if (m) return m[1];
  const words = name.replace(/[^a-zA-Z\s]/g, '').split(/\s+/).filter(Boolean);
  if (words.length <= 3) return words.map(w => w[0]).join('').toUpperCase();
  const stopWords = new Set(['of', 'the', 'and', 'for', 'in', 'to', 'a', 'an']);
  return words.filter(w => !stopWords.has(w.toLowerCase())).slice(0, 4).map(w => w[0]).join('').toUpperCase();
}

function getScientificName(name) {
  const map = {
    'CBC': 'Complete Hemogram',
    'HbA1c': 'Glycated Hemoglobin',
    'TSH': 'Thyroid Stimulating Hormone',
    'ESR': 'Erythrocyte Sedimentation Rate',
  };
  for (const [k, v] of Object.entries(map)) {
    if (name.includes(k)) return v;
  }
  return `${name} Assay`;
}

function getWhatIsThis(name, cat) {
  const map = {
    'CBC': 'A Complete Blood Count is a routine blood test that evaluates overall health and detects a wide range of disorders including anemia, infection, and leukemia.',
    'HbA1c': 'This test measures your average blood sugar levels over the past 2-3 months by assessing the percentage of glycated hemoglobin in your blood.',
    'Thyroid': 'A thyroid function test evaluates how well your thyroid gland is working by measuring hormone levels in your blood.',
    'Lipid': 'A lipid profile measures cholesterol and triglyceride levels to assess your risk of heart disease and stroke.',
  };
  for (const [k, v] of Object.entries(map)) {
    if (name.includes(k) || cat.includes(k)) return v;
  }
  return `The ${name} test measures specific biomarkers in your blood to evaluate health status related to ${cat.toLowerCase()}.`;
}

function getWhyDone(name, cat) {
  const reasons = {
    'CBC': 'To evaluate overall health, screen for disorders like anemia and infection, monitor medical conditions, and assess treatment effectiveness.',
    'HbA1c': 'To diagnose prediabetes and diabetes, monitor blood sugar control in diabetic patients, and adjust treatment plans.',
    'Thyroid': 'To diagnose thyroid disorders, monitor thyroid hormone replacement therapy, and evaluate symptoms like fatigue, weight changes, and mood disturbances.',
    'default': `To screen for, diagnose, and monitor conditions related to ${cat.toLowerCase()}. Also used for routine health assessment and preventive care.`,
  };
  for (const [k, v] of Object.entries(reasons)) {
    if (k !== 'default' && (name.includes(k) || cat.includes(k))) return v;
  }
  return reasons.default;
}

function getWhatMeasures(name) {
  const map = {
    'CBC': 'Red blood cells, white blood cells, hemoglobin, hematocrit, platelets, MCV, MCH, MCHC, RDW, and differential count.',
    'HbA1c': 'Percentage of glycated hemoglobin (HbA1c) in total hemoglobin, reflecting average blood glucose over 120 days.',
    'default': 'Quantitative levels of the specific biomarker(s) in your blood sample.',
  };
  for (const [k, v] of Object.entries(map)) {
    if (k !== 'default' && name.includes(k)) return v;
  }
  return map.default;
}

function getClinicalSignificance(name, cat) {
  return `Results of this test help healthcare providers ${cat === 'Cardiac' ? 'assess cardiovascular risk and guide heart disease management' : cat === 'Diabetes' ? 'diagnose and monitor diabetes, preventing complications through optimal glycemic control' : cat === 'Thyroid' ? 'diagnose thyroid dysfunction and optimize hormone replacement therapy' : cat === 'Hematology' ? 'evaluate blood cell production and detect hematological disorders early' : 'screen for, diagnose, and monitor health conditions, enabling timely intervention'}. Regular monitoring improves long-term health outcomes.`;
}

function getWhoShouldTake(name, cat) {
  const items = [`Individuals showing symptoms related to ${cat.toLowerCase()}`, 'Those with family history of related conditions', 'Routine health screening and preventive care', 'People with pre-existing conditions requiring monitoring'];
  if (cat === 'Diabetes') items.push('Overweight or obese individuals', 'Age 35+ for baseline screening');
  if (cat === 'Cardiac') items.push('Smokers and individuals with sedentary lifestyle', 'Age 40+ or earlier with risk factors');
  if (cat === 'Thyroid') items.push('Women planning pregnancy or postpartum', 'Individuals with autoimmune conditions');
  return items;
}

function getSymptoms(name, cat) {
  const s = {
    'CBC': ['Fatigue and weakness', 'Frequent infections', 'Easy bruising or bleeding', 'Pale skin', 'Shortness of breath'],
    'HbA1c': ['Increased thirst and urination', 'Unexplained weight loss', 'Fatigue', 'Blurred vision', 'Slow healing wounds'],
    'Thyroid': ['Weight changes', 'Fatigue', 'Hair loss', 'Mood swings', 'Temperature sensitivity'],
    'Lipid': ['Chest pain or discomfort', 'Shortness of breath', 'Obesity', 'High blood pressure', 'Family history of heart disease'],
    'default': [`Symptoms related to ${cat.toLowerCase()} conditions`, 'Routine screening requirements', 'Doctor recommendation', 'Preventive health checkup'],
  };
  for (const [k, v] of Object.entries(s)) {
    if (k !== 'default' && name.includes(k)) return v;
  }
  return s.default;
}

function getDiseases(name, cat) {
  const m = CATEGORY_META[cat];
  return m?.diseases || [`${cat} Disorders`, 'Related health conditions'];
}

function getFaqs(name, cat, price) {
  const n = name.replace(/\([^)]*\)/g, '').trim();
  return [
    { question: `What is the ${n} test?`, answer: `The ${name} test measures biomarker levels to evaluate ${cat.toLowerCase()} health.`, order: 1, active: true },
    { question: `How much does the ${n} test cost?`, answer: `The test costs ₹${price || 'contact for price'}. We offer competitive pricing with no hidden charges.`, order: 2, active: true },
    { question: 'Is home collection available?', answer: 'Yes, free home sample collection is included. Schedule at your preferred time slot. Morning slots are recommended for accurate results.', order: 3, active: true },
    { question: `How long does it take to get ${n} results?`, answer: 'Reports are delivered within 24-48 hours via WhatsApp, Email, and the Jeevan HealthCare app.', order: 4, active: true },
    { question: 'Do I need a doctor prescription?', answer: 'No prescription needed for most tests. However, we recommend consulting a doctor for result interpretation.', order: 5, active: true },
    { question: `What do abnormal ${name} results mean?`, answer: 'Abnormal results may indicate an underlying health condition. Please consult your doctor for proper interpretation and follow-up.', order: 6, active: true },
    { question: 'Can I eat before this test?', answer: 'Fasting requirements vary by test. Check the preparation instructions above. Fasting tests require 8-12 hours without food.', order: 7, active: true },
    { question: 'How is the sample collected?', answer: 'A trained phlebotomist visits your home to collect the sample. The process takes 5-10 minutes using sterile, single-use equipment.', order: 8, active: true },
    { question: 'Are your labs certified?', answer: 'All tests are processed at NABL-certified laboratories with advanced automated analyzers and rigorous quality control protocols.', order: 9, active: true },
    { question: `Can I book ${n} for someone else?`, answer: 'Yes, you can book tests for family members. Add their details as a family member during checkout.', order: 10, active: true },
    { question: `What is the normal range for ${n}?`, answer: 'Normal reference ranges are provided with your test report. Ranges may vary by age, gender, and laboratory.', order: 11, active: true },
    { question: 'Do you offer corporate packages?', answer: 'Yes, we offer corporate wellness packages. Contact us for bulk booking discounts and corporate pricing.', order: 12, active: true },
    { question: `How often should I get ${n} done?`, answer: 'Frequency depends on your age, health status, and risk factors. Generally annually for screening, or as recommended by your doctor.', order: 13, active: true },
    { question: 'Is the test painful?', answer: 'The sample collection involves a quick pinprick sensation. Our trained phlebotomists ensure minimal discomfort.', order: 14, active: true },
    { question: 'What preparation is needed?', answer: 'Follow the specific preparation instructions for your test. Stay hydrated, inform the lab about medications, and avoid alcohol before testing.', order: 15, active: true },
  ];
}

function getBiomarkers(name, cat) {
  const ct = CATEGORY_META[cat];
  return [{
    biomarkerName: name.replace(/\([^)]*\)/g, '').trim(),
    description: `Measures key indicators for ${cat.toLowerCase()} health assessment.`,
    bodyFunction: ct?.bodyFunc || 'Metabolic and physiological function',
    clinicalImportance: `Essential for ${cat.toLowerCase()} evaluation`,
    relatedDiseases: (ct?.diseases || []).join(', '),
    referenceValues: 'Provided with lab report',
  }];
}

function getRefRanges(name) {
  const rr = REFERENCE_RANGES[name] || REFERENCE_RANGES.default;
  return [{
    ageGroup: 'All', gender: 'Both',
    normalRange: rr.normal,
    criticalRange: rr.critical,
    unit: rr.unit,
    interpretation: 'Compare your result with the normal range provided. Values outside normal range may require medical attention.',
  }];
}

function getRelatedTests(test, allTests) {
  const sameCat = allTests.filter(t => t.category === test.category && t.id !== test.id).slice(0, 6);
  return sameCat.map(t => t.name).join(', ');
}

function getSeo(name, cat, price) {
  const n = name.replace(/\([^)]*\)/g, '').trim();
  return {
    seoUrl: `/test/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
    metaTitle: `Book ${name} at Home ₹${price || ''} | Jeevan HealthCare`,
    metaDescription: `Book ${name} test at home with free sample collection. ₹${price || ''}. NABL certified. Reports in 24 hrs.`,
    keywords: `${n}, ${n.toLowerCase()} test, book ${n.toLowerCase()}, ${cat.toLowerCase()} test at home, ${cat.toLowerCase()} blood test`,
    schemaMarkup: '',
    socialImage: '',
  };
}

export function generateTestData(test, allTests) {
  const name = test.name;
  const cat = test.category;
  const price = test.offerPrice || test.price || 0;
  const abbr = getAbbreviation(name);
  const catMeta = CATEGORY_META[cat] || { dept: 'Clinical Pathology', organ: 'Blood', diseases: ['Related Conditions'] };
  const sampleType = test.sample_type || 'Blood';
  const sampleInfo = SAMPLE_INFO[sampleType] || SAMPLE_INFO.Blood;

  return {
    testId: test.id?.toString() || '',
    internalCode: `${abbr}${test.id}`,
    lisCode: `LIS-${abbr}${test.id}`,
    loincCode: '',
    cptCode: '',
    name,
    fullName: `${name} Test`,
    scientificName: getScientificName(name),
    abbreviation: abbr,
    alternateNames: '',
    synonyms: '',
    alsoKnownAs: '',
    languages: { hindi: '', telugu: '', tamil: '', kannada: '' },
    category: cat,
    subcategory: test.subcategory || cat,
    department: catMeta.dept,
    bodyOrgan: catMeta.organ,
    diseaseGroup: catMeta.diseases[0] || cat,
    gender: 'Both',
    ageGroup: 'All',
    testType: cat === 'Cancer' ? 'Screening' : cat === 'Diabetes' || cat === 'Cardiac' ? 'Monitoring' : 'Diagnostic',
    shortDescription: test.description || `${name} test for ${cat.toLowerCase()} health assessment.`,
    longDescription: `${name} is a ${cat.toLowerCase()} test that ${test.description?.toLowerCase() || 'helps evaluate health status'}. This test is used for screening, diagnosis, and monitoring of ${cat.toLowerCase()}-related conditions.`,
    whatIsThis: getWhatIsThis(name, cat),
    whyDone: getWhyDone(name, cat),
    whatMeasures: getWhatMeasures(name),
    clinicalSignificance: getClinicalSignificance(name, cat),
    whoShouldTake: getWhoShouldTake(name, cat).join('\n'),
    symptoms: getSymptoms(name, cat).join('\n'),
    diseases: getDiseases(name, cat).join('\n'),
    preparation: test.preparation_instructions || 'No special preparation required.',
    fastingRequired: !!test.fasting_required,
    sampleType,
    sampleVolume: sampleInfo.volume,
    collectionProcess: sampleInfo.process,
    reportTime: test.report_time || '24 hrs',
    resultExplanation: 'Your test results will include measured values alongside reference ranges. Values within the reference range are considered normal. Values outside may indicate a need for further evaluation.',
    normalRange: REFERENCE_RANGES[name]?.normal || REFERENCE_RANGES.default.normal,
    riskLevel: RISK_LEVELS.map(r => `${r.level}: ${r.desc}`).join('\n'),
    limitations: [`${name} results should be interpreted in clinical context`, 'Single abnormal value does not confirm disease', 'Results may vary between laboratories', 'Certain medications and conditions may affect results'],
    medicationImpact: MEDICATION_IMPACT,
    lifestyleAdvice: LIFESTYLE_ADVICE,
    sampleQualityIssues: sampleInfo.quality,
    followUpTests: getRelatedTests(test, allTests),
    biomarkers: getBiomarkers(name, cat),
    refRanges: getRefRanges(name),
    mrp: test.mrp || Math.round(price * 1.3),
    offerPrice: price,
    discount: test.discount || (test.mrp ? Math.round((1 - price / test.mrp) * 100) : Math.round((1 - 1 / 1.3) * 100)),
    corporatePrice: Math.round(price * 0.85),
    insurancePrice: price,
    b2bPrice: Math.round(price * 0.8),
    homeCollectionFee: 0,
    gst: 18,
    bookingAvailable: true,
    homeCollection: true,
    locations: 'Hyderabad, Secunderabad, Gachibowli, HITEC City, Madhapur, Kukatpally, Jubilee Hills, Banjara Hills, Kondapur',
    sampleTypeBooking: sampleType,
    reportDeliveryTime: test.report_time || '24 hrs',
    emergencyAvailable: false,
    relatedTests: getRelatedTests(test, allTests),
    relatedPackages: '',
    recommendedFor: `Patients with ${cat.toLowerCase()} concerns, Routine health screening`,
    frequentlyBought: '',
    crossSell: '',
    faqs: getFaqs(name, cat, price),
    ...getSeo(name, cat, price),
    status: 'Active',
  };
}

export function generateAllTestsData() {
  const data = {};
  seedTests.forEach(test => {
    data[test.id] = generateTestData(test, seedTests);
  });
  return data;
}
