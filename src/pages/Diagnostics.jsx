import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlass, Flask, ShoppingCart, Plus, Trash, CheckCircle, Clock, Info, WarningCircle, MapPin,
  Heartbeat, Heart, Drop, Shield, Bone, Baby, User,
  Microscope, Truck, Sparkle,
  CaretRight, CaretDown, FileText, CalendarDots, ChatCircle,
} from '@phosphor-icons/react';
import TestDetailModal from '../components/test/TestDetailModal';
import useAuthStore from '../store/authStore';
import { getFamilyMembers } from '../services/authService';
import { searchTests, placeDiagnosticOrder } from '../services/diagnosticsService';
import { getTestEducation } from '../utils/testEducation';

const categoryList = [
  { name: 'Full Body', icon: User, color: '#0F5DA8' },
  { name: 'Heart', icon: Heartbeat, color: '#e53935', mostBooked: true },
  { name: 'Fever', icon: Drop, color: '#ff6f00', ticker: '20,186 Chikungunya cases • 6,927 Dengue cases • 19,422 Malaria cases • 4,08,000 Typhoid cases' },
  { name: 'Vitamin', icon: Sparkle, color: '#00acc1' },
  { name: 'Diabetes', icon: Drop, color: '#1e88e5' },
  { name: 'Thyroid', icon: Shield, color: '#8e24aa' },
  { name: 'Hormones', icon: Drop, color: '#d81b60' },
  { name: 'Lifestyle', icon: Heart, color: '#43a047' },
  { name: 'Cancer', icon: Shield, color: '#e53935' },
  { name: 'Combo', icon: Flask, color: '#6d4c41' },
  { name: 'Pregnancy', icon: Baby, color: '#ec407a' },
  { name: 'Allergy', icon: Shield, color: '#7e57c2' },
  { name: 'Arthritis', icon: Bone, color: '#5d4037' },
  { name: 'STD', icon: Shield, color: '#c62828' },
  { name: 'Anemia', icon: Drop, color: '#c62828' },
  { name: 'Antenatal', icon: Baby, color: '#f06292' },
];

const categoryFilterMap = {
  'Full Body': '', 'Heart': 'Cardiac', 'Fever': 'Infections', 'Vitamin': 'Vitamins',
  'Diabetes': 'Diabetes', 'Thyroid': 'Thyroid', 'Hormones': 'Hormones', 'Lifestyle': '',
  'Cancer': 'Cancer', 'Combo': '', 'Pregnancy': 'Hormones', 'Allergy': 'Infections',
  'Arthritis': '', 'STD': 'Infections', 'Anemia': 'Hematology', 'Antenatal': 'Hormones',
};

const stats = [
  { value: '1 Crore+', label: 'Lives Touched' },
  { value: '2,000+', label: 'Lab Tests Available' },
  { value: '50+', label: 'Collection Centres' },
  { value: '500+', label: 'Trained Phlebotomists' },
];

const healthPackages = [
  { name: 'Basic Health Checkup', tests: '30+ Tests', price: 999, oldPrice: 2499 },
  { name: 'Essential Wellness', tests: '45+ Tests', price: 1499, oldPrice: 3749 },
  { name: 'Executive Health', tests: '60+ Tests', price: 2499, oldPrice: 6249 },
  { name: 'Full Body Checkup', tests: '85+ Tests', price: 3999, oldPrice: 9999 },
  { name: 'Diabetes Care Package', tests: '25+ Tests', price: 1299, oldPrice: 3249 },
  { name: 'Cardiac Health Check', tests: '35+ Tests', price: 1999, oldPrice: 4999 },
  { name: 'Liver Function Panel', tests: '15+ Tests', price: 899, oldPrice: 2249 },
  { name: 'Women\'s Wellness', tests: '40+ Tests', price: 1799, oldPrice: 4499 },
];

const testimonials = [
  { name: 'Meera Sharma', place: 'Delhi', text: 'The sample collection was smooth and hygienic. I received detailed reports within 12 hours, helping me consult my doctor promptly.' },
  { name: 'Raj Patel', place: 'Bangalore', text: 'I received detailed and understandable reports. The free doctor consultation was a great addition, helping me interpret results effectively.' },
  { name: 'Anjali Singh', place: 'Agra', text: 'The sample collector was punctual, hygienic, and polite. The sealed collection kit assured me of their professionalism.' },
];

export default function Diagnostics() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [collectionDate, setCollectionDate] = useState('');
  const [collectionTime, setCollectionTime] = useState('');
  const [address, setAddress] = useState({ line1: '', city: '', pincode: '' });
  const [city, setCity] = useState('Hyderabad');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [showAllTests, setShowAllTests] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [bookedFor, setBookedFor] = useState(null);
  const [locating, setLocating] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [patientInfo, setPatientInfo] = useState({ name: '', age: '', gender: '' });
  const nextSlot = ['2:00 PM', '4:00 PM', '6:00 PM', 'Tomorrow 8:00 AM'][cart.length % 4];
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focused, setFocused] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [faqOpen, setFaqOpen] = useState({});

  const sortOptions = [
    { value: 'popular', label: 'Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A-Z' },
  ];

  const totalBookedToday = 247;
  const dailyBookings = {
    'Complete Blood Count (CBC)': 89,
    'HbA1c': 124,
    'Thyroid Profile (T3, T4, TSH)': 76,
    'Lipid Profile': 93,
    'Vitamin D Total': 58,
    'Blood Sugar (Fasting)': 67,
    'Liver Function Test (LFT)': 42,
    'Kidney Function Test (KFT)': 38,
  };

  const popularTests = ['Complete Blood Count (CBC)', 'HbA1c', 'Thyroid Profile (T3, T4, TSH)', 'Lipid Profile', 'Vitamin D Total'];
  const mostBookedTests = ['Complete Blood Count (CBC)', 'HbA1c', 'Thyroid Profile (T3, T4, TSH)', 'Lipid Profile', 'Vitamin D Total', 'Blood Sugar (Fasting)', 'Blood Sugar (Postprandial / Post Lunch - 2 HR)', 'Random Blood Sugar (RBS)', 'Liver Function Test (LFT)', 'Kidney Function Test (KFT)'];
  const bookingCounts = {
    'Complete Blood Count (CBC)': '2,847',
    'HbA1c': '4,216',
    'Thyroid Profile (T3, T4, TSH)': '3,591',
    'Lipid Profile': '3,128',
    'Vitamin D Total': '2,964',
    'Blood Sugar (Fasting)': '1,873',
    'Blood Sugar (Postprandial / Post Lunch - 2 HR)': '2,146',
    'Random Blood Sugar (RBS)': '1,214',
    'Liver Function Test (LFT)': '1,652',
    'Kidney Function Test (KFT)': '1,449',
  };

  const relatedSuggestions = {
    'Complete Blood Count (CBC)': ['Iron Studies', 'Vitamin B12'],
    'HbA1c': ['Blood Sugar (Fasting)', 'Lipid Profile'],
    'Thyroid Profile (T3, T4, TSH)': ['TSH', 'Lipid Profile'],
    'Lipid Profile': ['Blood Sugar (Fasting)', 'hs-CRP'],
    'Vitamin D Total': ['Vitamin B12', 'Calcium'],
    'Blood Sugar (Fasting)': ['HbA1c', 'Lipid Profile'],
    'Blood Sugar (Postprandial / Post Lunch - 2 HR)': ['Blood Sugar (Fasting)', 'HbA1c'],
    'Random Blood Sugar (RBS)': ['Blood Sugar (Fasting)', 'HbA1c'],
    'Liver Function Test (LFT)': ['Kidney Function Test (KFT)', 'Lipid Profile'],
    'Kidney Function Test (KFT)': ['Liver Function Test (LFT)', 'Uric Acid'],
  };

  const comboData = {
    'HbA1c': { name: 'Diabetes Care Pack', saveLabel: 'Save ₹271', tests: ['Blood Sugar (Fasting)', 'Lipid Profile'], comboPrice: 999 },
    'Blood Sugar (Fasting)': { name: 'Diabetes Care Pack', saveLabel: 'Save ₹271', tests: ['HbA1c', 'Lipid Profile'], comboPrice: 999 },
    'Blood Sugar (Postprandial / Post Lunch - 2 HR)': { name: 'Sugar Control Pack', saveLabel: 'Save ₹351', tests: ['Blood Sugar (Fasting)', 'HbA1c'], comboPrice: 499 },
    'Random Blood Sugar (RBS)': { name: 'Basic Sugar Check', saveLabel: 'Save ₹100', tests: ['Blood Sugar (Fasting)'], comboPrice: 249 },
    'Complete Blood Count (CBC)': { name: 'Anaemia Checkup', saveLabel: 'Save ₹600', tests: ['Iron Studies', 'Vitamin B12'], comboPrice: 1799 },
    'Thyroid Profile (T3, T4, TSH)': { name: 'Complete Thyroid', saveLabel: 'Save ₹151', tests: ['TSH'], comboPrice: 899 },
    'Lipid Profile': { name: 'Heart Health Pack', saveLabel: 'Save ₹201', tests: ['Total Cholesterol', 'hs-CRP'], comboPrice: 749 },
    'Vitamin D Total': { name: 'Bone Health Pack', saveLabel: 'Save ₹401', tests: ['Vitamin B12', 'Serum Calcium'], comboPrice: 1799 },
    'Liver Function Test (LFT)': { name: 'Organ Health Pack', saveLabel: 'Save ₹301', tests: ['Kidney Function Test (KFT)', 'Lipid Profile'], comboPrice: 1499 },
    'Kidney Function Test (KFT)': { name: 'Organ Health Pack', saveLabel: 'Save ₹301', tests: ['Liver Function Test (LFT)', 'Lipid Profile'], comboPrice: 1499 },
  };

  const seedTests = [
    { id: 1, name: 'Complete Blood Count (CBC)', category: 'Hematology', subcategory: 'Complete Blood Count', price: 399, description: 'Measures red blood cells, white blood cells, hemoglobin, platelets, and more to assess overall health.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 2, name: 'HbA1c', category: 'Diabetes', subcategory: 'Diabetes', price: 599, description: 'Measures average blood sugar levels over the past 2-3 months to monitor diabetes control.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No fasting required. Continue regular medication.' },
    { id: 3, name: 'Thyroid Profile (T3, T4, TSH)', category: 'Thyroid', subcategory: 'Thyroid Profile', price: 499, description: 'Evaluates thyroid gland function by measuring T3, T4, and TSH hormone levels.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 8-10 hours recommended.' },
    { id: 4, name: 'Lipid Profile', category: 'Cardiac', subcategory: 'Lipid Profile', price: 449, description: 'Measures cholesterol, HDL, LDL, and triglycerides to assess heart disease risk.', fasting_required: true, report_time: '12 hrs', preparation_instructions: 'Fasting for 9-12 hours required. Water is allowed.' },
    { id: 5, name: 'Vitamin D Total', category: 'Vitamins', subcategory: 'Vitamin D', price: 799, description: 'Measures 25-hydroxyvitamin D levels to assess vitamin D deficiency or excess.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No fasting required.' },
    { id: 6, name: 'Blood Sugar (Fasting)', category: 'Diabetes', subcategory: 'Diabetes', price: 199, description: 'Measures blood glucose levels after an overnight fast to screen for diabetes.', fasting_required: true, report_time: '6 hrs', preparation_instructions: 'Fasting for 8-12 hours required. Only water permitted.' },
    { id: 7, name: 'Liver Function Test (LFT)', category: 'Full Body', subcategory: 'Liver Function', price: 549, description: 'Measures enzymes, proteins, and bilirubin to evaluate liver health and function.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 8-10 hours recommended.' },
    { id: 8, name: 'Kidney Function Test (KFT)', category: 'Full Body', subcategory: 'Kidney Function', price: 499, description: 'Measures creatinine, BUN, uric acid, and electrolytes to assess kidney function.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 8 hours recommended.' },
    { id: 9, name: 'Iron Studies', category: 'Anemia', subcategory: 'Iron Studies', price: 699, description: 'Measures serum iron, ferritin, TIBC, and transferrin saturation to evaluate iron status.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 10-12 hours required.' },
    { id: 10, name: 'Vitamin B12', category: 'Vitamins', subcategory: 'Vitamin B12', price: 699, description: 'Measures vitamin B12 levels to detect deficiency causing anemia or neurological issues.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No fasting required.' },
    { id: 11, name: 'TSH', category: 'Thyroid', subcategory: 'Thyroid', price: 349, description: 'Measures thyroid-stimulating hormone as a first-line screening for thyroid disorders.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 12, name: 'Total Cholesterol', category: 'Cardiac', subcategory: 'Lipid Profile', price: 249, description: 'Measures total cholesterol levels as part of heart health assessment.', fasting_required: true, report_time: '12 hrs', preparation_instructions: 'Fasting for 9-12 hours recommended.' },
    { id: 13, name: 'hs-CRP', category: 'Cardiac', subcategory: 'Cardiac Risk', price: 549, description: 'High-sensitivity C-reactive protein test detects low-level inflammation and heart disease risk.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No fasting required.' },
    { id: 14, name: 'Uric Acid', category: 'Arthritis', subcategory: 'Uric Acid', price: 299, description: 'Measures uric acid levels to diagnose gout and monitor kidney function.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 8 hours recommended.' },
    { id: 15, name: 'Serum Calcium', category: 'Full Body', subcategory: 'Minerals', price: 249, description: 'Measures calcium levels essential for bones, muscles, and nerve function.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No fasting required.' },
    { id: 16, name: 'Dengue NS1 Antigen', category: 'Fever', subcategory: 'Infections', price: 899, description: 'Detects dengue virus antigen in early stages of infection (1-5 days of fever).', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 17, name: 'Malaria Antigen', category: 'Fever', subcategory: 'Infections', price: 499, description: 'Detects malaria parasite antigens in blood for rapid diagnosis.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 18, name: 'Typhoid IgM/IgG', category: 'Fever', subcategory: 'Infections', price: 449, description: 'Detects antibodies against Salmonella typhi for typhoid fever diagnosis.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 19, name: 'Chikungunya IgM', category: 'Fever', subcategory: 'Infections', price: 799, description: 'Detects IgM antibodies against Chikungunya virus for recent infection diagnosis.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 20, name: 'PAP Smear', category: 'Cancer', subcategory: 'Cancer Screening', price: 1499, description: 'Screens for cervical cancer by detecting abnormal cells in the cervix.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'Avoid intercourse, douching, or vaginal creams for 48 hours before.' },
    { id: 21, name: 'CA 125', category: 'Cancer', subcategory: 'Tumor Markers', price: 1199, description: 'Tumor marker primarily used to monitor ovarian cancer treatment response.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 22, name: 'PSA (Prostate Specific Antigen)', category: 'Cancer', subcategory: 'Tumor Markers', price: 999, description: 'Screens for prostate cancer by measuring prostate-specific antigen levels.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Avoid ejaculation for 48 hours before the test.' },
    { id: 23, name: 'Prolactin', category: 'Hormones', subcategory: 'Hormones', price: 599, description: 'Measures prolactin hormone levels to evaluate pituitary function and reproductive health.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 8 hours recommended. Avoid stress before collection.' },
    { id: 24, name: 'Cortisol (Morning)', category: 'Hormones', subcategory: 'Hormones', price: 799, description: 'Measures morning cortisol levels to assess adrenal gland function.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 8 hours. Sample collected between 6-9 AM.' },
    { id: 25, name: 'Testosterone (Total)', category: 'Hormones', subcategory: 'Hormones', price: 899, description: 'Measures total testosterone levels for evaluating hypogonadism and hormone health.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 8 hours. Sample collected before 10 AM.' },
    { id: 26, name: 'Allergy Panel (Food)', category: 'Allergy', subcategory: 'Allergy', price: 2499, description: 'Tests for IgE antibodies against common food allergens including milk, egg, peanut, wheat, soy.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 27, name: 'Allergy Panel (Inhalant)', category: 'Allergy', subcategory: 'Allergy', price: 2799, description: 'Tests for IgE antibodies against common inhaled allergens like pollen, dust, mold, pet dander.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 28, name: 'Rheumatoid Factor (RF)', category: 'Arthritis', subcategory: 'Arthritis', price: 499, description: 'Detects rheumatoid factor antibodies to aid in rheumatoid arthritis diagnosis.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 29, name: 'Vitamin B12 & Folate', category: 'Anemia', subcategory: 'Anemia', price: 999, description: 'Measures vitamin B12 and folate levels to identify causes of anemia.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 8-10 hours recommended.' },
    { id: 30, name: 'Pregnancy Test (hCG)', category: 'Pregnancy', subcategory: 'Pregnancy', price: 299, description: 'Detects human chorionic gonadotropin (hCG) for early pregnancy detection.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'Best taken after a missed period. First morning urine preferred.' },
    { id: 31, name: 'Electrocardiogram (ECG)', category: 'Cardiac', subcategory: 'Cardiac', price: 399, description: 'Records electrical activity of the heart to detect arrhythmias, ischemia, and heart damage.', fasting_required: false, report_time: 'Immediate', preparation_instructions: 'Avoid caffeine for 24 hours before. Wear loose clothing.' },
    { id: 32, name: 'NT-proBNP', category: 'Cardiac', subcategory: 'Cardiac Risk', price: 1499, description: 'Measures B-type natriuretic peptide to diagnose and monitor heart failure.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 33, name: 'D-Dimer', category: 'Hematology', subcategory: 'Coagulation', price: 899, description: 'Measures D-dimer levels to rule out deep vein thrombosis, pulmonary embolism, or DIC.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 34, name: 'PT/INR', category: 'Hematology', subcategory: 'Coagulation', price: 399, description: 'Measures prothrombin time and INR to monitor blood-thinning therapy and clotting function.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'Inform lab about any blood-thinning medications.' },
    { id: 35, name: 'aPTT', category: 'Hematology', subcategory: 'Coagulation', price: 549, description: 'Measures activated partial thromboplastin time to evaluate intrinsic clotting pathway.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 36, name: 'ESR (Erythrocyte Sedimentation Rate)', category: 'Hematology', subcategory: 'Inflammation', price: 199, description: 'Measures how quickly red blood cells settle — elevated in inflammation, infection, and autoimmune conditions.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 37, name: 'Blood Group & RH Typing', category: 'Hematology', subcategory: 'Blood Bank', price: 299, description: 'Determines ABO blood group and Rh factor for transfusion and pregnancy compatibility.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 38, name: 'Hepatitis B Surface Antigen (HBsAg)', category: 'STD', subcategory: 'Infections', price: 549, description: 'Screens for hepatitis B virus infection by detecting surface antigen.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 39, name: 'Hepatitis C Antibody', category: 'STD', subcategory: 'Infections', price: 699, description: 'Detects antibodies against hepatitis C virus for screening and diagnosis.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 40, name: 'HIV 1 & 2 Antibody', category: 'STD', subcategory: 'Infections', price: 799, description: 'Screens for HIV-1 and HIV-2 antibodies for early detection of HIV infection.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required. Results are confidential.' },
    { id: 41, name: 'VDRL / RPR', category: 'STD', subcategory: 'Infections', price: 349, description: 'Screens for syphilis infection by detecting non-specific antibodies.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 42, name: 'Urine Routine & Microscopy', category: 'Full Body', subcategory: 'Urinalysis', price: 199, description: 'Analyzes physical, chemical, and microscopic properties of urine for UTI, kidney disease, and diabetes.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'Collect mid-stream clean-catch sample.' },
    { id: 43, name: 'Stool Routine & Microscopy', category: 'Full Body', subcategory: 'Stool Analysis', price: 249, description: 'Examines stool for blood, parasites, bacteria, and digestive markers.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'Collect sample in a clean dry container.' },
    { id: 44, name: 'H. pylori Stool Antigen', category: 'Fever', subcategory: 'GI Infections', price: 899, description: 'Detects Helicobacter pylori antigen to diagnose stomach ulcer-causing infection.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'Avoid proton pump inhibitors for 2 weeks before the test.' },
    { id: 45, name: 'Thyroid Peroxidase Antibody (TPO)', category: 'Thyroid', subcategory: 'Autoimmune', price: 999, description: 'Detects anti-thyroid peroxidase antibodies to diagnose Hashimoto\'s thyroiditis.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 46, name: 'Anti-CCP Antibody', category: 'Arthritis', subcategory: 'Autoimmune', price: 1199, description: 'Detects anti-cyclic citrullinated peptide antibodies for early rheumatoid arthritis diagnosis.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 47, name: 'Vitamin A (Retinol)', category: 'Vitamins', subcategory: 'Fat Soluble Vitamins', price: 899, description: 'Measures vitamin A levels essential for vision, immune function, and skin health.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 8-10 hours recommended.' },
    { id: 48, name: 'Heavy Metal Panel (Pb, Hg, As)', category: 'Full Body', subcategory: 'Toxicology', price: 3999, description: 'Screens for toxic levels of lead, mercury, and arsenic in the body.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'Avoid seafood for 48 hours before collection.' },
    { id: 49, name: 'Serum Electrolytes (Na, K, Cl)', category: 'Full Body', subcategory: 'Electrolytes', price: 349, description: 'Measures sodium, potassium, and chloride levels to assess fluid and electrolyte balance.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 50, name: 'Serum Magnesium', category: 'Full Body', subcategory: 'Minerals', price: 299, description: 'Measures magnesium levels essential for muscle and nerve function, and heart rhythm.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 51, name: 'Serum Phosphorus', category: 'Full Body', subcategory: 'Minerals', price: 249, description: 'Measures phosphate levels important for bone health and energy metabolism.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 52, name: 'Amylase', category: 'Full Body', subcategory: 'Pancreatic Enzymes', price: 449, description: 'Measures amylase levels to diagnose and monitor pancreatitis and other pancreatic disorders.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 8-10 hours recommended.' },
    { id: 53, name: 'Lipase', category: 'Full Body', subcategory: 'Pancreatic Enzymes', price: 499, description: 'Measures lipase levels — the most specific test for acute pancreatitis diagnosis.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 8-10 hours recommended.' },
    { id: 54, name: 'CK-MB', category: 'Cardiac', subcategory: 'Cardiac Markers', price: 799, description: 'Measures creatine kinase-MB isoenzyme to diagnose heart muscle damage in heart attacks.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 55, name: 'Troponin I (High Sensitivity)', category: 'Cardiac', subcategory: 'Cardiac Markers', price: 1299, description: 'The gold-standard test for detecting heart muscle injury and diagnosing heart attacks.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 56, name: 'LDH (Lactate Dehydrogenase)', category: 'Full Body', subcategory: 'Enzymes', price: 349, description: 'Measures LDH levels to detect tissue damage and monitor conditions like anaemia and liver disease.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 57, name: 'Gamma GT (GGT)', category: 'Liver', subcategory: 'Liver Enzymes', price: 349, description: 'Measures gamma-glutamyl transferase to detect liver/bile duct damage and alcohol-related liver disease.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 8 hours recommended.' },
    { id: 58, name: 'Alkaline Phosphatase (ALP)', category: 'Liver', subcategory: 'Liver Enzymes', price: 299, description: 'Measures ALP levels elevated in liver disease, bile duct obstruction, and bone disorders.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 8-10 hours recommended.' },
    { id: 59, name: 'SGPT / ALT', category: 'Liver', subcategory: 'Liver Enzymes', price: 249, description: 'Measures alanine aminotransferase — a key marker of liver cell injury and hepatitis.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 60, name: 'SGOT / AST', category: 'Liver', subcategory: 'Liver Enzymes', price: 249, description: 'Measures aspartate aminotransferase — elevated in liver damage, heart attack, and muscle injury.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 61, name: 'Total Protein / Albumin / Globulin', category: 'Full Body', subcategory: 'Proteins', price: 299, description: 'Measures total protein, albumin, and globulin levels to assess nutrition, liver, and kidney function.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 62, name: 'ANA (Antinuclear Antibody)', category: 'Arthritis', subcategory: 'Autoimmune', price: 999, description: 'Screens for antinuclear antibodies to diagnose autoimmune diseases like lupus.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 63, name: 'Ferritin', category: 'Anemia', subcategory: 'Iron Studies', price: 499, description: 'Measures ferritin levels to assess iron stores in the body, detecting deficiency or overload.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 8 hours recommended.' },
    { id: 64, name: 'TIBC (Total Iron Binding Capacity)', category: 'Anemia', subcategory: 'Iron Studies', price: 399, description: 'Measures the blood\'s capacity to bind iron, helping differentiate types of anaemia.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 10-12 hours required.' },
    { id: 65, name: 'Homocysteine', category: 'Cardiac', subcategory: 'Cardiac Risk', price: 999, description: 'Measures homocysteine levels — elevated levels are a risk factor for heart disease and stroke.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 8-10 hours recommended.' },
    { id: 66, name: 'Lipoprotein (a)', category: 'Cardiac', subcategory: 'Cardiac Risk', price: 799, description: 'Measures lipoprotein(a) — a genetic risk factor for early heart disease and stroke.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 67, name: 'Free T3', category: 'Thyroid', subcategory: 'Thyroid Function', price: 399, description: 'Measures free triiodothyronine levels to evaluate thyroid function independently.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 68, name: 'Free T4', category: 'Thyroid', subcategory: 'Thyroid Function', price: 399, description: 'Measures free thyroxine levels for accurate thyroid function assessment.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 69, name: 'FSH (Follicle Stimulating Hormone)', category: 'Hormones', subcategory: 'Reproductive Hormones', price: 599, description: 'Measures FSH levels to evaluate ovarian reserve, menopause status, and pituitary function.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 70, name: 'LH (Luteinizing Hormone)', category: 'Hormones', subcategory: 'Reproductive Hormones', price: 599, description: 'Measures LH levels for fertility assessment and ovulation prediction.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 71, name: 'Progesterone', category: 'Hormones', subcategory: 'Reproductive Hormones', price: 699, description: 'Measures progesterone levels to evaluate ovulation, pregnancy health, and luteal phase function.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 72, name: 'Estradiol (E2)', category: 'Hormones', subcategory: 'Reproductive Hormones', price: 799, description: 'Measures estradiol levels to assess ovarian function, fertility, and menopausal status.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 73, name: 'Vitamin E (Tocopherol)', category: 'Vitamins', subcategory: 'Fat Soluble Vitamins', price: 999, description: 'Measures vitamin E levels, an antioxidant important for immune function and skin health.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 8-10 hours recommended.' },
    { id: 74, name: 'Copper (Serum)', category: 'Full Body', subcategory: 'Trace Elements', price: 599, description: 'Measures serum copper levels to detect deficiency or Wilson\'s disease.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 75, name: 'Zinc (Serum)', category: 'Full Body', subcategory: 'Trace Elements', price: 599, description: 'Measures zinc levels essential for immunity, wound healing, and growth.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 76, name: 'Urine Culture & Sensitivity', category: 'Full Body', subcategory: 'Microbiology', price: 449, description: 'Identifies bacterial infections in urine and determines effective antibiotic treatment.', fasting_required: false, report_time: '48-72 hrs', preparation_instructions: 'Collect mid-stream clean-catch sample in sterile container.' },
    { id: 77, name: 'Blood Culture', category: 'Fever', subcategory: 'Microbiology', price: 799, description: 'Detects bacterial or fungal infections in the bloodstream for sepsis diagnosis.', fasting_required: false, report_time: '72 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 78, name: 'Dengue IgG/IgM', category: 'Fever', subcategory: 'Infections', price: 699, description: 'Differentiates between primary and secondary dengue infection through IgG/IgM antibodies.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 79, name: 'Leptospira IgM', category: 'Fever', subcategory: 'Infections', price: 899, description: 'Detects IgM antibodies against Leptospira for early diagnosis of leptospirosis.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 80, name: 'Scrub Typhus IgM', category: 'Fever', subcategory: 'Infections', price: 999, description: 'Detects Orientia tsutsugamushi IgM antibodies for scrub typhus diagnosis.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 81, name: 'Fasting Insulin', category: 'Diabetes', subcategory: 'Insulin', price: 599, description: 'Measures fasting insulin levels to assess insulin resistance and beta-cell function.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 10-12 hours required.' },
    { id: 82, name: 'C-Peptide', category: 'Diabetes', subcategory: 'Insulin', price: 799, description: 'Measures C-peptide to differentiate type 1 vs type 2 diabetes and assess pancreatic function.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 8-10 hours recommended.' },
    { id: 83, name: 'Microalbumin (Urine)', category: 'Diabetes', subcategory: 'Kidney', price: 399, description: 'Detects微量 amounts of albumin in urine for early kidney damage detection in diabetes.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'First morning urine sample preferred.' },
    { id: 84, name: 'OGTT (Oral Glucose Tolerance Test)', category: 'Diabetes', subcategory: 'Glucose Tolerance', price: 499, description: 'Measures blood glucose at intervals after a glucose drink to diagnose diabetes and gestational diabetes.', fasting_required: true, report_time: '3 hrs', preparation_instructions: 'Fasting for 10-12 hours. Avoid exercise and smoking before test.' },
    { id: 85, name: 'Hb Electrophoresis', category: 'Hematology', subcategory: 'Hemoglobinopathies', price: 799, description: 'Separates hemoglobin types to diagnose thalassemia, sickle cell disease, and other hemoglobin disorders.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 86, name: 'G6PD (Quantitative)', category: 'Hematology', subcategory: 'Red Cell Enzymes', price: 599, description: 'Measures glucose-6-phosphate dehydrogenase enzyme activity to diagnose G6PD deficiency.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 87, name: 'Reticulocyte Count', category: 'Hematology', subcategory: 'Red Cell', price: 299, description: 'Measures young red blood cell count to assess bone marrow response to anaemia.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 88, name: 'Peripheral Blood Smear', category: 'Hematology', subcategory: 'Morphology', price: 249, description: 'Microscopic examination of blood cells to detect abnormalities in size, shape, and number.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 89, name: 'Total IgE', category: 'Allergy', subcategory: 'Immunoglobulins', price: 699, description: 'Measures total immunoglobulin E levels elevated in allergic conditions and parasitic infections.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 90, name: 'RAST (Specific IgE) - Dust Mite', category: 'Allergy', subcategory: 'Allergen Specific', price: 899, description: 'Measures specific IgE antibodies against dust mite allergens for targeted allergy diagnosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 91, name: 'Parathyroid Hormone (PTH)', category: 'Hormones', subcategory: 'Calcium Metabolism', price: 999, description: 'Measures PTH levels to evaluate calcium metabolism disorders and parathyroid function.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 8-10 hours. Morning sample preferred.' },
    { id: 92, name: 'Anti-Mullerian Hormone (AMH)', category: 'Pregnancy', subcategory: 'Fertility', price: 1999, description: 'Measures AMH levels to assess ovarian reserve and predict fertility treatment outcomes.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Can be tested any day of menstrual cycle.' },
    { id: 93, name: 'DHEA-S', category: 'Hormones', subcategory: 'Adrenal Hormones', price: 699, description: 'Measures dehydroepiandrosterone sulfate levels to assess adrenal gland function.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 94, name: 'SHBG', category: 'Hormones', subcategory: 'Sex Hormones', price: 699, description: 'Measures sex hormone-binding globulin to evaluate hormone imbalances and insulin resistance.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 8 hours recommended.' },
    { id: 95, name: 'Growth Hormone (GH)', category: 'Hormones', subcategory: 'Pituitary', price: 899, description: 'Measures growth hormone levels to evaluate pituitary function and growth disorders.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 10-12 hours. Rest for 30 minutes before collection.' },
    { id: 96, name: 'IGF-1 (Insulin-like Growth Factor 1)', category: 'Hormones', subcategory: 'Growth Factors', price: 1199, description: 'Measures IGF-1 levels as a stable marker of growth hormone status.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 97, name: 'Beta-hCG (Quantitative)', category: 'Pregnancy', subcategory: 'Pregnancy Monitoring', price: 499, description: 'Measures exact hCG levels for pregnancy confirmation, dating, and monitoring viability.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 98, name: 'Triple Marker Test', category: 'Pregnancy', subcategory: 'Antenatal Screening', price: 2499, description: 'Screens for Down syndrome, trisomy 18, and neural tube defects in second trimester.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required. Gestational age must be known.' },
    { id: 99, name: 'Rubella IgG / IgM', category: 'Pregnancy', subcategory: 'TORCH Panel', price: 799, description: 'Detects antibodies against rubella virus to check immunity or recent infection.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 100, name: 'Toxoplasma IgG / IgM', category: 'Pregnancy', subcategory: 'TORCH Panel', price: 899, description: 'Detects Toxoplasma gondii antibodies for infection screening in pregnancy.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 101, name: 'CMV IgG / IgM', category: 'Pregnancy', subcategory: 'TORCH Panel', price: 899, description: 'Detects cytomegalovirus antibodies to diagnose active or past infection.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 102, name: 'ANCA (Anti-MPO + Anti-PR3)', category: 'Arthritis', subcategory: 'Vasculitis', price: 1499, description: 'Detects anti-neutrophil cytoplasmic antibodies for diagnosing vasculitis disorders.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 103, name: 'Anti-dsDNA', category: 'Arthritis', subcategory: 'Autoimmune', price: 999, description: 'Detects anti-double stranded DNA antibodies — a specific marker for lupus.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 104, name: 'C3 & C4 Complement', category: 'Arthritis', subcategory: 'Complement', price: 699, description: 'Measures complement proteins C3 and C4 to monitor autoimmune disease activity.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 105, name: 'Fibrinogen', category: 'Hematology', subcategory: 'Coagulation', price: 499, description: 'Measures fibrinogen levels essential for blood clotting — elevated in inflammation.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 106, name: 'Procalcitonin', category: 'Fever', subcategory: 'Inflammatory Markers', price: 1199, description: 'Measures procalcitonin levels to distinguish bacterial from viral infections.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 107, name: 'Myoglobin', category: 'Cardiac', subcategory: 'Cardiac Markers', price: 699, description: 'Measures myoglobin levels — an early marker of heart muscle damage.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 108, name: 'Cystatin C', category: 'Full Body', subcategory: 'Kidney Function', price: 699, description: 'Measures cystatin C for accurate kidney function assessment independent of muscle mass.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 109, name: 'Alpha-1 Antitrypsin', category: 'Full Body', subcategory: 'Proteins', price: 899, description: 'Measures alpha-1 antitrypsin levels to screen for deficiency causing lung and liver disease.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 110, name: 'Ceruloplasmin', category: 'Liver', subcategory: 'Copper Metabolism', price: 699, description: 'Measures ceruloplasmin levels to diagnose Wilson\'s disease and copper metabolism disorders.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 111, name: 'ASO Titre (Antistreptolysin O)', category: 'Fever', subcategory: 'Infections', price: 449, description: 'Measures antibodies against streptolysin O to diagnose recent strep infection and rheumatic fever.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 112, name: 'CRP (C-Reactive Protein)', category: 'Fever', subcategory: 'Inflammatory Markers', price: 349, description: 'Measures C-reactive protein levels to detect systemic inflammation and infection.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 113, name: 'Haptoglobin', category: 'Anemia', subcategory: 'Hemolysis', price: 449, description: 'Measures haptoglobin levels — decreased in hemolytic anemia and increased in inflammation.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 114, name: 'Fecal Calprotectin', category: 'Full Body', subcategory: 'GI Inflammation', price: 1499, description: 'Measures calprotectin in stool to distinguish IBD from IBS and monitor disease activity.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'Collect sample in clean container. Avoid NSAIDs for 2 weeks before.' },
    { id: 115, name: 'Fecal Occult Blood (FIT)', category: 'Cancer', subcategory: 'Colorectal Screening', price: 399, description: 'Detects hidden blood in stool for early colorectal cancer screening.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'Collect sample from 3 separate bowel movements.' },
    { id: 116, name: 'QuantiFERON-TB Gold', category: 'Fever', subcategory: 'TB Diagnosis', price: 2499, description: 'Interferon-gamma release assay for latent TB infection diagnosis — more specific than skin test.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 117, name: 'TB-PCR (GeneXpert)', category: 'Fever', subcategory: 'TB Diagnosis', price: 2999, description: 'Detects Mycobacterium tuberculosis DNA and rifampicin resistance in sputum or other samples.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Collection as per sample type.' },
    { id: 118, name: 'HLA-B27', category: 'Arthritis', subcategory: 'Genetic Markers', price: 1999, description: 'Detects HLA-B27 genetic marker strongly associated with ankylosing spondylitis and related disorders.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 119, name: 'ACE Level (Angiotensin-Converting Enzyme)', category: 'Full Body', subcategory: 'Enzymes', price: 699, description: 'Measures ACE levels — elevated in sarcoidosis and used for disease monitoring.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 120, name: 'ADA (Adenosine Deaminase)', category: 'Fever', subcategory: 'TB Diagnosis', price: 799, description: 'Measures ADA levels in fluid samples for TB diagnosis, especially pleural TB.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 121, name: 'von Willebrand Factor Antigen', category: 'Hematology', subcategory: 'Coagulation', price: 1199, description: 'Measures von Willebrand factor levels to diagnose von Willebrand disease (common bleeding disorder).', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 122, name: 'Factor VIII Assay', category: 'Hematology', subcategory: 'Coagulation', price: 1499, description: 'Measures factor VIII activity to diagnose hemophilia A and monitor replacement therapy.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 123, name: 'Factor IX Assay', category: 'Hematology', subcategory: 'Coagulation', price: 1499, description: 'Measures factor IX activity to diagnose hemophilia B (Christmas disease).', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 124, name: 'Anti-Cardiolipin Antibody (IgG/IgM)', category: 'Arthritis', subcategory: 'Antiphospholipid', price: 1199, description: 'Detects anti-cardiolipin antibodies for diagnosing antiphospholipid syndrome (clotting disorder).', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 125, name: 'Lupus Anticoagulant', category: 'Hematology', subcategory: 'Coagulation', price: 1499, description: 'Detects lupus anticoagulant — an antiphospholipid antibody causing false-high PT/aPTT and thrombosis risk.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 126, name: 'Coenzyme Q10 (Ubiquinone)', category: 'Vitamins', subcategory: 'Antioxidants', price: 1999, description: 'Measures CoQ10 levels essential for mitochondrial energy production and heart health.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 8-10 hours recommended.' },
    { id: 127, name: 'Carnitine (Free & Total)', category: 'Full Body', subcategory: 'Metabolism', price: 1499, description: 'Measures carnitine levels important for fatty acid metabolism and energy production.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 10-12 hours required.' },
    { id: 128, name: 'Methylmalonic Acid (MMA)', category: 'Vitamins', subcategory: 'Vitamin B12 Status', price: 1299, description: 'Measures MMA levels — the most sensitive marker for early vitamin B12 deficiency.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 129, name: 'Erythropoietin (EPO)', category: 'Hematology', subcategory: 'Growth Factors', price: 1199, description: 'Measures erythropoietin levels to evaluate anaemia and polycythemia causes.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 130, name: 'Soluble Transferrin Receptor', category: 'Anemia', subcategory: 'Iron Metabolism', price: 999, description: 'Measures sTfR levels to differentiate iron deficiency anaemia from anaemia of chronic disease.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 8 hours recommended.' },
    { id: 131, name: 'Thrombin Time', category: 'Hematology', subcategory: 'Coagulation', price: 449, description: 'Measures thrombin time to assess fibrinogen conversion and detect heparin or fibrinogen disorders.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 132, name: 'Anti-Xa (Heparin Assay)', category: 'Hematology', subcategory: 'Coagulation Monitoring', price: 1499, description: 'Measures anti-Xa activity to monitor unfractionated and low molecular weight heparin therapy.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'Inform lab about all blood-thinning medications.' },
    { id: 133, name: 'Protein C Activity', category: 'Hematology', subcategory: 'Thrombophilia', price: 1499, description: 'Measures protein C activity — deficiency increases risk of venous thrombosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 134, name: 'Protein S Activity', category: 'Hematology', subcategory: 'Thrombophilia', price: 1499, description: 'Measures protein S activity — deficiency increases risk of abnormal blood clotting.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 135, name: 'Antithrombin III', category: 'Hematology', subcategory: 'Thrombophilia', price: 1499, description: 'Measures antithrombin III levels — deficiency causes inherited thrombophilia.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 136, name: 'Factor V Leiden Mutation', category: 'Hematology', subcategory: 'Genetic Thrombophilia', price: 2499, description: 'Detects Factor V Leiden mutation — the most common inherited cause of thrombophilia.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 137, name: 'Prothrombin Gene Mutation (G20210A)', category: 'Hematology', subcategory: 'Genetic Thrombophilia', price: 2499, description: 'Detects prothrombin gene mutation associated with increased thrombosis risk.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 138, name: 'MTHFR Mutation (C677T)', category: 'Full Body', subcategory: 'Genetic', price: 1999, description: 'Detects MTHFR gene variant affecting folate metabolism and homocysteine levels.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 139, name: 'Serum Protein Electrophoresis (SPEP)', category: 'Cancer', subcategory: 'Multiple Myeloma', price: 999, description: 'Separates serum proteins to detect monoclonal gammopathies like multiple myeloma.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 8-10 hours recommended.' },
    { id: 140, name: 'Free Light Chains (Kappa & Lambda)', category: 'Cancer', subcategory: 'Multiple Myeloma', price: 2499, description: 'Measures free light chain levels for diagnosing and monitoring plasma cell disorders.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 141, name: 'Aldosterone (Supine/Standing)', category: 'Hormones', subcategory: 'Adrenal', price: 1199, description: 'Measures aldosterone levels to evaluate adrenal gland function and hypertension causes.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 8 hours. Sample collected in supine and standing positions.' },
    { id: 142, name: 'Renin (Direct)', category: 'Hormones', subcategory: 'Adrenal', price: 999, description: 'Measures renin levels for aldosterone-to-renin ratio in hypertension workup.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 8 hours. Sample collected in seated position.' },
    { id: 143, name: 'Metanephrines (Plasma)', category: 'Hormones', subcategory: 'Adrenal Tumors', price: 2499, description: 'Measures metanephrine levels to screen for pheochromocytoma.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 8 hours. Avoid caffeine, exercise, and stress for 24 hours before.' },
    { id: 144, name: 'Cortisol (Evening/Salivary)', category: 'Hormones', subcategory: 'Adrenal', price: 899, description: 'Measures late-night cortisol levels for diagnosing Cushing\'s syndrome.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Sample collected at 11 PM. No food or drink 30 minutes before.' },
    { id: 145, name: 'ACTH (Adrenocorticotropic Hormone)', category: 'Hormones', subcategory: 'Pituitary', price: 1499, description: 'Measures ACTH levels to differentiate primary vs secondary adrenal insufficiency.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 8 hours. Morning sample preferred. Keep cold.' },
    { id: 146, name: 'Amino Acid Profile (Plasma)', category: 'Full Body', subcategory: 'Metabolic', price: 3999, description: 'Quantitative analysis of amino acids to screen for inborn errors of metabolism.', fasting_required: true, report_time: '7-10 days', preparation_instructions: 'Fasting for 10-12 hours required.' },
    { id: 147, name: 'Organic Acids (Urine)', category: 'Full Body', subcategory: 'Metabolic', price: 4499, description: 'Analyzes organic acids in urine to detect metabolic disorders and mitochondrial dysfunction.', fasting_required: false, report_time: '7-10 days', preparation_instructions: 'First morning urine sample preferred.' },
    { id: 148, name: 'Apolipoprotein E (ApoE) Genotype', category: 'Cardiac', subcategory: 'Genetic Risk', price: 3499, description: 'Identifies ApoE gene variants associated with Alzheimer\'s and cardiovascular disease risk.', fasting_required: false, report_time: '7-10 days', preparation_instructions: 'No special preparation required.' },
    { id: 149, name: 'IL-6 (Interleukin-6)', category: 'Fever', subcategory: 'Cytokines', price: 1799, description: 'Measures IL-6 levels — a key inflammatory cytokine elevated in severe infections and autoimmune diseases.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 150, name: 'TNF-Alpha', category: 'Arthritis', subcategory: 'Cytokines', price: 1999, description: 'Measures tumour necrosis factor-alpha levels to monitor inflammatory disease activity.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 151, name: 'Selenium (Serum)', category: 'Full Body', subcategory: 'Trace Elements', price: 999, description: 'Measures selenium levels essential for antioxidant function, thyroid metabolism, and immunity.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 152, name: 'Chromium (Serum)', category: 'Full Body', subcategory: 'Trace Elements', price: 999, description: 'Measures chromium levels important for blood sugar regulation and insulin sensitivity.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 8-10 hours recommended.' },
    { id: 153, name: 'Manganese (Serum)', category: 'Full Body', subcategory: 'Trace Elements', price: 999, description: 'Measures manganese levels essential for bone formation, wound healing, and metabolism.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 154, name: 'Iodine (Serum)', category: 'Thyroid', subcategory: 'Iodine Status', price: 1499, description: 'Measures iodine levels critical for thyroid hormone production and metabolic regulation.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 155, name: 'Biotin (Vitamin B7)', category: 'Vitamins', subcategory: 'B Complex', price: 1199, description: 'Measures biotin levels important for hair, skin, nail health, and energy metabolism.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 156, name: 'Vitamin K (Phylloquinone)', category: 'Vitamins', subcategory: 'Fat Soluble Vitamins', price: 1299, description: 'Measures vitamin K levels essential for blood clotting, bone health, and heart health.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 8-10 hours recommended.' },
    { id: 157, name: 'Niacin (Vitamin B3)', category: 'Vitamins', subcategory: 'B Complex', price: 899, description: 'Measures niacin levels important for energy metabolism, DNA repair, and skin health.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 158, name: 'Vitamin B6 (Pyridoxine)', category: 'Vitamins', subcategory: 'B Complex', price: 899, description: 'Measures vitamin B6 levels critical for brain development, immune function, and homocysteine metabolism.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 159, name: 'Vitamin B1 (Thiamine)', category: 'Vitamins', subcategory: 'B Complex', price: 799, description: 'Measures thiamine levels essential for carbohydrate metabolism and neurological function.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 8-10 hours recommended.' },
    { id: 160, name: 'Vitamin B2 (Riboflavin)', category: 'Vitamins', subcategory: 'B Complex', price: 799, description: 'Measures riboflavin levels important for energy production, vision, and skin health.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 8-10 hours recommended.' },
    { id: 161, name: 'Adiponectin', category: 'Diabetes', subcategory: 'Adipokines', price: 1799, description: 'Measures adiponectin levels — an anti-inflammatory hormone that improves insulin sensitivity.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 10-12 hours required.' },
    { id: 162, name: 'Leptin', category: 'Diabetes', subcategory: 'Adipokines', price: 1499, description: 'Measures leptin levels — the satiety hormone. High levels indicate leptin resistance in obesity.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 10-12 hours required.' },
    { id: 163, name: 'Ghrelin (Active)', category: 'Full Body', subcategory: 'Hormones', price: 1999, description: 'Measures active ghrelin — the hunger hormone that stimulates appetite and regulates energy balance.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 12 hours required. Sample must be processed immediately.' },
    { id: 164, name: 'FGF-21 (Fibroblast Growth Factor 21)', category: 'Diabetes', subcategory: 'Metabolic Markers', price: 2499, description: 'Measures FGF-21 levels — a metabolic regulator elevated in fatty liver disease and insulin resistance.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 10-12 hours required.' },
    { id: 165, name: 'Klotho (Anti-Aging)', category: 'Full Body', subcategory: 'Longevity', price: 3499, description: 'Measures Klotho protein levels associated with longevity, kidney health, and cognitive function.', fasting_required: false, report_time: '7-10 days', preparation_instructions: 'No special preparation required.' },
    { id: 166, name: 'Osteocalcin', category: 'Full Body', subcategory: 'Bone Markers', price: 1499, description: 'Measures osteocalcin levels — a bone formation marker for osteoporosis and bone disease monitoring.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 8 hours recommended.' },
    { id: 167, name: 'P1NP (Procollagen Type 1 N-Propeptide)', category: 'Full Body', subcategory: 'Bone Formation', price: 1799, description: 'Measures P1NP — a bone formation marker used to monitor osteoporosis treatment response.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 8 hours. Morning sample preferred.' },
    { id: 168, name: 'CTX-I (C-Terminal Telopeptide)', category: 'Full Body', subcategory: 'Bone Resorption', price: 1799, description: 'Measures CTX-I — a bone resorption marker for assessing osteoporosis and bone metastasis.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 8 hours. Morning sample preferred.' },
    { id: 169, name: 'Hepatitis B Core Antibody (Anti-HBc)', category: 'STD', subcategory: 'Hepatitis', price: 599, description: 'Detects hepatitis B core antibodies to differentiate past resolved infection from chronic.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 170, name: 'Hepatitis B e Antigen (HBeAg)', category: 'STD', subcategory: 'Hepatitis', price: 699, description: 'Detects hepatitis B e antigen — marker of active viral replication and high infectivity.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 171, name: 'Hepatitis A Total Antibody', category: 'Fever', subcategory: 'Hepatitis', price: 549, description: 'Detects hepatitis A antibodies to confirm past infection or vaccination response.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 172, name: 'Hepatitis E IgM', category: 'Fever', subcategory: 'Hepatitis', price: 699, description: 'Detects hepatitis E IgM antibodies for diagnosing acute hepatitis E infection.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 173, name: 'EBV VCA IgM (Infectious Mononucleosis)', category: 'Fever', subcategory: 'EBV', price: 899, description: 'Detects Epstein-Barr virus VCA IgM for diagnosing acute infectious mononucleosis.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 174, name: 'EBNA IgG (Past EBV)', category: 'Fever', subcategory: 'EBV', price: 899, description: 'Detects EBV nuclear antigen IgG to confirm past or reactivated Epstein-Barr infection.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 175, name: 'HSV-1 IgG/IgM (Herpes Type 1)', category: 'STD', subcategory: 'HSV', price: 699, description: 'Detects herpes simplex type 1 antibodies for diagnosing oral/genital herpes infection.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 176, name: 'HSV-2 IgG/IgM (Herpes Type 2)', category: 'STD', subcategory: 'HSV', price: 699, description: 'Detects herpes simplex type 2 antibodies specifically for genital herpes diagnosis.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 177, name: 'Varicella Zoster IgG (Chickenpox)', category: 'Fever', subcategory: 'Immunity', price: 699, description: 'Detects varicella zoster antibodies to confirm chickenpox immunity or past infection.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 178, name: 'Measles IgG', category: 'Fever', subcategory: 'Immunity', price: 699, description: 'Detects measles IgG antibodies to confirm vaccination response or natural immunity.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 179, name: 'Mumps IgG', category: 'Fever', subcategory: 'Immunity', price: 699, description: 'Detects mumps IgG antibodies to confirm immunity against mumps infection.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 180, name: 'Mycoplasma Pneumoniae IgG/IgM', category: 'Fever', subcategory: 'Respiratory Infections', price: 899, description: 'Detects Mycoplasma pneumoniae antibodies for diagnosing atypical pneumonia.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 181, name: 'Chlamydia Pneumoniae IgG/IgM', category: 'Fever', subcategory: 'Respiratory Infections', price: 899, description: 'Detects Chlamydia pneumoniae antibodies for diagnosing respiratory tract infections.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 182, name: 'Legionella Urinary Antigen', category: 'Fever', subcategory: 'Respiratory Infections', price: 1499, description: 'Detects Legionella pneumophila antigen in urine for rapid Legionnaires\' disease diagnosis.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 183, name: '24-Hour Urine Protein', category: 'Full Body', subcategory: '24h Urine', price: 399, description: 'Measures total protein excreted in urine over 24 hours — key test for kidney disease.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Collect all urine over 24 hours in provided container. Refrigerate during collection.' },
    { id: 184, name: '24-Hour Urine Creatinine', category: 'Full Body', subcategory: '24h Urine', price: 349, description: 'Measures creatinine clearance via 24-hour urine collection to assess kidney filtration.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Same as 24-hour urine collection protocol.' },
    { id: 185, name: '24-Hour Urine Calcium', category: 'Full Body', subcategory: '24h Urine', price: 399, description: 'Measures calcium excretion over 24 hours to evaluate kidney stones and bone disorders.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Maintain usual diet for 3 days before. Collect all urine for 24 hours.' },
    { id: 186, name: '24-Hour Urine Uric Acid', category: 'Arthritis', subcategory: '24h Urine', price: 399, description: 'Measures uric acid excretion over 24 hours to differentiate gout from other hyperuricemias.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Collect all urine for 24 hours. Avoid alcohol for 24 hours before.' },
    { id: 187, name: '24-Hour Urine Sodium', category: 'Full Body', subcategory: '24h Urine', price: 349, description: 'Measures sodium excretion over 24 hours to evaluate salt intake, hypertension, and adrenal function.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Collect all urine for 24 hours. Maintain usual diet.' },
    { id: 188, name: 'Sputum AFB (Zeihl-Neelsen)', category: 'Fever', subcategory: 'TB Diagnosis', price: 299, description: 'Microscopic examination of sputum for acid-fast bacilli to diagnose pulmonary TB.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Early morning sputum sample preferred. Rinse mouth before collection.' },
    { id: 189, name: 'Sputum Culture & Sensitivity', category: 'Fever', subcategory: 'Respiratory Infections', price: 599, description: 'Identifies bacterial causes of respiratory infections and determines effective antibiotics.', fasting_required: false, report_time: '72 hrs', preparation_instructions: 'Early morning deep-cough sputum sample in sterile container.' },
    { id: 190, name: 'Throat Swab Culture', category: 'Fever', subcategory: 'Respiratory Infections', price: 449, description: 'Identifies bacterial pathogens causing sore throat including Group A Streptococcus.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Do not eat or drink for 30 minutes before collection.' },
    { id: 191, name: 'Urine PCR (STD Panel - GC/CT/Trich)', category: 'STD', subcategory: 'STD Panel', price: 1999, description: 'Multiplex PCR for Neisseria gonorrhoeae, Chlamydia trachomatis, and Trichomonas vaginalis.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Do not urinate for 1 hour before collection. First-catch urine preferred.' },
    { id: 192, name: 'HPV DNA (High Risk Types)', category: 'Cancer', subcategory: 'Cervical Screening', price: 3499, description: 'Detects high-risk HPV types 16, 18, and others associated with cervical cancer.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 193, name: 'Leukocyte Esterase (Urine Dipstick)', category: 'Full Body', subcategory: 'Urinalysis', price: 99, description: 'Quick dipstick test screening for UTI by detecting white blood cell activity in urine.', fasting_required: false, report_time: 'Immediate', preparation_instructions: 'Clean-catch mid-stream urine sample.' },
    { id: 194, name: 'Ovulation Predictor Kit (LH Surge)', category: 'Pregnancy', subcategory: 'Fertility', price: 349, description: 'Detects LH surge in urine to predict ovulation timing for fertility planning.', fasting_required: false, report_time: 'Immediate', preparation_instructions: 'Test mid-day. Reduce fluid intake 2 hours before.' },
    { id: 195, name: 'Helicobacter Pylori Urea Breath Test', category: 'Fever', subcategory: 'GI Infections', price: 1999, description: 'Non-invasive breath test for H. pylori infection — gold standard for eradication confirmation.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 6 hours. Avoid antibiotics and PPIs for 4 weeks before.' },
    { id: 196, name: 'Urine Glucose / Sugar (Random)', category: 'Diabetes', subcategory: 'Urine Glucose', price: 99, description: 'Screens for glucose in urine — a simple, non-invasive test for diabetes screening.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required. Clean-catch mid-stream sample.' },
    { id: 197, name: 'Insulin-Like Growth Factor Binding Protein-3 (IGFBP-3)', category: 'Hormones', subcategory: 'Growth Factors', price: 1499, description: 'Measures IGFBP-3 alongside IGF-1 for comprehensive growth hormone function assessment.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 198, name: 'Serotonin (5-HT)', category: 'Full Body', subcategory: 'Neurotransmitters', price: 1999, description: 'Measures serotonin levels in blood for evaluating neuroendocrine tumours and mood disorders.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 10 hours. Avoid bananas, pineapple, walnuts, and tomatoes for 48 hours before.' },
    { id: 199, name: 'Glucagon', category: 'Diabetes', subcategory: 'Pancreatic Hormones', price: 1499, description: 'Measures glucagon levels to evaluate alpha-cell function in diabetes and hypoglycemia disorders.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 10-12 hours required.' },
    { id: 200, name: 'Anti-GAD Antibodies (Glutamic Acid Decarboxylase)', category: 'Diabetes', subcategory: 'Autoimmune Diabetes', price: 1799, description: 'Detects GAD antibodies to distinguish type 1 diabetes (autoimmune) from type 2.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 201, name: 'IA-2 Antibody (Islet Antigen 2)', category: 'Diabetes', subcategory: 'Autoimmune Diabetes', price: 1999, description: 'Detects IA-2 antibodies — another marker for autoimmune type 1 diabetes prediction.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 202, name: 'Zinc Transporter 8 Antibody (ZnT8)', category: 'Diabetes', subcategory: 'Autoimmune Diabetes', price: 1999, description: 'Detects ZnT8 antibodies — a novel marker improving type 1 diabetes autoantibody detection.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 203, name: 'Urine Albumin-to-Creatinine Ratio (UACR)', category: 'Diabetes', subcategory: 'Kidney', price: 399, description: 'Calculates albumin-to-creatinine ratio in urine for early diabetic nephropathy detection.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'First morning urine sample preferred.' },
    { id: 204, name: 'CAPD Fluid Cell Count', category: 'Full Body', subcategory: 'Body Fluids', price: 499, description: 'Counts cells in peritoneal dialysis fluid to diagnose peritonitis in CAPD patients.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'Collect fluid aseptically in sterile container.' },
    { id: 205, name: 'Peritoneal Fluid Analysis', category: 'Full Body', subcategory: 'Body Fluids', price: 999, description: 'Comprehensive analysis of peritoneal fluid including chemistry, cell count, and microbiology.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Sample collected by physician during paracentesis.' },
    { id: 206, name: 'Pleural Fluid Analysis', category: 'Full Body', subcategory: 'Body Fluids', price: 999, description: 'Analysis of pleural fluid to differentiate transudate from exudate and diagnose pleural effusion cause.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Sample collected by physician during thoracentesis.' },
    { id: 207, name: 'Synovial Fluid Analysis', category: 'Arthritis', subcategory: 'Joint Fluids', price: 899, description: 'Examines joint fluid for crystals, infection, and inflammation to diagnose arthritis type.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'Sample collected by physician during arthrocentesis.' },
    { id: 208, name: 'Ascitic Fluid Analysis', category: 'Full Body', subcategory: 'Body Fluids', price: 999, description: 'Analysis of ascitic fluid to diagnose cause of ascites and detect spontaneous bacterial peritonitis.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Sample collected by physician during paracentesis.' },
    { id: 209, name: 'CSF Analysis (Cerebrospinal Fluid)', category: 'Fever', subcategory: 'Body Fluids', price: 1499, description: 'Complete examination of CSF including cell count, protein, glucose, and microbiology.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Sample collected by physician during lumbar puncture.' },
    { id: 210, name: 'RAST - Peanut', category: 'Allergy', subcategory: 'Food Allergy', price: 999, description: 'Measures specific IgE antibodies against peanut allergens for food allergy diagnosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 211, name: 'RAST - Egg White', category: 'Allergy', subcategory: 'Food Allergy', price: 999, description: 'Measures specific IgE antibodies against egg white proteins for egg allergy diagnosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 212, name: 'RAST - Milk (Cow\'s)', category: 'Allergy', subcategory: 'Food Allergy', price: 999, description: 'Measures specific IgE antibodies against cow\'s milk proteins for dairy allergy diagnosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 213, name: 'RAST - Shrimp', category: 'Allergy', subcategory: 'Food Allergy', price: 999, description: 'Measures specific IgE antibodies against shellfish allergens for seafood allergy diagnosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 214, name: 'RAST - Wheat', category: 'Allergy', subcategory: 'Food Allergy', price: 999, description: 'Measures specific IgE antibodies against wheat proteins for wheat allergy diagnosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 215, name: 'RAST - Soy', category: 'Allergy', subcategory: 'Food Allergy', price: 999, description: 'Measures specific IgE antibodies against soy proteins for soy allergy diagnosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 216, name: 'RAST - Tree Nut Mix', category: 'Allergy', subcategory: 'Food Allergy', price: 1199, description: 'Screens for IgE antibodies against common tree nuts (almond, cashew, walnut, hazelnut).', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 217, name: 'RAST - Grass Pollen Mix', category: 'Allergy', subcategory: 'Inhalant Allergy', price: 999, description: 'Measures specific IgE against common grass pollens for seasonal allergy diagnosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 218, name: 'RAST - Weed Pollen', category: 'Allergy', subcategory: 'Inhalant Allergy', price: 999, description: 'Measures specific IgE against weed pollen for hay fever and allergic rhinitis diagnosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 219, name: 'RAST - Cat Dander', category: 'Allergy', subcategory: 'Pet Allergy', price: 999, description: 'Measures specific IgE against cat dander allergens for pet allergy diagnosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 220, name: 'RAST - Dog Dander', category: 'Allergy', subcategory: 'Pet Allergy', price: 999, description: 'Measures specific IgE against dog dander allergens for pet allergy diagnosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 221, name: 'RAST - Mold Mix', category: 'Allergy', subcategory: 'Inhalant Allergy', price: 999, description: 'Measures specific IgE against common molds (Aspergillus, Penicillium, Alternaria) for mold allergy.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 222, name: 'RAST - Latex', category: 'Allergy', subcategory: 'Contact Allergy', price: 1199, description: 'Measures specific IgE against latex proteins for latex allergy diagnosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 223, name: 'Comprehensive Allergy Panel (35 Inhalants + 25 Foods)', category: 'Allergy', subcategory: 'Comprehensive', price: 7999, description: 'Complete allergy screening covering 35 inhalant and 25 food allergens in a single blood draw.', fasting_required: false, report_time: '7-10 days', preparation_instructions: 'No special preparation required.' },
    { id: 224, name: 'Food Intolerance Panel (IgG) - 100 Items', category: 'Allergy', subcategory: 'Food Intolerance', price: 9999, description: 'Measures IgG antibodies against 100 common foods to identify delayed food sensitivities.', fasting_required: false, report_time: '7-10 days', preparation_instructions: 'No special preparation required.' },
    { id: 225, name: 'HLA-DQ2/DQ8 (Celiac Genetics)', category: 'Full Body', subcategory: 'Genetic', price: 3499, description: 'Detects HLA-DQ2 and DQ8 genes associated with celiac disease risk.', fasting_required: false, report_time: '7-10 days', preparation_instructions: 'No special preparation required.' },
    { id: 226, name: 'Tissue Transglutaminase IgA (tTG-IgA)', category: 'Full Body', subcategory: 'Celiac', price: 799, description: 'Measures tTG-IgA antibodies — the primary screening test for celiac disease.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Gluten-containing diet required for accurate results.' },
    { id: 227, name: 'Deamidated Gliadin Peptide IgA (DGP-IgA)', category: 'Full Body', subcategory: 'Celiac', price: 899, description: 'Measures DGP-IgA antibodies — a secondary marker for celiac disease diagnosis.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Gluten-containing diet required for accurate results.' },
    { id: 228, name: 'Endomysial Antibody IgA (EMA)', category: 'Full Body', subcategory: 'Celiac', price: 1199, description: 'Detects endomysial antibodies — highly specific confirmatory test for celiac disease.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'Gluten-containing diet required for accurate results.' },
    { id: 229, name: 'Total IgA', category: 'Full Body', subcategory: 'Immunoglobulins', price: 449, description: 'Measures total IgA levels to rule out IgA deficiency which can cause false-negative celiac tests.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 230, name: 'IgG Subclasses (IgG1-4)', category: 'Allergy', subcategory: 'Immunodeficiencies', price: 2499, description: 'Measures IgG subclass levels to evaluate humoral immunodeficiency disorders.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 231, name: 'IgM', category: 'Full Body', subcategory: 'Immunoglobulins', price: 399, description: 'Measures immunoglobulin M levels — elevated in acute infection and certain immune disorders.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 232, name: 'IgG', category: 'Full Body', subcategory: 'Immunoglobulins', price: 399, description: 'Measures total immunoglobulin G levels to assess humoral immunity status.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 233, name: 'Complement CH50', category: 'Arthritis', subcategory: 'Complement', price: 999, description: 'Measures total complement haemolytic activity to screen for complement deficiencies.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 234, name: 'Anti-Smooth Muscle Antibody (SMA)', category: 'Liver', subcategory: 'Autoimmune Hepatitis', price: 999, description: 'Detects anti-smooth muscle antibodies for diagnosing autoimmune hepatitis type 1.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 235, name: 'Anti-Mitochondrial Antibody (AMA)', category: 'Liver', subcategory: 'Primary Biliary Cholangitis', price: 999, description: 'Detects anti-mitochondrial antibodies — the hallmark of primary biliary cholangitis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 236, name: 'Anti-Liver-Kidney Microsomal (LKM-1)', category: 'Liver', subcategory: 'Autoimmune Hepatitis', price: 1199, description: 'Detects anti-LKM1 antibodies for diagnosing autoimmune hepatitis type 2.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 237, name: 'Copper (24h Urine)', category: 'Liver', subcategory: 'Copper Metabolism', price: 799, description: 'Measures copper excretion over 24 hours to diagnose Wilson\'s disease.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Collect all urine for 24 hours in a copper-free container.' },
    { id: 238, name: 'Free Copper (Serum)', category: 'Liver', subcategory: 'Copper Metabolism', price: 899, description: 'Measures free (non-ceruloplasmin-bound) copper levels for Wilson\'s disease diagnosis.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 239, name: 'Bile Acids (Fasting Serum)', category: 'Liver', subcategory: 'Cholestasis', price: 799, description: 'Measures fasting bile acid levels to evaluate liver function and cholestatic disorders.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 10-12 hours required.' },
    { id: 240, name: 'Ammonia (Plasma)', category: 'Liver', subcategory: 'Hepatic Encephalopathy', price: 499, description: 'Measures blood ammonia levels to monitor hepatic encephalopathy and urea cycle disorders.', fasting_required: true, report_time: '6 hrs', preparation_instructions: 'Fasting required. Sample must be placed on ice immediately.' },
    { id: 241, name: 'Lactate (Plasma)', category: 'Full Body', subcategory: 'Metabolism', price: 499, description: 'Measures blood lactate levels for sepsis, shock, and mitochondrial disorder evaluation.', fasting_required: true, report_time: '6 hrs', preparation_instructions: 'Fasting for 8 hours. No exercise for 24 hours before. Sample on ice.' },
    { id: 242, name: 'Pyruvate', category: 'Full Body', subcategory: 'Metabolism', price: 899, description: 'Measures pyruvate levels alongside lactate for mitochondrial and metabolic disorder evaluation.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 10-12 hours. Sample on ice. No fist clenching.' },
    { id: 243, name: 'Beta-Hydroxybutyrate (Ketone)', category: 'Diabetes', subcategory: 'Ketone Monitoring', price: 599, description: 'Measures beta-hydroxybutyrate levels to monitor diabetic ketoacidosis and ketogenic diet.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 244, name: 'Acetoacetate (Urine Ketones)', category: 'Diabetes', subcategory: 'Ketone Monitoring', price: 99, description: 'Dipstick test for ketones in urine to monitor diabetes control and ketogenic diet compliance.', fasting_required: false, report_time: 'Immediate', preparation_instructions: 'No special preparation required.' },
    { id: 245, name: 'Osmolality (Serum)', category: 'Full Body', subcategory: 'Fluid Balance', price: 399, description: 'Measures serum osmolality to evaluate hydration status, electrolyte balance, and ADH function.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 246, name: 'Osmolality (Urine)', category: 'Full Body', subcategory: 'Fluid Balance', price: 399, description: 'Measures urine osmolality to assess kidney concentrating ability and fluid balance disorders.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 247, name: 'Anion Gap', category: 'Full Body', subcategory: 'Acid-Base', price: 249, description: 'Calculated from electrolytes to identify metabolic acidosis causes like DKA or renal failure.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 248, name: 'Blood Gas (Venous)', category: 'Full Body', subcategory: 'Acid-Base', price: 599, description: 'Measures venous blood pH, pCO2, pO2, HCO3, and base excess to assess acid-base balance.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'Sample must be collected anaerobically and placed on ice.' },
    { id: 249, name: 'Carboxyhemoglobin (COHb)', category: 'Full Body', subcategory: 'Toxicology', price: 699, description: 'Measures carbon monoxide levels in blood to diagnose CO poisoning and monitor smoke inhalation.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 250, name: 'Methemoglobin', category: 'Full Body', subcategory: 'Toxicology', price: 499, description: 'Measures methemoglobin levels to diagnose acquired or congenital methemoglobinemia.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 251, name: 'Red Cell Distribution Width (RDW)', category: 'Hematology', subcategory: 'Red Cell Indices', price: 149, description: 'Measures variation in red blood cell size — elevated in iron deficiency and mixed anaemias.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 252, name: 'Mean Platelet Volume (MPV)', category: 'Hematology', subcategory: 'Platelet Indices', price: 149, description: 'Measures average platelet size — elevated in increased platelet turnover.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 253, name: 'Absolute Eosinophil Count', category: 'Allergy', subcategory: 'Allergy Screening', price: 249, description: 'Measures absolute eosinophil count — elevated in allergic conditions and parasitic infections.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 254, name: 'Reticulocyte Hemoglobin Content (CHr)', category: 'Anemia', subcategory: 'Iron Status', price: 399, description: 'Measures hemoglobin content in young red cells — the earliest marker of iron deficiency.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 255, name: 'Tryptase', category: 'Allergy', subcategory: 'Mast Cell', price: 1499, description: 'Measures mast cell tryptase levels to diagnose anaphylaxis and mast cell disorders.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Sample within 1-4 hours of symptom onset for acute reactions.' },
    { id: 256, name: 'Eosinophilic Cationic Protein (ECP)', category: 'Allergy', subcategory: 'Eosinophil Activity', price: 1199, description: 'Measures ECP levels to monitor eosinophilic inflammation in asthma and allergic diseases.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 257, name: 'Circulating Immune Complexes (CIC)', category: 'Arthritis', subcategory: 'Autoimmune', price: 999, description: 'Measures immune complex levels elevated in autoimmune diseases like SLE and vasculitis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 258, name: 'Cryoglobulin (Qualitative + Quant)', category: 'Arthritis', subcategory: 'Autoimmune', price: 1499, description: 'Detects cold-precipitable proteins in blood associated with vasculitis and hepatitis C.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 8 hours. Sample kept at 37°C during transport.' },
    { id: 259, name: 'Anti-Ro/SSA & Anti-La/SSB Antibodies', category: 'Arthritis', subcategory: 'Sjogrens', price: 1499, description: 'Detects antibodies for Sjögren\'s syndrome diagnosis and SLE subset identification.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 260, name: 'Anti-Scl-70 (Topoisomerase I)', category: 'Arthritis', subcategory: 'Scleroderma', price: 1199, description: 'Detects anti-Scl-70 antibodies for systemic sclerosis (scleroderma) diagnosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 261, name: 'Anti-Jo-1 Antibody', category: 'Arthritis', subcategory: 'Myositis', price: 1499, description: 'Detects anti-Jo-1 antibodies for polymyositis/dermatomyositis diagnosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 262, name: 'Anti-RNP Antibody', category: 'Arthritis', subcategory: 'MCTD', price: 1199, description: 'Detects anti-RNP antibodies for mixed connective tissue disease diagnosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 263, name: 'Anti-Smith (Sm) Antibody', category: 'Arthritis', subcategory: 'Lupus', price: 1199, description: 'Detects anti-Smith antibodies — highly specific for systemic lupus erythematosus.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 264, name: 'Anti-Centromere Antibody', category: 'Arthritis', subcategory: 'Limited Scleroderma', price: 1199, description: 'Detects anti-centromere antibodies for limited cutaneous systemic sclerosis (CREST).', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 265, name: 'Anti-GBM Antibody', category: 'Full Body', subcategory: 'Kidney', price: 1499, description: 'Detects anti-glomerular basement membrane antibodies in Goodpasture syndrome.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 266, name: 'Anti-MPO (p-ANCA)', category: 'Arthritis', subcategory: 'Vasculitis', price: 1199, description: 'Detects perinuclear ANCA antibodies for microscopic polyangiitis and eosinophilic granulomatosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 267, name: 'Anti-PR3 (c-ANCA)', category: 'Arthritis', subcategory: 'Vasculitis', price: 1199, description: 'Detects cytoplasmic ANCA antibodies for granulomatosis with polyangiitis (Wegener\'s).', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 268, name: 'Myeloperoxidase (MPO) Antibody', category: 'Arthritis', subcategory: 'Vasculitis', price: 1499, description: 'Quantitative MPO antibody test for ANCA-associated vasculitis diagnosis and monitoring.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 269, name: 'Proteinase 3 (PR3) Antibody', category: 'Arthritis', subcategory: 'Vasculitis', price: 1499, description: 'Quantitative PR3 antibody test for Wegener\'s granulomatosis diagnosis and monitoring.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 270, name: 'Histamine (Plasma)', category: 'Allergy', subcategory: 'Mast Cell', price: 1799, description: 'Measures plasma histamine levels for mast cell activation disorders and allergic reactions.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 8 hours. Sample on ice. Stop antihistamines 72 hours before.' },
    { id: 271, name: 'N-Methylhistamine (Urine)', category: 'Allergy', subcategory: 'Mast Cell', price: 1499, description: 'Measures urinary histamine metabolite for systemic mastocytosis diagnosis.', fasting_required: false, report_time: '48 hrs', preparation_instructions: '24-hour urine collection. Avoid histamine-rich foods for 48 hours before.' },
    { id: 272, name: 'Prostate Health Index (PHI)', category: 'Cancer', subcategory: 'Prostate', price: 3499, description: 'Combines total PSA, free PSA, and p2PSA to improve prostate cancer detection accuracy.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Avoid ejaculation for 48 hours before.' },
    { id: 273, name: 'Free PSA (% Free PSA)', category: 'Cancer', subcategory: 'Prostate', price: 999, description: 'Measures free-to-total PSA ratio to differentiate prostate cancer from benign enlargement.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Avoid ejaculation for 48 hours before.' },
    { id: 274, name: 'CA 19-9', category: 'Cancer', subcategory: 'Pancreatic', price: 1199, description: 'Tumor marker for pancreatic cancer monitoring and gastrointestinal malignancy assessment.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 275, name: 'CA 15-3', category: 'Cancer', subcategory: 'Breast', price: 1199, description: 'Tumor marker for breast cancer treatment monitoring and recurrence surveillance.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 276, name: 'CA 27.29', category: 'Cancer', subcategory: 'Breast', price: 1499, description: 'Alternative breast cancer tumor marker for monitoring metastatic disease.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 277, name: 'CEA (Carcinoembryonic Antigen)', category: 'Cancer', subcategory: 'GI Cancers', price: 799, description: 'Tumor marker for colorectal cancer monitoring and other GI malignancy surveillance.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 278, name: 'AFP (Alpha-Fetoprotein)', category: 'Cancer', subcategory: 'Liver', price: 799, description: 'Tumor marker for hepatocellular carcinoma screening and monitoring in high-risk patients.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 279, name: 'Beta-2 Microglobulin', category: 'Cancer', subcategory: 'Multiple Myeloma', price: 999, description: 'Measures beta-2 microglobulin levels for multiple myeloma staging and prognosis.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 280, name: 'LDH Isoenzymes', category: 'Full Body', subcategory: 'Enzymes', price: 999, description: 'Separates LDH into 5 fractions to identify tissue-specific sources of elevation.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 281, name: 'Alkaline Phosphatase Isoenzymes', category: 'Full Body', subcategory: 'Enzymes', price: 899, description: 'Differentiates bone vs liver sources of elevated ALP for accurate diagnosis.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 8-10 hours recommended.' },
    { id: 282, name: 'CK-MB Mass', category: 'Cardiac', subcategory: 'Cardiac Markers', price: 999, description: 'Quantitative CK-MB mass assay for more accurate heart attack diagnosis.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 283, name: 'Galectin-3', category: 'Cardiac', subcategory: 'Heart Failure', price: 1999, description: 'Measures galectin-3 levels for heart failure risk stratification and prognosis.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 284, name: 'ST2 (Soluble Suppression of Tumorigenicity 2)', category: 'Cardiac', subcategory: 'Heart Failure', price: 2499, description: 'Measures ST2 levels for heart failure prognosis and treatment response monitoring.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 285, name: 'GDF-15 (Growth Differentiation Factor 15)', category: 'Cardiac', subcategory: 'Cardiac Risk', price: 2999, description: 'Measures GDF-15 levels for cardiovascular risk assessment and prognosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 286, name: 'Trimethylamine N-Oxide (TMAO)', category: 'Cardiac', subcategory: 'Cardiac Risk', price: 3499, description: 'Measures TMAO levels — a gut-microbiome-derived marker for cardiovascular disease risk.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 10-12 hours. Avoid red meat and eggs for 48 hours before.' },
    { id: 287, name: 'Oxidized LDL', category: 'Cardiac', subcategory: 'Cardiac Risk', price: 2499, description: 'Measures oxidized LDL levels — a more specific marker for atherosclerosis and plaque formation.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 12 hours required.' },
    { id: 288, name: 'Small Dense LDL', category: 'Cardiac', subcategory: 'Lipid Subfractions', price: 1999, description: 'Measures small dense LDL particles — the most atherogenic lipid subfraction.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 12 hours required.' },
    { id: 289, name: 'LDL Particle Number (LDL-P)', category: 'Cardiac', subcategory: 'Lipid Subfractions', price: 2999, description: 'Measures LDL particle concentration for more accurate cardiovascular risk assessment.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 12 hours required.' },
    { id: 290, name: 'Apolipoprotein A1 (ApoA1)', category: 'Cardiac', subcategory: 'Apolipoproteins', price: 999, description: 'Measures ApoA1 — the main protein in HDL cholesterol, protective against heart disease.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 291, name: 'Apolipoprotein B (ApoB)', category: 'Cardiac', subcategory: 'Apolipoproteins', price: 999, description: 'Measures ApoB — the main protein in LDL cholesterol, a better cardiac risk marker than LDL alone.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 292, name: 'ApoB/ApoA1 Ratio', category: 'Cardiac', subcategory: 'Apolipoproteins', price: 1499, description: 'Calculated ratio of ApoB to ApoA1 — a powerful predictor of heart attack risk.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 293, name: 'Lipoprotein(a) [Lp(a)] High Sensitivity', category: 'Cardiac', subcategory: 'Lipoprotein', price: 1499, description: 'High-sensitivity Lp(a) measurement — a strong genetic risk factor for heart disease.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 294, name: 'Remnant Lipoprotein Cholesterol', category: 'Cardiac', subcategory: 'Lipid Remnants', price: 1499, description: 'Measures remnant cholesterol — contributes to cardiovascular risk beyond LDL.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 12 hours required.' },
    { id: 295, name: 'sdLDL / LDL-TG', category: 'Cardiac', subcategory: 'Lipid Subfractions', price: 1999, description: 'Measures small dense LDL and LDL triglyceride content for advanced lipid analysis.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 12 hours required.' },
    { id: 296, name: 'IGFBP-3 / IGF-1 Ratio', category: 'Hormones', subcategory: 'Growth Factors', price: 2499, description: 'Calculated ratio for comprehensive growth hormone axis evaluation.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 297, name: 'Semen Analysis (Complete)', category: 'Pregnancy', subcategory: 'Fertility', price: 1499, description: 'Comprehensive semen analysis including count, motility, morphology, and pH for male fertility.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Abstain for 2-5 days before collection. Sample collected on-site.' },
    { id: 298, name: 'Post-Vasectomy Semen Analysis', category: 'Pregnancy', subcategory: 'Fertility', price: 999, description: 'Confirms vasectomy success by checking for absence of sperm in ejaculate.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Provide sample 12 weeks post-procedure after 20+ ejaculations.' },
    { id: 299, name: 'Paternal Carriers Screening (CF, SMA, FXS)', category: 'Pregnancy', subcategory: 'Genetic Screening', price: 9999, description: 'Screens for common genetic carrier conditions: cystic fibrosis, SMA, and Fragile X syndrome.', fasting_required: false, report_time: '7-10 days', preparation_instructions: 'No special preparation required.' },
    { id: 300, name: 'Non-Invasive Prenatal Testing (NIPT)', category: 'Pregnancy', subcategory: 'Prenatal Screening', price: 14999, description: 'Cell-free fetal DNA screening for trisomy 21, 18, 13 and sex chromosome abnormalities.', fasting_required: false, report_time: '7-10 days', preparation_instructions: 'No special preparation required. Viable after 10 weeks gestation.' },
    { id: 301, name: 'Total Bilirubin', category: 'Liver', subcategory: 'Bilirubin', price: 199, description: 'Measures total bilirubin levels to evaluate liver function and detect jaundice causes.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 302, name: 'Direct Bilirubin (Conjugated)', category: 'Liver', subcategory: 'Bilirubin', price: 199, description: 'Measures conjugated bilirubin to differentiate obstructive jaundice from hemolytic jaundice.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 303, name: 'Indirect Bilirubin (Unconjugated)', category: 'Liver', subcategory: 'Bilirubin', price: 199, description: 'Calculated unconjugated bilirubin level to evaluate hemolytic anemia and Gilbert syndrome.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 304, name: 'Blood Urea / BUN', category: 'Full Body', subcategory: 'Kidney Function', price: 199, description: 'Measures blood urea nitrogen levels to assess kidney function and hydration status.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 305, name: 'Serum Creatinine', category: 'Full Body', subcategory: 'Kidney Function', price: 199, description: 'Measures creatinine levels to assess kidney filtration function and detect renal impairment.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 306, name: 'eGFR (Estimated Glomerular Filtration Rate)', category: 'Full Body', subcategory: 'Kidney Function', price: 249, description: 'Calculated eGFR from creatinine to stage chronic kidney disease progression.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required — calculated from creatinine.' },
    { id: 307, name: 'Creatinine Clearance (24h Urine)', category: 'Full Body', subcategory: 'Kidney Function', price: 449, description: '24-hour urine creatinine clearance test for precise kidney function measurement.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Collect all urine for 24 hours in provided container. Keep refrigerated.' },
    { id: 308, name: 'Triglycerides', category: 'Cardiac', subcategory: 'Lipid Profile', price: 249, description: 'Measures triglyceride levels — elevated levels increase heart disease and pancreatitis risk.', fasting_required: true, report_time: '12 hrs', preparation_instructions: 'Fasting for 9-12 hours required.' },
    { id: 309, name: 'VLDL Cholesterol', category: 'Cardiac', subcategory: 'Lipid Profile', price: 249, description: 'Measures very low-density lipoprotein cholesterol — carries triglycerides in blood.', fasting_required: true, report_time: '12 hrs', preparation_instructions: 'Fasting for 9-12 hours required.' },
    { id: 310, name: 'Direct LDL Cholesterol', category: 'Cardiac', subcategory: 'Lipid Profile', price: 349, description: 'Directly measured LDL cholesterol (not calculated) for accurate lipid assessment.', fasting_required: true, report_time: '12 hrs', preparation_instructions: 'Fasting for 9-12 hours required.' },
    { id: 311, name: 'HOMA-IR (Insulin Resistance Index)', category: 'Diabetes', subcategory: 'Insulin Resistance', price: 799, description: 'Calculated index from fasting glucose and insulin to quantify insulin resistance.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 10-12 hours required. Calculated from glucose + insulin values.' },
    { id: 312, name: 'T3 Uptake (Resin)', category: 'Thyroid', subcategory: 'Thyroid Function', price: 299, description: 'Measures thyroid hormone binding capacity to calculate Free T4 and T7 indices.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 313, name: 'Free T3 Index (FTI / T7)', category: 'Thyroid', subcategory: 'Thyroid Function', price: 399, description: 'Calculated index from T3 uptake and total T4 for adjusted thyroid function assessment.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required. Calculated from T3 uptake and T4.' },
    { id: 314, name: 'Free T4 Index', category: 'Thyroid', subcategory: 'Thyroid Function', price: 399, description: 'Calculated index correcting total T4 for TBG binding variations.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 315, name: 'Reverse T3 (rT3)', category: 'Thyroid', subcategory: 'Thyroid Function', price: 1199, description: 'Measures reverse T3 — the inactive form of T3, elevated in non-thyroidal illness and stress.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 316, name: 'TBG (Thyroxine Binding Globulin)', category: 'Thyroid', subcategory: 'Thyroid Function', price: 699, description: 'Measures TBG levels to interpret total T3/T4 results and evaluate binding abnormalities.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 317, name: 'Calcitonin', category: 'Cancer', subcategory: 'Thyroid Cancer', price: 1299, description: 'Measures calcitonin levels to screen for and monitor medullary thyroid carcinoma.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 8 hours recommended. Avoid calcium supplements for 24 hours.' },
    { id: 318, name: 'Thyroglobulin (Tg)', category: 'Cancer', subcategory: 'Thyroid Cancer', price: 899, description: 'Measures thyroglobulin levels to monitor thyroid cancer recurrence after treatment.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'TSH suppression status must be documented for accurate interpretation.' },
    { id: 319, name: 'Thyroglobulin Antibody (TgAb)', category: 'Thyroid', subcategory: 'Autoimmune', price: 899, description: 'Detects anti-thyroglobulin antibodies to validate thyroglobulin results and diagnose thyroiditis.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 320, name: 'TSH Receptor Antibody (TRAb)', category: 'Thyroid', subcategory: 'Autoimmune', price: 1299, description: 'Detects TSH receptor stimulating antibodies to diagnose Graves disease.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 321, name: '17-OH Progesterone', category: 'Hormones', subcategory: 'Adrenal Hormones', price: 1199, description: 'Measures 17-hydroxyprogesterone to screen for congenital adrenal hyperplasia (CAH).', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 8 hours. Morning sample preferred.' },
    { id: 322, name: 'Androstenedione', category: 'Hormones', subcategory: 'Adrenal Hormones', price: 899, description: 'Measures androstenedione levels to evaluate adrenal/ovarian androgen production and PCOS.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 323, name: 'Pregnenolone', category: 'Hormones', subcategory: 'Neurosteroids', price: 1499, description: 'Measures pregnenolone — a precursor hormone involved in memory, mood, and stress response.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 324, name: 'DHEA (Free / Unconjugated)', category: 'Hormones', subcategory: 'Adrenal Hormones', price: 799, description: 'Measures unconjugated DHEA levels — the active form, differs from DHEA-S.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Morning sample preferred. No special preparation required.' },
    { id: 325, name: 'Insulin Antibody (IAA)', category: 'Diabetes', subcategory: 'Autoimmune Diabetes', price: 1799, description: 'Detects insulin autoantibodies for type 1 diabetes prediction and insulin autoimmune syndrome.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 326, name: 'Fecal Lactoferrin', category: 'Full Body', subcategory: 'GI Inflammation', price: 1499, description: 'Measures lactoferrin in stool — a marker of intestinal inflammation distinguishing IBD from IBS.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'Collect sample in clean container. Avoid NSAIDs before test.' },
    { id: 327, name: 'Pancreatic Elastase (Stool)', category: 'Full Body', subcategory: 'Pancreatic Function', price: 1999, description: 'Measures pancreatic elastase in stool to assess exocrine pancreatic insufficiency.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'Collect sample from formed stool. Avoid watery stools.' },
    { id: 328, name: 'Sweat Chloride Test', category: 'Full Body', subcategory: 'Cystic Fibrosis', price: 2499, description: 'Measures chloride concentration in sweat — the gold-standard diagnostic test for cystic fibrosis.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation. Avoid lotions/creams on arms on test day.' },
    { id: 329, name: 'Tissue Transglutaminase IgG (tTG-IgG)', category: 'Full Body', subcategory: 'Celiac', price: 899, description: 'Detects tTG-IgG antibodies for celiac disease screening in IgA-deficient individuals.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Gluten-containing diet required for accurate results.' },
    { id: 330, name: 'Albumin (Serum)', category: 'Full Body', subcategory: 'Proteins', price: 199, description: 'Measures serum albumin levels to assess nutritional status and liver/kidney function.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 331, name: 'Globulin (Serum)', category: 'Full Body', subcategory: 'Proteins', price: 199, description: 'Calculated globulin level (total protein minus albumin) for immune and liver assessment.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 332, name: 'A/G Ratio (Albumin/Globulin)', category: 'Full Body', subcategory: 'Proteins', price: 249, description: 'Calculated albumin-to-globulin ratio — abnormal in liver disease, kidney disease, and myeloma.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required. Calculated from albumin and globulin.' },
    { id: 333, name: 'Fructosamine', category: 'Diabetes', subcategory: 'Glucose Monitoring', price: 599, description: 'Measures average blood glucose over 2-3 weeks — useful when HbA1c is unreliable.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 334, name: '1,5-Anhydroglucitol (GlycoMark)', category: 'Diabetes', subcategory: 'Glucose Monitoring', price: 1499, description: 'Measures 1,5-AG to detect short-term glucose excursions and post-meal spikes.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 335, name: 'Urine Protein Electrophoresis (UPEP)', category: 'Cancer', subcategory: 'Multiple Myeloma', price: 999, description: 'Separates proteins in urine to detect Bence Jones proteins in multiple myeloma.', fasting_required: false, report_time: '48 hrs', preparation_instructions: '24-hour urine collection required.' },
    { id: 336, name: 'CA 19-9', category: 'Cancer', subcategory: 'Tumor Markers', price: 1299, description: 'Tumor marker for pancreatic cancer, biliary tract cancer monitoring and treatment response.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 8 hours recommended.' },
    { id: 337, name: 'CA 15-3', category: 'Cancer', subcategory: 'Tumor Markers', price: 1199, description: 'Tumor marker for monitoring breast cancer treatment response and recurrence detection.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 338, name: 'NSE (Neuron-Specific Enolase)', category: 'Cancer', subcategory: 'Tumor Markers', price: 1499, description: 'Tumor marker for small cell lung cancer and neuroendocrine tumors.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Avoid hemolysis — inform lab if sample is visibly red.' },
    { id: 339, name: 'Cyfra 21-1', category: 'Cancer', subcategory: 'Tumor Markers', price: 1399, description: 'Tumor marker for non-small cell lung cancer, especially squamous cell type.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 340, name: 'SCC Antigen', category: 'Cancer', subcategory: 'Tumor Markers', price: 1299, description: 'Tumor marker for squamous cell carcinomas of cervix, lung, head & neck, esophagus.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 341, name: 'HE4 (Human Epididymis Protein 4)', category: 'Cancer', subcategory: 'Tumor Markers', price: 1799, description: 'Ovarian cancer biomarker used in ROMA algorithm for epithelial ovarian cancer risk assessment.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 342, name: 'GALAD Score (Ovarian Cancer Risk)', category: 'Cancer', subcategory: 'Cancer Screening', price: 3499, description: 'Combined algorithm using HE4, CA125, age, and menopausal status for ovarian cancer risk.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required. Calculated panel.' },
    { id: 343, name: 'CA 72-4', category: 'Cancer', subcategory: 'Tumor Markers', price: 1399, description: 'Tumor marker for gastric, ovarian, and pancreatic cancer monitoring.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 344, name: 'CA 242', category: 'Cancer', subcategory: 'Tumor Markers', price: 1399, description: 'Tumor marker for pancreatic and colorectal cancer monitoring.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 345, name: 'BHCG (Beta-Human Chorionic Gonadotropin) Tumour', category: 'Cancer', subcategory: 'Tumor Markers', price: 599, description: 'Tumor marker for germ cell tumours, choriocarcinoma, and testicular cancer monitoring.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 346, name: 'AFP-L3 (Lens Culinaris Agglutinin)', category: 'Cancer', subcategory: 'Liver Cancer', price: 2499, description: 'AFP isoform that improves hepatocellular carcinoma detection specificity.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 347, name: 'DCP / PIVKA-II', category: 'Cancer', subcategory: 'Liver Cancer', price: 2999, description: 'Des-gamma-carboxyprothrombin — a highly specific hepatocellular carcinoma biomarker.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 348, name: 'IMMUNOGLOBULIN E (IgE) - Milk', category: 'Allergy', subcategory: 'Allergen Specific', price: 899, description: 'Measures specific IgE antibodies against cow milk protein for milk allergy diagnosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 349, name: 'IMMUNOGLOBULIN E (IgE) - Egg White', category: 'Allergy', subcategory: 'Allergen Specific', price: 899, description: 'Measures specific IgE antibodies against egg white protein for egg allergy diagnosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 350, name: 'IMMUNOGLOBULIN E (IgE) - Peanut', category: 'Allergy', subcategory: 'Allergen Specific', price: 899, description: 'Measures specific IgE antibodies against peanut for peanut allergy diagnosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 351, name: 'IMMUNOGLOBULIN E (IgE) - Wheat', category: 'Allergy', subcategory: 'Allergen Specific', price: 899, description: 'Measures specific IgE antibodies against wheat for wheat allergy diagnosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 352, name: 'IMMUNOGLOBULIN E (IgE) - Soy', category: 'Allergy', subcategory: 'Allergen Specific', price: 899, description: 'Measures specific IgE antibodies against soybean for soy allergy diagnosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 353, name: 'IMMUNOGLOBULIN E (IgE) - Tree Nut Mix', category: 'Allergy', subcategory: 'Allergen Specific', price: 1299, description: 'Measures specific IgE against almond, cashew, walnut, hazelnut, and pecan for tree nut allergy.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 354, name: 'IMMUNOGLOBULIN E (IgE) - Fish Mix', category: 'Allergy', subcategory: 'Allergen Specific', price: 1299, description: 'Measures specific IgE against cod, salmon, tuna, and mackerel for fish allergy diagnosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 355, name: 'IMMUNOGLOBULIN E (IgE) - Shellfish Mix', category: 'Allergy', subcategory: 'Allergen Specific', price: 1299, description: 'Measures specific IgE against shrimp, crab, lobster, and mussel for shellfish allergy.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 356, name: 'IMMUNOGLOBULIN E (IgE) - Sesame Seed', category: 'Allergy', subcategory: 'Allergen Specific', price: 899, description: 'Measures specific IgE against sesame for sesame allergy diagnosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 357, name: 'BRCA1/BRCA2 Full Sequencing', category: 'Cancer', subcategory: 'Genetic', price: 24999, description: 'Complete sequencing of BRCA1 and BRCA2 genes for hereditary breast and ovarian cancer risk.', fasting_required: false, report_time: '14-21 days', preparation_instructions: 'Genetic counselling recommended before and after test.' },
    { id: 358, name: 'BRCA1/BRCA2 Founder Mutation Panel', category: 'Cancer', subcategory: 'Genetic', price: 9999, description: 'Targeted panel of common BRCA1/BRCA2 founder mutations for hereditary cancer screening.', fasting_required: false, report_time: '7-10 days', preparation_instructions: 'No special preparation required.' },
    { id: 359, name: 'Hereditary Cancer Panel (30 Genes)', category: 'Cancer', subcategory: 'Genetic', price: 44999, description: 'Comprehensive NGS panel covering BRCA1/2, PALB2, ATM, CHEK2, RAD51, MLH1, MSH2, and more.', fasting_required: false, report_time: '14-21 days', preparation_instructions: 'Genetic counselling recommended before and after test.' },
    { id: 360, name: 'Pharmacogenomics Panel (CYP450)', category: 'Full Body', subcategory: 'Genetic', price: 19999, description: 'Analyzes CYP2D6, CYP2C9, CYP2C19, CYP3A4/5 variants affecting drug metabolism.', fasting_required: false, report_time: '14-21 days', preparation_instructions: 'No special preparation required. Inform about current medications.' },
    { id: 361, name: 'Warfarin Sensitivity Panel (CYP2C9 + VKORC1)', category: 'Full Body', subcategory: 'Genetic', price: 9999, description: 'Detects CYP2C9 and VKORC1 variants to guide warfarin dosing and reduce bleeding risk.', fasting_required: false, report_time: '7-10 days', preparation_instructions: 'No special preparation required.' },
    { id: 362, name: 'Clopidogrel Responsiveness (CYP2C19)', category: 'Full Body', subcategory: 'Genetic', price: 7999, description: 'Detects CYP2C19 loss-of-function variants affecting clopidogrel activation and efficacy.', fasting_required: false, report_time: '7-10 days', preparation_instructions: 'No special preparation required.' },
    { id: 363, name: 'Lynch Syndrome Panel (MSI + IHC)', category: 'Cancer', subcategory: 'Genetic', price: 24999, description: 'Screens for microsatellite instability and IHC loss of MLH1/MSH2/MSH6/PMS2 for Lynch syndrome.', fasting_required: false, report_time: '10-14 days', preparation_instructions: 'Tumour tissue sample required.' },
    { id: 364, name: 'EBV VCA IgM / IgG / EA / EBNA Panel', category: 'Fever', subcategory: 'Viral Infections', price: 1499, description: 'Comprehensive Epstein-Barr virus antibody panel for infectious mononucleosis and past infection.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 365, name: 'Varicella Zoster Virus (VZV) IgG/IgM', category: 'Fever', subcategory: 'Viral Infections', price: 899, description: 'Detects VZV antibodies for chickenpox/shingles diagnosis and immunity screening.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 366, name: 'Measles IgG/IgM', category: 'Fever', subcategory: 'Viral Infections', price: 799, description: 'Detects measles virus antibodies for diagnosis and immunity assessment.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 367, name: 'Mumps IgG/IgM', category: 'Fever', subcategory: 'Viral Infections', price: 799, description: 'Detects mumps virus antibodies for diagnosis and immunity assessment.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 368, name: 'Pertussis (Bordetella) IgG/IgM', category: 'Fever', subcategory: 'Bacterial Infections', price: 1299, description: 'Detects Bordetella pertussis antibodies for whooping cough diagnosis.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 369, name: 'Widal Test (S. Typhi O/H, Paratyphi AH/BH)', category: 'Fever', subcategory: 'Bacterial Infections', price: 449, description: 'Standard agglutination test for typhoid and paratyphoid fever diagnosis.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 370, name: 'Weil-Felix Test', category: 'Fever', subcategory: 'Rickettsial Infections', price: 599, description: 'Detects antibodies against OX19, OX2, OXK antigens for rickettsial disease diagnosis.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 371, name: 'Brucella IgG/IgM', category: 'Fever', subcategory: 'Bacterial Infections', price: 999, description: 'Detects Brucella antibodies for brucellosis (undulant fever) diagnosis.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 372, name: 'Legionella Urinary Antigen', category: 'Fever', subcategory: 'Bacterial Infections', price: 1999, description: 'Detects Legionella pneumophila serogroup 1 antigen in urine for Legionnaires disease.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'Urine sample at any time of day.' },
    { id: 373, name: 'Cryptococcal Antigen (Serum/CSF)', category: 'Fever', subcategory: 'Fungal Infections', price: 1499, description: 'Detects Cryptococcus neoformans antigen for meningitis diagnosis in immunocompromised patients.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'CSF sample requires lumbar puncture by physician.' },
    { id: 374, name: 'Histoplasma Antigen (Urine/Serum)', category: 'Fever', subcategory: 'Fungal Infections', price: 1999, description: 'Detects Histoplasma capsulatum antigen for histoplasmosis diagnosis.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 375, name: 'Anti-SSA/Ro Antibody', category: 'Arthritis', subcategory: 'Autoimmune', price: 1199, description: 'Detects anti-SSA/Ro antibodies associated with Sjogren syndrome and lupus.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 376, name: 'Anti-SSB/La Antibody', category: 'Arthritis', subcategory: 'Autoimmune', price: 1199, description: 'Detects anti-SSB/La antibodies associated with Sjogren syndrome and subacute cutaneous lupus.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 377, name: 'Anti-Sm Antibody (Smith)', category: 'Arthritis', subcategory: 'Autoimmune', price: 1199, description: 'Detects anti-Smith antibodies — highly specific for systemic lupus erythematosus.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 378, name: 'Anti-RNP Antibody', category: 'Arthritis', subcategory: 'Autoimmune', price: 1199, description: 'Detects anti-ribonucleoprotein antibodies in mixed connective tissue disease and lupus.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 379, name: 'Anti-Scl-70 (Topoisomerase I) Antibody', category: 'Arthritis', subcategory: 'Autoimmune', price: 1199, description: 'Detects anti-Scl-70 antibodies — a marker for systemic sclerosis (scleroderma).', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 380, name: 'Anti-Jo-1 Antibody', category: 'Arthritis', subcategory: 'Autoimmune', price: 1199, description: 'Detects anti-Jo-1 antibodies associated with polymyositis and interstitial lung disease.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 381, name: 'Anti-Centromere Antibody', category: 'Arthritis', subcategory: 'Autoimmune', price: 1199, description: 'Detects anti-centromere antibodies — a marker for limited systemic sclerosis (CREST syndrome).', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 382, name: 'MPO (Myeloperoxidase)', category: 'Cardiac', subcategory: 'Cardiac Risk', price: 1499, description: 'Measures myeloperoxidase levels — a predictor of cardiovascular events and plaque instability.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 383, name: 'Lp-PLA2 (Lipoprotein-Associated Phospholipase A2)', category: 'Cardiac', subcategory: 'Cardiac Risk', price: 1999, description: 'Measures Lp-PLA2 — a vascular-specific inflammation marker predicting stroke and heart attack risk.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 384, name: 'PAPP-A (Pregnancy-Associated Plasma Protein A)', category: 'Cardiac', subcategory: 'Cardiac Risk', price: 1799, description: 'Cardiac marker of plaque instability and acute coronary syndrome risk assessment.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 385, name: 'sCD40L (Soluble CD40 Ligand)', category: 'Cardiac', subcategory: 'Cardiac Risk', price: 1999, description: 'Marker of platelet activation and inflammation associated with acute coronary events.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 386, name: 'ADMA (Asymmetric Dimethylarginine)', category: 'Cardiac', subcategory: 'Cardiac Risk', price: 2499, description: 'Endothelial dysfunction marker predicting cardiovascular disease and mortality risk.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 10-12 hours required.' },
    { id: 387, name: 'PCSK9 (Proprotein Convertase Subtilisin/Kexin 9)', category: 'Cardiac', subcategory: 'Lipid Metabolism', price: 2999, description: 'Measures PCSK9 levels — key regulator of LDL receptor expression and cholesterol clearance.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 10-12 hours required.' },
    { id: 388, name: 'JAK2 V617F Mutation', category: 'Hematology', subcategory: 'Myeloproliferative', price: 3499, description: 'Detects JAK2 V617F mutation — diagnostic marker for polycythemia vera, ET, and primary MF.', fasting_required: false, report_time: '7-10 days', preparation_instructions: 'No special preparation required.' },
    { id: 389, name: 'CALR Mutation (Calreticulin)', category: 'Hematology', subcategory: 'Myeloproliferative', price: 3499, description: 'Detects CALR exon 9 mutations in JAK2-negative essential thrombocythemia and primary MF.', fasting_required: false, report_time: '7-10 days', preparation_instructions: 'No special preparation required.' },
    { id: 390, name: 'BCR-ABL (Qualitative PCR)', category: 'Hematology', subcategory: 'Leukemia', price: 4999, description: 'Detects BCR-ABL fusion gene for CML diagnosis and treatment monitoring.', fasting_required: false, report_time: '7-10 days', preparation_instructions: 'No special preparation required.' },
    { id: 391, name: 'BCR-ABL (Quantitative PCR / IS)', category: 'Hematology', subcategory: 'Leukemia', price: 6999, description: 'Quantitative BCR-ABL with International Scale for precise CML molecular response monitoring.', fasting_required: false, report_time: '7-10 days', preparation_instructions: 'No special preparation required.' },
    { id: 392, name: 'PML-RARA (Qualitative PCR)', category: 'Hematology', subcategory: 'Leukemia', price: 4499, description: 'Detects PML-RARA fusion gene for acute promyelocytic leukemia diagnosis.', fasting_required: false, report_time: '7-10 days', preparation_instructions: 'No special preparation required.' },
    { id: 393, name: 'Urine Drug Screen (10-Panel)', category: 'Full Body', subcategory: 'Toxicology', price: 1999, description: 'Screens 10 drug classes: amphetamines, barbiturates, benzodiazepines, cocaine, THC, opiates, PCP, methadone, tricyclics, oxycodone.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'Chain of custody form required for legal purposes.' },
    { id: 394, name: 'Alcohol Biomarkers: CDT (% Disialotransferrin)', category: 'Full Body', subcategory: 'Toxicology', price: 2499, description: 'Carbohydrate-deficient transferrin — the most specific biomarker for chronic heavy alcohol use.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 395, name: 'Alcohol Biomarkers: PEth (Phosphatidylethanol)', category: 'Full Body', subcategory: 'Toxicology', price: 2999, description: 'Direct alcohol biomarker detecting consumption over past 2-3 weeks with high sensitivity.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 396, name: 'Alcohol Biomarkers: EtG (Ethyl Glucuronide)', category: 'Full Body', subcategory: 'Toxicology', price: 1999, description: 'Urinary alcohol biomarker detecting consumption over past 3-5 days.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Urine sample. Avoid alcohol-based hand sanitizers before collection.' },
    { id: 397, name: 'EtS (Ethyl Sulfate) Urine', category: 'Full Body', subcategory: 'Toxicology', price: 1999, description: 'Confirmatory alcohol biomarker used alongside EtG to rule out false positives.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Urine sample.' },
    { id: 398, name: 'Blood Sugar (Postprandial / Post Lunch - 2 HR)', category: 'Diabetes', subcategory: 'Diabetes', price: 199, description: 'Measures blood glucose 2 hours after a meal to assess post-meal sugar control and diabetes management.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'Eat a normal meal. Test is done exactly 2 hours after the first bite.' },
    { id: 399, name: 'Random Blood Sugar (RBS)', category: 'Diabetes', subcategory: 'Diabetes', price: 149, description: 'Measures blood glucose at any time of day without fasting — useful for urgent diabetes screening.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No fasting required. Can be taken anytime.' },
    { id: 400, name: 'Blood Sugar (Post Meal - 1 Hour)', category: 'Diabetes', subcategory: 'Diabetes', price: 199, description: 'Measures blood glucose 1 hour after a meal — used in gestational diabetes screening and early glucose intolerance detection.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'Eat a normal meal. Test done exactly 1 hour after first bite.' },
    { id: 401, name: 'Blood Sugar (Post Meal - 3 Hour)', category: 'Diabetes', subcategory: 'Diabetes', price: 199, description: 'Measures blood glucose 3 hours after a meal to assess extended glucose clearance and late-phase insulin response.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'Normal meal. Test done exactly 3 hours after eating.' },
    { id: 402, name: 'Insulin (Postprandial / Post Meal)', category: 'Diabetes', subcategory: 'Insulin', price: 699, description: 'Measures insulin levels 2 hours after a meal to evaluate pancreatic beta-cell response to glucose.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'Eat a standard meal. Sample collected 2 hours after eating.' },
    { id: 403, name: 'Glucose (Fasting) - Plasma', category: 'Diabetes', subcategory: 'Diabetes', price: 199, description: 'Plasma glucose measured after overnight fast — a more standardized alternative to venous blood sugar.', fasting_required: true, report_time: '6 hrs', preparation_instructions: 'Fasting for 8-12 hours required. Plasma sample preferred for accuracy.' },
    { id: 404, name: 'Glucose (Random) - Plasma', category: 'Diabetes', subcategory: 'Diabetes', price: 149, description: 'Random plasma glucose measurement — used in emergency settings and for rapid diabetes screening.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 405, name: 'Blood Ketones (Beta-Hydroxybutyrate)', category: 'Diabetes', subcategory: 'Diabetic Ketoacidosis', price: 499, description: 'Measures beta-hydroxybutyrate levels to detect and monitor diabetic ketoacidosis risk.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation required. Inform lab if diabetic.' },
    { id: 406, name: 'Urine Ketones (Dipstick)', category: 'Diabetes', subcategory: 'Urine Analysis', price: 99, description: 'Screens for ketones in urine — a rapid test for detecting diabetic ketoacidosis and fat metabolism.', fasting_required: false, report_time: '6 hrs', preparation_instructions: 'No special preparation. Clean-catch mid-stream urine sample.' },
    { id: 407, name: 'Gestational Diabetes Screening (GCT)', category: 'Pregnancy', subcategory: 'Glucose Tolerance', price: 399, description: 'Glucose challenge test for gestational diabetes screening — blood glucose measured 1 hour after a glucose drink.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No fasting required. Drink glucose solution and blood drawn after 1 hour.' },
    { id: 408, name: 'OGTT 75g (3 Samples: Fasting, 1Hr, 2Hr)', category: 'Diabetes', subcategory: 'Glucose Tolerance', price: 699, description: 'Three-sample oral glucose tolerance test — comprehensive evaluation of glucose metabolism for diabetes diagnosis.', fasting_required: true, report_time: '4 hrs', preparation_instructions: 'Fasting for 10-12 hours required. Remain seated throughout the test. No smoking.' },
    { id: 409, name: 'Insulin (Fasting + Postprandial Combo)', category: 'Diabetes', subcategory: 'Insulin', price: 999, description: 'Combined fasting and post-meal insulin measurements for comprehensive beta-cell function assessment.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 10 hours. Then eat a meal. Two samples collected.' },
    { id: 410, name: 'Glucose-Insulin Ratio', category: 'Diabetes', subcategory: 'Insulin Resistance', price: 799, description: 'Calculated ratio of fasting glucose to fasting insulin — used for PCOS and insulin resistance evaluation.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 10-12 hours required. Calculated from glucose + insulin values.' },
    { id: 411, name: 'Direct Coombs Test (DAT)', category: 'Hematology', subcategory: 'Hemolytic Anemia', price: 499, description: 'Detects antibodies or complement attached to red blood cell surface — used to diagnose autoimmune hemolytic anemia and hemolytic disease of newborn.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 412, name: 'Indirect Coombs Test (IAT)', category: 'Hematology', subcategory: 'Blood Bank', price: 399, description: 'Detects free antibodies in serum against red blood cells — essential for blood cross-matching and pregnancy antibody screening.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required. Required before blood transfusion and during pregnancy.' },
    { id: 413, name: 'Cold Agglutinin Titer', category: 'Hematology', subcategory: 'Autoimmune Hemolysis', price: 599, description: 'Measures cold agglutinin antibodies — elevated in mycoplasma pneumonia, cold agglutinin disease, and certain lymphomas.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Sample must be kept at 37°C during transport. Avoid cold exposure before collection.' },
    { id: 414, name: 'Platelet Function Assay (PFA-100)', category: 'Hematology', subcategory: 'Platelet Function', price: 1199, description: 'Screens for platelet dysfunction by measuring closure time — detects von Willebrand disease and platelet disorders.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'Avoid aspirin, NSAIDs, and antiplatelet meds for 7-10 days before.' },
    { id: 415, name: 'Transferrin (Serum)', category: 'Anemia', subcategory: 'Iron Studies', price: 399, description: 'Measures transferrin — the iron-transport protein in blood — used to evaluate iron deficiency and overload.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 8-10 hours recommended.' },
    { id: 416, name: 'Osmotic Fragility Test', category: 'Hematology', subcategory: 'Red Cell Disorders', price: 699, description: 'Measures red blood cell resistance to hemolysis in hypotonic solutions — screens for hereditary spherocytosis and thalassemia.', fasting_required: false, report_time: '48 hrs', preparation_instructions: 'No special preparation required.' },
    { id: 417, name: 'C1 Esterase Inhibitor (C1-INH) Level & Function', category: 'Full Body', subcategory: 'Complement', price: 2499, description: 'Measures C1 inhibitor level and functional activity to diagnose hereditary angioedema (HAE).', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required. Sample must be kept cold and transported immediately.' },
    { id: 418, name: 'Kt/V (Dialysis Adequacy)', category: 'Full Body', subcategory: 'Dialysis Monitoring', price: 999, description: 'Calculated index measuring dialysis adequacy — ensures sufficient toxin removal during hemodialysis or peritoneal dialysis.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'Pre and post-dialysis blood samples required. Coordinated with dialysis session.' },
    { id: 419, name: 'Chromogranin A (CgA)', category: 'Cancer', subcategory: 'Neuroendocrine Tumors', price: 2499, description: 'Tumor marker for neuroendocrine tumors including carcinoid, pancreatic NET, pheochromocytoma, and small cell lung cancer.', fasting_required: true, report_time: '5-7 days', preparation_instructions: 'Fasting for 10-12 hours. Avoid proton pump inhibitors for 2 weeks before test.' },
    { id: 420, name: 'Gastrin (Fasting)', category: 'Full Body', subcategory: 'GI Hormones', price: 1199, description: 'Measures gastrin levels to diagnose Zollinger-Ellison syndrome, gastrinoma, and evaluate G-cell function.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 10-12 hours. Stop acid-reducing medications (PPIs/H2 blockers) for at least 1 week before.' },
    { id: 421, name: 'Leptin (Serum)', category: 'Hormones', subcategory: 'Metabolic Hormones', price: 1499, description: 'Measures leptin — the satiety hormone produced by fat cells — used in obesity evaluation and metabolic syndrome assessment.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 8-10 hours. Morning sample preferred.' },
    { id: 422, name: 'Adiponectin', category: 'Hormones', subcategory: 'Metabolic Hormones', price: 1799, description: 'Measures adiponectin — an insulin-sensitizing hormone — low levels linked to obesity, diabetes, and cardiovascular risk.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 8-10 hours. Sample collected before 10 AM.' },
    { id: 423, name: 'COVID-19 RT-PCR', category: 'Fever', subcategory: 'COVID-19', price: 399, description: 'Gold-standard molecular test detecting SARS-CoV-2 RNA via real-time PCR — used for diagnosis, travel clearance, and workplace screening.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required. Nasopharyngeal and throat swab collected by trained professional.' },
    { id: 424, name: 'COVID-19 Rapid Antigen Test', category: 'Fever', subcategory: 'COVID-19', price: 149, description: 'Rapid immunochromatographic test detecting SARS-CoV-2 nucleocapsid protein antigen — provides results within 15-30 minutes.', fasting_required: false, report_time: '30 mins', preparation_instructions: 'No special preparation required. Nasal or nasopharyngeal swab sample.' },
    { id: 425, name: 'COVID-19 Antibody (IgG/IgM)', category: 'Fever', subcategory: 'COVID-19', price: 499, description: 'Detects antibodies against SARS-CoV-2 to determine past infection or vaccination response.', fasting_required: false, report_time: '24 hrs', preparation_instructions: 'No special preparation required. Collect at least 14 days after symptoms or vaccination.' },
    { id: 426, name: 'Lactose Intolerance Breath Test (Hydrogen/Methane)', category: 'Full Body', subcategory: 'GI Breath Tests', price: 1999, description: 'Non-invasive breath test measuring hydrogen and methane after lactose ingestion — gold standard for lactose intolerance diagnosis.', fasting_required: true, report_time: '3 hrs', preparation_instructions: 'Fasting for 12 hours. No dairy for 24 hours before. No smoking or exercise on test day.' },
    { id: 427, name: 'SIBO Breath Test (Lactulose / Glucose)', category: 'Full Body', subcategory: 'GI Breath Tests', price: 2499, description: 'Non-invasive breath test measuring hydrogen and methane levels to diagnose small intestinal bacterial overgrowth (SIBO).', fasting_required: true, report_time: '3 hrs', preparation_instructions: 'Fasting for 12 hours. Low-carb diet for 24 hours before. No antibiotics for 4 weeks before.' },
    { id: 428, name: 'ACTH Stimulation Test (Synacthen)', category: 'Hormones', subcategory: 'Adrenal Function', price: 3499, description: 'Measures cortisol response to synthetic ACTH injection — gold standard for diagnosing adrenal insufficiency and Addison disease.', fasting_required: true, report_time: '4 hrs', preparation_instructions: 'Fasting for 8 hours. Morning test (8-9 AM). Cortisol samples at 0, 30, and 60 minutes post-injection.' },
    { id: 429, name: 'Dexamethasone Suppression Test (1mg Overnight)', category: 'Hormones', subcategory: 'Adrenal Function', price: 2499, description: 'Screening test for Cushing syndrome — measures morning cortisol after evening dexamethasone dose to assess feedback suppression.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Take 1mg dexamethasone at 11 PM. Blood sample collected at 8 AM next morning. Fasting.' },
    { id: 430, name: 'Vitamin B5 (Pantothenic Acid)', category: 'Vitamins', subcategory: 'B Complex', price: 999, description: 'Measures pantothenic acid levels essential for coenzyme A synthesis, energy metabolism, and hormone production.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'No special preparation required.' },
    { id: 431, name: 'Fecal Fat (Quantitative, 72-Hour Collection)', category: 'Full Body', subcategory: 'Malabsorption', price: 2499, description: 'Measures fat content in stool collected over 72 hours — gold standard for diagnosing malabsorption syndromes like pancreatic insufficiency and celiac disease.', fasting_required: false, report_time: '5-7 days', preparation_instructions: 'High-fat diet (100g/day) for 3 days before and during collection. Collect ALL stool for 72 hours.' },
    { id: 432, name: 'Basic Health Checkup', category: 'Full Body', subcategory: 'Health Packages', price: 999, description: 'Comprehensive screening package including CBC, Blood Sugar (Fasting), Lipid Profile, LFT, KFT, Urine Routine, and Thyroid Profile — 30+ parameters.', fasting_required: true, report_time: '24 hrs', preparation_instructions: 'Fasting for 10-12 hours required. Includes multiple test parameters.' },
    { id: 433, name: 'Executive Health Checkup', category: 'Full Body', subcategory: 'Health Packages', price: 2499, description: 'Advanced full-body assessment with 60+ parameters including CBC, HbA1c, Lipid Profile, LFT, KFT, Thyroid, Vitamin D, Vitamin B12, Iron Studies, ECG, and more.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 10-12 hours required. Wear loose clothing for ECG.' },
    { id: 434, name: 'Wellness Package (Complete)', category: 'Full Body', subcategory: 'Health Packages', price: 3999, description: 'Comprehensive wellness screening with 85+ parameters covering all major organ systems, vitamins, hormones, cardiac risk markers, and cancer screening.', fasting_required: true, report_time: '48 hrs', preparation_instructions: 'Fasting for 10-12 hours required. Takes approximately 30 minutes for sample collection.' },
  ].map(t => {
    let mrp;
    if (t.price <= 299) mrp = Math.round(t.price * 2.5);
    else if (t.price <= 599) mrp = Math.round(t.price * 2.2);
    else if (t.price <= 999) mrp = Math.round(t.price * 2.0);
    else if (t.price <= 1999) mrp = Math.round(t.price * 1.8);
    else if (t.price <= 4999) mrp = Math.round(t.price * 1.6);
    else mrp = Math.round(t.price * 1.4);
    return { ...t, mrp, offerPrice: t.price };
  });

  const getComboForTest = (test) => {
    if (!test || !comboData[test.name]) return null;
    const combo = comboData[test.name];
    const comboItems = combo.tests.map(name => tests.find(t => t.name === name)).filter(Boolean);
    const total = (test.price || 0) + comboItems.reduce((s, t) => s + (t?.price || 0), 0);
    return { ...combo, items: [test, ...comboItems], total, savings: total - combo.comboPrice };
  };

  let allTests = [];

  const load = async () => {
    setLoading(true);
    let filtered = [...seedTests];
    if (search) filtered = filtered.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
    if (category) filtered = filtered.filter(t => t.category === category);
    setTests(filtered);
    setLoading(false);
  };

  useEffect(() => {
    load();

  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getFamilyMembers().then(({ data }) => setFamilyMembers(data || [])).catch(() => {});
    }
  }, [isAuthenticated]);

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [search, category]);

  const sortedTests = [...tests].sort((a, b) => {
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    return (bookingCounts[b.name] ? parseInt(bookingCounts[b.name].replace(/,/g, '')) : 0) - (bookingCounts[a.name] ? parseInt(bookingCounts[a.name].replace(/,/g, '')) : 0);
  });

  const suggestions = search.trim()
    ? seedTests.filter(t => t.name.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
    : [];

  const handleSuggestionClick = (name) => {
    setSearch(name);
    setShowSuggestions(false);
    setShowAllTests(true);
    load();
  };

  const addToCart = (test) => {
    setCart(prev => {
      if (prev.find(i => i.id === test.id)) return prev;
      return [...prev, { ...test, qty: 1 }];
    });
  };

  let addressTimer;
  const searchAddress = (q) => {
    clearTimeout(addressTimer);
    if (!q.trim()) { setAddressSuggestions([]); setShowAddressSuggestions(false); return; }
    addressTimer = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`);
        const data = await res.json();
        setAddressSuggestions(data.map(d => ({
          display: d.display_name,
          city: d.address?.city || d.address?.town || d.address?.village || d.address?.state_district || '',
          pincode: d.address?.postcode || '',
          lat: d.lat, lon: d.lon,
        })));
        setShowAddressSuggestions(true);
      } catch {}
    }, 400);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const cartTotal = cart.reduce((sum, i) => sum + i.price, 0);

  const handlePlace = async () => {
    setPlacing(true);
    try {
      await placeDiagnosticOrder({
        tests: cart.map(i => ({ testId: i.id, name: i.name, price: i.price })),
        totalAmount: cartTotal,
        collectionDate: collectionDate || null,
        collectionTime: collectionTime || null,
        collectionAddress: address.city ? address : null,
        bookedFor: bookedFor || null,
        paymentMethod: paymentMethod || 'pay_at_collection',
        patientInfo: patientInfo.name ? patientInfo : null,
      });
      const generatedId = 'JH' + Date.now().toString(36).toUpperCase();
      setOrderId(generatedId);
      setBookingStep(5);
    } catch {} finally { setPlacing(false); }
  };

  
  return (
    <>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0F5DA8 0%, #0C6BC4 100%)',
        padding: '48px 20px 40px', textAlign: 'center',
      }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <h1 style={{ color: '#fff', fontSize: 32, marginBottom: 8 }}>Looking for a Test?</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, marginBottom: 24 }}>
            Book diagnostic tests at home — accurate reports, doorstep collection
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowCityPicker(!showCityPicker)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                  borderRadius: 20, background: 'rgba(255,255,255,0.15)', color: '#fff',
                  border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 13,
                  fontFamily: 'inherit', fontWeight: 500, backdropFilter: 'blur(4px)',
                }}>
                <MapPin size={14} weight="fill" />
                {city}
                <span style={{ fontSize: 10, marginLeft: 2 }}>▾</span>
              </button>
              {showCityPicker && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 6px)', left: 0, minWidth: 160,
                  background: '#fff', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  overflow: 'hidden', zIndex: 10, textAlign: 'left',
                }}>
                  {['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'].map(c => (
                    <button key={c} onMouseDown={() => { setCity(c); setShowCityPicker(false); }}
                      style={{
                        display: 'block', width: '100%', padding: '10px 16px', fontSize: 13,
                        border: 'none', background: city === c ? '#e8f0fe' : '#fff',
                        color: city === c ? '#0F5DA8' : 'var(--text-dark)', cursor: 'pointer',
                        fontFamily: 'inherit', fontWeight: city === c ? 600 : 400,
                        textAlign: 'left', transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f0f5ff'}
                      onMouseLeave={e => e.currentTarget.style.background = city === c ? '#e8f0fe' : '#fff'}>
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Home collection available</span>
          </div>
          <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
            <MagnifyingGlass size={20} style={{ position: 'absolute', left: 16, top: 14, color: '#0F5DA8' }} />
              <input type="text" placeholder="Search tests (e.g., CBC, Thyroid, Lipid)..."
                value={search}
                onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
                onFocus={() => { setFocused(true); setShowSuggestions(true); }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={e => { if (e.key === 'Enter') { setShowAllTests(true); setShowSuggestions(false); } }}
              style={{
                width: '100%', padding: '14px 16px 14px 48px', borderRadius: 50,
                border: 'none', fontSize: 15, outline: 'none', background: '#fff',
                fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }} />
            {/* Suggestions dropdown */}
            {showSuggestions && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                background: '#fff', borderRadius: 16, boxShadow: '0 12px 48px rgba(0,0,0,0.12)',
                border: '1px solid var(--border)', overflow: 'hidden', zIndex: 999, textAlign: 'left',
              }}>
                {search.trim() && suggestions.length > 0 ? (
                  suggestions.map(t => (
                    <button key={t.id} onMouseDown={() => handleSuggestionClick(t.name)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 18px',
                        border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                        borderBottom: '1px solid #f5f5f5', transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f0f5ff'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                      <MagnifyingGlass size={16} color="#0F5DA8" />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-dark)' }}>{t.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{t.category} • ₹{t.offerPrice || t.price} {t.mrp ? <span style={{ textDecoration: 'line-through', marginLeft: 2, color: '#bbb' }}>₹{t.mrp}</span> : null}</div>
                      </div>
                    </button>
                  ))
                ) : !search.trim() && focused ? (
                  <div style={{ padding: '12px 18px' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Popular Tests</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {popularTests.map(name => (
                        <button key={name} onMouseDown={() => handleSuggestionClick(name)}
                          style={{
                            padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                            background: '#e8f0fe', color: '#0F5DA8', border: 'none', cursor: 'pointer',
                            fontFamily: 'inherit', transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = '#d0e2ff'}
                          onMouseLeave={e => e.currentTarget.style.background = '#e8f0fe'}>
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : search.trim() && suggestions.length === 0 ? (
                  <div style={{ padding: '16px 18px', fontSize: 13, color: 'var(--text-light)', textAlign: 'center' }}>
                    No tests found — try a different name
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Urgency banner */}
      <div style={{ background: 'linear-gradient(90deg, #fff8e1, #fff3e0)', borderBottom: '1px solid #ffecb3', padding: '10px 20px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap', fontSize: 13 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#e65100', fontWeight: 600 }}>
            <Clock size={16} weight="fill" color="#FF8A00" />
            <strong style={{ fontSize: 16 }}>{totalBookedToday}</strong> tests booked today
          </span>
          <span style={{ color: '#888' }}>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2e7d32', fontWeight: 500 }}>
            <CheckCircle size={14} weight="fill" color="#22C55E" />
            Free home collection
          </span>
          <span style={{ color: '#888' }}>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#0F5DA8', fontWeight: 500 }}>
            <MapPin size={14} weight="fill" />
            Available in {city}
          </span>
        </div>
      </div>

      <div style={{ padding: '28px 20px' }}>
        <div className="container">
          {/* Cart bar */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, padding: '12px 16px', background: '#fff', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <ShoppingCart size={20} color="var(--primary)" />
            <span style={{ fontSize: 14, fontWeight: 600 }}>{cart.length} tests</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>₹{cartTotal}</span>
            <button onClick={() => setShowCart(!showCart)} style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              {showCart ? 'Hide' : 'View'} Cart
            </button>
                {cart.length > 0 && (
                  <button onClick={() => (setShowForm(true), setBookingStep(1))}
                    className="btn-accent" style={{ padding: '6px 16px', fontSize: 13, marginLeft: 'auto', width: 'auto' }}>
                    Book Tests
                  </button>
                )}
          </div>

          {/* Cart dropdown */}
          {showCart && cart.length > 0 && (
            <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 16, marginBottom: 16 }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <Flask size={20} color="var(--primary)" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-light)' }}>{item.category}</p>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>₹{item.price}</span>
                  <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--text-light)', padding: 4, background: 'none', border: 'none', cursor: 'pointer' }}><Trash size={16} /></button>
                </div>
              ))}
            </div>
          )}

          {/* Booking Form — Multi Step */}
          {showForm && bookingStep < 5 && (
            <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 20, marginBottom: 16 }}>
              {/* Step indicator */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 20, overflowX: 'auto' }}>
                {['Review', 'Patient', 'Address', 'Payment'].map((label, i) => (
                  <button key={label} onClick={() => bookingStep > i && setBookingStep(i + 1)}
                    style={{
                      flex: 1, minWidth: 0, padding: '6px 4px', borderRadius: 6,
                      fontSize: 11, fontWeight: 600, border: 'none', cursor: bookingStep > i ? 'pointer' : 'default',
                      background: bookingStep >= i + 1 ? '#0F5DA8' : '#f0f0f0',
                      color: bookingStep >= i + 1 ? '#fff' : '#999',
                      fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.15s',
                    }}>
                    {bookingStep > i + 1 ? '✓ ' : ''}{i + 1}. {label}
                  </button>
                ))}
              </div>

              {/* Step 1: Review Order */}
              {bookingStep === 1 && (
                <>
                  <h3 style={{ fontSize: 15, marginBottom: 12 }}>Review Your Order</h3>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                      <Flask size={20} color="var(--primary)" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-light)' }}>{item.category} • Qty: {item.qty || 1}</p>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>₹{item.price}</span>
                      <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--text-light)', padding: 4, background: 'none', border: 'none', cursor: 'pointer' }}><Trash size={16} /></button>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '2px solid var(--primary)' }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>Total</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>₹{cartTotal}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => setShowForm(false)} className="btn-outline" style={{ flex: 1 }}>Back to Tests</button>
                    <button onClick={() => setBookingStep(2)} className="btn-accent" style={{ flex: 1 }}>Continue</button>
                  </div>
                </>
              )}

              {/* Step 2: Patient Details */}
              {bookingStep === 2 && (
                <>
                  <h3 style={{ fontSize: 15, marginBottom: 12 }}>Patient Details</h3>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12 }}>Booking for</label>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                      <button onClick={() => { setBookedFor(null); setPatientInfo({ name: '', age: '', gender: '' }); }}
                        style={{
                          padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                          background: !bookedFor ? '#0F5DA8' : '#f0f0f0',
                          color: !bookedFor ? '#fff' : 'var(--text-dark)',
                          border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                        }}>
                        <User size={14} style={{ marginRight: 4 }} /> Myself
                      </button>
                      {familyMembers.map(m => (
                        <button key={m.id} onClick={() => { setBookedFor(m); setPatientInfo({ name: m.name || '', age: m.age || '', gender: m.gender || '' }); }}
                          style={{
                            padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                            background: bookedFor?.id === m.id ? '#0F5DA8' : '#f0f0f0',
                            color: bookedFor?.id === m.id ? '#fff' : 'var(--text-dark)',
                            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                          }}>
                          <User size={14} style={{ marginRight: 4 }} /> {m.name}
                        </button>
                      ))}
                      <button onClick={() => navigate('/add-family')}
                        style={{
                          padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                          background: '#e8f0fe', color: '#0F5DA8', border: '1px dashed #0F5DA8',
                          cursor: 'pointer', fontFamily: 'inherit',
                        }}>
                        + Add Member
                      </button>
                    </div>
                  </div>
                  {!bookedFor && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                      <input placeholder="Your Name" value={patientInfo.name}
                        onChange={e => setPatientInfo({ ...patientInfo, name: e.target.value })}
                        className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
                      <select value={patientInfo.gender}
                        onChange={e => setPatientInfo({ ...patientInfo, gender: e.target.value })}
                        className="input" style={{ padding: '8px 10px', fontSize: 13 }}>
                        <option value="">Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => setBookingStep(1)} className="btn-outline" style={{ flex: 1 }}>Back</button>
                    <button onClick={() => {
                      if (bookedFor || patientInfo.name.trim()) setBookingStep(3);
                    }} className="btn-accent" style={{ flex: 1 }}>Continue</button>
                  </div>
                </>
              )}

              {/* Step 3: Address + Date/Time */}
              {bookingStep === 3 && (
                <>
                  <h3 style={{ fontSize: 15, marginBottom: 4 }}>Schedule Home Collection</h3>
                  <p style={{ fontSize: 12, color: '#e65100', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={14} weight="fill" color="#FF8A00" />
                    Next available slot: {nextSlot} — Limited slots
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={{ fontSize: 12 }}>Collection Date</label>
                        <input type="date" value={collectionDate} min={new Date().toISOString().split('T')[0]}
                          onChange={e => setCollectionDate(e.target.value)} className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 12 }}>Preferred Time</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 4 }}>
                          {[
                            { slot: '6:00 AM - 7:00 AM', status: 'available' },
                            { slot: '7:00 AM - 8:00 AM', status: 'available' },
                            { slot: '8:00 AM - 9:00 AM', status: 'limited' },
                            { slot: '9:00 AM - 10:00 AM', status: 'available' },
                            { slot: '10:00 AM - 11:00 AM', status: 'available' },
                            { slot: '11:00 AM - 12:00 PM', status: 'limited' },
                            { slot: '12:00 PM - 1:00 PM', status: 'full' },
                            { slot: '1:00 PM - 2:00 PM', status: 'full' },
                            { slot: '2:00 PM - 3:00 PM', status: 'available' },
                            { slot: '3:00 PM - 4:00 PM', status: 'available' },
                            { slot: '4:00 PM - 5:00 PM', status: 'limited' },
                            { slot: '5:00 PM - 6:00 PM', status: 'available' },
                            { slot: '6:00 PM - 7:00 PM', status: 'full' },
                            { slot: '7:00 PM - 8:00 PM', status: 'full' },
                          ].map(t => {
                            const isSelected = collectionTime === t.slot;
                            const isFull = t.status === 'full';
                            return (
                              <button key={t.slot} onClick={() => !isFull && setCollectionTime(isSelected ? '' : t.slot)}
                                disabled={isFull}
                                style={{
                                  padding: '8px 6px', borderRadius: 8, fontSize: 11, fontWeight: 500,
                                  background: isSelected ? '#0F5DA8' : isFull ? '#f5f5f5' : '#fff',
                                  color: isSelected ? '#fff' : isFull ? '#ccc' : 'var(--text-dark)',
                                  border: `1px solid ${isSelected ? '#0F5DA8' : isFull ? '#eee' : 'var(--border)'}`,
                                  cursor: isFull ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                                  textAlign: 'center', transition: 'all 0.15s', position: 'relative',
                                }}>
                                <div style={{ fontSize: 11 }}>{t.slot.replace(' - ', '\n')}</div>
                                <span style={{
                                  display: 'inline-block', fontSize: 9, fontWeight: 700, marginTop: 2,
                                  color: isSelected ? 'rgba(255,255,255,0.8)' : 
                                    isFull ? '#ccc' : t.status === 'available' ? '#22C55E' : '#FF8A00',
                                }}>
                                  {isFull ? 'Full' : t.status === 'available' ? 'Available' : 'Limited'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <label style={{ fontSize: 12 }}>Collection Address</label>
                    <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
                      <input placeholder="Type your address..." value={address.line1}
                        onChange={e => { setAddress({ ...address, line1: e.target.value }); searchAddress(e.target.value); }}
                        onFocus={() => addressSuggestions.length > 0 && setShowAddressSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowAddressSuggestions(false), 200)}
                        className="input" style={{ padding: '8px 10px', fontSize: 13, flex: 1 }} />
                      {showAddressSuggestions && addressSuggestions.length > 0 && (
                        <div style={{
                          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 10,
                          background: '#fff', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                          border: '1px solid var(--border)', maxHeight: 200, overflowY: 'auto',
                        }}>
                          {addressSuggestions.map((s, i) => (
                            <button key={i} onMouseDown={() => {
                              setAddress({ line1: s.display, city: s.city, pincode: s.pincode });
                              setShowAddressSuggestions(false);
                            }}
                              style={{
                                display: 'block', width: '100%', padding: '10px 14px', fontSize: 13,
                                textAlign: 'left', border: 'none', background: '#fff', cursor: 'pointer',
                                fontFamily: 'inherit', borderBottom: i < addressSuggestions.length - 1 ? '1px solid #f5f5f5' : 'none',
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = '#f0f5ff'}
                              onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                              <MapPin size={12} style={{ marginRight: 6, color: '#0F5DA8', flexShrink: 0 }} />
                              {s.display}
                            </button>
                          ))}
                        </div>
                      )}
                      <button onClick={() => {
                        if (!navigator.geolocation) return;
                        setLocating(true);
                        navigator.geolocation.getCurrentPosition(async (pos) => {
                          try {
                            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
                            const data = await res.json();
                            const addr = data.address || {};
                            setAddress({
                              line1: [addr.road, addr.suburb, addr.neighbourhood].filter(Boolean).join(', ') || '📍 Current location',
                              city: addr.city || addr.town || addr.village || addr.state_district || '',
                              pincode: addr.postcode || '',
                            });
                          } catch {}
                          setLocating(false);
                        }, () => setLocating(false), { enableHighAccuracy: true });
                      }}
                        style={{
                          padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                          background: '#e8f0fe', color: '#0F5DA8', border: 'none', cursor: 'pointer',
                          fontFamily: 'inherit', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4,
                        }}>
                        <MapPin size={14} weight="fill" /> {locating ? 'Locating...' : 'Use my location'}
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <input placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
                      <input placeholder="PIN Code" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} className="input" style={{ padding: '8px 10px', fontSize: 13 }} />
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <button onClick={() => setBookingStep(2)} className="btn-outline" style={{ flex: 1 }}>Back</button>
                      <button onClick={() => setBookingStep(4)} className="btn-accent" style={{ flex: 1 }}>
                        Continue — ₹{cartTotal}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Step 4: Payment */}
              {bookingStep === 4 && (
                <>
                  <h3 style={{ fontSize: 15, marginBottom: 12 }}>Choose Payment Method</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { value: 'phonepe', label: 'PhonePe / Google Pay / UPI', icon: '📱', desc: 'Pay via any UPI app' },
                      { value: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
                      { value: 'pay_at_collection', label: 'Pay at Collection', icon: '💵', desc: 'Cash or card at your doorstep' },
                    ].map(opt => (
                      <button key={opt.value} onClick={() => setPaymentMethod(opt.value)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                          borderRadius: 12, border: `2px solid ${paymentMethod === opt.value ? '#0F5DA8' : 'var(--border)'}`,
                          background: paymentMethod === opt.value ? '#e8f0fe' : '#fff',
                          cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s',
                        }}>
                        <span style={{ fontSize: 24 }}>{opt.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{opt.label}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{opt.desc}</div>
                        </div>
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%',
                          border: `2px solid ${paymentMethod === opt.value ? '#0F5DA8' : '#ccc'}`,
                          background: paymentMethod === opt.value ? '#0F5DA8' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {paymentMethod === opt.value && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button onClick={() => setBookingStep(3)} className="btn-outline" style={{ flex: 1 }}>Back</button>
                    <button onClick={handlePlace} disabled={placing || !paymentMethod} className="btn-accent" style={{ flex: 1 }}>
                      {placing ? 'Placing Order...' : `Pay ₹${cartTotal}`}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Confirmation */}
          {showForm && bookingStep === 5 && (
            <div style={{ padding: '32px 20px', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle size={32} weight="fill" color="#2e7d32" />
              </div>
              <h2>Order Confirmed!</h2>
              {orderId && <p style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 4 }}>Order ID: <strong>{orderId}</strong></p>}
              {paymentMethod === 'pay_at_collection' ? (
                <p style={{ fontSize: 13, color: '#e65100', marginTop: 8, fontWeight: 500 }}>Pay ₹{cartTotal} at the time of collection</p>
              ) : (
                <p style={{ fontSize: 13, color: '#22C55E', marginTop: 8, fontWeight: 500 }}>Payment of ₹{cartTotal} received ✓</p>
              )}
              <p style={{ color: 'var(--text-light)', marginTop: 8 }}>We'll send you a confirmation via WhatsApp.</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
                <button onClick={() => {
                  const msg = encodeURIComponent(`Hi! I've booked tests on Jeevan HealthCare. Order ID: ${orderId}. Total: ₹${cartTotal}.`);
                  window.open(`https://wa.me/?text=${msg}`, '_blank');
                }} style={{
                  padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  background: '#25D366', color: '#fff', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  Share on WhatsApp
                </button>
                <button onClick={() => navigate('/my-test-orders')} style={{
                  padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  background: '#0F5DA8', color: '#fff', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit',
                }}>
                  Track Order
                </button>
                <button onClick={() => { setBookingStep(1); setCart([]); setShowForm(false); setOrderId(null); setPaymentMethod(''); }} className="btn-outline">
                  Book More Tests
                </button>
              </div>
            </div>
          )}

          {/* Sort bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--text-light)', fontWeight: 600 }}>Sort by:</span>
            {sortOptions.map(opt => (
              <button key={opt.value} onClick={() => setSortBy(opt.value)}
                style={{
                  padding: '5px 12px', borderRadius: 16, fontSize: 12, fontWeight: 500,
                  background: sortBy === opt.value ? '#0F5DA8' : '#f0f0f0',
                  color: sortBy === opt.value ? '#fff' : 'var(--text-dark)',
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}>
                {opt.label}
              </button>
            ))}
            <span style={{ fontSize: 11, color: 'var(--text-light)', marginLeft: 'auto' }}>
              {tests.length} tests found
            </span>
          </div>

          {/* Test Grid */}
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-light)' }}>Loading tests...</div>
          ) : sortedTests.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <Flask size={32} style={{ color: 'var(--text-light)', marginBottom: 8 }} />
              <p style={{ color: 'var(--text-light)' }}>No tests found.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
              {sortedTests.map(test => {
                const inCart = cart.find(i => i.id === test.id);
                return (
                   <div key={test.id} style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: 16, position: 'relative' }}>
                    {mostBookedTests.includes(test.name) && (
                      <span style={{
                        position: 'absolute', top: 8, right: 8,
                        background: 'linear-gradient(135deg, #FF8A00, #FF4D6D)', color: '#fff',
                        fontSize: 9, fontWeight: 700, padding: '2px 10px', borderRadius: 4,
                        textTransform: 'uppercase', letterSpacing: 0.3,
                      }}>
                        Most Booked
                      </span>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: 14, margin: 0, cursor: 'pointer', color: '#0F5DA8' }} onClick={() => setSelectedTest(test)}>{test.name}</h3>
                        <p style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 500, marginTop: 2 }}>{test.subcategory}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 6, lineHeight: 1.4 }}>{test.description}</p>
                    {bookingCounts[test.name] && (
                      <p style={{ fontSize: 11, color: '#22C55E', fontWeight: 600, marginTop: 4 }}>
                        {bookingCounts[test.name]} booked this month
                        {dailyBookings[test.name] && <span style={{ color: '#FF8A00', marginLeft: 8 }}>{dailyBookings[test.name]} today</span>}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap', fontSize: 12, color: 'var(--text-secondary)' }}>
                      {test.fasting_required ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#e65100', fontWeight: 600 }}>
                          <WarningCircle size={14} weight="fill" color="#e65100" /> Fasting required
                        </span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#22C55E', fontWeight: 600 }}>
                          <CheckCircle size={14} weight="fill" color="#22C55E" /> No fasting
                        </span>
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-light)' }}><Clock size={14} /> {test.report_time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>₹{test.offerPrice || test.price}</span>
                      {test.mrp && test.mrp > (test.offerPrice || test.price) && (
                        <span style={{ fontSize: 12, color: 'var(--text-light)', textDecoration: 'line-through', marginLeft: 4 }}>₹{test.mrp}</span>
                      )}
                      {test.mrp && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #FF8A00, #FF4D6D)', padding: '2px 6px', borderRadius: 4, marginLeft: 6, letterSpacing: 0.3 }}>{Math.round((1 - (test.offerPrice || test.price) / test.mrp) * 100)}% off</span>
                      )}
                      {inCart ? (
                        <button onClick={() => removeFromCart(test.id)}
                          style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: '#fbe9e7', color: '#c62828', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                          <Trash size={14} /> Remove
                        </button>
                      ) : (
                        <button onClick={() => addToCart(test)}
                          className="btn-primary" style={{ padding: '6px 14px', fontSize: 12 }}>
                          <Plus size={14} /> Add
                        </button>
                      )}
                    </div>
                    {test.preparation_instructions && (
                      <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 6, padding: '6px 8px', background: '#fff8e1', borderRadius: 4 }}>
                        <Info size={12} /> {test.preparation_instructions}
                      </p>
                    )}
                    {(() => {
                      const edu = getTestEducation(test);
                      const isOpen = faqOpen[test.id];
                      if (!edu || edu.length === 0) return null;
                      const top = edu.slice(0, 2);
                      return (
                        <div style={{ marginTop: 8 }}>
                          <button onClick={() => setFaqOpen(p => ({ ...p, [test.id]: !p[test.id] }))}
                            style={{
                              width: '100%', padding: '6px 10px', borderRadius: 6, background: '#f3f0ff',
                              border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 600,
                              color: '#7b1fa2', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            }}>
                            <span>Why this test?</span>
                            <CaretDown size={12} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                          </button>
                          {isOpen && (
                            <div style={{ marginTop: 6, padding: '8px 10px', background: '#faf9ff', borderRadius: 6, fontSize: 11, lineHeight: 1.6 }}>
                              {top.map((section, si) => (
                                <div key={si} style={{ marginBottom: si < top.length - 1 ? 8 : 0 }}>
                                  <p style={{ fontWeight: 700, color: section.color, marginBottom: 4 }}>{section.title}</p>
                                  {section.items.slice(0, 2).map((item, ii) => (
                                    <div key={ii} style={{ marginBottom: 4 }}>
                                      <p style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{item.q}</p>
                                      <p style={{ color: 'var(--text-body)' }}>{item.a.length > 120 ? item.a.slice(0, 120) + '...' : item.a}</p>
                                    </div>
                                  ))}
                                </div>
                              ))}
                              <p style={{ fontSize: 10, color: '#7b1fa2', fontWeight: 600, marginTop: 4, cursor: 'pointer' }}
                                onClick={() => setSelectedTest(test)}>
                                View all FAQ →
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                    {relatedSuggestions[test.name] && (
                      <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f0f0f0' }}>
                        <div style={{ fontSize: 10, color: 'var(--text-light)', fontWeight: 600, marginBottom: 4 }}>Also booked</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {relatedSuggestions[test.name].map(name => {
                            const relatedTest = tests.find(t => t.name === name);
                            if (!relatedTest) return null;
                            const inCart = cart.find(i => i.id === relatedTest.id);
                            return (
                              <button key={name} onClick={(e) => { e.stopPropagation(); addToCart(relatedTest); }}
                                style={{
                                  padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 500,
                                  background: inCart ? '#e8f5e9' : '#f0f5ff',
                                  color: inCart ? '#2e7d32' : '#0F5DA8',
                                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                                  transition: 'all 0.15s', whiteSpace: 'nowrap',
                                }}>
                                {inCart ? `✓ ${name}` : `+ ${name}`}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <TestDetailModal test={selectedTest} onClose={() => setSelectedTest(null)}
        combo={selectedTest ? getComboForTest(selectedTest) : null}
        addComboToCart={(items) => { items.forEach(t => addToCart(t)); setSelectedTest(null); }}
        alsoBooked={selectedTest && relatedSuggestions[selectedTest.name]
          ? relatedSuggestions[selectedTest.name].map(name => tests.find(t => t.name === name)).filter(Boolean)
          : []}
        onAddAlsoBooked={(item) => { addToCart(item); }} />
    </>
  );
}

