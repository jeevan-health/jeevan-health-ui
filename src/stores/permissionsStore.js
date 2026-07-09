import { create } from 'zustand';

const PERMS_KEY = 'jh_role_permissions';
const ROLES_KEY = 'jh_roles';

const load = (key, def) => { try { return JSON.parse(localStorage.getItem(key) || def); } catch { return def; } };
const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const MODULES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'orders', label: 'Orders & Deliveries' },
  { id: 'patient_management', label: 'Patient Management' },
  { id: 'teleconsultation', label: 'Teleconsultation' },
  { id: 'assignments', label: 'Assignments & Scheduling' },
  { id: 'reports', label: 'Reports & Analytics' },
  { id: 'finance', label: 'Payments & Finance' },
  { id: 'users', label: 'Staff Management' },
  { id: 'phlebotomists', label: 'Phlebotomists' },
  { id: 'catalog', label: 'Service Management' },
  { id: 'cms', label: 'Website CMS' },
  { id: 'training', label: 'Training & Guidelines' },
  { id: 'inventory', label: 'Inventory & Equipment' },
  { id: 'crm', label: 'CRM & Sales' },
  { id: 'subscriptions', label: 'Subscription Plans' },
  { id: 'compliance', label: 'Quality & Compliance' },
  { id: 'feedback', label: 'Feedback & Complaints' },
  { id: 'emergency', label: 'Emergency Response' },
  { id: 'imaging', label: 'Imaging & Radiology' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'coupons', label: 'Coupons & Promotions' },
  { id: 'permissions', label: 'Permissions' },
  { id: 'settings', label: 'Settings' },
];

const ACTIONS = ['view', 'create', 'edit', 'delete'];
const full = (m) => Object.fromEntries(ACTIONS.map(a => [a, true]));
const deny = (m) => Object.fromEntries(ACTIONS.map(a => [a, false]));
const viewOnly = () => ({ view: true, create: false, edit: false, delete: false });
const viewEdit = () => ({ view: true, create: false, edit: true, delete: false });
const allPerms = Object.fromEntries(MODULES.map(m => [m.id, full(m)]));
const noPerms = Object.fromEntries(MODULES.map(m => [m.id, deny(m)]));

const perms = (overrides) => {
  const base = {};
  MODULES.forEach(m => { base[m.id] = deny(m); });
  Object.entries(overrides).forEach(([mod, val]) => { base[mod] = typeof val === 'function' ? val() : val; });
  return base;
};

const defaultRoles = {
  // 👑 Top Management
  super_admin: { label: 'Super Admin', color: '#92400e', bg: '#fef3c7', icon: '👑', permissions: allPerms },
  admin: { label: 'Admin', color: '#1e40af', bg: '#dbeafe', icon: '👑', permissions: perms({ permissions: { view: false, edit: false, create: false, delete: false }, settings: { view: true, edit: false, create: false, delete: false } }) },
  // 👨‍⚕️ Doctors
  doctor: { label: 'Doctor', color: '#7c3aed', bg: '#f5f3ff', icon: '👨‍⚕️', permissions: perms({ dashboard: viewOnly, patient_management: viewEdit, teleconsultation: viewEdit, orders: viewOnly, reports: viewOnly }) },
  // 🧑‍⚕️ Nurses / Medical Staff
  nurse: { label: 'Nurse', color: '#0891b2', bg: '#cffafe', icon: '🧑‍⚕️', permissions: perms({ dashboard: viewOnly, patient_management: viewEdit, teleconsultation: viewOnly, assignments: viewOnly, orders: viewOnly, feedback: viewOnly }) },
  // 👵 Caregivers / Home Health Aides
  caregiver: { label: 'Caregiver', color: '#d97706', bg: '#fef3c7', icon: '👵', permissions: perms({ dashboard: viewOnly, patient_management: viewEdit, assignments: viewOnly }) },
  // 🏃 Physiotherapists / Rehab Staff
  physiotherapist: { label: 'Physiotherapist', color: '#16a34a', bg: '#dcfce7', icon: '🏃', permissions: perms({ dashboard: viewOnly, patient_management: viewEdit, assignments: viewOnly, reports: viewOnly }) },
  // 🧪 Phlebotomists (existing)
  phlebotomist: { label: 'Phlebotomist', color: '#059669', bg: '#ecfdf5', icon: '🧪', permissions: perms({ dashboard: viewOnly, orders: viewEdit, assignments: viewOnly }) },
  // 🩻 Radiology / Imaging Technicians
  radiologist: { label: 'Radiology Tech', color: '#6366f1', bg: '#eef2ff', icon: '🩻', permissions: perms({ dashboard: viewOnly, assignments: viewOnly, imaging: viewEdit, orders: viewOnly }) },
  // 💊 Pharmacy / Medicine Delivery
  pharmacy: { label: 'Pharmacy Staff', color: '#db2777', bg: '#fce7f3', icon: '💊', permissions: perms({ dashboard: viewOnly, orders: viewEdit, inventory: viewEdit }) },
  // 🚑 Emergency / Critical Care
  emergency: { label: 'Emergency Staff', color: '#dc2626', bg: '#fee2e2', icon: '🚑', permissions: perms({ dashboard: viewOnly, patient_management: viewEdit, emergency: viewEdit, assignments: viewOnly, inventory: viewOnly }) },
  // 📦 Operations / Dispatch
  dispatch: { label: 'Dispatch Staff', color: '#f97316', bg: '#ffedd5', icon: '📦', permissions: perms({ dashboard: viewOnly, assignments: viewEdit, orders: viewEdit, patient_management: viewOnly }) },
  // 🧑‍🤝‍🧑 Customer / Patient
  user: { label: 'Customer', color: '#475569', bg: '#f1f5f9', icon: '🧑‍🤝‍🧑', permissions: noPerms },
  // 🧑‍💼 Corporate Clients
  corporate: { label: 'Corporate Coordinator', color: '#1e40af', bg: '#dbeafe', icon: '🧑‍💼', permissions: perms({ dashboard: viewOnly, subscriptions: viewEdit, orders: viewOnly, crm: viewOnly, reports: viewOnly }) },
  // 🎓 Training & Compliance Officer
  training_officer: { label: 'Training Officer', color: '#0d9488', bg: '#ccfbf1', icon: '🎓', permissions: perms({ dashboard: viewOnly, training: viewEdit, compliance: viewOnly, users: viewOnly }) },
  // 🖥️ IT / App Support
  it_support: { label: 'IT Support', color: '#4f46e5', bg: '#eef2ff', icon: '🖥️', permissions: perms({ settings: viewEdit, users: viewOnly, dashboard: viewOnly }) },
  // ☎️ Customer Care
  call_center: { label: 'Customer Care', color: '#0ea5e9', bg: '#e0f2fe', icon: '☎️', permissions: perms({ dashboard: viewOnly, orders: viewOnly, contacts: viewEdit, feedback: viewEdit, patient_management: viewOnly }) },
  // 📢 Sales & Marketing
  sales_marketing: { label: 'Sales & Marketing', color: '#e11d48', bg: '#ffe4e6', icon: '📢', permissions: perms({ dashboard: viewOnly, crm: viewEdit, cms: viewEdit, coupons: viewEdit, subscriptions: viewOnly, contacts: viewOnly }) },
  // 💳 Finance Staff
  finance: { label: 'Finance', color: '#15803d', bg: '#dcfce7', icon: '💳', permissions: perms({ dashboard: viewOnly, finance: viewEdit, orders: viewOnly, reports: viewOnly, subscriptions: viewOnly }) },
  // 📊 BI / Analytics Staff
  bi_analyst: { label: 'Data Analyst', color: '#6d28d9', bg: '#ede9fe', icon: '📊', permissions: perms({ dashboard: viewOnly, reports: viewEdit, finance: viewOnly, orders: viewOnly }) },
  // ✅ QA / Compliance Officer
  qa_compliance: { label: 'QA & Compliance', color: '#65a30d', bg: '#ecfccb', icon: '✅', permissions: perms({ dashboard: viewOnly, compliance: viewEdit, feedback: viewEdit, reports: viewOnly, training: viewOnly }) },
  // 📦🛏️ Inventory Staff
  inventory: { label: 'Inventory Staff', color: '#a16207', bg: '#fef9c3', icon: '📦', permissions: perms({ dashboard: viewOnly, inventory: viewEdit, orders: viewOnly }) },
  // 🌐 Telemedicine Specialist
  telemedicine: { label: 'Telemedicine Specialist', color: '#0284c7', bg: '#e0f2fe', icon: '🌐', permissions: perms({ dashboard: viewOnly, teleconsultation: viewEdit, patient_management: viewOnly, reports: viewOnly }) },
  // ⚖️ Legal / Data Privacy
  legal: { label: 'Legal & Privacy', color: '#4f46e5', bg: '#eef2ff', icon: '⚖️', permissions: perms({ dashboard: viewOnly, compliance: viewEdit, patient_management: viewOnly, feedback: viewOnly }) },
  // 🖋️ Content / SEO Staff
  marketing_content: { label: 'Content & SEO', color: '#c026d3', bg: '#fae8ff', icon: '🖋️', permissions: perms({ dashboard: viewOnly, cms: viewEdit, contacts: viewOnly }) },
  // 🚨 Emergency Coordinator
  emergency_coordinator: { label: 'Emergency Coordinator', color: '#b91c1c', bg: '#fee2e2', icon: '🚨', permissions: perms({ dashboard: viewOnly, emergency: viewEdit, assignments: viewEdit, patient_management: viewOnly, inventory: viewOnly }) },
};

const usePermissionsStore = create((set, get) => ({
  roles: load(ROLES_KEY, JSON.stringify(defaultRoles)),
  modules: MODULES,
  actions: ACTIONS,

  refreshRoles: () => set({ roles: load(ROLES_KEY, JSON.stringify(defaultRoles)) }),

  getRoles: () => load(ROLES_KEY, JSON.stringify(defaultRoles)),

  updateRolePermission: (roleId, moduleId, action, value) => {
    const roles = { ...load(ROLES_KEY, JSON.stringify(defaultRoles)) };
    if (!roles[roleId]) roles[roleId] = { ...defaultRoles[roleId], permissions: {} };
    if (!roles[roleId].permissions[moduleId]) roles[roleId].permissions[moduleId] = {};
    roles[roleId].permissions[moduleId][action] = value;
    save(ROLES_KEY, roles);
    set({ roles });
  },

  addRole: (roleId, label) => {
    const roles = { ...load(ROLES_KEY, JSON.stringify(defaultRoles)) };
    if (roles[roleId]) return false;
    roles[roleId] = { label, color: '#64748b', bg: '#f1f5f9', permissions: noPerms };
    save(ROLES_KEY, roles);
    set({ roles });
    return true;
  },

  deleteRole: (roleId) => {
    if (roleId === 'super_admin') return false;
    const roles = { ...load(ROLES_KEY, JSON.stringify(defaultRoles)) };
    delete roles[roleId];
    save(ROLES_KEY, roles);
    set({ roles });
    return true;
  },

  can: (roleId, moduleId, action) => {
    const roles = load(ROLES_KEY, JSON.stringify(defaultRoles));
    const role = roles[roleId];
    if (!role) return false;
    if (roleId === 'super_admin') return true;
    return !!role.permissions?.[moduleId]?.[action];
  },

  resetPermissions: () => {
    save(ROLES_KEY, defaultRoles);
    set({ roles: defaultRoles });
  },
}));

export { MODULES, ACTIONS, defaultRoles };
export default usePermissionsStore;