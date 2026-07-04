import { useNavigate } from 'react-router-dom';
import {
  Stethoscope, Pill, Flask, Heart, FirstAidKit, User,
  Clipboard, Syringe, Brain, AppleLogo, Toolbox, Baby,
  ShieldCheck, Star, Phone, ChatCircle, ArrowRight, Clock,
} from '@phosphor-icons/react';

const services = [
  { icon: Stethoscope, title: 'Doctor Consultation', desc: 'Chat, voice, or video call with top specialists from the comfort of your home' },
  { icon: Pill, title: 'Medicine Delivery', desc: 'Order prescriptions and get medicines delivered to your doorstep in hours' },
  { icon: Flask, title: 'Lab Tests at Home', desc: 'Book diagnostic tests with free home sample collection & digital reports' },
  { icon: Heart, title: 'Physiotherapy', desc: 'Expert physiotherapists for rehab, pain management, and mobility at home' },
  { icon: FirstAidKit, title: 'Nursing Care', desc: 'Skilled nursing for wound care, injections, post-surgery recovery & more' },
  { icon: User, title: 'Elderly Care', desc: 'Compassionate attendants and caregivers for your loved ones at home' },
  { icon: Clipboard, title: 'Health Checkups', desc: 'Comprehensive preventive health packages tailored for every age group' },
  { icon: Syringe, title: 'Vaccination at Home', desc: 'Schedule vaccines for flu, pneumonia, travel and more at your doorstep' },
  { icon: Brain, title: 'Mental Health', desc: 'Confidential counselling and therapy sessions with licensed professionals' },
  { icon: AppleLogo, title: 'Diet & Nutrition', desc: 'Personalised meal plans and nutrition counselling from expert dietitians' },
  { icon: Toolbox, title: 'Medical Equipment', desc: 'Rent or buy hospital beds, oxygen concentrators, wheelchairs & more' },
  { icon: Baby, title: 'Mother & Baby Care', desc: 'Pre & post-natal care, newborn checkups, and lactation counselling' },
];

const highlights = [
  { stat: '50+', label: 'Cities Covered' },
  { stat: '500+', label: 'Expert Doctors' },
  { stat: '50K+', label: 'Happy Families' },
  { stat: '4.8', label: 'App Rating', suffix: <Star size={14} weight="fill" color="#f59e0b" /> },
];

const howItWorks = [
  { step: '01', title: 'Choose a Service', desc: 'Browse from 12+ healthcare services and pick what you need' },
  { step: '02', title: 'Book an Appointment', desc: 'Select a convenient time slot and our team confirms instantly' },
  { step: '03', title: 'Get Care at Home', desc: 'A qualified professional arrives at your doorstep — safe & hygienic' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Bengaluru', text: 'Jeevan HealthCare has been a blessing for my elderly parents. The nursing care is exceptional and the team is always on time.' },
  { name: 'Rahul Mehta', role: 'Mumbai', text: 'From doctor consultation to medicine delivery, everything is seamless. The physiotherapy sessions at home saved me so much travel time.' },
  { name: 'Anita Desai', role: 'Pune', text: 'Lab tests at home with digital reports — so convenient! Highly recommend for busy families.' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--cyan-50)', minHeight: '100dvh', overflow: 'hidden' }}>
      {/* ─── NAV ─── */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary)', color: 'white' }}>
            <Heart size={18} weight="fill" />
          </div>
          <span className="font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>Jeevan HealthCare</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/signup')} className="btn btn-ghost text-sm px-4 py-2" style={{ minHeight: 0 }}>Sign In</button>
          <button onClick={() => navigate('/signup')} className="btn btn-primary text-sm px-5 py-2" style={{ minHeight: 0 }}>Get Started</button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="px-6 pt-8 pb-16 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-5" style={{ background: 'var(--green-100)', color: 'var(--accent)' }}>
              <ShieldCheck size={14} weight="fill" /> Trusted Healthcare Partner
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--cyan-900)' }}>
              Complete Healthcare<br />
              <span style={{ color: 'var(--primary)' }}>at Your Doorstep</span>
            </h1>
            <p className="text-lg mb-6 max-w-lg mx-auto lg:mx-0" style={{ color: 'var(--text-secondary)' }}>
              From doctor consultations to nursing care, lab tests to medicine delivery — we bring 12+ professional healthcare services home.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button onClick={() => navigate('/signup')} className="btn btn-primary text-base px-8">
                Get Started <ArrowRight size={20} weight="bold" />
              </button>
              <button className="btn btn-outline text-base px-8">
                <Phone size={20} /> Call Us
              </button>
            </div>
            <div className="flex items-center gap-5 mt-8 justify-center lg:justify-start">
              {highlights.map((h) => (
                <div key={h.label} className="text-center">
                  <div className="text-xl font-bold" style={{ color: 'var(--cyan-900)' }}>
                    {h.stat}{h.suffix}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{h.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full max-w-md lg:max-w-none">
            <div className="relative">
              <div className="rounded-3xl p-8 text-center" style={{ background: 'linear-gradient(135deg, #0891b2 0%, #066f8f 50%, #047857 100%)' }}>
                <Heart size={64} weight="fill" style={{ color: 'rgba(255,255,255,0.2)' }} />
                <h3 className="text-2xl font-bold text-white mt-3">Your Health, Our Priority</h3>
                <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.7)' }}>24/7 care at your doorstep</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section className="px-6 py-16" style={{ background: 'white' }}>
        <div className="max-w-6xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: 'var(--cyan-100)', color: 'var(--primary)' }}>
            Our Services
          </div>
          <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--cyan-900)' }}>Everything Healthcare, at Home</h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            We bring together all the healthcare services your family needs — no hospital visits required.
          </p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-5 transition-all duration-200" style={{ cursor: 'default' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                <Icon size={24} weight="fill" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: 'var(--green-100)', color: 'var(--accent)' }}>
            How It Works
          </div>
          <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--cyan-900)' }}>Three Simple Steps</h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Getting professional healthcare at home is as easy as 1-2-3.
          </p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {howItWorks.map(({ step, title, desc }) => (
            <div key={step} className="card p-6 text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold" style={{ background: 'var(--primary)', color: 'white', fontSize: '18px' }}>
                {step}
              </div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── WHY US ─── */}
      <section className="px-6 py-16" style={{ background: 'white' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: 'var(--cyan-100)', color: 'var(--primary)' }}>
              Why Jeevan
            </div>
            <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--cyan-900)' }}>Why Families Trust Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#ecfeff', color: 'var(--primary)' }}>
                <ShieldCheck size={28} weight="fill" />
              </div>
              <h3 className="font-semibold mb-2">Verified Professionals</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>All doctors, nurses, and therapists are background-verified and trained for in-home care.</p>
            </div>
            <div className="card p-6 text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#f0fdf4', color: 'var(--accent)' }}>
                <Clock size={28} weight="fill" />
              </div>
              <h3 className="font-semibold mb-2">Same-Day Service</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>Book in the morning, get care by evening. Urgent needs? We prioritise your health.</p>
            </div>
            <div className="card p-6 text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#fefce8', color: '#ca8a04' }}>
                <ChatCircle size={28} weight="fill" />
              </div>
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>Our care coordinators are available round-the-clock for appointments, queries, and emergencies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: 'var(--green-100)', color: 'var(--accent)' }}>
            Testimonials
          </div>
          <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--cyan-900)' }}>What Our Families Say</h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-5">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} weight="fill" color="#f59e0b" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>"{t.text}"</p>
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="px-6 py-16" style={{ background: 'linear-gradient(135deg, #0891b2 0%, #066f8f 50%, #047857 100%)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Join 50,000+ families who trust Jeevan HealthCare for their home healthcare needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/signup')} className="btn text-base px-10 py-3" style={{ background: 'white', color: 'var(--primary)', borderRadius: 'var(--radius)', fontWeight: 700 }}>
              Create Free Account <ArrowRight size={20} weight="bold" />
            </button>
            <button className="btn text-base px-10 py-3" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderRadius: 'var(--radius)', fontWeight: 600, border: '2px solid rgba(255,255,255,0.3)' }}>
              <Phone size={20} /> Book by Phone
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="px-6 py-8" style={{ background: 'var(--cyan-900)' }}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'var(--primary)', color: 'white' }}>
              <Heart size={14} weight="fill" />
            </div>
            <span className="font-bold text-white">Jeevan HealthCare</span>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            &copy; 2025 Jeevan HealthCare at Home. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
