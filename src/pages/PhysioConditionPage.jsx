import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { physioCategories, therapists, physioPackages, STORAGE_KEYS } from '../data/physiotherapyData';

const C = {
  heroFrom: '#0D9488',
  heroTo: '#14B8A6',
  heroMid: '#2DD4BF',
  accent: '#F59E0B',
  primary: '#0D9488',
  primaryLight: '#CCFBF1',
  bg: '#F0FDFA',
};

const SLUG_MAP = {
  'back-pain-treatment': { type: 'condition', name: 'Back Pain', categoryId: 'orthopedic' },
  'knee-pain-physiotherapy': { type: 'condition', name: 'Knee Pain', categoryId: 'orthopedic' },
  'stroke-rehabilitation': { type: 'condition', name: 'Stroke Recovery', categoryId: 'neurological' },
  'post-surgery-physiotherapy': { type: 'category', categoryId: 'post-surgery' },
  'sports-physiotherapy': { type: 'category', categoryId: 'sports' },
  'elderly-physiotherapy': { type: 'category', categoryId: 'geriatric' },
  'physiotherapy-at-home': { type: 'category', categoryId: 'home' },
};

const THERAPIST_MAP = {
  'back-pain-treatment': [1, 3],
  'knee-pain-physiotherapy': [1, 3],
  'stroke-rehabilitation': [2],
  'post-surgery-physiotherapy': [1, 3],
  'sports-physiotherapy': [3, 1],
  'elderly-physiotherapy': [5, 1],
  'physiotherapy-at-home': [1, 2, 5],
};

const CONTENT = {
  'back-pain-treatment': {
    heroTitle: 'Back Pain Treatment at Home – Expert Physiotherapy in Hyderabad',
    heroSubtitle: 'Get relief from chronic back pain with specialized physiotherapy programs. Expert therapists provide personalized treatment for back pain relief, spinal mobility, and strength restoration at home.',
    steps: [
      { icon: '🩺', title: 'Comprehensive Assessment', desc: 'Physiotherapist evaluates your back pain through physical examination and movement analysis to identify the root cause.' },
      { icon: '💆', title: 'Manual Therapy & Mobilization', desc: 'Hands-on techniques to release muscle tension, improve spinal mobility, and reduce pain.' },
      { icon: '🏋️', title: 'Strengthening & Core Training', desc: 'Exercises to strengthen back muscles and core stability to prevent future pain episodes.' },
      { icon: '📋', title: 'Ongoing Progress Tracking', desc: 'Regular monitoring of pain levels and mobility improvements with exercise plan adjustments.' },
    ],
    benefits: [
      { icon: '✅', title: 'Pain Relief', desc: 'Significant reduction in chronic and acute back pain through targeted therapy.' },
      { icon: '🏃', title: 'Improved Mobility', desc: 'Regain freedom of movement for daily activities like bending, walking, and sitting.' },
      { icon: '💪', title: 'Core Strength', desc: 'Build a strong core to support your spine and prevent recurring back issues.' },
      { icon: '🧘', title: 'Better Posture', desc: 'Correct postural habits that contribute to back pain and spinal misalignment.' },
      { icon: '😴', title: 'Better Sleep', desc: 'Reduce nighttime pain for restful sleep and improved daily energy.' },
      { icon: '📈', title: 'Long-term Results', desc: 'Sustainable pain management strategies for lasting relief and prevention.' },
    ],
    faqs: [
      { q: 'How soon can I get relief from back pain with physiotherapy?', a: 'Most patients experience noticeable relief within 3-5 sessions. Chronic conditions may need 8-12 sessions for significant improvement.' },
      { q: 'Can physiotherapy cure chronic back pain permanently?', a: 'Physiotherapy addresses the root cause and provides long-term management. Many patients achieve permanent relief with consistent therapy.' },
      { q: 'Do I need a doctor prescription for back pain physiotherapy?', a: 'No prescription is needed for an initial assessment. Our therapists can evaluate and recommend a treatment plan.' },
      { q: 'Is home physiotherapy effective for back pain treatment?', a: 'Yes, home physiotherapy is highly effective. Therapists bring equipment and provide one-on-one attention in your home.' },
    ],
  },
  'knee-pain-physiotherapy': {
    heroTitle: 'Knee Pain Physiotherapy at Home – Best Treatment in Hyderabad',
    heroSubtitle: 'Overcome knee pain and regain mobility with expert physiotherapy. Customized programs focus on pain relief, joint mobility, and muscle strengthening for long-term knee health.',
    steps: [
      { icon: '🦵', title: 'Knee Assessment & Diagnosis', desc: 'Detailed evaluation of knee joint mobility, strength, and pain patterns to create a targeted plan.' },
      { icon: '🩻', title: 'Pain Management Techniques', desc: 'Therapeutic modalities to reduce knee inflammation and pain effectively.' },
      { icon: '🏋️', title: 'Muscle Strengthening', desc: 'Focused exercises for quadriceps, hamstrings, and calves to support the knee joint.' },
      { icon: '🚶', title: 'Gait & Mobility Training', desc: 'Walk pattern analysis and correction to reduce knee strain and improve movement.' },
    ],
    benefits: [
      { icon: '✅', title: 'Joint Pain Relief', desc: 'Reduce knee pain during walking, climbing stairs, and daily activities.' },
      { icon: '🦵', title: 'Improved Flexibility', desc: 'Restore full range of motion in your knee joint for better mobility.' },
      { icon: '💪', title: 'Leg Strength', desc: 'Build muscle support around the knee for stability and function.' },
      { icon: '🏃', title: 'Active Lifestyle', desc: 'Return to walking, jogging, and sports without knee discomfort.' },
      { icon: '🧘', title: 'Better Balance', desc: 'Improve balance and proprioception to prevent falls and injuries.' },
      { icon: '📈', title: 'Prevent Surgery', desc: 'Non-surgical treatment options that may help avoid or delay knee surgery.' },
    ],
    faqs: [
      { q: 'How many sessions are needed for knee pain relief?', a: 'Mild to moderate knee pain needs 6-10 sessions. Severe cases may require 12-15 sessions with maintenance exercises.' },
      { q: 'Can physiotherapy help avoid knee replacement surgery?', a: 'Yes, many patients manage knee pain through physiotherapy and avoid surgery. We focus on strengthening and mobility.' },
      { q: 'Is physiotherapy painful for knee conditions?', a: 'Therapy should not cause severe pain. Our therapists work within your comfort zone and progress gradually.' },
      { q: 'Do you treat post-ACL surgery patients at home?', a: 'Absolutely. Our post-surgery program covers ACL recovery including mobility training and strength building.' },
    ],
  },
  'stroke-rehabilitation': {
    heroTitle: 'Stroke Rehabilitation at Home – Neurological Physiotherapy in Hyderabad',
    heroSubtitle: 'Regain independence after a stroke with specialized neurological physiotherapy. Expert therapists provide compassionate, personalized rehabilitation at home.',
    steps: [
      { icon: '🧠', title: 'Neurological Assessment', desc: 'Evaluation of motor function, balance, coordination, and cognitive abilities affected by stroke.' },
      { icon: '🔄', title: 'Motor Function Retraining', desc: 'Exercises to retrain affected limbs and restore voluntary movement patterns.' },
      { icon: '⚖️', title: 'Balance & Gait Training', desc: 'Balance exercises and walking retraining to improve stability and prevent falls.' },
      { icon: '📋', title: 'Functional Independence', desc: 'Training for daily activities like dressing and bathing to promote independence.' },
    ],
    benefits: [
      { icon: '🔄', title: 'Motor Recovery', desc: 'Regain movement in affected arms and legs through neuroplasticity-based exercises.' },
      { icon: '⚖️', title: 'Better Balance', desc: 'Improve sitting and standing balance to reduce fall risk.' },
      { icon: '🚶', title: 'Walking Ability', desc: 'Retrain walking patterns for safe mobility with or without assistive devices.' },
      { icon: '💪', title: 'Muscle Strength', desc: 'Build strength in weakened muscles to support daily activities.' },
      { icon: '📢', title: 'Speech & Swallowing', desc: 'Coordinated therapy for speech difficulties and swallowing problems.' },
      { icon: '❤️', title: 'Quality of Life', desc: 'Greater independence and participation in family and community life.' },
    ],
    faqs: [
      { q: 'How soon after a stroke should physiotherapy start?', a: 'Early mobilization is crucial. Physiotherapy can begin 24-48 hours after stroke if medically stable.' },
      { q: 'How long does stroke rehabilitation take?', a: 'Significant improvements are seen in the first 3-6 months, but progress can continue for years with consistent therapy.' },
      { q: 'Can stroke patients fully recover with physiotherapy?', a: 'Most patients achieve meaningful improvements in mobility, independence, and quality of life.' },
      { q: 'Do you provide home-based stroke rehabilitation?', a: 'Yes, our therapists visit your home for rehabilitation, convenient for patients with limited mobility.' },
    ],
  },
  'post-surgery-physiotherapy': {
    heroTitle: 'Post Surgery Physiotherapy at Home – Recovery Rehabilitation in Hyderabad',
    heroSubtitle: 'Accelerate recovery after surgery with professional physiotherapy at home. Structured programs help regain strength, mobility, and independence safely.',
    steps: [
      { icon: '🩺', title: 'Post-Surgical Assessment', desc: 'Evaluation of surgical site, mobility, pain levels, and functional limitations for a recovery plan.' },
      { icon: '🩻', title: 'Pain & Swelling Management', desc: 'Therapeutic techniques to reduce post-surgical pain, swelling, and inflammation.' },
      { icon: '🏋️', title: 'Mobility & Strength Recovery', desc: 'Progressive exercises to restore range of motion and rebuild muscle strength.' },
      { icon: '📋', title: 'Home Exercise Program', desc: 'Customized exercise plan with family training for continued progress between sessions.' },
    ],
    benefits: [
      { icon: '✅', title: 'Faster Recovery', desc: 'Structured rehabilitation shortens recovery time and returns you to normal activities sooner.' },
      { icon: '🩻', title: 'Reduced Scar Tissue', desc: 'Manual therapy minimizes scar tissue formation and improves tissue healing.' },
      { icon: '🏃', title: 'Regain Mobility', desc: 'Restore range of motion and flexibility in the operated joint or area.' },
      { icon: '💪', title: 'Strength Rebuilding', desc: 'Gradual strengthening to support the surgical site and prevent complications.' },
      { icon: '🚶', title: 'Independent Walking', desc: 'Gait training for hip, knee, or spine surgery patients.' },
      { icon: '📈', title: 'Prevent Complications', desc: 'Reduce risk of blood clots, muscle atrophy, and joint stiffness.' },
    ],
    faqs: [
      { q: 'When should I start physiotherapy after surgery?', a: 'Physiotherapy often begins within 24-48 hours post-surgery for basic mobility. Full rehab starts 1-2 weeks later based on your surgeon advice.' },
      { q: 'How many post-surgery sessions are needed?', a: 'Most recoveries require 10-15 sessions over 8-12 weeks. Complex cases may need 15-20+ sessions.' },
      { q: 'Can I do physiotherapy at home after surgery?', a: 'Yes, home physiotherapy is ideal after surgery. Therapists visit your home, eliminating travel stress.' },
      { q: 'Do you coordinate with my surgeon?', a: 'We work with your surgical team, following post-operative protocols and keeping your surgeon informed.' },
    ],
  },
  'sports-physiotherapy': {
    heroTitle: 'Sports Physiotherapy at Home – Injury Treatment in Hyderabad',
    heroSubtitle: 'Get back in the game with specialized sports physiotherapy. Programs treat injuries, enhance performance, and prevent future injuries for all athletes.',
    steps: [
      { icon: '🩺', title: 'Sports Injury Assessment', desc: 'Sport-specific evaluation to diagnose injury, assess movement, and understand your athletic goals.' },
      { icon: '🩻', title: 'Injury Treatment & Recovery', desc: 'Targeted therapy including manual techniques and controlled exercises to heal.' },
      { icon: '🏋️', title: 'Sport-Specific Training', desc: 'Functional exercises that mimic sport movements for safe return to play.' },
      { icon: '🛡️', title: 'Injury Prevention Program', desc: 'Strength and conditioning program to prevent re-injury and optimize performance.' },
    ],
    benefits: [
      { icon: '⚡', title: 'Fast Recovery', desc: 'Accelerated return to sport with sports-specific rehabilitation protocols.' },
      { icon: '🏋️', title: 'Performance Enhancement', desc: 'Improve strength, speed, agility, and endurance beyond pre-injury levels.' },
      { icon: '🛡️', title: 'Injury Prevention', desc: 'Identify and correct movement weaknesses to reduce future injury risk.' },
      { icon: '💪', title: 'Functional Strength', desc: 'Build sport-specific strength for better on-field performance.' },
      { icon: '🧘', title: 'Better Flexibility', desc: 'Improved range of motion and flexibility for enhanced athletic movement.' },
      { icon: '📋', title: 'Return-to-Play Plan', desc: 'Milestone-based program for safe and confident return to your sport.' },
    ],
    faqs: [
      { q: 'How long does sports injury recovery take?', a: 'Minor injuries heal in 2-4 weeks. Moderate injuries take 6-8 weeks, severe injuries 3-6 months.' },
      { q: 'Can physiotherapy prevent sports injuries?', a: 'Yes, regular physiotherapy assessment identifies risk factors and prevents common injuries.' },
      { q: 'Do you treat gym-related injuries?', a: 'We treat all gym injuries including muscle tears, joint pain, tendonitis, and overuse injuries.' },
      { q: 'Will I need to stop playing my sport during treatment?', a: 'Not completely. We modify activity and provide alternative training while the injury heals.' },
    ],
  },
  'elderly-physiotherapy': {
    heroTitle: 'Geriatric Physiotherapy at Home – Elderly Care in Hyderabad',
    heroSubtitle: 'Help loved ones maintain independence and mobility with specialized geriatric physiotherapy. Age-friendly programs focus on strength, balance, and fall prevention.',
    steps: [
      { icon: '🩺', title: 'Elderly Health Assessment', desc: 'Evaluation of mobility, balance, strength, and fall risk tailored for senior citizens.' },
      { icon: '🏋️', title: 'Strength & Conditioning', desc: 'Gentle, age-appropriate exercises to maintain muscle mass and joint health.' },
      { icon: '⚖️', title: 'Balance & Fall Prevention', desc: 'Balance training and home safety assessment to prevent dangerous falls.' },
      { icon: '🚶', title: 'Walking & Mobility Training', desc: 'Gait training with or without walking aids for independent confidence.' },
    ],
    benefits: [
      { icon: '✅', title: 'Fall Prevention', desc: 'Reduce fall risk by 40-60% with targeted balance and strength exercises.' },
      { icon: '🚶', title: 'Independent Mobility', desc: 'Walk confidently at home and outdoors with improved gait.' },
      { icon: '💪', title: 'Muscle Strength', desc: 'Maintain muscle mass for independent daily activities.' },
      { icon: '🦴', title: 'Bone Health', desc: 'Weight-bearing exercises to prevent osteoporosis.' },
      { icon: '❤️', title: 'Pain Management', desc: 'Reduce age-related joint pain without heavy medication.' },
      { icon: '😊', title: 'Quality of Life', desc: 'Stay active, engaged, and independent in golden years.' },
    ],
    faqs: [
      { q: 'Is physiotherapy safe for elderly people?', a: 'Yes, geriatric physiotherapy is designed for seniors with gentle techniques and vital sign monitoring.' },
      { q: 'Can physiotherapy help with arthritis pain?', a: 'Absolutely. It is one of the most effective non-pharmacological treatments for arthritis.' },
      { q: 'How often should seniors do physiotherapy?', a: 'Most benefit from 2-3 sessions per week initially, then 1-2 for maintenance.' },
      { q: 'Do you provide physiotherapy for bedridden patients?', a: 'Yes, including passive exercises, positioning, and pressure sore prevention.' },
      { q: 'Can physiotherapy help with Parkinson disease?', a: 'Yes, neurological physiotherapy improves mobility, balance, and quality of life for Parkinson patients.' },
    ],
  },
  'physiotherapy-at-home': {
    heroTitle: 'Physiotherapy at Home – Expert Home Visit Physiotherapy in Hyderabad',
    heroSubtitle: 'Professional physiotherapy in the comfort of your home. Experienced therapists provide personalized treatment for all conditions without travel.',
    steps: [
      { icon: '📞', title: 'Book a Home Visit', desc: 'Schedule at your preferred time with flexible morning, evening, and weekend slots.' },
      { icon: '🩺', title: 'In-Home Assessment', desc: 'Therapist arrives equipped and evaluates your condition in your home environment.' },
      { icon: '📋', title: 'Personalized Treatment', desc: 'Tailored sessions including manual therapy, exercises, and home modification advice.' },
      { icon: '📱', title: 'Digital Progress Tracking', desc: 'Track recovery through app with pain scores, exercise compliance, and reports.' },
    ],
    benefits: [
      { icon: '🏠', title: 'Convenience at Home', desc: 'No travel or waiting rooms. Expert physiotherapy in familiar surroundings.' },
      { icon: '⏰', title: 'Flexible Scheduling', desc: 'Choose slots that fit your schedule including evenings and weekends.' },
      { icon: '💪', title: 'Personalized Attention', desc: 'One-on-one sessions focused entirely on your recovery.' },
      { icon: '👨‍👩‍👧‍👦', title: 'Family Involvement', desc: 'Family members learn exercises and techniques to support recovery.' },
      { icon: '🩻', title: 'Full Equipment Provided', desc: 'Therapists bring TENS, ultrasound, and all therapy accessories.' },
      { icon: '📈', title: 'Same Quality as Clinic', desc: 'Home physiotherapy delivers the same high-quality care with added convenience.' },
    ],
    faqs: [
      { q: 'Which areas of Hyderabad do you cover?', a: 'All major areas including Gachibowli, Madhapur, Kukatpally, Miyapur, Hitech City, Jubilee Hills, Banjara Hills, Secunderabad and more.' },
      { q: 'How many sessions are in a home package?', a: 'Packages range from 5 to 15 sessions. Monthly plans are also available for ongoing care.' },
      { q: 'Do I need equipment at home?', a: 'No, therapists bring all equipment. You just need comfortable clothing and a mat.' },
      { q: 'Can I switch from home to clinic visits?', a: 'Yes, you can switch between home, clinic, and online consultations as needed.' },
    ],
  },
};

export default function PhysioConditionPage() {
  const t = useT();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState(null);

  const mapping = SLUG_MAP[slug];
  useEffect(() => {
    if (!mapping) navigate('/physiotherapy', { replace: true });
  }, [slug, mapping, navigate]);

  if (!mapping) return null;

  const category = physioCategories.find(c => c.id === mapping.categoryId);
  const content = CONTENT[slug];
  const therapistIds = THERAPIST_MAP[slug] || [];
  const relevantTherapists = therapists.filter(th => therapistIds.includes(th.id));

  if (!category || !content) return null;

  return (
    <div>
      {/* HERO */}
      <div style={{ background: `linear-gradient(135deg, ${C.heroFrom} 0%, ${C.heroMid} 50%, ${C.heroTo} 100%)`, padding: '40px 0 52px', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/physiotherapy" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: 600, textDecoration: 'none', marginBottom: 10 }}>
            ← {t('physio.back', 'Back to Physiotherapy')}
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 32 }}>{category.icon}</span>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{category.name}</div>
              <h1 style={{ color: '#fff', fontSize: 40, fontWeight: 800, margin: 0, lineHeight: 1.15 }}>{t(`physio.cond.${slug}.title`, content.heroTitle)}</h1>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, margin: '0 0 12px', maxWidth: 520, lineHeight: 1.5 }}>
            {t(`physio.cond.${slug}.subtitle`, content.heroSubtitle)}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {[t('certified.therapists', 'Certified Physiotherapists'), t('home.visits', 'Free Home Assessment'), t('personalized.plans', 'Personalized Treatment'), t('track.progress', 'Progress Tracking')].map(b => (
              <span key={b} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: 20 }}>
                <span style={{ color: '#22C55E', fontSize: 11 }}>✓</span> {b}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/physiotherapy/book" style={{ background: C.accent, border: 'none', color: '#fff', height: 46, padding: '0 26px', fontSize: 15, fontWeight: 700, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{t('book.physiotherapy.session', 'Book Physiotherapy Session')}</Link>
            <a href="https://wa.me/919700104108?text=Hi%2C%20I%20want%20a%20free%20physiotherapy%20consultation" target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)', color: '#fff', height: 46, padding: '0 26px', fontSize: 15, fontWeight: 600, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{t('get.free.consultation', 'Get Free Consultation')}</a>
          </div>
        </div>
      </div>

      {/* TREATMENT APPROACH */}
      <div className="page-section container">
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{t('physio.cond.approach', 'Our Treatment Approach')}</h2>
        <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 18px' }}>{t('physio.cond.approach.sub', 'How we help you recover')}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          {content.steps.map((s, i) => (
            <div key={s.title} style={{ padding: 18, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, marginBottom: 8 }}>{i + 1}</div>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
              <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px', color: '#0F172A' }}>{t(`physio.cond.${slug}.step${i}.title`, s.title)}</h3>
              <p style={{ fontSize: 11, color: '#64748B', margin: 0, lineHeight: 1.5 }}>{t(`physio.cond.${slug}.step${i}.desc`, s.desc)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* BENEFITS */}
      <div className="page-section" style={{ background: C.bg }}>
        <div className="container">
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>{t('physio.cond.benefits', 'What You Gain')}</h2>
          <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 18px', textAlign: 'center' }}>{t('physio.cond.benefits.sub', 'Benefits of our physiotherapy program')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12 }}>
            {content.benefits.map(b => (
              <div key={b.title} style={{ padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{b.icon}</div>
                <h3 style={{ fontSize: 12, fontWeight: 700, margin: '0 0 3px', color: '#0F172A' }}>{t(`physio.cond.${slug}.benefit.${b.title.toLowerCase().replace(/\s+/g, '')}`, b.title)}</h3>
                <p style={{ fontSize: 10, color: '#64748B', margin: 0, lineHeight: 1.5 }}>{t(`physio.cond.${slug}.benefitdesc.${b.title.toLowerCase().replace(/\s+/g, '')}`, b.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* THERAPISTS */}
      {relevantTherapists.length > 0 && (
        <div className="page-section container">
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{t('physio.cond.therapists', 'Expert Physiotherapists')}</h2>
          <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 16px' }}>{t('physio.cond.therapists.sub', 'Specialists for your condition')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {relevantTherapists.map(th => (
              <div key={th.id} style={{ padding: 16, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{th.image}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{th.name}</div>
                    <div style={{ fontSize: 11, color: C.primary, fontWeight: 600 }}>{th.qualifications}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ color: '#F59E0B', fontSize: 13 }}>★</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{th.rating}</span>
                  <span style={{ fontSize: 11, color: '#64748B' }}>({th.sessions} sessions)</span>
                  <span style={{ fontSize: 11, color: '#059669', fontWeight: 600, marginLeft: 'auto' }}>{th.experience} yrs</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 8 }}>
                  {th.specialties.map(s => (
                    <span key={s} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: C.primaryLight, color: C.primary, fontWeight: 600 }}>{s}</span>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: '#059669', fontWeight: 600, marginBottom: 8 }}>
                  {th.availability.join(' • ')}
                </div>
                <Link to={`/physiotherapy/therapist/${th.id}`} style={{ display: 'block', textAlign: 'center', height: 36, lineHeight: '36px', borderRadius: 8, background: C.primary, color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>{t('book.session', 'Book Session')} →</Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      <div className="page-section" style={{ background: C.bg }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>{t('faq.heading', 'Frequently Asked Questions')}</h2>
          <div style={{ display: 'grid', gap: 8 }}>
            {content.faqs.map(f => (
              <div key={f.q} style={{ borderRadius: 10, border: '1px solid #e2e8f0', overflow: 'hidden', background: '#fff' }}>
                <button onClick={() => setExpandedFaq(expandedFaq === f.q ? null : f.q)} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, fontFamily: 'inherit', textAlign: 'left' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', flex: 1 }}>{t(`physio.cond.${slug}.faq.q${content.faqs.indexOf(f)}`, f.q)}</span>
                  <span style={{ fontSize: 16, color: '#94a3b8', transition: 'transform 0.2s', transform: expandedFaq === f.q ? 'rotate(180deg)' : 'none' }}>▼</span>
                </button>
                {expandedFaq === f.q && (
                  <div style={{ padding: '0 16px 12px', fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{t(`physio.cond.${slug}.faq.a${content.faqs.indexOf(f)}`, f.a)}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="page-section" style={{ background: `linear-gradient(135deg, ${C.heroFrom}, ${C.heroMid})`, textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{t('start.treatment.today', 'Start Treatment Today')}</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 16 }}>{t('physio.cond.cta.sub', 'Book your session and start your recovery journey with Jeevan Healthcare')}</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/physiotherapy/book" style={{ background: C.accent, border: 'none', color: '#fff', height: 48, padding: '0 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{t('book.physiotherapy.session', 'Book Physiotherapy Session')}</Link>
            <a href="https://wa.me/919700104108?text=Hi%2C%20I%20want%20to%20know%20more%20about%20physiotherapy" target="_blank" rel="noopener noreferrer" style={{ background: '#25d366', border: 'none', color: '#fff', height: 48, padding: '0 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{t('talk.to.expert', 'Talk to Expert')}</a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .page-section { padding: 24px 16px; }
          .container { padding: 0; }
        }
        @media (min-width: 769px) {
          .page-section { padding: 32px 0; }
        }
      `}</style>
    </div>
  );
}
