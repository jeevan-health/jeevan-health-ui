import { useState, useEffect } from 'react';
import usePermissionsStore from '../../stores/permissionsStore';
import { useT } from '../../i18n/LanguageProvider';
import * as adminService from '../../services/adminService';

const MODAL_OVERLAY = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };

export default function AdminUsers() {
  const t = useT();
  const roles = usePermissionsStore(s => s.roles);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingRole, setEditingRole] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', role: 'staff' });

  const fetchUsers = async () => {
    try {
      const { data } = await adminService.getUsers({ search, limit: 200 });
      setUsersList(data.users || []);
    } catch {
      // fallback: keep old list
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [search]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      setEditingRole(null);
      fetchUsers();
    } catch { /* ignore */ }
  };

  const handleDelete = async (userId) => {
    if (!confirm(t('admin.users.delete_confirm', 'Delete this user? This cannot be undone.'))) return;
    try {
      await adminService.deleteUser(userId);
      fetchUsers();
    } catch { /* ignore */ }
  };

  const handleAdd = async () => {
    if (!form.name || !form.phone) return;
    try {
      await adminService.createUser(form);
      setShowAdd(false);
      setForm({ name: '', phone: '', email: '', role: 'staff' });
      fetchUsers();
    } catch { /* ignore */ }
  };

  const inputStyle = { padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', background: '#fff' };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 13 }}>{t('admin.users.loading', 'Loading users...')}</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <input className="input" placeholder={t('admin.users.search_placeholder', 'Search by name, phone or email...')} value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, maxWidth: 400, fontSize: 13 }} />
        <span style={{ fontSize: 12, color: '#64748b' }}>{usersList.length} {t('admin.users.users', 'users')}</span>
        <button onClick={() => setShowAdd(true)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: 600, whiteSpace: 'nowrap' }}>
          + {t('admin.users.add_user', 'Add User')}
        </button>
      </div>

      {usersList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 13 }}>{t('admin.users.no_users', 'No users found')}</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
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
              {usersList.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a' }}>{u.name || '—'}</td>
                  <td style={{ padding: '10px 14px', color: '#334155' }}>{u.phone || '—'}</td>
                  <td style={{ padding: '10px 14px', color: '#334155' }}>{u.email || '—'}</td>
                  <td style={{ padding: '10px 14px' }}>
                    {editingRole === u.id ? (
                      <select value={u.role || 'user'} onChange={e => handleRoleChange(u.id, e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, fontFamily: 'inherit' }}
                        onBlur={() => setEditingRole(null)} autoFocus>
                        {Object.keys(roles).map(r => <option key={r} value={r}>{roles[r].label || r}</option>)}
                      </select>
                    ) : (
                      <span onClick={() => setEditingRole(u.id)} style={{ cursor: 'pointer', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: roles[u.role]?.bg || '#f1f5f9', color: roles[u.role]?.color || '#475569' }}>
                        {(roles[u.role]?.label || u.role)} ✏️
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#64748b', fontSize: 12 }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <button onClick={() => handleDelete(u.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 12, padding: '4px 8px' }}>{t('admin.users.delete', 'Delete')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                  {Object.entries(roles).map(([id, r]) => <option key={id} value={id}>{r.label || id}</option>)}
                </select>
              </div>
              {roles[form.role] && (
                <div style={{ background: '#f8fafc', borderRadius: 8, padding: 12, fontSize: 11 }}>
                  <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: 6 }}>{t('admin.users.role_permissions', 'Role Permissions')}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                    {Object.entries(roles[form.role].permissions || {}).map(([mod, perms]) => {
                      const granted = Object.entries(perms).filter(([, v]) => v);
                      if (granted.length === 0) return null;
                      return <div key={mod} style={{ color: '#475569' }}><span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{mod}</span>: {granted.map(([a]) => a).join(', ')}</div>;
                    })}
                  </div>
                </div>
              )}
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAdd(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b' }}>{t('admin.users.cancel', 'Cancel')}</button>
              <button onClick={handleAdd} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#fff', fontWeight: 600 }}>{t('admin.users.add_user', 'Add User')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}