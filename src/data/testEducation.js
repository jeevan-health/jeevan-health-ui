import { seedTests } from './seedData';

const altNames = {
  'Complete Blood Count (CBC)': { abbr: 'CBC', alt: ['Hemogram Test', 'Blood Profile Test', 'Full Blood Count Test (FBC)', 'Routine Blood Test'] },
  'HbA1c': { abbr: 'HbA1c', alt: ['Glycated Hemoglobin Test', 'Hemoglobin A1c Test', 'Glycosylated Hemoglobin Test', 'Diabetes Control Test'] },
  'Thyroid Profile (T3, T4, TSH)': { abbr: 'T3, T4, TSH', alt: ['Thyroid Function Test (TFT)', 'Thyroid Panel Test', 'Thyroid Hormone Test'] },
  'Lipid Profile': { abbr: 'Lipid Profile', alt: ['Cholesterol Test', 'Lipid Panel Test', 'Lipogram Test', 'Cardiac Risk Panel'] },
  'Vitamin D Total': { abbr: 'Vitamin D', alt: ['25-Hydroxy Vitamin D Test', 'Calcidiol Test', 'Vitamin D Deficiency Test'] },
  'Blood Sugar (Fasting)': { abbr: 'FBS', alt: ['Fasting Blood Glucose Test', 'Fasting Sugar Test', 'Blood Sugar F Test'] },
  'Liver Function Test (LFT)': { abbr: 'LFT', alt: ['Hepatic Function Panel', 'Liver Panel Test', 'Liver Enzyme Test'] },
  'Kidney Function Test (KFT)': { abbr: 'KFT', alt: ['Renal Function Test (RFT)', 'Kidney Panel Test', 'Renal Profile Test'] },
  'Iron Studies': { abbr: 'Iron Studies', alt: ['Iron Profile Test', 'Iron Deficiency Panel', 'Anemia Workup Test'] },
  'Vitamin B12': { abbr: 'Vitamin B12', alt: ['Cobalamin Test', 'B12 Deficiency Test', 'Cyanocobalamin Test'] },
  'TSH': { abbr: 'TSH', alt: ['Thyroid Stimulating Hormone Test', 'TSH 3rd Generation Test', 'Thyrotropin Test'] },
  'Blood Sugar (Postprandial / Post Lunch - 2 HR)': { abbr: 'PPBS / PPPG', alt: ['Postprandial Blood Sugar Test', '2-Hour Post Lunch Glucose Test', 'Blood Sugar PP Test'] },
  'Random Blood Sugar (RBS)': { abbr: 'RBS', alt: ['Random Blood Glucose Test', 'Casual Blood Sugar Test', 'Non-Fasting Glucose Test'] },
  'Total Cholesterol': { abbr: 'TC', alt: ['Cholesterol Total Test', 'Serum Cholesterol Test'] },
  'Serum Electrolytes (Na, K, Cl)': { abbr: 'Na, K, Cl', alt: ['Electrolyte Panel Test', 'Lytes Test', 'Serum Electrolyte Profile'] },
  'Uric Acid': { abbr: 'UA', alt: ['Serum Uric Acid Test', 'Urate Test', 'Gout Test'] },
  'Dengue NS1 Antigen': { abbr: 'Dengue NS1', alt: ['Dengue Early Detection Test', 'NS1 Antigen Test'] },
  'PAP Smear': { abbr: 'PAP Smear', alt: ['Pap Test', 'Cervical Cancer Screening', 'Pap smear Test'] },
  'CA 125': { abbr: 'CA 125', alt: ['Cancer Antigen 125 Test', 'Ovarian Cancer Marker Test'] },
  'PSA (Prostate Specific Antigen)': { abbr: 'PSA', alt: ['Prostate Specific Antigen Test', 'Prostate Cancer Screening Test'] },
  'Prolactin': { abbr: 'PRL', alt: ['Prolactin Hormone Test', 'Lactotropin Test', 'PRL Test'] },
};

const categoryParamMap = {
  'Hematology': ['Hemoglobin (Hb)', 'White Blood Cells (WBC)', 'Red Blood Cells (RBC)', 'Platelet Count', 'Hematocrit (HCT)', 'MCV, MCH, MCHC', 'RDW', 'Neutrophils', 'Lymphocytes', 'Monocytes', 'Eosinophils', 'Basophils'],
  'Diabetes': ['Fasting Blood Glucose', 'Postprandial Glucose', 'HbA1c', 'Insulin Level', 'C-Peptide', 'HOMA-IR Index'],
  'Thyroid': ['TSH', 'Free T3 (FT3)', 'Free T4 (FT4)', 'Total T3', 'Total T4', 'Anti-TPO Antibody', 'Anti-Thyroglobulin Antibody'],
  'Cardiac': ['Total Cholesterol', 'HDL Cholesterol', 'LDL Cholesterol', 'Triglycerides', 'VLDL', 'hs-CRP', 'Lipoprotein (a)', 'Homocysteine'],
  'Vitamins': ['Vitamin D (25-OH)', 'Vitamin B12', 'Vitamin A', 'Vitamin E', 'Folate', 'Vitamin C'],
  'Full Body': ['Hemoglobin', 'WBC', 'RBC', 'Platelets', 'ESR', 'Blood Sugar', 'Serum Creatinine', 'BUN', 'Uric Acid', 'Total Protein', 'Albumin', 'Globulin', 'Bilirubin Total', 'Bilirubin Direct', 'SGOT/AST', 'SGPT/ALT', 'ALP', 'GGT', 'LDH', 'Sodium', 'Potassium', 'Chloride', 'Calcium', 'Phosphorus', 'Iron', 'Ferritin'],
  'Anemia': ['Hemoglobin', 'RBC Indices (MCV, MCH, MCHC)', 'Serum Iron', 'Ferritin', 'TIBC', 'Transferrin Saturation', 'Vitamin B12', 'Folate', 'RDW'],
  'Fever': ['Complete Blood Count', 'Malaria Antigen', 'Dengue NS1', 'Typhoid IgM/IgG', 'CRP', 'Blood Culture', 'Urine Routine'],
  'Cancer': ['Tumor Marker Panel', 'PSA', 'CA 125', 'CEA', 'AFP', 'CA 19-9', 'LDH', 'Beta-hCG'],
  'Hormones': ['FSH', 'LH', 'Prolactin', 'Estradiol', 'Progesterone', 'Testosterone', 'Cortisol', 'DHEAS', 'SHBG', 'AMH'],
  'Allergy': ['Total IgE', 'Specific IgE Panel', 'Eosinophil Count', 'Mast Cell Tryptase'],
  'Arthritis': ['Rheumatoid Factor (RF)', 'Anti-CCP', 'CRP', 'ESR', 'ANA', 'Uric Acid', 'HLA-B27'],
  'Pregnancy': ['Beta-hCG (Total)', 'Beta-hCG (Quantitative)', 'Progesterone', 'Estradiol'],
  'Liver': ['SGOT/AST', 'SGPT/ALT', 'ALP', 'GGT', 'Bilirubin Total', 'Bilirubin Direct', 'Total Protein', 'Albumin', 'Globulin', 'LDH'],
  'STD': ['HIV Antibody', 'HBsAg', 'HCV Antibody', 'VDRL/RPR', 'HSV-1 IgG', 'HSV-2 IgG'],
};

export function makeSlug(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getTestBySlug(slug) {
  return seedTests.find(t => makeSlug(t.name) === slug) || null;
}

export function getTestEducation(test) {
  if (!test) return null;
  const known = altNames[test.name] || { abbr: '', alt: [] };
  const abbr = known.abbr || (test.name.includes('(') ? test.name.match(/\(([^)]+)\)/)?.[1] || '' : '');
  const altList = known.alt.length > 0 ? known.alt : generateAltNames(test);
  const params = categoryParamMap[test.category] || generateParams(test);

  return {
    fullName: test.name.replace(/\([^)]*\)/g, '').trim(),
    abbreviation: abbr,
    alternateNames: altList,
    whatIsThis: `A ${test.name} is a medical laboratory test that ${test.description?.toLowerCase() || `helps evaluate ${test.category.toLowerCase()} health.`}`,
    whyTake: [
      `To screen for ${test.category.toLowerCase()}-related conditions`,
      test.fasting_required ? 'As part of a routine health checkup' : 'To monitor existing health conditions',
      `When recommended by your doctor based on symptoms or risk factors`,
      'For preventive healthcare and early detection',
    ],
    whoShouldTake: [
      `Anyone looking for routine ${test.category.toLowerCase()} screening`,
      `People with family history of ${test.category.toLowerCase()} disorders`,
      `Individuals experiencing symptoms related to ${test.category.toLowerCase()} health`,
      `Those on medication that requires ${test.category.toLowerCase()} monitoring`,
      'As part of annual preventive health checkups',
    ],
    parameters: params,
    preparation: test.preparation_instructions || 'No special preparation required.',
    fastingRequired: test.fasting_required,
    sampleProcess: [
      'A trained phlebotomist visits your home at the scheduled time',
      'A small blood sample is drawn from your arm vein using sterile equipment',
      'The sample is safely transported to our NABL-certified lab',
      'Advanced analyzers process the sample for accurate results',
      'Results are digitally verified before release',
    ],
    reportTime: test.report_time || '24-48 hours',
    reportDelivery: 'Reports are delivered via WhatsApp, Email, and the Jeevan HealthCare mobile app. You can also download PDF reports from your account dashboard.',
    interpretation: [
      'Normal results indicate your parameters are within the healthy reference range',
      'Abnormal results may indicate the need for further evaluation by a doctor',
      'Results should always be interpreted by a qualified healthcare provider',
      'Single abnormal values do not necessarily mean disease — clinical context matters',
      'Your doctor may recommend follow-up tests for confirmation',
    ],
    accuracy: 'All tests are processed at NABL-certified laboratories using automated analyzers with rigorous quality control protocols. Results are reviewed by qualified lab professionals before release.',
    frequency: test.category === 'Full Body' ? 'Annually as part of preventive health checkup, or as recommended by your doctor based on your health status and risk factors.'
      : test.fasting_required ? 'As recommended by your doctor. Typically annually for screening or more frequently for monitoring known conditions.'
      : 'As needed based on symptoms, doctor recommendation, or routine health monitoring. Annual testing is recommended for preventive care.',
    safety: [
      'The test is completely safe with minimal discomfort',
      'Only sterile, single-use equipment is used for blood collection',
      'Our phlebotomists are trained and experienced professionals',
      'Safe for all age groups including elderly and children',
      'No radiation exposure or significant side effects',
    ],
    cost: `\u20B9${test.offerPrice || test.price}`,
    faqs: generateFaqs(test, abbr),
  };
}

function generateAltNames(test) {
  const names = [];
  const base = test.name.replace(/\([^)]*\)/g, '').trim();
  if (test.category) names.push(`${test.category} Evaluation Test`);
  if (test.subcategory) names.push(`${test.subcategory} Screening Test`);
  names.push(`${base} Lab Test`);
  names.push(`Serum ${base} Test`);
  return [...new Set(names)].slice(0, 4);
}

function generateParams(test) {
  const cat = test.category;
  if (cat === 'Vitamins') return ['Vitamin Level Assessment', 'Nutritional Status Marker'];
  if (cat === 'Fever') return ['Infection Markers', 'Complete Blood Count', 'Specific Antigen/Antibody Detection'];
  if (cat === 'Allergy') return ['Total IgE', 'Specific Allergen IgE Panel', 'Eosinophil Count'];
  if (cat === 'Arthritis') return ['Rheumatoid Factor', 'Anti-CCP Antibodies', 'Inflammatory Markers (CRP, ESR)'];
  if (cat === 'Hormones') return ['Specific Hormone Level', 'Endocrine Function Assessment'];
  if (cat === 'Cancer') return ['Tumor Marker Level', 'Cancer Antigen Detection'];
  return [`${cat} Parameters`, 'Related Health Markers'];
}

function generateFaqs(test, abbr) {
  const n = test.name;
  const a = abbr || n;
  return [
    { q: `What is ${n}?`, a: `${n} is a diagnostic test that ${test.description?.toLowerCase() || `helps evaluate ${test.category?.toLowerCase() || 'health'} status.`} It measures key health markers to provide insights into your body's functioning.` },
    { q: `Why is ${n} done?`, a: `This test is done to screen for, diagnose, or monitor ${test.category?.toLowerCase() || 'health'} conditions. It helps doctors make informed decisions about your treatment and preventive care.` },
    { q: `Who should take ${n}?`, a: `Anyone with symptoms related to ${test.category?.toLowerCase() || 'health'} issues, those with family history, or anyone wanting a routine health assessment. Your doctor may also recommend this test based on your health profile.` },
    { q: `Do I need fasting before ${n}?`, a: test.fasting_required ? `Yes, fasting is recommended. ${test.preparation_instructions || 'Fasting for 8-10 hours is required. Water is allowed.'}` : `No, fasting is not required for this test. ${test.preparation_instructions || 'You can take the test at any time of day.'}` },
    { q: `How is ${n} performed?`, a: 'A blood sample is collected by a trained phlebotomist from a vein in your arm. The process takes about 5 minutes and is performed at your home for your convenience.' },
    { q: `Is ${n} safe?`, a: 'Yes, this test is completely safe. Only sterile, single-use equipment is used, and our phlebotomists follow strict hygiene protocols.' },
    { q: `How long does it take to get ${a} results?`, a: `Reports are typically delivered within ${test.report_time || '24-48 hours'} via WhatsApp, Email, and our mobile app. Some tests may take longer depending on complexity.` },
    { q: `What is the price of ${n}?`, a: `The ${n} costs \u20B9${test.offerPrice || test.price}. Home sample collection is free, and there are no hidden charges.` },
    { q: `Can ${n} be done at home?`, a: 'Yes, home sample collection is completely free. A trained phlebotomist will visit your home at your preferred time slot.' },
    { q: `How often should I take ${n}?`, a: test.category === 'Full Body' ? 'Annually as part of your preventive health checkup, or as recommended by your doctor.' : 'As recommended by your healthcare provider based on your age, risk factors, and health status.' },
    { q: `What do ${a} results mean?`, a: 'Normal results indicate your parameters are within healthy range. Abnormal results may require follow-up with a doctor for proper interpretation and action plan.' },
    { q: `Is ${a} covered by health insurance?`, a: 'Many health insurance plans cover diagnostic tests. Please check with your insurance provider for coverage details and any applicable co-pay or deductible.' },
  ];
}
