import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import {
  therapists,
  physioPackages,
} from '../data/physiotherapyData';

const SEO_PAGES = {
  'physiotherapy-near-me': {
    title: 'Physiotherapy Near Me – Best Physiotherapists in Hyderabad',
    subtitle: 'Find expert physiotherapists near you in Hyderabad. Book a session at our clinic or get a home visit for personalized care.',
    focus: 'local',
    bodyPart: 'full',
  },
  'physiotherapist-at-home-hyderabad': {
    title: 'Physiotherapist at Home Hyderabad – Home Visit Physiotherapy',
    subtitle: 'Get a qualified physiotherapist at your home in Hyderabad. Full coverage across all areas including Gachibowli, Madhapur, Banjara Hills, Kukatpally, and more.',
    focus: 'home',
    bodyPart: 'full',
  },
  'best-physiotherapy-clinic': {
    title: 'Best Physiotherapy Clinic in Hyderabad – Expert Care',
    subtitle: 'Visit the best physiotherapy clinic in Hyderabad for expert diagnosis and hands-on treatment. State-of-the-art facilities and senior therapists.',
    focus: 'clinic',
    bodyPart: 'full',
  },
  'online-physiotherapy-consultation': {
    title: 'Online Physiotherapy Consultation – Video Session',
    subtitle: 'Consult a physiotherapist online via video call. Get diagnosis, exercise plans, and recovery tracking from the comfort of your home.',
    focus: 'online',
    bodyPart: 'full',
  },
  'physiotherapy-for-seniors': {
    title: 'Physiotherapy for Senior Citizens at Home',
    subtitle: 'Specialized physiotherapy for senior citizens at home in Hyderabad. Gentle exercises, fall prevention, and mobility improvement for elderly care.',
    focus: 'geriatric',
    bodyPart: 'full',
  },
  'sports-injury-rehabilitation': {
    title: 'Sports Injury Rehabilitation – Get Back to Game',
    subtitle: 'Return to your sport faster with expert sports injury rehabilitation. ACL recovery, muscle tears, ligament injuries treated by sports physio specialists.',
    focus: 'sports',
    bodyPart: 'full',
  },
  'physiotherapy-cost-hyderabad': {
    title: 'Physiotherapy Cost in Hyderabad – Affordable Packages',
    subtitle: 'Transparent physiotherapy cost in Hyderabad starting from ₹2,499. Affordable packages with no hidden charges. Book your session today.',
    focus: 'pricing',
    bodyPart: 'full',
  },
  'physiotherapy-for-diabetes': {
    title: 'Physiotherapy for Diabetes Management – Lifestyle Care',
    subtitle: 'Manage diabetes with regular physiotherapy. Exercise programs designed to improve insulin sensitivity, circulation, and overall wellness.',
    focus: 'lifestyle',
    bodyPart: 'full',
  },
  'home-physiotherapy-service': {
    title: 'Home Physiotherapy Service – Therapist at Your Doorstep',
    subtitle: 'Professional home physiotherapy service across Hyderabad. Our therapist brings equipment and provides full treatment at your doorstep.',
    focus: 'home',
    bodyPart: 'full',
  },
  'physiotherapy-clinic-near-me': {
    title: 'Physiotherapy Clinic Near Me – Book Appointment',
    subtitle: 'Find a physiotherapy clinic near you in Hyderabad. Book an appointment with experienced therapists for back pain, knee pain, and more.',
    focus: 'local',
    bodyPart: 'full',
  },
};

const _SLUGS = Object.keys(SEO_PAGES);

const WHY_CHOOSE = {
  local: [
    { icon: '📍', title: 'prime.locations', desc: 'Conveniently located clinics across Hyderabad in Madhapur, Kukatpally, Banjara Hills & more' },
    { icon: '🏃', title: 'walkin.welcome', desc: 'Walk-ins welcome — no appointment needed for initial consultation' },
    { icon: '🧑‍⚕️', title: 'expert.therapists', desc: 'Senior physiotherapists with 6+ years of experience in orthopedic & sports rehab' },
    { icon: '⭐', title: 'proven.results', desc: 'Trusted by 5000+ patients across Hyderabad for recovery and pain relief' },
  ],
  home: [
    { icon: '🏠', title: 'doorstep.service', desc: 'Full physiotherapy setup delivered to your home — no travel needed' },
    { icon: '🗺️', title: 'wide.coverage', desc: 'Serving all major Hyderabad areas — Gachibowli, Madhapur, Secunderabad, LB Nagar & more' },
    { icon: '⏰', title: 'flexible.timing', desc: 'Early morning and evening home visits available for working professionals' },
    { icon: '👨‍👩‍👧‍👦', title: 'family.training', desc: 'We train family members to assist with exercises between sessions' },
  ],
  clinic: [
    { icon: '🏥', title: 'modern.clinic', desc: 'Well-equipped clinic with advanced therapy equipment and private treatment rooms' },
    { icon: '🩺', title: 'expert.doctors', desc: 'Senior MPT-qualified physiotheologists with multi-specialty expertise' },
    { icon: '📊', title: 'digital.tracking', desc: 'Digital progress tracking with regular assessments and outcome reports' },
    { icon: '🅿️', title: 'free.parking', desc: 'Ample free parking available — easy access for all patients' },
  ],
  online: [
    { icon: '💻', title: 'video.consult', desc: 'HD video consultations from anywhere — no travel, no waiting rooms' },
    { icon: '📱', title: 'digital.exercise', desc: 'Personalized exercise plans delivered via app with video demonstrations' },
    { icon: '📈', title: 'progress.tracking', desc: 'Track your pain scores, mobility progress, and exercise adherence digitally' },
    { icon: '🔄', title: 'easy.followup', desc: 'Quick follow-up sessions — 15-minute check-ins to keep recovery on track' },
  ],
  geriatric: [
    { icon: '👴', title: 'gentle.care', desc: 'Age-friendly therapy with gentle techniques suitable for senior citizens' },
    { icon: '🏠', title: 'home.comfort', desc: 'Treatment in familiar home environment reduces stress for elderly patients' },
    { icon: '🛡️', title: 'fall.prevention', desc: 'Specialized fall prevention programs to keep seniors safe and independent' },
    { icon: '❤️', title: 'compassionate', desc: 'Our therapists are trained in geriatric care with patience and empathy' },
  ],
  sports: [
    { icon: '⚽', title: 'sports.specialists', desc: 'Sports medicine specialists who understand athlete recovery needs' },
    { icon: '🏋️', title: 'return.to.play', desc: 'Structured return-to-play protocols to prevent re-injury' },
    { icon: '📋', title: 'performance.test', desc: 'Objective performance testing to track readiness for competition' },
    { icon: '🧊', title: 'modern.modalities', desc: 'Advanced modalities including laser therapy, ultrasound, and dry needling' },
  ],
  pricing: [
    { icon: '💰', title: 'transparent.price', desc: 'No hidden charges — what you see is what you pay' },
    { icon: '📦', title: 'flexible.packages', desc: 'Choose from 4 packages starting at ₹2,499 to suit your recovery needs' },
    { icon: '📉', title: 'save.more', desc: 'Save up to ₹3,000 with our popular package bundles' },
    { icon: '🔄', title: 'money.back', desc: 'Satisfaction guaranteed — switch packages anytime if your needs change' },
  ],
  lifestyle: [
    { icon: '🧘', title: 'holistic.approach', desc: 'Integrated approach combining exercise, breathing techniques, and lifestyle guidance' },
    { icon: '🩸', title: 'diabetes.care', desc: 'Exercise programs designed to improve insulin sensitivity and glucose control' },
    { icon: '🚶', title: 'walking.program', desc: 'Structured walking and mobility programs for daily fitness' },
    { icon: '📊', title: 'health.monitoring', desc: 'Regular health assessments to track improvements in key wellness markers' },
  ],
};

const _STEP_ICONS = ['🩺', '📅', '🏠', '💪'];

const FAQS = {
  'physiotherapy-near-me': [
    { q: 'How do I find a physiotherapist near me in Hyderabad?', a: 'Use Jeevan Healthcare to find the best physiotherapists near you in Hyderabad. Simply search for your area and book a session at our clinic or opt for a home visit.' },
    { q: 'Is physiotherapy available on weekends near me?', a: 'Yes, we have weekend appointments available at all our clinic locations across Hyderabad. You can also book home visits on Saturdays.' },
    { q: 'How much does physiotherapy cost near me?', a: 'Physiotherapy sessions start at just ₹449 per session. Our packages begin from ₹2,499 for 5 sessions, making quality care affordable.' },
    { q: 'Can I get a same-day physiotherapy appointment near me?', a: 'Yes, we offer same-day appointments at most of our clinics in Hyderabad. Book online and get confirmed slot within minutes.' },
  ],
  'physiotherapist-at-home-hyderabad': [
    { q: 'Which areas of Hyderabad do you cover for home physiotherapy?', a: 'We cover all major areas including Gachibowli, Madhapur, Hitech City, Kukatpally, Banjara Hills, Jubilee Hills, Secunderabad, LB Nagar, Miyapur, and more.' },
    { q: 'How quickly can I get a physiotherapist at home?', a: 'We can schedule a home visit within 24 hours. Same-day visits are also available depending on therapist availability in your area.' },
    { q: 'Do I need any equipment for home physiotherapy?', a: 'No, our therapists bring all necessary equipment including therapy bands, balls, and portable modalities for your session at home.' },
    { q: 'Is home physiotherapy safe for elderly patients?', a: 'Absolutely. Our therapists are trained in geriatric care and ensure a safe, comfortable environment for senior citizens at home.' },
  ],
  'best-physiotherapy-clinic': [
    { q: 'What makes your physiotherapy clinic the best in Hyderabad?', a: 'Our clinic features senior MPT-qualified therapists, advanced equipment, digital progress tracking, and a proven track record of 5000+ happy patients.' },
    { q: 'Where is your physiotherapy clinic located in Hyderabad?', a: 'Our primary clinic is in Madhapur, with additional locations in Kukatpally and Banjara Hills. All clinics are easily accessible by public transport.' },
    { q: 'What conditions do you treat at your clinic?', a: 'We treat back pain, neck pain, knee pain, sports injuries, post-surgery rehabilitation, neurological conditions, arthritis, and more.' },
    { q: 'Do I need a doctor referral to visit your clinic?', a: 'No, you can directly book an appointment. We also accept referrals from orthopedic doctors, neurologists, and general physicians.' },
  ],
  'online-physiotherapy-consultation': [
    { q: 'How does an online physiotherapy consultation work?', a: 'You join a video call with a physiotherapist who assesses your condition through movement analysis, discusses symptoms, and creates a personalized exercise plan.' },
    { q: 'Is online physiotherapy as effective as in-person?', a: 'Online physiotherapy is highly effective for exercise prescription, posture correction, and progress monitoring. For hands-on manual therapy, we recommend a clinic visit.' },
    { q: 'What do I need for an online physio session?', a: 'A smartphone or laptop with a camera, stable internet connection, and a quiet space where you can move freely without distractions.' },
    { q: 'Can I get a follow-up online after a clinic visit?', a: 'Yes, many patients combine clinic visits with online follow-ups for cost-effective, continuous care and progress monitoring.' },
  ],
  'physiotherapy-for-seniors': [
    { q: 'Is physiotherapy safe for 70+ year-olds?', a: 'Yes, our geriatric physiotherapy is specially designed for seniors with gentle techniques, slower progression, and fall prevention focus.' },
    { q: 'Can bedridden seniors get physiotherapy at home?', a: 'Yes, we provide bedside physiotherapy for bedridden patients including passive exercises, positioning, and breathing exercises to prevent complications.' },
    { q: 'How can physiotherapy help with fall prevention?', a: 'Our programs include balance training, strength exercises for legs, gait training, and home safety assessments to significantly reduce fall risk.' },
    { q: 'Does physiotherapy help with arthritis pain in seniors?', a: 'Yes, physiotherapy is highly effective for arthritis management through joint mobilization, strengthening exercises, and pain relief modalities.' },
  ],
  'sports-injury-rehabilitation': [
    { q: 'How long does sports injury rehabilitation take?', a: 'Recovery depends on the injury severity. Minor injuries may take 2-4 weeks, while ACL recovery or major surgeries need 3-6 months of structured rehab.' },
    { q: 'Can you help with ACL recovery without surgery?', a: 'Yes, we offer non-surgical ACL rehabilitation programs focusing on strengthening, proprioception training, and functional recovery.' },
    { q: 'Do you treat running injuries?', a: 'Yes, we treat runner\'s knee, shin splints, plantar fasciitis, IT band syndrome, and other common running injuries with sport-specific rehabilitation.' },
    { q: 'What sports do your therapists specialize in?', a: 'Our therapists have experience with cricket, football, badminton, tennis, running, swimming, weightlifting, and martial arts athletes.' },
  ],
  'physiotherapy-cost-hyderabad': [
    { q: 'What is the cost of a single physiotherapy session in Hyderabad?', a: 'A single session costs ₹449-₹699 depending on the package chosen. Higher-value packages bring the per-session cost down significantly.' },
    { q: 'Are there any hidden charges in your packages?', a: 'No, all our packages are all-inclusive with no hidden charges. The listed price covers assessment, therapy sessions, and exercise plans.' },
    { q: 'Do you offer EMI or installment payment options?', a: 'Yes, we offer flexible payment options for our premium packages. Contact our team for EMI options available through partner services.' },
    { q: 'Is home visit physiotherapy more expensive?', a: 'Home visits are available at the same package rates across most Hyderabad areas. Travel charges may apply for far-out locations.' },
  ],
  'physiotherapy-for-diabetes': [
    { q: 'How does physiotherapy help with diabetes management?', a: 'Regular exercise improves insulin sensitivity, helps control blood sugar levels, improves circulation, and aids weight management — all crucial for diabetes care.' },
    { q: 'What exercises are recommended for diabetic patients?', a: 'We recommend a mix of aerobic exercises, resistance training, flexibility work, and balance exercises — all tailored to your fitness level.' },
    { q: 'Can physiotherapy prevent diabetic complications?', a: 'Yes, regular physiotherapy can help prevent neuropathy, improve foot health, maintain joint mobility, and reduce cardiovascular risks associated with diabetes.' },
    { q: 'Do I need to check my blood sugar before sessions?', a: 'We recommend checking blood sugar before exercise. Our therapists are trained to recognize and manage hypoglycemia during sessions.' },
  ],
  'home-physiotherapy-service': [
    { q: 'What does a home physiotherapy service include?', a: 'Full assessment, hands-on manual therapy, therapeutic exercises, pain management modalities, and a customized home exercise program.' },
    { q: 'Do I need to provide any space or setup?', a: 'Just a clean space with room for a mat. Our therapist brings all equipment including portable ultrasound, TENS, therapy bands, and assessment tools.' },
    { q: 'Can I book a single home visit or do I need a package?', a: 'You can book a single session or choose from our packages for better value. Single sessions are ₹649 for home visits.' },
    { q: 'Is home physiotherapy covered by insurance?', a: 'Many health insurance plans cover physiotherapy. We provide detailed invoices and reports that you can submit for insurance claims.' },
  ],
  'physiotherapy-clinic-near-me': [
    { q: 'How do I find a good physiotherapy clinic near me?', a: 'Look for clinics with qualified MPT therapists, good patient reviews, and modern equipment. Jeevan Healthcare clinics meet all these criteria.' },
    { q: 'What should I bring to my first clinic appointment?', a: 'Bring any medical reports, previous scan reports (X-ray, MRI), list of medications, and wear loose comfortable clothing.' },
    { q: 'How long is a clinic physiotherapy session?', a: 'Initial assessment sessions are 45-60 minutes. Follow-up sessions are typically 30-45 minutes depending on your treatment plan.' },
    { q: 'Can I switch to home visits if I cannot come to the clinic?', a: 'Yes, we offer flexible switching between clinic and home visits. Just inform our team and we will arrange a therapist for your area.' },
  ],
};

const COLORS = {
  heroFrom: '#0D9488',
  heroTo: '#14B8A6',
  heroMid: '#2DD4BF',
  accent: '#F59E0B',
  accentHover: '#D97706',
  primary: '#0D9488',
  primaryLight: '#CCFBF1',
  bg: '#F0FDFA',
  text: '#0F172A',
  textMuted: '#64748B',
};

function getFilteredTherapists(focus) {
  const modeMap = {
    local: ['clinic', 'home'],
    home: ['home'],
    clinic: ['clinic'],
    online: ['online'],
    geriatric: ['home', 'clinic'],
    sports: ['clinic', 'online'],
    pricing: ['clinic', 'home', 'online'],
    lifestyle: ['home', 'online'],
  };
  const allowedModes = modeMap[focus] || ['home', 'clinic', 'online'];
  return therapists.filter(th => th.mode.some(m => allowedModes.includes(m))).slice(0, 3);
}

export default function PhysioSeoLanding() {
  const t = useT();
  const { slug } = useParams();
  const page = SEO_PAGES[slug];
  const [expandedFaq, setExpandedFaq] = useState(null);

  if (!page) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🔍</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px', color: '#0F172A' }}>
            {t('physio.seo.notfound', 'Page Not Found')}
          </h1>
          <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 20px' }}>
            {t('physio.seo.notfound.desc', 'The physiotherapy service page you are looking for does not exist.')}
          </p>
          <Link to="/physiotherapy" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 24px', background: '#0D9488', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>
            ← {t('back.to.physiotherapy', 'Back to Physiotherapy')}
          </Link>
        </div>
      </div>
    );
  }

  const features = WHY_CHOOSE[page.focus] || WHY_CHOOSE.local;
  const faqs = FAQS[slug] || [];
  const filteredTherapists = getFilteredTherapists(page.focus);

  return (
    <div>
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Jeevan HealthCare',
          description: `Best physiotherapy services in Hyderabad — ${SEO_PAGES[slug].subtitle}`,
          url: `https://jeevanhealthcare.com/physiotherapy/seo/${slug}`,
          telephone: '+919700104108',
          areaServed: 'Hyderabad',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Hyderabad',
            addressCountry: 'IN',
          },
          medicalSpecialty: 'Physiotherapy',
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '1240',
          },
        })}
      </script>

      <div style={{ background: `linear-gradient(135deg, ${COLORS.heroFrom} 0%, ${COLORS.heroMid} 50%, ${COLORS.heroTo} 100%)`, padding: '40px 0 48px', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/physiotherapy" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
            ← {t('back.to.physiotherapy', 'Back to Physiotherapy')}
          </Link>
          <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.15 }}>
            {t(`physio.seo.${slug}.title`, page.title)}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: '0 0 16px', maxWidth: 600, lineHeight: 1.5 }}>
            {t(`physio.seo.${slug}.subtitle`, page.subtitle)}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {[
              t('certified.physiotherapists', 'Certified Physiotherapists'),
              t('home.visit.available', 'Home Visit Available'),
              t('happy.patients', '5000+ Happy Patients'),
            ].map(b => (
              <span key={b} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: 20 }}>
                <span style={{ color: '#22C55E', fontSize: 12 }}>✓</span> {b}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/physiotherapy/book?source=google" style={{ background: COLORS.accent, border: 'none', color: '#fff', height: 48, padding: '0 28px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {t('book.session', 'Book Session')} →
            </Link>
            <a href="tel:+919700104108" style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)', color: '#fff', height: 48, padding: '0 28px', fontSize: 16, fontWeight: 600, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {t('call.now', 'Call Now')} 📞
            </a>
          </div>
        </div>
      </div>

      <div className="page-section container">
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>
          {t('why.choose.us', 'Why Choose Us')}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
          {features.map(f => (
            <div key={f.title} style={{ textAlign: 'center', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{f.icon}</div>
              <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{t(`physio.seo.${slug}.feature.${f.title}`, f.title.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))}</h3>
              <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.4 }}>{t(`physio.seo.${slug}.feature.${f.title}.desc`, f.desc)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="page-section" style={{ background: COLORS.bg }}>
        <div className="container">
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, textAlign: 'center' }}>
            {t('how.it.works', 'How It Works')}
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            {[
              { icon: '🩺', title: t('select.condition', 'Select Condition'), desc: t('choose.your.condition.seo', 'Choose your condition and preferred mode of therapy') },
              { icon: '📅', title: t('book.appointment', 'Book Appointment'), desc: t('pick.date.time', 'Pick a convenient date and time for your session') },
              { icon: '🏠', title: t('visit.or.consult', 'Visit or Consult'), desc: t('meet.therapist', 'Meet your therapist at clinic, home, or online') },
              { icon: '💪', title: t('recover.thrive', 'Recover & Thrive'), desc: t('follow.plan.recover', 'Follow your personalized plan and get back to life') },
            ].map((s, i) => (
              <div key={s.title} style={{ textAlign: 'center', padding: 20, background: '#fff', borderRadius: 14, flex: '1 1 160px', maxWidth: 200, position: 'relative' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: COLORS.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, margin: '0 auto 10px' }}>{i + 1}</div>
                <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{s.title}</h3>
                <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.4 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {filteredTherapists.length > 0 && (
        <div className="page-section container">
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
            {t('our.expert.therapists', 'Our Expert Therapists')}
          </h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>
            {t('meet.our.specialists', 'Meet our experienced and qualified physiotherapists')}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
            {filteredTherapists.map(th => (
              <div key={th.id} style={{ padding: 16, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: COLORS.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{th.image}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{th.name}</div>
                    <div style={{ fontSize: 11, color: COLORS.primary, fontWeight: 600 }}>{th.qualifications}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ color: '#F59E0B', fontSize: 13 }}>★</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{th.rating}</span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>({th.sessions} sessions)</span>
                  <span style={{ fontSize: 11, color: '#059669', fontWeight: 600, marginLeft: 'auto' }}>{th.experience} yrs</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 8 }}>
                  {th.specialties.slice(0, 3).map(s => (
                    <span key={s} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: COLORS.primaryLight, color: COLORS.primary, fontWeight: 600 }}>{s}</span>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: '#059669', fontWeight: 600, marginBottom: 10 }}>
                  {th.availability.join(' • ')}
                </div>
                <Link to="/physiotherapy/book?source=google" style={{ display: 'block', textAlign: 'center', height: 36, lineHeight: '36px', borderRadius: 8, background: COLORS.primary, color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                  {t('book.session', 'Book Session')} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="page-section" style={{ background: COLORS.bg }}>
        <div className="container">
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>
            {t('physio.packages', 'Physiotherapy Packages')}
          </h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px', textAlign: 'center' }}>
            {t('packages.subtitle', 'Choose a plan that suits your recovery needs')}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {physioPackages.map(pkg => (
              <div key={pkg.id} style={{ padding: 20, borderRadius: 14, border: pkg.popular ? `2px solid ${COLORS.primary}` : '1px solid #e2e8f0', background: '#fff', position: 'relative' }}>
                {pkg.popular && (
                  <div style={{ position: 'absolute', top: 10, right: 10, background: COLORS.accent, color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>
                    {t('popular', 'POPULAR')}
                  </div>
                )}
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{pkg.name}</h3>
                {pkg.isMonthly ? (
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontWeight: 800, color: '#059669', fontSize: 22 }}>₹{pkg.price}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>/month</span>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}><s>₹{pkg.originalPrice}</s> <span style={{ color: '#dc2626', fontWeight: 600 }}>Save ₹{pkg.originalPrice - pkg.price}</span></div>
                  </div>
                ) : (
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontWeight: 800, color: '#059669', fontSize: 22 }}>₹{pkg.price}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>/{pkg.sessions} sessions</span>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}><s>₹{pkg.originalPrice}</s> <span style={{ color: '#dc2626', fontWeight: 600 }}>Save ₹{pkg.originalPrice - pkg.price}</span></div>
                  </div>
                )}
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 11, color: '#475569', marginBottom: 14, lineHeight: 1.8 }}>
                  {pkg.includes.map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: '#22C55E', fontSize: 12 }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
                <Link to={`/physiotherapy/book?package=${pkg.id}&source=google`} style={{ display: 'block', textAlign: 'center', height: 38, lineHeight: '38px', borderRadius: 8, background: pkg.popular ? COLORS.accent : COLORS.primary, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  {t('book.now')}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {faqs.length > 0 && (
        <div className="page-section container" style={{ maxWidth: 700 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>
            {t('faq.heading', 'Frequently Asked Questions')}
          </h2>
          <div style={{ display: 'grid', gap: 8 }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ borderRadius: 10, border: '1px solid #e2e8f0', overflow: 'hidden', background: '#fff' }}>
                <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, fontFamily: 'inherit', textAlign: 'left' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', flex: 1 }}>{t(`physio.seo.${slug}.faq.q${i}`, f.q)}</span>
                  <span style={{ fontSize: 16, color: '#94a3b8', transition: 'transform 0.2s', transform: expandedFaq === i ? 'rotate(180deg)' : 'none' }}>▼</span>
                </button>
                {expandedFaq === i && (
                  <div style={{ padding: '0 16px 12px', fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{t(`physio.seo.${slug}.faq.a${i}`, f.a)}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="page-section" style={{ background: `linear-gradient(135deg, ${COLORS.heroFrom}, ${COLORS.heroMid})`, textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
            {t('ready.to.start', 'Ready to Start?')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 16 }}>
            {t('book.session.recover', 'Book your session today and take the first step toward recovery')}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/physiotherapy/book?source=google" style={{ background: COLORS.accent, border: 'none', color: '#fff', height: 48, padding: '0 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {t('book.session', 'Book Session')} →
            </Link>
            <a href="https://wa.me/919700104108?text=Hi%2C%20I%20want%20to%20know%20more%20about%20${slug}" target="_blank" rel="noopener noreferrer" style={{ background: '#25d366', border: 'none', color: '#fff', height: 48, padding: '0 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {t('whatsapp', 'WhatsApp')}
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .v-hero-title { font-size: 28px !important; }
        }
      `}</style>
    </div>
  );
}
