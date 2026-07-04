import { Link } from 'react-router-dom';
import { Pill, Clock, Shield, Truck, Phone, Clipboard } from '@phosphor-icons/react';

export default function Pharmacy() {
  return (
    <section className="page-section">
      <div className="container">
        <h1>Medicine Delivery at Home</h1>
        <p>
          Order prescriptions and get medicines delivered to your doorstep in hours. We partner with licensed
          pharmacies to ensure safe, authentic, and timely delivery of all your medication needs.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20, margin: '40px 0' }}>
          {[
            { icon: Pill, title: 'Prescription Medicines', desc: 'All prescription and OTC medicines delivered from licensed pharmacies.' },
            { icon: Clock, title: 'Express Delivery', desc: 'Get your medicines delivered in as little as 2-4 hours in select areas.' },
            { icon: Clipboard, title: 'E-Prescriptions', desc: 'Upload your prescription and we\'ll verify and fulfill it promptly.' },
            { icon: Shield, title: 'Authentic Products', desc: '100% genuine medicines with batch verification and expiry tracking.' },
            { icon: Truck, title: 'Regular Subscriptions', desc: 'Set up monthly medicine subscriptions for chronic conditions.' },
            { icon: Phone, title: 'Order Tracking', desc: 'Real-time tracking of your order from placement to delivery.' },
          ].map(s => (
            <div key={s.title} className="service-card-mini">
              <div style={{ fontSize: 28, color: 'var(--royal-blue)', marginBottom: 8 }}><s.icon size={28} weight="fill" /></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link to="/contact" className="btn-primary"><Phone size={20} weight="fill" /> Order Medicines Now</Link>
        </div>
      </div>
    </section>
  );
}
