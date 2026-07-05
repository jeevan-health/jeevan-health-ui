import {
  Heartbeat, Drop, Shield, Brain, Bone, Baby, User, Microscope,
  FloppyDisk, Tooth, Eye, Ear, Syringe, FirstAidKit, Star, Heart,
} from '@phosphor-icons/react';

const testDetailData = {
  'Complete Blood Count (CBC)': {
    alsoKnownAs: ['CBC Test', 'Hemogram', 'Full Blood Count (FBC)', 'Blood Cell Count'],
    applicableFor: { gender: 'Men & Women', age: 'All age groups', conditions: ['General health screening', 'Pre-surgery assessment', 'Infection evaluation'] },
    symptoms: ['Unexplained fatigue', 'Pale skin', 'Frequent infections', 'Easy bruising', 'Prolonged bleeding'],
    riskConditions: ['Anemia history', 'Chronic diseases', 'Bone marrow disorders', 'Autoimmune conditions'],
    whenToTake: ['Annual routine checkup', 'Before surgery', 'When infection suspected', 'Monitoring chronic conditions'],
    sampleType: 'Blood (Vein sample)',
    collectionMethod: 'Home visit or lab visit',
    preparation: 'No fasting required',
    procedure: ['Area is cleaned with antiseptic', 'Tourniquet applied to upper arm', 'Sterile needle collects blood sample', 'Sample stored in labeled vial', 'Sent to lab for automated analysis'],
    normalRange: {
      sections: [
        { label: 'Hemoglobin', male: '13.5–17.5 g/dL', female: '12.0–15.5 g/dL' },
        { label: 'WBC Count', male: '4,000–11,000 cells/mcL', female: '4,000–11,000 cells/mcL' },
        { label: 'Platelets', male: '1.5–4.5 lakh/mcL', female: '1.5–4.5 lakh/mcL' },
        { label: 'RBC Count', male: '4.5–5.5 million/mcL', female: '4.0–5.0 million/mcL' },
      ]
    },
    interpretation: {
      normal: 'All parameters within reference range — normal blood health',
      abnormal: 'Deviation may indicate anemia, infection, clotting disorders, or other conditions',
    },
    relatedTests: ['Peripheral Smear', 'Iron Studies', 'Vitamin B12', 'CRP'],
    benefits: ['Detects anemia early', 'Identifies infections', 'Screens for blood disorders', 'Assesses overall health'],
    limitations: ['Cannot diagnose specific conditions alone', 'Requires clinical correlation', 'May need follow-up tests'],
  },

  'HbA1c': {
    alsoKnownAs: ['Glycated Hemoglobin Test', 'Hemoglobin A1c', 'HbA1c Test', 'Glycosylated Hemoglobin'],
    applicableFor: { gender: 'Men & Women', age: 'Adults & Elderly', conditions: ['Diabetic & Pre-diabetic Patients'] },
    symptoms: ['Increased thirst or hunger', 'Frequent urination', 'Unexplained weight changes', 'Fatigue or weakness', 'Blurred vision', 'Slow healing wounds'],
    riskConditions: ['Family history of diabetes', 'Obesity / overweight', 'Sedentary lifestyle', 'High BP or cholesterol', 'PCOS or gestational diabetes'],
    whenToTake: ['If you are 35+ years old (routine screening)', 'If you are overweight or inactive', 'If you have diabetes risk factors', 'For diabetes monitoring (every 3-6 months)', 'During pregnancy or PCOS evaluation'],
    sampleType: 'Blood (Vein sample)',
    collectionMethod: 'Home visit or lab visit',
    preparation: 'No fasting required. Eat and drink normally. Inform doctor about medications.',
    procedure: ['Phlebotomist cleans the arm area', 'A sterile needle collects blood sample', 'Sample stored in labeled vial', 'Sent to NABL-certified lab for analysis'],
    normalRange: {
      sections: [
        { label: 'Normal', male: 'Below 5.7%', female: 'Below 5.7%' },
        { label: 'Prediabetes', male: '5.7% – 6.4%', female: '5.7% – 6.4%' },
        { label: 'Diabetes', male: '6.5% or above', female: '6.5% or above' },
      ],
      note: 'Results may vary slightly between labs',
    },
    interpretation: {
      normal: 'Normal blood sugar control — low diabetes risk',
      abnormal: 'Elevated levels indicate prediabetes or diabetes; consult physician',
    },
    relatedTests: ['Fasting Blood Sugar (FBS)', 'Postprandial Blood Sugar (PPBS)', 'Glucose Tolerance Test (GTT)', 'Lipid Profile', 'Thyroid Profile', 'Kidney Function Test (KFT)'],
    benefits: ['Early detection of diabetes', 'Long-term sugar monitoring', 'Treatment effectiveness tracking', 'Prevents complications (kidney, heart, nerve damage)'],
    limitations: ['May not show sudden sugar changes', 'Affected by anemia or blood disorders', 'Requires doctor interpretation'],
  },

  'Blood Sugar (Fasting)': {
    alsoKnownAs: ['Fasting Blood Sugar (FBS)', 'Fasting Glucose Test', 'Blood Sugar F', 'FBG'],
    applicableFor: { gender: 'Men & Women', age: 'Adults & Elderly', conditions: ['Diabetic screening', 'Pre-diabetic monitoring'] },
    symptoms: ['Excessive thirst', 'Frequent urination', 'Blurred vision', 'Fatigue', 'Unexplained weight loss'],
    riskConditions: ['Family history of diabetes', 'Obesity', 'High BP', 'PCOS', 'Age 35+'],
    whenToTake: ['Routine diabetes screening', 'Family history of diabetes', 'Gestational diabetes history', 'Annual health checkup'],
    sampleType: 'Blood (Vein sample)',
    collectionMethod: 'Home visit or lab visit',
    preparation: 'Fast for 8-10 hours. Water is allowed.',
    procedure: ['Area cleaned with antiseptic', 'Blood sample drawn from vein', 'Sample sent to lab', 'Glucose levels measured'],
    normalRange: {
      sections: [
        { label: 'Normal', male: '70–100 mg/dL', female: '70–100 mg/dL' },
        { label: 'Prediabetes', male: '100–125 mg/dL', female: '100–125 mg/dL' },
        { label: 'Diabetes', male: '126 mg/dL or above', female: '126 mg/dL or above' },
      ]
    },
    interpretation: {
      normal: 'Normal glucose metabolism',
      abnormal: 'Elevated levels may indicate impaired fasting glucose or diabetes',
    },
    relatedTests: ['HbA1c', 'Postprandial Blood Sugar', 'Glucose Tolerance Test', 'Urine Ketones'],
    benefits: ['Simple diabetes screening', 'Monitors treatment response', 'Identifies prediabetes early'],
    limitations: ['Only reflects fasting state', 'Single day measurement', 'Stress can affect results'],
  },

  'Lipid Profile': {
    alsoKnownAs: ['Lipid Panel', 'Cholesterol Test', 'Lipogram', 'Lipid Profile Test'],
    applicableFor: { gender: 'Men & Women', age: 'Adults 20+ years', conditions: ['Heart disease risk assessment', 'High cholesterol screening'] },
    symptoms: ['Usually no symptoms — silent condition', 'Chest discomfort', 'Shortness of breath', 'Fatigue'],
    riskConditions: ['Family history of heart disease', 'Obesity', 'Smoking', 'Diabetes', 'Sedentary lifestyle', 'High BP'],
    whenToTake: ['Age 20+ (every 5 years)', 'Annual if at risk', 'If overweight or diabetic', 'Family history of heart disease'],
    sampleType: 'Blood (Vein sample)',
    collectionMethod: 'Home visit or lab visit',
    preparation: 'Fast for 10-12 hours. Water is allowed.',
    procedure: ['Tourniquet applied', 'Blood drawn from vein', 'Sample processed in lab', 'Lipid fractions analyzed'],
    normalRange: {
      sections: [
        { label: 'Total Cholesterol', male: 'Desirable: Below 200 mg/dL', female: 'Desirable: Below 200 mg/dL' },
        { label: 'HDL (Good)', male: '40–60 mg/dL', female: '50–60 mg/dL' },
        { label: 'LDL (Bad)', male: 'Below 100 mg/dL', female: 'Below 100 mg/dL' },
        { label: 'Triglycerides', male: 'Below 150 mg/dL', female: 'Below 150 mg/dL' },
      ]
    },
    interpretation: {
      normal: 'All lipid parameters within desirable range — low heart disease risk',
      abnormal: 'Elevated cholesterol/triglycerides may indicate heart disease risk; lifestyle changes recommended',
    },
    relatedTests: ['ECG', '2D Echo', 'hs-CRP', 'Blood Sugar', 'Thyroid Profile'],
    benefits: ['Assesses heart disease risk', 'Guides dietary changes', 'Monitors statin therapy', 'Prevents cardiac events'],
    limitations: ['Fasting required for accurate results', 'Single measurement may vary', 'Does not detect plaque directly'],
  },

  'Thyroid Profile (T3, T4, TSH)': {
    alsoKnownAs: ['Thyroid Function Test', 'TFT', 'Thyroid Panel', 'T3 T4 TSH Test'],
    applicableFor: { gender: 'Men & Women (more common in women)', age: 'Adults', conditions: ['Thyroid disorder screening', 'Weight management evaluation'] },
    symptoms: ['Fatigue', 'Weight changes', 'Hair loss', 'Mood swings', 'Temperature sensitivity', 'Irregular periods'],
    riskConditions: ['Family history of thyroid disease', 'Post-pregnancy', 'Autoimmune conditions', 'Iodine deficiency', 'Age 40+'],
    whenToTake: ['Unexplained fatigue or weight changes', 'Irregular menstrual cycles', 'Family history of thyroid issues', 'Neck swelling or goiter', 'Annual health screening'],
    sampleType: 'Blood (Vein sample)',
    collectionMethod: 'Home visit or lab visit',
    preparation: 'No fasting required. Inform doctor about medications.',
    procedure: ['Blood drawn from arm vein', 'Sample collected in serum separator tube', 'Centrifuged and analyzed', 'TSH, T3, T4 levels measured'],
    normalRange: {
      sections: [
        { label: 'TSH', male: '0.4–4.0 mIU/L', female: '0.4–4.0 mIU/L' },
        { label: 'T3 (Free)', male: '2.3–4.2 pg/mL', female: '2.3–4.2 pg/mL' },
        { label: 'T4 (Free)', male: '0.8–1.8 ng/dL', female: '0.8–1.8 ng/dL' },
      ]
    },
    interpretation: {
      normal: 'Thyroid function is normal',
      abnormal: 'Abnormal levels indicate hypo/hyperthyroidism; consult endocrinologist',
    },
    relatedTests: ['Anti-TPO Antibodies', 'Thyroid Ultrasound', 'Blood Sugar', 'Lipid Profile'],
    benefits: ['Detects thyroid disorders early', 'Helps manage weight issues', 'Monitors thyroid medication', 'Essential for pregnancy planning'],
    limitations: ['Results affected by biotin', 'Needs correlation with symptoms', 'May need antibody tests'],
  },

  'Liver Function Test (LFT)': {
    alsoKnownAs: ['LFT', 'Hepatic Panel', 'Liver Panel', 'Liver Function Panel'],
    applicableFor: { gender: 'Men & Women', age: 'Adults', conditions: ['Liver health assessment', 'Alcohol users', 'Viral hepatitis evaluation'] },
    symptoms: ['Yellow skin or eyes', 'Dark urine', 'Swelling in abdomen', 'Nausea', 'Chronic fatigue', 'Loss of appetite'],
    riskConditions: ['Alcohol consumption', 'Viral hepatitis', 'Obesity (fatty liver)', 'Diabetes', 'Medications affecting liver', 'Family liver disease history'],
    whenToTake: ['Annual health checkup', 'If alcohol user', 'Jaundice symptoms', 'Monitoring liver medications', 'Fatty liver evaluation'],
    sampleType: 'Blood (Vein sample)',
    collectionMethod: 'Home visit or lab visit',
    preparation: 'Fast for 8 hours. Water is allowed.',
    procedure: ['Blood sample drawn', 'Serum separated', 'Multiple enzyme tests run', 'Results analyzed by pathologist'],
    normalRange: {
      sections: [
        { label: 'SGOT/AST', male: '10–40 U/L', female: '10–40 U/L' },
        { label: 'SGPT/ALT', male: '7–56 U/L', female: '7–56 U/L' },
        { label: 'ALP', male: '44–147 U/L', female: '44–147 U/L' },
        { label: 'Total Bilirubin', male: '0.1–1.2 mg/dL', female: '0.1–1.2 mg/dL' },
      ]
    },
    interpretation: {
      normal: 'Liver enzymes and function within normal range — healthy liver',
      abnormal: 'Elevated enzymes may indicate liver inflammation, damage, or disease',
    },
    relatedTests: ['Hepatitis B Surface Antigen', 'Hepatitis C Antibody', 'Ultrasound Abdomen', 'PT/INR'],
    benefits: ['Detects liver damage early', 'Monitors medication effects', 'Assesses fatty liver', 'Screens for hepatitis'],
    limitations: ['Cannot diagnose specific liver disease', 'Other factors affect results', 'Needs imaging correlation'],
  },

  'Kidney Function Test (KFT)': {
    alsoKnownAs: ['Renal Panel', 'KFT', 'Kidney Panel', 'Renal Function Test (RFT)'],
    applicableFor: { gender: 'Men & Women', age: 'Adults & Elderly', conditions: ['Kidney health assessment', 'Hypertension patients', 'Diabetic patients'] },
    symptoms: ['Swelling in feet/ankles', 'Foamy urine', 'Frequent urination at night', 'Fatigue', 'Back pain near kidneys', 'High BP'],
    riskConditions: ['Diabetes', 'High blood pressure', 'Family history of kidney disease', 'Long-term medication use', 'Age 60+'],
    whenToTake: ['Annual health checkup', 'Diabetic monitoring', 'Hypertension management', 'Symptoms of kidney issues', 'Before certain medications'],
    sampleType: 'Blood (Vein sample)',
    collectionMethod: 'Home visit or lab visit',
    preparation: 'No fasting required.',
    procedure: ['Blood drawn from arm', 'Serum analyzed', 'Creatinine, BUN, uric acid measured', 'eGFR calculated'],
    normalRange: {
      sections: [
        { label: 'Serum Creatinine', male: '0.7–1.3 mg/dL', female: '0.6–1.1 mg/dL' },
        { label: 'BUN', male: '7–20 mg/dL', female: '7–20 mg/dL' },
        { label: 'Uric Acid', male: '3.5–7.2 mg/dL', female: '2.6–6.0 mg/dL' },
        { label: 'eGFR', male: '>90 mL/min/1.73m²', female: '>90 mL/min/1.73m²' },
      ]
    },
    interpretation: {
      normal: 'Kidney function is normal — all parameters within range',
      abnormal: 'Elevated creatinine/BUN may indicate reduced kidney function; consult nephrologist',
    },
    relatedTests: ['Urine Complete Analysis', 'Kidney Ultrasound', 'Electrolyte Panel', 'Blood Sugar'],
    benefits: ['Detects kidney impairment early', 'Monitors diabetic kidney health', 'Guides medication dosing', 'Prevents kidney failure progression'],
    limitations: ['Muscle mass affects creatinine', 'Dehydration alters results', 'Needs repeat testing for confirmation'],
  },

  'Vitamin D Total': {
    alsoKnownAs: ['Vitamin D Test', '25-Hydroxy Vitamin D', 'Calcidiol Test', 'Vitamin D3 Level'],
    applicableFor: { gender: 'Men & Women', age: 'All age groups', conditions: ['Vitamin D deficiency screening', 'Bone health assessment'] },
    symptoms: ['Bone pain', 'Muscle weakness', 'Fatigue', 'Frequent infections', 'Mood changes', 'Hair loss'],
    riskConditions: ['Limited sun exposure', 'Dark skin', 'Older age', 'Obesity', 'Osteoporosis', 'Indoor lifestyle'],
    whenToTake: ['Bone pain or weakness', 'Fatigue without cause', 'Osteoporosis risk', 'Indoor lifestyle', 'Winter season evaluation'],
    sampleType: 'Blood (Vein sample)',
    collectionMethod: 'Home visit or lab visit',
    preparation: 'No fasting required.',
    procedure: ['Blood sample collected', 'Serum separated', '25-OH Vitamin D measured', 'Result correlated with season'],
    normalRange: {
      sections: [
        { label: 'Severe Deficiency', male: 'Below 10 ng/mL', female: 'Below 10 ng/mL' },
        { label: 'Deficient', male: '10–20 ng/mL', female: '10–20 ng/mL' },
        { label: 'Insufficient', male: '20–30 ng/mL', female: '20–30 ng/mL' },
        { label: 'Sufficient', male: '30–100 ng/mL', female: '30–100 ng/mL' },
      ]
    },
    interpretation: {
      normal: 'Vitamin D levels are sufficient — good bone health and immunity',
      abnormal: 'Low levels indicate deficiency; supplementation recommended',
    },
    relatedTests: ['Vitamin B12', 'Calcium', 'Iron Studies', 'Bone Density Test'],
    benefits: ['Essential for bone health', 'Supports immunity', 'Improves mood', 'Prevents osteoporosis'],
    limitations: ['Season variation affects levels', 'Different lab standards', 'Requires supplementation follow-up'],
  },

  'Vitamin B12': {
    alsoKnownAs: ['Cobalamin Test', 'Vitamin B12 Level', 'B12 Test', 'Cyanocobalamin Test'],
    applicableFor: { gender: 'Men & Women', age: 'All age groups', conditions: ['Vegetarian/Vegan diet', 'Nerve health assessment'] },
    symptoms: ['Numbness or tingling', 'Memory problems', 'Fatigue', 'Pale skin', 'Mood changes', 'Smooth tongue'],
    riskConditions: ['Vegetarian/vegan diet', 'Age 50+', 'Gastric issues', 'PPI medication use', 'Alcoholism', 'Autoimmune conditions'],
    whenToTake: ['Numbness or tingling', 'Unexplained fatigue', 'Vegetarian diet', 'Memory concerns', 'Anaemia evaluation'],
    sampleType: 'Blood (Vein sample)',
    collectionMethod: 'Home visit or lab visit',
    preparation: 'No fasting required. Inform doctor about supplements.',
    procedure: ['Blood drawn from vein', 'Serum separated', 'B12 level measured by immunoassay', 'Results reported'],
    normalRange: {
      sections: [
        { label: 'Normal', male: '200–900 pg/mL', female: '200–900 pg/mL' },
        { label: 'Borderline', male: '150–200 pg/mL', female: '150–200 pg/mL' },
        { label: 'Deficient', male: 'Below 150 pg/mL', female: 'Below 150 pg/mL' },
      ]
    },
    interpretation: {
      normal: 'B12 levels are normal — healthy nerve function and RBC production',
      abnormal: 'Low levels indicate deficiency; supplementation required',
    },
    relatedTests: ['Vitamin D', 'Iron Studies', 'CBC', 'Homocysteine', 'Methylmalonic Acid'],
    benefits: ['Essential for nerve health', 'Prevents anaemia', 'Boosts energy', 'Supports brain function'],
    limitations: ['Supplements falsely elevate levels', 'Not all forms detected equally', 'Needs correlation with symptoms'],
  },

  'Iron Studies': {
    alsoKnownAs: ['Iron Panel', 'Iron Profile', 'Ferritin Test', 'Iron Deficiency Profile'],
    applicableFor: { gender: 'Men & Women (common in women)', age: 'All age groups', conditions: ['Anemia evaluation', 'Iron deficiency screening'] },
    symptoms: ['Extreme fatigue', 'Pale skin', 'Cold hands and feet', 'Brittle nails', 'Shortness of breath', 'Restless legs'],
    riskConditions: ['Heavy menstrual bleeding', 'Pregnancy', 'Vegetarian diet', 'GI bleeding', 'Frequent blood donation'],
    whenToTake: ['Fatigue and weakness', 'Pale appearance', 'Heavy periods', 'Pregnancy', 'Anemia monitoring'],
    sampleType: 'Blood (Vein sample)',
    collectionMethod: 'Home visit or lab visit',
    preparation: 'Fast for 8 hours. Morning sample preferred.',
    procedure: ['Blood drawn from vein', 'Multiple iron parameters analyzed', 'Serum iron, TIBC, ferritin measured', 'Transferrin saturation calculated'],
    normalRange: {
      sections: [
        { label: 'Serum Iron', male: '60–170 mcg/dL', female: '50–150 mcg/dL' },
        { label: 'Ferritin', male: '20–250 ng/mL', female: '10–120 ng/mL' },
        { label: 'TIBC', male: '250–450 mcg/dL', female: '250–450 mcg/dL' },
        { label: 'Transferrin Saturation', male: '20–50%', female: '15–50%' },
      ]
    },
    interpretation: {
      normal: 'Iron stores and utilization are normal',
      abnormal: 'Low ferritin/iron indicates iron deficiency; high ferritin may indicate overload',
    },
    relatedTests: ['CBC', 'Hemoglobin', 'Vitamin B12', 'Folate'],
    benefits: ['Detects iron deficiency anaemia', 'Monitors iron supplementation', 'Differentiates anaemia types', 'Assesses iron overload'],
    limitations: ['Fasting required', 'Inflammation affects ferritin', 'Diurnal variation in iron levels'],
  },

  'Hemoglobin (Hb)': {
    alsoKnownAs: ['Hb Test', 'Hemoglobin Level', 'Haemoglobin Test'],
    applicableFor: { gender: 'Men & Women', age: 'All age groups', conditions: ['Anaemia screening', 'General health assessment'] },
    symptoms: ['Fatigue', 'Weakness', 'Pale skin', 'Dizziness', 'Shortness of breath', 'Cold intolerance'],
    riskConditions: ['Poor nutrition', 'Heavy menstruation', 'Chronic diseases', 'Pregnancy', 'Family history of anaemia'],
    whenToTake: ['Annual checkup', 'Pregnancy', 'Fatigue evaluation', 'Before surgery', 'Anaemia monitoring'],
    sampleType: 'Blood (Vein or Finger prick)',
    collectionMethod: 'Home visit or lab visit',
    preparation: 'No fasting required.',
    procedure: ['Small blood sample collected', 'Mixed with reagent', 'Colorimetric measurement', 'Hb concentration calculated'],
    normalRange: {
      sections: [
        { label: 'Normal (Male)', male: '13.5–17.5 g/dL', female: 'N/A' },
        { label: 'Normal (Female)', male: 'N/A', female: '12.0–15.5 g/dL' },
        { label: 'Mild Anaemia', male: '10–13.4 g/dL', female: '10–11.9 g/dL' },
        { label: 'Severe Anaemia', male: 'Below 10 g/dL', female: 'Below 10 g/dL' },
      ]
    },
    interpretation: {
      normal: 'Hemoglobin level is adequate for oxygen transport',
      abnormal: 'Low Hb indicates anaemia; high Hb may indicate polycythemia',
    },
    relatedTests: ['CBC', 'Iron Studies', 'Vitamin B12', 'Reticulocyte Count'],
    benefits: ['Quick anaemia detection', 'Simple and affordable', 'Essential pre-surgery assessment'],
    limitations: ['Single parameter test', 'Does not identify anaemia type', 'Needs follow-up tests for cause'],
  },

  'Total Cholesterol': {
    alsoKnownAs: ['Cholesterol Test', 'Total Cholesterol Level'],
    applicableFor: { gender: 'Men & Women', age: 'Adults 20+', conditions: ['Heart health screening', 'High cholesterol monitoring'] },
    symptoms: ['Usually no symptoms', 'Chest pain in advanced cases', 'Xanthomas (fatty deposits)'],
    riskConditions: ['High fat diet', 'Obesity', 'Sedentary lifestyle', 'Smoking', 'Diabetes', 'Family history'],
    whenToTake: ['Age 20+ screening', 'Annual if at risk', 'Diet monitoring', 'Before starting lipid medications'],
    sampleType: 'Blood (Vein sample)',
    collectionMethod: 'Home visit or lab visit',
    preparation: 'Fast for 10-12 hours.',
    procedure: ['Blood drawn from arm', 'Serum analyzed', 'Cholesterol measured enzymatically'],
    normalRange: {
      sections: [
        { label: 'Desirable', male: 'Below 200 mg/dL', female: 'Below 200 mg/dL' },
        { label: 'Borderline High', male: '200–239 mg/dL', female: '200–239 mg/dL' },
        { label: 'High', male: '240 mg/dL or above', female: '240 mg/dL or above' },
      ]
    },
    interpretation: {
      normal: 'Cholesterol levels are desirable — low cardiovascular risk',
      abnormal: 'High cholesterol requires lifestyle changes and possibly medication',
    },
    relatedTests: ['Lipid Profile', 'Triglycerides', 'Blood Sugar', 'hs-CRP'],
    benefits: ['Simple heart health assessment', 'Guides dietary decisions', 'Monitors treatment effectiveness'],
    limitations: ['Fasting required', 'Does not measure HDL/LDL separately', 'Single risk factor only'],
  },

  'TSH': {
    alsoKnownAs: ['TSH Test', 'Thyroid Stimulating Hormone', 'Thyrotropin Test'],
    applicableFor: { gender: 'Men & Women', age: 'All age groups', conditions: ['Thyroid screening', 'Thyroid medication monitoring'] },
    symptoms: ['Fatigue', 'Weight changes', 'Feeling too hot or cold', 'Hair changes', 'Mood fluctuations', 'Heart palpitations'],
    riskConditions: ['Family thyroid history', 'Post-pregnancy', 'Age 40+', 'Autoimmune conditions', 'Iodine imbalance'],
    whenToTake: ['Thyroid symptoms', 'Annual health screening', 'Pregnancy planning', 'Thyroid medication monitoring'],
    sampleType: 'Blood (Vein sample)',
    collectionMethod: 'Home visit or lab visit',
    preparation: 'No fasting required.',
    procedure: ['Blood drawn from arm', 'TSH measured by immunoassay'],
    normalRange: {
      sections: [
        { label: 'Normal', male: '0.4–4.0 mIU/L', female: '0.4–4.0 mIU/L' },
        { label: 'Hyperthyroid', male: 'Below 0.4 mIU/L', female: 'Below 0.4 mIU/L' },
        { label: 'Hypothyroid', male: 'Above 4.0 mIU/L', female: 'Above 4.0 mIU/L' },
      ]
    },
    interpretation: {
      normal: 'Thyroid gland function is normal',
      abnormal: 'Low TSH suggests hyperthyroidism; high TSH suggests hypothyroidism',
    },
    relatedTests: ['Free T3', 'Free T4', 'Anti-TPO', 'Thyroid Ultrasound'],
    benefits: ['Primary thyroid screening test', 'Highly sensitive', 'Monitors thyroid therapy'],
    limitations: ['Normal range varies by age', 'Pregnancy affects results', 'Does not show cause'],
  },

  'Serum Creatinine': {
    alsoKnownAs: ['Creatinine Test', 'Serum Creatinine Level'],
    applicableFor: { gender: 'Men & Women', age: 'All age groups', conditions: ['Kidney function assessment'] },
    symptoms: ['Usually no early symptoms', 'Swelling', 'Reduced urination', 'Fatigue'],
    riskConditions: ['Diabetes', 'High BP', 'Kidney disease history', 'Dehydration', 'Certain medications'],
    whenToTake: ['Kidney function screening', 'Diabetes monitoring', 'Before contrast imaging', 'Medication monitoring'],
    sampleType: 'Blood (Vein sample)',
    collectionMethod: 'Home visit or lab visit',
    preparation: 'No fasting required. Avoid heavy exercise before test.',
    procedure: ['Blood drawn from arm', 'Creatinine measured in serum'],
    normalRange: {
      sections: [
        { label: 'Normal (Male)', male: '0.7–1.3 mg/dL', female: 'N/A' },
        { label: 'Normal (Female)', male: 'N/A', female: '0.6–1.1 mg/dL' },
      ]
    },
    interpretation: {
      normal: 'Kidney function is normal',
      abnormal: 'Elevated creatinine indicates reduced kidney function',
    },
    relatedTests: ['BUN', 'eGFR', 'KFT', 'Urine Microalbumin'],
    benefits: ['Quick kidney screen', 'Monitors kidney disease', 'Guides medication dosing'],
    limitations: ['Affected by muscle mass', 'Dehydration alters results', 'Single test not definitive'],
  },

  'Uric Acid': {
    alsoKnownAs: ['Uric Acid Test', 'Serum Urate Test', 'S. Uric Acid'],
    applicableFor: { gender: 'Men (more common)', age: 'Adults', conditions: ['Gout assessment', 'Kidney stone evaluation'] },
    symptoms: ['Sudden joint pain (big toe common)', 'Joint swelling', 'Redness', 'Warmth in joints', 'Limited movement'],
    riskConditions: ['High purine diet', 'Alcohol consumption', 'Obesity', 'Kidney disease', 'Dehydration', 'Family history'],
    whenToTake: ['Joint pain episodes', 'Gout monitoring', 'Kidney stones', 'High purine diet'],
    sampleType: 'Blood (Vein sample)',
    collectionMethod: 'Home visit or lab visit',
    preparation: 'Fast for 8 hours.',
    procedure: ['Blood drawn from vein', 'Uric acid measured by enzymatic method'],
    normalRange: {
      sections: [
        { label: 'Normal (Male)', male: '3.5–7.2 mg/dL', female: 'N/A' },
        { label: 'Normal (Female)', male: 'N/A', female: '2.6–6.0 mg/dL' },
      ]
    },
    interpretation: {
      normal: 'Uric acid levels are normal — low gout risk',
      abnormal: 'High levels may cause gout or kidney stones; diet modification recommended',
    },
    relatedTests: ['KFT', 'Creatinine', 'Joint X-Ray', 'Urine Uric Acid'],
    benefits: ['Diagnoses gout', 'Monitors urate-lowering therapy', 'Kidney stone risk assessment'],
    limitations: ['Diet affects levels significantly', 'Single test not diagnostic', 'Correlate with symptoms'],
  },

  'CRP (C-Reactive Protein)': {
    alsoKnownAs: ['C-Reactive Protein Test', 'CRP Test', 'hs-CRP (high sensitivity)'],
    applicableFor: { gender: 'Men & Women', age: 'All age groups', conditions: ['Inflammation assessment', 'Infection monitoring'] },
    symptoms: ['Fever', 'Body aches', 'Joint pain', 'Swelling', 'Fatigue', 'Redness at affected site'],
    riskConditions: ['Autoimmune disorders', 'Chronic infections', 'Obesity', 'Smoking', 'Heart disease risk'],
    whenToTake: ['Suspected infection', 'Autoimmune flare', 'Post-surgery monitoring', 'Heart disease risk assessment'],
    sampleType: 'Blood (Vein sample)',
    collectionMethod: 'Home visit or lab visit',
    preparation: 'No fasting required.',
    procedure: ['Blood drawn from arm', 'Serum analyzed', 'CRP measured by immunoassay'],
    normalRange: {
      sections: [
        { label: 'Normal', male: 'Below 3 mg/L', female: 'Below 3 mg/L' },
        { label: 'Mild Elevation', male: '3–10 mg/L', female: '3–10 mg/L' },
        { label: 'Significant Elevation', male: 'Above 10 mg/L', female: 'Above 10 mg/L' },
      ]
    },
    interpretation: {
      normal: 'No significant inflammation',
      abnormal: 'Elevated levels indicate inflammation; further investigation needed',
    },
    relatedTests: ['ESR', 'CBC', 'Autoimmune Panel', 'Blood Culture'],
    benefits: ['Quick inflammation marker', 'Monitors treatment response', 'Heart risk assessment'],
    limitations: ['Non-specific — cannot locate inflammation', 'Infection and inflammation both elevate', 'Needs clinical correlation'],
  },

  'ESR': {
    alsoKnownAs: ['Erythrocyte Sedimentation Rate', 'Sed Rate', 'ESR Test'],
    applicableFor: { gender: 'Men & Women', age: 'All age groups', conditions: ['Inflammation screening', 'Disease monitoring'] },
    symptoms: ['Persistent fever', 'Joint pain', 'Weight loss', 'Night sweats', 'Chronic fatigue'],
    riskConditions: ['Autoimmune conditions', 'Chronic infections', 'Inflammatory diseases', 'Cancer evaluation'],
    whenToTake: ['Suspected inflammation', 'Monitoring disease activity', 'Unexplained fever', 'Autoimmune evaluation'],
    sampleType: 'Blood (Vein sample)',
    collectionMethod: 'Home visit or lab visit',
    preparation: 'No fasting required.',
    procedure: ['Blood collected in special tube', 'Tube placed vertically for 1 hour', 'Distance RBCs fall measured'],
    normalRange: {
      sections: [
        { label: 'Normal (Male)', male: '0–15 mm/hr', female: 'N/A' },
        { label: 'Normal (Female)', male: 'N/A', female: '0–20 mm/hr' },
        { label: 'Elevated', male: 'Above age-related range', female: 'Above age-related range' },
      ]
    },
    interpretation: {
      normal: 'Sedimentation rate is normal — no significant inflammation detected',
      abnormal: 'Elevated ESR indicates inflammation; further testing needed',
    },
    relatedTests: ['CRP', 'CBC', 'Rheumatoid Factor', 'Autoimmune Panel'],
    benefits: ['Simple inflammation marker', 'Monitors disease activity', 'Low cost screening'],
    limitations: ['Non-specific', 'Age and anaemia affect results', 'Slow response to changes'],
  },

  'Dengue NS1 Antigen': {
    alsoKnownAs: ['Dengue NS1 Test', 'Dengue Early Detection', 'NS1 Antigen Test'],
    applicableFor: { gender: 'Men & Women', age: 'All age groups', conditions: ['Early dengue diagnosis', 'Fever evaluation in endemic areas'] },
    symptoms: ['High fever (sudden onset)', 'Severe headache', 'Pain behind eyes', 'Joint/muscle pain', 'Nausea', 'Skin rash'],
    riskConditions: ['Living in dengue-endemic areas', 'Mosquito exposure', 'Recent travel to tropics', 'Monsoon season'],
    whenToTake: ['Fever with body aches', 'Dengue symptoms within 5 days', 'During outbreak', 'Travel to endemic areas'],
    sampleType: 'Blood (Vein sample)',
    collectionMethod: 'Lab visit preferred',
    preparation: 'No fasting required.',
    procedure: ['Blood drawn from vein', 'Plasma/Serum tested', 'NS1 antigen detected by ELISA'],
    normalRange: {
      sections: [
        { label: 'Negative', male: 'No NS1 antigen detected', female: 'No NS1 antigen detected' },
        { label: 'Positive', male: 'NS1 antigen detected — active dengue infection', female: 'NS1 antigen detected — active dengue infection' },
      ]
    },
    interpretation: {
      normal: 'No dengue NS1 antigen detected',
      abnormal: 'Positive test indicates active dengue infection; immediate medical attention advised',
    },
    relatedTests: ['Dengue IgG/IgM', 'CBC', 'Platelet Count', 'Malaria Antigen'],
    benefits: ['Early detection within 1-5 days', 'Quick results', 'Helps early management'],
    limitations: ['Negative after 5 days of fever', 'May need IgM test later', 'Cross-reactivity with other flaviviruses'],
  },

  'Malaria Antigen': {
    alsoKnownAs: ['Malaria Test', 'Malaria Rapid Test', 'Malaria Antigen Detection', 'MP Test'],
    applicableFor: { gender: 'Men & Women', age: 'All age groups', conditions: ['Malaria diagnosis', 'Fever evaluation'] },
    symptoms: ['High fever with chills', 'Sweating', 'Headache', 'Body aches', 'Nausea', 'Anaemia'],
    riskConditions: ['Travel to malaria-endemic areas', 'Mosquito exposure', 'Lack of prophylaxis', 'Weakened immunity'],
    whenToTake: ['Fever with chills', 'After mosquito bites in endemic area', 'Cyclical fever pattern', 'Post-travel fever'],
    sampleType: 'Blood (Finger prick or Vein)',
    collectionMethod: 'Lab visit preferred',
    preparation: 'No fasting required.',
    procedure: ['Finger prick or blood draw', 'Blood applied to test strip', 'Antigen detected by rapid method', 'Microscopy for confirmation'],
    normalRange: {
      sections: [
        { label: 'Negative', male: 'No malaria antigen detected', female: 'No malaria antigen detected' },
        { label: 'Positive', male: 'Malaria antigen detected — species identification needed', female: 'Malaria antigen detected — species identification needed' },
      ]
    },
    interpretation: {
      normal: 'No malaria infection detected',
      abnormal: 'Positive test confirms malaria infection; urgent treatment needed',
    },
    relatedTests: ['Blood Smear (MP)', 'CBC', 'Platelet Count', 'Dengue NS1', 'Typhoid Test'],
    benefits: ['Rapid diagnosis', 'Species differentiation', 'Early treatment initiation'],
    limitations: ['May miss low parasitemia', 'Antigen persists after treatment', 'Microscopy still gold standard'],
  },

  'Typhoid (Widal)': {
    alsoKnownAs: ['Widal Test', 'Typhoid Test', 'Enteric Fever Test', 'Typhoid Serology'],
    applicableFor: { gender: 'Men & Women', age: 'All age groups', conditions: ['Typhoid fever diagnosis', 'Prolonged fever evaluation'] },
    symptoms: ['Prolonged fever (gradual onset)', 'Headache', 'Abdominal pain', 'Constipation or diarrhoea', 'Loss of appetite', 'Rose spots on chest'],
    riskConditions: ['Contaminated food/water', 'Travel to endemic areas', 'Poor sanitation', 'Close contact with infected person'],
    whenToTake: ['Fever lasting more than 5 days', 'Suspected typhoid symptoms', 'After travel to endemic area', 'Food poisoning evaluation'],
    sampleType: 'Blood (Vein sample)',
    collectionMethod: 'Lab visit or home visit',
    preparation: 'No fasting required.',
    procedure: ['Blood drawn from vein', 'Serum separated', 'Serial dilutions tested', 'Antibody titre measured'],
    normalRange: {
      sections: [
        { label: 'Negative', male: 'TO titre <1:80', female: 'TO titre <1:80' },
        { label: 'Positive', male: 'TO titre ≥1:160 or rising', female: 'TO titre ≥1:160 or rising' },
      ]
    },
    interpretation: {
      normal: 'No significant typhoid antibodies detected',
      abnormal: 'Elevated titres indicate recent or active typhoid infection',
    },
    relatedTests: ['Blood Culture', 'CBC', 'Malaria Antigen', 'Dengue NS1', 'Urine Culture'],
    benefits: ['Common typhoid screening', 'Widely available', 'Affordable'],
    limitations: ['Cross-reactivity with other infections', 'Previous vaccination affects results', 'Blood culture is gold standard'],
  },

  'Urine Complete Analysis': {
    alsoKnownAs: ['Urinalysis', 'Urine R/M', 'Urine Routine', 'Urine Complete Examination'],
    applicableFor: { gender: 'Men & Women', age: 'All age groups', conditions: ['UTI screening', 'Kidney assessment', 'General health check'] },
    symptoms: ['Painful urination', 'Frequent urination', 'Cloudy urine', 'Blood in urine', 'Lower abdominal pain'],
    riskConditions: ['UTI history', 'Pregnancy', 'Diabetes', 'Kidney stones', 'Catheter use'],
    whenToTake: ['UTI symptoms', 'Annual health checkup', 'Pregnancy monitoring', 'Kidney stone evaluation'],
    sampleType: 'Urine (Mid-stream clean catch)',
    collectionMethod: 'Home collection or lab',
    preparation: 'No fasting required. Morning sample preferred. Clean genital area before collection.',
    procedure: ['Clean genital area', 'Collect mid-stream urine', 'Physical, chemical, microscopic exam', 'Results analyzed'],
    normalRange: {
      sections: [
        { label: 'Colour', male: 'Pale yellow to amber', female: 'Pale yellow to amber' },
        { label: 'pH', male: '4.5–8.0', female: '4.5–8.0' },
        { label: 'Protein', male: 'Negative', female: 'Negative' },
        { label: 'Glucose', male: 'Negative', female: 'Negative' },
        { label: 'RBCs', male: '0–2 /hpf', female: '0–2 /hpf' },
        { label: 'WBCs', male: '0–5 /hpf', female: '0–5 /hpf' },
      ]
    },
    interpretation: {
      normal: 'All parameters normal — healthy urinary system',
      abnormal: 'Abnormal findings may indicate UTI, kidney disease, or diabetes',
    },
    relatedTests: ['Urine Culture', 'KFT', 'Blood Sugar', 'Ultrasound KUB'],
    benefits: ['Quick and painless', 'Detects UTIs early', 'Screens for kidney disease', 'Pregnancy monitoring'],
    limitations: ['Contamination possible', 'Morning sample preferred', 'Needs culture for confirmation'],
  },

  'PSA (Prostate Specific Antigen)': {
    alsoKnownAs: ['PSA Test', 'Prostate-Specific Antigen', 'Prostate Health Test'],
    applicableFor: { gender: 'Men only', age: 'Men 40+', conditions: ['Prostate cancer screening', 'BPH monitoring'] },
    symptoms: ['Frequent urination', 'Weak urine stream', 'Difficulty starting urination', 'Blood in urine', 'Pelvic discomfort'],
    riskConditions: ['Age 50+', 'Family history of prostate cancer', 'African ancestry', 'Obesity', 'High fat diet'],
    whenToTake: ['Annual screening age 50+', 'Age 40+ if high risk', 'Prostate symptoms', 'Monitoring BPH treatment'],
    sampleType: 'Blood (Vein sample)',
    collectionMethod: 'Home visit or lab visit',
    preparation: 'No fasting required. Avoid ejaculation for 48 hours before test.',
    procedure: ['Blood drawn from arm', 'PSA measured by immunoassay', 'Free/total PSA ratio if needed'],
    normalRange: {
      sections: [
        { label: 'Normal', male: 'Below 4.0 ng/mL', female: 'N/A' },
        { label: 'Borderline', male: '4.0–10.0 ng/mL', female: 'N/A' },
        { label: 'Elevated', male: 'Above 10.0 ng/mL', female: 'N/A' },
      ]
    },
    interpretation: {
      normal: 'PSA level is normal — low prostate cancer risk',
      abnormal: 'Elevated PSA may indicate prostate issues; further evaluation needed',
    },
    relatedTests: ['Free PSA', 'Digital Rectal Exam', 'Prostate Biopsy', 'Prostate MRI'],
    benefits: ['Early prostate cancer detection', 'Monitors treatment', 'Simple blood test'],
    limitations: ['BPH also elevates PSA', 'Prostatitis affects levels', 'Not cancer-specific', 'Requires biopsy for confirmation'],
  },

  'Pap Smear': {
    alsoKnownAs: ['Pap Test', 'Cervical Smear', 'Cervical Cytology', 'Pap Smear Test'],
    applicableFor: { gender: 'Women only', age: 'Women 21–65', conditions: ['Cervical cancer screening', 'HPV evaluation'] },
    symptoms: ['Usually no early symptoms', 'Abnormal vaginal bleeding', 'Pelvic pain', 'Pain during intercourse'],
    riskConditions: ['HPV infection', 'Multiple sexual partners', 'Smoking', 'Weakened immunity', 'Long-term OC pill use'],
    whenToTake: ['Age 21-29 (every 3 years)', 'Age 30-65 (every 5 years with HPV)', 'Abnormal bleeding', 'HPV history'],
    sampleType: 'Cervical cells (Swab)',
    collectionMethod: 'Clinic visit required',
    preparation: 'Avoid intercourse, douching, tampons for 48 hours. Not during menstruation.',
    procedure: ['Patient lies in lithotomy position', 'Speculum inserted', 'Cervical cells gently scraped', 'Cells preserved and sent to lab'],
    normalRange: {
      sections: [
        { label: 'Normal', male: 'N/A', female: 'No abnormal cells detected — negative for intraepithelial lesion' },
        { label: 'Abnormal', male: 'N/A', female: 'Atypical cells detected — follow-up recommended' },
      ]
    },
    interpretation: {
      normal: 'Cervical cells appear normal — no precancerous changes detected',
      abnormal: 'Abnormal cells detected; colposcopy and HPV testing recommended',
    },
    relatedTests: ['HPV DNA Test', 'Colposcopy', 'Cervical Biopsy', 'LBC (Liquid-Based Cytology)'],
    benefits: ['Prevents cervical cancer', 'Detects precancerous changes', 'Simple outpatient procedure', 'Has reduced cervical cancer deaths by 70%'],
    limitations: ['Requires clinic visit', 'Uncomfortable for some women', 'False negatives possible', 'Not diagnostic for cancer'],
  },

  'ECG (Electrocardiogram)': {
    alsoKnownAs: ['ECG', 'EKG', 'Electrocardiogram', 'Heart Rhythm Test'],
    applicableFor: { gender: 'Men & Women', age: 'All age groups', conditions: ['Heart rhythm assessment', 'Cardiac evaluation'] },
    symptoms: ['Chest pain', 'Palpitations', 'Shortness of breath', 'Dizziness', 'Fainting', 'Fatigue'],
    riskConditions: ['Heart disease history', 'High BP', 'Diabetes', 'Smoking', 'Family history of cardiac issues'],
    whenToTake: ['Chest pain', 'Irregular heartbeat', 'Pre-surgery evaluation', 'Annual cardiac checkup', 'After heart attack'],
    sampleType: 'N/A (Non-invasive)',
    collectionMethod: 'Lab or clinic visit',
    preparation: 'No preparation needed. Avoid oily skin or lotions.',
    procedure: ['Chest and limbs cleaned', 'Electrodes placed on specific points', 'Heart electrical activity recorded', 'Results printed on graph paper'],
    normalRange: {
      sections: [
        { label: 'Normal Sinus Rhythm', male: 'Regular rhythm, 60-100 bpm', female: 'Regular rhythm, 60-100 bpm' },
      ]
    },
    interpretation: {
      normal: 'Heart rhythm and electrical activity are normal',
      abnormal: 'Abnormal patterns may indicate arrhythmia, ischemia, or structural issues',
    },
    relatedTests: ['2D Echo', 'Stress Test', 'Holter Monitoring', 'Lipid Profile', 'Cardiac Enzymes'],
    benefits: ['Quick and painless', 'Non-invasive', 'Immediate results', 'Detects heart problems early'],
    limitations: ['Shows only during recording', 'Cannot detect all heart conditions', 'Needs clinical correlation'],
  },

  '2D Echo': {
    alsoKnownAs: ['Echocardiogram', '2D Echo Test', 'Cardiac Ultrasound', 'Echo'],
    applicableFor: { gender: 'Men & Women', age: 'All age groups', conditions: ['Structural heart assessment', 'Valve evaluation'] },
    symptoms: ['Chest pain', 'Shortness of breath', 'Heart murmur', 'Leg swelling', 'Palpitations', 'Fatigue'],
    riskConditions: ['Heart disease', 'High BP', 'Previous heart attack', 'Valve disease', 'Congenital heart disease'],
    whenToTake: ['Suspected heart disease', 'Heart murmur evaluation', 'Post-heart attack', 'Pre-surgery clearance', 'Annual cardiac check'],
    sampleType: 'N/A (Non-invasive ultrasound)',
    collectionMethod: 'Clinic or hospital visit',
    preparation: 'No preparation needed.',
    procedure: ['Gel applied to chest', 'Ultrasound probe moved over chest', 'Sound waves create heart images', 'Chambers, valves, blood flow assessed'],
    normalRange: {
      sections: [
        { label: 'Normal', male: 'Normal chamber size, valve function, and EF ≥55%', female: 'Normal chamber size, valve function, and EF ≥55%' },
      ]
    },
    interpretation: {
      normal: 'Heart structure and function are normal',
      abnormal: 'Abnormal findings indicate valve issues, cardiomyopathy, or structural defects',
    },
    relatedTests: ['ECG', 'Stress Echo', 'Cardiac MRI', 'Coronary Angiography'],
    benefits: ['Non-invasive', 'No radiation', 'Detailed structural assessment', 'Real-time heart imaging'],
    limitations: ['Operator dependent', 'Limited lung disease views', 'Not for coronary blockages'],
  },

  'Chest X-Ray': {
    alsoKnownAs: ['Chest X-ray', 'Chest Radiograph', 'CX Ray', 'Lung X-ray'],
    applicableFor: { gender: 'Men & Women', age: 'All age groups', conditions: ['Lung assessment', 'Heart size evaluation', 'Chest trauma'] },
    symptoms: ['Persistent cough', 'Chest pain', 'Shortness of breath', 'Fever', 'Coughing blood', 'Wheezing'],
    riskConditions: ['Smoking', 'Tuberculosis exposure', 'Pneumonia', 'COPD', 'Occupational lung hazards'],
    whenToTake: ['Respiratory symptoms', 'Suspected pneumonia', 'TB screening', 'Pre-surgery', 'Chest injury'],
    sampleType: 'N/A (Imaging)',
    collectionMethod: 'Lab or hospital visit',
    preparation: 'No preparation needed. Remove metal objects and jewellery.',
    procedure: ['Stand in front of X-ray plate', 'Take deep breath and hold', 'X-ray beam passes through chest', 'Image captured on digital plate'],
    normalRange: {
      sections: [
        { label: 'Normal', male: 'Clear lung fields, normal heart size', female: 'Clear lung fields, normal heart size' },
      ]
    },
    interpretation: {
      normal: 'Lungs and heart appear normal',
      abnormal: 'Abnormal findings may indicate pneumonia, TB, mass, or heart enlargement',
    },
    relatedTests: ['CT Chest', 'Mantoux Test', 'Sputum Culture', 'Pulmonary Function Test'],
    benefits: ['Quick imaging', 'Low radiation', 'Widely available', 'Good for lung screening'],
    limitations: ['Low detail for soft tissues', 'Small lesions may be missed', 'Not for detailed heart assessment'],
  },

  'MRI Brain': {
    alsoKnownAs: ['Brain MRI', 'Magnetic Resonance Imaging Brain', 'Cranial MRI'],
    applicableFor: { gender: 'Men & Women', age: 'All age groups', conditions: ['Brain assessment', 'Neurological evaluation'] },
    symptoms: ['Persistent headache', 'Seizures', 'Numbness/weakness', 'Vision problems', 'Memory loss', 'Balance issues'],
    riskConditions: ['Neurological disorders', 'Head injury', 'Stroke history', 'Brain tumour suspicion', 'Multiple sclerosis'],
    whenToTake: ['Neurological symptoms', 'Head trauma', 'Stroke evaluation', 'Brain tumour screening', 'Chronic headaches'],
    sampleType: 'N/A (Imaging)',
    collectionMethod: 'Hospital or imaging centre',
    preparation: 'Remove metal objects. Inform about implants. Fast for 4-6 hours if contrast needed.',
    procedure: ['Patient lies on movable table', 'Table slides into MRI machine', 'Strong magnetic field creates images', 'Machine makes loud tapping sounds', 'Contrast injected if needed'],
    normalRange: {
      sections: [
        { label: 'Normal', male: 'Normal brain anatomy — no lesions, haemorrhage, or masses', female: 'Normal brain anatomy — no lesions, haemorrhage, or masses' },
      ]
    },
    interpretation: {
      normal: 'Brain structure appears normal',
      abnormal: 'Findings may indicate stroke, tumour, inflammation, or degenerative changes',
    },
    relatedTests: ['CT Brain', 'EEG', 'Cerebral Angiography', 'Neurological Examination'],
    benefits: ['Excellent soft tissue detail', 'No radiation', 'Detailed brain imaging', 'Detects strokes and tumours'],
    limitations: ['Expensive', 'Not for metal implant patients', 'Claustrophobic for some', 'Long scan time'],
  },

  'CT Scan Abdomen': {
    alsoKnownAs: ['CT Abdomen', 'CAT Scan Abdomen', 'Abdominal CT', 'Computed Tomography Abdomen'],
    applicableFor: { gender: 'Men & Women', age: 'All age groups', conditions: ['Abdominal organ assessment', 'Pain evaluation'] },
    symptoms: ['Abdominal pain', 'Bloating', 'Nausea', 'Unexplained weight loss', 'Mass felt in abdomen'],
    riskConditions: ['GI disorders', 'Liver disease', 'Kidney stones', 'Cancer evaluation', 'Abdominal trauma'],
    whenToTake: ['Severe abdominal pain', 'Suspected organ injury', 'Cancer staging', 'Kidney stone evaluation', 'Unexplained abdominal symptoms'],
    sampleType: 'N/A (Imaging with contrast)',
    collectionMethod: 'Hospital or imaging centre',
    preparation: 'Fast for 4 hours. Drink water. Contrast drink may be needed.',
    procedure: ['Patient lies on CT table', 'Table slides through donut-shaped scanner', 'X-rays taken from multiple angles', 'Computer creates cross-sectional images', 'Contrast injected if needed'],
    normalRange: {
      sections: [
        { label: 'Normal', male: 'Normal abdominal organs — no masses, inflammation, or obstruction', female: 'Normal abdominal organs — no masses, inflammation, or obstruction' },
      ]
    },
    interpretation: {
      normal: 'Abdominal organs appear normal',
      abnormal: 'Findings may indicate organ enlargement, masses, stones, or inflammation',
    },
    relatedTests: ['Ultrasound Abdomen', 'MRI Abdomen', 'KFT', 'LFT', 'Chest X-Ray'],
    benefits: ['Detailed organ imaging', 'Quick scan', 'Detects tumours early', 'Guides surgeries'],
    limitations: ['Radiation exposure', 'Contrast allergy risk', 'Expensive', 'Less detail than MRI for soft tissues'],
  },

  'Pregnancy Test (Urine)': {
    alsoKnownAs: ['Pregnancy Test', 'Urine HCG Test', 'Pregnancy Urine Test', 'HCG Card Test'],
    applicableFor: { gender: 'Women only', age: 'Reproductive age', conditions: ['Pregnancy detection'] },
    symptoms: ['Missed period', 'Nausea', 'Breast tenderness', 'Fatigue', 'Frequent urination', 'Food aversions'],
    riskConditions: ['Unprotected intercourse', 'Fertility treatment', 'Irregular periods', 'Contraceptive failure'],
    whenToTake: ['Missed period (after 1 week)', 'Pregnancy symptoms', 'Before medical procedures', 'Fertility treatment monitoring'],
    sampleType: 'Urine',
    collectionMethod: 'Home or lab',
    preparation: 'First morning urine preferred. No excessive water before test.',
    procedure: ['Collect urine in clean container', 'Test strip dipped in urine', 'Wait 3-5 minutes', 'Read result lines'],
    normalRange: {
      sections: [
        { label: 'Negative', male: 'N/A', female: 'No HCG detected — not pregnant' },
        { label: 'Positive', male: 'N/A', female: 'HCG detected — pregnant' },
      ]
    },
    interpretation: {
      normal: 'No HCG detected in urine — not pregnant',
      abnormal: 'HCG detected — pregnancy confirmed; ultrasound recommended',
    },
    relatedTests: ['Serum HCG (Blood)', 'Pelvic Ultrasound', 'CBC', 'Urine Complete Analysis'],
    benefits: ['Quick home test', 'Affordable', 'Easy to use', 'Private and confidential'],
    limitations: ['False negatives if tested too early', 'Ectopic pregnancy may show positive', 'Not quantitative', 'Medications may affect results'],
  },

  'Prolactin': {
    alsoKnownAs: ['Prolactin Test', 'PRL Test', 'Serum Prolactin Level'],
    applicableFor: { gender: 'Men & Women', age: 'Adults', conditions: ['Hormonal imbalance evaluation', 'Infertility assessment'] },
    symptoms: ['Irregular periods', 'Galactorrhea (milk discharge)', 'Infertility', 'Low libido', 'Headaches', 'Vision changes'],
    riskConditions: ['Pituitary disorders', 'Thyroid issues', 'PCOS', 'Kidney disease', 'Certain medications', 'Stress'],
    whenToTake: ['Irregular menstrual cycles', 'Unexplained infertility', 'Breast discharge', 'Low libido', 'Pituitary evaluation'],
    sampleType: 'Blood (Vein sample)',
    collectionMethod: 'Home visit or lab visit',
    preparation: 'Fast for 2 hours. Avoid stress and exercise before test. Morning sample preferred.',
    procedure: ['Blood drawn from arm', 'Serum separated', 'Prolactin measured by immunoassay'],
    normalRange: {
      sections: [
        { label: 'Normal (Female)', male: 'N/A', female: '2–29 ng/mL' },
        { label: 'Normal (Male)', male: '2–18 ng/mL', female: 'N/A' },
      ]
    },
    interpretation: {
      normal: 'Prolactin levels are normal',
      abnormal: 'Elevated prolactin may indicate pituitary adenoma or hormone imbalance',
    },
    relatedTests: ['FSH', 'LH', 'TSH', 'MRI Pituitary', 'Testosterone (Male)'],
    benefits: ['Detects hormonal causes of infertility', 'Identifies pituitary issues', 'Monitors treatment'],
    limitations: ['Stress elevates levels', 'Single reading may be insufficient', 'Medications affect results'],
  },
};

export default testDetailData;
