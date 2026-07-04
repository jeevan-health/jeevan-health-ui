import { useNavigate } from 'react-router-dom';
import { SignOut, Stethoscope, Pill, Flask, Heart, Users, Calendar, FileText, ChartLine, Leaf } from '@phosphor-icons/react';
import useAuthStore from '../store/authStore';

const quickActions = [
  { icon: Stethoscope, title: 'Consult Doctor', desc: 'Chat, voice or video', color: '#ecfeff', iconColor: 'var(--primary)', path: '/doctor-consultation' },
  { icon: Calendar, title: 'My Appointments', desc: 'View all bookings', color: '#fef3e2', iconColor: 'var(--accent)', path: '/my-appointments' },
  { icon: Pill, title: 'Order Medicine', desc: 'Home delivery', color: '#f0fdf4', iconColor: 'var(--accent)', path: '/pharmacy' },
  { icon: Flask, title: 'Book Lab Test', desc: 'Home collection', color: '#f5f3ff', iconColor: '#7c3aed', path: '/diagnostics' },
  { icon: Flask, title: 'Test Orders', desc: 'Track & view results', color: '#fce4ec', iconColor: '#e91e63', path: '/my-test-orders' },
  { icon: FileText, title: 'Health Records', desc: 'Upload & manage', color: '#fff7ed', iconColor: '#ea580c', path: '/health-records' },
  { icon: ChartLine, title: 'Vitals Tracker', desc: 'BP, sugar & more', color: '#f0fdf4', iconColor: '#16a34a', path: '/vitals' },
  { icon: Leaf, title: 'Wellness Hub', desc: 'BMI, diet & vaccines', color: '#fefce8', iconColor: '#ca8a04', path: '/wellness' },
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {quickActions.map(({ icon: Icon, title, desc, color, iconColor, path }) => (
            <div key={title} onClick={() => navigate(path)} className="card p-4 cursor-pointer transition-all hover:-translate-y-0.5" style={{ boxShadow: 'var(--shadow)' }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div onClick={() => navigate('/vitals')} className="card p-4 text-center cursor-pointer">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <ChartLine size={20} weight="fill" />
            </div>
            <p className="font-semibold text-sm">Track Vitals</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>BP, Sugar & more</p>
          </div>
          <div onClick={() => navigate('/health-records')} className="card p-4 text-center cursor-pointer">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: '#fff7ed', color: '#ea580c' }}>
              <FileText size={20} weight="fill" />
            </div>
            <p className="font-semibold text-sm">Health Records</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Upload & manage</p>
          </div>
        </div>
      </div>
    </div>
  );
}
