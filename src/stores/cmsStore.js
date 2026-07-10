import { create } from 'zustand';

const CMS_KEY = 'jh_cms_content';

const load = (key, def) => { try { return JSON.parse(localStorage.getItem(key) || def); } catch { return def; } };
const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const defaults = {
  hero: {
    heading: 'Your Health, Our Priority — Trusted Diagnostics at Your Doorstep',
    subheading: 'Book lab tests from home with free sample collection. 5000+ tests, NABL certified labs, reports in 24 hours.',
    backgroundImage: '',
    ctaText: 'Book Lab Tests',
    ctaLink: '/diagnostics',
    ctaSecondaryText: 'Upload Prescription',
    ctaSecondaryLink: '#upload',
    ctaTertiaryText: 'Book Health Package',
    ctaTertiaryLink: '/health-packages',
    rating: '4.9',
    ratingLabel: '50,000+ Happy Patients',
    statBadges: [
      { icon: '🧪', label: '5000+', sublabel: 'Tests' },
      { icon: '🏠', label: 'Free Home', sublabel: 'Collection' },
      { icon: '🏅', label: 'NABL Certified', sublabel: 'Labs' },
      { icon: '⏱️', label: 'Reports in', sublabel: '24 Hours' },
    ],
    featureIcons: [
      { icon: '👨‍👩‍👧‍👦', label: 'Family' },
      { icon: '🩺', label: 'Doctor' },
      { icon: '💉', label: 'Phlebotomist' },
      { icon: '👴', label: 'Senior Citizen' },
    ],
    active: true,
  },
  trustStrip: {
    items: [
      { label: 'NABL Certified', icon: '🏅' },
      { label: 'Free Home Collection', icon: '🏠' },
      { label: 'Same Day Collection', icon: '📅' },
      { label: 'Secure Payment', icon: '🔒' },
      { label: 'Doctor Support', icon: '🩺' },
      { label: 'Digital Reports', icon: '📄' },
      { label: '24x7 Support', icon: '📞' },
    ],
    active: true,
  },
  services: [
    { id: 'doctor-consultation', icon: '🩺', label: 'Doctor Consultation', description: 'Consult top doctors from home', color: '#3B82F6', link: '/consult-doctor', active: true },
    { id: 'diagnostics', icon: '🔬', label: 'Diagnostics', description: '5000+ lab tests at your doorstep', color: '#10B981', link: '/diagnostics', active: true },
    { id: 'pharmacy', icon: '💊', label: 'Pharmacy', description: 'Medicines delivered to your home', color: '#F59E0B', link: '/services/pharmacy', active: true },
    { id: 'nursing', icon: '👩‍⚕️', label: 'Nursing', description: 'Skilled nursing care at home', color: '#8B5CF6', link: '/services/nursing', active: true },
    { id: 'physiotherapy', icon: '🏋️', label: 'Physiotherapy', description: 'Recover with expert physiotherapists', color: '#EC4899', link: '/services/physiotherapy', active: true },
    { id: 'vaccination', icon: '💉', label: 'Vaccination at Home', description: 'Vaccination for all age groups & travel', color: '#2563eb', link: '/vaccination', active: true },
  ],
  servicesPage: {
    heroTitle: 'Complete Healthcare at Your Doorstep',
    heroSubtitle: 'Doctor consultations, lab tests, pharmacy, nursing, physiotherapy, vaccinations & more — all from one trusted platform.',
    heroCtas: [
      { label: 'Book Lab Test', link: '/diagnostics', color: '#FF3B30' },
      { label: 'Consult Doctor', link: '/consult-doctor' },
      { label: 'WhatsApp', link: 'https://wa.me/919700104108', color: '#25d366' },
    ],
    trustBadges: ['NABL Labs', 'Free Home Collection', 'Digital Reports', '24×7 Support'],
    quickActions: [
      { icon: 'Stethoscope', label: 'Doctor Consultation', desc: 'Consult top doctors from home', path: '/consult-doctor', color: '#1866C9', tag: 'Available' },
      { icon: 'Flask', label: 'Lab Tests', desc: '1000+ tests at home, up to 60% off', path: '/diagnostics', color: '#22C55E', tag: 'Popular' },
      { icon: 'Heart', label: 'Health Packages', desc: 'Full body, diabetes, cardiac & more', path: '/services', color: '#e53935', tag: 'Save 60%' },
      { icon: 'Pill', label: 'Pharmacy', desc: 'Medicines delivered in 2 hrs', path: '/pharmacy', color: '#7c3aed', tag: 'Express' },
      { icon: 'User', label: 'Nursing Care', desc: 'Trained nurses at home', path: '/book-appointment', color: '#0891b2', tag: 'New' },
      { icon: 'Heart', label: 'Physiotherapy', desc: 'Rehab & recovery at home', path: '/book-appointment', color: '#059669', tag: 'Book' },
      { icon: 'Syringe', label: 'Vaccination', desc: 'All age groups & travel', path: '/book-appointment', color: '#2563eb', tag: 'Home' },
      { icon: 'Monitor', label: 'Medical Equipment', desc: 'Rent or buy', path: '/book-appointment', color: '#e65100', tag: 'Rent' },
    ],
    categories: [
      { title: 'Home Healthcare Services', color: '#1866C9', items: ['Doctor Consultation at Home', 'Medicine Delivery at Home', 'Lab Tests & Diagnostics at Home', 'X-Ray, ECG, EEG at Home', 'Nursing Care at Home', 'Caregiver Services (Elderly/Patient Care) at Home', 'Physiotherapy at Home', 'Vaccination at Home (All Age Groups & Travel Vaccines)', 'Medical Equipment Rental & Sales', 'Home ICU Setup & Monitoring'] },
      { title: 'Preventive & Corporate Health Services', color: '#4169E1', items: ['Pre & Post Employment Health Checkups', 'Corporate & Occupational Health Services', 'Health Checkup Packages (Basic, Advanced, Executive & Disease-Specific)', 'Subscription-Based & Annual Health Plans'] },
      { title: 'Digital Health Tools & Technology', color: '#2563eb', items: ['Real-Time Service Booking & Tracking via App', 'Integration with Health Records (EMR/EHR)', 'Health Trackers & Remote Monitoring Devices', 'Health Insurance Sales & Assistance', 'Symptom Checker, e-Prescriptions, Health Wallet, Reminders', 'Smart Home Health Devices'] },
      { title: 'Mother & Child Care Services', color: '#0891b2', items: ['Postnatal & Neonatal Care at Home', 'Pediatric Consultations & Vaccinations at Home', 'Lactation Consultation'] },
      { title: 'Wellness & Lifestyle Management', color: '#059669', items: ['Yoga & Meditation Sessions at Home', 'Dietitian/Nutritionist Consultations', 'Lifestyle Disease Reversal Programs (Diabetes, Obesity, Hypertension)', 'Smoking Cessation Programs'] },
      { title: 'Specialist Services at Home', color: '#7c3aed', items: ['Oncology Care (Chemo Coordination, Palliative Support)', 'Orthopaedic Rehab & Joint Care', 'Neurological Rehab (Stroke, Parkinson\'s, Dementia)', 'Cardiac Rehab Programs'] },
      { title: 'Travel & Concierge Healthcare', color: '#0891b2', items: ['Pre-Travel Health Consultations & Vaccinations', 'Medical Assistance for NRIs / Visiting Family', 'Hotel/Apartment-Based Health Services'] },
      { title: 'B2B & Institutional Services', color: '#dc2626', items: ['Industrial Medical Camps', 'Employee Wellness Programs', 'School/College Health Programs', 'Insurance TPA Coordination & Claim Support'] },
      { title: 'Community & Public Health Engagement', color: '#1866C9', items: ['Free Medical Camps & CSR Activities', 'Health Awareness & Preventive Screening Drives', 'Health ID Creation & Ayushman Bharat (ABHA) Integration'] },
    ],
    ctaHeading: 'Need help choosing a service?',
    ctaText: 'Call us or WhatsApp for free guidance',
    ctaPhone: '+919700104108',
    ctaWhatsapp: '919700104108',
    active: true,
  },
  blog: {
    pageTitle: 'Health Blog',
    pageSubtitle: 'Expert articles on preventive care, nutrition & wellness — straight from our healthcare professionals.',
    posts: [
      {
        id: 1,
        title: 'Why Regular Health Checkups Are Essential for a Healthy Life',
        slug: 'why-regular-health-checkups-essential',
        excerpt: 'Regular health checkups help detect potential health issues before they become serious. Learn why preventive screenings matter.',
        content: 'Prevention is always better than cure. Regular health checkups are the cornerstone of preventive healthcare, helping detect potential health issues before they become serious.\n\nMost chronic diseases like diabetes, hypertension, and heart disease develop silently over years. By the time symptoms appear, significant damage may already be done. Regular screenings can catch these conditions early when they are most treatable.\n\nFor adults over 30, an annual health checkup is recommended. This should include blood pressure screening, blood sugar tests, cholesterol profile, and organ function assessments. Early detection through regular checkups can reduce healthcare costs by up to 50% and significantly improve treatment outcomes.\n\nAt Jeevan HealthCare at Home, we offer comprehensive health checkup packages designed for every age group and lifestyle. Our free home collection service makes it convenient to get tested without disrupting your daily routine.',
        author: 'Dr. Priya Sharma',
        category: 'Preventive Care',
        tags: ['health checkup', 'preventive care', 'wellness'],
        image: '',
        publishedAt: '2025-12-15',
        active: true,
      },
      {
        id: 2,
        title: 'Understanding Your Blood Test Results: A Complete Guide',
        slug: 'understanding-blood-test-results',
        excerpt: 'Confused by your lab report? This guide explains common blood test parameters and what your results mean.',
        content: 'Blood tests are among the most common medical investigations, providing valuable insights into your overall health. Understanding your results can help you take proactive steps toward better health.\n\nComplete Blood Count (CBC): This measures red blood cells, white blood cells, and platelets. Abnormal levels can indicate anemia, infection, or clotting disorders.\n\nLipid Profile: Measures cholesterol and triglycerides. High LDL (bad cholesterol) increases heart disease risk, while HDL (good cholesterol) protects against it.\n\nBlood Sugar (Glucose): Fasting glucose above 126 mg/dL may indicate diabetes. HbA1c provides a 3-month average of blood sugar levels.\n\nLiver Function Tests: ALT, AST, and GGT enzymes indicate liver health. Elevated levels may suggest fatty liver, hepatitis, or alcohol-related damage.\n\nKidney Function Tests: Creatinine and BUN measure how well your kidneys filter waste. Abnormal results warrant further investigation.\n\nThyroid Profile: TSH, T3, and T4 levels help diagnose thyroid disorders, which affect metabolism, energy, and weight.',
        author: 'Jeevan HealthCare at Home Team',
        category: 'Health Education',
        tags: ['blood test', 'lab report', 'health education'],
        image: '',
        publishedAt: '2025-11-20',
        active: true,
      },
      {
        id: 3,
        title: 'The Role of Diet and Nutrition in Managing Diabetes',
        slug: 'diet-nutrition-managing-diabetes',
        excerpt: 'Discover how proper nutrition and dietary choices can help manage and even reverse type 2 diabetes.',
        content: 'Diet plays a crucial role in managing diabetes. With the right food choices, many people with type 2 diabetes can achieve excellent blood sugar control and even reduce their medication dependence.\n\nFocus on Low Glycemic Index Foods: Foods with a low GI release glucose slowly, preventing blood sugar spikes. Include whole grains, legumes, most vegetables, and nuts in your diet.\n\nProtein-Rich Meals: Protein helps stabilize blood sugar and promotes satiety. Include lean meats, fish, eggs, tofu, and Greek yogurt in your meals.\n\nHealthy Fats: Monounsaturated and polyunsaturated fats improve insulin sensitivity. Sources include olive oil, avocados, nuts, seeds, and fatty fish.\n\nFiber Intake: Aim for 25-30 grams of fiber daily. Soluble fiber, found in oats, apples, and beans, helps slow glucose absorption.\n\nPortion Control: Even healthy foods can raise blood sugar if eaten in large quantities. Use the plate method — fill half with non-starchy vegetables, a quarter with lean protein, and a quarter with complex carbohydrates.',
        author: 'Nutritionist Ananya Reddy',
        category: 'Disease Management',
        tags: ['diabetes', 'nutrition', 'diet'],
        image: '',
        publishedAt: '2025-10-05',
        active: true,
      },
      {
        id: 4,
        title: 'Home Sample Collection: What to Expect and How to Prepare',
        slug: 'home-sample-collection-guide',
        excerpt: 'Everything you need to know about preparing for a home blood collection visit — from fasting guidelines to what to keep ready.',
        content: 'Home sample collection makes health testing convenient and stress-free. Here\'s what you need to know to ensure a smooth experience.\n\nFasting Requirements: Many tests require fasting for 8-12 hours. During this time, only plain water is allowed. Schedule your collection first thing in the morning to make fasting easier.\n\nHydration: Drink plenty of water before your collection (unless instructed otherwise). Good hydration makes veins easier to find and the process more comfortable.\n\nMedications: Continue taking your regular medications unless specifically instructed otherwise. Inform the phlebotomist about all medications you are taking.\n\nWhat to Keep Ready: Have your prescription or test order ready, along with a valid ID. Ensure there\'s a clean, well-lit space for the collection.\n\nAfter Collection: Apply pressure to the site for 2-3 minutes. Avoid strenuous activity for a few hours. Stay hydrated and eat a light meal after fasting tests.\n\nReport Timeline: Most reports are delivered within 24-48 hours via WhatsApp, email, and your patient dashboard.',
        author: 'Jeevan HealthCare at Home Team',
        category: 'Patient Guide',
        tags: ['home collection', 'sample collection', 'patient guide'],
        image: '',
        publishedAt: '2025-09-18',
        active: true,
      },
    ],
    active: true,
  },
  seo: {
    routes: {
      '/': { title: 'Jeevan HealthCare at Home — Trusted Diagnostics at Your Doorstep', description: 'Book lab tests from home with free sample collection. 5000+ tests, NABL certified labs, reports in 24 hours.', ogImage: '' },
      '/diagnostics': { title: 'Book Lab Tests Online at Home — Jeevan HealthCare at Home', description: '5000+ diagnostic tests with free home collection. NABL certified labs. Accurate digital reports in 24 hours.', ogImage: '' },
      '/services': { title: 'Complete Healthcare at Your Doorstep — Jeevan HealthCare at Home', description: 'Doctor consultations, lab tests, pharmacy, nursing, physiotherapy & more — all from one trusted platform.', ogImage: '' },
      '/blog': { title: 'Health Blog — Jeevan HealthCare at Home', description: 'Expert articles on preventive care, nutrition, wellness, and disease management from our healthcare professionals.', ogImage: '' },
      '/contact': { title: 'Contact Us — Jeevan HealthCare at Home', description: 'Get in touch with Jeevan HealthCare at Home for appointments, queries, feedback, and support. We are here to help.', ogImage: '' },
      '/about': { title: 'About Us — Jeevan HealthCare at Home', description: 'Learn about Jeevan HealthCare at Home\'s mission, team, and journey in providing trusted diagnostic services across India.', ogImage: '' },
      '/health-library': { title: 'Health Library — Jeevan HealthCare at Home', description: 'Comprehensive health information, test guides, symptom checker, and wellness resources.', ogImage: '' },
    },
  },
  stats: [
    { value: 100, suffix: 'K+', label: 'Patients Served', description: 'Trusted by families across India' },
    { value: 5000, suffix: '+', label: 'Tests Available', description: 'Comprehensive diagnostic menu' },
    { value: 150, suffix: '+', label: 'Health Packages', description: 'Curated for every need' },
    { value: 98, suffix: '%', label: 'Satisfaction', description: 'Patient happiness guaranteed' },
    { value: 15, suffix: '+', label: 'Years', description: 'Of excellence in diagnostics' },
    { value: 100, suffix: '+', label: 'Corporate Clients', description: 'Trusted by leading companies' },
  ],
  testimonials: [
    { id: 1, name: 'Priya Sharma', text: 'Excellent service! The phlebotomist arrived on time and was very professional. Reports were delivered digitally within 24 hours. Highly recommend Jeevan HealthCare at Home.', rating: 5, tag: 'Verified Patient', image: '' },
    { id: 2, name: 'Rajesh Kumar', text: 'I have been using Jeevan for all my family health checkups. The home collection service is a lifesaver for my elderly parents. Great experience every time.', rating: 5, tag: 'Regular Customer', image: '' },
    { id: 3, name: 'Anita Desai', text: 'The health packages are very affordable and comprehensive. The online reports are easy to understand with reference ranges clearly marked. Thank you Jeevan team!', rating: 5, tag: 'Verified Patient', image: '' },
    { id: 4, name: 'Vikram Patel', text: 'Outstanding diagnostic services. The NABL accreditation gives me confidence in the results. Doctor consultation after reports is a thoughtful addition.', rating: 4, tag: 'Verified Patient', image: '' },
    { id: 5, name: 'Sunita Reddy', text: 'Very happy with the corporate health camp organized by Jeevan at our office. Over 200 employees benefited. Seamless process from registration to report delivery.', rating: 5, tag: 'Corporate Client', image: '' },
  ],
  faqs: [
    { id: 1, question: 'How do I book a lab test?', answer: 'You can book a lab test by visiting our Diagnostics page, selecting the test you need, choosing a convenient time slot, and our phlebotomist will visit your home for sample collection.' },
    { id: 2, question: 'Is home sample collection free?', answer: 'Yes, home sample collection is completely free for all tests and health packages. Our trained phlebotomists follow strict safety and hygiene protocols.' },
    { id: 3, question: 'How will I receive my reports?', answer: 'Reports are delivered digitally via email and WhatsApp. You can also access them anytime from your patient dashboard on our website.' },
    { id: 4, question: 'Are your labs certified?', answer: 'Yes, all our labs are NABL accredited and follow strict quality control protocols. Our team of expert pathologists ensures accurate and timely results.' },
    { id: 5, question: 'Can I consult a doctor after my reports?', answer: 'Yes, we provide free doctor consultation with every health package. Our specialists will review your reports and provide personalized health advice.' },
  ],
  whyChooseJeevan: {
    stats: [
      { icon: '🏥', value: '10+', label: 'Years', sublabel: 'Of Excellence' },
      { icon: '🏠', value: '2 Lakh+', label: 'Home Collections', sublabel: 'Done Safely' },
      { icon: '🏢', value: '500+', label: 'Corporate Clients', sublabel: 'Trust Us' },
      { icon: '🧪', value: '2000+', label: 'Diagnostic Tests', sublabel: 'Available' },
    ],
    features: [
      { icon: '🏅', title: 'NABL Certified Labs', description: 'All tests are processed in accredited laboratories with stringent quality control.', badge: 'Certified' },
      { icon: '👨‍🔬', title: 'Expert Phlebotomists', description: 'Trained and experienced professionals for painless sample collection.', badge: 'Trained' },
      { icon: '🏠', title: 'Convenient Home Collection', description: 'Free sample collection at your preferred time slot, 7 days a week.', badge: 'Free' },
      { icon: '💰', title: 'Affordable Pricing', description: 'Best prices on all tests and health packages with no hidden charges.', badge: 'Best Price' },
      { icon: '📱', title: 'Digital Reports', description: 'Get your reports on WhatsApp, email, and patient dashboard instantly.', badge: 'Instant' },
      { icon: '🩺', title: 'Doctor Consultation', description: 'Free doctor consultation to help you understand your reports.', badge: 'Free' },
      { icon: '👨‍👩‍👧‍👦', title: 'Complete Family Care', description: 'Comprehensive healthcare solutions for every member of your family.', badge: 'Family' },
      { icon: '🧤', title: 'Safe & Hygienic Collection', description: 'Strict safety protocols including PPE kits and sanitized equipment.', badge: 'Safe' },
    ],
    active: true,
  },
  healthPackages: {
    pageTitle: 'Book Health Packages Online',
    pageSubtitle: 'Comprehensive health checkup packages from ₹499. Free home collection. Doctor consultation included.',
    featured: [
      { slug: 'full-body-health', badge: 'Most Booked', gradient: 'linear-gradient(135deg, #1866C9, #0F4A96)' },
      { slug: 'diabetes-care', badge: 'Top Rated', gradient: 'linear-gradient(135deg, #16a34a, #22c55e)' },
      { slug: 'cardiac-care', badge: 'Best Value', gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)' },
      { slug: 'womens-health', badge: 'Popular', gradient: 'linear-gradient(135deg, #dc2626, #ef4444)' },
    ],
    overrides: {},
    active: true,
  },
  diagnostics: {
    pageTitle: 'Book Lab Tests Online at Home',
    pageSubtitle: '5000+ diagnostic tests. Free home collection. NABL certified labs. Accurate digital reports.',
    bannerHeading: '📋 Have a prescription?',
    bannerText: 'Upload your doctor\'s prescription and we\'ll recommend the right tests.',
    bannerCta: '📤 Upload Prescription',
    priceRanges: [
      { label: 'Under ₹500', min: 0, max: 500 },
      { label: '₹500 - ₹1500', min: 500, max: 1500 },
      { label: 'Above ₹1500', min: 1500, max: 999999 },
    ],
    categories: [
      { id: 'hematology', name: 'Hematology', icon: '🩸', description: 'Blood-related tests including CBC, iron studies, and coagulation profiles.', heroImage: '', active: true },
      { id: 'diabetes', name: 'Diabetes', icon: '🩸', description: 'Blood sugar monitoring, HbA1c, and diabetes management tests.', heroImage: '', active: true },
      { id: 'thyroid', name: 'Thyroid', icon: '🦋', description: 'Thyroid function tests for metabolism and hormonal health.', heroImage: '', active: true },
      { id: 'cardiac', name: 'Cardiac', icon: '❤️', description: 'Heart health assessment with lipid profiles and cardiac markers.', heroImage: '', active: true },
      { id: 'vitamins', name: 'Vitamins', icon: '💊', description: 'Vitamin deficiency testing including B12, D, and folate.', heroImage: '', active: true },
      { id: 'full-body', name: 'Full Body', icon: '🧬', description: 'Comprehensive health checkup packages for complete wellness.', heroImage: '', active: true },
      { id: 'liver', name: 'Liver', icon: '🫁', description: 'Liver function tests for detecting liver health and damage.', heroImage: '', active: true },
      { id: 'kidney', name: 'Kidney', icon: '🫘', description: 'Kidney function tests including creatinine, BUN, and electrolytes.', heroImage: '', active: true },
      { id: 'hormones', name: 'Hormones', icon: '🧪', description: 'Hormonal panel testing for reproductive and endocrine health.', heroImage: '', active: true },
      { id: 'anemia', name: 'Anemia', icon: '🩸', description: 'Anemia screening including iron studies and hemoglobin analysis.', heroImage: '', active: true },
      { id: 'infection', name: 'Infection', icon: '🦠', description: 'Infection markers including CRP, WBC, and specific pathogen tests.', heroImage: '', active: true },
      { id: 'cancer', name: 'Cancer Screening', icon: '🎗️', description: 'Cancer screening and tumor marker tests for early detection.', heroImage: '', active: true },
      { id: 'arthritis', name: 'Arthritis', icon: '🦴', description: 'Arthritis and inflammation markers including RA factor and uric acid.', heroImage: '', active: true },
      { id: 'pregnancy', name: 'Pregnancy', icon: '🤰', description: 'Pregnancy-related tests including hCG and prenatal screening.', heroImage: '', active: true },
      { id: 'allergy', name: 'Allergy', icon: '🤧', description: 'Allergy testing for common allergens and immune response.', heroImage: '', active: true },
    ],
    freeHomeCollectionTag: 'Free Home Collection',
    active: true,
  },
};

const useCmsStore = create((set, get) => ({
  content: load(CMS_KEY, JSON.stringify(defaults)),

  refresh: () => set({ content: load(CMS_KEY, JSON.stringify(defaults)) }),

  getContent: () => load(CMS_KEY, JSON.stringify(defaults)),

  // Hero
  updateHero: (data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)), hero: { ...get().content.hero, ...data } };
    save(CMS_KEY, content);
    set({ content });
  },

  // Services
  updateService: (id, data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.services = content.services.map(s => s.id === id ? { ...s, ...data } : s);
    save(CMS_KEY, content);
    set({ content });
  },

  addService: (service) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.services = [...content.services, { ...service, id: 'svc-' + Date.now().toString(36) }];
    save(CMS_KEY, content);
    set({ content });
  },

  deleteService: (id) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.services = content.services.filter(s => s.id !== id);
    save(CMS_KEY, content);
    set({ content });
  },

  // Services Page
  updateServicesPage: (data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)), servicesPage: { ...get().content.servicesPage, ...data } };
    save(CMS_KEY, content);
    set({ content });
  },

  updateServicesPageQuickAction: (index, data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    if (content.servicesPage.quickActions[index]) {
      content.servicesPage.quickActions[index] = { ...content.servicesPage.quickActions[index], ...data };
      save(CMS_KEY, content);
      set({ content });
    }
  },

  addServicesPageQuickAction: (action) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.servicesPage.quickActions = [...content.servicesPage.quickActions, action];
    save(CMS_KEY, content);
    set({ content });
  },

  deleteServicesPageQuickAction: (index) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.servicesPage.quickActions = content.servicesPage.quickActions.filter((_, i) => i !== index);
    save(CMS_KEY, content);
    set({ content });
  },

  updateServicesPageCategory: (index, data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    if (content.servicesPage.categories[index]) {
      content.servicesPage.categories[index] = { ...content.servicesPage.categories[index], ...data };
      save(CMS_KEY, content);
      set({ content });
    }
  },

  addServicesPageCategoryItem: (catIndex, item) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    if (content.servicesPage.categories[catIndex]) {
      content.servicesPage.categories[catIndex].items = [...content.servicesPage.categories[catIndex].items, item];
      save(CMS_KEY, content);
      set({ content });
    }
  },

  deleteServicesPageCategoryItem: (catIndex, itemIndex) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    if (content.servicesPage.categories[catIndex]) {
      content.servicesPage.categories[catIndex].items = content.servicesPage.categories[catIndex].items.filter((_, i) => i !== itemIndex);
      save(CMS_KEY, content);
      set({ content });
    }
  },

  // Trust strip
  updateTrustStrip: (data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)), trustStrip: { ...get().content.trustStrip, ...data } };
    save(CMS_KEY, content);
    set({ content });
  },

  // Stats
  updateStats: (stats) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)), stats };
    save(CMS_KEY, content);
    set({ content });
  },

  // Testimonials
  updateTestimonial: (id, data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.testimonials = content.testimonials.map(t => t.id === id ? { ...t, ...data } : t);
    save(CMS_KEY, content);
    set({ content });
  },

  addTestimonial: (testimonial) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.testimonials = [...content.testimonials, { ...testimonial, id: Date.now(), createdAt: new Date().toISOString() }];
    save(CMS_KEY, content);
    set({ content });
  },

  deleteTestimonial: (id) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.testimonials = content.testimonials.filter(t => t.id !== id);
    save(CMS_KEY, content);
    set({ content });
  },

  // FAQs
  updateFaq: (id, data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.faqs = content.faqs.map(f => f.id === id ? { ...f, ...data } : f);
    save(CMS_KEY, content);
    set({ content });
  },

  addFaq: (faq) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    const maxId = Math.max(...content.faqs.map(f => f.id), 0);
    content.faqs = [...content.faqs, { ...faq, id: maxId + 1 }];
    save(CMS_KEY, content);
    set({ content });
  },

  deleteFaq: (id) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.faqs = content.faqs.filter(f => f.id !== id);
    save(CMS_KEY, content);
    set({ content });
  },

  // Blog
  addBlogPost: (post) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    const maxId = Math.max(...content.blog.posts.map(p => p.id), 0);
    content.blog.posts = [{ ...post, id: maxId + 1 }, ...content.blog.posts];
    save(CMS_KEY, content);
    set({ content });
  },

  updateBlogPost: (id, data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.blog.posts = content.blog.posts.map(p => p.id === id ? { ...p, ...data } : p);
    save(CMS_KEY, content);
    set({ content });
  },

  deleteBlogPost: (id) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.blog.posts = content.blog.posts.filter(p => p.id !== id);
    save(CMS_KEY, content);
    set({ content });
  },

  updateBlogPage: (data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)), blog: { ...get().content.blog, ...data } };
    save(CMS_KEY, content);
    set({ content });
  },

  // SEO
  updateSeoRoute: (route, data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.seo.routes[route] = { ...(content.seo.routes[route] || {}), ...data };
    save(CMS_KEY, content);
    set({ content });
  },

  addSeoRoute: (route, data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.seo.routes[route] = data;
    save(CMS_KEY, content);
    set({ content });
  },

  deleteSeoRoute: (route) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    delete content.seo.routes[route];
    save(CMS_KEY, content);
    set({ content });
  },

  // Why Choose Jeevan
  updateWhyChoose: (data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)), whyChooseJeevan: { ...get().content.whyChooseJeevan, ...data } };
    save(CMS_KEY, content);
    set({ content });
  },

  // Diagnostics
  updateDiagnostics: (data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)), diagnostics: { ...get().content.diagnostics, ...data } };
    save(CMS_KEY, content);
    set({ content });
  },

  updateDiagnosticsCategory: (id, data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.diagnostics.categories = content.diagnostics.categories.map(c => c.id === id ? { ...c, ...data } : c);
    save(CMS_KEY, content);
    set({ content });
  },

  addDiagnosticsCategory: (cat) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.diagnostics.categories = [...content.diagnostics.categories, { ...cat, id: 'cat-' + Date.now().toString(36), active: true }];
    save(CMS_KEY, content);
    set({ content });
  },

  deleteDiagnosticsCategory: (id) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.diagnostics.categories = content.diagnostics.categories.filter(c => c.id !== id);
    save(CMS_KEY, content);
    set({ content });
  },

  // Health Packages
  updateHealthPackages: (data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)), healthPackages: { ...get().content.healthPackages, ...data } };
    save(CMS_KEY, content);
    set({ content });
  },

  updateHealthPackageFeatured: (index, data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    if (content.healthPackages.featured[index]) {
      content.healthPackages.featured[index] = { ...content.healthPackages.featured[index], ...data };
      save(CMS_KEY, content);
      set({ content });
    }
  },

  addHealthPackageFeatured: (entry) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.healthPackages.featured = [...content.healthPackages.featured, entry];
    save(CMS_KEY, content);
    set({ content });
  },

  removeHealthPackageFeatured: (index) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.healthPackages.featured = content.healthPackages.featured.filter((_, i) => i !== index);
    save(CMS_KEY, content);
    set({ content });
  },

  updateHealthPackageOverride: (slug, data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    content.healthPackages.overrides[slug] = { ...(content.healthPackages.overrides[slug] || {}), ...data };
    save(CMS_KEY, content);
    set({ content });
  },

  updatePriceRange: (index, data) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    if (content.diagnostics.priceRanges[index]) {
      content.diagnostics.priceRanges[index] = { ...content.diagnostics.priceRanges[index], ...data };
      save(CMS_KEY, content);
      set({ content });
    }
  },

  // Section visibility (future use)
  toggleSection: (section, active) => {
    const content = { ...load(CMS_KEY, JSON.stringify(defaults)) };
    if (content[section]) content[section] = { ...content[section], active };
    save(CMS_KEY, content);
    set({ content });
  },

  // Reset everything to defaults
  resetContent: () => {
    save(CMS_KEY, defaults);
    set({ content: defaults });
  },
}));

export { defaults };
export default useCmsStore;
