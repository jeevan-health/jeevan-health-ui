import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/layout/ScrollToTop';
import useAuthStore from './stores/authStore';
import AdminLayout from './components/admin/AdminLayout';
import RoleLayout from './components/role/RoleLayout';

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

// Role → URL path mapping for redirects
const ROLE_PATH = {
  phlebotomist: '/phlebotomist', doctor: '/doctor', nurse: '/nurse',
  caregiver: '/caregiver', physiotherapist: '/physio', radiologist: '/radiology',
  pharmacy: '/pharmacy', emergency: '/emergency', dispatch: '/dispatch',
  corporate: '/corporate', training_officer: '/training', it_support: '/it-support',
  call_center: '/call-center', sales_marketing: '/sales', finance: '/finance',
  bi_analyst: '/analytics', qa_compliance: '/qa', inventory: '/inventory',
  telemedicine: '/telemedicine', legal: '/legal', marketing_content: '/content',
  emergency_coordinator: '/emergency-coordinator',
};

// All non-admin field roles
const FIELD_ROLES = Object.keys(ROLE_PATH);

function Protected({ children }) {
  const isAuth = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  if (!isAuth) return <Navigate to="/signup" />;
  const role = user?.role || 'user';
  if (ROLE_PATH[role]) return <Navigate to={ROLE_PATH[role]} />;
  if (role === 'super_admin' || role === 'admin' || role === 'staff') return <Navigate to="/admin" />;
  return children;
}

function AdminGuard({ children }) {
  const isAuth = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  if (!isAuth) return <Navigate to="/admin/login" />;
  const role = user?.role || 'user';
  if (role === 'user') return <Navigate to="/dashboard" />;
  if (ROLE_PATH[role]) return <Navigate to={ROLE_PATH[role]} />;
  return children;
}

function Loading() {
  return <div className="page-section container text-center" style={{ padding: '80px 16px' }}>Loading...</div>;
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
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/diagnostics" element={<Diagnostics />} />
            <Route path="/tests/:category" element={<TestCategory />} />
            <Route path="/test/:slug" element={<TestDetail />} />
            <Route path="/health-packages" element={<HealthPackages />} />
            <Route path="/services" element={<Services />} />
            <Route path="/package/:slug" element={<PackageDetail />} />
            <Route path="/my-orders" element={<Protected><MyTestOrders /></Protected>} />
            <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/upload-prescription" element={<UploadPrescription />} />
            <Route path="/vaccination/wallet" element={<VaccineWallet />} />
            <Route path="/vaccination/corporate" element={<CorporateVaccination />} />
            <Route path="/vaccination/book" element={<VaccinationBooking />} />
            <Route path="/vaccination/all-vaccines" element={<VaccineListing />} />
            <Route path="/vaccination/vaccine-finder" element={<VaccineFinder />} />
            <Route path="/vaccination-at-home" element={<VaccinationAtHome />} />
            <Route path="/vaccination/category/:slug" element={<VaccineCategoryPage />} />
            <Route path="/vaccination/:slug" element={<VaccineDetail />} />
            <Route path="/vaccination" element={<VaccinationAtHome />} />
            <Route path="/health-library" element={<HealthLibrary />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/checkout" element={<Protected><Checkout /></Protected>} />
            <Route path="/consult-doctor" element={<ConsultDoctor />} />
            <Route path="/book-appointment/:doctorId" element={<BookAppointment />} />
            <Route path="/policy/:slug" element={<PolicyPage />} />
            <Route path="/health-tool/:slug" element={<HealthToolPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/signup" element={<Signup />} />
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
      </Suspense>
    </BrowserRouter>
  );
}
