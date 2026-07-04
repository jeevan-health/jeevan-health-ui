import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    if (!gender || !DOB) {
      setError('Please fill all fields');
      return;
    }
    setStep(2);
    setError('');
  };

  const handleSubmit = async () => {
    if (!address.city) {
      setError('Please enter at least city');
      return;
    }

    setLoading(true);
    setError('');

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
    <div className="min-h-screen bg-white flex flex-col px-6">
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Profile</h1>

        {step === 1 && (
          <>
            <div className="mb-6">
              <label className="text-sm text-gray-500 mb-2 block">Gender</label>
              <div className="flex gap-4">
                {['male', 'female', 'other'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex-1 py-4 rounded-xl border-2 text-sm font-medium capitalize ${
                      gender === g ? 'border-blue-500 bg-blue-50 text-blue-500' : 'border-gray-200 text-gray-400'
                    }`}
                  >
                    {g === 'male' ? '👨' : g === 'female' ? '👩' : '🧑'} {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm text-gray-500 mb-1 block">Date of Birth</label>
              <input
                type="date"
                value={DOB}
                onChange={(e) => setDOB(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 outline-none text-sm"
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button onClick={handleNext} className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold">
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-sm text-gray-400 mb-4">Delivery Address</div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <input placeholder="Plot No." value={address.plotNo} onChange={(e) => setAddress({ ...address, plotNo: e.target.value })} className="col-span-1 border border-gray-300 rounded-lg px-3 py-2.5 outline-none text-sm" />
              <input placeholder="Flat No." value={address.flatNo} onChange={(e) => setAddress({ ...address, flatNo: e.target.value })} className="col-span-1 border border-gray-300 rounded-lg px-3 py-2.5 outline-none text-sm" />
              <input placeholder="Society / Apartment" value={address.society} onChange={(e) => setAddress({ ...address, society: e.target.value })} className="col-span-2 border border-gray-300 rounded-lg px-3 py-2.5 outline-none text-sm" />
              <input placeholder="Block No." value={address.block} onChange={(e) => setAddress({ ...address, block: e.target.value })} className="col-span-2 border border-gray-300 rounded-lg px-3 py-2.5 outline-none text-sm" />
              <input placeholder="Area" value={address.area} onChange={(e) => setAddress({ ...address, area: e.target.value })} className="col-span-2 border border-gray-300 rounded-lg px-3 py-2.5 outline-none text-sm" />
              <input placeholder="Landmark" value={address.landmark} onChange={(e) => setAddress({ ...address, landmark: e.target.value })} className="col-span-2 border border-gray-300 rounded-lg px-3 py-2.5 outline-none text-sm" />
              <input placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="col-span-2 border border-gray-300 rounded-lg px-3 py-2.5 outline-none text-sm" />
              <input placeholder="PIN Code" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} className="col-span-2 border border-gray-300 rounded-lg px-3 py-2.5 outline-none text-sm" />
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50">
              {loading ? 'Saving...' : 'Save & Continue'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
