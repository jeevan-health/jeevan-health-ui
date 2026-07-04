import { useNavigate } from 'react-router-dom';
import { SignOut, UserCircle, Plus, Stethoscope, Pill, Flask, Heart, Users } from '@phosphor-icons/react';
import useAuthStore from '../store/authStore';

const quickActions = [
  { icon: Stethoscope, title: 'Consult Doctor', desc: 'Chat, voice or video', color: '#ecfeff', iconColor: 'var(--primary)' },
  { icon: Pill, title: 'Order Medicine', desc: 'Home delivery', color: '#f0fdf4', iconColor: 'var(--accent)' },
  { icon: Flask, title: 'Book Lab Test', desc: 'Home collection', color: '#f5f3ff', iconColor: '#7c3aed' },
  { icon: Heart, title: 'Physiotherapy', desc: 'At home sessions', color: '#fff7ed', iconColor: '#ea580c' },
];

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--cyan-50)', minHeight: '100dvh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0891b2 0%, #066f8f 100%)' }} className="px-6 pt-6 pb-16 rounded-b-3xl">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>Welcome back,</p>
            <h1 className="text-2xl font-bold text-white">{user?.name || 'User'}</h1>
          </div>
          <button onClick={logout} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
            <SignOut size={20} />
          </button>
        </div>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Your health is our priority ❤️</p>
      </div>

      {/* Family quick-switch */}
      <div className="px-6 -mt-8 mb-4">
        <div className="card flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            U
          </div>
          <div>
            <p className="font-semibold text-sm">You</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Primary account</p>
          </div>
          <button onClick={() => navigate('/family')} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'var(--cyan-50)', color: 'var(--primary)' }}>
            <Users size={14} /> Family
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-6 mb-6">
        <h2 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>QUICK ACTIONS</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(({ icon: Icon, title, desc, color, iconColor }) => (
            <div key={title} className="card p-4 cursor-pointer transition-all hover:-translate-y-0.5" style={{ boxShadow: 'var(--shadow)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: color, color: iconColor }}>
                <Icon size={22} weight="fill" />
              </div>
              <h3 className="font-semibold text-sm">{title}</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Health summary */}
      <div className="px-6 pb-8">
        <h2 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>HEALTH SUMMARY</h2>
        <div className="card p-5 text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--green-100)', color: 'var(--accent)' }}>
            <Heart size={24} weight="fill" />
          </div>
          <p className="font-semibold">Track Your Health</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Vitals, records, and more coming in next update</p>
        </div>
      </div>
    </div>
  );
}
