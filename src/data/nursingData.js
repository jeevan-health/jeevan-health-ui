export const STORAGE_KEYS = {
  BOOKINGS: 'jh_nursing_bookings',
  CAREGIVERS: 'jh_nursing_caregivers',
  SERVICES: 'jh_nursing_services',
  NOTIFICATIONS: 'jh_nursing_notifications',
  PACKAGES: 'jh_nursing_packages',
  LEADS: 'jh_nurse_leads',
  ASSESSMENTS: 'jh_nurse_assessments',
  CARE_PLANS: 'jh_nurse_care_plans',
  EQUIPMENT: 'jh_nurse_equipment',
  CRM: 'jh_nurse_crm',
};

export const nursingCategories = [
  { id: 'wound-care', name: 'Wound & Dressing Care', icon: '🩹', color: '#E11D48', slug: 'wound-care', description: 'Professional wound cleaning, dressing changes, and pressure ulcer care at home.', services: ['Wound Dressing', 'Pressure Ulcer Care', 'Stitch Removal', 'Burn Care', 'Diabetic Foot Care'] },
  { id: 'injections', name: 'Injections & IV Therapy', icon: '💉', color: '#3B82F6', slug: 'injections-infusions', description: 'Intravenous (IV) therapy, injections, and infusion services at home.', services: ['IV Fluid Administration', 'Vitamin Infusion', 'IM/IV Injections', 'Chemotherapy Support', 'Antibiotic Infusion'] },
  { id: 'elderly-care', name: 'Elderly & Palliative Care', icon: '👴', color: '#F59E0B', slug: 'elderly-care', description: 'Compassionate elderly care, palliative support, and end-of-life care at home.', services: ['Elderly Companion', 'Palliative Care', 'Dementia Care', 'Bedside Care', 'Hospice Support'] },
  { id: 'post-surgery', name: 'Post-Surgery Care', icon: '🏥', color: '#8B5CF6', slug: 'post-surgery-care', description: 'Recovery assistance after surgery — wound monitoring, medication, and mobility support.', services: ['Post-Surgical Monitoring', 'Medication Management', 'Catheter Care', 'Oxygen Therapy', 'Mobility Assistance'] },
  { id: 'mother-baby', name: 'Mother & Baby Care', icon: '👶', color: '#EC4899', slug: 'mother-baby-care', description: 'Postnatal care, newborn support, lactation consultation, and mother wellness.', services: ['Newborn Care', 'Lactation Support', 'Postnatal Massage', 'Umbilical Cord Care', 'Mother Wellness Check'] },
  { id: 'bedside', name: '24/7 Bedside Nursing', icon: '🛏️', color: '#0D9488', slug: 'bedside-nursing', description: 'Round-the-clock professional nursing care for critically ill or bedridden patients.', services: ['12-Hour Shift Nursing', '24-Hour Shift Nursing', 'ICU at Home', 'Vital Monitoring', 'Medication Round'] },
  { id: 'rehab', name: 'Rehabilitation Therapy', icon: '💪', color: '#F97316', slug: 'rehabilitation', description: 'Speech, occupational, and physical rehabilitation therapy at home.', services: ['Speech Therapy', 'Occupational Therapy', 'Cognitive Rehab', 'Post-Stroke Rehab', 'Breathing Exercises'] },
  { id: 'icu-home', name: 'ICU at Home', icon: '🆘', color: '#DC2626', slug: 'icu-at-home', description: 'Hospital-grade critical care with trained ICU nurses, ventilators, and multipara monitoring at home.', services: ['Ventilator Care', 'Oxygen Monitoring', 'Tracheostomy Care', 'Central Line Care', 'Continuous Vital Monitoring'] },
  { id: 'palliative', name: 'Palliative & End-of-Life Care', icon: '🕊️', color: '#7C3AED', slug: 'palliative-care', description: 'Compassionate end-of-life care focusing on comfort, dignity, pain management, and emotional support.', services: ['Pain Management', 'Comfort Care', 'Emotional Support', 'Family Guidance', 'Symptom Control'] },
];

export const nursingServices = [
  { id: 1, category: 'wound-care', name: 'Wound Dressing', slug: 'wound-dressing', price: 499, originalPrice: 699, duration: '30 min', description: 'Professional wound cleaning and dressing change by trained nurses', longDesc: 'Our skilled nurses provide wound cleaning and dressing changes using sterile techniques.', includes: ['Wound Assessment', 'Sterile Cleaning', 'Dressing Application', 'Aftercare Guidance'], nurseLevel: 'Staff Nurse', popular: true },
  { id: 2, category: 'wound-care', name: 'Pressure Ulcer Care', slug: 'pressure-ulcer-care', price: 699, originalPrice: 899, duration: '45 min', description: 'Specialized care for bedsores and pressure ulcers', longDesc: 'Comprehensive pressure ulcer management for Stage 1-4 ulcers.', includes: ['Staging Assessment', 'Wound Debridement', 'Specialized Dressings', 'Repositioning Plan'], nurseLevel: 'Wound Care Specialist', popular: false },
  { id: 3, category: 'wound-care', name: 'Stitch Removal', slug: 'stitch-removal', price: 299, originalPrice: 399, duration: '15 min', description: 'Painless stitch/suture removal by experienced nurses', longDesc: 'Safe and hygienic removal of surgical sutures.', includes: ['Wound Inspection', 'Sterile Suture Removal', 'Cleaning & Dressing', 'Healing Assessment'], nurseLevel: 'Staff Nurse', popular: false },
  { id: 4, category: 'injections', name: 'IV Fluid Administration', slug: 'iv-fluid-administration', price: 799, originalPrice: 999, duration: '60 min', description: 'IV fluids, electrolytes, and hydration therapy at home', longDesc: 'IV fluid administration for dehydration, electrolyte imbalance, or post-illness recovery.', includes: ['IV Cannulation', 'Fluid Administration', 'Vital Monitoring', 'Line Removal & Aftercare'], nurseLevel: 'Staff Nurse', popular: true },
  { id: 5, category: 'injections', name: 'Vitamin Infusion', slug: 'vitamin-infusion', price: 1499, originalPrice: 1999, duration: '45 min', description: 'IV vitamin drips — Vitamin C, B complex, Glutathione boosters', longDesc: 'Revitalizing IV vitamin therapy at home.', includes: ['Health Assessment', 'Custom Vitamin Mix', 'IV Administration', 'Post-Infusion Care'], nurseLevel: 'IV Therapy Specialist', popular: false },
  { id: 6, category: 'injections', name: 'IM/IV Injections', slug: 'im-iv-injections', price: 199, originalPrice: 299, duration: '15 min', description: 'Intramuscular and intravenous injections at home', longDesc: 'Administration of prescribed intramuscular or intravenous injections.', includes: ['Medication Verification', 'Injection Administration', 'Site Care', 'Observation Period'], nurseLevel: 'Staff Nurse', popular: false },
  { id: 7, category: 'elderly-care', name: 'Elderly Companion', slug: 'elderly-companion', price: 3999, originalPrice: 5499, duration: '8 hours', description: 'Dedicated companion for elderly — daily care, medication reminders, and company', longDesc: 'A trained caregiver stays with your elderly loved one.', includes: ['Companionship', 'Medication Reminders', 'Mobility Assistance', 'Meal Support', 'Activity Engagement'], nurseLevel: 'Trained Caregiver', popular: true },
  { id: 8, category: 'elderly-care', name: 'Palliative Care', slug: 'palliative-care', price: 5999, originalPrice: 7999, duration: '12 hours', description: 'Compassionate end-of-life care with pain management and emotional support', longDesc: 'Specialized palliative care focusing on comfort and dignity.', includes: ['Pain Management', 'Symptom Control', 'Emotional Support', 'Family Guidance', 'Physician Coordination'], nurseLevel: 'Palliative Care Nurse', popular: false },
  { id: 9, category: 'elderly-care', name: 'Dementia Care', slug: 'dementia-care', price: 4999, originalPrice: 6999, duration: '8 hours', description: 'Specialized care for Alzheimer\'s and dementia patients', longDesc: 'Dementia-trained caregivers provide a safe environment.', includes: ['Memory Activities', 'Wandering Prevention', 'Nutritional Support', 'Communication Assistance', 'Safety Supervision'], nurseLevel: 'Dementia Care Specialist', popular: false },
  { id: 10, category: 'post-surgery', name: 'Post-Surgical Monitoring', slug: 'post-surgical-monitoring', price: 999, originalPrice: 1299, duration: '60 min', description: 'Professional monitoring after surgery — vitals, wound check, medication', longDesc: 'Post-surgical nursing visit to monitor recovery.', includes: ['Vital Signs Monitoring', 'Wound Inspection', 'Medication Administration', 'Recovery Assessment'], nurseLevel: 'Staff Nurse', popular: true },
  { id: 11, category: 'post-surgery', name: 'Catheter Care', slug: 'catheter-care', price: 399, originalPrice: 599, duration: '30 min', description: 'Urinary catheter insertion, care, and removal at home', longDesc: 'Professional urinary catheter services.', includes: ['Catheter Insertion/Change', 'Bag Emptying & Care', 'Site Cleaning', 'Infection Prevention Guidance'], nurseLevel: 'Staff Nurse', popular: false },
  { id: 12, category: 'post-surgery', name: 'Oxygen Therapy', slug: 'oxygen-therapy', price: 1499, originalPrice: 1999, duration: '8 hours', description: 'Oxygen concentrator setup and monitoring at home', longDesc: 'Complete oxygen therapy setup at home.', includes: ['Equipment Setup', 'Flow Rate Adjustment', 'Saturation Monitoring', 'Equipment Maintenance Guidance'], nurseLevel: 'Respiratory Care Nurse', popular: false },
  { id: 13, category: 'mother-baby', name: 'Newborn Care', slug: 'newborn-care', price: 699, originalPrice: 899, duration: '60 min', description: 'Complete newborn care — bathing, feeding, umbilical cord care', longDesc: 'Expert newborn care services.', includes: ['Baby Bath & Hygiene', 'Cord Care', 'Feeding Support', 'Weight Check', 'Parent Guidance'], nurseLevel: 'Pediatric Nurse', popular: true },
  { id: 14, category: 'mother-baby', name: 'Lactation Support', slug: 'lactation-support', price: 999, originalPrice: 1299, duration: '60 min', description: 'Breastfeeding consultation and lactation support at home', longDesc: 'Certified lactation consultant visit.', includes: ['Latch Assessment', 'Feeding Observation', 'Personalized Plan', 'Pumping Guidance', 'Follow-up Support'], nurseLevel: 'Lactation Consultant', popular: false },
  { id: 15, category: 'mother-baby', name: 'Postnatal Massage', slug: 'postnatal-massage', price: 799, originalPrice: 999, duration: '45 min', description: 'Therapeutic postnatal massage for new mothers', longDesc: 'Soothing full-body postnatal massage.', includes: ['Full Body Massage', 'Abdominal Binding', 'Warm Compress', 'Relaxation Guidance'], nurseLevel: 'Trained Therapist', popular: false },
  { id: 16, category: 'bedside', name: '12-Hour Shift Nursing', slug: '12-hour-shift-nursing', price: 2999, originalPrice: 3999, duration: '12 hours', description: 'Professional bedside nurse for 12-hour day or night shift', longDesc: 'A qualified nurse provides continuous monitoring.', includes: ['Continuous Monitoring', 'Medication Management', 'Personal Care', 'Vital Signs Tracking', 'Family Updates'], nurseLevel: 'Staff Nurse', popular: true },
  { id: 17, category: 'bedside', name: '24-Hour Shift Nursing', slug: '24-hour-shift-nursing', price: 5499, originalPrice: 6999, duration: '24 hours', description: 'Round-the-clock nursing care with 2 nurses in alternating shifts', longDesc: 'Comprehensive 24-hour care.', includes: ['24/7 Monitoring', 'All Medications', 'Personal Care', 'Feeding & Nutrition', 'Mobility Assistance', 'Hourly Updates'], nurseLevel: 'Senior Staff Nurse', popular: false },
  { id: 18, category: 'bedside', name: 'ICU at Home', slug: 'icu-at-home', price: 9999, originalPrice: 12999, duration: '24 hours', description: 'ICU-level monitoring and care with critical care nurse at home', longDesc: 'Hospital-grade critical care at home.', includes: ['ICU Nurse', 'Multipara Monitor', 'Oxygen Support', 'Suction Machine', 'Ventilator Management', 'Physician Tele-consult'], nurseLevel: 'Critical Care Nurse', popular: false },
  { id: 19, category: 'rehab', name: 'Speech Therapy', slug: 'speech-therapy', price: 999, originalPrice: 1299, duration: '45 min', description: 'Speech and language therapy for all ages at home', longDesc: 'Professional speech therapy.', includes: ['Speech Assessment', 'Therapy Exercises', 'Home Practice Plan', 'Progress Tracking'], nurseLevel: 'Speech Therapist', popular: false },
  { id: 20, category: 'rehab', name: 'Occupational Therapy', slug: 'occupational-therapy', price: 999, originalPrice: 1299, duration: '45 min', description: 'Occupational therapy to regain daily living skills', longDesc: 'Helps patients regain independence.', includes: ['Functional Assessment', 'Daily Living Training', 'Home Modification Advice', 'Adaptive Equipment Training'], nurseLevel: 'Occupational Therapist', popular: false },
  { id: 21, category: 'rehab', name: 'Post-Stroke Rehab', slug: 'post-stroke-rehab', price: 1299, originalPrice: 1699, duration: '60 min', description: 'Comprehensive post-stroke rehabilitation at home', longDesc: 'Multidisciplinary post-stroke rehabilitation.', includes: ['Mobility Training', 'Speech Exercises', 'Daily Living Rehab', 'Family Training', 'Progress Assessment'], nurseLevel: 'Rehab Specialist', popular: true },
  { id: 22, category: 'icu-home', name: 'Ventilator Patient Care', slug: 'ventilator-care', price: 14999, originalPrice: 19999, duration: '24 hours', description: 'Ventilator patient care with trained ICU nurse at home', longDesc: 'Full ventilator management by trained critical care nurse.', includes: ['Ventilator Management', 'Oxygen Monitoring', 'Tracheostomy Care', 'IV Line Management', 'Central Line Care', 'Emergency Escalation'], nurseLevel: 'Critical Care Nurse', popular: false },
  { id: 23, category: 'icu-home', name: 'Tracheostomy Care', slug: 'tracheostomy-care', price: 7999, originalPrice: 9999, duration: '12 hours', description: 'Specialized tracheostomy tube care and suctioning', longDesc: 'Expert tracheostomy care with suction management.', includes: ['Tube Cleaning', 'Suction Management', 'Site Care', 'Humidification', 'Emergency Protocol'], nurseLevel: 'Critical Care Nurse', popular: false },
  { id: 24, category: 'palliative', name: 'Pain Management', slug: 'pain-management', price: 2999, originalPrice: 3999, duration: '2 hours', description: 'Comprehensive pain assessment and management at home', longDesc: 'Specialized pain management for chronic and terminal conditions.', includes: ['Pain Assessment', 'Medication Management', 'Comfort Positioning', 'Relaxation Techniques', 'Family Guidance'], nurseLevel: 'Palliative Care Nurse', popular: false },
  { id: 25, category: 'palliative', name: 'End-of-Life Comfort Care', slug: 'end-of-life-care', price: 5999, originalPrice: 7999, duration: '12 hours', description: 'Dignified end-of-life care with symptom management', longDesc: 'Compassionate end-of-life care focusing on comfort and dignity.', includes: ['Symptom Management', 'Comfort Care', 'Emotional Support', 'Family Guidance', 'Spiritual Support'], nurseLevel: 'Palliative Care Nurse', popular: false },
];

export const nurseLevels = [
  { id: 'trained-caregiver', name: 'Trained Caregiver', hourlyRate: 399, description: 'Certified caregiver for non-medical support', color: '#10B981' },
  { id: 'staff-nurse', name: 'Staff Nurse', hourlyRate: 599, description: 'Qualified GNM/B.Sc Nurse for medical care', color: '#3B82F6' },
  { id: 'senior-nurse', name: 'Senior Staff Nurse', hourlyRate: 799, description: 'Experienced nurse with 5+ years in critical care', color: '#8B5CF6' },
  { id: 'specialist', name: 'Specialist Nurse', hourlyRate: 999, description: 'Super specialist — ICU, wound care, palliative, or rehab', color: '#E11D48' },
];

export const nurses = [
  { id: 1, name: 'Sr. Lakshmi Devi', slug: 'lakshmi-devi', level: 'staff-nurse', qualifications: 'GNM', experience: 8, rating: 4.9, sessions: 2150, image: '👩‍⚕️', languages: ['Telugu', 'English', 'Hindi'], specialties: ['wound-care', 'injections', 'post-surgery'], availability: ['Today 2 PM', 'Tomorrow 9 AM', 'Tomorrow 4 PM'], isActive: true, verified: true, policeVerified: true, bio: 'Dedicated staff nurse with 8 years of experience in wound care, injections, and post-surgical care. Compassionate and patient-focused.', certs: ['GNM Certified', 'BLS Certified', 'Wound Care Specialist'] },
  { id: 2, name: 'Sr. Priya Sharma', slug: 'priya-sharma', level: 'senior-nurse', qualifications: 'B.Sc Nursing', experience: 12, rating: 4.8, sessions: 3400, image: '👩‍⚕️', languages: ['Hindi', 'English', 'Punjabi'], specialties: ['bedside', 'elderly-care', 'post-surgery'], availability: ['Today 6 PM', 'Tomorrow 8 AM'], isActive: true, verified: true, policeVerified: true, bio: 'Senior nurse with over a decade of experience in bedside care, elderly care, and post-surgical monitoring. Expertise in critical patient management.', certs: ['B.Sc Nursing', 'ACLS Certified', 'Geriatric Care Certified'] },
  { id: 3, name: 'Sr. Ananya Reddy', slug: 'ananya-reddy', level: 'specialist', qualifications: 'M.Sc Nursing (Critical Care)', experience: 10, rating: 4.9, sessions: 1800, image: '👩‍⚕️', languages: ['Telugu', 'English', 'Tamil'], specialties: ['bedside', 'rehab', 'wound-care', 'icu-home'], availability: ['Today 4 PM', 'Tomorrow 11 AM', 'Day after 9 AM'], isActive: true, verified: true, policeVerified: true, bio: 'Critical care specialist with M.Sc Nursing. Skilled in ICU at home, ventilator management, rehabilitation, and complex wound care.', certs: ['M.Sc Critical Care', 'CCRN Certified', 'Ventilator Management'] },
  { id: 4, name: 'Mrs. Sunita Patil', slug: 'sunita-patil', level: 'staff-nurse', qualifications: 'GNM', experience: 6, rating: 4.7, sessions: 1200, image: '👩‍⚕️', languages: ['Marathi', 'Hindi', 'English'], specialties: ['mother-baby', 'injections', 'post-surgery', 'palliative'], availability: ['Today 10 AM', 'Tomorrow 2 PM'], isActive: true, verified: true, policeVerified: true, bio: 'Experienced in mother-baby care, postnatal support, and palliative care. Known for gentle bedside manner and family communication.', certs: ['GNM Certified', 'NICU Training', 'Palliative Care Certified'] },
  { id: 5, name: 'Sr. Fatima Begum', slug: 'fatima-begum', level: 'specialist', qualifications: 'B.Sc Nursing (Wound Care)', experience: 9, rating: 4.8, sessions: 1600, image: '👩‍⚕️', languages: ['Urdu', 'Hindi', 'English'], specialties: ['wound-care', 'elderly-care', 'palliative'], availability: ['Today 8 AM', 'Tomorrow 3 PM'], isActive: true, verified: true, policeVerified: true, bio: 'Wound care specialist with B.Sc Nursing. Expertise in chronic wound management, pressure ulcers, diabetic foot care, and palliative support.', certs: ['B.Sc Nursing', 'Wound Care Specialist', 'Diabetic Foot Care'] },
  { id: 6, name: 'Ms. Jennifer D\'Souza', slug: 'jennifer-dsouza', level: 'senior-nurse', qualifications: 'B.Sc Nursing (NICU)', experience: 14, rating: 4.9, sessions: 2900, image: '👩‍⚕️', languages: ['English', 'Hindi', 'Kannada'], specialties: ['mother-baby', 'injections', 'bedside', 'icu-home'], availability: ['Tomorrow 7 AM', 'Day after 10 AM'], isActive: true, verified: true, policeVerified: true, bio: 'Senior nurse with NICU specialization. Extensive experience in newborn care, ICU at home, and bedside nursing across critical cases.', certs: ['B.Sc Nursing (NICU)', 'NALS Certified', 'Critical Care Nursing'] },
  { id: 7, name: 'Sr. Rajeshwari Nair', slug: 'rajeshwari-nair', level: 'staff-nurse', qualifications: 'B.Sc Nursing', experience: 5, rating: 4.6, sessions: 890, image: '👩‍⚕️', languages: ['Malayalam', 'English', 'Hindi'], specialties: ['wound-care', 'injections', 'post-surgery'], availability: ['Today 11 AM', 'Tomorrow 1 PM'], isActive: true, verified: true, policeVerified: true, bio: 'Dedicated B.Sc Nursing graduate with 5 years experience in wound dressing, IV therapy, and post-operative care. Friendly and reliable.', certs: ['B.Sc Nursing', 'IV Therapy Certified', 'BLS Certified'] },
  { id: 8, name: 'Mr. Vinod Kumar', slug: 'vinod-kumar', level: 'staff-nurse', qualifications: 'GNM', experience: 7, rating: 4.7, sessions: 1100, image: '👨‍⚕️', languages: ['Hindi', 'English', 'Telugu'], specialties: ['bedside', 'icu-home', 'post-surgery'], availability: ['Today 5 PM', 'Tomorrow 10 AM', 'Day after 8 AM'], isActive: true, verified: true, policeVerified: true, bio: 'Male nurse specializing in bedside care, ICU monitoring, and post-surgical support. Strong with critical patient handling and family coordination.', certs: ['GNM Certified', 'ICU Nursing', 'ACLS Certified'] },
];

export const nursingPackages = [
  { id: 'essentials', name: 'Essential Care', services: 3, price: 1299, originalPrice: 1797, popular: false, includes: ['Wound Dressing', '1 Injection', 'Vital Check'], description: 'Perfect for post-surgery follow-up care' },
  { id: 'recovery', name: 'Recovery Plus', services: 6, price: 2499, originalPrice: 3594, popular: true, includes: ['2 Wound Dressings', '2 Injections', '1 IV Fluids', 'Vital Monitoring'], description: 'Most popular for recovery at home' },
  { id: 'comprehensive', name: 'Comprehensive Care', services: 10, price: 3999, originalPrice: 5990, popular: false, includes: ['5 Dressings', '3 Injections', '1 IV Therapy', 'Catheter Care', 'Dr. Teleconsult'], description: 'Complete care package for chronic conditions' },
  { id: 'monthly', name: 'Monthly Wellness', services: 0, price: 9999, originalPrice: 14999, popular: false, isMonthly: true, includes: ['Unlimited Visits', 'Priority Scheduling', 'Free Consultations', 'Care Coordination', 'Family Support'], description: 'Subscription plan for ongoing care needs' },
];

export const nursingFAQs = [
  { q: 'How quickly can I book a nurse?', a: 'Most services can be scheduled within 2-4 hours. For urgent needs, we offer priority booking with same-day availability.' },
  { q: 'Are your nurses qualified?', a: 'All our nurses are fully qualified with GNM, B.Sc Nursing, or M.Sc Nursing degrees, registered with the state nursing council, and have a minimum of 3 years clinical experience.' },
  { q: 'What areas do you serve?', a: 'We currently serve all areas of Hyderabad, Secunderabad, and surrounding suburbs up to 30 km radius.' },
  { q: 'Can I choose a specific nurse?', a: 'Yes, you can browse our nurse profiles and request a specific nurse. If they are available, we will assign them to your case.' },
  { q: 'What if I need to cancel?', a: 'Free cancellation up to 4 hours before the scheduled visit. Late cancellations may incur a 50% charge.' },
  { q: 'Do you provide medical equipment?', a: 'Yes, we can arrange oxygen concentrators, hospital beds, wheelchairs, suction machines, and other medical equipment on rent.' },
  { q: 'How does the care assessment work?', a: 'After booking, our care manager calls you to understand the medical condition, required care level, shift preferences, and equipment needs. We then create a personalized care plan.' },
  { q: 'Can I upgrade my care plan later?', a: 'Yes, you can upgrade from a nurse visit to shift-based care or add additional services at any time.' },
];

export const trustFeatures = [
  { icon: '✅', title: 'Verified Nurses', desc: 'All nurses verified & registered' },
  { icon: '🕒', title: 'Quick Booking', desc: 'Same-day service available' },
  { icon: '🏠', title: 'At Your Doorstep', desc: 'Full Hyderabad coverage' },
  { icon: '💰', title: 'Affordable Pricing', desc: 'Starting at just ₹199' },
  { icon: '📋', title: 'Digital Reports', desc: 'Care summary after each visit' },
  { icon: '🆘', title: '24/7 Support', desc: 'Round-the-clock assistance' },
];

export const equipmentItems = [
  { id: 1, name: 'Oxygen Concentrator', slug: 'oxygen-concentrator', icon: '🫁', price: 2500, duration: '/day', description: '5L-10L oxygen concentrator with humidifier', category: 'respiratory' },
  { id: 2, name: 'Hospital Bed', slug: 'hospital-bed', icon: '🛏️', price: 1500, duration: '/day', description: 'Electric semi-fowler bed with mattress', category: 'mobility' },
  { id: 3, name: 'Wheelchair', slug: 'wheelchair', icon: '♿', price: 500, duration: '/day', description: 'Foldable wheelchair with comfort cushion', category: 'mobility' },
  { id: 4, name: 'Suction Machine', slug: 'suction-machine', icon: '🩺', price: 800, duration: '/day', description: 'Portable suction machine for tracheostomy', category: 'respiratory' },
  { id: 5, name: 'Multipara Monitor', slug: 'multipara-monitor', icon: '📊', price: 1200, duration: '/day', description: 'Monitor for BP, pulse, SpO2, temperature', category: 'monitoring' },
  { id: 6, name: 'Nebulizer', slug: 'nebulizer', icon: '💨', price: 200, duration: '/day', description: 'Mesh nebulizer for medication delivery', category: 'respiratory' },
  { id: 7, name: 'Patient Lift', slug: 'patient-lift', icon: '🦾', price: 1000, duration: '/day', description: 'Hydraulic patient lift for safe transfers', category: 'mobility' },
  { id: 8, name: 'Commode Chair', slug: 'commode-chair', icon: '🚽', price: 300, duration: '/day', description: 'Bedside commode chair with armrests', category: 'mobility' },
];

export const nurseCRMStages = [
  { id: 'website-booking', label: 'Website Booking', icon: '🌐', color: '#3B82F6' },
  { id: 'crm-enquiry', label: 'CRM Enquiry', icon: '📋', color: '#8B5CF6' },
  { id: 'call-centre', label: 'Call Centre', icon: '📞', color: '#F59E0B' },
  { id: 'assessment', label: 'Assessment', icon: '📝', color: '#EC4899' },
  { id: 'quotation', label: 'Quotation', icon: '💰', color: '#10B981' },
  { id: 'payment', label: 'Payment', icon: '💳', color: '#0D9488' },
  { id: 'service-delivery', label: 'Service Delivery', icon: '🏠', color: '#7C3AED' },
  { id: 'feedback', label: 'Feedback', icon: '⭐', color: '#F97316' },
  { id: 'renewal', label: 'Renewal', icon: '🔄', color: '#E11D48' },
];

export const nurseLeadSources = [
  { id: 'website', label: 'Website', icon: '🌐' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { id: 'phone', label: 'Phone Call', icon: '📞' },
  { id: 'referral', label: 'Patient Referral', icon: '👥' },
  { id: 'doctor', label: 'Doctor Referral', icon: '🩺' },
  { id: 'seo', label: 'SEO Landing Page', icon: '🔍' },
  { id: 'social', label: 'Social Media', icon: '📱' },
  { id: 'walkin', label: 'Walk-in', icon: '🚶' },
];
