import { Link } from 'react-router-dom';
import {
  Pill, Stethoscope, Flask, Shield, Heart, Monitor,
  Baby, User, Syringe, FirstAidKit, Clock,
} from '@phosphor-icons/react';

const services = [
  { icon: Pill, title: 'Buy Medicines & Essentials', tag: '2HRS DELIVERY', path: '/pharmacy' },
  { icon: Stethoscope, title: 'Doctor Appointment', tag: 'BOOK NOW', path: '/doctor-consultation' },
  { icon: Flask, title: 'Lab Tests', tag: 'AT HOME', path: '/diagnostics' },
  { icon: Shield, title: 'Health Insurance', tag: 'EXPLORE PLANS', path: '/services' },
];

const categories = [
  { icon: Heart, label: 'Health Monitors' },
  { icon: Baby, label: 'Baby Care' },
  { icon: FirstAidKit, label: 'Pain Relief' },
  { icon: Heart, label: 'Diabetes Care' },
  { icon: Pill, label: 'Nutrition' },
  { icon: Monitor, label: 'Medical Supplies' },
  { icon: Syringe, label: 'Immunity Boosters' },
  { icon: User, label: 'Personal Care' },
  { icon: Shield, label: 'Vitamins & Minerals' },
  { icon: Heart, label: 'Wellness' },
  { icon: Baby, label: 'Mother Care' },
  { icon: Monitor, label: 'Health Devices' },
];

const topTests = [
  { name: 'CBC Test (Complete Blood Count)', tests: '30 Tests Included', price: 469, oldPrice: 1173, discount: '60% off' },
  { name: 'HbA1c Test (Hemoglobin A1c)', tests: '3 Tests Included', price: 709, oldPrice: 1772, discount: '60% off', guarantee: '10-Hour Report' },
  { name: 'FBS (Fasting Blood Sugar)', tests: '1 Test Included', price: 109, oldPrice: 272, discount: '60% off', guarantee: '10-Hour Report' },
  { name: 'Lipid Profile Test', tests: '8 Tests Included', price: 919, oldPrice: 2298, discount: '60% off', guarantee: '10-Hour Report' },
  { name: 'Thyroid Profile (T3 T4 TSH)', tests: '3 Tests Included', price: 499, oldPrice: 1247, discount: '60% off' },
  { name: 'Vitamin D 25-Hydroxy', tests: '1 Test Included', price: 899, oldPrice: 2247, discount: '60% off' },
  { name: 'Liver Function Test (LFT)', tests: '11 Tests Included', price: 919, oldPrice: 2298, discount: '60% off' },
  { name: 'Urine Routine Test', tests: '17 Tests Included', price: 359, oldPrice: 897, discount: '60% off' },
];

const blogs = [
  { title: 'Testing Pregnancy At Home? Here\'s Everything About Pregnancy Test Kits', date: '08.06.26', author: 'Jeevan HealthCare' },
  { title: 'What are the best sources of probiotics for diabetics?', date: '30.05.26', author: 'Jeevan HealthCare' },
  { title: 'Can Diabetes Be Diagnosed Without Symptoms?', date: '24.05.26', author: 'Jeevan HealthCare' },
  { title: 'How To Bring Down The HbA1c Level?', date: '19.05.26', author: 'Jeevan HealthCare' },
  { title: 'Urea and Creatinine Test: Normal Range, Procedure, and Results', date: '16.05.26', author: 'Jeevan HealthCare' },
  { title: 'Hypothyroidism Diet: Foods To Eat And Avoid', date: '02.05.26', author: 'Jeevan HealthCare' },
];

export default function Home() {
  return (
    <>
      {/* Banner Carousel */}
      <section className="banner-carousel">
        <div className="banner-slide">
          <div style={{
            background: 'linear-gradient(135deg, #0A5EB0 0%, #1a7ad4 100%)',
            padding: '60px 40px', borderRadius: 'var(--radius-lg)',
            width: '100%', maxWidth: 1240, margin: '0 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 24,
          }}>
            <div style={{ color: '#fff', maxWidth: 500 }}>
              <h1 style={{ color: '#fff', fontSize: 32, marginBottom: 12 }}>
                Complete Healthcare<br />at Your Doorstep
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, marginBottom: 20 }}>
                Doctor consultations, medicine delivery, lab tests — all from home.
              </p>
              <Link to="/contact" className="btn-primary">
                Book Your Appointment
              </Link>
            </div>
            <img src="/logo.png" alt="Jeevan HealthCare" style={{ height: 120, opacity: 0.2, filter: 'brightness(0) invert(1)' }} />
          </div>
        </div>
      </section>

      {/* Service Grid */}
      <section className="section">
        <div className="container">
          <div className="service-grid">
            {services.map(s => (
              <Link key={s.title} to={s.path} className="service-card">
                <div className="icon"><s.icon size={32} weight="fill" /></div>
                <h3>{s.title}</h3>
                <p>{s.tag}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop By Category</h2>
            <span style={{ fontSize: 14, color: '#0A5EB0', fontWeight: 500 }}>View All</span>
          </div>
          <div className="scroll-row">
            {categories.map(cat => (
              <div key={cat.label} className="cat-card">
                <div className="icon"><cat.icon size={28} weight="fill" /></div>
                <span>{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Booked Tests */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Top Booked Tests</h2>
            <Link to="/diagnostics" className="section-link">View All</Link>
          </div>
          <div className="scroll-row">
            {topTests.map(test => (
              <div key={test.name} className="test-card">
                {test.guarantee && <div className="guarantee">{test.guarantee}</div>}
                <h4>{test.name}</h4>
                <div className="tests-count">{test.tests}</div>
                <div className="pricing">
                  <span className="price-current">₹{test.price}</span>
                  <span className="price-old">₹{test.oldPrice}</span>
                  <span className="discount">{test.discount}</span>
                </div>
                <button className="add-btn">Add</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banners */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #ff6b35, #ff8f5e)', borderRadius: 'var(--radius-lg)',
            padding: '40px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 20,
          }}>
            <div style={{ color: '#fff' }}>
              <h2 style={{ color: '#fff', fontSize: 24, marginBottom: 8 }}>Circle Membership</h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>Premium healthcare program with exclusive benefits</p>
            </div>
            <Link to="/contact" className="btn-primary" style={{ background: '#fff', color: '#ff6b35' }}>
              Know More
            </Link>
          </div>
        </div>
      </section>

      {/* Blogs */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Blogs & Articles</h2>
            <span style={{ fontSize: 14, color: '#0A5EB0', fontWeight: 500 }}>View All</span>
          </div>
          <div className="scroll-row">
            {blogs.map(blog => (
              <div key={blog.title} className="blog-card">
                <div className="meta">{blog.author} — {blog.date}</div>
                <h4>{blog.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
