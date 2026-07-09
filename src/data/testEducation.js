import { seedTests } from './seedData';

const testSpecs = {
  'Complete Blood Count (CBC)': {
    fullName: 'Complete Blood Count (CBC) Test', scientificName: 'Hemogram Test', abbr: 'CBC',
    alt: ['Hemogram Test', 'Blood Profile Test', 'Full Blood Count Test (FBC)', 'Routine Blood Test', 'CBC with ESR'],
    synonyms: ['Complete Hemogram', 'Blood Cell Count', 'Full Blood Examination'],
    biomarker: { name: 'Complete Blood Count', what: 'A panel of blood cell parameters including RBC, WBC, hemoglobin, hematocrit, and platelet indices.', why: 'Provides a comprehensive overview of your blood health — detects anemia, infection, inflammation, and clotting disorders.' },
    symptoms: ['Unexplained fatigue or weakness', 'Frequent infections or slow healing', 'Easy bruising or bleeding', 'Pale skin or shortness of breath', 'Prolonged fever or recurrent illness', 'Dizziness or lightheadedness'],
    diseases: ['Anemia', 'Thalassemia', 'Infection (Bacterial/Viral)', 'Leukemia & Lymphoma', 'Bone Marrow Disorders', 'Bleeding Disorders'],
    normalRange: { label: 'Hemoglobin', adultMale: '13.5-17.5 g/dL', adultFemale: '12.0-15.5 g/dL', child: '11.0-16.0 g/dL' },
    riskLevels: [
      { level: 'Normal', color: 'green', desc: 'All parameters within reference range' },
      { level: 'Borderline', color: 'orange', desc: 'One or more values slightly outside range' },
      { level: 'High Risk', color: 'red', desc: 'Significant abnormalities requiring medical attention' },
    ],
    abnormalMeaning: 'Abnormal CBC values may indicate anemia, infection, inflammation, bone marrow problems, or blood disorders. Further testing is needed for confirmation.',
    consultDoctor: ['If any value is significantly outside normal range', 'If you have persistent symptoms like fatigue or fever', 'If CBC shows progressive changes over time', 'Before starting or changing treatment based on results'],
    limitations: ['CBC is a screening test and cannot diagnose specific diseases alone', 'Results can be affected by recent illness, medications, and hydration status', 'Some conditions require specialized tests for confirmation', 'Reference ranges may vary slightly between laboratories'],
    medications: ['Chemotherapy drugs can lower blood cell counts', 'Blood thinners may affect platelet function', 'Corticosteroids can elevate WBC count', 'Iron supplements can affect RBC parameters', 'Antibiotics may affect WBC counts'],
    lifestyle: ['Diet — iron, B12, and folate deficiency can cause anemia', 'Exercise — intense physical activity can temporarily affect counts', 'Sleep — chronic sleep deprivation may affect immune markers', 'Stress — can elevate WBC count temporarily', 'Hydration — dehydration can falsely elevate values'],
    sampleQuality: ['Insufficient sample volume may require redraw', 'Clotted sample can produce inaccurate results', 'Hemolysis (broken RBCs) affects many parameters', 'Delayed processing beyond 4 hours affects cell counts', 'Improper mixing with anticoagulant causes clots'],
    comparableTests: [{ name: 'CBC with ESR', diff: 'Adds inflammation marker' }, { name: 'Peripheral Smear', diff: 'Microscopic examination of blood cells' }, { name: 'Bone Marrow Biopsy', diff: 'Advanced test for marrow disorders' }],
  },
  'HbA1c': {
    fullName: 'Hemoglobin A1c (HbA1c) Test', scientificName: 'Glycated Hemoglobin Test', abbr: 'HbA1c',
    alt: ['A1C Test', 'Glycated Hemoglobin Test', 'Glycosylated Hemoglobin Test', 'Diabetes Control Test', '3 Month Sugar Test', 'Average Blood Sugar Test'],
    synonyms: ['Hemoglobin A1c', 'HbA1c', 'A1C', 'Diabetes Monitoring Blood Test'],
    biomarker: { name: 'Glycated Hemoglobin (HbA1c)', what: 'Percentage of hemoglobin molecules that have glucose attached to them, reflecting average blood sugar over 2-3 months.', why: 'Indicates long-term glucose control — the gold standard for diabetes monitoring and diagnosis.' },
    symptoms: ['Frequent urination (polyuria)', 'Excessive thirst (polydipsia)', 'Unexplained weight loss', 'Persistent fatigue', 'Blurred vision', 'Slow-healing wounds', 'Recurrent infections', 'Numbness or tingling in hands/feet'],
    diseases: ['Diabetes Mellitus Type 1', 'Diabetes Mellitus Type 2', 'Prediabetes', 'Gestational Diabetes', 'Metabolic Syndrome', 'Insulin Resistance'],
    normalRange: { label: 'HbA1c', adultMale: '4.0-5.6%', adultFemale: '4.0-5.6%', child: '4.0-5.6%', prediabetes: '5.7-6.4%', diabetes: '≥6.5%' },
    riskLevels: [
      { level: 'Normal', color: 'green', desc: 'Below 5.7% — Normal glucose control' },
      { level: 'Borderline', color: 'orange', desc: '5.7-6.4% — Prediabetes, increased risk' },
      { level: 'High Risk', color: 'red', desc: '6.5% or above — Diabetes range' },
    ],
    abnormalMeaning: 'High HbA1c indicates poor blood sugar control over the past 3 months. It may mean your diabetes management plan needs adjustment, or you may have undiagnosed diabetes.',
    consultDoctor: ['If HbA1c is 6.5% or higher (diabetes range)', 'If HbA1c shows increasing trend over time', 'If you have symptoms of high blood sugar', 'If current diabetes medication is not controlling levels', 'Before making any changes to diabetes treatment'],
    limitations: ['May be falsely low in anemia, blood loss, or hemolysis', 'May be falsely high in iron deficiency anemia', 'Not accurate in pregnancy — fructosamine is preferred', 'Affected by hemoglobin variants (sickle cell, thalassemia)', 'Does not reflect daily glucose fluctuations'],
    medications: ['Insulin therapy lowers HbA1c', 'Oral diabetes medications (metformin, sulfonylureas) lower HbA1c', 'Steroids can elevate blood sugar and HbA1c', 'Certain HIV medications may affect HbA1c', 'High-dose aspirin can falsely lower results', 'Vitamin C and E supplements may interfere'],
    lifestyle: ['Diet — high sugar/carb diet raises HbA1c', 'Exercise — regular activity improves glucose control', 'Weight management — obesity increases insulin resistance', 'Sleep — poor sleep affects glucose metabolism', 'Stress — chronic stress elevates cortisol and blood sugar'],
    sampleQuality: ['Sample must be collected in EDTA tube', 'Hemolyzed samples produce inaccurate results', 'Stable for up to 7 days at 2-8°C', 'Insufficient volume may require redraw', 'Proper mixing with anticoagulant essential'],
    comparableTests: [
      { name: 'Fasting Blood Sugar', diff: 'Current glucose level, requires fasting' },
      { name: 'Fructosamine', diff: '2-3 week average, useful when HbA1c unreliable' },
      { name: 'OGTT', diff: 'Glucose tolerance test for diabetes diagnosis' },
    ],
  },
  'Thyroid Profile (T3, T4, TSH)': {
    fullName: 'Thyroid Profile (T3, T4, TSH) Test', scientificName: 'Thyroid Function Panel', abbr: 'TFT',
    alt: ['Thyroid Function Test (TFT)', 'Thyroid Panel Test', 'Thyroid Hormone Test', 'T3-T4-TSH Panel', 'Thyroid Screening Test'],
    synonyms: ['Thyroid Profile', 'Complete Thyroid Test', 'Thyroid Function Panel', 'Thyroid Health Check'],
    biomarker: { name: 'Thyroid Hormones (TSH, T3, T4)', what: 'TSH controls thyroid gland; T3 (triiodothyronine) and T4 (thyroxine) are the thyroid hormones that regulate metabolism.', why: 'Evaluates thyroid gland function — detects hypothyroidism, hyperthyroidism, and helps monitor thyroid treatment.' },
    symptoms: ['Unexplained weight gain or loss', 'Fatigue and low energy', 'Hair thinning or hair loss', 'Feeling too cold or too hot', 'Mood swings, anxiety, or depression', 'Irregular menstrual cycles', 'Dry skin and brittle nails', 'Difficulty concentrating (brain fog)', 'Swelling in neck (goiter)', 'Muscle weakness or joint pain'],
    diseases: ['Hypothyroidism (Underactive Thyroid)', 'Hyperthyroidism (Overactive Thyroid)', 'Hashimoto\'s Thyroiditis (Autoimmune)', 'Graves\' Disease', 'Thyroid Nodules', 'Goiter', 'Thyroid Cancer', 'Postpartum Thyroiditis'],
    normalRange: { label: 'TSH', adultMale: '0.4-4.0 mIU/L', adultFemale: '0.4-4.0 mIU/L', T3: '80-200 ng/dL', T4: '5-12 µg/dL' },
    riskLevels: [
      { level: 'Normal', color: 'green', desc: 'TSH, T3, T4 within reference range' },
      { level: 'Borderline', color: 'orange', desc: 'Subclinical thyroid dysfunction' },
      { level: 'High Risk', color: 'red', desc: 'Overt thyroid disease requiring treatment' },
    ],
    abnormalMeaning: 'Abnormal thyroid levels indicate your thyroid gland is not functioning properly. High TSH with low T4 suggests hypothyroidism. Low TSH with high T3/T4 suggests hyperthyroidism.',
    consultDoctor: ['If TSH is outside normal range', 'If T3 or T4 levels are abnormal', 'If you have persistent thyroid symptoms', 'If you are pregnant or planning pregnancy', 'For medication adjustment in known thyroid disease'],
    limitations: ['TSH alone may miss central hypothyroidism', 'Results affected by non-thyroidal illness (sick euthyroid)', 'Certain medications interfere with thyroid tests', 'Pregnancy alters normal thyroid reference ranges', 'Circadian variation — TSH peaks in early morning'],
    medications: ['Levothyroxine (thyroid hormone replacement)', 'Anti-thyroid drugs (methimazole, PTU)', 'Amiodarone affects thyroid function', 'Lithium can cause hypothyroidism', 'Birth control pills affect TBG and total T4', 'Corticosteroids suppress TSH', 'Biomedical supplements (biotin) interfere'],
    lifestyle: ['Diet — iodine intake affects thyroid function', 'Exercise — regular activity supports metabolism', 'Stress — chronic stress impacts thyroid axis', 'Sleep — poor sleep affects hormone regulation', 'Smoking — worsens hyperthyroidism symptoms'],
    sampleQuality: ['Sample should be collected in morning', 'Fasting not required but recommended for consistency', 'Avoid biotin supplements for 48 hours before test', 'Separate serum within 2 hours of collection', 'Avoid hemolysis for accurate results'],
    comparableTests: [
      { name: 'Free T3', diff: 'Measures active unbound T3 only' },
      { name: 'Free T4', diff: 'Measures active unbound T4 only' },
      { name: 'Anti-TPO Antibodies', diff: 'Detects autoimmune thyroid disease' },
    ],
  },
  'Lipid Profile': {
    fullName: 'Lipid Profile Test', scientificName: 'Lipoprotein Panel', abbr: 'Lipid Profile',
    alt: ['Cholesterol Test', 'Lipid Panel Test', 'Lipogram Test', 'Cardiac Risk Panel', 'Cholesterol Profile', 'Fasting Lipid Profile'],
    synonyms: ['Complete Lipid Profile', 'Lipid Panel', 'Cardiac Risk Profile', 'Cholesterol Screening Test'],
    biomarker: { name: 'Lipid Panel (Total Cholesterol, HDL, LDL, Triglycerides)', what: 'Measures different types of fats (lipids) in your blood including total cholesterol, HDL (good), LDL (bad), and triglycerides.', why: 'Assesses cardiovascular health and risk of heart disease, stroke, and atherosclerosis.' },
    symptoms: ['Usually no symptoms — silent condition', 'Chest pain or discomfort (angina)', 'Shortness of breath', 'Heart palpitations', 'Fatigue with exertion', 'Numbness or coldness in extremities', 'High blood pressure', 'Obesity or overweight', 'Family history of heart disease'],
    diseases: ['Hypercholesterolemia (High Cholesterol)', 'Atherosclerosis (Artery Blockage)', 'Coronary Artery Disease', 'Heart Attack Risk', 'Stroke Risk', 'Peripheral Artery Disease', 'Metabolic Syndrome', 'Pancreatitis (from high triglycerides)'],
    normalRange: { label: 'Cholesterol', adultMale: 'Desirable: <200 mg/dL', adultFemale: 'Desirable: <200 mg/dL', LDL: 'Optimal: <100 mg/dL', HDL: '≥40 mg/dL (M), ≥50 mg/dL (F)', triglycerides: 'Normal: <150 mg/dL' },
    riskLevels: [
      { level: 'Desirable', color: 'green', desc: 'Total cholesterol below 200 mg/dL' },
      { level: 'Borderline High', color: 'orange', desc: 'Total cholesterol 200-239 mg/dL' },
      { level: 'High Risk', color: 'red', desc: 'Total cholesterol 240 mg/dL or above' },
    ],
    abnormalMeaning: 'High cholesterol, LDL, or triglycerides increases your risk of heart disease and stroke. Low HDL reduces protective benefits. Lifestyle changes and medication may be needed.',
    consultDoctor: ['If total cholesterol is 240 mg/dL or higher', 'If LDL is 160 mg/dL or higher', 'If triglycerides are 500 mg/dL or higher', 'If HDL is below 40 mg/dL', 'If you have diabetes or heart disease risk factors', 'For personalized treatment targets based on risk profile'],
    limitations: ['Non-fasting samples may show elevated triglycerides', 'LDL calculated by Friedewald formula inaccurate if triglycerides >400', 'Does not measure all atherogenic particles (ApoB, Lp(a))', 'Single measurement may not reflect overall risk', 'Inflammation can transiently alter lipid levels'],
    medications: ['Statins lower LDL and total cholesterol', 'Fibrates lower triglycerides', 'Ezetimibe blocks cholesterol absorption', 'PCSK9 inhibitors dramatically lower LDL', 'Niacin raises HDL (less commonly used)', 'Beta-blockers may raise triglycerides'],
    lifestyle: ['Diet — saturated/trans fats raise cholesterol', 'Exercise — regular activity raises HDL', 'Weight loss improves all lipid parameters', 'Smoking cessation raises HDL', 'Alcohol — moderate intake may raise HDL', 'Stress management reduces cortisol effects'],
    sampleQuality: ['Fasting 9-12 hours recommended for accurate triglycerides', 'Sample can be stored at 2-8°C for 72 hours', 'Hemolysis affects some lipid measurements', 'Centrifuge within 2 hours of collection', 'Proper venipuncture technique to avoid stasis'],
    comparableTests: [
      { name: 'Apolipoprotein B (ApoB)', diff: 'Better marker of cardiovascular risk than LDL' },
      { name: 'Lipoprotein (a)', diff: 'Genetic risk marker for heart disease' },
      { name: 'hs-CRP', diff: 'Measures inflammation — heart disease risk' },
    ],
  },
};

function getSpec(test) {
  return testSpecs[test.name] || testSpecs[test.category] || {};
}

function makeSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function generateAltNames(test, spec) {
  if (spec.alt && spec.alt.length > 0) return spec.alt;
  const names = [];
  const base = test.name.replace(/\([^)]*\)/g, '').trim();
  if (test.category) names.push(`${test.category} Evaluation Test`);
  if (test.subcategory) names.push(`${test.subcategory} Screening Test`);
  names.push(`${base} Lab Test`);
  if (!base.toLowerCase().includes('serum')) names.push(`Serum ${base} Test`);
  return [...new Set(names)].slice(0, 4);
}

function generateParams(test) {
  const spec = getSpec(test);
  if (spec.biomarker) return [spec.biomarker.name, ...(spec.biomarker.what ? [spec.biomarker.why] : [])];
  const cat = test.category;
  if (cat === 'Hematology') return ['Hemoglobin (Hb)', 'White Blood Cells (WBC)', 'Red Blood Cells (RBC)', 'Platelet Count', 'Hematocrit (HCT)', 'MCV, MCH, MCHC', 'RDW', 'Neutrophils', 'Lymphocytes', 'Monocytes', 'Eosinophils', 'Basophils'];
  if (cat === 'Diabetes') return ['Fasting Blood Glucose', 'Postprandial Glucose', 'HbA1c', 'Insulin Level', 'C-Peptide'];
  if (cat === 'Thyroid') return ['TSH', 'Free T3 (FT3)', 'Free T4 (FT4)', 'Total T3', 'Total T4'];
  if (cat === 'Cardiac') return ['Total Cholesterol', 'HDL Cholesterol', 'LDL Cholesterol', 'Triglycerides', 'VLDL', 'hs-CRP'];
  if (cat === 'Vitamins') return ['Vitamin Level Assessment', 'Nutritional Status Marker'];
  if (cat === 'Full Body') return ['Hemoglobin', 'WBC', 'RBC', 'Platelets', 'ESR', 'Blood Sugar', 'Serum Creatinine', 'BUN', 'Uric Acid', 'Total Protein', 'Albumin', 'Globulin', 'Bilirubin', 'SGOT/AST', 'SGPT/ALT', 'ALP', 'GGT', 'Sodium', 'Potassium', 'Chloride'];
  if (cat === 'Fever') return ['Complete Blood Count', 'Specific Antigen/Antibody Detection', 'CRP', 'Infection Markers'];
  if (cat === 'Allergy') return ['Total IgE', 'Specific Allergen IgE Panel', 'Eosinophil Count'];
  if (cat === 'Arthritis') return ['Rheumatoid Factor', 'Anti-CCP Antibodies', 'CRP', 'ESR', 'Uric Acid'];
  if (cat === 'Hormones') return ['Specific Hormone Level', 'Endocrine Function Assessment'];
  if (cat === 'Cancer') return ['Tumor Marker Level', 'Cancer Antigen Detection'];
  if (cat === 'Pregnancy') return ['Beta-hCG (Total)', 'Progesterone', 'Estradiol'];
  if (cat === 'Liver') return ['SGOT/AST', 'SGPT/ALT', 'ALP', 'GGT', 'Bilirubin Total', 'Bilirubin Direct', 'Total Protein', 'Albumin'];
  return [`${cat} Parameters`, 'Related Health Markers'];
}

function generateWhoShouldTake(test) {
  const spec = getSpec(test);
  if (spec.symptoms) {
    return [
      ...spec.symptoms.slice(0, 3).map(s => `People experiencing: ${s.toLowerCase()}`),
      `Individuals with family history of ${test.category?.toLowerCase() || 'health'} disorders`,
      `Those on medication requiring ${test.category?.toLowerCase() || 'health'} monitoring`,
      'As part of routine annual preventive health checkup',
      'Adults and seniors — suitable for all age groups when recommended by a doctor',
    ];
  }
  const cat = test.category?.toLowerCase() || 'health';
  return [
    `Anyone looking for routine ${cat} screening as part of preventive healthcare`,
    `People with family history of ${cat} disorders`,
    `Individuals experiencing symptoms related to ${cat}`,
    `Those on medication that requires ${cat} function monitoring`,
    'Adults and seniors as part of annual health checkups',
  ];
}

function generateWhoShouldTakeDetailed(test) {
  const cat = test.category?.toLowerCase() || 'health';
  return {
    patientGroups: [
      { group: 'Diabetic Patients', reason: 'Regular monitoring of blood sugar control' },
      { group: 'Prediabetes', reason: 'Early detection and prevention of diabetes' },
      { group: 'Family History', reason: 'Genetic predisposition to diabetes' },
      { group: 'Overweight/Obese', reason: 'Higher risk of insulin resistance' },
      { group: 'Annual Checkup', reason: 'Routine preventive health screening' },
      { group: 'On Medication', reason: 'Monitoring treatment effectiveness' },
    ],
    desc: `This test is recommended for individuals with ${cat} concerns, family history, symptoms, or as part of routine health screening.`,
  };
}

const categoryDurationMap = {
  'Hematology': '5-10 minutes', 'Diabetes': '5 minutes', 'Thyroid': '5-10 minutes',
  'Cardiac': '5-10 minutes', 'Full Body': '10-15 minutes', 'Fever': '5-10 minutes',
  'Pregnancy': '5 minutes', 'Cancer': '5-10 minutes',
};

function getDuration(test) {
  return categoryDurationMap[test.category] || '5-10 minutes';
}

function getWhatIsThis(test) {
  const n = test.name;
  const cat = test.category?.toLowerCase() || 'diagnostic';
  const spec = getSpec(test);
  return {
    purpose: spec.biomarker ? `${n} measures ${spec.biomarker.name.toLowerCase()} — ${spec.biomarker.why.toLowerCase()}` : `${n} is a ${test.description?.toLowerCase() || `${cat} test that helps evaluate your health status.`}`,
    whyDone: spec.symptoms ? [
      `To screen for ${cat} conditions before symptoms appear`,
      `To help diagnose existing ${cat}-related symptoms`,
      `To monitor the effectiveness of ongoing treatment`,
      `As part of routine preventive health checkups`,
    ] : [
      `To screen for potential ${cat} conditions before symptoms appear`,
      `To help diagnose existing symptoms related to ${cat} health`,
      `To monitor the effectiveness of ongoing treatment`,
      `As part of routine preventive health checkups`,
    ],
    whatItMeasures: spec.biomarker ? `${n} measures ${spec.biomarker.name.toLowerCase()} levels in your blood. ${spec.biomarker.why}` : `This test ${test.description?.toLowerCase() || `analyzes key markers related to ${cat} function in your body.`}`,
    conditionsDetected: spec.diseases ? spec.diseases.slice(0, 5) : [
      `${test.category} disorders and abnormalities`,
      'Early stage changes before symptoms become noticeable',
      `${test.fasting_required ? 'Metabolic and functional changes' : 'Abnormal cellular or molecular activity'}`,
    ],
    screeningOrDiagnostic: test.category === 'Full Body' || test.category === 'Cancer' ? 'Primarily a screening test — used to detect potential issues before symptoms appear.' : 'Can be used both for screening (routine checkup) and diagnosis (when symptoms are present).',
  };
}

function getCostAndBooking(test) {
  return {
    price: `\u20B9${test.offerPrice || test.price}`,
    mrp: `\u20B9${test.mrp || test.price}`,
    offerPrice: `\u20B9${test.offerPrice || test.price}`,
    savings: test.mrp && test.mrp > (test.offerPrice || test.price) ? `Save \u20B9${test.mrp - (test.offerPrice || test.price)}` : null,
    homeCollection: 'Yes, home sample collection is completely free. No additional charges.',
    whyAffordable: 'Jeevan HealthCare at Home partners directly with NABL-certified labs to offer competitive pricing. No middlemen ensure affordable rates.',
    howToBook: 'Book online by adding to cart. Select your preferred date, time, and address for home collection.',
    paymentMethods: ['Cash on Collection', 'Card at Collection', 'UPI', 'Net Banking', 'Credit/Debit Card'],
  };
}

function getPostTestGuidance(test) {
  return [
    'Review your report carefully once received. Compare values with the reference ranges provided.',
    'Share your report with your doctor for professional interpretation and personalized advice.',
    'If values are abnormal, your doctor may recommend follow-up tests or lifestyle modifications.',
    'For chronic conditions, regular monitoring as advised by your healthcare provider is important.',
    'Maintain a healthy lifestyle — balanced diet, regular exercise, and adequate sleep can improve your results over time.',
    'Jeevan HealthCare at Home offers free doctor consultation with every test to help you understand your results.',
  ];
}

function getCustomization(test) {
  return {
    canCombine: `Yes, ${test.name} can be combined with other related tests for a comprehensive health assessment. Add multiple tests to your cart before booking.`,
    advancedVersions: test.category === 'Full Body' ? 'Advanced packages with additional parameters like vitamin profiles, tumor markers, and hormone panels are available under Health Packages.' : 'Advanced panels with additional parameters are available. Check our Health Packages section.',
    doctorRecommendation: 'Doctors commonly recommend this test based on symptoms, risk factors, family history, and routine health screening protocols.',
    addMoreParameters: test.category === 'Full Body' || test.category === 'Cardiac' || test.category === 'Thyroid' ? 'Yes, additional parameters can be added. Consult with our team or your doctor for the most appropriate combination.' : 'This test focuses on specific markers. For a broader assessment, consider adding related tests to your cart.',
  };
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

function generateFaqsFull(test, spec, whatIs, cost, customization) {
  const n = test.name;
  const a = spec.abbr || n;
  const cat = test.category?.toLowerCase() || 'health';
  return [
    { q: `What is ${n}?`, c: 'general', a: `${n} is a diagnostic test that ${test.description?.toLowerCase() || `helps evaluate ${cat} health.`} It measures key health markers to provide insights into your body's functioning.` },
    { q: `Why is ${n} done?`, c: 'general', a: whatIs.whyDone.slice(0, 3).join(' It is also done ') + '.' },
    { q: `Who should take ${n}?`, c: 'general', a: `Anyone with ${cat} health concerns, those with family history of ${cat} disorders, individuals experiencing related symptoms, or anyone wanting a routine health assessment.` },
    { q: `What does ${n} check?`, c: 'general', a: spec.biomarker ? `${n} measures ${spec.biomarker.name.toLowerCase()} in your blood. ${spec.biomarker.why}` : `This test measures key markers related to ${cat} health.` },
    { q: `Do I need fasting before ${n}?`, c: 'preparation', a: test.fasting_required ? `Yes, fasting is required. ${test.preparation_instructions || 'Fasting for 8-10 hours is recommended. Water is allowed.'}` : `No, fasting is not required for this test. ${test.preparation_instructions || 'You can take the test at any time of day.'}` },
    { q: `Can I drink water before ${n}?`, c: 'preparation', a: test.fasting_required ? 'Yes, plain drinking water is allowed and encouraged during fasting. Avoid sweetened drinks, tea, coffee, and milk.' : 'Yes, you can drink water normally before this test.' },
    { q: `Can I take medicines before ${n}?`, c: 'preparation', a: 'Continue your regular medications unless your doctor specifically advises otherwise. Inform the lab about any medications you are taking.' },
    { q: `How is ${n} performed?`, c: 'procedure', a: 'A blood sample is collected by a trained phlebotomist from a vein in your arm using a sterile needle. The process takes about 5 minutes at your home.' },
    { q: `Is ${n} painful?`, c: 'procedure', a: 'You may feel a mild pinch or prick when the needle is inserted, but the discomfort is minimal and lasts only a few seconds.' },
    { q: `How long does the ${a} test take?`, c: 'procedure', a: `The blood collection process takes about ${getDuration(test)}. The entire home visit is typically completed within 15-20 minutes.` },
    { q: `Can ${n} be done at home?`, c: 'procedure', a: 'Yes, absolutely. Home sample collection is completely free. A trained phlebotomist will visit your home at your preferred time slot.' },
    { q: `How long for ${a} results?`, c: 'results', a: `Reports are typically delivered within ${test.report_time || '24-48 hours'} via WhatsApp, Email, and our mobile app.` },
    { q: `How will I receive ${a} reports?`, c: 'results', a: 'Reports are delivered through multiple channels — WhatsApp message, Email, and the Jeevan HealthCare at Home mobile app.' },
    { q: `What do ${a} results mean?`, c: 'results', a: 'Normal results indicate your parameters are within the healthy reference range. Abnormal results may indicate the need for further evaluation by a doctor.' },
    { q: `What if ${a} values are high or low?`, c: 'results', a: spec.abnormalMeaning || 'Abnormal values do not always mean disease. Your doctor will consider your clinical history along with lab results for an accurate assessment.' },
    { q: `Should I consult a doctor after ${a} results?`, c: 'results', a: 'Yes, it is recommended to share your report with a doctor for professional interpretation. Jeevan HealthCare at Home offers free doctor consultation with every test.' },
    { q: `How accurate is ${n}?`, c: 'quality', a: 'All tests are processed at NABL-certified laboratories using automated analyzers with strict quality control. Results are reviewed by qualified lab professionals.' },
    { q: `Is ${n} safe for elderly or pregnant women?`, c: 'safety', a: 'Yes, this test is safe for all age groups including elderly, pregnant women, and children. Our phlebotomists are trained to handle all patient types with care.' },
    { q: `How often should I take ${n}?`, c: 'frequency', a: generateFrequency(test) },
    { q: `Can ${n} be combined with other tests?`, c: 'general', a: customization.canCombine },
    { q: `What is the price of ${n}?`, c: 'booking', a: `The ${n} costs ${cost.offerPrice}. Home sample collection is free with no hidden charges.` },
    { q: `Is home collection free for ${n}?`, c: 'booking', a: 'Yes, home sample collection is completely free across Hyderabad and surrounding areas.' },
    { q: `What payment methods are available?`, c: 'booking', a: 'You can pay at collection (cash or card) or pay online via UPI, Net Banking, or Credit/Debit Card during booking.' },
    { q: `Will I get doctor consultation after ${n}?`, c: 'booking', a: 'Yes, Jeevan HealthCare at Home provides free doctor consultation with every test to help you understand your results.' },
    { q: `Can lifestyle changes improve ${a} results?`, c: 'lifestyle', a: 'Yes, many health parameters can be improved through balanced diet, regular exercise, adequate sleep, stress management, and medication adherence.' },
    { q: `What medications affect ${a} results?`, c: 'medications', a: spec.medications ? spec.medications.slice(0, 3).join(', ') + '. Always inform your doctor about all medications.' : 'Certain medications may affect test results. Inform your doctor about all medications and supplements you are taking.' },
  ];
}

function generateRefRange(test, spec) {
  if (spec.normalRange) return spec.normalRange;
  return { label: 'Reference Range', adultMale: 'Varies by laboratory', adultFemale: 'Varies by laboratory', child: 'Varies by age' };
}

function generateInterpretation(test, spec) {
  if (spec.riskLevels) {
    return spec.riskLevels.map(r => `${r.level === 'Normal' ? '🟢' : r.level === 'Borderline' ? '🟡' : '🔴'} ${r.level}: ${r.desc}`).join('\n');
  }
  return [
    'Normal results indicate your parameters are within the healthy reference range',
    'Abnormal results may indicate the need for further evaluation by a doctor',
    'Results should always be interpreted by a qualified healthcare provider',
    'Single abnormal values do not necessarily mean disease — clinical context matters',
  ].join('\n');
}

function getInfoCards(test, spec) {
  return [
    { label: 'Sample Type', value: 'Blood', icon: '🩸' },
    { label: 'Sample Volume', value: '2-3 ml', icon: '💧' },
    { label: 'Preparation', value: test.fasting_required ? 'Fasting Required' : 'No Fasting Required', icon: '🍽️' },
    { label: 'Collection', value: 'Free Home Collection', icon: '🏠' },
    { label: 'Report Time', value: test.report_time || '24 Hours', icon: '⏱️' },
    { label: 'Test Category', value: test.category || 'Diagnostic', icon: '📋' },
    { label: 'NABL Status', value: 'Available', icon: '✅' },
    { label: 'Prescription', value: 'Not Required', icon: '📄' },
  ];
}

const sampleProcessSteps = [
  { step: 'Book Test', icon: '📱', desc: 'Book online in 2 minutes' },
  { step: 'Home Visit', icon: '🏠', desc: 'Phlebotomist arrives at your time slot' },
  { step: 'Sample Collection', icon: '💉', desc: 'Quick blood draw in 5-10 minutes' },
  { step: 'Lab Testing', icon: '🔬', desc: 'Processed at NABL certified lab' },
  { step: 'Quality Check', icon: '✅', desc: 'Verified by lab professionals' },
  { step: 'Digital Report', icon: '📱', desc: 'Delivered via WhatsApp/Email/App' },
];

export function getTestBySlug(slug) {
  return seedTests.find(t => makeSlug(t.name) === slug) || null;
}

export function getTestEducation(test) {
  if (!test) return null;
  const spec = getSpec(test);
  const abbr = spec.abbr || (test.name.includes('(') ? test.name.match(/\(([^)]+)\)/)?.[1] || '' : '');
  const altList = spec.alt && spec.alt.length > 0 ? spec.alt : generateAltNames(test, spec);
  const params = spec.biomarker ? [spec.biomarker.name, ...generateParams(test)] : generateParams(test);
  const whatIs = getWhatIsThis(test);
  const cost = getCostAndBooking(test);
  const guidance = getPostTestGuidance(test);
  const customization = getCustomization(test);
  const refRange = generateRefRange(test, spec);
  const infoCards = getInfoCards(test, spec);

  const fullNameWithCategory = test.name.includes('(')
    ? test.name.replace(/\(([^)]+)\)/, '').trim() + ` (${spec.abbr || ''})`.trim()
    : spec.fullName || test.name;

  return {
    fullName: spec.fullName || test.name.replace(/\([^)]*\)/g, '').trim(),
    fullNameWithCategory,
    scientificName: spec.scientificName || '',
    abbreviation: abbr,
    abbreviations: [abbr, test.name.includes('(') ? test.name.match(/\(([^)]+)\)/)?.[1] || '' : ''].filter(Boolean),
    alternateNames: altList,
    synonyms: spec.synonyms || [],
    category: test.category,
    subcategory: test.subcategory,
    whatIsThis: whatIs,
    biomarker: spec.biomarker ? { ...spec.biomarker, name: spec.biomarker.name || test.name } : { name: test.name, what: test.description || '', why: '' },
    whoShouldTake: generateWhoShouldTake(test),
    whoShouldTakeDetailed: generateWhoShouldTakeDetailed(test),
    symptoms: spec.symptoms || [
      'Related health symptoms',
      'Routine screening requirements',
      'Doctor recommendation',
    ],
    relatedDiseases: spec.diseases || [`${test.category} Disorders`],
    parameters: params,
    preparation: test.preparation_instructions || 'No special preparation required.',
    fastingRequired: test.fasting_required,
    duration: getDuration(test),
    sampleProcess: sampleProcessSteps,
    sampleProcessText: [
      'A trained phlebotomist visits your home at your preferred time slot',
      'A small blood sample is drawn from your arm vein using sterile, single-use equipment',
      'The collection process takes just 5-10 minutes',
      'The sample is safely transported to our NABL-certified lab in temperature-controlled conditions',
      'Advanced automated analyzers process the sample with rigorous quality control',
      'Results are reviewed by qualified lab professionals before digital release',
    ],
    reportTime: test.report_time || '24-48 hours',
    reportDelivery: 'Reports are delivered via WhatsApp, Email, and the Jeevan HealthCare at Home mobile app. You can also download PDF reports from your account dashboard.',
    normalRange: refRange,
    referenceRange: refRange,
    resultInterpretation: [
      'Normal results indicate your parameters are within the healthy reference range',
      'Abnormal results may indicate the need for further evaluation by a doctor',
      'Results should always be interpreted by a qualified healthcare provider',
      'Single abnormal values do not necessarily mean disease — clinical context matters',
      'Your doctor may recommend follow-up tests for confirmation',
    ],
    riskLevels: spec.riskLevels || [
      { level: 'Normal', color: 'green', desc: 'Within healthy reference range' },
      { level: 'Borderline', color: 'orange', desc: 'Slightly outside normal range' },
      { level: 'Abnormal', color: 'red', desc: 'Significantly outside normal range' },
    ],
    abnormalMeaning: spec.abnormalMeaning || 'Abnormal values may indicate an underlying health condition. Consult your doctor for proper interpretation and follow-up.',
    whenToConsultDoctor: spec.consultDoctor || [
      'If results are significantly outside normal range',
      'If you have persistent symptoms',
      'For personalized treatment and follow-up plan',
    ],
    limitations: spec.limitations || [
      'Results should be interpreted in clinical context',
      'Single abnormal value does not confirm disease',
      'Some conditions require additional confirmatory tests',
    ],
    medicationInfluence: spec.medications || [
      'Certain medications may affect test results',
      'Inform your doctor about all medications and supplements',
    ],
    lifestyleFactors: spec.lifestyle || [
      'Diet and nutrition affect many health parameters',
      'Regular exercise supports overall health',
      'Adequate sleep and stress management are important',
    ],
    sampleQualityIssues: spec.sampleQuality || [
      'Proper sample collection ensures accurate results',
      'Follow preparation instructions carefully',
      'Inform lab about any relevant health conditions',
    ],
    comparableTests: spec.comparableTests || [],
    infoCards,
    sampleProcessSteps,
    accuracy: 'All tests are processed at NABL-certified laboratories using automated analyzers with rigorous quality control protocols. Results are reviewed by qualified lab professionals before release.',
    frequency: generateFrequency(test),
    safety: generateSafety(test),
    cost: cost,
    customization: customization,
    postTestGuidance: guidance,
    faqs: generateFaqsFull(test, spec, whatIs, cost, customization),
    faqCategories: ['general', 'preparation', 'procedure', 'results', 'quality', 'safety', 'frequency', 'booking', 'lifestyle', 'medications'],
    seo: {
      url: `/test/${makeSlug(test.name)}`,
      metaTitle: `${spec.fullName || test.name} at Home ₹${test.offerPrice || test.price} | Jeevan HealthCare at Home`,
      metaDescription: `Book ${test.name} at home with Jeevan HealthCare at Home. ₹${test.offerPrice || test.price}. Free home collection. NABL certified labs. Accurate digital reports.`,
    },
  };
}