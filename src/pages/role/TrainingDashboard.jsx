import { useState } from 'react';
import useAuthStore from '../../stores/authStore';

const card = { background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e2e8f0', marginBottom: 16 };

export default function TrainingDashboard() {
  const user = useAuthStore(s => s.user);
  const users = useAuthStore(s => s.getUsers)();
  const staff = users.filter(u => u.role !== 'user' && u.role !== 'super_admin');

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>🎓 Welcome, {user?.name || 'Training Officer'}</h2>
      <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: 16 }}>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#0d9488' }}>{staff.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Staff to Train</div></div>
        <div style={{ ...card, padding: 16, textAlign: 'center', marginBottom: 0 }}><div style={{ fontSize: 24, fontWeight: 800, color: '#0d9488' }}>{users.length}</div><div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Total Users</div></div>
      </div>
      <div style={card}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>👥 Staff Roster</h4>
        {staff.length === 0 && <p style={{ fontSize: 12, color: '#94a3b8' }}>No staff users yet.</p>}
        {staff.map(u => (
          <div key={u.id} style={{ fontSize: 12, padding: '6px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
            <span>{u.name} <span style={{ color: '#64748b' }}>({u.role})</span></span>
            <span style={{ color: '#94a3b8', fontSize: 11 }}>{u.phone}</span>
          </div>
        ))}
      </div>
    </div>
  );
}