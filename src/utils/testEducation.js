const bloodSample = 'Blood sample collected by a certified phlebotomist from a vein in your arm';
const homeCollection = 'Yes, our trained phlebotomist visits your home at your scheduled time. Available in all major cities.';

const categoryPatterns = {
  Hematology: {
    gender: 'Men & Women',
    age: 'All age groups — from infants to elderly',
    whatIs: t => `${t.name || 'This test'} evaluates key components of your blood including red blood cells, white blood cells, hemoglobin, and platelets to assess overall blood health.`,
    whyDone: t => `To screen for anaemia, infection, clotting disorders, and other blood-related conditions. It's one of the most commonly ordered routine tests.`,
    whoNeeds: ['Anyone during a routine health checkup', 'People experiencing fatigue, weakness, or paleness', 'Pre-surgery assessment', 'Patients on medications that affect blood counts', 'Monitoring chronic conditions like kidney disease'],
    whatMeasures: ['Hemoglobin — oxygen-carrying capacity', 'Red Blood Cells (RBC) — blood count', 'White Blood Cells (WBC) — immune status', 'Platelets — clotting ability'],
    organsChecked: ['Bone marrow (blood cell production)', 'Spleen (blood filtration)', 'Immune system'],
    diseasesDetected: ['Anaemia (iron deficiency, B12 deficiency)', 'Infections (bacterial/viral)', 'Leukemia and blood cancers', 'Clotting disorders', 'Thalassemia trait'],
  },
  Diabetes: {
    gender: 'Men & Women (Gestational variants for pregnant women)',
    age: 'Adults 35+ for screening; all ages if symptomatic or at risk',
    whatIs: t => `${t.name || 'This test'} measures your blood sugar levels to evaluate how well your body processes glucose and to screen for diabetes.`,
    whyDone: t => `To diagnose diabetes or prediabetes, monitor blood sugar control, and prevent complications like nerve damage, kidney disease, and heart problems.`,
    whoNeeds: ['Anyone 35+ years old (routine screening)', 'Overweight or obese individuals', 'Family history of diabetes', 'Women with PCOS or gestational diabetes history', 'Known diabetic patients for monitoring'],
    whatMeasures: t => {
      if (/HbA1c|A1c/i.test(t.name)) return ['Glycated hemoglobin (average 2-3 month blood sugar)'];
      if (/Fasting/i.test(t.name)) return ['Fasting blood glucose level'];
      if (/PP/i.test(t.name) || /Postprandial/i.test(t.name)) return ['Post-meal blood glucose response'];
      if (/OGTT|GTT|Glucose Tolerance/i.test(t.name)) return ['Blood glucose response over 2-3 hours after glucose load'];
      return ['Blood glucose levels'];
    },
    organsChecked: ['Pancreas (insulin production)', 'Liver (glucose metabolism)'],
    diseasesDetected: ['Type 1 Diabetes', 'Type 2 Diabetes', 'Prediabetes', 'Gestational Diabetes', 'Insulin Resistance'],
  },
  Thyroid: {
    gender: 'Women more commonly affected; recommended for both genders',
    age: 'Adults 18+ for routine screening; all ages if symptomatic',
    whatIs: t => `${t.name || 'This test'} measures thyroid hormone levels in your blood to evaluate how well your thyroid gland is functioning.`,
    whyDone: t => `To screen for thyroid disorders like hypothyroidism (underactive thyroid), hyperthyroidism (overactive thyroid), and autoimmune thyroid conditions.`,
    whoNeeds: ['Anyone with unexplained weight changes, fatigue, or mood swings', 'Women planning pregnancy or postpartum', 'People with family history of thyroid disease', 'Patients on thyroid medication for dose monitoring', 'Annual health checkups (especially women)'],
    whatMeasures: t => {
      if (/TSH/i.test(t.name)) return ['TSH — Thyroid Stimulating Hormone (pituitary signal to thyroid)'];
      if (/Free T3|FT3/i.test(t.name)) return ['Free T3 — active thyroid hormone'];
      if (/Free T4|FT4/i.test(t.name)) return ['Free T4 — primary thyroid hormone produced by gland'];
      if (/TPO|Antibody/i.test(t.name)) return ['Anti-thyroid peroxidase antibodies (autoimmune marker)'];
      if (/T3.*T4.*TSH|Profile/i.test(t.name)) return ['TSH, T3, and T4 levels for complete thyroid assessment'];
      return ['Thyroid hormone levels'];
    },
    organsChecked: ['Thyroid gland', 'Pituitary gland (TSH regulation)'],
    diseasesDetected: ['Hypothyroidism (low thyroid function)', 'Hyperthyroidism (excess thyroid function)', 'Hashimoto\'s thyroiditis (autoimmune)', 'Graves\' disease', 'Thyroid nodules / goiter'],
  },
  Cardiac: {
    gender: 'Men & Women',
    age: 'Adults 30+ for baseline screening; earlier if risk factors present',
    whatIs: t => `${t.name || 'This test'} evaluates your heart health and cardiovascular risk by measuring key markers in your blood.`,
    whyDone: t => `To assess your risk of heart disease, stroke, and other cardiovascular conditions by measuring cholesterol, triglycerides, and other cardiac markers.`,
    whoNeeds: ['Anyone 30+ years for baseline screening', 'Family history of heart disease', 'High BP, diabetes, or obesity', 'Smokers and sedentary individuals', 'Known heart patients for monitoring'],
    whatMeasures: t => {
      if (/Lipid/i.test(t.name)) return ['Total Cholesterol', 'HDL (good cholesterol)', 'LDL (bad cholesterol)', 'Triglycerides'];
      if (/Cholesterol/i.test(t.name)) return ['Total cholesterol levels'];
      if (/hs-CRP|CRP/i.test(t.name)) return ['High-sensitivity C-reactive protein (inflammation marker)'];
      if (/Troponin/i.test(t.name)) return ['Troponin I or T (heart muscle damage marker)'];
      if (/NT-proBNP|BNP/i.test(t.name)) return ['NT-proBNP (heart failure marker)'];
      if (/Homocysteine/i.test(t.name)) return ['Homocysteine levels (heart disease risk marker)'];
      if (/Apo|Apolipoprotein/i.test(t.name)) return ['Apolipoprotein A1 and B (advanced heart risk markers)'];
      if (/Lp\(a\)|Lipoprotein.*a/i.test(t.name)) return ['Lipoprotein(a) — genetic heart disease risk factor'];
      if (/CK-MB/i.test(t.name)) return ['CK-MB isoenzyme (heart muscle damage)'];
      return ['Cardiac health markers'];
    },
    organsChecked: ['Heart', 'Blood vessels (arteries and veins)', 'Liver (cholesterol production)'],
    diseasesDetected: ['High cholesterol / hyperlipidemia', 'Coronary artery disease', 'Heart attack risk', 'Heart failure', 'Atherosclerosis'],
  },
  Liver: {
    gender: 'Men & Women',
    age: 'Adults 18+; children if clinically indicated',
    whatIs: t => `${t.name || 'This test'} assesses your liver function by measuring enzymes, proteins, and other substances produced or processed by the liver.`,
    whyDone: t => `To screen for liver damage, hepatitis, fatty liver, and monitor liver function in patients on certain medications or with liver conditions.`,
    whoNeeds: ['People with jaundice or yellowing of skin/eyes', 'Heavy alcohol consumers', 'Patients on medications that affect the liver', 'Those with fatty liver or hepatitis', 'Annual health checkup'],
    whatMeasures: t => {
      if (/LFT|Function/i.test(t.name)) return ['SGPT/ALT and SGOT/AST (liver enzymes)', 'ALP (bile duct enzyme)', 'GGT (alcohol/liver damage marker)', 'Total Bilirubin', 'Total Protein, Albumin'];
      if (/Bilirubin/i.test(t.name)) return ['Bilirubin levels (direct and indirect)'];
      if (/SGPT|ALT/i.test(t.name)) return ['Alanine aminotransferase (SGPT) — liver cell injury marker'];
      if (/SGOT|AST/i.test(t.name)) return ['Aspartate aminotransferase (SGOT) — liver/heart/muscle injury marker'];
      if (/GGT|Gamma/i.test(t.name)) return ['Gamma-glutamyl transferase (GGT) — bile duct/liver damage'];
      if (/ALP|Alkaline/i.test(t.name)) return ['Alkaline Phosphatase — bile duct and bone marker'];
      return ['Liver enzyme and function markers'];
    },
    organsChecked: ['Liver', 'Gallbladder and bile ducts', 'Pancreas (secondary)'],
    diseasesDetected: ['Hepatitis (viral/alcoholic)', 'Fatty liver disease (NAFLD)', 'Cirrhosis (liver scarring)', 'Bile duct obstruction', 'Liver cancer'],
  },
  Kidney: {
    gender: 'Men & Women',
    age: 'Adults 18+; earlier if diabetic or hypertensive',
    whatIs: t => `${t.name || 'This test'} evaluates how well your kidneys are filtering waste products from your blood and maintaining electrolyte balance.`,
    whyDone: t => `To screen for kidney disease, monitor known kidney conditions, and check for complications of diabetes and high blood pressure that affect the kidneys.`,
    whoNeeds: ['Diabetic patients (annual screening)', 'Hypertension patients', 'Family history of kidney disease', 'Patients on medications affecting kidneys', 'Routine health checkup'],
    whatMeasures: t => {
      if (/KFT|Kidney Function|Renal/i.test(t.name)) return ['Serum Creatinine', 'Blood Urea / BUN', 'Uric Acid', 'Electrolytes (Sodium, Potassium, Chloride)'];
      if (/Creatinine/i.test(t.name)) return ['Creatinine levels — kidney waste filtration marker'];
      if (/eGFR/i.test(t.name)) return ['Estimated Glomerular Filtration Rate — kidney function percentage'];
      if (/BUN|Urea/i.test(t.name)) return ['Blood Urea Nitrogen — kidney waste removal marker'];
      if (/Microalbumin/i.test(t.name)) return ['Urine microalbumin — early kidney damage marker'];
      if (/Cystatin/i.test(t.name)) return ['Cystatin C — accurate kidney function marker independent of muscle mass'];
      return ['Kidney function markers'];
    },
    organsChecked: ['Kidneys (filtration)', 'Urinary tract'],
    diseasesDetected: ['Chronic Kidney Disease (CKD)', 'Acute Kidney Injury (AKI)', 'Diabetic nephropathy', 'Kidney stones', 'Urinary tract infections'],
  },
  Anemia: {
    gender: 'Women more commonly affected (menstruation/pregnancy); both genders',
    age: 'All age groups — children, adults, and elderly',
    whatIs: t => `${t.name || 'This test'} evaluates iron levels and other markers related to red blood cell production and oxygen-carrying capacity.`,
    whyDone: t => `To diagnose different types of anaemia (iron deficiency, B12 deficiency, etc.) and identify the root cause of fatigue, paleness, or weakness.`,
    whoNeeds: ['People with chronic fatigue or weakness', 'Women with heavy menstrual bleeding', 'Pregnant women', 'Vegetarians/vegans (B12/Folate risk)', 'Those with paleness, breathlessness, or dizziness'],
    whatMeasures: t => {
      if (/Iron Studies|Iron Profile/i.test(t.name)) return ['Serum Iron', 'Ferritin (iron storage)', 'TIBC (binding capacity)', 'Transferrin Saturation'];
      if (/Ferritin/i.test(t.name)) return ['Ferritin — iron storage protein'];
      if (/TIBC/i.test(t.name)) return ['Total Iron Binding Capacity'];
      if (/B12.*Folate|Folate.*B12|B12 & Folate/i.test(t.name)) return ['Vitamin B12 and Folate (folic acid) levels'];
      if (/Haptoglobin/i.test(t.name)) return ['Haptoglobin — hemolysis marker'];
      if (/Soluble Transferrin/i.test(t.name)) return ['Soluble Transferrin Receptor — differentiates IDA from chronic disease'];
      if (/B12|Cobalamin/i.test(t.name)) return ['Vitamin B12 levels'];
      return ['Iron and anaemia markers'];
    },
    organsChecked: ['Bone marrow (blood production)', 'Spleen', 'Iron storage organs'],
    diseasesDetected: ['Iron Deficiency Anaemia', 'Vitamin B12 Deficiency Anaemia', 'Folate Deficiency Anaemia', 'Anaemia of Chronic Disease', 'Hemolytic Anaemia', 'Thalassemia trait'],
  },
  Vitamins: {
    gender: 'Men & Women',
    age: 'All age groups; older adults and vegans at higher risk',
    whatIs: t => `${t.name || 'This test'} measures your vitamin levels to detect deficiencies or excesses that can affect your overall health.`,
    whyDone: t => `To check for vitamin deficiencies that can cause fatigue, bone problems, nerve issues, and weakened immunity.`,
    whoNeeds: ['People with chronic fatigue', 'Vegans and vegetarians (B12 risk)', 'Older adults (Vitamin D/B12)', 'Those with limited sun exposure (D)', 'People with bone pain or fractures', 'Digestive disorders affecting absorption'],
    whatMeasures: t => {
      if (/Vitamin D/i.test(t.name)) return ['25-Hydroxyvitamin D (vitamin D status)'];
      if (/Vitamin B12|Cobalamin/i.test(t.name)) return ['Vitamin B12 levels'];
      if (/Vitamin A|Retinol/i.test(t.name)) return ['Vitamin A (retinol) levels'];
      if (/Vitamin E|Tocopherol/i.test(t.name)) return ['Vitamin E (tocopherol) levels'];
      if (/Folate|Folic/i.test(t.name)) return ['Folate (Folic Acid) levels'];
      if (/CoQ10|Ubiquinone/i.test(t.name)) return ['Coenzyme Q10 levels'];
      if (/MMA|Methylmalonic/i.test(t.name)) return ['Methylmalonic Acid — sensitive B12 deficiency marker'];
      if (/B5|Pantothenic/i.test(t.name)) return ['Vitamin B5 (Pantothenic Acid) — coenzyme A synthesis'];
      return ['Vitamin levels in blood'];
    },
    organsChecked: ['Bones (Vitamin D)', 'Nervous system (B vitamins)', 'Immune system'],
    diseasesDetected: ['Vitamin D deficiency / insufficiency', 'Vitamin B12 deficiency', 'Folate deficiency', 'Vitamin A deficiency', 'Vitamin E deficiency'],
  },
  Hormones: {
    gender: 'Varies by hormone — some are gender-specific (FSH/LH/Estradiol for women, Testosterone for men), others for both',
    age: 'Adults 18+; reproductive hormones relevant during reproductive years',
    whatIs: t => `${t.name || 'This test'} measures hormone levels in your blood to evaluate your endocrine (gland) system function.`,
    whyDone: t => `To diagnose hormonal imbalances that can affect metabolism, reproduction, growth, mood, and overall health.`,
    whoNeeds: ['People with unexplained weight changes', 'Women with irregular periods or PCOS', 'Men with low libido or erectile dysfunction', 'Anyone with infertility concerns', 'People with fatigue, mood swings, or sleep issues'],
    whatMeasures: t => {
      if (/Thyroid/i.test(t.name)) return ['Thyroid hormones (will be in Thyroid section)'];
      if (/Prolactin/i.test(t.name)) return ['Prolactin — pituitary hormone affecting reproduction and lactation'];
      if (/Cortisol/i.test(t.name)) return ['Cortisol — stress hormone from adrenal glands'];
      if (/Testosterone/i.test(t.name)) return ['Testosterone — male sex hormone (also important in women)'];
      if (/FSH/i.test(t.name)) return ['FSH — Follicle Stimulating Hormone (ovarian/testicular function)'];
      if (/LH/i.test(t.name)) return ['LH — Luteinizing Hormone (ovulation and testosterone)'];
      if (/Progesterone/i.test(t.name)) return ['Progesterone — female reproductive hormone'];
      if (/Estradiol|E2/i.test(t.name)) return ['Estradiol — primary estrogen hormone'];
      if (/AMH/i.test(t.name)) return ['AMH — Anti-Mullerian Hormone (ovarian reserve)'];
      if (/DHEA/i.test(t.name)) return ['DHEA-S / DHEA — adrenal androgen hormone'];
      if (/SHBG/i.test(t.name)) return ['SHBG — Sex Hormone Binding Globulin'];
      if (/PTH|Parathyroid/i.test(t.name)) return ['PTH — Parathyroid Hormone (calcium regulation)'];
      if (/Growth|GH|IGF-1/i.test(t.name)) return ['Growth Hormone / IGF-1 (growth and metabolism)'];
      if (/Aldosterone|Renin/i.test(t.name)) return ['Aldosterone and Renin (BP and electrolyte regulation)'];
      if (/17-OH/i.test(t.name)) return ['17-OH Progesterone (adrenal hormone, CAH screening)'];
      if (/ACTH/i.test(t.name)) return ['ACTH (pituitary-adrenal axis function)'];
      if (/Androstenedione/i.test(t.name)) return ['Androstenedione (adrenal/ovarian androgen)'];
      if (/Pregnenolone/i.test(t.name)) return ['Pregnenolone (neurosteroid, memory & mood)'];
      if (/Leptin/i.test(t.name)) return ['Leptin (satiety hormone, metabolic regulation)'];
      if (/Adiponectin/i.test(t.name)) return ['Adiponectin (insulin-sensitizing adipokine)'];
      if (/ACTH.*Stim|Synacthen/i.test(t.name)) return ['Cortisol response to ACTH stimulation (adrenal reserve)'];
      if (/Dexamethasone.*Suppress|DST|Overnight.*Dexa/i.test(t.name)) return ['Cortisol suppression after dexamethasone (Cushing screen)'];
      return ['Hormone levels'];
    },
    organsChecked: ['Pituitary gland (master gland)', 'Thyroid gland', 'Adrenal glands', 'Ovaries (female)', 'Testes (male)'],
    diseasesDetected: ['Hypogonadism (low sex hormones)', 'PCOS (hormonal imbalance)', 'Adrenal insufficiency', 'Pituitary disorders', 'Menopause related hormonal changes'],
  },
  Fever: {
    gender: 'Men & Women',
    age: 'All age groups — infants to elderly',
    whatIs: t => `${t.name || 'This test'} helps identify the cause of your fever by detecting specific pathogens (viruses, bacteria, or parasites) in your blood.`,
    whyDone: t => `To diagnose the underlying infection causing fever, enabling targeted treatment rather than broad-spectrum antibiotics.`,
    whoNeeds: ['Anyone with persistent or high-grade fever', 'Fever with chills, body ache, or headache', 'Fever lasting more than 3 days', 'Suspected dengue, malaria, typhoid based on symptoms', 'Fever with travel history to endemic areas'],
    whatMeasures: t => {
      if (/Dengue/i.test(t.name)) return ['Dengue NS1 antigen (early) or IgG/IgM antibodies'];
      if (/Malaria/i.test(t.name)) return ['Malaria parasite antigen (P. falciparum, P. vivax)'];
      if (/Typhoid/i.test(t.name)) return ['Salmonella typhi antibodies (O and H antigens)'];
      if (/Chikungunya/i.test(t.name)) return ['Chikungunya virus IgM antibodies'];
      if (/COVID|SARS|CoV/i.test(t.name)) { if (/PCR/i.test(t.name)) return ['SARS-CoV-2 RNA via RT-PCR (gold standard)']; if (/Antigen/i.test(t.name)) return ['SARS-CoV-2 nucleocapsid protein antigen (rapid)']; if (/Antibody|IgG|IgM/i.test(t.name)) return ['SARS-CoV-2 IgG/IgM antibodies (past infection/vaccine response)']; return ['SARS-CoV-2 specific markers']; }
      if (/EBV|Epstein/i.test(t.name)) return ['EBV antibodies (VCA, EA, EBNA) for glandular fever'];
      if (/Leptospira|Lepto/i.test(t.name)) return ['Leptospira IgM antibodies'];
      if (/Scrub Typhus/i.test(t.name)) return ['Orientia tsutsugamushi IgM antibodies'];
      if (/CRP|C-Reactive/i.test(t.name)) return ['C-Reactive Protein — general inflammation/infection marker'];
      if (/Procalcitonin/i.test(t.name)) return ['Procalcitonin — bacterial vs viral infection differentiation'];
      if (/Blood Culture/i.test(t.name)) return ['Bacterial/fungal growth in blood (gold standard for sepsis)'];
      if (/TB|Tuberculosis|QuantiFERON|GeneXpert|ADA/i.test(t.name)) return ['TB-specific markers (IGRA, PCR, or adenosine deaminase)'];
      if (/VZV|Varicella/i.test(t.name)) return ['Varicella Zoster virus antibodies'];
      if (/Measles/i.test(t.name)) return ['Measles virus antibodies'];
      if (/Mumps/i.test(t.name)) return ['Mumps virus antibodies'];
      if (/Pertussis|Whoop/i.test(t.name)) return ['Bordetella pertussis antibodies'];
      if (/Widal/i.test(t.name)) return ['Salmonella typhi and paratyphi agglutination'];
      if (/Weil.Felix/i.test(t.name)) return ['OX19, OX2, OXK antibodies (rickettsial diseases)'];
      if (/Brucella/i.test(t.name)) return ['Brucella abortus/melitensis antibodies'];
      if (/Legionella/i.test(t.name)) return ['Legionella pneumophila urinary antigen'];
      if (/Cryptococcal|Crypto/i.test(t.name)) return ['Cryptococcus neoformans antigen'];
      if (/Histoplasma/i.test(t.name)) return ['Histoplasma capsulatum antigen'];
      return ['Infection-specific markers (pathogen antigens/antibodies)'];
    },
    organsChecked: ['Immune system response', 'Potentially affected organs based on infection type'],
    diseasesDetected: ['Dengue Fever', 'Malaria', 'Typhoid Fever', 'Chikungunya', 'Leptospirosis', 'Scrub Typhus', 'Tuberculosis (TB)', 'Epstein-Barr Virus', 'COVID-19', 'Bacterial vs Viral infections'],
  },
  STD: {
    gender: 'Men & Women (pregnant women should also be screened)',
    age: 'Sexually active individuals of any age; all pregnant women',
    whatIs: t => `${t.name || 'This test'} screens for sexually transmitted infections (STIs) by detecting specific markers in your blood or other samples.`,
    whyDone: t => `To detect STIs early, prevent complications, protect your partner, and receive appropriate treatment. Many STIs can be asymptomatic.`,
    whoNeeds: ['Sexually active individuals (routine screening)', 'People with multiple partners', 'Pregnant women (to prevent mother-to-child transmission)', 'People with symptoms like discharge, sores, or pain', 'Needle-sharing or blood exposure history'],
    whatMeasures: t => {
      if (/HIV/i.test(t.name)) return ['HIV-1 and HIV-2 antibodies/p24 antigen'];
      if (/Hepatitis B|HBsAg/i.test(t.name)) return ['Hepatitis B surface antigen (active infection)'];
      if (/Hepatitis C/i.test(t.name)) return ['Hepatitis C virus antibodies'];
      if (/VDRL|RPR/i.test(t.name)) return ['Non-specific antibodies for syphilis screening'];
      return ['STI-specific markers'];
    },
    organsChecked: ['Immune system', 'Liver (Hepatitis)', 'Reproductive organs'],
    diseasesDetected: ['HIV/AIDS', 'Hepatitis B', 'Hepatitis C', 'Syphilis'],
  },
  Pregnancy: {
    gender: 'Primarily women (pregnancy/fertility); men for semen analysis',
    age: 'Women of reproductive age (18-45); men for fertility any age',
    whatIs: t => `${t.name || 'This test'} is related to pregnancy monitoring, fertility assessment, or prenatal screening.`,
    whyDone: t => `To confirm pregnancy, monitor foetal health, screen for genetic conditions, assess fertility, and ensure a healthy pregnancy.`,
    whoNeeds: ['Women trying to conceive', 'Pregnant women (routine prenatal care)', 'Women with fertility concerns', 'Couples with family history of genetic disorders'],
    whatMeasures: t => {
      if (/hCG|Beta.*hCG|Pregnancy.*Test/i.test(t.name)) return ['Human Chorionic Gonadotropin (hCG) — pregnancy hormone'];
      if (/AMH/i.test(t.name)) return ['Anti-Mullerian Hormone — ovarian reserve (egg count)'];
      if (/Triple Marker/i.test(t.name)) return ['AFP, hCG, Estriol — Down syndrome and neural tube defect screening'];
      if (/NIPT|Non.Invasive/i.test(t.name)) return ['Cell-free fetal DNA — trisomy 21, 18, 13 screening'];
      if (/Rubella/i.test(t.name)) return ['Rubella IgG/IgM antibodies (immunity and infection screening)'];
      if (/Toxoplasma/i.test(t.name)) return ['Toxoplasma gondii antibodies'];
      if (/CMV/i.test(t.name)) return ['Cytomegalovirus antibodies'];
      if (/Semen|Sperm/i.test(t.name)) return ['Sperm count, motility, morphology (male fertility)'];
      return ['Pregnancy and fertility markers'];
    },
    organsChecked: ['Uterus and ovaries', 'Placenta', 'Foetus (through screening markers)'],
    diseasesDetected: ['Pregnancy confirmation', 'Ectopic pregnancy', 'Down syndrome / Trisomy 21', 'Neural tube defects', 'Fertility disorders'],
  },
  Cancer: {
    gender: 'Varies by cancer type — some gender-specific (PSA for men, CA-125/HE4/PAP for women), others for both',
    age: 'Adults 40+ for routine screening; earlier if family history or symptoms',
    whatIs: t => `${t.name || 'This test'} screens for or monitors cancer by measuring specific tumour markers or detecting abnormal cells in the body.`,
    whyDone: t => `For early cancer detection, monitoring treatment response, checking for recurrence, and screening high-risk individuals.`,
    whoNeeds: ['People with family history of cancer', 'Age-appropriate screening (e.g., PAP for cervical cancer)', 'Known cancer patients for treatment monitoring', 'People with suspicious symptoms or lumps', 'Annual health checkup packages'],
    whatMeasures: t => {
      if (/CA 125/i.test(t.name)) return ['CA-125 — ovarian cancer monitoring marker'];
      if (/PSA/i.test(t.name)) return ['Prostate Specific Antigen (prostate cancer screening)'];
      if (/PAP|Smear|Cervical/i.test(t.name)) return ['Cervical cell examination (PAP smear)'];
      if (/CA 19-9/i.test(t.name)) return ['CA 19-9 — pancreatic/biliary tract cancer marker'];
      if (/CA 15-3/i.test(t.name)) return ['CA 15-3 — breast cancer monitoring marker'];
      if (/NSE/i.test(t.name)) return ['Neuron-Specific Enolase — lung cancer and neuroendocrine tumours'];
      if (/Cyfra|CYFRA/i.test(t.name)) return ['CYFRA 21-1 — non-small cell lung cancer marker'];
      if (/SCC/i.test(t.name)) return ['SCC Antigen — squamous cell carcinoma marker'];
      if (/HE4/i.test(t.name)) return ['HE4 — ovarian cancer marker (used in ROMA algorithm)'];
      if (/GALAD/i.test(t.name)) return ['GALAD Score — combined algorithm for ovarian cancer risk'];
      if (/CEA/i.test(t.name)) return ['Carcinoembryonic Antigen (CEA) — colorectal and other cancers'];
      if (/AFP/i.test(t.name)) return ['Alpha-Fetoprotein (AFP) — liver cancer marker'];
      if (/Free Light|SPEP|UPEP|Immunofixation|Myeloma/i.test(t.name)) return ['Multiple myeloma markers'];
      if (/BRCA/i.test(t.name)) return ['BRCA1/BRCA2 gene mutations (hereditary breast/ovarian cancer)'];
      if (/Colorectal|FIT|Fecal Occult|Occult Blood/i.test(t.name)) return ['Fecal occult blood — colorectal cancer screening'];
      if (/Calcitonin/i.test(t.name)) return ['Calcitonin — medullary thyroid cancer marker'];
      if (/Thyroglobulin/i.test(t.name)) return ['Thyroglobulin — thyroid cancer recurrence monitoring'];
      return ['Cancer-specific markers'];
    },
    organsChecked: ['Depends on the specific cancer marker/screening'],
    diseasesDetected: ['Ovarian Cancer (CA-125, HE4)', 'Prostate Cancer (PSA)', 'Cervical Cancer (PAP Smear)', 'Pancreatic Cancer (CA 19-9)', 'Breast Cancer (CA 15-3)', 'Lung Cancer (NSE, Cyfra 21-1, SCC)', 'Liver Cancer (AFP)', 'Colorectal Cancer (FOBT/FIT)'],
  },
  Arthritis: {
    gender: 'Affects both genders; some conditions more common in women (lupus, RA)',
    age: 'Adults 18+; all ages if symptoms present',
    whatIs: t => `${t.name || 'This test'} helps diagnose and monitor autoimmune and inflammatory conditions affecting the joints and connective tissues.`,
    whyDone: t => `To differentiate between types of arthritis (rheumatoid vs osteoarthritis), detect autoimmune diseases, and monitor treatment response.`,
    whoNeeds: ['People with joint pain, stiffness, or swelling', 'Morning stiffness lasting more than 30 minutes', 'Family history of autoimmune disease', 'Unexplained inflammation or fever', 'Skin rashes with joint pain (lupus suspicion)'],
    whatMeasures: t => {
      if (/Rheumatoid|RF/i.test(t.name)) return ['Rheumatoid Factor (RF) — antibody in rheumatoid arthritis'];
      if (/Anti-CCP/i.test(t.name)) return ['Anti-CCP antibodies — highly specific for rheumatoid arthritis'];
      if (/Uric Acid/i.test(t.name)) return ['Uric Acid — gout arthritis marker'];
      if (/ANA/i.test(t.name)) return ['Antinuclear Antibodies (ANA) — lupus and autoimmune screening'];
      if (/Anti-dsDNA/i.test(t.name)) return ['Anti-dsDNA — specific lupus marker'];
      if (/HLA-B27/i.test(t.name)) return ['HLA-B27 genetic marker — ankylosing spondylitis'];
      if (/ANCA|MPO|PR3/i.test(t.name)) return ['ANCA — vasculitis (blood vessel inflammation)'];
      if (/Complement|C3|C4/i.test(t.name)) return ['C3 and C4 complement proteins (disease activity monitoring)'];
      if (/Anti.*SSA|Anti.*SSB|Ro|La/i.test(t.name)) return ['Anti-Ro/SSA and Anti-La/SSB — Sjogren syndrome'];
      if (/Anti.*Sm|Smith/i.test(t.name)) return ['Anti-Smith — lupus specific'];
      if (/Anti.*RNP/i.test(t.name)) return ['Anti-RNP — mixed connective tissue disease'];
      if (/Anti.*Scl|Scleroderma|Topoisomerase/i.test(t.name)) return ['Anti-Scl-70 — systemic sclerosis (scleroderma)'];
      if (/Anti.*Jo.*1|Jo-1/i.test(t.name)) return ['Anti-Jo-1 — polymyositis'];
      if (/Anti.*Centromere|Centromere/i.test(t.name)) return ['Anti-centromere — limited systemic sclerosis (CREST)'];
      if (/Anti.*Cardiolipin/i.test(t.name)) return ['Anti-cardiolipin — antiphospholipid syndrome'];
      return ['Autoimmune and inflammation markers'];
    },
    organsChecked: ['Joints (synovium)', 'Connective tissues', 'Multiple organs (autoimmune)'],
    diseasesDetected: ['Rheumatoid Arthritis', 'Gout', 'Systemic Lupus Erythematosus (Lupus)', 'Ankylosing Spondylitis', 'Sjogren Syndrome', 'Scleroderma / Systemic Sclerosis', 'Vasculitis', 'Antiphospholipid Syndrome'],
  },
  Allergy: {
    gender: 'Men & Women',
    age: 'All age groups — can start in childhood',
    whatIs: t => `${t.name || 'This test'} identifies what substances (allergens) you may be allergic to by measuring your immune system's response.`,
    whyDone: t => `To identify specific triggers causing allergic reactions like sneezing, rashes, breathing difficulty, or digestive issues, enabling targeted avoidance and treatment.`,
    whoNeeds: ['People with seasonal allergies (pollen, dust)', 'Those with unexplained rashes or hives', 'Food allergy suspicions (after certain meals)', 'Asthma or eczema patients', 'Recurrent sinusitis or respiratory issues'],
    whatMeasures: t => {
      if (/Food.*Panel|Panel.*Food/i.test(t.name)) return ['IgE antibodies against common food allergens'];
      if (/Inhalant.*Panel|Panel.*Inhalant/i.test(t.name)) return ['IgE antibodies against inhaled allergens'];
      if (/Total IgE/i.test(t.name)) return ['Total Immunoglobulin E (baseline allergy marker)'];
      if (/RAST|Specific.*IgE|Dust.*Mite|Milk|Egg|Peanut|Wheat|Soy|Tree Nut|Fish|Shellfish|Sesame/i.test(t.name)) return ['Specific IgE antibodies against individual allergens'];
      return ['Allergy-specific IgE antibodies'];
    },
    organsChecked: ['Immune system (mast cells, IgE response)'],
    diseasesDetected: ['Seasonal Allergies (hay fever)', 'Food Allergies', 'Dust Mite Allergy', 'Pet Dander Allergy', 'Contact Dermatitis'],
  },
  FullBody: {
    gender: 'Men & Women',
    age: 'Adults 18+; annual screening recommended for 40+',
    whatIs: t => `${t.name || 'This test'} is a comprehensive assessment that evaluates multiple organ systems and overall health markers.`,
    whyDone: t => `For a complete health checkup, screening for hidden conditions, establishing baseline values, and identifying risk factors early.`,
    whoNeeds: ['Annual health checkup seekers', 'Pre-employment or insurance medicals', 'People 40+ for preventive screening', 'Those with multiple health concerns', 'Baseline assessment before starting new medications'],
    whatMeasures: t => {
      if (/LFT|Function.*Liver/i.test(t.name)) return ['Liver enzymes, bilirubin, proteins'];
      if (/KFT|Kidney|Renal/i.test(t.name)) return ['Creatinine, BUN, electrolytes, uric acid'];
      if (/Electrolytes/i.test(t.name)) return ['Sodium, Potassium, Chloride levels'];
      if (/Urine.*Routine|Urine.*Complete/i.test(t.name)) return ['Physical, chemical, and microscopic urine analysis'];
      if (/Stool/i.test(t.name)) return ['Stool physical, chemical, and microscopic examination'];
      if (/Heavy Metal/i.test(t.name)) return ['Lead, Mercury, Arsenic (toxic heavy metals)'];
      if (/Cystatin/i.test(t.name)) return ['Cystatin C (kidney function)'];
      if (/Vitamin/i.test(t.name)) return ['Vitamin levels'];
      if (/Drug Screen|Toxicology|Alcohol.*CDT|PEth|EtG|EtS/i.test(t.name)) return ['Drug or alcohol biomarkers'];
      if (/Osmolality/i.test(t.name)) return ['Serum or urine osmolality (fluid balance)'];
      if (/Anion Gap/i.test(t.name)) return ['Anion Gap (acid-base balance)'];
      if (/Total Protein|Albumin.*Globulin|A.?G Ratio/i.test(t.name)) return ['Total protein, albumin, globulin, A/G ratio'];
      if (/Magnesium/i.test(t.name)) return ['Serum magnesium (electrolyte)'];
      if (/Phosphorus|Phosphate/i.test(t.name)) return ['Serum phosphorus levels'];
      if (/Calcium/i.test(t.name)) return ['Serum calcium (bone and metabolic marker)'];
      if (/Pharmacogenom|CYP|Warfarin|Clopidogrel/i.test(t.name)) return ['Genetic variants affecting drug metabolism'];
      if (/Sweat Chloride/i.test(t.name)) return ['Chloride in sweat (cystic fibrosis diagnosis)'];
      if (/Elastase/i.test(t.name)) return ['Pancreatic elastase (pancreatic function)'];
      if (/Lactoferrin|Calprotectin/i.test(t.name)) return ['Stool inflammatory markers'];
      if (/Lactose|SIBO|Breath.*Test|Celiac|tTG|Gliadin|EMA|Endomysial|DGP|HLA.DQ/i.test(t.name)) return ['GI function and malabsorption markers'];
      if (/Fecal Fat/i.test(t.name)) return ['Fat content in stool (malabsorption)'];
      if (/MMA|Methylmalonic/i.test(t.name)) return ['MMA (vitamin B12 status)'];
      if (/Carnitine/i.test(t.name)) return ['Carnitine (energy metabolism)'];
      if (/Amino Acid|Organic Acid/i.test(t.name)) return ['Comprehensive metabolic screening'];
      if (/Kt\/V|Dialysis|Urea Reduction/i.test(t.name)) return ['Dialysis adequacy markers'];
      if (/Gastrin/i.test(t.name)) return ['Gastrin levels (GI hormone)'];
      if (/C1.*Esterase|C1.*INH/i.test(t.name)) return ['C1 inhibitor level and function'];
      if (/Health Checkup|Health Package|Wellness/i.test(t.name)) return ['Multi-parameter health screening covering major organ systems'];
      return ['Comprehensive health markers'];
    },
    organsChecked: ['Multiple — varies by test'],
    diseasesDetected: ['Comprehensive — depends on specific test components'],
  },
};

const getCategoryInfo = (test) => {
  const cat = test.category || '';
  const name = test.name || '';
  const sub = test.subcategory || '';
  for (const [key, val] of Object.entries(categoryPatterns)) {
    if (cat.toLowerCase().includes(key.toLowerCase())) return val;
    if (sub.toLowerCase().includes(key.toLowerCase())) return val;
    if (name.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return {
    gender: 'Men & Women',
    age: 'As recommended by your doctor',
    whatIs: () => `${name || 'This test'} measures specific markers in your body to help evaluate your health and detect potential issues.`,
    whyDone: () => `To screen for, diagnose, or monitor health conditions based on the specific markers measured by ${name || 'this test'}.`,
    whoNeeds: ['Recommended by your doctor based on your symptoms, age, risk factors, or medical history', 'Part of routine health checkups or specific diagnostic evaluation', 'Individuals with relevant family history or lifestyle risk factors'],
    whatMeasures: () => ['Specific biomarkers relevant to the condition being evaluated'],
    organsChecked: ['Depends on the specific test'],
    diseasesDetected: ['Depends on the specific test — consult your doctor for interpretation'],
  };
};

const sampleTypeMap = {
  'Blood (Vein sample)': bloodSample,
  'Blood (Finger prick)': 'A small drop of blood collected by pricking your fingertip with a sterile lancet',
  'Urine': 'A urine sample collected in a sterile container',
  'Stool': 'A stool sample collected in a clean, dry container',
  'Sputum': 'A sample of mucus coughed up from your lungs',
  'Swab': 'A sterile swab used to collect cells from the affected area',
  'Semen': 'Semen sample collected through masturbation into a sterile container',
  'CSF': 'Cerebrospinal fluid collected through lumbar puncture',
  'Sweat': 'Sweat collected using a painless electrical stimulation procedure on the forearm',
};
const defaultSampleDesc = 'Biological sample collected as per standard medical procedure';

export function getTestEducation(test) {
  if (!test) return [];
  const info = getCategoryInfo(test);
  const cat = test.category || '';
  const name = test.name || '';
  const price = test.offerPrice || test.price || 0;
  const fasting = test.fasting_required;
  const reportTime = test.report_time || '12-24 hours';
  const prep = test.preparation_instructions || 'No special preparation required';
  const sampleTypeLabel = test.sampleType || 'Blood (Vein sample)';
  const sampleDesc = sampleTypeMap[sampleTypeLabel] || defaultSampleDesc;

  const whatMeasuresArr = typeof info.whatMeasures === 'function' ? info.whatMeasures(test) : info.whatMeasures;
  const sampleCollected = test.home_collection !== false ? homeCollection : 'Lab visit is preferred for this test';

  // Disease-specific monitoring frequency
  const getFrequency = () => {
    if (/HbA1c|diabetes|blood sugar|glucose|fructosamine/i.test(name)) return 'Every 3 months for diabetics, annually for screening';
    if (/thyroid|tsh|t3|t4/i.test(name) && !/antibody|autoimmune/i.test(name)) return 'Every 6-12 months for diagnosed patients, annually for screening';
    if (/lipid|cholesterol/i.test(name)) return 'Annually for most adults, every 3-6 months if on cholesterol medication';
    if (/liver|kft|kidney|creatinine/i.test(name)) return 'Annually for routine checkups, more frequently if on medications or with known disease';
    if (/vitamin|iron|ferritin|b12|folate/i.test(name)) return 'Every 6-12 months after starting supplementation, annually for screening';
    return 'As recommended by your doctor based on your health status';
  };

  const commonSections = [
    {
      title: 'Basic Understanding',
      icon: 'Lightbulb',
      color: '#0F5DA8',
      items: [
        { q: `What is ${name} test?`, a: info.whatIs(test) },
        { q: `Why is ${name} test done?`, a: info.whyDone(test) },
        { q: 'What does this test measure?', a: `The test measures: ${whatMeasuresArr.join(', ')}.` },
        { q: 'Which organs/functions does it check?', a: info.organsChecked.join(', ') + '.' },
        { q: 'Is this a routine or specialized test?', a: price <= 599 ? 'This is a routine screening test commonly included in health checkup packages.' : price <= 1999 ? 'This is a specialty test typically ordered based on specific symptoms or risk factors.' : 'This is a specialized or advanced diagnostic test ordered by a specialist for specific clinical indications.' },
      ]
    },
    {
      title: 'Who Should Take This Test',
      icon: 'User',
      color: '#2e7d32',
      items: [
        { q: 'Who needs this test?', a: info.whoNeeds.map((w, i) => `${i + 1}. ${w}`).join('\n') },
        { q: 'Is this test suitable for men or women?', a: info.gender || 'Men & Women' },
        { q: 'Which age groups should take this test?', a: info.age || 'As recommended by your doctor — consult your doctor for age-specific guidance.' },
        { q: 'Can healthy people take this test for screening?', a: info.whoNeeds.some(w => /routine|annual|health checkup|screening/i.test(w)) ? 'Yes, this test is suitable for preventive health screening.' : 'Yes, but mainly recommended if you have specific risk factors or symptoms.' },
        { q: 'How often should this test be done?', a: getFrequency() },
      ]
    },
    {
      title: 'Symptoms-Based Questions',
      icon: 'Warning',
      color: '#c62828',
      items: [
        { q: `What symptoms indicate I should take ${name} test?`, a: info.whoNeeds.length > 2 ? info.whoNeeds.slice(0, 3).map(w => `• ${w}`).join('\n') : `Your doctor may recommend ${name} based on your specific symptoms and clinical evaluation.` },
        { q: 'Can fatigue / fever / weakness be related to this test?', a: /hematology|anemia|iron|b12|folate|diabetes|thyroid|fever|infection/i.test(cat) ? 'Yes, these are common symptoms that may indicate the need for this test.' : 'These symptoms may be related — consult your doctor for proper evaluation.' },
        { q: 'When should I suspect I need this test?', a: `If you experience persistent symptoms that concern you, or if your doctor recommends it based on your age, risk factors, or family history.` },
      ]
    },
    {
      title: 'Preparation & Fasting',
      icon: 'Clock',
      color: '#e65100',
      items: [
        { q: 'Do I need fasting before this test?', a: fasting ? 'Yes, fasting is required for accurate results.' : 'No, fasting is not required for this test.' },
        { q: !fasting ? 'Why is no fasting needed?' : 'How many hours fasting is required?', a: fasting ? test.preparation_instructions || 'Typically 8-12 hours of fasting. Only plain water is allowed.' : 'The markers measured by this test are not significantly affected by food intake.' },
        { q: 'Can I drink water during fasting?', a: fasting ? 'Yes, plain drinking water is allowed during the fasting period.' : 'Yes, you can drink water as usual.' },
        { q: 'Can I take medicines before the test?', a: 'Please inform your doctor about all medications you are taking. Some medicines may need to be paused before the test.' },
        { q: 'Should I avoid alcohol, smoking, or exercise?', a: fasting ? 'Yes, avoid alcohol for 24 hours, smoking on the morning of the test, and strenuous exercise for 12 hours before.' : 'It is advisable to avoid alcohol for 24 hours before the test.' },
      ]
    },
    {
      title: 'Sample Collection',
      icon: 'Drop',
      color: '#1565c0',
      items: [
        { q: 'What sample is required?', a: `${sampleTypeLabel} is required. ${sampleDesc}.` },
        { q: 'How is the sample collected at home?', a: sampleCollected },
        { q: 'Is the test painful?', a: 'You may feel a mild pinch during the blood draw. Most people find it tolerable and the discomfort lasts only a few seconds.' },
        { q: 'How long does sample collection take?', a: 'The collection process takes about 5-10 minutes.' },
        { q: 'Is home collection available?', a: test.home_collection !== false ? 'Yes, absolutely. A certified phlebotomist will visit your home at your preferred time.' : 'Lab visit is preferred for this specific test.' },
      ]
    },
    {
      title: 'Test Process',
      icon: 'Microscope',
      color: '#0F5DA8',
      items: [
        { q: 'What happens during the test?', a: `A qualified phlebotomist will ${sampleDesc.toLowerCase()}. The sample is then sent to our NABL-accredited lab for analysis.` },
        { q: 'Is any risk or side effect involved?', a: 'The test is extremely safe. In rare cases, you may experience mild bruising at the puncture site which resolves within a day.' },
        { q: 'How long does the test procedure take?', a: 'The sample collection takes 5-10 minutes. Results are typically ready within the specified report time.' },
        { q: 'Is it safe for pregnant women / elderly?', a: 'Yes, blood tests are safe for pregnant women and elderly. However, always inform the phlebotomist if you are pregnant.' },
      ]
    },
    {
      title: 'Report & Timing',
      icon: 'FileText',
      color: '#1565c0',
      items: [
        { q: `How long does it take to get ${name} report?`, a: `Reports are usually available within ${reportTime}. Turnaround time may vary based on lab workload.` },
        { q: 'How will I receive my report?', a: 'You will receive your report via WhatsApp, Email, and the Jeevan HealthCare app. You can also download it from our patient portal.' },
        { q: 'Can I download the report online?', a: 'Yes, reports are available for download from your account on our website or app.' },
        { q: 'What if my report is delayed?', a: 'If your report is delayed beyond the expected time, please contact our support team at +91-XXXXXXXXXX.' },
      ]
    },
    {
      title: 'Result Interpretation',
      icon: 'ChartBar',
      color: '#2e7d32',
      items: [
        { q: 'What do normal results mean?', a: 'Normal results indicate that the measured biomarkers are within the expected reference range for a healthy individual.' },
        { q: 'What does a high or low result indicate?', a: 'Abnormal results may indicate an underlying condition that requires medical attention. Only your doctor can interpret results in the context of your overall health.' },
        { q: 'Is an abnormal result always dangerous?', a: 'Not necessarily. Mild deviations may be temporary, diet-related, or within normal variation. Always consult your doctor for proper interpretation.' },
        { q: 'Can lifestyle affect my results?', a: 'Yes, diet, exercise, stress, sleep, alcohol, and smoking can all affect test results. Your doctor will consider these factors.' },
        { q: 'Should I repeat the test?', a: getFrequency() + '\n\nYour doctor will advise if a repeat test is needed based on borderline results.' },
      ]
    },
    {
      title: 'Clinical Meaning',
      icon: 'Heartbeat',
      color: '#c62828',
      items: [
        { q: 'What diseases can this test detect?', a: info.diseasesDetected.map((d, i) => `${i + 1}. ${d}`).join('\n') },
        { q: 'Can this test confirm a disease?', a: 'This test provides important diagnostic information, but diagnosis is made by your doctor based on the complete clinical picture including symptoms, history, and other investigations.' },
        { q: 'Is this test enough for diagnosis?', a: 'This test alone may not be sufficient for diagnosis. Your doctor may recommend additional tests for a complete evaluation.' },
        { q: 'Do I need additional tests after this?', a: 'Depending on the results, your doctor may recommend follow-up tests for confirmation or further investigation.' },
      ]
    },
    {
      title: 'Safety & Reliability',
      icon: 'Shield',
      color: '#0F5DA8',
      items: [
        { q: 'Is this test accurate?', a: 'Yes, our tests are processed at NABL-accredited laboratories using standardized and validated methods for high accuracy.' },
        { q: 'Can results vary between labs?', a: 'Minor variations can occur between labs due to different equipment and methods. Always use the same lab for consistent monitoring.' },
        { q: 'Are there any risks in this test?', a: 'There are no significant risks. The procedure is minimally invasive and very safe.' },
        { q: 'Is NABL accreditation important for this test?', a: 'Yes, NABL accreditation ensures quality standards, accurate results, and reliable testing processes.' },
      ]
    },
    {
      title: 'Cost & Booking',
      icon: 'Coin',
      color: '#FF8A00',
      items: [
        { q: 'What is the cost of this test?', a: `The cost of ${name} is ₹${price}. We also offer combo packages and seasonal discounts to make testing more affordable.` },
        { q: 'Is home collection free?', a: price >= 999 ? 'Yes, home collection is FREE for this test.' : 'Free home collection is available for orders above ₹999. A nominal fee applies for lower-value orders.' },
        { q: 'How do I book this test?', a: 'You can book online directly from this page. Click "Add to Cart" and proceed through the simple booking steps — Review, Patient Details, Address, and Payment.' },
        { q: 'Can I reschedule or cancel booking?', a: 'Yes, you can reschedule or cancel your booking up to 2 hours before the scheduled collection time at no charge.' },
        { q: 'What payment methods are available?', a: 'We accept all major payment methods: Credit/Debit Cards, UPI (GPay, PhonePe, Paytm), Net Banking, and Cash on Collection.' },
      ]
    },
    {
      title: 'Follow-up',
      icon: 'ArrowClockwise',
      color: '#7b1fa2',
      items: [
        { q: 'When should I repeat this test?', a: getFrequency() },
        { q: 'Do I need doctor consultation after this test?', a: 'We recommend consulting a doctor to review your results, especially if any values are outside the normal range.' },
        { q: 'Can I monitor results over time?', a: 'Yes, keeping a record of your test results over time helps track changes and trends. Your Jeevan HealthCare account stores all your past reports.' },
        { q: 'What lifestyle changes help improve results?', a: 'A balanced diet, regular exercise (30 mins/day), stress management, adequate sleep (7-8 hours), and staying hydrated can positively impact most health markers.' },
      ]
    },
  ];

  return commonSections.map(section => ({
    ...section,
    items: section.items.map(item => ({
      q: item.q,
      a: item.a,
    })),
  }));
}

function getPackageCategory(pkg) {
  const n = pkg.name || '';
  const d = pkg.description || '';
  if (/basic/i.test(n)) return { tier: 'Basic', params: '30+', price: 999, suitable: '18+ years, first-time health checkup seekers', freq: 'Annually; every 6 months if over 40' };
  if (/executive/i.test(n)) return { tier: 'Executive', params: '60+', price: 2499, suitable: '25+ years working professionals, corporate employees', freq: 'Annually recommended' };
  if (/wellness|complete|full body/i.test(n)) return { tier: 'Premium', params: '85+', price: 3999, suitable: '30+ years, comprehensive health assessment needed', freq: 'Annually; every 6 months if chronic conditions present' };
  if (/diabetes|diabetic/i.test(n)) return { tier: 'Diabetes', params: '25+', price: 1299, suitable: 'Diabetic patients, prediabetic individuals, family history of diabetes', freq: 'Every 3-6 months for diabetics; annually for screening' };
  if (/corporate/i.test(n)) return { tier: 'Corporate', params: 'Customizable', price: 599, suitable: 'Corporate employees, pre-employment screening', freq: 'As per company policy or annually' };
  const match = d.match(/(\d+)\+?\s*(parameters|tests|params)/i);
  return { tier: 'Standard', params: match ? match[1] + '+' : 'Multiple', price: pkg.offerPrice || pkg.price || 999, suitable: 'Adults 18+ looking for preventive health screening', freq: 'Annually for most adults' };
}

export function getPackageEducation(pkg) {
  if (!pkg) return [];
  const cat = getPackageCategory(pkg);
  const n = pkg.name || '';
  const d = pkg.description || '';
  const price = pkg.offerPrice || pkg.price || cat.price;
  const reportTime = pkg.report_time || '24-48 hrs';
  const mrp = pkg.mrp || Math.round(price * 2.5);
  const savings = mrp - price;
  const discountPct = Math.round((1 - price / mrp) * 100);

  return [
    {
      title: 'What is a Health Package?',
      icon: 'Lightbulb', color: '#0F5DA8',
      items: [
        { q: `What is included in ${n}?`, a: `${d} It covers ${cat.params} parameters to give you a complete picture of your health.` },
        { q: 'Why choose a health package instead of individual tests?', a: `Health packages offer comprehensive screening at 40-60% lower cost than booking individual tests separately. You save ₹${savings} on this package alone. Plus, you get a holistic health assessment rather than isolated markers.` },
        { q: 'What is the purpose of a full body checkup?', a: 'To assess your overall health status, detect underlying conditions early (often before symptoms appear), establish baseline values for future comparison, and identify lifestyle or genetic risk factors.' },
        { q: 'How does a preventive health package help in early disease detection?', a: 'Many serious conditions like diabetes, hypertension, fatty liver, and early-stage cancers show no symptoms initially. Health packages screen across multiple organ systems, catching abnormalities at a stage when treatment is most effective.' },
      ]
    },
    {
      title: 'Who Should Take This Package?',
      icon: 'User', color: '#2e7d32',
      items: [
        { q: 'Who should take this health package?', a: cat.suitable },
        { q: 'Is this package suitable for healthy individuals?', a: 'Absolutely. In fact, preventive health packages are most valuable for people who feel healthy — they help detect silent conditions before they cause symptoms.' },
        { q: 'Do I need a health package if I have no symptoms?', a: 'Yes. Many health conditions develop silently without any warning signs. Regular health checkups are essential even for asymptomatic individuals, especially after age 30.' },
        { q: 'Are there special packages for different groups?', a: 'Yes! We offer packages tailored for: adults under 40 (baseline screening), seniors 40+ (comprehensive), men (prostate + hormone markers), women (breast + gynecological health), corporate employees (stress + lifestyle), and chronic disease patients (focused organ monitoring).' },
        { q: 'How often should I take this package?', a: cat.freq },
      ]
    },
    {
      title: 'What Tests Are Included?',
      icon: 'Flask', color: '#7b1fa2',
      items: [
        { q: `What tests are included in ${n}?`, a: d },
        { q: 'Does it include CBC, sugar, thyroid, liver, kidney tests?', a: 'Most comprehensive packages include CBC (blood count), Fasting Blood Sugar, Thyroid Profile (TSH/T3/T4), Liver Function Tests (SGPT/SGOT/ALP/Bilirubin), and Kidney Function Tests (Creatinine/Urea/Uric Acid). Specifics vary by package tier.' },
        { q: 'Does this package include Vitamin D / B12 tests?', a: 'Premium packages (Executive and Wellness) include Vitamin D and Vitamin B12. Basic packages may include these as add-ons.' },
        { q: 'Are ECG, X-ray, or ultrasound included?', a: 'ECG is included in Executive and Wellness packages. Imaging like X-ray or ultrasound is typically not part of standard packages but can be added on request.' },
        { q: 'Can the test list vary between packages?', a: 'Yes. Higher-tier packages include more advanced markers. Basic covers essentials, Executive adds vitamins and cardiac markers, Wellness includes hormones and cancer screening.' },
      ]
    },
    {
      title: 'Preparation & Fasting',
      icon: 'Clock', color: '#e65100',
      items: [
        { q: 'Do I need fasting before a health package test?', a: pkg.fasting_required ? 'Yes, fasting is required for accurate results — typically 10-12 hours overnight.' : 'Most packages require fasting for blood sugar and lipid accuracy.' },
        { q: 'How many hours fasting is required?', a: pkg.fasting_required ? (pkg.preparation_instructions || '10-12 hours of fasting. Only plain water is allowed.') : 'If fasting is required, 10-12 hours is standard. Your booking confirmation will specify.' },
        { q: 'Can I drink water during fasting?', a: 'Yes, plain drinking water is allowed and encouraged to stay hydrated. Avoid tea, coffee, milk, or flavored drinks.' },
        { q: 'Can I take regular medicines before the test?', a: 'Continue your regular medications unless specifically advised otherwise by your doctor. Inform the phlebotomist about any medicines you take.' },
        { q: 'Should I avoid alcohol, smoking, or exercise before the test?', a: 'Avoid alcohol for 24 hours, smoking on the test morning, and strenuous exercise for 12 hours before sample collection.' },
      ]
    },
    {
      title: 'Sample Collection & Process',
      icon: 'Drop', color: '#1565c0',
      items: [
        { q: 'How is the health package test done at home?', a: 'A certified phlebotomist visits your home at the scheduled time. They collect blood samples (multiple vials for different tests) and any other required samples (urine, stool) in a single visit.' },
        { q: 'What samples are collected?', a: 'Most packages require 1-2 blood vials (8-12 ml total), a urine sample, and occasionally a stool sample. Each test uses a small portion of the same blood draw.' },
        { q: 'How long does the home sample collection take?', a: 'The entire collection process takes about 15-20 minutes for a full package. The phlebotomist labels and prepares all samples for transport.' },
        { q: 'Is the procedure safe and painless?', a: 'Yes, it is very safe. You may feel a mild prick during venipuncture. Our phlebotomists use sterile, single-use equipment following strict safety protocols.' },
        { q: 'Do I need to visit the lab or is everything at home?', a: 'Everything is done at home. From sample collection to report delivery — you never need to visit a lab. Reports are sent digitally.' },
      ]
    },
    {
      title: 'Test Duration & Convenience',
      icon: 'Clock', color: '#0F5DA8',
      items: [
        { q: 'How long does the full health checkup process take?', a: 'Sample collection: 15-20 minutes at home. Reports: typically ready within 24-48 hours. Total turnaround: 1-2 days from collection to report.' },
        { q: 'Can all tests be done in a single visit?', a: 'Yes. All tests included in the package are performed using the same blood and urine samples collected during one visit. No separate appointments needed.' },
        { q: 'Is home sample collection available?', a: 'Yes, home collection is available and FREE for all our health packages. We cover all major cities and most urban areas.' },
        { q: 'Can I book a time slot for collection?', a: 'Yes, you can choose a 2-hour time slot that suits you — morning (6-8 AM), mid-morning (8-10 AM), or flexible slots based on availability.' },
      ]
    },
    {
      title: 'Report Delivery',
      icon: 'FileText', color: '#1565c0',
      items: [
        { q: `How long does it take to get ${n} reports?`, a: `Reports are usually available within ${reportTime}. Complex packages may take up to 72 hours for complete integration of all reports.` },
        { q: 'Will I receive reports on WhatsApp / Email / App?', a: 'Yes, reports are delivered via WhatsApp, Email, and the Jeevan HealthCare mobile app. You can access them from anywhere.' },
        { q: 'Can I download my full health report?', a: 'Yes, you can download a complete PDF report from your patient portal. The report includes all test values with reference ranges and flags for abnormal values.' },
        { q: 'Is a doctor-reviewed report included?', a: 'Premium packages (Executive and Wellness) include a doctor-reviewed report summary. Basic package includes lab-verified results.' },
        { q: 'What if my report is delayed?', a: 'If your report is delayed beyond the expected time, contact our support team at +91-XXXXXXXXXX. We prioritize health package reports.' },
      ]
    },
    {
      title: 'Interpretation of Results',
      icon: 'ChartBar', color: '#2e7d32',
      items: [
        { q: 'What do normal health package results mean?', a: 'Normal results indicate that all measured biomarkers are within expected healthy reference ranges. This suggests good organ function and no apparent disease.' },
        { q: 'What does it mean if one or more tests are abnormal?', a: 'Abnormal results do not always mean disease. They indicate areas that need medical attention. Some values may be temporarily affected by diet, stress, or medications.' },
        { q: 'Do I need to worry if a value is slightly high/low?', a: 'Not immediately. Mild deviations can be normal variation. However, consult a doctor for proper interpretation, especially if multiple values are outside range.' },
        { q: 'Can health package results confirm disease?', a: 'Health package results provide screening information. Confirmation of any disease requires consultation with a doctor who may recommend additional focused tests.' },
        { q: 'Should I consult a doctor after receiving results?', a: 'We strongly recommend it. Our packages include a free follow-up consultation to discuss your results with a qualified physician.' },
      ]
    },
    {
      title: 'Medical Value & Accuracy',
      icon: 'Heartbeat', color: '#c62828',
      items: [
        { q: 'How accurate are health package tests?', a: 'All tests are processed at NABL-accredited laboratories using automated, calibrated analyzers. Results meet clinical accuracy standards.' },
        { q: 'Can these tests detect diseases early?', a: 'Yes. Health packages are designed for early detection. For example, raised blood sugar catches prediabetes years before symptoms appear. Elevated liver enzymes detect fatty liver early.' },
        { q: 'Do health packages guarantee detection of all diseases?', a: 'No medical test can guarantee 100% detection. Health packages screen for common conditions affecting major organ systems. Rare or specific conditions may require additional targeted testing.' },
        { q: 'Are NABL-certified labs used for testing?', a: 'Yes, all our partner laboratories are NABL-accredited (National Accreditation Board for Testing and Calibration Laboratories) ensuring quality and reliability.' },
        { q: 'Can results vary between labs?', a: 'Minor variations can occur due to different equipment, reagents, and reference populations. For consistent monitoring, we recommend using the same lab each time.' },
      ]
    },
    {
      title: 'Frequency of Testing',
      icon: 'ArrowClockwise', color: '#7b1fa2',
      items: [
        { q: 'How often should I take a full body checkup?', a: cat.freq },
        { q: 'Is annual health screening necessary?', a: 'Yes. Annual screening is recommended for all adults 35+. Many health changes happen gradually over a year, and annual comparison helps track trends.' },
        { q: 'Do chronic patients need more frequent testing?', a: 'Yes. Patients with diabetes, hypertension, thyroid disorders, or heart disease need monitoring every 3-6 months as advised by their doctor.' },
        { q: 'Should young adults take health packages regularly?', a: 'Young adults (20-30) should have a baseline checkup once. After 30, every 2 years is recommended. After 40, annual screening is ideal.' },
      ]
    },
    {
      title: 'Customization FAQs',
      icon: 'Info', color: '#e65100',
      items: [
        { q: 'Can I customize my health package?', a: 'Yes, most packages can be customized. You can add or remove specific tests based on your age, gender, medical history, or doctor recommendation.' },
        { q: 'Can I add or remove tests from a package?', a: 'Yes, you can add any individual test from our 400+ test catalog to your package. Removal may reduce the package discount proportionally.' },
        { q: 'Are there personalized packages based on age or disease history?', a: 'Yes, we recommend personalized packages. For example: Women 30+ get packages with thyroid + iron + Vitamin D. Diabetics get packages with HbA1c + kidney function + lipid profile.' },
        { q: 'Can doctors recommend specific package combinations?', a: 'Yes. You can share your package list with your doctor who can recommend additions or modifications. We also offer doctor-recommended combo packages.' },
      ]
    },
    {
      title: 'Safety & Comfort',
      icon: 'Shield', color: '#0F5DA8',
      items: [
        { q: 'Is blood collection safe at home?', a: 'Yes, our phlebotomists are trained and certified professionals who follow strict infection control protocols. All equipment is sterile and single-use.' },
        { q: 'Is there any risk or side effect in testing?', a: 'The procedure is extremely safe. Minimal risks include slight bruising at the puncture site, mild discomfort, or rare dizziness. These resolve quickly.' },
        { q: 'Is it safe for elderly or pregnant patients?', a: 'Yes, blood tests are safe for all ages and during pregnancy. Inform the phlebotomist if you are pregnant or have any bleeding disorders.' },
        { q: 'Are trained phlebotomists used for sample collection?', a: 'Yes, all our phlebotomists are certified with minimum 2 years of experience. They undergo regular training on safety protocols and patient comfort.' },
      ]
    },
    {
      title: 'Cost & Booking',
      icon: 'Coin', color: '#FF8A00',
      items: [
        { q: `What is the cost of ${n}?`, a: `The package costs ₹${price}. The total value of individual tests is ₹${mrp}, so you save ₹${savings} (${discountPct}% off).` },
        { q: 'Why are packages cheaper than individual tests?', a: 'Packages bundle multiple tests into one booking, reducing administrative costs. The savings are passed to you — typically 40-60% off compared to booking each test separately.' },
        { q: 'Is home collection free?', a: 'Yes, FREE home collection is included with all health packages. A certified phlebotomist visits you at your preferred time.' },
        { q: 'How do I book a health package?', a: 'Click "Add to Cart" on this package, then proceed through Review → Patient Details → Address → Payment. You can choose your preferred collection time slot.' },
        { q: 'What payment methods are available?', a: 'We accept Credit/Debit Cards, UPI (GPay, PhonePe, Paytm), Net Banking, and Cash on Collection. EMI options available on select cards.' },
      ]
    },
    {
      title: 'Post-Test Guidance',
      icon: 'Phone', color: '#c62828',
      items: [
        { q: 'What should I do after receiving reports?', a: 'Review your report carefully. Schedule a follow-up consultation with our doctor (included with most packages). Discuss any abnormal values and get a personalized health plan.' },
        { q: 'Will I get doctor consultation after the package?', a: 'Yes, Executive and Wellness packages include a free tele-consultation with a doctor to review and explain your results. Basic package includes a doctor-reviewed summary.' },
        { q: 'Do I need follow-up tests?', a: 'If any results are borderline or abnormal, your doctor may recommend specific follow-up tests for confirmation. These can be booked separately from our catalog.' },
        { q: 'Can lifestyle changes improve my results?', a: 'Absolutely. Many abnormal results (high cholesterol, blood sugar, liver enzymes) can be improved with diet, exercise, stress management, and better sleep. Your doctor can guide you.' },
        { q: 'How do I track my health progress over time?', a: 'Your Jeevan HealthCare account stores all past reports. You can compare results year-over-year to track improvements and detect concerning trends early.' },
      ]
    },
  ];
}
