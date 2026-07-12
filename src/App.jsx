import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/layout/ScrollToTop';
import AnalyticsTracker from './components/AnalyticsTracker';
import ChatBotWidget from './components/ChatBotWidget';
import LeadCapturePopup from './components/LeadCapturePopup';
import useAuthStore from './stores/authStore';
import AdminLayout from './components/admin/AdminLayout';
import RoleLayout from './components/role/RoleLayout';
import { LanguageProvider } from './i18n/LanguageProvider';
import { ToastProvider } from './components/Toast';
import LoadingSpinner from './components/LoadingSpinner';
import PageTransition from './components/PageTransition';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import {
  isAdminRole,
  isFieldRole,
  isAdminHostname,
  isAdminPath,
  FIELD_ROLE_PATHS,
} from './utils/authRoles';
import ThemeToggle from './components/ThemeToggle';

const Home = lazy(() => import('./pages/Home'));
const Diagnostics = lazy(() => import('./pages/Diagnostics'));
const TestDetail = lazy(() => import('./pages/TestDetail'));
const TestCategory = lazy(() => import('./pages/TestCategory'));
const HealthPackages = lazy(() => import('./pages/HealthPackages'));
const Services = lazy(() => import('./pages/Services'));
const PackageDetail = lazy(() => import('./pages/PackageDetail'));
const MyTestOrders = lazy(() => import('./pages/MyTestOrders'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Signup = lazy(() => import('./pages/Signup'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const StaffOnboarding = lazy(() => import('./pages/StaffOnboarding'));
const DoctorOnboarding = lazy(() => import('./pages/DoctorOnboarding'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const UploadPrescription = lazy(() => import('./pages/UploadPrescription'));
const HealthLibrary = lazy(() => import('./pages/HealthLibrary'));
const VaccinationAtHome = lazy(() => import('./pages/VaccinationAtHome'));
const VaccineListing = lazy(() => import('./pages/VaccineListing'));
const VaccineDetail = lazy(() => import('./pages/VaccineDetail'));
const VaccineFinder = lazy(() => import('./pages/VaccineFinder'));
const VaccinationBooking = lazy(() => import('./pages/VaccinationBooking'));
const VaccineWallet = lazy(() => import('./pages/VaccineWallet'));
const CorporateVaccination = lazy(() => import('./pages/CorporateVaccination'));
const VaccineCategoryPage = lazy(() => import('./pages/VaccineCategoryPage'));
const VaccineSchedule = lazy(() => import('./pages/VaccineSchedule'));
const VaccineCompare = lazy(() => import('./pages/VaccineCompare'));
const VaccineTreatmentDetail = lazy(() => import('./pages/VaccineTreatmentDetail'));
const VaccineCamps = lazy(() => import('./pages/VaccineCamps'));
const BulkVaccinationBooking = lazy(() => import('./pages/BulkVaccinationBooking'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const ConsultDoctor = lazy(() => import('./pages/ConsultDoctor'));
const BookAppointment = lazy(() => import('./pages/BookAppointment'));
const PolicyPage = lazy(() => import('./pages/PolicyPage'));
const HealthToolPage = lazy(() => import('./pages/HealthToolPage'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminPermissions = lazy(() => import('./pages/admin/AdminPermissions'));
const AdminCollection = lazy(() => import('./pages/admin/AdminCollection'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminTestMaster = lazy(() => import('./pages/admin/AdminTestMaster'));
const AdminHealthPackages = lazy(() => import('./pages/admin/AdminHealthPackages'));
const AdminVaccination = lazy(() => import('./pages/admin/AdminVaccination'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'));
const AdminCMS = lazy(() => import('./pages/admin/AdminCMS'));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'));
const AdminPatients = lazy(() => import('./pages/admin/AdminPatients'));
const AdminDoctors = lazy(() => import('./pages/admin/AdminDoctors'));
const AdminStaffOnboarding = lazy(() => import('./pages/admin/AdminStaffOnboarding'));
const AdminDoctorOnboarding = lazy(() => import('./pages/admin/AdminDoctorOnboarding'));
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory'));
const AdminAuditLog = lazy(() => import('./pages/admin/AdminAuditLog'));
const AdminExport = lazy(() => import('./pages/admin/AdminExport'));
const AdminSeo = lazy(() => import('./pages/admin/AdminSeo'));
const AdminMarketing = lazy(() => import('./pages/admin/AdminMarketing'));
const AdminCrm = lazy(() => import('./pages/admin/AdminCrm'));
const AdminWhatsApp = lazy(() => import('./pages/admin/AdminWhatsApp'));
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminPhysiotherapy = lazy(() => import('./pages/admin/AdminPhysiotherapy'));
const AdminSalesDashboard = lazy(() => import('./pages/admin/AdminSalesDashboard'));

const PhysiotherapyAtHome = lazy(() => import('./pages/PhysiotherapyAtHome'));
const PhysiotherapyBooking = lazy(() => import('./pages/PhysiotherapyBooking'));
const PhysioTherapistDetail = lazy(() => import('./pages/PhysioTherapist'));
const PhysioPatientDashboard = lazy(() => import('./pages/PhysioDashboard'));
const PhysioCategoryPage = lazy(() => import('./pages/PhysioCategoryPage'));
const PhysioConditionPage = lazy(() => import('./pages/PhysioConditionPage'));
const PhysioCrmLeads = lazy(() => import('./pages/PhysioCrmLeads'));
const PhysioExercises = lazy(() => import('./pages/PhysioExercises'));
const PhysioNotifications = lazy(() => import('./pages/PhysioNotifications'));
const PhysioSeoLanding = lazy(() => import('./pages/PhysioSeoLanding'));
const PhysioWhatsAppMarketing = lazy(() => import('./pages/PhysioWhatsAppMarketing'));
const PhysioTreatmentListing = lazy(() => import('./pages/PhysioTreatmentListing'));
const PhysioTreatmentDetail = lazy(() => import('./pages/PhysioTreatmentDetail'));
const NursingCare = lazy(() => import('./pages/NursingCare'));
const NursingBooking = lazy(() => import('./pages/NursingBooking'));
const NurseAtHome = lazy(() => import('./pages/NurseAtHome'));
const NurseBookingEnhanced = lazy(() => import('./pages/NurseBookingEnhanced'));
const NurseSelection = lazy(() => import('./pages/NurseSelection'));
const NurseSeoLanding = lazy(() => import('./pages/NurseSeoLanding'));
const NurseWhatsAppService = lazy(() => import('./pages/NurseWhatsAppService'));
const HomeIcuCare = lazy(() => import('./pages/HomeIcuCare'));
const MedicalEquipment = lazy(() => import('./pages/MedicalEquipment'));
const MedicalEquipmentDetail = lazy(() => import('./pages/MedicalEquipmentDetail'));
const EquipmentCart = lazy(() => import('./pages/EquipmentCart'));
const NurseMobileApp = lazy(() => import('./pages/NurseMobileApp'));
const NursingServiceListing = lazy(() => import('./pages/NursingServiceListing'));
const NursingServiceDetail = lazy(() => import('./pages/NursingServiceDetail'));
const NurseServiceDetail = lazy(() => import('./pages/NurseServiceDetail'));
const NursingDashboard = lazy(() => import('./pages/NursingDashboard'));
const PatientBookings = lazy(() => import('./pages/PatientBookings'));
const NurseProfile = lazy(() => import('./pages/NurseProfile'));
const AdminNursing = lazy(() => import('./pages/admin/AdminNursing'));
const VaccineSeoLanding = lazy(() => import('./pages/VaccineSeoLanding'));
const VaccineWhatsAppMarketing = lazy(() => import('./pages/VaccineWhatsAppMarketing'));

const LocationServicePage = lazy(() => import('./pages/LocationServicePage'));
const DiseaseCarePage = lazy(() => import('./pages/DiseaseCarePage'));
const TestInfoPage = lazy(() => import('./pages/TestInfoPage'));

const PhlebotomistDashboard = lazy(() => import('./pages/phlebotomist/PhlebotomistDashboard'));
const DoctorDashboard = lazy(() => import('./pages/doctor/DoctorDashboard'));
const NurseDashboard = lazy(() => import('./pages/role/NurseDashboard'));
const CaregiverDashboard = lazy(() => import('./pages/role/CaregiverDashboard'));
const PhysioDashboard = lazy(() => import('./pages/role/PhysioDashboard'));
const RadiologyDashboard = lazy(() => import('./pages/role/RadiologyDashboard'));
const PharmacyDashboard = lazy(() => import('./pages/role/PharmacyDashboard'));
const EmergencyDashboard = lazy(() => import('./pages/role/EmergencyDashboard'));
const DispatchDashboard = lazy(() => import('./pages/role/DispatchDashboard'));
const CorporateDashboard = lazy(() => import('./pages/role/CorporateDashboard'));
const TrainingDashboard = lazy(() => import('./pages/role/TrainingDashboard'));
const ITSupDashboard = lazy(() => import('./pages/role/ITSupDashboard'));
const CallCenterDashboard = lazy(() => import('./pages/role/CallCenterDashboard'));
const SalesDashboard = lazy(() => import('./pages/role/SalesDashboard'));
const FinanceDashboard = lazy(() => import('./pages/role/FinanceDashboard'));
const AnalyticsDashboard = lazy(() => import('./pages/role/AnalyticsDashboard'));
const QADashboard = lazy(() => import('./pages/role/QADashboard'));
const InventoryDashboard = lazy(() => import('./pages/role/InventoryDashboard'));
const TelemedicineDashboard = lazy(() => import('./pages/role/TelemedicineDashboard'));
const LegalDashboard = lazy(() => import('./pages/role/LegalDashboard'));
const ContentDashboard = lazy(() => import('./pages/role/ContentDashboard'));
const EmergCoordDashboard = lazy(() => import('./pages/role/EmergCoordDashboard'));

// Role portal sub-pages
const PhlebotomistCollections = lazy(() => import('./pages/role/PhlebotomistCollections'));
const PhlebotomistRoutes = lazy(() => import('./pages/role/PhlebotomistRoutes'));
const PhlebotomistSchedule = lazy(() => import('./pages/role/PhlebotomistSchedule'));
const DoctorAppointments = lazy(() => import('./pages/role/DoctorAppointments'));
const DoctorPatients = lazy(() => import('./pages/role/DoctorPatients'));
const DoctorAvailability = lazy(() => import('./pages/role/DoctorAvailability'));
const NursePatients = lazy(() => import('./pages/role/NursePatients'));
const NurseSchedule = lazy(() => import('./pages/role/NurseSchedule'));
const CaregiverPatients = lazy(() => import('./pages/role/CaregiverPatients'));
const PhysioPatients = lazy(() => import('./pages/role/PhysioPatients'));
const PhysioTherapy = lazy(() => import('./pages/role/PhysioTherapy'));
const RadiologyAssignments = lazy(() => import('./pages/role/RadiologyAssignments'));
const RadiologyReports = lazy(() => import('./pages/role/RadiologyReports'));
const PharmacyOrders = lazy(() => import('./pages/role/PharmacyOrders'));
const PharmacyInventory = lazy(() => import('./pages/role/PharmacyInventory'));
const EmergencyCases = lazy(() => import('./pages/role/EmergencyCases'));
const DispatchSchedule = lazy(() => import('./pages/role/DispatchSchedule'));
const DispatchStaff = lazy(() => import('./pages/role/DispatchStaff'));
const CorporateOrders = lazy(() => import('./pages/role/CorporateOrders'));
const CorporateSubscriptions = lazy(() => import('./pages/role/CorporateSubscriptions'));
const TrainingStaff = lazy(() => import('./pages/role/TrainingStaff'));
const TrainingCertifications = lazy(() => import('./pages/role/TrainingCertifications'));
const ITSupSystem = lazy(() => import('./pages/role/ITSupSystem'));
const CallCenterBookings = lazy(() => import('./pages/role/CallCenterBookings'));
const CallCenterQueries = lazy(() => import('./pages/role/CallCenterQueries'));
const SalesCampaigns = lazy(() => import('./pages/role/SalesCampaigns'));
const SalesLeads = lazy(() => import('./pages/role/SalesLeads'));
const FinanceTransactions = lazy(() => import('./pages/role/FinanceTransactions'));
const FinanceReports = lazy(() => import('./pages/role/FinanceReports'));
const AnalyticsReports = lazy(() => import('./pages/role/AnalyticsReports'));
const AnalyticsKPI = lazy(() => import('./pages/role/AnalyticsKPI'));
const QaReviews = lazy(() => import('./pages/role/QaReviews'));
const QaCompliance = lazy(() => import('./pages/role/QaCompliance'));
const InventoryStock = lazy(() => import('./pages/role/InventoryStock'));
const InventoryOrders = lazy(() => import('./pages/role/InventoryOrders'));
const TelemedicineConsultations = lazy(() => import('./pages/role/TelemedicineConsultations'));
const TelemedicinePatients = lazy(() => import('./pages/role/TelemedicinePatients'));
const LegalCompliance = lazy(() => import('./pages/role/LegalCompliance'));
const LegalAudit = lazy(() => import('./pages/role/LegalAudit'));
const ContentBlog = lazy(() => import('./pages/role/ContentBlog'));
const ContentSEO = lazy(() => import('./pages/role/ContentSEO'));
const EmergCoordCases = lazy(() => import('./pages/role/EmergCoordCases'));
const EmergCoordStaff = lazy(() => import('./pages/role/EmergCoordStaff'));

/**
 * Auth required. Admins always sent to /admin.
 * Field portals use this (field user stays; no redirect loop).
 */
function Protected({ children }) {
  const isAuth = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  if (!isAuth) return <Navigate to="/signup" replace />;
  const role = user?.role || 'user';
  if (isAdminRole(role)) return <Navigate to="/admin" replace />;
  return children;
}

/** Patient-only: dashboard, orders, checkout — no admin or field staff. */
function PatientOnly({ children }) {
  const isAuth = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  if (!isAuth) return <Navigate to="/signup" replace />;
  const role = user?.role || 'user';
  if (isAdminRole(role)) return <Navigate to="/admin" replace />;
  if (isFieldRole(role)) return <Navigate to={FIELD_ROLE_PATHS[role]} replace />;
  return children;
}

/** Admin shell: only admin | super_admin (matches API adminAuth). */
function AdminGuard({ children }) {
  const isAuth = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  if (!isAuth) return <Navigate to="/admin/login" replace />;
  const role = user?.role || 'user';
  if (isAdminRole(role)) return children;
  if (isFieldRole(role)) return <Navigate to={FIELD_ROLE_PATHS[role]} replace />;
  // Patients (and staff without admin role) cannot use admin UI
  return <Navigate to="/dashboard" replace />;
}

/**
 * Host-aware gate for admin.jeevanhealthcare.com (same SPA, no second app).
 * On admin host: force /admin/* ; public marketing paths redirect into admin.
 */
function HostGate({ children }) {
  const location = useLocation();
  if (!isAdminHostname()) return children;

  const path = location.pathname;
  // Allow admin login + admin app only on admin host
  if (isAdminPath(path)) return children;
  // Everything else on admin host → admin home (or login via AdminGuard)
  return <Navigate to="/admin" replace />;
}

/** If already an admin, keep them out of patient signup as a landing page. */
function PatientAuthGate({ children }) {
  const isAuth = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  if (isAuth && isAdminRole(user?.role)) {
    return <Navigate to="/admin" replace />;
  }
  if (isAuth && isFieldRole(user?.role)) {
    return <Navigate to={FIELD_ROLE_PATHS[user.role]} replace />;
  }
  return children;
}

function Loading() {
  return <LoadingSpinner text="Loading..." />;
}

function NotFound() {
  return (
    <div className="page-section container text-center" style={{ padding: '80px 16px' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🔬</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Page Not Found</h1>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  );
}

export default function App() {
  const fetchProfile = useAuthStore(s => s.fetchProfile);
  const isAuth = useAuthStore(s => s.isAuthenticated);

  useEffect(() => {
    if (isAuth) fetchProfile();
  }, []);

  return (
    <ThemeProvider>
    <BrowserRouter>
      <ScrollToTop />
      <AnalyticsTracker />
      <ToastProvider>
      <LanguageProvider>
      <ChatBotWidget />
      <LeadCapturePopup />
      <ThemeToggle />
      <Suspense fallback={<Loading />}>
        <PageTransition>
        <HostGate>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/diagnostics" element={<Diagnostics />} />
            <Route path="/tests/:category" element={<TestCategory />} />
            <Route path="/test/:slug" element={<TestDetail />} />
            <Route path="/health-packages" element={<HealthPackages />} />
            <Route path="/services" element={<Services />} />
            <Route path="/package/:slug" element={<PackageDetail />} />
            <Route path="/my-orders" element={<PatientOnly><MyTestOrders /></PatientOnly>} />
            <Route path="/dashboard" element={<PatientOnly><Dashboard /></PatientOnly>} />
            <Route path="/my-bookings" element={<PatientBookings />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/upload-prescription" element={<UploadPrescription />} />
            <Route path="/vaccination/wallet" element={<VaccineWallet />} />
            <Route path="/vaccination/corporate" element={<CorporateVaccination />} />
            <Route path="/vaccination/book" element={<VaccinationBooking />} />
            <Route path="/vaccination/all-vaccines" element={<VaccineListing />} />
            <Route path="/vaccination/vaccine-finder" element={<VaccineFinder />} />
            <Route path="/vaccination-at-home" element={<VaccinationAtHome />} />
            <Route path="/vaccination/schedule" element={<VaccineSchedule />} />
            <Route path="/vaccination/compare" element={<VaccineCompare />} />
            <Route path="/vaccination/camps" element={<VaccineCamps />} />
            <Route path="/vaccination/bulk-booking" element={<BulkVaccinationBooking />} />
            <Route path="/vaccination/category/:slug" element={<VaccineCategoryPage />} />
            <Route path="/vaccination/seo/:slug" element={<VaccineSeoLanding />} />
            <Route path="/vaccination/whatsapp-marketing" element={<VaccineWhatsAppMarketing />} />
            <Route path="/vaccination/treatment/:slug" element={<VaccineTreatmentDetail />} />
            <Route path="/vaccination/:slug" element={<VaccineDetail />} />
            <Route path="/vaccination" element={<VaccinationAtHome />} />
            <Route path="/physiotherapy" element={<PhysiotherapyAtHome />} />
            <Route path="/services/physiotherapy" element={<Navigate to="/physiotherapy" replace />} />
            <Route path="/services/nursing-care" element={<Navigate to="/nursing-care" replace />} />
            <Route path="/physiotherapy/book" element={<PhysiotherapyBooking />} />
            <Route path="/physiotherapy/therapist/:id" element={<PhysioTherapistDetail />} />
            <Route path="/physiotherapy/my-sessions" element={<PhysioPatientDashboard />} />
            <Route path="/physiotherapy/category/:slug" element={<PhysioCategoryPage />} />
            <Route path="/physiotherapy-at-home" element={<PhysioConditionPage />} />
            <Route path="/back-pain-treatment" element={<PhysioConditionPage />} />
            <Route path="/knee-pain-physiotherapy" element={<PhysioConditionPage />} />
            <Route path="/stroke-rehabilitation" element={<PhysioConditionPage />} />
            <Route path="/post-surgery-physiotherapy" element={<PhysioConditionPage />} />
            <Route path="/sports-physiotherapy" element={<PhysioConditionPage />} />
            <Route path="/elderly-physiotherapy" element={<PhysioConditionPage />} />
            <Route path="/physiotherapy/crm-leads" element={<PhysioCrmLeads />} />
            <Route path="/physiotherapy/exercises" element={<PhysioExercises />} />
            <Route path="/physiotherapy/notifications" element={<PhysioNotifications />} />
            <Route path="/physiotherapy/seo/:slug" element={<PhysioSeoLanding />} />
            <Route path="/physiotherapy/whatsapp-marketing" element={<PhysioWhatsAppMarketing />} />
            <Route path="/physiotherapy/treatments" element={<PhysioTreatmentListing />} />
            <Route path="/physiotherapy/treatment/:slug" element={<PhysioTreatmentDetail />} />
            <Route path="/nursing-care" element={<NursingCare />} />
            <Route path="/nursing-care/book" element={<NursingBooking />} />
            <Route path="/nursing-care/services" element={<NursingServiceListing />} />
            <Route path="/nursing-care/service/:slug" element={<NursingServiceDetail />} />
            <Route path="/nursing-care/my-visits" element={<NursingDashboard />} />
            <Route path="/nurse-at-home" element={<NurseAtHome />} />
            <Route path="/nurse-at-home/book" element={<NurseBookingEnhanced />} />
            <Route path="/nurse-at-home/select-nurse" element={<NurseSelection />} />
            <Route path="/nurse-at-home/services" element={<NursingServiceListing />} />
            <Route path="/nurse-at-home/service/:slug" element={<NurseServiceDetail />} />
            <Route path="/nurse-at-home/my-visits" element={<NursingDashboard />} />
            <Route path="/nurse-at-home/seo/:slug" element={<NurseSeoLanding />} />
            <Route path="/nurse-at-home/whatsapp" element={<NurseWhatsAppService />} />
            <Route path="/services/nurse-at-home" element={<Navigate to="/nurse-at-home" replace />} />
            <Route path="/services/nursing" element={<Navigate to="/nurse-at-home" replace />} />
            <Route path="/icu-at-home" element={<HomeIcuCare />} />
            <Route path="/medical-equipment/:slug" element={<MedicalEquipmentDetail />} />
            <Route path="/medical-equipment" element={<MedicalEquipment />} />
            <Route path="/medical-equipment/cart" element={<EquipmentCart />} />
            <Route path="/nurse-app" element={<NurseMobileApp />} />
            <Route path="/nurse/:slug" element={<NurseProfile />} />
            <Route path="/health-library" element={<HealthLibrary />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/checkout" element={<PatientOnly><Checkout /></PatientOnly>} />
            <Route path="/consult-doctor" element={<ConsultDoctor />} />
            <Route path="/book-appointment/:doctorId" element={<BookAppointment />} />
            <Route path="/policy/:slug" element={<PolicyPage />} />
            <Route path="/health-tool/:slug" element={<HealthToolPage />} />
            <Route path="/service/:type/in/:location" element={<LocationServicePage />} />
            <Route path="/disease/:slug" element={<DiseaseCarePage />} />
            <Route path="/test-info/:slug" element={<TestInfoPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/signup" element={<PatientAuthGate><Signup /></PatientAuthGate>} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/onboarding-staff" element={<StaffOnboarding />} />
          <Route path="/onboarding-doctor" element={<DoctorOnboarding />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="collection" element={<AdminCollection />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="permissions" element={<AdminPermissions />} />
            <Route path="test-master" element={<AdminTestMaster />} />
            <Route path="health-packages" element={<AdminHealthPackages />} />
            <Route path="vaccination" element={<AdminVaccination />} />
            <Route path="physiotherapy" element={<AdminPhysiotherapy />} />
            <Route path="nursing" element={<AdminNursing />} />
            <Route path="cms" element={<AdminCMS />} />
            <Route path="doctors" element={<AdminDoctors />} />
            <Route path="staff-onboarding" element={<AdminStaffOnboarding />} />
            <Route path="doctor-onboarding" element={<AdminDoctorOnboarding />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="patients" element={<AdminPatients />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="audit-log" element={<AdminAuditLog />} />
            <Route path="seo" element={<AdminSeo />} />
            <Route path="marketing" element={<AdminMarketing />} />
            <Route path="crm" element={<AdminCrm />} />
            <Route path="whatsapp" element={<AdminWhatsApp />} />
            <Route path="export" element={<AdminExport />} />
            <Route path="sales" element={<AdminSalesDashboard />} />
          </Route>
          {/* Phlebotomist Portal */}
          <Route path="/phlebotomist" element={<Protected><RoleLayout role="phlebotomist" /></Protected>}>
            <Route index element={<PhlebotomistDashboard />} />
            <Route path="collections" element={<PhlebotomistCollections />} />
            <Route path="routes" element={<PhlebotomistRoutes />} />
            <Route path="schedule" element={<PhlebotomistSchedule />} />
          </Route>
          {/* Doctor Portal */}
          <Route path="/doctor" element={<Protected><RoleLayout role="doctor" /></Protected>}>
            <Route index element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="patients" element={<DoctorPatients />} />
            <Route path="availability" element={<DoctorAvailability />} />
          </Route>
          {/* Nurse Portal */}
          <Route path="/nurse" element={<Protected><RoleLayout role="nurse" /></Protected>}>
            <Route index element={<NurseDashboard />} />
            <Route path="patients" element={<NursePatients />} />
            <Route path="schedule" element={<NurseSchedule />} />
          </Route>
          {/* Caregiver Portal */}
          <Route path="/caregiver" element={<Protected><RoleLayout role="caregiver" /></Protected>}>
            <Route index element={<CaregiverDashboard />} />
            <Route path="patients" element={<CaregiverPatients />} />
          </Route>
          {/* Physiotherapist Portal */}
          <Route path="/physio" element={<Protected><RoleLayout role="physiotherapist" /></Protected>}>
            <Route index element={<PhysioDashboard />} />
            <Route path="patients" element={<PhysioPatients />} />
            <Route path="therapy" element={<PhysioTherapy />} />
          </Route>
          {/* Radiology Portal */}
          <Route path="/radiology" element={<Protected><RoleLayout role="radiologist" /></Protected>}>
            <Route index element={<RadiologyDashboard />} />
            <Route path="assignments" element={<RadiologyAssignments />} />
            <Route path="reports" element={<RadiologyReports />} />
          </Route>
          {/* Pharmacy Portal */}
          <Route path="/pharmacy" element={<Protected><RoleLayout role="pharmacy" /></Protected>}>
            <Route index element={<PharmacyDashboard />} />
            <Route path="orders" element={<PharmacyOrders />} />
            <Route path="inventory" element={<PharmacyInventory />} />
          </Route>
          {/* Emergency Portal */}
          <Route path="/emergency" element={<Protected><RoleLayout role="emergency" /></Protected>}>
            <Route index element={<EmergencyDashboard />} />
            <Route path="cases" element={<EmergencyCases />} />
          </Route>
          {/* Dispatch Portal */}
          <Route path="/dispatch" element={<Protected><RoleLayout role="dispatch" /></Protected>}>
            <Route index element={<DispatchDashboard />} />
            <Route path="schedule" element={<DispatchSchedule />} />
            <Route path="staff" element={<DispatchStaff />} />
          </Route>
          {/* Corporate Portal */}
          <Route path="/corporate" element={<Protected><RoleLayout role="corporate" /></Protected>}>
            <Route index element={<CorporateDashboard />} />
            <Route path="orders" element={<CorporateOrders />} />
            <Route path="subscriptions" element={<CorporateSubscriptions />} />
          </Route>
          {/* Training Portal */}
          <Route path="/training" element={<Protected><RoleLayout role="training_officer" /></Protected>}>
            <Route index element={<TrainingDashboard />} />
            <Route path="staff" element={<TrainingStaff />} />
            <Route path="certifications" element={<TrainingCertifications />} />
          </Route>
          {/* IT Support Portal */}
          <Route path="/it-support" element={<Protected><RoleLayout role="it_support" /></Protected>}>
            <Route index element={<ITSupDashboard />} />
            <Route path="system" element={<ITSupSystem />} />
          </Route>
          {/* Customer Care Portal */}
          <Route path="/call-center" element={<Protected><RoleLayout role="call_center" /></Protected>}>
            <Route index element={<CallCenterDashboard />} />
            <Route path="bookings" element={<CallCenterBookings />} />
            <Route path="queries" element={<CallCenterQueries />} />
          </Route>
          {/* Sales & Marketing Portal */}
          <Route path="/sales" element={<Protected><RoleLayout role="sales_marketing" /></Protected>}>
            <Route index element={<SalesDashboard />} />
            <Route path="campaigns" element={<SalesCampaigns />} />
            <Route path="leads" element={<SalesLeads />} />
          </Route>
          {/* Finance Portal */}
          <Route path="/finance" element={<Protected><RoleLayout role="finance" /></Protected>}>
            <Route index element={<FinanceDashboard />} />
            <Route path="transactions" element={<FinanceTransactions />} />
            <Route path="reports" element={<FinanceReports />} />
          </Route>
          {/* Analytics Portal */}
          <Route path="/analytics" element={<Protected><RoleLayout role="bi_analyst" /></Protected>}>
            <Route index element={<AnalyticsDashboard />} />
            <Route path="reports" element={<AnalyticsReports />} />
            <Route path="kpi" element={<AnalyticsKPI />} />
          </Route>
          {/* QA & Compliance Portal */}
          <Route path="/qa" element={<Protected><RoleLayout role="qa_compliance" /></Protected>}>
            <Route index element={<QADashboard />} />
            <Route path="reviews" element={<QaReviews />} />
            <Route path="compliance" element={<QaCompliance />} />
          </Route>
          {/* Inventory Portal */}
          <Route path="/inventory" element={<Protected><RoleLayout role="inventory" /></Protected>}>
            <Route index element={<InventoryDashboard />} />
            <Route path="stock" element={<InventoryStock />} />
            <Route path="orders" element={<InventoryOrders />} />
          </Route>
          {/* Telemedicine Portal */}
          <Route path="/telemedicine" element={<Protected><RoleLayout role="telemedicine" /></Protected>}>
            <Route index element={<TelemedicineDashboard />} />
            <Route path="consultations" element={<TelemedicineConsultations />} />
            <Route path="patients" element={<TelemedicinePatients />} />
          </Route>
          {/* Legal Portal */}
          <Route path="/legal" element={<Protected><RoleLayout role="legal" /></Protected>}>
            <Route index element={<LegalDashboard />} />
            <Route path="compliance" element={<LegalCompliance />} />
            <Route path="audit" element={<LegalAudit />} />
          </Route>
          {/* Content Portal */}
          <Route path="/content" element={<Protected><RoleLayout role="marketing_content" /></Protected>}>
            <Route index element={<ContentDashboard />} />
            <Route path="blog" element={<ContentBlog />} />
            <Route path="seo" element={<ContentSEO />} />
          </Route>
          {/* Emergency Coordinator Portal */}
          <Route path="/emergency-coordinator" element={<Protected><RoleLayout role="emergency_coordinator" /></Protected>}>
            <Route index element={<EmergCoordDashboard />} />
            <Route path="cases" element={<EmergCoordCases />} />
            <Route path="staff" element={<EmergCoordStaff />} />
          </Route>
        </Routes>
        </HostGate>
        </PageTransition>
      </Suspense>
      </LanguageProvider>
      </ToastProvider>
    </BrowserRouter>
    </ThemeProvider>
  );
}
