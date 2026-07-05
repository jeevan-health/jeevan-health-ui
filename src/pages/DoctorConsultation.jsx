import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star, Heart, Shield, Clock, ChatCircle, CheckCircle, User,
  Phone, ArrowRight, CaretRight, CaretDown, Sparkle, Globe, ChartBar,
} from '@phosphor-icons/react';

const testimonials = [
  { name: 'Aarohi', text: 'The consultation was extremely helpful. The doctor provided a detailed diet plan that was easy to follow.' },
  { name: 'Ronak', text: 'Very smooth experience. I was able to consult a doctor from home without any hassle.' },
  { name: 'Aarzoo', text: 'I was skeptical at first, but the doctor was very professional and supportive.' },
  { name: 'Yash', text: 'The doctor explained everything clearly and helped me understand my condition better.' },
  { name: 'Rahul', text: 'Fast, convenient, and cost-effective. Much better than visiting a clinic.' },
];

const whyItems = [
  { icon: Shield, title: '100% Confidential Healthcare', desc: 'All consultations are private and securely handled with strict confidentiality.' },
  { icon: User, title: 'Certified Doctors', desc: 'We connect you only with verified and experienced medical professionals.' },
  { icon: Globe, title: 'Convenience Anytime, Anywhere', desc: 'No queues, no travel — consult doctors from home, office, or anywhere.' },
  { icon: Star, title: 'Affordable Online Healthcare', desc: 'Online doctor consultation starting from just ₹199.' },
];

const faqs = [
  { q: 'When will I get a response from the doctor?', a: 'Most consultations are answered within 30 minutes.' },
  { q: 'Will I get a prescription?', a: 'Yes, you will receive a valid digital prescription after consultation.' },
  { q: 'Is my consultation private?', a: 'Yes, all consultations are completely confidential and secure.' },
  { q: 'Can I follow up with the same doctor?', a: 'Yes, free follow-up consultation is available for 3 days.' },
  { q: 'What if I don\'t get a response?', a: 'Our support team ensures your query is resolved or refunded as per policy.' },
];

export default function DoctorConsultation() {
  const [openFaq, setOpenFaq] = useState(null);

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
            <Heart size={34} weight="fill" color="#00FFFF" />
          </div>
          <h1 style={{ color: '#fff', fontSize: 32, marginBottom: 10 }}>
            Online Doctor Consultation at Home
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}>
            Get fast, reliable, and affordable online doctor consultation in India with certified and experienced doctors
            from Jeevan HealthCare at Home. Consult doctors anytime from the comfort of your home and receive a valid
            digital prescription within minutes.
          </p>
          <Link to="/book-appointment" className="btn-primary" style={{
            marginTop: 24, background: '#00FFFF', color: '#083d86', fontSize: 16, padding: '14px 36px', fontWeight: 700,
          }}>
            Consult Now <ArrowRight size={18} weight="bold" />
          </Link>
        </div>
      </div>

      <section className="page-section" style={{ paddingBottom: 0 }}>
        <div className="container">

          {/* Care Plan */}
          <div style={{
            background: 'linear-gradient(135deg, #00FFFF, #b9f6fc)',
            borderRadius: 'var(--radius-lg)', padding: '36px 32px',
            marginBottom: 36, color: '#083d86',
          }}>
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Sparkle size={24} weight="fill" color="#0B4FA8" /> Care Plan Membership – Better Healthcare, Better Savings
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
              <Star size={16} weight="fill" style={{ verticalAlign: 'middle', marginRight: 6 }} />
              Join Care Plan & Unlock Premium Healthcare Benefits
            </p>
            <p style={{ fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
              Become a Care Plan member and enjoy exclusive benefits designed for affordable and continuous healthcare support:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10, marginBottom: 20 }}>
              {[
                'Free or discounted doctor consultations',
                'Priority access to doctors',
                'Free follow-up consultation for 3 days',
                'Faster prescription processing',
                'Priority chat with medical experts',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                  <CheckCircle size={18} weight="fill" color="#0B4FA8" style={{ flexShrink: 0 }} /> {item}
                </div>
              ))}
            </div>
            <Link to="/book-appointment" className="btn-primary" style={{ background: '#0B4FA8', color: '#fff', padding: '12px 28px' }}>
              Join Care Plan Now <ArrowRight size={16} weight="bold" />
            </Link>
          </div>

          {/* Online Consultation */}
          <div style={{
            background: '#fff', borderRadius: 'var(--radius-lg)',
            padding: '36px 32px', border: '1px solid var(--border)', marginBottom: 36,
          }}>
            <h2 style={{ fontSize: 22, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Heart size={22} weight="fill" color="#0B4FA8" /> Online Doctor Consultation in India
            </h2>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#0B4FA8', marginBottom: 12 }}>
              Starting at just ₹199
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-body)', marginBottom: 20, lineHeight: 1.6 }}>
              Connect with certified doctors online within 30 minutes for medical advice, diagnosis, and treatment guidance.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 20 }}>
              {[
                { icon: Clock, text: 'Consultation within 30 minutes' },
                { icon: ArrowRight, text: 'Free follow-up for 3 days' },
                { icon: CheckCircle, text: 'Valid digital prescription after consultation' },
                { icon: User, text: 'Experienced and verified doctors' },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: '#e8f0fe', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: '#0B4FA8', flexShrink: 0,
                  }}>
                    <item.icon size={18} weight="fill" />
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
            <Link to="/book-appointment" className="btn-primary" style={{ padding: '12px 28px' }}>
              Consult Now <ArrowRight size={16} weight="bold" />
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 36,
          }}>
            {[
              { icon: User, value: '30L+', label: 'Total Consultations Completed' },
              { icon: ChartBar, value: '3,000+', label: 'Daily Online Consultations' },
              { icon: Heart, value: '22+', label: 'Medical Specialities Available' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: '#fff', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)', padding: '24px 16px', textAlign: 'center',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: '#e8f0fe', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px', color: '#0B4FA8',
                }}>
                  <stat.icon size={26} weight="fill" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#0B4FA8', marginBottom: 4 }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text-light)' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 22, marginBottom: 20, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Heart size={22} weight="fill" color="#0B4FA8" /> What Our Patients Say
            </h2>
            <div className="scroll-row" style={{ justifyContent: 'center' }}>
              {testimonials.map(t => (
                <div key={t.name} className="blog-card" style={{ width: 280, textAlign: 'center', padding: '24px 20px' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: '#e8f0fe', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 10px', color: '#0B4FA8', fontSize: 18, fontWeight: 700,
                  }}>
                    {t.name.charAt(0)}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0B4FA8', marginBottom: 4 }}>{t.name}</div>
                  <p style={{ fontSize: 13, color: 'var(--text-light)', lineHeight: 1.5 }}>"{t.text}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose */}
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 22, marginBottom: 20, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Shield size={22} weight="fill" color="#0B4FA8" /> Why Choose Jeevan HealthCare Online Consultation?
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {whyItems.map(item => (
                <div key={item.title} className="info-card" style={{ textAlign: 'center', padding: 24 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: '#e8f0fe', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px', color: '#0B4FA8',
                  }}>
                    <item.icon size={26} weight="fill" />
                  </div>
                  <h3 style={{ fontSize: 14, marginBottom: 6 }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-light)', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, marginBottom: 20, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <ChatCircle size={22} weight="fill" color="#0B4FA8" /> Frequently Asked Questions
            </h2>
            <div style={{ maxWidth: 700, margin: '0 auto' }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{
                  background: '#fff', borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)', marginBottom: 8, overflow: 'hidden',
                }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                    width: '100%', padding: '14px 18px', textAlign: 'left', fontSize: 14,
                    fontWeight: 600, color: 'var(--text-dark)', background: 'none',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    {faq.q}
                    <CaretDown size={14} weight="bold" style={{
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.2s', flexShrink: 0, color: '#0B4FA8',
                    }} />
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 18px 14px', fontSize: 13, color: '#666', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Join Doctor Network */}
          <div style={{
            background: '#fff', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)', padding: '36px 32px',
            textAlign: 'center',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: '#e8f0fe', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px', color: '#0B4FA8',
            }}>
              <User size={30} weight="fill" />
            </div>
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>Join Our Doctor Network</h2>
            <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 20, maxWidth: 500, margin: '0 auto 20px', lineHeight: 1.6 }}>
              Are you a doctor? Join Jeevan HealthCare at Home and provide online consultations to patients across India.
            </p>
            <a href="tel:+919700104108" className="btn-primary" style={{ padding: '12px 28px' }}>
              <Phone size={16} weight="fill" /> Join Now
            </a>
          </div>

        </div>
      </section>
    </>
  );
}
