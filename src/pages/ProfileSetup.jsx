import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CalendarBlank, MapPin, ArrowRight, ArrowLeft } from '@phosphor-icons/react';
import { updateProfile } from '../services/authService';
import useAuthStore from '../store/authStore';

export default function ProfileSetup() {
  const [gender, setGender] = useState('');
  const [DOB, setDOB] = useState('');
  const [address, setAddress] = useState({
    plotNo: '', flatNo: '', society: '', block: '',
    area: '', location: '', landmark: '', city: '', pincode: '',
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fetchProfile = useAuthStore((s) => s.fetchProfile);

  const handleNext = () => {
    if (!gender || !DOB) { setError('Please fill all fields'); return; }
    setStep(2); setError('');
  };

  const handleSubmit = async () => {
    if (!address.city) { setError('Please enter at least city'); return; }
    setLoading(true); setError('');
    try {
      await updateProfile({ gender, DOB, address });
      await fetchProfile();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-12" style={{ background: 'linear-gradient(180deg, #ecfeff 0%, #ffffff 100%)' }}>
      <div className="flex flex-col min-h-full max-w-sm mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => step === 2 ? setStep(1) : navigate(-1)} className="p-2 rounded-xl" style={{ color: 'var(--text-secondary)' }}>
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="section-title">Your Profile</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Step {step} of 2</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex-1 h-2 rounded-full transition-all" style={{ background: s <= step ? 'var(--primary)' : 'var(--cyan-200)' }} />
          ))}
        </div>

        {step === 1 && (
          <>
            <div className="mb-6">
              <label><User size={16} /> Gender</label>
              <div className="flex gap-3 mt-2">
                {[
                  { value: 'male', label: 'Male', emoji: '👨' },
                  { value: 'female', label: 'Female', emoji: '👩' },
                  { value: 'other', label: 'Other', emoji: '🧑' },
                ].map(({ value, label, emoji }) => (
                  <button
                    key={value}
                    onClick={() => setGender(value)}
                    className="flex-1 py-4 rounded-xl border-2 text-sm font-semibold capitalize transition-all"
                    style={{
                      borderColor: gender === value ? 'var(--primary)' : 'var(--cyan-200)',
                      background: gender === value ? 'var(--cyan-50)' : 'white',
                      color: gender === value ? 'var(--primary)' : 'var(--text-secondary)',
                    }}
                  >
                    <span className="text-2xl block mb-1">{emoji}</span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label><CalendarBlank size={16} /> Date of Birth</label>
              <input type="date" value={DOB} onChange={(e) => setDOB(e.target.value)} className="input mt-2" />
            </div>

            {error && <p className="text-sm font-medium mb-4" style={{ color: 'var(--red-500)' }}>{error}</p>}

            <button onClick={handleNext} className="btn btn-primary w-full">
              Next <ArrowRight size={20} weight="bold" />
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="mb-4">
              <label><MapPin size={16} /> Delivery Address</label>
            </div>
            <div className="card p-4 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Plot No." value={address.plotNo} onChange={(e) => setAddress({ ...address, plotNo: e.target.value })} className="input p-3 text-sm" />
                <input placeholder="Flat No." value={address.flatNo} onChange={(e) => setAddress({ ...address, flatNo: e.target.value })} className="input p-3 text-sm" />
              </div>
              <input placeholder="Society / Apartment" value={address.society} onChange={(e) => setAddress({ ...address, society: e.target.value })} className="input p-3 text-sm" />
              <input placeholder="Block No." value={address.block} onChange={(e) => setAddress({ ...address, block: e.target.value })} className="input p-3 text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Area" value={address.area} onChange={(e) => setAddress({ ...address, area: e.target.value })} className="input p-3 text-sm" />
                <input placeholder="Landmark" value={address.landmark} onChange={(e) => setAddress({ ...address, landmark: e.target.value })} className="input p-3 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="City *" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="input p-3 text-sm" />
                <input placeholder="PIN Code" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} className="input p-3 text-sm" />
              </div>
            </div>

            {error && <p className="text-sm font-medium mt-4" style={{ color: 'var(--red-500)' }}>{error}</p>}

            <button onClick={handleSubmit} disabled={loading} className="btn btn-accent w-full mt-6">
              {loading ? 'Saving...' : 'Save & Continue'}
              <ArrowRight size={20} weight="bold" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
