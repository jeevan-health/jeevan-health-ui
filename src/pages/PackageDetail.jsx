import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Heartbeat, Warning, Shield, User, Heart, Lightbulb, Baby, Suitcase, Pill, Cloud, ForkKnife,
  Airplane, Briefcase, Coin, Moon, Leaf, Syringe, FirstAid, Globe, Lightning, Clock,
  CheckCircle, Drop, FileText, Plus, CaretLeft, WhatsappLogo, FacebookLogo, Copy,
} from '@phosphor-icons/react';

const axisMeta = {
  organ: { icon: Heartbeat, color: '#0F5DA8', label: 'Organ Wise' },
  disease: { icon: Warning, color: '#c62828', label: 'Disease Wise' },
  disorder: { icon: Shield, color: '#7b1fa2', label: 'Disorder Wise' },
  age: { icon: User, color: '#2e7d32', label: 'Age Wise' },
  gender: { icon: Heart, color: '#e65100', label: 'Gender Wise' },
  lifestyle: { icon: Lightbulb, color: '#FF8A00', label: 'Lifestyle Wise' },
  lifeStage: { icon: Baby, color: '#ec407a', label: 'Life Stage Wise' },
  symptom: { icon: Warning, color: '#ff7043', label: 'Symptom Wise' },
  occupation: { icon: Suitcase, color: '#5c6bc0', label: 'Occupation Wise' },
  medication: { icon: Pill, color: '#26a69a', label: 'Medication Monitoring' },
  familyHistory: { icon: Heartbeat, color: '#ef5350', label: 'Family History / Genetic' },
  seasonal: { icon: Cloud, color: '#42a5f5', label: 'Seasonal Wise' },
  diet: { icon: ForkKnife, color: '#66bb6a', label: 'Diet Wise' },
  postRecovery: { icon: Heartbeat, color: '#ab47bc', label: 'Post-Recovery Wise' },
  travel: { icon: Airplane, color: '#ffa726', label: 'Travel Wise' },
  insurance: { icon: Briefcase, color: '#78909c', label: 'Insurance / Corporate' },
  preventive: { icon: Shield, color: '#26c6da', label: 'Preventive Screening' },
  budget: { icon: Coin, color: '#ffca28', label: 'Budget / Price Tier' },
  risk: { icon: Warning, color: '#ef5350', label: 'Risk Profile' },
  duration: { icon: Clock, color: '#8d6e63', label: 'Duration / Urgency' },
  mentalHealth: { icon: Heart, color: '#7e57c2', label: 'Mental Health' },
  fitness: { icon: Lightning, color: '#ff7043', label: 'Fitness & Sports' },
  sleep: { icon: Moon, color: '#5c6bc0', label: 'Sleep Health' },
  environmental: { icon: Leaf, color: '#66bb6a', label: 'Environmental / Toxin' },
  vaccination: { icon: Syringe, color: '#42a5f5', label: 'Vaccination & Immunity' },
  preSurgical: { icon: FirstAid, color: '#ef5350', label: 'Pre-Surgical' },
  ethnicity: { icon: Globe, color: '#ab47bc', label: 'Ethnicity / Region' },
  fertility: { icon: Heart, color: '#ec407a', label: 'Fertility & Reproductive' },
};

const packageContent = {
  'liver-health': { benefits: ['Early detection of fatty liver disease', 'Monitor liver enzyme levels', 'Screen for hepatitis B and C', 'Assess bile duct and gallbladder health', 'Track medication effects on liver'], whoShouldTake: ['Regular alcohol consumers', 'People on long-term medications', 'Fatty liver or obesity patients', 'Those with jaundice history', 'Family history of liver disease', 'Annual health checkup'], preparation: 'Fasting for 10-12 hours required. Avoid alcohol for 24 hours before the test.', reportTime: '24-48 hours' },
  'cardiac-care': { benefits: ['Assess heart attack and stroke risk', 'Monitor cholesterol and triglyceride levels', 'Detect silent inflammation in arteries', 'Evaluate heart muscle health', 'Guide lifestyle and medication decisions'], whoShouldTake: ['Age 30+ for baseline screening', 'Family history of heart disease', 'High BP or diabetic patients', 'Smokers or sedentary lifestyle', 'Obesity or metabolic syndrome'], preparation: 'Fasting for 9-12 hours required. Avoid fatty foods day before.', reportTime: '12-24 hours' },
  'kidney-health': { benefits: ['Early detection of kidney damage', 'Monitor diabetic kidney disease', 'Assess electrolyte balance', 'Screen for kidney stones risk', 'Track CKD progression'], whoShouldTake: ['Diabetic patients (annual screening)', 'Hypertension patients', 'Family history of kidney disease', 'People on NSAIDs long-term', 'Routine health checkup'], preparation: 'Fasting for 8 hours recommended. Stay hydrated.', reportTime: '24 hours' },
  'thyroid-care': { benefits: ['Detect hypothyroidism and hyperthyroidism', 'Monitor thyroid medication dosage', 'Screen for autoimmune thyroid disease', 'Assess metabolic health', 'Identify postpartum thyroid issues'], whoShouldTake: ['Women planning pregnancy or postpartum', 'Unexplained weight changes or fatigue', 'Family history of thyroid disease', 'Hair loss or dry skin', 'Irregular periods or fertility issues'], preparation: 'Fasting for 8-10 hours recommended. Continue thyroid medication as usual.', reportTime: '24 hours' },
  'pancreas-health': { benefits: ['Evaluate pancreatic enzyme production', 'Screen for pancreatitis', 'Assess insulin production capacity', 'Monitor cystic fibrosis', 'Detect pancreatic insufficiency'], whoShouldTake: ['Chronic abdominal pain patients', 'Known or suspected pancreatitis', 'Cystic fibrosis patients', 'Unexplained weight loss', 'Diabetes patients for insulin assessment'], preparation: 'Fasting for 10-12 hours required.', reportTime: '24-48 hours' },
  'bone-health': { benefits: ['Assess osteoporosis risk', 'Monitor calcium and vitamin D levels', 'Evaluate bone turnover rate', 'Screen for parathyroid disorders', 'Guide supplementation decisions'], whoShouldTake: ['Postmenopausal women', 'Adults 50+ for bone density risk', 'Those with frequent fractures', 'Vitamin D deficiency patients', 'People on long-term steroids'], preparation: 'Fasting for 8 hours recommended.', reportTime: '24-48 hours' },
  'lungs-respiratory': { benefits: ['Assess respiratory health', 'Screen for TB and other lung infections', 'Evaluate post-COVID lung function', 'Monitor chronic respiratory conditions', 'Detect occupational lung disease'], whoShouldTake: ['Chronic cough or SOB patients', 'Smokers or ex-smokers', 'TB contacts or high-risk individuals', 'Post-COVID recovery patients', 'Occupational lung exposure'], preparation: 'No special preparation required.', reportTime: '24-72 hours' },
  'brain-neurological': { benefits: ['Screen for neurological risk factors', 'Assess neurotransmitter balance', 'Evaluate cognitive health markers', 'Detect vitamin deficiencies affecting brain', 'Monitor brain inflammation'], whoShouldTake: ['Memory concerns or brain fog', 'Family history of neurological disease', 'Chronic stress or burnout', 'Headaches or migraines', 'Mood disorders'], preparation: 'Fasting for 8-10 hours recommended.', reportTime: '24-72 hours' },
  'skin-health': { benefits: ['Identify skin allergy triggers', 'Screen for autoimmune skin conditions', 'Monitor mast cell disorders', 'Assess nutritional status for skin health'], whoShouldTake: ['Chronic skin rashes or hives', 'Suspected food allergies', 'Eczema or psoriasis patients', 'Recurrent angioedema', 'Unexplained itching'], preparation: 'Avoid antihistamines for 72 hours before testing.', reportTime: '5-7 days' },
  'eye-health': { benefits: ['Screen for eye health risk factors', 'Assess nutritional status for vision', 'Detect inflammation affecting eyes', 'Monitor diabetic eye complications'], whoShouldTake: ['Age 40+ for baseline screening', 'Diabetic patients (annual)', 'Family history of eye disease', 'Computer vision syndrome', 'Nutritional concerns for eye health'], preparation: 'Fasting for 8-10 hours recommended.', reportTime: '24-48 hours' },
  'diabetes-care': { benefits: ['Screen for prediabetes and diabetes', 'Monitor blood sugar control (HbA1c)', 'Assess insulin resistance', 'Detect diabetic complications early', 'Guide medication and lifestyle changes'], whoShouldTake: ['Age 35+ for routine screening', 'Overweight or obese individuals', 'Family history of diabetes', 'Women with PCOS or gestational diabetes', 'Known diabetic patients for monitoring'], preparation: 'Fasting for 8-12 hours required. Continue regular medications.', reportTime: '6-24 hours' },
  'hypertension-package': { benefits: ['Assess hypertensive organ damage', 'Monitor cardiac and kidney function', 'Evaluate electrolyte and hormone balance', 'Guide antihypertensive medication', 'Prevent stroke and heart attack'], whoShouldTake: ['Known hypertension patients', 'Family history of high BP', 'Stressful lifestyle', 'Salt-sensitive individuals', 'Obesity or metabolic syndrome'], preparation: 'Fasting for 8-10 hours. Continue BP medications.', reportTime: '24 hours' },
  'cancer-screening': { benefits: ['Early detection when treatment is most effective', 'Monitor known cancer treatment response', 'Screen for recurrence after remission', 'Baseline for high-risk individuals', 'Multi-cancer marker assessment'], whoShouldTake: ['Age 40+ for routine cancer screening', 'Family history of cancer', 'Known cancer patients for monitoring', 'Smokers (lung cancer risk)', 'HPV-positive individuals'], preparation: 'May vary by specific test. Most require no special preparation.', reportTime: '24-72 hours' },
  'hepatitis-package': { benefits: ['Screen for hepatitis B and C infection', 'Monitor liver health in chronic carriers', 'Assess need for vaccination', 'Detect autoimmune hepatitis', 'Guide antiviral treatment'], whoShouldTake: ['Healthcare workers', 'High-risk sexual behavior', 'IV drug users', 'Family history of hepatitis', 'Routine screening for blood donors'], preparation: 'Fasting for 8-10 hours recommended.', reportTime: '24-48 hours' },
  'pcos-package': { benefits: ['Confirm PCOS diagnosis', 'Assess hormonal imbalance severity', 'Screen for metabolic complications', 'Monitor treatment effectiveness', 'Evaluate fertility potential'], whoShouldTake: ['Women with irregular periods', 'Excessive hair growth or acne', 'Unexplained weight gain', 'Infertility concerns', 'Family history of PCOS'], preparation: 'Fasting for 10-12 hours. Schedule day 2-5 of menstrual cycle.', reportTime: '24-48 hours' },
  'hiv-std-package': { benefits: ['Detect STIs early before complications', 'Prevent transmission to partners', 'Monitor HIV viral load and CD4', 'Screen pregnant women to prevent vertical transmission', 'Peace of mind through negative results'], whoShouldTake: ['Sexually active individuals', 'Multiple partners', 'Pregnant women', 'Blood exposure or needle stick', 'Symptoms of STI'], preparation: 'No special preparation required.', reportTime: '24-72 hours' },
  'anemia-package': { benefits: ['Identify type and cause of anemia', 'Differentiate iron vs B12 deficiency', 'Screen for thalassemia trait', 'Assess iron storage levels', 'Monitor treatment effectiveness'], whoShouldTake: ['Chronic fatigue or weakness', 'Women with heavy menstrual bleeding', 'Pregnant women', 'Vegetarians/vegans', 'Those with paleness or dizziness'], preparation: 'Fasting for 10-12 hours required for iron studies.', reportTime: '24 hours' },
  'tb-package': { benefits: ['Detect latent TB infection', 'Confirm active TB disease', 'Monitor TB treatment response', 'Screen high-risk contacts', 'Rule out TB before immunosuppression'], whoShouldTake: ['TB contacts or family members', 'Healthcare workers', 'Immunocompromised patients', 'Unexplained cough > 3 weeks', 'Pre-employment in healthcare'], preparation: 'No special preparation required.', reportTime: '24-72 hours' },
  'arthritis-care': { benefits: ['Differentiate between arthritis types', 'Early diagnosis of autoimmune diseases', 'Monitor disease activity and treatment', 'Screen for lupus, gout, and RA', 'Assess inflammation levels'], whoShouldTake: ['Joint pain or swelling patients', 'Morning stiffness lasting 30+ min', 'Family history of autoimmune disease', 'Unexplained inflammation or fever', 'Skin rashes with joint pain'], preparation: 'Fasting for 8-10 hours recommended for some tests.', reportTime: '24 hours to 7 days' },
  'liver-disease': { benefits: ['Screen for viral hepatitis', 'Fatty liver disease assessment', 'Detect cirrhosis early', 'Monitor liver cancer risk', 'Guide treatment decisions'], whoShouldTake: ['Alcohol consumers', 'Obesity or metabolic syndrome', 'Family history of liver disease', 'Jaundice history', 'Long-term medication users'], preparation: 'Fasting for 10-12 hours required. Avoid alcohol for 24 hours.', reportTime: '24-48 hours' },
  'autoimmune-package': { benefits: ['Screen for multiple autoimmune conditions', 'Identify specific autoantibodies', 'Monitor disease activity', 'Guide immunosuppressive therapy', 'Differentiate autoimmune vs other causes'], whoShouldTake: ['Unexplained chronic symptoms', 'Family history of autoimmune disease', 'Joint pain with other symptoms', 'Recurrent fever of unknown origin', 'Unexplained rashes'], preparation: 'Fasting for 8-10 hours recommended.', reportTime: '48 hours to 7 days' },
  'bleeding-clotting': { benefits: ['Assess bleeding risk before surgery', 'Diagnose clotting disorders', 'Monitor anticoagulant therapy', 'Screen for thrombophilia', 'Evaluate unexplained bruising'], whoShouldTake: ['Pre-surgical patients', 'Unexplained bruising or bleeding', 'Family history of clotting disorders', 'DVT or PE patients', 'Patients on blood thinners'], preparation: 'Most tests require no special preparation.', reportTime: '24-48 hours' },
  'metabolic-package': { benefits: ['Screen for metabolic syndrome', 'Assess diabetes and heart disease risk', 'Evaluate liver and kidney function', 'Monitor weight-related health markers', 'Guide lifestyle modification'], whoShouldTake: ['Overweight or obese individuals', 'Sedentary lifestyle', 'Family history of metabolic disease', 'High BP or cholesterol patients', 'Annual health checkup'], preparation: 'Fasting for 10-12 hours required.', reportTime: '24-48 hours' },
  'hormone-health': { benefits: ['Identify hormonal imbalances', 'Assess adrenal and pituitary function', 'Evaluate reproductive health', 'Screen for thyroid and sex hormone issues', 'Guide hormone replacement therapy'], whoShouldTake: ['Unexplained weight changes or fatigue', 'Irregular periods or PCOS', 'Low libido or erectile dysfunction', 'Infertility concerns', 'Mood swings or sleep issues'], preparation: 'Fasting for 8 hours. Morning collection (6-9 AM) preferred for cortisol.', reportTime: '24-48 hours' },
  'nutritional-deficiency': { benefits: ['Comprehensive vitamin and mineral assessment', 'Detect subclinical deficiencies early', 'Guide targeted supplementation', 'Prevent deficiency-related complications', 'Monitor nutritional therapy progress'], whoShouldTake: ['Vegetarians and vegans', 'Chronic dieting or restrictive eating', 'GI disorders affecting absorption', 'Chronic fatigue or weakness', 'Elderly or pregnant individuals'], preparation: 'Fasting for 10-12 hours required.', reportTime: '24-72 hours' },
  'newborn-screening': { benefits: ['Early detection of congenital disorders', 'Prevent irreversible damage through early intervention', 'Screen for metabolic and genetic conditions', 'Assess thyroid function at birth', 'Detect G6PD deficiency'], whoShouldTake: ['All newborns (recommended at birth)', 'High-risk pregnancies', 'Family history of genetic disorders'], preparation: 'Sample collected shortly after birth.', reportTime: '24-48 hours' },
  'pediatric-package': { benefits: ['Monitor growth and development', 'Detect nutritional deficiencies early', 'Screen for common childhood conditions', 'Assess immunity and infection status', 'Establish baseline health markers'], whoShouldTake: ['Children aged 1-12 years', 'Frequent or recurrent infections', 'Growth concerns', 'Dietary concerns or picky eating', 'School entry requirement'], preparation: 'Fasting may be required for some tests. Consult your pediatrician.', reportTime: '24 hours' },
  'adolescent-health': { benefits: ['Monitor puberty and hormonal changes', 'Screen for nutritional deficiencies', 'Assess lifestyle risk factors', 'Detect early metabolic issues', 'Mental health screening support'], whoShouldTake: ['Adolescents aged 13-17', 'Concerns about growth or puberty', 'Academic stress or sleep issues', 'Screen time or lifestyle concerns', 'Family history of early disease'], preparation: 'Fasting for 10-12 hours required.', reportTime: '24 hours' },
  'adult-wellness': { benefits: ['Baseline health assessment', 'Detect silent conditions early', 'Establish health benchmarks', 'Screen for lifestyle diseases', 'Guide preventive care decisions'], whoShouldTake: ['Young adults aged 25-40', 'First-time health checkup', 'New job or insurance requirement', 'Family history of early disease', 'Health-conscious individuals'], preparation: 'Fasting for 10-12 hours required.', reportTime: '24 hours' },
  'midlife-health': { benefits: ['Screen for age-related diseases', 'Assess cardiac and diabetes risk', 'Detect early cancer markers', 'Monitor hormonal changes', 'Evaluate bone health'], whoShouldTake: ['Adults 40-60 years', 'Annual health checkup seekers', 'Family history of chronic disease', 'Sedentary or stressed lifestyle', 'Perimenopausal women'], preparation: 'Fasting for 10-12 hours required.', reportTime: '24-48 hours' },
  'senior-citizen': { benefits: ['Complete age-appropriate health screening', 'Detect age-related diseases early', 'Monitor chronic conditions', 'Assess medication effects on organs', 'Track health trends year over year'], whoShouldTake: ['All adults aged 60+', 'Those with multiple health conditions', 'Patients on long-term medications', 'Reduced mobility or independence concerns'], preparation: 'Fasting for 10-12 hours required. Continue regular medications.', reportTime: '24-48 hours' },
  'womens-health': { benefits: ['Complete reproductive health assessment', 'Screen for breast and cervical cancer', 'Evaluate hormone balance', 'Monitor bone health', 'Check thyroid and iron status'], whoShouldTake: ['All women aged 18+', 'Women planning pregnancy', 'Perimenopausal or menopausal women', 'PCOS or irregular periods', 'Family history of breast or ovarian cancer'], preparation: 'Fasting for 10-12 hours. Schedule day 2-5 of menstrual cycle for hormone tests.', reportTime: '24-48 hours' },
  'mens-health': { benefits: ['Prostate health screening', 'Cardiac risk assessment', 'Testosterone level evaluation', 'Diabetes and metabolic screening', 'Liver and kidney function check'], whoShouldTake: ['Men aged 30+', 'Family history of prostate cancer', 'Low libido or erectile dysfunction', 'Sedentary or high-stress lifestyle', 'Annual health checkup'], preparation: 'Fasting for 10-12 hours. Avoid ejaculation for 48 hours before PSA test.', reportTime: '24-48 hours' },
  'transgender-health': { benefits: ['Monitor hormone therapy levels', 'Assess organ function during transition', 'Screen for gender-specific cancer risks', 'Evaluate metabolic health', 'Track therapy-related changes'], whoShouldTake: ['Transgender individuals on hormone therapy', 'Pre-transition baseline assessment', 'Annual monitoring during transition', 'Those with specific health concerns'], preparation: 'Fasting for 10-12 hours. Continue hormone therapy as prescribed.', reportTime: '24-48 hours' },
  'corporate-wellness': { benefits: ['Stress and burnout risk assessment', 'Cardiac health evaluation', 'Diabetes and metabolic screening', 'Vitamin deficiency detection', 'Annual employee health compliance'], whoShouldTake: ['Corporate employees', 'High-stress professionals', 'Desk job workers', 'Shift workers', 'Annual corporate health camps'], preparation: 'Fasting for 10-12 hours required.', reportTime: '24-48 hours' },
  'smoker-package': { benefits: ['Assess lung damage from smoking', 'Screen for lung cancer early', 'Evaluate cardiac risk', 'Detect vitamin deficiencies', 'Monitor smoking cessation progress'], whoShouldTake: ['Current smokers', 'Former long-term smokers', 'Passive/second-hand smoke exposure', 'Chronic cough or breathlessness', 'Family history of lung cancer'], preparation: 'Fasting for 8-10 hours recommended.', reportTime: '24-48 hours' },
  'alcohol-health': { benefits: ['Assess liver damage from alcohol', 'Screen for nutritional deficiencies', 'Evaluate pancreatitis risk', 'Monitor alcohol-related organ damage', 'Guide recovery and treatment'], whoShouldTake: ['Regular alcohol consumers', 'Binge drinkers', 'Recovery and rehabilitation patients', 'Those with elevated liver enzymes', 'Family history of liver disease'], preparation: 'Fasting for 10-12 hours. Avoid alcohol for 24-48 hours before testing.', reportTime: '24-48 hours' },
  'fitness-sports': { benefits: ['Optimize training and recovery', 'Assess muscle and joint health', 'Monitor iron and vitamin status', 'Evaluate hormonal balance', 'Screen for overtraining markers'], whoShouldTake: ['Athletes and sports persons', 'Gym and fitness enthusiasts', 'Marathon and endurance runners', 'Those starting a new fitness program', 'Unexplained fatigue during training'], preparation: 'Fasting for 8-10 hours. Avoid intense exercise for 24 hours before.', reportTime: '24-48 hours' },
  'sedentary-lifestyle': { benefits: ['Screen for metabolic syndrome', 'Assess cardiac risk', 'Detect early diabetes', 'Evaluate vitamin deficiencies', 'Guide lifestyle modification program'], whoShouldTake: ['Desk job workers', 'Low physical activity individuals', 'Obesity or overweight', 'Screen time over 8 hours/day', 'No regular exercise routine'], preparation: 'Fasting for 10-12 hours required.', reportTime: '24 hours' },
  'vegan-wellness': { benefits: ['Detect B12 and iron deficiencies early', 'Monitor bone health on plant-based diet', 'Assess protein and amino acid status', 'Check zinc and iodine levels', 'Guide supplementation decisions'], whoShouldTake: ['Long-term vegans and vegetarians', 'New plant-based diet adopters', 'Those experiencing fatigue on vegan diet', 'Pregnant vegetarians/vegans', 'Growing children on plant-based diet'], preparation: 'Fasting for 10-12 hours required.', reportTime: '24-48 hours' },
  'premarital-package': { benefits: ['Screen for genetic compatibility', 'Detect infectious diseases', 'Assess overall reproductive health', 'Provide health baseline for couples', 'Prevent vertical disease transmission'], whoShouldTake: ['Couples planning marriage', 'Pre-conception health awareness', 'Those seeking genetic counseling'], preparation: 'Fasting for 10-12 hours required for some tests.', reportTime: '24-72 hours' },
  'preconception-package': { benefits: ['Optimize fertility before pregnancy', 'Screen for genetic disorders', 'Assess nutritional status', 'Detect reproductive infections', 'Ensure healthy pregnancy outcomes'], whoShouldTake: ['Couples planning pregnancy', 'Fertility concerns', 'Previous pregnancy complications', 'Family history of genetic disorders', 'Advanced maternal age'], preparation: 'Fasting for 10-12 hours. Schedule female hormone tests on day 2-5 of cycle.', reportTime: '24-72 hours' },
  'pregnancy-package': { benefits: ['Monitor maternal and fetal health', 'Screen for pregnancy complications', 'Detect gestational diabetes', 'Assess nutritional needs during pregnancy', 'Screen for vertical infections'], whoShouldTake: ['All pregnant women', 'First trimester booking', 'High-risk pregnancies', 'Previous pregnancy complications', 'Advanced maternal age'], preparation: 'Most tests require no special preparation. Consult your OB/GYN.', reportTime: '24-48 hours' },
  'postpartum-package': { benefits: ['Monitor postpartum recovery', 'Assess hormonal balance after delivery', 'Screen for postpartum thyroiditis', 'Evaluate nutritional depletion', 'Detect postpartum depression risk factors'], whoShouldTake: ['Post-delivery mothers (6 weeks+)', 'Breastfeeding women', 'Postpartum fatigue or mood changes', 'Those with thyroid concerns', 'Post-cesarean recovery'], preparation: 'Fasting for 8-10 hours recommended.', reportTime: '24-48 hours' },
  'menopause-package': { benefits: ['Assess hormone levels during menopause', 'Screen for osteoporosis risk', 'Evaluate cardiac risk', 'Monitor thyroid and metabolic changes', 'Guide hormone replacement therapy'], whoShouldTake: ['Perimenopausal women (40-50)', 'Menopausal women (50+)', 'Those with menopause symptoms', 'Early menopause or surgical menopause', 'Concerns about bone or heart health'], preparation: 'Fasting for 10-12 hours.', reportTime: '24-48 hours' },
  'andropause-package': { benefits: ['Assess age-related hormone decline', 'Evaluate testosterone deficiency', 'Screen for prostate health', 'Monitor metabolic syndrome risk', 'Guide hormone replacement decisions'], whoShouldTake: ['Men aged 45+', 'Low libido or erectile dysfunction', 'Decreased muscle mass or strength', 'Fatigue or depression', 'Sleep disturbances'], preparation: 'Fasting for 10-12 hours. Morning collection preferred for testosterone.', reportTime: '24-48 hours' },
  'fever-panel': { benefits: ['Identify cause of fever rapidly', 'Differentiate viral from bacterial infection', 'Screen for tropical diseases', 'Guide targeted antibiotic therapy', 'Prevent complications of untreated infection'], whoShouldTake: ['Persistent fever > 3 days', 'High-grade fever with chills', 'Travel to endemic areas', 'Fever with rash or joint pain', 'Hospitalized patients with fever'], preparation: 'No special preparation for most tests.', reportTime: '6-48 hours' },
  'fatigue-panel': { benefits: ['Identify underlying cause of chronic fatigue', 'Screen for anemia and iron deficiency', 'Assess thyroid and adrenal function', 'Detect vitamin and mineral deficiencies', 'Rule out serious conditions like diabetes'], whoShouldTake: ['Chronic fatigue lasting > 2 weeks', 'Unexplained tiredness or weakness', 'Brain fog or poor concentration', 'Poor sleep quality', 'Post-illness recovery'], preparation: 'Fasting for 10-12 hours.', reportTime: '24-48 hours' },
  'hair-loss-package': { benefits: ['Identify cause of hair thinning or loss', 'Assess hormonal balance', 'Detect nutritional deficiencies', 'Screen for thyroid disorders', 'Guide effective treatment plan'], whoShouldTake: ['Significant hair thinning or shedding', 'With or receding hairline', 'Patchy hair loss (alopecia)', 'Women with postpartum hair loss', 'Those unresponsive to topical treatments'], preparation: 'Fasting for 10-12 hours. Morning collection preferred.', reportTime: '24-48 hours' },
  'joint-pain-package': { benefits: ['Differentiate between arthritis types', 'Screen for autoimmune causes', 'Assess inflammation severity', 'Detect gout or pseudogout', 'Guide appropriate treatment'], whoShouldTake: ['Joint pain or stiffness', 'Morning stiffness > 30 min', 'Joint swelling or redness', 'Family history of arthritis', 'Unexplained joint symptoms'], preparation: 'Fasting for 10-12 hours required for some tests.', reportTime: '24 hours to 7 days' },
  'weight-loss-package': { benefits: ['Identify cause of unintentional weight loss', 'Screen for diabetes and thyroid disorders', 'Detect malabsorption issues', 'Rule out infections or cancer', 'Assess nutritional status'], whoShouldTake: ['Unexplained weight loss > 5% in 6 months', 'Loss of appetite', 'Chronic diarrhea or GI symptoms', 'Fatigue with weight loss', 'Elderly with weight concerns'], preparation: 'Fasting for 10-12 hours required.', reportTime: '24-72 hours' },
  'pre-employment': { benefits: ['Fitness for work assessment', 'Screen for communicable diseases', 'Baseline health documentation', 'Comply with employer requirements', 'Identify pre-existing conditions'], whoShouldTake: ['New job applicants', 'Healthcare workers', 'Food handling positions', 'Safety-sensitive positions', 'Corporate onboarding'], preparation: 'Fasting for 8-10 hours recommended.', reportTime: '24-48 hours' },
  'travel-visa': { benefits: ['Meet visa medical requirements', 'Screen for communicable diseases', 'Document health status', 'Immunization titer verification'], whoShouldTake: ['Immigration visa applicants', 'Student visa applicants', 'Work visa applicants', 'Travelers to high-risk countries'], preparation: 'Fasting for 8 hours recommended.', reportTime: '24-72 hours' },
  'sports-clearance': { benefits: ['Assess fitness for competitive sports', 'Screen for cardiac risks', 'Evaluate musculoskeletal health', 'Baseline for injury monitoring', 'Meet sports governing body requirements'], whoShouldTake: ['Competitive athletes', 'School and college sports participants', 'Professional sports contracts', 'Marathon and event participants'], preparation: 'Fasting for 8-10 hours. Avoid exercise 12 hours before.', reportTime: '24 hours' },
  'hospital-admission': { benefits: ['Pre-admission health assessment', 'Surgical risk evaluation', 'Screen for hospital infections', 'Baseline for hospital care', 'Medication safety check'], whoShouldTake: ['Elective surgery patients', 'Planned hospital admissions', 'Pre-procedure workup', 'Day surgery patients'], preparation: 'Fasting as advised by surgeon. Typically 8-10 hours.', reportTime: '6-24 hours' },
  'govt-scheme': { benefits: ['Meet government scheme requirements', 'Cover essential health screening', 'Affordable preventive care', 'Document health for scheme eligibility', 'Referral for further care if needed'], whoShouldTake: ['Ayushman Bharat beneficiaries', 'Government health card holders', 'Public health scheme members', 'Below poverty line individuals'], preparation: 'Fasting for 10-12 hours required.', reportTime: '24-48 hours' },
  'warfarin-monitoring': { benefits: ['Prevent bleeding complications', 'Ensure therapeutic anticoagulation', 'Monitor INR stability', 'Adjust warfarin dosage safely', 'Prevent stroke and DVT recurrence'], whoShouldTake: ['Patients on warfarin therapy', 'Mechanical heart valve patients', 'DVT or PE history', 'Atrial fibrillation patients', 'Antiphospholipid syndrome'], preparation: 'No special preparation. Continue warfarin as prescribed.', reportTime: 'Same day' },
  'diabetes-med-monitoring': { benefits: ['Monitor diabetes medication effectiveness', 'Adjust medication doses safely', 'Prevent hypoglycemic episodes', 'Detect medication side effects early', 'Optimize long-term glucose control'], whoShouldTake: ['Type 1 and Type 2 diabetics', 'Patients starting new diabetes meds', 'Poorly controlled diabetes', 'Patients on insulin therapy'], preparation: 'Continue medications as prescribed. Note time of last dose for testing.', reportTime: '6-24 hours' },
  'thyroid-med-monitoring': { benefits: ['Optimize thyroid medication dose', 'Detect under or over-treatment', 'Monitor for medication side effects', 'Achieve euthyroid state', 'Improve quality of life'], whoShouldTake: ['Patients on levothyroxine', 'Hyperthyroid patients on medication', 'Post-thyroidectomy patients', 'Radioactive iodine treatment patients'], preparation: 'Continue medication as prescribed. Morning test before or 4 hours after dose.', reportTime: '24 hours' },
  'antiepileptic-monitoring': { benefits: ['Monitor anticonvulsant drug levels', 'Prevent toxic side effects', 'Ensure seizure control', 'Adjust dosage for optimal effect', 'Monitor liver and kidney function on AEDs'], whoShouldTake: ['Patients on anticonvulsant therapy', 'New AED starts or dosage changes', 'Uncontrolled seizures', 'Pregnancy with epilepsy'], preparation: 'Continue medications as prescribed. Record time of last dose.', reportTime: '24-48 hours' },
  'lithium-monitoring': { benefits: ['Monitor lithium levels for safety', 'Prevent lithium toxicity', 'Assess kidney function on lithium', 'Monitor thyroid function', 'Adjust dosage for mood stability'], whoShouldTake: ['Patients on lithium therapy', 'Bipolar disorder patients', 'New lithium starts', 'Dosage adjustments', 'Annual monitoring'], preparation: 'Take morning lithium dose as prescribed. Test 12 hours after last dose.', reportTime: '24 hours' },
  'family-cardiac-risk': { benefits: ['Assess inherited cardiac risk', 'Enable early prevention strategies', 'Monitor cholesterol levels closely', 'Guide lifestyle modifications', 'Determine need for statin therapy'], whoShouldTake: ['Family history of early heart attack', 'Family history of high cholesterol', 'Sudden cardiac death in family', 'Multiple family members with heart disease'], preparation: 'Fasting for 10-12 hours required.', reportTime: '24-48 hours' },
  'family-cancer-risk': { benefits: ['Enable early cancer detection', 'Identify hereditary cancer syndromes', 'Guide screening frequency', 'Determine need for genetic testing', 'Provide peace of mind through surveillance'], whoShouldTake: ['Multiple family members with cancer', 'Early onset cancer in family', 'Known BRCA or other mutation carriers', 'Breast, ovarian, or colon cancer history'], preparation: 'Most tests require no special preparation.', reportTime: '24-72 hours' },
  'family-diabetes-risk': { benefits: ['Assess diabetes predisposition', 'Enable early lifestyle interventions', 'Monitor prediabetes progression', 'Prevent or delay diabetes onset', 'Guide diet and exercise programs'], whoShouldTake: ['Parents or siblings with diabetes', 'Gestational diabetes history', 'High-risk ethnic background', 'Overweight with family history'], preparation: 'Fasting for 10-12 hours required.', reportTime: '6-24 hours' },
  'genetic-health-screening': { benefits: ['Identify carrier status for genetic disorders', 'Screen for hereditary conditions', 'Enable informed family planning', 'Guide preventive health decisions', 'Detect inherited thrombophilia risk'], whoShouldTake: ['Family history of genetic disorders', 'Consanguineous couples', 'Pre-conception planning', 'Unexplained blood clots', 'Anemia or hemoglobin disorders'], preparation: 'No special preparation required.', reportTime: '5-7 days' },
  'monsoon-package': { benefits: ['Early detection of monsoon illnesses', 'Differential diagnosis of fever', 'Screen for vector-borne diseases', 'Monitor complications like thrombocytopenia', 'Guide appropriate treatment promptly'], whoShouldTake: ['Fever during monsoon season', 'Travel to endemic areas in monsoon', 'Stagnant water exposure', 'Mosquito bite history', 'Community outbreak situations'], preparation: 'No special preparation for most tests.', reportTime: '6-48 hours' },
  'winter-package': { benefits: ['Screen for seasonal respiratory infections', 'Assess vitamin D status in low-sun months', 'Monitor immune function', 'Detect flu and RSV early', 'Manage winter-related health issues'], whoShouldTake: ['Frequent winter illnesses', 'Elderly during winter months', 'Children in school settings', 'Asthma or COPD patients', 'Vitamin D deficiency concerns in winter'], preparation: 'No special preparation required.', reportTime: '6-48 hours' },
  'summer-package': { benefits: ['Assess hydration status in heat', 'Screen for GI infections common in summer', 'Monitor electrolyte balance', 'Detect early dehydration markers', 'Prevent heat-related complications'], whoShouldTake: ['Outdoor workers in summer', 'Elderly during heat waves', 'Athletes training in summer', 'Children playing outdoors', 'GI symptoms during summer'], preparation: 'Fasting for 8 hours recommended.', reportTime: '6-24 hours' },
};

const PackageDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const allPackages = window.__packagesByAxis ? Object.values(window.__packagesByAxis).flat() : [];
  const pkg = allPackages.find(p => p.slug === slug) || null;
  const tests = window.__allTests || [];
  const content = packageContent[slug] || {};
  const meta = axisMeta[pkg?.axis] || {};
  const Icon = meta.icon || Heartbeat;
  const [inCart, setInCart] = useState({});

  if (!pkg) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-light)', fontSize: 14 }}>
        Package not found. <span style={{ color: '#0F5DA8', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/health-packages')}>View all packages</span>
      </div>
    );
  }

  const pkgTests = tests.filter(t => pkg.testIds.includes(t.id));

  const addAllToCart = () => {
    pkgTests.forEach(t => {
      const key = `cart_${t.id}`;
      if (!inCart[key]) {
        const event = new CustomEvent('add-to-cart', { detail: t });
        window.dispatchEvent(event);
      }
    });
    setInCart(Object.fromEntries(pkgTests.map(t => [`cart_${t.id}`, true])));
    navigate('/diagnostics?showCart=true');
  };

  const shareWhatsApp = () => {
    const msg = `*${pkg.name}* - Jeevan HealthCare\n\n${pkg.desc}\n\n${pkg.testCount} Tests | ₹${pkg.bundlePrice} (Save ₹${pkg.savings})\n\nBook now: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="page-container">
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '16px' }}>
        <button onClick={() => navigate('/health-packages')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0, marginBottom: 16 }}>
          <CaretLeft size={16} /> Back to all packages
        </button>

        <div style={{ background: `linear-gradient(135deg, ${meta.color}15, ${meta.color}08)`, borderRadius: 16, padding: 24, marginBottom: 20, border: `1px solid ${meta.color}30` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: meta.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={28} weight="fill" color={meta.color} />
            </div>
            <div>
              <h1 style={{ fontSize: 22, margin: 0 }}>{pkg.name}</h1>
              <span style={{ fontSize: 12, color: meta.color, fontWeight: 600 }}>{meta.label}</span>
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-body)', lineHeight: 1.6, marginBottom: 14 }}>{pkg.desc}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, fontSize: 13, marginBottom: 14 }}>
            <div><span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 24 }}>₹{pkg.bundlePrice.toLocaleString()}</span> <span style={{ textDecoration: 'line-through', color: 'var(--text-light)', fontSize: 14 }}>₹{pkg.totalMrp.toLocaleString()}</span></div>
            <div><span style={{ color: '#22C55E', fontWeight: 600 }}>Save ₹{pkg.savings.toLocaleString()}</span> <span style={{ background: 'linear-gradient(135deg, #22C55E, #16a34a)', color: '#fff', padding: '1px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{pkg.discountPct}% off</span></div>
            <div style={{ color: 'var(--text-light)' }}>{pkg.testCount} Tests</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={addAllToCart}
              style={{ flex: 1, padding: '12px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, background: 'linear-gradient(135deg, #FF8A00, #FF4D6D)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Plus size={18} weight="bold" /> Add All to Cart — ₹{pkg.bundlePrice}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button onClick={shareWhatsApp} style={{ flex: 1, padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: '#25D366', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <WhatsappLogo size={16} weight="fill" /> Share
          </button>
          <button onClick={shareFacebook} style={{ flex: 1, padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: '#1877F2', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <FacebookLogo size={16} weight="fill" /> Share
          </button>
          <button onClick={copyLink} style={{ flex: 1, padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: '#f5f5f5', color: 'var(--text-dark)', border: '1px solid #ddd', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Copy size={16} /> Copy Link
          </button>
        </div>

        {pkgTests.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Drop size={18} color="#0F5DA8" /> Included Tests ({pkg.testCount})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {pkgTests.map(t => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8f9fa', borderRadius: 8, fontSize: 13 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle size={14} color="#22C55E" weight="fill" />
                    <span style={{ fontWeight: 500, color: 'var(--text-dark)' }}>{t.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-light)' }}>{t.subcategory}</span>
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>₹{t.offerPrice || t.price}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#e8f5e9', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
              <span>Total if booked individually</span>
              <span style={{ textDecoration: 'line-through', color: 'var(--text-light)' }}>₹{pkg.totalMrp.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#fff8e1', borderRadius: 8, fontSize: 14, fontWeight: 700, marginTop: 4 }}>
              <span>Package Price</span>
              <span style={{ color: '#e65100' }}>₹{pkg.bundlePrice.toLocaleString()}</span>
            </div>
          </div>
        )}

        {content.benefits && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Heartbeat size={18} color="#22C55E" /> Benefits
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 13 }}>
              {content.benefits.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#22C55E', fontWeight: 700 }}>✓</span>
                  <span style={{ color: 'var(--text-body)' }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {content.whoShouldTake && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={18} color="#0F5DA8" /> Who Should Take This Package
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13 }}>
              {content.whoShouldTake.map((w, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0F5DA8', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-body)' }}>{w}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {content.preparation && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={18} color="#e65100" /> Preparation
            </h2>
            <div style={{ background: '#fff8e1', padding: '12px 16px', borderRadius: 8, fontSize: 13, lineHeight: 1.6 }}>
              {content.preparation}
            </div>
          </div>
        )}

        {content.reportTime && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={18} color="#1565c0" /> Report Time
            </h2>
            <div style={{ background: '#e3f2fd', padding: '12px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#1565c0' }}>
              {content.reportTime}
            </div>
          </div>
        )}

        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8, position: 'sticky', bottom: 12, background: '#fff', padding: '12px 0' }}>
          <button onClick={addAllToCart}
            style={{ width: '100%', padding: '14px', borderRadius: 10, fontSize: 15, fontWeight: 700, background: 'linear-gradient(135deg, #FF8A00, #FF4D6D)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            Book Now — ₹{pkg.bundlePrice}
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={shareWhatsApp} style={{ flex: 1, padding: '10px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: '#25D366', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <WhatsappLogo size={16} weight="fill" /> Share
            </button>
            <button onClick={() => navigate('/health-packages')} style={{ flex: 1, padding: '10px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: '#fff', color: '#0F5DA8', border: '1px solid #0F5DA8', cursor: 'pointer', fontFamily: 'inherit' }}>
              View All Packages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
