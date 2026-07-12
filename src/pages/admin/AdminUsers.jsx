import { useState, useEffect } from 'react';
import usePermissionsStore from '../../stores/permissionsStore';
import { useT } from '../../i18n/LanguageProvider';
import * as adminService from '../../services/adminService';

const MODAL_OVERLAY = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };

/** Roles the API accepts on PUT /admin/users/:id/role */
const API_ROLES = [
  { id: 'user', label: 'User', bg: '#f1f5f9', color: '#475569' },
  { id: 'staff', label: 'Staff', bg: '#dbeafe', color: '#1d4ed8' },
  { id: 'admin', label: 'Admin', bg: '#fef3c7', color: '#b45309' },
  { id: 'super_admin', label: 'Super Admin', bg: '#fee2e2', color: '#b91c1c' },
];

export default function AdminUsers() {
  const t = useT();
  const roles = usePermissionsStore(s => s.roles);
  const [usersList, setUsersList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [error, setError] = useState('');
  const [editingRole, setEditingRole] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', role: 'user' });
  const [saving, setSaving] = useState(false);

  const roleMeta = (roleId) => {
    const api = API_ROLES.find(r => r.id === roleId);
    if (api) return api;
    const store = roles[roleId];
    if (store) return { id: roleId, label: store.label || roleId, bg: store.bg || '#f1f5f9', color: store.color || '#475569' };
    return { id: roleId, label: roleId || 'user', bg: '#f1f5f9', color: '#475569' };
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await adminService.getUsers({
        search: search || undefined,
        role: roleFilter || undefined,
        limit: 200,
      });
      setUsersList(data.users || []);
      setTotal(data.total ?? (data.users || []).length);
    } catch {
      setError(t('admin.users.loadError', 'Failed to load users'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const tmr = setTimeout(fetchUsers, search ? 300 : 0);
    return () => clearTimeout(tmr);
  }, [search, roleFilter]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      setEditingRole(null);
      fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.error || t('admin.users.roleFailed', 'Failed to update role'));
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm(t('admin.users.delete_confirm', 'Delete this user? This cannot be undone.'))) return;
    try {
      await adminService.deleteUser(userId);
      fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.error || t('admin.users.deleteFailed', 'Failed to delete user'));
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.phone) return;
    setSaving(true);
    try {
      await adminService.createUser(form);
      setShowAdd(false);
      setForm({ name: '', phone: '', email: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      alert(err?.response?.data?.error || t('admin.users.createFailed', 'Failed to create user'));
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', background: '#fff' };

  if (loading && usersList.length === 0) {
    return <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 13 }}>{t('admin.users.loading', 'Loading users...')}</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <input className="input" placeholder={t('admin.users.search_placeholder', 'Search by name, phone or email...')} value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 160, maxWidth: 360, fontSize: 13 }} />
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', background: '#fff', minHeight: 40 }}
        >
          <option value="">{t('admin.users.allRoles', 'All roles')}</option>
          {API_ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
        <span style={{ fontSize: 12, color: '#64748b' }}>{total} {t('admin.users.users', 'users')}</span>
        <button type="button" onClick={() => setShowAdd(true)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 600, whiteSpace: 'nowrap', minHeight: 40 }}>
          + {t('admin.users.add_user', 'Add User')}
        </button>
      </div>

      {error && <div style={{ marginBottom: 12, padding: 12, borderRadius: 8, background: '#FEF2F2', color: '#b91c1c', fontSize: 13 }}>{error}</div>}

      {usersList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 13 }}>{t('admin.users.no_users', 'No users found')}</div>
      ) : (
        <>
        {/* Mobile cards */}
        <div className="admin-users-cards" style={{ display: 'none', flexDirection: 'column', gap: 10 }}>
          {usersList.map(u => {
            const meta = roleMeta(u.role);
            return (
              <div key={u.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{u.name || '—'}</div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5, marginBottom: 10 }}>
                  {u.phone || '—'}{u.email ? ` · ${u.email}` : ''}
                  <div>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : ''}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <select
                    value={u.role || 'user'}
                    onChange={e => handleRoleChange(u.id, e.target.value)}
                    style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', minHeight: 42, background: meta.bg, color: meta.color, fontWeight: 600 }}
                  >
                    {API_ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                  </select>
                  <button type="button" onClick={() => handleDelete(u.id)} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #fecaca', background: '#fff', color: '#ef4444', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', minHeight: 42 }}>
                    {t('admin.users.delete', 'Delete')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="admin-users-table" style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{t('admin.users.name', 'Name')}</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{t('admin.users.phone', 'Phone')}</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{t('admin.users.email', 'Email')}</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{t('admin.users.role', 'Role')}</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{t('admin.users.joined', 'Joined')}</th>
                <th style={{ textAlign: 'right', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{t('admin.users.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map(u => {
                const meta = roleMeta(u.role);
                return (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a' }}>{u.name || '—'}</td>
                  <td style={{ padding: '10px 14px', color: '#334155' }}>{u.phone || '—'}</td>
                  <td style={{ padding: '10px 14px', color: '#334155' }}>{u.email || '—'}</td>
                  <td style={{ padding: '10px 14px' }}>
                    {editingRole === u.id ? (
                      <select value={u.role || 'user'} onChange={e => handleRoleChange(u.id, e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, fontFamily: 'inherit' }}
                        onBlur={() => setEditingRole(null)} autoFocus>
                        {API_ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                      </select>
                    ) : (
                      <span onClick={() => setEditingRole(u.id)} style={{ cursor: 'pointer', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: meta.bg, color: meta.color }}>
                        {meta.label} ✏️
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#64748b', fontSize: 12 }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <button type="button" onClick={() => handleDelete(u.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 12, padding: '4px 8px' }}>{t('admin.users.delete', 'Delete')}</button>
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>
        <style>{`
          @media (max-width: 768px) {
            .admin-users-table { display: none !important; }
            .admin-users-cards { display: flex !important; }
          }
        `}</style>
        </>
      )}

      {/* Add User Modal */}
      {showAdd && (
        <div style={MODAL_OVERLAY} onClick={() => setShowAdd(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 24, width: 400, maxWidth: '90vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{t('admin.users.add_user_title', 'Add User')}</h4>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#94a3b8' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input placeholder={t('admin.users.full_name_req', 'Full Name *')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              <input placeholder={t('admin.users.phone_number_req', 'Phone Number *')} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
              <input placeholder={t('admin.users.email_optional', 'Email (optional)')} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
              <div>
                <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 4 }}>{t('admin.users.role_label', 'Role')}</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={inputStyle}>
                  {API_ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </div>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
                {t('admin.users.roleHint', 'API roles: user, staff, admin, super_admin. Staff/admin roles control portal access.')}
              </p>
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowAdd(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b' }}>{t('admin.users.cancel', 'Cancel')}</button>
              <button type="button" disabled={saving} onClick={handleAdd} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', cursor: saving ? 'wait' : 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#fff', fontWeight: 600 }}>
                {saving ? t('admin.users.saving', 'Saving…') : t('admin.users.add_user', 'Add User')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}