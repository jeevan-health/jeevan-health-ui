import { create } from 'zustand';

const PERMS_KEY = 'jh_role_permissions';
const ROLES_KEY = 'jh_roles';

const load = (key, def) => { try { return JSON.parse(localStorage.getItem(key) || def); } catch { return def; } };
const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const MODULES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'orders', label: 'Orders' },
  { id: 'phlebotomists', label: 'Phlebotomists' },
  { id: 'reports', label: 'Reports' },
  { id: 'users', label: 'Users' },
  { id: 'catalog', label: 'Catalog' },
  { id: 'coupons', label: 'Coupons' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'permissions', label: 'Permissions' },
  { id: 'cms', label: 'Website CMS' },
  { id: 'finance', label: 'Finance' },
  { id: 'settings', label: 'Settings' },
];

const ACTIONS = ['view', 'create', 'edit', 'delete'];

// Default full permissions
const allPerms = Object.fromEntries(MODULES.map(m => [m.id, Object.fromEntries(ACTIONS.map(a => [a, true]))]));

const defaultRoles = {
  super_admin: { label: 'Super Admin', color: '#92400e', bg: '#fef3c7', permissions: allPerms },
  admin: {
    label: 'Admin', color: '#1e40af', bg: '#dbeafe',
    permissions: Object.fromEntries(MODULES.map(m => [
      m.id,
      m.id === 'permissions' ? { view: false, edit: false } :
      m.id === 'finance' ? { view: true, edit: false } :
      m.id === 'settings' ? { view: true, edit: false } :
      Object.fromEntries(ACTIONS.map(a => [a, a !== 'delete'])),
    ])),
  },
  staff: {
    label: 'Staff', color: '#166534', bg: '#dcfce7',
    permissions: Object.fromEntries(MODULES.map(m => [
      m.id,
      m.id === 'dashboard' ? { view: true, create: false, edit: false, delete: false } :
      m.id === 'orders' ? { view: true, create: false, edit: true, delete: false } :
      m.id === 'phlebotomists' ? { view: true, create: false, edit: false, delete: false } :
      m.id === 'reports' ? { view: true, upload: true, approve: false, deliver: true, delete: false } :
      { view: false, create: false, edit: false, delete: false },
    ])),
  },
  phlebotomist: {
    label: 'Phlebotomist', color: '#059669', bg: '#ecfdf5',
    permissions: Object.fromEntries(MODULES.map(m => [
      m.id,
      m.id === 'dashboard' ? { view: true, create: false, edit: false, delete: false } :
      m.id === 'orders' ? { view: true, create: false, edit: true, delete: false } :
      { view: false, create: false, edit: false, delete: false },
    ])),
  },
  doctor: {
    label: 'Doctor', color: '#7c3aed', bg: '#f5f3ff',
    permissions: Object.fromEntries(MODULES.map(m => [
      m.id,
      m.id === 'dashboard' ? { view: true, create: false, edit: false, delete: false } :
      m.id === 'orders' ? { view: true, create: false, edit: false, delete: false } :
      { view: false, create: false, edit: false, delete: false },
    ])),
  },
  user: {
    label: 'User', color: '#475569', bg: '#f1f5f9',
    permissions: Object.fromEntries(MODULES.map(m => [m.id, { view: false, create: false, edit: false, delete: false }])),
  },
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
    roles[roleId] = { label, color: '#64748b', bg: '#f1f5f9', permissions: Object.fromEntries(MODULES.map(m => [m.id, { view: false, create: false, edit: false, delete: false }])) };
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

  // Check if a given role has a specific permission
  can: (roleId, moduleId, action) => {
    const roles = load(ROLES_KEY, JSON.stringify(defaultRoles));
    const role = roles[roleId];
    if (!role) return false;
    if (roleId === 'super_admin') return true;
    return !!role.permissions?.[moduleId]?.[action];
  },

  // Reset to defaults
  resetPermissions: () => {
    save(ROLES_KEY, defaultRoles);
    set({ roles: defaultRoles });
  },
}));

export { MODULES, ACTIONS, defaultRoles };
export default usePermissionsStore;
