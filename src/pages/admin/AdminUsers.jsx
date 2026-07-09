import { useState, useEffect } from 'react';
import useAdminStore from '../../stores/adminStore';
import useAuthStore from '../../stores/authStore';

const ROLE_OPTIONS = ['user', 'staff', 'admin', 'super_admin'];

export default function AdminUsers() {
  const usersList = useAdminStore(s => s.usersList);
  const refreshAnalytics = useAdminStore(s => s.refreshAnalytics);
  const updateUserRole = useAuthStore(s => s.updateUserRole);
  const deleteUser = useAuthStore(s => s.deleteUser);
  const [search, setSearch] = useState('');
  const [editingRole, setEditingRole] = useState(null);

  useEffect(() => { refreshAnalytics(); }, []);

  const filtered = usersList.filter(u =>
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.phone || '').includes(search) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = (userId, newRole) => {
    updateUserRole(userId, newRole);
    setEditingRole(null);
    refreshAnalytics();
  };

  const handleDelete = (userId) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    deleteUser(userId);
    refreshAnalytics();
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <input className="input" placeholder="Search by name, phone or email..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, maxWidth: 400, fontSize: 13 }} />
        <span style={{ fontSize: 12, color: '#64748b' }}>{filtered.length} of {usersList.length} users</span>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 13 }}>No users found</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Phone</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Role</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Joined</th>
                <th style={{ textAlign: 'right', padding: '10px 14px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#0f172a' }}>{u.name || '—'}</td>
                  <td style={{ padding: '10px 14px', color: '#334155' }}>{u.phone || '—'}</td>
                  <td style={{ padding: '10px 14px', color: '#334155' }}>{u.email || '—'}</td>
                  <td style={{ padding: '10px 14px' }}>
                    {editingRole === u.id ? (
                      <select value={u.role || 'user'} onChange={e => handleRoleChange(u.id, e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, fontFamily: 'inherit' }}
                        onBlur={() => setEditingRole(null)} autoFocus>
                        {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    ) : (
                      <span onClick={() => setEditingRole(u.id)} style={{ cursor: 'pointer', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: u.role === 'super_admin' ? '#fef3c7' : u.role === 'admin' ? '#dbeafe' : u.role === 'staff' ? '#dcfce7' : '#f1f5f9', color: u.role === 'super_admin' ? '#92400e' : u.role === 'admin' ? '#1e40af' : u.role === 'staff' ? '#166534' : '#475569' }}>
                        {u.role || 'user'} ✏️
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#64748b', fontSize: 12 }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <button onClick={() => handleDelete(u.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 12, padding: '4px 8px' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
