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

const testDurationMap = {
  'Hematology': '5-10 minutes',
  'Diabetes': '5 minutes',
  'Thyroid': '5-10 minutes',
  'Cardiac': '5-10 minutes',
  'Full Body': '10-15 minutes',
  'Fever': '5-10 minutes',
  'Pregnancy': '5 minutes',
  'Cancer': '5-10 minutes',
};

export function makeSlug(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getTestBySlug(slug) {
  return seedTests.find(t => makeSlug(t.name) === slug) || null;
}

function getDuration(test) {
  return testDurationMap[test.category] || '5-10 minutes';
}

function getWhatIsThis(test) {
  const n = test.name;
  const a = test.name.includes('(') ? test.name.match(/\(([^)]+)\)/)?.[1] || '' : '';
  const cat = test.category?.toLowerCase() || 'diagnostic';
  return {
    purpose: `${n} is a ${test.description?.toLowerCase() || `${cat} test that helps evaluate your health status.`}`,
    whyDone: [
      `To screen for potential ${cat} conditions before symptoms appear`,
      `To help diagnose existing symptoms related to ${cat} health`,
      `To monitor the effectiveness of ongoing treatment`,
      `As part of routine preventive health checkups`,
    ],
    whatItMeasures: `This test ${test.description?.toLowerCase() || `analyzes key markers related to ${cat} function in your body.`}`,
    conditionsDetected: [
      `${cat === 'hematology' ? 'Anemia, infections, clotting disorders' : cat === 'diabetes' ? 'Diabetes, prediabetes, insulin resistance' : cat === 'thyroid' ? 'Hypothyroidism, hyperthyroidism, thyroiditis' : cat === 'cardiac' ? 'Heart disease risk, high cholesterol, inflammation' : cat === 'full body' ? 'Liver, kidney, thyroid, diabetes, anemia, and more' : `${test.category} disorders and abnormalities`}`,
      `Early stage changes before symptoms become noticeable`,
      `${test.fasting_required ? 'Metabolic and functional changes' : 'Abnormal cellular or molecular activity'}`,
    ],
    screeningOrDiagnostic: test.category === 'Full Body' || test.category === 'Cancer' ? 'Primarily a screening test — used to detect potential issues before symptoms appear.' : 'Can be used both for screening (routine checkup) and diagnosis (when symptoms are present).',
  };
}

function getCostAndBooking(test, abbr) {
  return {
    price: `\u20B9${test.offerPrice || test.price}`,
    homeCollection: 'Yes, home sample collection is completely free. No additional charges for collection.',
    whyAffordable: 'Jeevan HealthCare partners directly with NABL-certified labs to offer competitive pricing. No middlemen ensure affordable rates.',
    howToBook: 'You can book this test online by adding it to your cart and completing the booking form. Select your preferred date, time, and address for home collection.',
    paymentMethods: ['Pay at Collection (Cash / Card)', 'Online Payment (UPI / Net Banking / Card)'],
  };
}

function getPostTestGuidance(test, abbr) {
  return [
    'Review your report carefully once received. Compare values with the reference ranges provided.',
    'Share your report with your doctor for professional interpretation and personalized advice.',
    'If values are abnormal, your doctor may recommend follow-up tests or lifestyle modifications.',
    'For chronic conditions, regular monitoring as advised by your healthcare provider is important.',
    'Maintain a healthy lifestyle — balanced diet, regular exercise, and adequate sleep can improve your results over time.',
    'Jeevan HealthCare offers free doctor consultation with every test to help you understand your results.',
  ];
}

function getCustomization(test) {
  return {
    canCombine: `Yes, ${test.name} can be combined with other related tests for a comprehensive health assessment. You can add multiple tests to your cart before booking.`,
    advancedVersions: test.category === 'Full Body' ? 'Advanced packages with additional parameters like vitamin profiles, tumor markers, and hormone panels are available under Health Packages.' : 'Advanced panels with additional parameters are available. Check our Health Packages section for comprehensive options.',
    doctorRecommendation: 'Doctors commonly recommend this test based on symptoms, risk factors, family history, and routine health screening protocols.',
    addMoreParameters: test.category === 'Full Body' || test.category === 'Cardiac' || test.category === 'Thyroid' ? 'Yes, additional parameters can be added. Consult with our team or your doctor for the most appropriate combination.' : 'This test focuses on specific markers. For a broader assessment, consider adding related tests to your cart.',
  };
}

export function getTestEducation(test) {
  if (!test) return null;
  const known = altNames[test.name] || { abbr: '', alt: [] };
  const abbr = known.abbr || (test.name.includes('(') ? test.name.match(/\(([^)]+)\)/)?.[1] || '' : '');
  const altList = known.alt.length > 0 ? known.alt : generateAltNames(test);
  const params = categoryParamMap[test.category] || generateParams(test);
  const whatIs = getWhatIsThis(test);
  const cost = getCostAndBooking(test, abbr);
  const guidance = getPostTestGuidance(test, abbr);
  const customization = getCustomization(test);

  return {
    fullName: test.name.replace(/\([^)]*\)/g, '').trim(),
    abbreviation: abbr,
    alternateNames: altList,
    whatIsThis: whatIs,
    whoShouldTake: generateWhoShouldTake(test),
    parameters: params,
    preparation: test.preparation_instructions || 'No special preparation required.',
    fastingRequired: test.fasting_required,
    duration: getDuration(test),
    sampleProcess: [
      'A trained phlebotomist visits your home at your preferred time slot',
      'A small blood sample is drawn from your arm vein using sterile, single-use equipment',
      'The collection process takes just 5-10 minutes',
      'The sample is safely transported to our NABL-certified lab in temperature-controlled conditions',
      'Advanced automated analyzers process the sample with rigorous quality control',
      'Results are reviewed by qualified lab professionals before digital release',
    ],
    reportTime: test.report_time || '24-48 hours',
    reportDelivery: 'Reports are delivered via WhatsApp, Email, and the Jeevan HealthCare mobile app. You can also download PDF reports from your account dashboard.',
    interpretation: [
      'Normal results indicate your parameters are within the healthy reference range',
      'Abnormal results may indicate the need for further evaluation by a doctor',
      'Results should always be interpreted by a qualified healthcare provider',
      'Single abnormal values do not necessarily mean disease — clinical context matters',
      'Your doctor may recommend follow-up tests for confirmation',
      'Results can change over time based on lifestyle, medication, and health status',
    ],
    accuracy: 'All tests are processed at NABL-certified laboratories using automated analyzers with rigorous quality control protocols. Results are reviewed by qualified lab professionals before release.',
    frequency: generateFrequency(test),
    safety: generateSafety(test),
    cost: cost,
    customization: customization,
    postTestGuidance: guidance,
    faqs: generateFaqsFull(test, abbr, whatIs, cost, customization),
  };
}

function generateAltNames(test) {
  const names = [];
  const base = test.name.replace(/\([^)]*\)/g, '').trim();
  if (test.category) names.push(`${test.category} Evaluation Test`);
  if (test.subcategory) names.push(`${test.subcategory} Screening Test`);
  names.push(`${base} Lab Test`);
  if (!base.toLowerCase().includes('serum')) names.push(`Serum ${base} Test`);
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

function generateWhoShouldTake(test) {
  const cat = test.category?.toLowerCase() || 'health';
  return [
    `Anyone looking for routine ${cat} screening as part of preventive healthcare`,
    `People with family history of ${cat} disorders`,
    `Individuals experiencing symptoms like fatigue, weakness, or discomfort related to ${cat}`,
    `Those on medication that requires ${cat} function monitoring`,
    `Adults and seniors as part of annual health checkups (suitable for children when recommended by a doctor)`,
    `Doctors commonly recommend this test for regular health assessment`,
  ];
}

function generateFrequency(test) {
  if (test.category === 'Full Body') return 'Annually as part of your preventive health checkup. Your doctor may recommend more frequent testing based on your health status and risk factors.';
  if (test.category === 'Diabetes') return 'Every 3-6 months for diabetic patients to monitor blood sugar control. Annually for screening if you have risk factors like obesity or family history.';
  if (test.category === 'Cardiac') return 'Annually for adults over 30, or more frequently if you have heart disease risk factors like high BP, diabetes, or smoking.';
  if (test.category === 'Thyroid') return 'Annually for routine screening. Every 6-12 months if you are on thyroid medication to monitor dosage effectiveness.';
  if (test.fasting_required) return 'As recommended by your doctor. Typically annually for screening or more frequently for monitoring known conditions.';
  return 'As needed based on symptoms, doctor recommendation, or routine health monitoring. Annual testing is recommended for preventive care.';
}

function generateSafety(test) {
  return [
    'The test is completely safe with minimal discomfort — just a quick prick sensation',
    'Only sterile, single-use equipment is used for blood collection, eliminating infection risk',
    'Our phlebotomists are trained, experienced professionals following strict hygiene protocols',
    'Safe for all age groups including elderly, children, and pregnant women',
    'No radiation exposure, no significant side effects, and no recovery time needed',
    'You can resume normal activities immediately after sample collection',
  ];
}

function generateFaqsFull(test, abbr, whatIs, cost, customization) {
  const n = test.name;
  const a = abbr || n;
  const cat = test.category?.toLowerCase() || 'health';
  return [
    { q: `What is ${n}?`, a: `${n} is a diagnostic test that ${test.description?.toLowerCase() || `helps evaluate ${cat} health.`} It measures key health markers to provide insights into your body's functioning.` },
    { q: `Why is ${n} done?`, a: whatIs.whyDone.join(' It is also done ') + '.' },
    { q: `Who should take ${n}?`, a: `Anyone with ${cat} health concerns, those with family history of ${cat} disorders, individuals experiencing related symptoms, or anyone wanting a routine health assessment. Doctors often recommend this test as part of regular checkups.` },
    { q: `What does ${n} check?`, a: `This test measures ${cat === 'hematology' ? 'hemoglobin, WBC, RBC, platelets, and other blood cell parameters' : cat === 'diabetes' ? 'blood glucose levels and glycated hemoglobin (HbA1c)' : cat === 'thyroid' ? 'TSH, T3, and T4 hormone levels' : cat === 'cardiac' ? 'cholesterol, triglycerides, and cardiac risk markers' : cat === 'full body' ? 'multiple organ function markers including liver, kidney, blood, and metabolic parameters' : 'key markers related to ' + cat + ' health'} to give a comprehensive picture of your health.` },
    { q: `Do I need fasting before ${n}?`, a: test.fasting_required ? `Yes, fasting is required. ${test.preparation_instructions || 'Fasting for 8-10 hours is recommended. Water is allowed during fasting.'} Please avoid food, tea, coffee, and smoking during the fasting period.` : `No, fasting is not required for this test. ${test.preparation_instructions || 'You can take the test at any time of day. However, follow any specific instructions provided by your doctor.'}` },
    { q: `Can I drink water before ${n}?`, a: test.fasting_required ? 'Yes, plain drinking water is allowed and encouraged during fasting. Avoid sweetened drinks, tea, coffee, and milk.' : 'Yes, you can drink water normally before this test.' },
    { q: `Can I take medicines before ${n}?`, a: 'Continue your regular medications unless your doctor specifically advises otherwise. Inform the lab about any medications you are taking as some may affect test results.' },
    { q: `How is ${n} performed?`, a: 'A blood sample is collected by a trained phlebotomist from a vein in your arm using a sterile needle. The process takes about 5 minutes and is performed at your home for your convenience and comfort.' },
    { q: `Is ${n} painful?`, a: 'You may feel a mild pinch or prick when the needle is inserted, but the discomfort is minimal and lasts only a few seconds. Most patients find it very tolerable.' },
    { q: `How long does the ${a} test take?`, a: `The blood collection process takes about ${getDuration(test)}. The entire home visit is typically completed within 15-20 minutes from arrival to departure.` },
    { q: `Can ${n} be done at home?`, a: 'Yes, absolutely. Home sample collection is completely free. A trained phlebotomist will visit your home at your preferred time slot. You can choose morning, afternoon, or evening collection.' },
    { q: `How long for ${a} results?`, a: `Reports are typically delivered within ${test.report_time || '24-48 hours'} via WhatsApp, Email, and our mobile app. Some specialized tests may take longer depending on complexity.` },
    { q: `How will I receive ${a} reports?`, a: 'Reports are delivered through multiple channels — WhatsApp message, Email, and the Jeevan HealthCare mobile app. You can also download PDF copies from your account dashboard anytime.' },
    { q: `What do ${a} results mean?`, a: 'Normal results indicate your parameters are within the healthy reference range. Abnormal results may indicate the need for further evaluation by a doctor. Always consult a healthcare provider for proper interpretation.' },
    { q: `What if ${a} values are high or low?`, a: 'Abnormal values do not always mean disease. Results can be affected by diet, medications, stress, and other factors. Your doctor will consider your clinical history along with lab results for an accurate assessment.' },
    { q: `Should I consult a doctor after ${a} results?`, a: 'Yes, it is recommended to share your report with a doctor for professional interpretation. Jeevan HealthCare offers free doctor consultation with every test to help you understand your results.' },
    { q: `How accurate is ${n}?`, a: 'All tests are processed at NABL-certified laboratories using automated analyzers with strict quality control. Results are reviewed by qualified lab professionals, ensuring high accuracy and reliability.' },
    { q: `Is ${n} safe for elderly or pregnant women?`, a: 'Yes, this test is safe for all age groups including elderly, pregnant women, and children. Our phlebotomists are trained to handle all patient types with care and sensitivity.' },
    { q: `How often should I take ${n}?`, a: generateFrequency(test) },
    { q: `Can ${n} be combined with other tests?`, a: customization.canCombine },
    { q: `What is the price of ${n}?`, a: `The ${n} costs ${cost.price}. Home sample collection is free with no hidden charges. We offer competitive pricing by partnering directly with NABL-certified labs.` },
    { q: `Is home collection free for ${n}?`, a: 'Yes, home sample collection is completely free across Hyderabad and surrounding areas. A trained phlebotomist will visit your home at your scheduled time.' },
    { q: `What payment methods are available?`, a: 'You can pay at collection (cash or card) at the time of sample collection, or pay online via UPI, Net Banking, or Credit/Debit Card during booking.' },
    { q: `What should I do after receiving ${a} report?`, a: 'Review your report, share it with your doctor for interpretation, and follow their recommendations. Maintain a healthy lifestyle. If values are abnormal, schedule a follow-up as advised.' },
    { q: `Will I get doctor consultation after ${n}?`, a: 'Yes, Jeevan HealthCare provides free doctor consultation with every test to help you understand your results and guide you on next steps.' },
    { q: `Can lifestyle changes improve ${a} results?`, a: 'Yes, many health parameters can be improved through balanced diet, regular exercise, adequate sleep, stress management, and medication adherence as prescribed by your doctor.' },
  ];
}
