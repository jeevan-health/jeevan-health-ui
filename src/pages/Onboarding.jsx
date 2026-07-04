import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    icon: '🏥',
    title: 'Doctor Consultation',
    subtitle: 'Consult top doctors via chat, voice or video',
  },
  {
    icon: '💊',
    title: 'Medicine Delivery',
    subtitle: 'Order medicines delivered to your doorstep',
  },
  {
    icon: '🔬',
    title: 'Diagnostics at Home',
    subtitle: 'Book lab tests with home sample collection',
  },
  {
    icon: '🏡',
    title: 'Healthcare at Home',
    subtitle: 'Physiotherapy, nursing, and care services',
  },
  {
    icon: '❤️',
    title: 'Jeevan HealthCare',
    subtitle: 'Your complete healthcare partner at home',
    isLast: true,
  },
];

export default function Onboarding() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    }
  };

  const skip = () => navigate('/signup');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-7xl mb-8">{slides[current].icon}</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3 text-center">
          {slides[current].title}
        </h1>
        <p className="text-gray-500 text-center text-sm">{slides[current].subtitle}</p>

        <div className="flex gap-2 mt-8">
          {slides.map((_, i) => (
            <div key={i} className={`h-2 w-2 rounded-full ${i === current ? 'bg-blue-500 w-6' : 'bg-gray-300'}`} />
          ))}
        </div>
      </div>

      <div className="p-6 pb-10">
        {slides[current].isLast ? (
          <button
            onClick={() => navigate('/signup')}
            className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold text-lg"
          >
            Get Started
          </button>
        ) : (
          <div className="flex gap-4">
            <button onClick={skip} className="flex-1 text-gray-400 font-medium">Skip</button>
            <button onClick={next} className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-semibold">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
