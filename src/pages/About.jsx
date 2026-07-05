import {
  Shield, Users, Heart, Star, Target, Eye,
  Stethoscope, Flask, Clock, Buildings, FirstAidKit,
  SealCheck, Pill, Baby, Monitor,
} from '@phosphor-icons/react';

export default function About() {
  return (
    <>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0B4FA8 0%, #0C6BC4 50%, #0B7DE5 100%)',
        padding: '60px 20px 52px', textAlign: 'center', color: '#fff',
      }}>
        <div className="container">
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Heart size={34} weight="fill" color="#fff" />
          </div>
          <h1 style={{ color: '#fff', fontSize: 32, marginBottom: 10 }}>
            About Jeevan HealthCare at Home
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, maxWidth: 640, margin: '0 auto', lineHeight: 1.6 }}>
            Home Healthcare Services in India — trusted, professional, and delivered with compassion.
          </p>
        </div>
      </div>

      <section className="page-section">
        <div className="container">

          {/* Intro */}
          <div style={{
            background: '#fff', borderRadius: 'var(--radius-lg)',
            padding: '36px 40px', marginBottom: 36,
            border: '1px solid var(--border)',
          }}>
            <p style={{ fontSize: 15, color: 'var(--text-body)', lineHeight: 1.8 }}>
              <strong style={{ color: '#0B4FA8' }}>Jeevan HealthCare at Home</strong> is a trusted home healthcare service provider in India,
              dedicated to delivering comprehensive medical services at home in a safe, professional, and patient-centric manner.
              We specialize in <strong>doctor consultation at home, lab tests at home, nursing care services, elderly care, physiotherapy,
              and preventive health checkups</strong>.
            </p>
            <p style={{ fontSize: 15, color: 'var(--text-body)', lineHeight: 1.8, marginTop: 12 }}>
              We believe that quality healthcare services should be <strong>accessible, affordable, and compassionate</strong>,
              ensuring patients receive timely medical attention without the need for hospital visits.
            </p>
          </div>

          {/* Mission, Vision, Values */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20, marginBottom: 40 }}>
            {[
              { icon: Target, title: 'Our Mission', desc: 'To make quality healthcare accessible to every Indian family through innovative and reliable home-based healthcare services in India. We combine clinical excellence, certified medical professionals, and compassionate care to deliver safe and effective treatment at home.',
                gradient: 'linear-gradient(135deg, #e8f0fe, #d4e4f7)', iconBg: '#0B4FA8' },
              { icon: Eye, title: 'Our Vision', desc: 'To become India\'s most trusted home healthcare platform, empowering millions of families to access world-class medical care at home. We aim to transform healthcare delivery through digital healthcare services, home diagnostics, preventive care, and chronic disease management solutions.',
                gradient: 'linear-gradient(135deg, #e0f7fa, #b9f6fc)', iconBg: '#00FFFF' },
              { icon: Heart, title: 'Our Core Values', desc: 'Compassion — Patient-first care with empathy and dignity. Integrity — Transparent and ethical healthcare practices. Innovation — Modern digital healthcare and home care solutions. Excellence — High-quality medical services and patient safety.',
                gradient: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', iconBg: '#2e7d32' },
            ].map(item => (
              <div key={item.title} style={{
                background: item.gradient, borderRadius: 'var(--radius-lg)',
                padding: 32, border: '1px solid rgba(0,0,0,0.04)',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: item.iconBg, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16, color: '#fff',
                }}>
                  <item.icon size={26} weight="fill" />
                </div>
                <h3 style={{ color: item.iconBg, fontSize: 17, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-body)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Values Strip */}
          <div style={{
            background: 'linear-gradient(135deg, #0B4FA8, #0C6BC4)',
            borderRadius: 'var(--radius-lg)', padding: '32px 36px',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 20,
            marginBottom: 40,
          }}>
            {[
              { icon: Heart, label: 'Compassion' },
              { icon: Shield, label: 'Integrity' },
              { icon: Star, label: 'Innovation' },
              { icon: SealCheck, label: 'Excellence' },
            ].map(v => (
              <div key={v.label} style={{ textAlign: 'center', color: '#fff' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 8px',
                }}>
                  <v.icon size={22} weight="fill" />
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.9 }}>{v.label}</div>
              </div>
            ))}
          </div>

          {/* Why Choose Us */}
          <h2 style={{
            fontSize: 24, color: '#0B4FA8', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Buildings size={24} weight="fill" /> Why Choose Jeevan HealthCare at Home?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 24 }}>
            We are a leading provider of home healthcare services in India, offering:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 14, marginBottom: 40 }}>
            {[
              { icon: Stethoscope, label: 'Doctor Consultation at Home', desc: 'Certified doctors for home visits' },
              { icon: Flask, label: 'Lab Tests at Home', desc: 'NABL-associated home sample collection' },
              { icon: FirstAidKit, label: 'Nursing Care at Home', desc: 'Skilled nurses for post-operative and chronic care' },
              { icon: Users, label: 'Elderly Care Services', desc: 'Compassionate senior citizen care at home' },
              { icon: Monitor, label: 'Diagnostics at Home', desc: 'ECG, X-Ray, and preventive health checkups' },
              { icon: Pill, label: 'Pharmacy & Medicine Delivery', desc: 'Fast and reliable medicine delivery' },
              { icon: Baby, label: 'Physiotherapy at Home', desc: 'Rehabilitation and recovery support' },
              { icon: Buildings, label: 'Corporate Health Services', desc: 'Employee health checkups and wellness programs' },
            ].map(s => (
              <div key={s.label} className="info-card" style={{ padding: 20, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'var(--primary-light)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: '#0B4FA8', flexShrink: 0,
                }}>
                  <s.icon size={20} weight="fill" />
                </div>
                <div>
                  <h4 style={{ fontSize: 14, marginBottom: 2, color: '#0B4FA8' }}>{s.label}</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-light)' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quality & Safety */}
          <h2 style={{
            fontSize: 24, color: '#0B4FA8', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Shield size={24} weight="fill" /> Quality & Safety Assurance
          </h2>
          <div style={{
            background: '#fff', borderRadius: 'var(--radius-lg)',
            padding: '28px 32px', border: '1px solid var(--border)',
            marginBottom: 32,
          }}>
            <p style={{ fontSize: 14, color: 'var(--text-body)', marginBottom: 16 }}>
              We follow strict healthcare standards to ensure safe home healthcare services in India:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
              {[
                { icon: Shield, text: 'Verified doctors, nurses, and healthcare professionals' },
                { icon: Flask, text: 'Infection control and sanitization protocols' },
                { icon: Users, text: 'Staff trained in home healthcare safety standards' },
                { icon: SealCheck, text: 'HIPAA-inspired patient data protection practices' },
                { icon: Clock, text: '24/7 healthcare support and coordination' },
              ].map(s => (
                <div key={s.text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-body)' }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: '#e8f5e9', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: '#2e7d32', flexShrink: 0,
                  }}>
                    <s.icon size={16} weight="fill" />
                  </div>
                  {s.text}
                </div>
              ))}
            </div>
          </div>

          {/* Tagline */}
          <div style={{
            background: 'linear-gradient(135deg, #0B4FA8, #0C6BC4)',
            borderRadius: 'var(--radius-lg)', padding: '32px 36px',
            textAlign: 'center', color: '#fff',
          }}>
            <Heart size={28} weight="fill" style={{ marginBottom: 8, opacity: 0.8 }} />
            <h3 style={{ color: '#fff', fontSize: 20, marginBottom: 6 }}>
              Jeevan HealthCare at Home
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
              Your trusted partner for comprehensive home healthcare services in India — doctor at home, lab tests at home,
              nursing care at home, elder care services, diagnostic services at home, physiotherapy at home,
              preventive health checkups, and corporate wellness programs.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
