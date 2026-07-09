import { useState, useEffect } from 'react';
import usePermissionsStore from '../../stores/permissionsStore';

export default function AdminPermissions() {
  const roles = usePermissionsStore(s => s.roles);
  const modules = usePermissionsStore(s => s.modules);
  const actions = usePermissionsStore(s => s.actions);
  const updateRolePermission = usePermissionsStore(s => s.updateRolePermission);
  const addRole = usePermissionsStore(s => s.addRole);
  const deleteRole = usePermissionsStore(s => s.deleteRole);
  const resetPermissions = usePermissionsStore(s => s.resetPermissions);
  const refreshRoles = usePermissionsStore(s => s.refreshRoles);

  const [activeRole, setActiveRole] = useState('admin');
  const [showAdd, setShowAdd] = useState(false);
  const [newRoleId, setNewRoleId] = useState('');
  const [newRoleLabel, setNewRoleLabel] = useState('');

  useEffect(() => { refreshRoles(); }, []);

  const role = roles[activeRole];
  const actionLabels = { view: 'View', create: 'Create', edit: 'Edit', delete: 'Delete' };

  const handleToggle = (moduleId, action) => {
    const current = !!role?.permissions?.[moduleId]?.[action];
    updateRolePermission(activeRole, moduleId, action, !current);
  };

  const handleAddRole = () => {
    if (!newRoleId || !newRoleLabel) return;
    if (addRole(newRoleId, newRoleLabel)) {
      setShowAdd(false);
      setNewRoleId('');
      setNewRoleLabel('');
      setActiveRole(newRoleId);
    }
  };

  const handleDeleteRole = (roleId) => {
    if (roleId === 'super_admin') return;
    if (confirm(`Delete role "${roles[roleId]?.label || roleId}"?`)) {
      deleteRole(roleId);
      setActiveRole('admin');
    }
  };

  const handleReset = () => {
    if (confirm('Reset all permissions to default? This cannot be undone.')) {
      resetPermissions();
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 13, color: '#64748b' }}>Manage role-based access control for all admin modules</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleReset} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#ef4444' }}>Reset Defaults</button>
          <button onClick={() => setShowAdd(true)} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600 }}>+ Add Role</button>
        </div>
      </div>

      {/* Role Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {Object.entries(roles).map(([id, r]) => (
          <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button onClick={() => setActiveRole(id)} style={{
              padding: '8px 16px', borderRadius: 8, border: activeRole === id ? 'none' : '1px solid #e2e8f0',
              background: activeRole === id ? (r.bg || '#f1f5f9') : '#fff',
              color: activeRole === id ? (r.color || '#475569') : '#64748b',
              cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', fontWeight: activeRole === id ? 700 : 400,
            }}>
              {r.label || id}
            </button>
            {id !== 'super_admin' && (
              <button onClick={() => handleDeleteRole(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 14, padding: 4 }} title="Delete role">✕</button>
            )}
          </div>
        ))}
      </div>

      {/* Permissions Table */}
      {role && (
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', width: 160 }}>Module</th>
                {actions.map(a => (
                  <th key={a} style={{ textAlign: 'center', padding: '12px 8px', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>{actionLabels[a]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600, color: '#0f172a', fontSize: 13 }}>{m.label}</td>
                  {actions.map(a => {
                    const checked = !!role.permissions?.[m.id]?.[a];
                    return (
                      <td key={a} style={{ textAlign: 'center', padding: '10px 8px' }}>
                        <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggle(m.id, a)}
                            style={{ accentColor: '#3b82f6', width: 16, height: 16, cursor: 'pointer' }}
                          />
                        </label>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: 11, color: '#64748b', flexWrap: 'wrap' }}>
        <span>✅ = Permission granted</span>
        <span>⬜ = No access</span>
        <span style={{ color: '#94a3b8' }}>super_admin always has full access</span>
      </div>

      {/* Add Role Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowAdd(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: 24, width: 380, maxWidth: '90vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Add Role</h4>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#94a3b8' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input placeholder="Role ID (e.g. lab_manager)" value={newRoleId} onChange={e => setNewRoleId(e.target.value.toLowerCase().replace(/\s+/g, '_'))} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit' }} />
              <input placeholder="Display Label (e.g. Lab Manager)" value={newRoleLabel} onChange={e => setNewRoleLabel(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, fontFamily: 'inherit' }} />
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAdd(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#64748b' }}>Cancel</button>
              <button onClick={handleAddRole} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#0f172a', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: '#fff', fontWeight: 600 }}>Add Role</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
