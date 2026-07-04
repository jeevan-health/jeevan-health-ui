import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Stethoscope, Pill, Flask, ShieldCheck } from '@phosphor-icons/react';

const slides = [
  {
    icon: Stethoscope,
    title: 'Doctor Consultation',
    subtitle: 'Consult top specialists via chat, voice, or video call from home',
  },
  {
    icon: Pill,
    title: 'Medicine Delivery',
    subtitle: 'Order prescriptions and get medicines delivered to your doorstep',
  },
  {
    icon: Flask,
    title: 'Diagnostics at Home',
    subtitle: 'Book lab tests with free home sample collection',
  },
  {
    icon: Heart,
    title: 'Complete Care',
    subtitle: 'Physiotherapy, nursing, and healthcare services at home',
  },
  {
    icon: ShieldCheck,
    title: 'Jeevan HealthCare',
    subtitle: 'Your trusted healthcare partner. All services, one app.',
    isLast: true,
  },
];

export default function Onboarding() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const slide = slides[current];

  const next = () => {
    if (current < slides.length - 1) setCurrent(current + 1);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #ecfeff 0%, #ffffff 100%)' }}>
      <div className="flex flex-col items-center justify-between min-h-screen px-6 py-12">
        <div className="text-right w-full">
          {!slide.isLast && (
            <button onClick={() => navigate('/signup')} className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Skip
            </button>
          )}
        </div>

        <div className="flex flex-col items-center text-center flex-1 justify-center">
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center mb-8" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <slide.icon size={48} />
          </div>
          <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--cyan-900)' }}>{slide.title}</h1>
          <p className="text-base max-w-xs" style={{ color: 'var(--text-secondary)' }}>{slide.subtitle}</p>

          <div className="flex gap-2 mt-10">
            {slides.map((_, i) => (
              <div
                key={i}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: i === current ? 24 : 8,
                  background: i === current ? 'var(--primary)' : 'var(--cyan-200)',
                }}
              />
            ))}
          </div>
        </div>

        <div className="w-full pt-8">
          {slide.isLast ? (
            <button onClick={() => navigate('/signup')} className="btn btn-primary w-full text-lg">
              Get Started
              <ShieldCheck size={20} weight="bold" />
            </button>
          ) : (
            <button onClick={next} className="btn btn-primary w-full">
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
