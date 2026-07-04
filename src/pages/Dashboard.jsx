import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const quickActions = [
  { icon: '👨‍⚕️', title: 'Consult Doctor', desc: 'Chat, voice or video', color: 'bg-blue-50' },
  { icon: '💊', title: 'Order Medicine', desc: 'Home delivery', color: 'bg-green-50' },
  { icon: '🔬', title: 'Book Lab Test', desc: 'Home collection', color: 'bg-purple-50' },
  { icon: '🏋️', title: 'Physiotherapy', desc: 'At home sessions', color: 'bg-orange-50' },
];

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-500 text-white p-6 pb-12">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Hello, {user?.name || 'User'} 👋</h1>
          <button onClick={logout} className="text-sm bg-white/20 px-3 py-1 rounded-full">Logout</button>
        </div>
        <p className="text-blue-100 text-sm">Your health is our priority</p>
      </div>

      <div className="px-4 -mt-8">
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm text-gray-400">Family</span>
            <button onClick={() => navigate('/family')} className="text-blue-500 text-sm ml-auto">Manage</button>
          </div>
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 text-sm font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <button onClick={() => navigate('/family/add')} className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-gray-400 text-lg">
              +
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <div key={action.title} className={`${action.color} rounded-xl p-4 cursor-pointer`}>
              <span className="text-2xl">{action.icon}</span>
              <h3 className="font-semibold text-gray-800 text-sm mt-2">{action.title}</h3>
              <p className="text-xs text-gray-400">{action.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow p-4 mt-4 mb-8">
          <h3 className="font-semibold text-gray-800 mb-3">Quick Health Summary</h3>
          <p className="text-gray-400 text-sm">Health tracking coming soon...</p>
        </div>
      </div>
    </div>
  );
}
