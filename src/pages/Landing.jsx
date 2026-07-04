import { useState, useEffect, useRef } from 'react';
import {
  House, StackSimple, User, Link as LinkIcon, Pulse, Monitor,
  Users, Shield, Wrench, Heart, Briefcase, Package, Globe,
  Smiley, Phone, Envelope, PaperPlaneTilt, FacebookLogo,
  InstagramLogo, WhatsappLogo, Info, CaretDown, Sparkle,
  Clock, Brain, Syringe, Baby,
} from '@phosphor-icons/react';

const services = [
  {
    icon: House, title: 'Home Healthcare',
    items: [
      'Doctor consultation, medicine delivery',
      <>Lab tests, diagnostics (<strong style={{color:'#0A5EB0'}}>X-Ray, ECG, EEG</strong>)</>,
      'Nursing, caregiver, physiotherapy',
      <><strong style={{color:'#0A5EB0'}}>Vaccination</strong>, equipment rental/sales</>,
      'Home ICU, preventive health',
    ],
  },
  {
    icon: Monitor, title: 'Digital Health Tools',
    items: [
      'Service booking/tracking app',
      'EMR/EHR, health trackers, remote monitoring',
      'Symptom checker, e-prescriptions, reminders',
      'Smart home device integration',
      'Predictive analytics, mental health support',
    ],
  },
  {
    icon: Heart, title: 'Mother & Child Care',
    items: [
      'Postnatal & neonatal care',
      'Pediatric consults & vaccinations',
      'Lactation & nutrition support',
    ],
  },
  {
    icon: User, title: 'Specialist Home Services',
    items: [
      'Oncology, orthopedic, neurological, cardiac rehab at home',
    ],
  },
  {
    icon: Globe, title: 'Travel & Concierge Care',
    items: [
      'Pre-travel health, NRI/family assistance',
      'Hotel/apartment-based care',
    ],
  },
];

const wellnessItems = [
  { icon: Pulse, text: 'Yoga & Meditation' },
  { icon: Baby, text: 'Nutrition & Disease Reversal' },
  { icon: Brain, text: 'Smoking Cessation' },
  { icon: Smiley, text: 'Mental Health & Wellness' },
];

const corporateItems = [
  { icon: Briefcase, text: 'Employment health checks' },
  { icon: Package, text: 'Customizable health packages' },
  { icon: Clock, text: 'Annual plans & subscriptions' },
  { icon: Shield, text: 'HIPAA-compliance & safety' },
];

const communityItems = [
  { icon: Users, text: 'Free camps & screening drives' },
  { icon: Monitor, text: 'Insurance/TPA & school programs' },
  { icon: Sparkle, text: 'AI, IoT & telemonitoring', sub: '(coming soon)' },
  { icon: Shield, text: 'Health ID/ABHA integration' },
];

const socialLinks = [
  { icon: Phone, label: '+91 9700 104 108', href: 'tel:+919700104108' },
  { icon: Envelope, label: 'care@jeevanhealth.com', href: 'mailto:care@jeevanhealth.com' },
  { icon: WhatsappLogo, label: 'WhatsApp', href: 'https://wa.me/919700104108' },
  { icon: FacebookLogo, label: 'Facebook', href: 'https://facebook.com/' },
  { icon: InstagramLogo, label: 'Instagram', href: 'https://instagram.com/' },
];

const bubbleColors = [
  'linear-gradient(135deg, #2F89D9 60%, #0A5EB0 100%)',
  'linear-gradient(135deg, #0A5EB0 60%, #2F89D9 100%)',
  'linear-gradient(135deg, #7AD6F6 60%, #2F89D9 100%)',
];

const circleColors = [
  '#0A5EB0', '#3AC6F6', '#7AD6F6', '#C8E6FF',
  '#E3F0FF', '#A3D8F4', '#F1F6FB',
];

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const featuresRef = useRef(null);
  const bubblesRef = useRef(null);

  useEffect(() => {
    const bubblesEl = bubblesRef.current;
    if (!bubblesEl) return;
    const items = [];
    for (let i = 0; i < 12; i++) {
      const size = 64 + Math.floor(Math.random() * 56);
      const el = document.createElement('div');
      el.className = 'bubble';
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.left = Math.random() * 80 + '%';
      el.style.top = Math.random() * 60 + 20 + '%';
      el.style.background = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
      el.style.animation = `float${(i % 3) + 1} ${4 + Math.random() * 3}s ease-in-out infinite`;
      el.style.animationDelay = Math.random() * 2 + 's';
      bubblesEl.appendChild(el);
      items.push(el);
    }
    return () => items.forEach(el => el.remove());
  }, []);

  useEffect(() => {
    const vanta = document.querySelector('.vanta-bg');
    if (!vanta) return;
    const circles = [];
    for (let i = 0; i < 16; i++) {
      const c = document.createElement('div');
      c.style.position = 'absolute';
      c.style.borderRadius = '50%';
      c.style.opacity = '0.18';
      c.style.background = circleColors[i % circleColors.length];
      const sz = 70 + Math.random() * 100;
      c.style.width = sz + 'px';
      c.style.height = sz + 'px';
      c.style.left = Math.random() * 90 + '%';
      c.style.top = Math.random() * 90 + '%';
      c.style.transition = 'transform 6s ease-in-out, opacity 6s ease-in-out';
      vanta.appendChild(c);
      circles.push(c);
      animateCircle(c);
    }
    function animateCircle(el) {
      const tx = (Math.random() - 0.5) * 120;
      const ty = (Math.random() - 0.5) * 120;
      const sc = 0.8 + Math.random() * 0.4;
      el.style.transform = `translate(${tx}px, ${ty}px) scale(${sc})`;
      el.style.opacity = (0.12 + Math.random() * 0.12).toString();
      setTimeout(() => animateCircle(el), 5000 + Math.random() * 3000);
    }
    return () => circles.forEach(c => c.remove());
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll('.animate-card');
    if (!cards.length || !window.IntersectionObserver) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    cards.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateY(30px)'; c.style.transition = 'opacity 0.6s ease, transform 0.6s ease'; obs.observe(c); });
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: '#fff', minHeight: '100dvh' }}>
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-30" style={{ background: '#fff', boxShadow: '0 2px 16px 0 rgba(10,94,176,0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2 font-bold text-lg" style={{ color: '#0A5EB0' }}>
            <img src="/logo.png" alt="Jeevan HealthCare" style={{ height: 40, width: 'auto' }} />
          </a>
          <nav className="hidden lg:flex gap-2 items-center">
            <a href="#home" className="nav-link"><House size={18} /> Home</a>
            <div className="relative" style={{ zIndex: 100 }}
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setTimeout(() => setServicesOpen(false), 300)}
            >
              <button className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <StackSimple size={18} /> Services <CaretDown size={14} />
              </button>
              {servicesOpen && (
                <div className="absolute left-0 mt-2 bg-white shadow-xl rounded-2xl p-6 flex gap-8"
                  style={{ width: 800, maxWidth: '95vw', border: '1px solid #C2D6EB', zIndex: 100, maxHeight: '70vh', overflowY: 'auto' }}
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <div style={{ minWidth: 200 }}>
                    <div className="font-bold mb-3 flex items-center gap-1" style={{ color: '#0A5EB0', fontSize: 17 }}><House size={16} weight="fill" /> Healthcare Services</div>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {[
                        { icon: User, label: 'Doctor Consultation', href: '#' },
                        { icon: LinkIcon, label: 'Pharmacy', href: '#' },
                        { icon: Pulse, label: 'Diagnostics', href: '#' },
                        { icon: Monitor, label: 'X-Ray, ECG, EEG', href: '#' },
                        { icon: Users, label: 'Nursing Care', href: '#' },
                        { icon: Users, label: 'Caregiver Services', href: '#' },
                        { icon: Pulse, label: 'Physiotherapy', href: '#' },
                        { icon: Shield, label: 'Vaccination', href: '#' },
                        { icon: Wrench, label: 'Equipment Rental', href: '#' },
                        { icon: Monitor, label: 'Home ICU Setup', href: '#' },
                      ].map(s => (
                        <li key={s.label}>
                          <a href={s.href} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', borderRadius: 6, color: '#666', fontSize: 15, fontWeight: 500, transition: 'background 0.12s, color 0.12s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#E3F0FF'; e.currentTarget.style.color = '#133A6D'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '#666'; }}
                          ><span style={{ color: '#0A5EB0' }}><s.icon size={16} /></span> {s.label}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ minWidth: 200 }}>
                    <div className="font-bold mb-3 flex items-center gap-1" style={{ color: '#2F89D9', fontSize: 17 }}><Briefcase size={16} /> Preventive & Corporate</div>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {[
                        { icon: Heart, label: 'Preventive Checkups' },
                        { icon: Briefcase, label: 'Corporate Wellness' },
                        { icon: Shield, label: 'Health Insurance' },
                        { icon: Users, label: 'School Programs' },
                        { icon: Brain, label: 'Mental Wellness' },
                      ].map(s => (
                        <li key={s.label}>
                          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', borderRadius: 6, color: '#666', fontSize: 15, fontWeight: 500, transition: 'background 0.12s, color 0.12s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#E3F0FF'; e.currentTarget.style.color = '#133A6D'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '#666'; }}
                          ><span style={{ color: '#0A5EB0' }}><s.icon size={16} /></span> {s.label}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <a href="#features" className="nav-link"><Pulse size={18} /> Features</a>
            <a href="#wellness" className="nav-link"><Heart size={18} /> Wellness</a>
            <a href="#corporate" className="nav-link"><Briefcase size={18} /> Corporate</a>
            <a href="#contact" className="nav-link"><Phone size={18} /> Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="hidden sm:inline-flex header-cta" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              Get Started
            </button>
            <button className="lg:hidden p-2" style={{ color: '#0A5EB0' }} onClick={() => setMenuOpen(!menuOpen)}>
              <Layers size={24} weight="fill" />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div style={{ background: '#fff', borderTop: '1px solid #C2D6EB', padding: '12px 16px' }}
            onClick={() => setMenuOpen(false)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="#home" className="nav-link" style={{ padding: '10px 12px' }}>Home</a>
              <a href="#features" className="nav-link" style={{ padding: '10px 12px' }}>Features</a>
              <a href="#wellness" className="nav-link" style={{ padding: '10px 12px' }}>Wellness</a>
              <a href="#corporate" className="nav-link" style={{ padding: '10px 12px' }}>Corporate</a>
              <a href="#contact" className="nav-link" style={{ padding: '10px 12px' }}>Contact</a>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <main style={{ paddingTop: 64 }}>
        <section id="home" className="relative flex items-center justify-center overflow-hidden" style={{ background: '#0A5EB0', minHeight: '85vh' }}>
          <div className="vanta-bg absolute inset-0" />
          <div className="relative z-10 max-w-3xl mx-auto text-center px-4 py-16">
            <div style={{ opacity: 0, animation: 'fadeInUp 1s ease 0.5s forwards' }}>
              <img src="/logo.png" alt="Jeevan HealthCare" style={{ height: 60, margin: '0 auto 24px', filter: 'brightness(0) invert(1)' }} />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold" style={{ color: '#fff' }}>
                Jeevan HealthCare at Home
              </h1>
              <p className="mt-6 text-lg sm:text-xl" style={{ color: '#fff', opacity: 0.92 }}>
                Trusted healthcare services delivered safely, conveniently, and professionally at your doorstep.
              </p>
              <p className="mt-4 text-base sm:text-lg max-w-2xl mx-auto" style={{ color: '#fff', opacity: 0.85 }}>
                From doctor consultations and diagnostics to nursing care, physiotherapy, and medicine delivery — we bring quality healthcare home, so you can focus on what matters most: your health and comfort.
              </p>
            </div>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#features" className="hero-btn-primary">Explore Features</a>
              <a href="#contact" className="hero-btn-secondary">Contact Us</a>
            </div>
          </div>
          <div ref={bubblesRef} id="animated-bg-bubbles" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
        </section>

        {/* FEATURES */}
        <section className="section-white py-20" id="features">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4" style={{ color: '#0A5EB0' }}>
              Our Core Services
            </h2>
            <p className="text-center max-w-2xl mx-auto mb-12" style={{ color: '#333', fontSize: 17 }}>
              Comprehensive <strong style={{ color: '#0A5EB0' }}>at-home healthcare</strong>,
              <strong style={{ color: '#0A5EB0' }}> digital tools</strong>, and
              <strong style={{ color: '#0A5EB0' }}> wellness</strong> — delivered with compassion and technology.
            </p>
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {services.slice(0, 3).map((s) => (
                <div key={s.title} className="service-card animate-card" style={{ opacity: 0, transform: 'translateY(30px)' }}>
                  <div className="card-icon"><s.icon size={28} weight="fill" /></div>
                  <h3 className="card-title">{s.title}</h3>
                  <ul>{s.items.map((item, i) => <li key={i}>• {item}</li>)}</ul>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col md:flex-row gap-8 justify-center max-w-4xl mx-auto">
              {services.slice(3).map((s) => (
                <div key={s.title} className="service-card animate-card flex-1" style={{ opacity: 0, transform: 'translateY(30px)' }}>
                  <div className="card-icon"><s.icon size={28} weight="fill" /></div>
                  <h3 className="card-title">{s.title}</h3>
                  <ul>{s.items.map((item, i) => <li key={i}>• {item}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WELLNESS */}
        <section className="section-blue py-20" id="wellness">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#fff' }}>
                  Wellness & Lifestyle Support
                </h2>
                <p className="text-lg mb-6" style={{ color: '#fff', opacity: 0.92 }}>
                  We believe in <strong style={{ color: '#fff', opacity: 0.92 }}>holistic health</strong>. Our platform delivers wellness programs and lifestyle management tools for every age and need.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  {wellnessItems.map(w => (
                    <li key={w.text} className="flex items-center gap-3" style={{ color: '#fff', opacity: 0.92 }}>
                      <w.icon size={20} weight="fill" />
                      <strong>{w.text}</strong>
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="cta-btn">Book a Wellness Session</a>
              </div>
              <div className="relative">
                <img alt="Wellness Yoga" className="rounded-2xl w-full max-w-md mx-auto" style={{ boxShadow: '0 3px 16px rgba(10,94,176,0.10)' }}
                  src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80" />
                <span className="absolute -top-6 -right-6 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.9)', color: '#0A5EB0', fontWeight: 600, boxShadow: '0 2px 12px rgba(10,94,176,0.12)', fontSize: 15 }}>
                  Personalized Wellness
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CORPORATE */}
        <section className="section-white py-20" id="corporate">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative order-2 md:order-1">
                <img alt="Corporate Health" className="rounded-2xl w-full max-w-md mx-auto" style={{ boxShadow: '0 3px 16px rgba(10,94,176,0.10)' }}
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" />
                <span className="absolute -top-6 -left-6 px-3 py-2 rounded-lg" style={{ background: '#0A5EB0', color: '#fff', fontWeight: 600, boxShadow: '0 2px 12px rgba(10,94,176,0.12)', fontSize: 15 }}>
                  Corporate Wellness
                </span>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#0A5EB0' }}>
                  Corporate & Preventive Health
                </h2>
                <p className="text-lg mb-6" style={{ color: '#333' }}>
                  Empower your workforce and community with <strong style={{ color: '#0A5EB0' }}>customizable health checkups</strong>,
                  <strong style={{ color: '#0A5EB0' }}> occupational health</strong>, and
                  <strong style={{ color: '#0A5EB0' }}> subscription plans</strong> — seamlessly integrated with digital tools and compliance.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  {corporateItems.map(c => (
                    <li key={c.text} className="flex items-center gap-3" style={{ color: '#0A5EB0' }}>
                      <c.icon size={20} />
                      <span style={{ color: '#333' }}>{c.text}</span>
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="header-cta">Request a Demo</a>
              </div>
            </div>
          </div>
        </section>

        {/* COMMUNITY */}
        <section className="section-blue py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#fff' }}>
                  Community Engagement & Future Vision
                </h2>
                <p className="text-lg mb-6" style={{ color: '#fff', opacity: 0.92 }}>
                  Jeevan HealthCare is committed to making <strong style={{ color: '#fff', opacity: 0.92 }}>quality healthcare accessible</strong> for all — through free camps, digital integration, and a vision for <strong style={{ color: '#fff', opacity: 0.92 }}>AI-driven</strong>, <strong style={{ color: '#fff', opacity: 0.92 }}>marketplace-enabled home care</strong>.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  {communityItems.map(c => (
                    <li key={c.text} className="flex items-center gap-3" style={{ color: '#fff', opacity: 0.92 }}>
                      <c.icon size={20} />
                      <span>{c.text}</span>
                      {c.sub && <em style={{ fontSize: 14, opacity: 0.7 }}>({c.sub})</em>}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <img alt="Community Health" className="rounded-2xl w-full max-w-md mx-auto" style={{ boxShadow: '0 3px 16px rgba(10,94,176,0.10)' }}
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80" />
                <span className="absolute -bottom-6 -right-6 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.9)', color: '#0A5EB0', fontWeight: 600, boxShadow: '0 2px 12px rgba(10,94,176,0.12)', fontSize: 15 }}>
                  Future-Ready Platform
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="section-white py-20" id="contact">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#0A5EB0' }}>
              Ready to Experience Better Healthcare?
            </h2>
            <p className="text-lg mb-8" style={{ color: '#333' }}>
              Reach out to us for personalized care, corporate solutions, or partnership opportunities.
            </p>
            <form className="form-section flex flex-col gap-4 max-w-lg mx-auto" onSubmit={e => {
              e.preventDefault();
              const status = e.currentTarget.querySelector('#form-status');
              if (status) {
                status.textContent = "Thank you! We'll get back to you soon.";
                status.style.display = 'block';
                setTimeout(() => { status.style.display = 'none'; }, 5000);
              }
              e.currentTarget.reset();
            }}>
              <div className="flex flex-col sm:flex-row gap-4">
                <input name="name" placeholder="Your Name" required style={{ flex: 1 }} />
                <input name="email" type="email" placeholder="Your Email" required style={{ flex: 1 }} />
              </div>
              <textarea name="message" placeholder="How can we help you?" required rows={4} />
              <button type="submit" className="btn-primary-old mt-2" style={{ justifyContent: 'center' }}>
                <PaperPlaneTilt size={20} weight="fill" /> Send Message
              </button>
              <div id="form-status" className="hidden text-sm font-medium mt-1" style={{ color: '#059669', display: 'none' }} />
            </form>
            <div className="mt-10 flex flex-wrap gap-4 justify-center items-center footer-social">
              {socialLinks.map(s => (
                <a key={s.label} href={s.href} className="flex items-center gap-2" target="_blank" rel="noopener noreferrer">
                  <s.icon size={20} />
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            <img src="/logo.png" alt="Jeevan HealthCare" style={{ height: 36, filter: 'brightness(0) invert(1)' }} />
          </div>
          <div className="flex flex-wrap gap-6 items-center">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#wellness">Wellness</a>
            <a href="#corporate">Corporate</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="text-sm" style={{ opacity: 0.8 }}>
            &copy; 2025 Jeevan HealthCare Solutions. All rights reserved.
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
