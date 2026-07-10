import { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { physioCategories, physioPackages, therapists } from '../data/physiotherapyData';

function Section({ icon, title, children, open, onToggle, id }) {
  return (
    <div id={id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', overflow: 'hidden', marginBottom: 10, scrollMarginTop: 80 }}>
      <button onClick={onToggle} style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, color: '#1a1a1a', textAlign: 'left' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
          {title}
        </span>
        <span style={{ fontSize: 12, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0, color: '#999' }}>▾</span>
      </button>
      {open && <div style={{ padding: '0 16px 16px', fontSize: 12, color: '#555', lineHeight: 1.6 }}>{children}</div>}
    </div>
  );
}

function ListItems({ items }) {
  return (
    <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 12, lineHeight: 1.5 }}>{item}</li>
      ))}
    </ul>
  );
}

function Tag({ label, color, bg }) {
  return <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: bg || '#e8f0fe', color: color || '#1866C9', display: 'inline-block' }}>{label}</span>;
}

function InfoItem({ icon, label, value, valueColor, bold, strikethrough }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 14, width: 20, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 9, color: '#999', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: bold ? 700 : 600, color: valueColor || '#1a1a1a', textDecoration: strikethrough ? 'line-through' : 'none' }}>{value}</div>
      </div>
    </div>
  );
}

function InfoBox({ children, bg, color, icon }) {
  return (
    <div style={{ marginTop: 8, padding: '8px 12px', background: bg || '#e8f0fe', borderRadius: 8, fontSize: 11, color: color || '#555', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
      {icon && <span style={{ flexShrink: 0, marginTop: 1 }}>{icon}</span>}
      <span>{children}</span>
    </div>
  );
}

function Pill({ children, active, color }) {
  return (
    <button style={{ padding: '4px 12px', borderRadius: 16, border: `1px solid ${active ? (color || '#0D9488') : '#ddd'}`, background: active ? `${color || '0D9488'}15` : '#fff', color: active ? (color || '#0D9488') : '#888', fontSize: 11, cursor: 'pointer', fontWeight: active ? 600 : 400, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
      {children}
    </button>
  );
}

const TECHNIQUE_ICONS = {
  'Manual Therapy': '💆',
  'Exercise Therapy': '🏋️',
  'Electrotherapy': '⚡',
  'Pain Management': '🩻',
  'Strength Training': '💪',
  'Mobility Improvement': '🚶',
  'Neuro Rehabilitation': '🧠',
  'Balance Training': '⚖️',
  'Gait Training': '🚶',
  'Coordination Exercises': '🔄',
  'Functional Recovery': '📋',
  'Injury Assessment': '🔍',
  'Sports Injury Prevention': '🛡️',
  'Performance Enhancement': '⚡',
  'Recovery Program': '📈',
};

const TECHNIQUE_DESC = {
  'Manual Therapy': 'Hands-on techniques including joint mobilization, soft tissue massage, and stretching to reduce pain and improve mobility.',
  'Exercise Therapy': 'Custom-designed exercise programs to strengthen muscles, improve flexibility, and restore function.',
  'Electrotherapy': 'Use of TENS, ultrasound, and other modalities for pain relief, tissue healing, and muscle stimulation.',
  'Pain Management': 'Evidence-based approaches including manual therapy, modalities, and education to reduce pain and inflammation.',
  'Strength Training': 'Progressive resistance exercises to build muscle strength around affected joints and areas.',
  'Mobility Improvement': 'Stretching and range of motion exercises to restore movement in stiff or restricted joints.',
  'Neuro Rehabilitation': 'Specialized techniques to retrain the nervous system and improve motor control after neurological injury.',
  'Balance Training': 'Exercises to improve proprioception, coordination, and stability to prevent falls.',
  'Gait Training': 'Walking pattern analysis and retraining for safe and efficient mobility.',
  'Coordination Exercises': 'Activities to improve motor control, timing, and movement accuracy.',
  'Functional Recovery': 'Task-specific training to regain independence in daily activities.',
  'Injury Assessment': 'Comprehensive evaluation including movement analysis and functional testing to diagnose injury.',
  'Sports Injury Prevention': 'Screening and conditioning programs to identify risk factors and prevent injuries.',
  'Performance Enhancement': 'Sport-specific training to improve strength, speed, agility, and endurance.',
  'Recovery Program': 'Structured rehabilitation plan with milestones for safe return to activity.',
};

const SHARED_SYMPTOMS = {
  'back-pain': [
    'Persistent pain in the lower, middle or upper back',
    'Stiffness and reduced range of motion in the spine',
    'Pain that worsens with prolonged sitting or standing',
    'Muscle spasms around the spinal area',
    'Radiating pain down one or both legs (sciatica)',
    'Difficulty bending, lifting, or twisting',
    'Pain that interrupts sleep or daily activities',
  ],
  'neck-pain': [
    'Stiffness and pain in the neck and upper shoulders',
    'Headaches originating from the neck (cervicogenic)',
    'Limited ability to turn or tilt the head',
    'Muscle tightness and trigger points in neck muscles',
    'Pain radiating down the arms or between shoulder blades',
    'Clicking or grinding sensation with neck movement',
    'Discomfort that worsens with prolonged screen time',
  ],
  'slip-disc': [
    'Sharp, shooting pain in the back or neck',
    'Radiating pain, numbness, or tingling in arms or legs',
    'Muscle weakness in the affected limb',
    'Reduced flexibility and difficulty bending forward',
    'Pain that worsens with coughing, sneezing, or straining',
    'Loss of sensation in the affected dermatome',
    'In severe cases, bowel or bladder control issues (emergency)',
  ],
  'sciatica': [
    'Sharp, burning pain radiating from lower back through buttock down the leg',
    'Numbness or tingling sensation along the sciatic nerve path',
    'Weakness in the affected leg or foot',
    'Pain that worsens with prolonged sitting',
    'Difficulty standing up from a seated position',
    'Shooting pain with sudden movements or coughing',
    'Pins and needles sensation in toes or foot',
  ],
  'knee-pain': [
    'Pain around or behind the kneecap during activity',
    'Swelling and stiffness in the knee joint',
    'Clicking, popping, or grinding sensation with movement',
    'Difficulty climbing stairs or getting up from chairs',
    'Locking or giving way of the knee',
    'Reduced range of motion when straightening or bending the knee',
    'Pain that worsens with walking, running, or weight-bearing',
  ],
  'shoulder-pain': [
    'Pain in the shoulder joint with overhead activities',
    'Difficulty reaching behind the back',
    'Night pain that disrupts sleep when lying on the affected side',
    'Weakness in the arm when lifting or carrying',
    'Clicking or catching sensation with shoulder movement',
    'Pain radiating down the upper arm',
    'Stiffness and reduced range of motion',
  ],
  'frozen-shoulder': [
    'Gradual onset of severe shoulder stiffness',
    'Difficulty raising the arm above shoulder level',
    'Pain that is worse at night, especially when lying on the shoulder',
    'Inability to reach behind the back or across the body',
    'Progressive loss of passive and active range of motion',
    'Pain during the freezing phase, stiffness during the frozen phase',
    'Difficulty with daily tasks like dressing, combing hair, or reaching',
  ],
  'arthritis': [
    'Chronic joint pain that worsens with activity',
    'Morning stiffness lasting more than 30 minutes',
    'Swelling and tenderness in affected joints',
    'Reduced range of motion and joint flexibility',
    'Grinding sensation or crepitus with joint movement',
    'Joint deformity in advanced stages',
    'Fatigue and general feeling of malaise',
  ],
  'sports-injuries': [
    'Acute pain following a sports activity or impact',
    'Swelling, bruising, or inflammation in the injured area',
    'Reduced range of motion and functional limitation',
    'Muscle strains, ligament sprains, or tendon injuries',
    'Pain with specific movements or weight-bearing',
    'Instability or giving way of the affected joint',
    'Inability to continue playing or training',
  ],
  'stroke-recovery': [
    'Weakness or paralysis on one side of the body',
    'Difficulty with balance and coordination',
    'Impaired walking pattern (foot drop, stiff leg)',
    'Loss of sensation or altered sensation in affected limbs',
    'Difficulty with fine motor tasks like gripping or writing',
    'Speech and swallowing difficulties',
    'Fatigue and reduced endurance for daily activities',
  ],
  'joint-stiffness': [
    'Difficulty moving joints through their full range',
    'Stiffness that improves with movement but returns after rest',
    'Discomfort with sudden changes in weather',
    'Reduced flexibility affecting daily activities',
    'Mild swelling around affected joints',
    'Clicking or locking sensation with joint movement',
    'Gradual loss of mobility over time',
  ],
};

const SHARED_BENEFITS = {
  'back-pain': [
    { icon: '✅', title: 'Pain Relief', desc: 'Significant reduction in back pain through targeted manual therapy and exercises.' },
    { icon: '🚶', title: 'Improved Mobility', desc: 'Regain freedom of movement for bending, walking, and daily activities.' },
    { icon: '💪', title: 'Core Strength', desc: 'Build a strong core to support your spine and prevent recurring pain.' },
    { icon: '🧘', title: 'Better Posture', desc: 'Correct postural habits that contribute to back pain and spinal misalignment.' },
    { icon: '😴', title: 'Better Sleep', desc: 'Reduce nighttime pain for restful sleep and improved daily energy.' },
    { icon: '📈', title: 'Long-term Results', desc: 'Sustainable strategies for lasting relief and prevention of future episodes.' },
  ],
  'neck-pain': [
    { icon: '✅', title: 'Neck Pain Relief', desc: 'Reduce tension and pain in cervical spine and shoulder muscles.' },
    { icon: '🔄', title: 'Improved Range of Motion', desc: 'Regain full neck movement for turning, tilting, and daily activities.' },
    { icon: '💆', title: 'Muscle Relaxation', desc: 'Release trigger points and tension in neck and upper back.' },
    { icon: '🧘', title: 'Posture Correction', desc: 'Fix forward head posture and tech-neck syndrome.' },
    { icon: '🤕', title: 'Headache Relief', desc: 'Reduce cervicogenic headaches originating from neck tension.' },
    { icon: '📈', title: 'Prevent Recurrence', desc: 'Learn exercises and ergonomic habits for long-term neck health.' },
  ],
  'knee-pain': [
    { icon: '✅', title: 'Joint Pain Relief', desc: 'Reduce knee pain during walking, climbing stairs, and daily activities.' },
    { icon: '🦵', title: 'Improved Flexibility', desc: 'Restore full range of motion in your knee joint for better mobility.' },
    { icon: '💪', title: 'Leg Strength', desc: 'Build quadriceps, hamstring, and calf strength to support the knee.' },
    { icon: '🏃', title: 'Active Lifestyle', desc: 'Return to walking, jogging, and sports without knee discomfort.' },
    { icon: '⚖️', title: 'Better Balance', desc: 'Improve stability and proprioception to prevent falls and injuries.' },
    { icon: '📈', title: 'Avoid Surgery', desc: 'Non-surgical treatment that may help delay or avoid knee replacement.' },
  ],
  'stroke-recovery': [
    { icon: '🔄', title: 'Motor Recovery', desc: 'Regain movement in affected limbs through neuroplasticity-based exercises.' },
    { icon: '⚖️', title: 'Better Balance', desc: 'Improve sitting and standing balance to reduce fall risk.' },
    { icon: '🚶', title: 'Walking Ability', desc: 'Retrain walking patterns for safe mobility at home and outdoors.' },
    { icon: '💪', title: 'Muscle Strength', desc: 'Build strength in weakened muscles to support daily activities.' },
    { icon: '📢', title: 'Speech & Swallowing', desc: 'Coordinated therapy for communication and swallowing difficulties.' },
    { icon: '❤️', title: 'Quality of Life', desc: 'Greater independence and participation in family and community life.' },
  ],
  'frozen-shoulder': [
    { icon: '✅', title: 'Pain Reduction', desc: 'Alleviate shoulder pain, especially during the freezing phase.' },
    { icon: '🔄', title: 'Restored Motion', desc: 'Regain range of motion in the shoulder joint.' },
    { icon: '💪', title: 'Shoulder Strength', desc: 'Build rotator cuff and scapular muscle strength for stability.' },
    { icon: '🏠', title: 'Daily Function', desc: 'Return to reaching, dressing, and overhead activities.' },
    { icon: '😴', title: 'Sleep Quality', desc: 'Reduce night pain and improve sleeping posture.' },
    { icon: '📈', title: 'Faster Recovery', desc: 'Accelerate the natural recovery timeline of frozen shoulder.' },
  ],
  'arthritis': [
    { icon: '✅', title: 'Joint Pain Relief', desc: 'Non-pharmacological pain management through therapeutic techniques.' },
    { icon: '🔄', title: 'Improved Flexibility', desc: 'Maintain and improve joint range of motion.' },
    { icon: '💪', title: 'Muscle Support', desc: 'Strengthen muscles around affected joints for better support.' },
    { icon: '🧘', title: 'Better Function', desc: 'Improve ability to perform daily activities with less discomfort.' },
    { icon: '📈', title: 'Slow Progression', desc: 'Exercise and lifestyle modifications to slow joint degeneration.' },
    { icon: '😊', title: 'Quality of Life', desc: 'Stay active and independent with effective joint management.' },
  ],
};

const SHARED_APPROACH = {
  'back-pain': [
    { icon: '🩺', title: 'Comprehensive Assessment', desc: 'Physiotherapist evaluates your back pain through physical examination and movement analysis to identify the root cause.' },
    { icon: '💆', title: 'Manual Therapy & Mobilization', desc: 'Hands-on techniques to release muscle tension, improve spinal mobility, and reduce pain.' },
    { icon: '🏋️', title: 'Strengthening & Core Training', desc: 'Exercises to strengthen back muscles and core stability to prevent future pain episodes.' },
    { icon: '📋', title: 'Ongoing Progress Tracking', desc: 'Regular monitoring of pain levels and mobility improvements with exercise plan adjustments.' },
  ],
  'knee-pain': [
    { icon: '🦵', title: 'Knee Assessment & Diagnosis', desc: 'Detailed evaluation of knee joint mobility, strength, and pain patterns to create a targeted plan.' },
    { icon: '🩻', title: 'Pain Management Techniques', desc: 'Therapeutic modalities to reduce knee inflammation and pain effectively.' },
    { icon: '🏋️', title: 'Muscle Strengthening', desc: 'Focused exercises for quadriceps, hamstrings, and calves to support the knee joint.' },
    { icon: '🚶', title: 'Gait & Mobility Training', desc: 'Walk pattern analysis and correction to reduce knee strain and improve movement.' },
  ],
  'stroke-recovery': [
    { icon: '🧠', title: 'Neurological Assessment', desc: 'Evaluation of motor function, balance, coordination, and cognitive abilities affected by stroke.' },
    { icon: '🔄', title: 'Motor Function Retraining', desc: 'Exercises to retrain affected limbs and restore voluntary movement patterns.' },
    { icon: '⚖️', title: 'Balance & Gait Training', desc: 'Balance exercises and walking retraining to improve stability and prevent falls.' },
    { icon: '📋', title: 'Functional Independence', desc: 'Training for daily activities like dressing and bathing to promote independence.' },
  ],
};

const CONDITION_FAQS = {
  'back-pain': [
    { q: 'How soon can I get relief from back pain with physiotherapy?', a: 'Most patients experience noticeable relief within 3-5 sessions. Chronic conditions may need 8-12 sessions for significant improvement. Your therapist will create a personalized plan based on your specific condition and severity.' },
    { q: 'Can physiotherapy cure chronic back pain permanently?', a: 'Physiotherapy addresses the root cause of your back pain and provides long-term management strategies. Many patients achieve permanent relief with consistent therapy and exercise adherence. Maintenance exercises help prevent recurrence.' },
    { q: 'Do I need a doctor prescription for back pain physiotherapy?', a: 'No prescription is needed for an initial assessment. Our physiotherapists can evaluate your condition and recommend a treatment plan. For insurance coverage, we can provide documentation if required.' },
    { q: 'Is home physiotherapy effective for back pain?', a: 'Yes, home physiotherapy is highly effective for back pain treatment. Our therapists bring all necessary equipment and provide one-on-one attention in your home environment, making it convenient and comfortable.' },
    { q: 'What kind of exercises will I need to do?', a: 'Your exercise program may include core strengthening, back stretches, posture correction exercises, and mobility work. Exercises are tailored to your condition and progress as you improve.' },
  ],
  'knee-pain': [
    { q: 'How many sessions are needed for knee pain relief?', a: 'Mild to moderate knee pain typically needs 6-10 sessions. Severe cases may require 12-15 sessions with maintenance exercises. Your therapist will reassess and adjust the plan regularly.' },
    { q: 'Can physiotherapy help avoid knee replacement surgery?', a: 'Yes, many patients successfully manage knee pain through physiotherapy and delay or avoid surgery. We focus on strengthening the muscles around the knee to provide better joint support.' },
    { q: 'Is physiotherapy painful for knee conditions?', a: 'Therapy should not cause severe pain. Our therapists work within your comfort zone and progress gradually. Some mild discomfort during stretching is normal but sharp pain should be reported.' },
    { q: 'Do you treat post-ACL surgery patients at home?', a: 'Absolutely. Our post-surgery program covers ACL recovery with mobility training, strength building, and progressive return-to-sport protocols.' },
    { q: 'Can I walk normally after knee physiotherapy?', a: 'Most patients see significant improvement in walking pattern and pain-free movement within a few sessions. Gait training is a key component of our knee rehabilitation program.' },
  ],
  'neck-pain': [
    { q: 'How long does neck pain physiotherapy take?', a: 'Acute neck pain often improves within 3-6 sessions. Chronic neck pain may need 8-12 sessions. Your therapist will provide a home exercise program to accelerate recovery.' },
    { q: 'Can physiotherapy help with tech-neck from computer use?', a: 'Yes, we treat tech-neck syndrome effectively through posture correction, ergonomic advice, and specific exercises to reverse forward head posture.' },
    { q: 'Is it safe to do neck exercises at home?', a: 'Yes, once your therapist has assessed your condition and taught you the correct technique. We provide a structured home exercise program with video demonstrations.' },
    { q: 'Will physiotherapy help with my chronic headaches?', a: 'If your headaches originate from neck tension (cervicogenic headaches), physiotherapy is highly effective. We release trigger points and correct posture to reduce headache frequency.' },
  ],
  'sciatica': [
    { q: 'How quickly can physiotherapy relieve sciatica pain?', a: 'Many patients experience significant relief within 2-4 sessions. The key is identifying the underlying cause and using targeted techniques like nerve mobilization and core strengthening.' },
    { q: 'Can sciatica be cured without surgery?', a: 'Yes, over 80% of sciatica cases resolve with conservative treatment including physiotherapy. Surgery is only considered if conservative treatment fails after 6-8 weeks.' },
    { q: 'What exercises should I avoid with sciatica?', a: 'Avoid heavy lifting, deep forward bending, and high-impact activities initially. Your therapist will guide you on safe exercises and which movements to avoid during recovery.' },
    { q: 'Is bed rest recommended for sciatica?', a: 'Prolonged bed rest is not recommended. Gentle, guided movement helps recovery. Our therapists prescribe specific exercises that are safe during the acute phase.' },
  ],
  'shoulder-pain': [
    { q: 'How long does shoulder pain physiotherapy take?', a: 'Most shoulder conditions improve within 6-10 sessions. Rotator cuff issues may need 8-12 sessions. Your therapist will provide a timeline based on your specific diagnosis.' },
    { q: 'Can physiotherapy fix a frozen shoulder?', a: 'Yes, physiotherapy is the primary treatment for frozen shoulder. We help manage pain during the freezing phase and restore motion during the thawing phase.' },
    { q: 'What exercises help shoulder impingement?', a: 'Scapular stabilization, rotator cuff strengthening, and posture correction exercises are key. Your therapist will design a program avoiding painful movements.' },
    { q: 'Do I need imaging before starting physiotherapy?', a: 'Not necessarily. Our therapists perform a thorough clinical assessment. If needed, we can recommend appropriate imaging and coordinate with your doctor.' },
  ],
  'frozen-shoulder': [
    { q: 'How long does frozen shoulder recovery take with physiotherapy?', a: 'Recovery typically takes 6-12 months with regular physiotherapy. Our program accelerates the natural healing process and helps regain motion faster.' },
    { q: 'Is physiotherapy painful for frozen shoulder?', a: 'We use gentle techniques and work within your pain threshold. Aggressive stretching is avoided. Our approach focuses on gradual, controlled mobilization.' },
    { q: 'Can frozen shoulder recur after treatment?', a: 'Recurrence in the same shoulder is rare (under 10%). However, up to 30% may develop frozen shoulder in the opposite shoulder. Preventive exercises are recommended.' },
    { q: 'When should I start physiotherapy for frozen shoulder?', a: 'Earlier intervention leads to better outcomes. Starting physiotherapy in the early freezing phase can reduce pain and prevent severe stiffness.' },
  ],
  'arthritis': [
    { q: 'Can physiotherapy reverse arthritis?', a: 'While arthritis cannot be reversed, physiotherapy effectively manages symptoms, slows progression, and improves joint function and quality of life.' },
    { q: 'Is exercise safe for arthritic joints?', a: 'Yes, appropriate exercise is beneficial for arthritis. Our therapists design low-impact programs that strengthen supporting muscles without stressing the joints.' },
    { q: 'How often should I do physiotherapy for arthritis?', a: 'Typically 2-3 sessions per week initially, then tapering to 1-2 sessions per week or monthly for maintenance as symptoms improve.' },
    { q: 'What type of exercises are best for arthritis?', a: 'Range of motion exercises, low-impact strengthening, aquatic therapy, and gentle stretching are most effective. We customize the program to your affected joints.' },
  ],
  'stroke-recovery': [
    { q: 'How soon after a stroke should physiotherapy start?', a: 'Early mobilization is crucial. Physiotherapy can begin 24-48 hours after stroke if medically stable, even in the ICU.' },
    { q: 'How long does stroke rehabilitation take?', a: 'Significant improvements are seen in the first 3-6 months, but progress can continue for years with consistent therapy and home exercise.' },
    { q: 'Can stroke patients fully recover with physiotherapy?', a: 'Most patients achieve meaningful improvements in mobility, independence, and quality of life. The extent of recovery depends on stroke severity and consistency of therapy.' },
    { q: 'Do you provide home-based stroke rehabilitation?', a: 'Yes, our therapists visit your home for comprehensive stroke rehabilitation. This is especially beneficial for patients with limited mobility.' },
    { q: 'What is neuroplasticity and how does it help?', a: 'Neuroplasticity is the brains ability to rewire itself. Physiotherapy uses this principle to help healthy brain areas take over functions affected by the stroke.' },
  ],
  'sports-injuries': [
    { q: 'How long does sports injury recovery take?', a: 'Minor injuries heal in 2-4 weeks. Moderate injuries take 6-8 weeks, and severe injuries may require 3-6 months of structured rehabilitation.' },
    { q: 'Can physiotherapy prevent sports injuries?', a: 'Yes, regular physiotherapy assessment identifies risk factors like muscle imbalances and movement dysfunctions that lead to common sports injuries.' },
    { q: 'Do you treat gym-related injuries?', a: 'We treat all gym injuries including muscle tears, joint pain, tendonitis, rotator cuff injuries, and overuse syndromes from training.' },
    { q: 'Will I need to stop playing my sport during treatment?', a: 'Not completely. We modify activity levels and provide alternative training while the injury heals, then progressively return you to full participation.' },
  ],
  'post-surgery-rehabilitation': [
    { q: 'When should I start physiotherapy after surgery?', a: 'Physiotherapy often begins within 24-48 hours post-surgery for basic mobility. Full rehabilitation starts 1-2 weeks later based on your surgeons advice.' },
    { q: 'How many post-surgery sessions are needed?', a: 'Most recoveries require 10-15 sessions over 8-12 weeks. Complex cases like joint replacement or spine surgery may need 15-20+ sessions.' },
    { q: 'Can I do physiotherapy at home after surgery?', a: 'Yes, home physiotherapy is ideal after surgery. Our therapists visit your home, eliminating the need for travel when mobility is limited.' },
    { q: 'Do you coordinate with my surgeon?', a: 'Yes, we work closely with your surgical team, following post-operative protocols and keeping your surgeon informed of your progress.' },
  ],
};

const DEFAULT_SYMPTOMS = [
  'Persistent pain or discomfort in the affected area',
  'Reduced range of motion and flexibility',
  'Muscle weakness or atrophy due to disuse',
  'Difficulty performing daily activities',
  'Stiffness, especially after periods of rest',
  'Pain that interferes with sleep or work',
  'Reduced quality of life and functional independence',
];

const DEFAULT_APPROACH = [
  { icon: '🩺', title: 'Initial Assessment', desc: 'Comprehensive evaluation of your condition, medical history, and functional limitations to create a personalized treatment plan.' },
  { icon: '💆', title: 'Therapeutic Techniques', desc: 'Hands-on manual therapy, soft tissue mobilization, and therapeutic modalities to reduce pain and improve function.' },
  { icon: '🏋️', title: 'Custom Exercise Program', desc: 'Targeted exercises to strengthen weak muscles, improve flexibility, and restore normal movement patterns.' },
  { icon: '📋', title: 'Progress Monitoring', desc: 'Regular reassessment of pain levels, range of motion, and functional outcomes to adjust your treatment plan.' },
];

const DEFAULT_BENEFITS = [
  { icon: '✅', title: 'Pain Relief', desc: 'Effective reduction in pain through evidence-based therapeutic techniques and modalities.' },
  { icon: '🔄', title: 'Better Mobility', desc: 'Restore range of motion and flexibility in affected joints and muscles.' },
  { icon: '💪', title: 'Increased Strength', desc: 'Build muscle strength to support affected areas and prevent future injuries.' },
  { icon: '🧘', title: 'Improved Function', desc: 'Regain ability to perform daily activities with greater ease and confidence.' },
  { icon: '📈', title: 'Long-term Results', desc: 'Learn self-management strategies and exercises for sustained improvement.' },
  { icon: '😊', title: 'Better Quality of Life', desc: 'Return to activities you enjoy with reduced pain and improved function.' },
];

function getTreatmentBySlug(slug) {
  const conditionName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  for (const cat of physioCategories) {
    const match = cat.conditions.find(c => c.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') === slug);
    if (match) {
      return { condition: match, category: cat, slug };
    }
  }

  return null;
}

function getSymptoms(slug, conditionName) {
  return SHARED_SYMPTOMS[slug] || [
    `Persistent ${conditionName.toLowerCase()} that affects daily activities`,
    'Reduced range of motion and flexibility in the affected area',
    'Muscle weakness or imbalance contributing to the condition',
    'Pain or discomfort during specific movements or activities',
    'Stiffness, especially after periods of rest or inactivity',
    'Difficulty performing work, household, or recreational tasks',
    'Reduced quality of life and functional independence',
  ];
}

function getBenefits(slug) {
  return SHARED_BENEFITS[slug] || DEFAULT_BENEFITS;
}

function getApproach(slug) {
  return SHARED_APPROACH[slug] || DEFAULT_APPROACH;
}

function getFAQs(slug) {
  return CONDITION_FAQS[slug] || [
    { q: `How many sessions are typically needed for ${slug.replace(/-/g, ' ')}?`, a: 'The number of sessions depends on the severity of your condition. Acute issues may need 3-5 sessions, while chronic conditions may require 8-12+ sessions for optimal results.' },
    { q: 'Is physiotherapy painful?', a: 'Therapy should not cause severe pain. Our therapists work within your comfort zone and progress gradually. Some mild discomfort during stretching is normal and indicates improvement.' },
    { q: 'Can I get treatment at home?', a: 'Yes, we offer home physiotherapy visits. Our therapists bring all necessary equipment and provide treatment in the comfort of your home.' },
    { q: 'Do I need a doctors referral?', a: 'A doctors prescription is not mandatory for initial assessment. However, for specific conditions or insurance claims, we can coordinate with your physician.' },
    { q: 'What should I wear to my session?', a: 'Wear loose, comfortable clothing that allows easy movement and access to the area being treated.' },
  ];
}

function getTherapistMatch(slug, conditionName) {
  const keyword = slug.split('-')[0];
  const matched = therapists.filter(th =>
    th.specialties.some(s => s.toLowerCase().includes(conditionName.toLowerCase().split(' ')[0]))
  );
  if (matched.length >= 2) return matched.slice(0, 2);
  const fallback = therapists.filter(th =>
    th.specialties.some(s => s.toLowerCase().includes(keyword))
  );
  if (fallback.length >= 2) return fallback.slice(0, 2);
  return therapists.slice(0, 2);
}

function getWhoShouldTake(conditionName) {
  return [
    `Individuals experiencing ${conditionName.toLowerCase()} for more than 2 weeks`,
    `People whose daily activities are limited by ${conditionName.toLowerCase()}`,
    'Those looking for non-surgical, drug-free pain management solutions',
    'Post-surgery patients needing guided rehabilitation',
    'Athletes or active individuals wanting to prevent injury recurrence',
    'Seniors wanting to maintain mobility and independence',
    'Anyone seeking professional guidance for safe exercise and recovery',
  ];
}

function getWhatToExpect(conditionName) {
  return {
    duringSession: [
      'Your therapist will begin with a brief check-in on your pain levels and progress',
      'Hands-on manual therapy techniques to address muscle tension and joint stiffness',
      'Guided therapeutic exercises tailored to your specific condition',
      'Education on proper body mechanics and ergonomic modifications',
      'Home exercise assignment for continued progress between sessions',
    ],
    afterSession: [
      'You may experience mild soreness similar to a good workout — this is normal',
      'Most patients feel immediate relief in movement and reduced stiffness',
      'Pain reduction typically noticeable after 2-3 sessions',
      'Your therapist will track progress using pain scores and functional tests',
    ],
    timeline: [
      'Acute phase (1-2 weeks): Pain management, gentle mobilization, activity modification',
      'Recovery phase (2-6 weeks): Progressive strengthening, flexibility training, functional exercises',
      'Maintenance phase (6+ weeks): Independent exercise program, periodic check-ins, prevention strategies',
    ],
  };
}

function getTreatmentTechniques(conditionName, category) {
  const treatments = category.treatments || ['Manual Therapy', 'Exercise Therapy', 'Pain Management'];
  return treatments.map(name => ({
    name,
    icon: TECHNIQUE_ICONS[name] || '💪',
    desc: TECHNIQUE_DESC[name] || 'Evidence-based therapeutic technique tailored to your condition.',
  }));
}

export default function PhysioTreatmentDetail() {
  const t = useT();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState({});
  const [faqFilter, setFaqFilter] = useState('all');

  const treatment = useMemo(() => getTreatmentBySlug(slug), [slug]);

  const toggle = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  if (!treatment) {
    return (
      <div className="page-section" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
        <div className="container" style={{ textAlign: 'center', padding: '40px 16px' }}>
          <span style={{ fontSize: 48 }}>💪</span>
          <p style={{ color: '#999', marginTop: 12 }}>{t('physio.treatment.detail.notFound', 'Treatment not found')}</p>
          <Link to="/physiotherapy/treatments" className="btn btn-primary" style={{ display: 'inline-block', marginTop: 16, padding: '10px 24px', background: '#0D9488', color: '#fff', textDecoration: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>{t('physio.treatment.detail.backToTreatments', '← Back to Treatments')}</Link>
        </div>
      </div>
    );
  }

  const { condition, category } = treatment;
  const theme = category.color || '#0D9488';
  const conditionName = condition;
  const popularPkg = physioPackages.find(p => p.popular) || physioPackages[0];
  const condSlug = slug;
  const symptoms = getSymptoms(condSlug, conditionName);
  const benefits = getBenefits(condSlug);
  const approach = getApproach(condSlug);
  const faqs = getFAQs(condSlug);
  const therapistsMatched = getTherapistMatch(condSlug, conditionName);
  const whoShouldTake = getWhoShouldTake(conditionName);
  const whatToExpect = getWhatToExpect(conditionName);
  const techniques = getTreatmentTechniques(conditionName, category);
  const sessionPrice = Math.round(popularPkg.price / popularPkg.sessions);

  const relatedConditions = category.conditions
    .filter(c => c !== conditionName)
    .slice(0, 8);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${conditionName} - ${t('physio.treatment.detail.bookAt', 'Book physiotherapy at home')} ₹${popularPkg.price} | ${t('physio.treatment.detail.siteName', 'Jeevan HealthCare at Home')}`;

  return (
    <div className="page-section" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 800, paddingBottom: 120, margin: '0 auto' }}>

        {/* Back */}
        <Link to="/physiotherapy/treatments" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#888', textDecoration: 'none', fontSize: 12, padding: '12px 0' }}>
          {t('physio.treatment.detail.back', '← Back to Treatments')}
        </Link>

        {/* ===== 1. TAGS ROW ===== */}
        <div style={{ marginBottom: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Tag label={category.name} bg={`${theme}15`} color={theme} />
          <Tag label={t('physio.treatment.detail.homeVisit', 'Home Visit Available')} bg="#f0fdf4" color="#059669" />
          <Tag label={t('physio.treatment.detail.popular', 'Popular')} bg="#fef3c7" color="#92400e" />
        </div>

        {/* ===== 2. HERO SECTION ===== */}
        <div style={{ background: `linear-gradient(135deg, ${theme} 0%, ${theme}dd 100%)`, borderRadius: 16, padding: '24px 20px', color: '#fff', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 32 }}>{category.icon}</span>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: -0.3 }}>{conditionName}</h1>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: '2px 0 0' }}>{category.name}</p>
            </div>
          </div>

          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', margin: '8px 0 12px', lineHeight: 1.5 }}>
            {category.description}
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12, fontSize: 11 }}>
            <span>{t('physio.treatment.detail.rating', '⭐ 4.8 Rating')}</span>
            <span>{t('physio.treatment.detail.bookings', '👥 5,000+ Sessions')}</span>
            <span>{t('physio.treatment.detail.homeVisitTag', '🏠 Home Visit Available')}</span>
            <span>{t('physio.treatment.detail.certified', '✅ Certified Therapists')}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div>
              {popularPkg.originalPrice > popularPkg.price && (
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textDecoration: 'line-through' }}>{t('physio.treatment.detail.original', 'Original')}: ₹{popularPkg.originalPrice}</div>
              )}
              <div style={{ fontSize: 28, fontWeight: 800 }}>₹{popularPkg.price}</div>
              {popularPkg.originalPrice > popularPkg.price && (
                <div style={{ fontSize: 11, color: '#4ade80', fontWeight: 600 }}>{t('physio.treatment.detail.save', 'Save')} ₹{popularPkg.originalPrice - popularPkg.price}</div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px' }}>
              <span>📅</span>
              <span style={{ fontSize: 12 }}>{popularPkg.sessions} {t('physio.treatment.detail.sessions', 'Sessions')}</span>
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px' }}>
              <span>⏱</span>
              <span style={{ fontSize: 12 }}>{t('physio.treatment.detail.perSession', '₹{price}/session').replace('{price}', sessionPrice)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            <Link to={`/physiotherapy/book?treatment=${slug}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#FF3B30', border: 'none', fontSize: 13, fontWeight: 700, padding: '10px 24px', borderRadius: 10, color: '#fff', textDecoration: 'none', boxShadow: '0 4px 14px rgba(255,59,48,0.3)' }}>
              {t('physio.treatment.detail.bookNow', '📋 Book Now')}
            </Link>
            <a href={`https://wa.me/919700104108?text=${encodeURIComponent(`Hi, I want to know more about ${conditionName} physiotherapy`)}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px', borderRadius: 10, fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none' }}>
              {t('physio.treatment.detail.whatsapp', '💬 WhatsApp')}
            </a>
          </div>
        </div>

        {/* ===== 3. QUICK INFO CARDS ===== */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 6, marginBottom: 14 }}>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8edf2', padding: '10px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>💰</div>
            <div style={{ fontSize: 9, color: '#999', marginBottom: 2 }}>{t('physio.treatment.detail.perSessionLabel', 'Per Session')}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a' }}>₹{sessionPrice}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8edf2', padding: '10px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>⏱️</div>
            <div style={{ fontSize: 9, color: '#999', marginBottom: 2 }}>{t('physio.treatment.detail.duration', 'Duration')}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a' }}>{t('physio.treatment.detail.durationValue', '45 min')}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8edf2', padding: '10px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>🏠</div>
            <div style={{ fontSize: 9, color: '#999', marginBottom: 2 }}>{t('physio.treatment.detail.mode', 'Mode')}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a' }}>{t('physio.treatment.detail.modeValue', 'Home/Clinic/Online')}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e8edf2', padding: '10px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>🧑‍⚕️</div>
            <div style={{ fontSize: 9, color: '#999', marginBottom: 2 }}>{t('physio.treatment.detail.therapistMatch', 'Therapist Match')}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a' }}>{therapistsMatched.length}+ {t('physio.treatment.detail.experts', 'Experts')}</div>
          </div>
        </div>

        {/* ===== 4. WHAT IS THIS TREATMENT ===== */}
        <Section icon="🩺" title={t('physio.treatment.detail.whatIs', 'What Is This Treatment?')} open={openSections.whatIs} onToggle={() => toggle('whatIs')}>
          <p style={{ margin: '0 0 10px', fontWeight: 500, fontSize: 13 }}>{t('physio.treatment.detail.whatIsPurpose', `${conditionName} physiotherapy is a specialized treatment program designed to address the root cause of your condition.`)}</p>
          <p style={{ margin: '0 0 10px' }}><strong>{t('physio.treatment.detail.overview', 'Treatment Overview')}</strong></p>
          <p style={{ margin: '0 0 10px' }}>{t(`physio.treatment.detail.overview.${slug}`, `Our ${conditionName.toLowerCase()} physiotherapy program focuses on evidence-based techniques to reduce pain, restore function, and prevent recurrence. Your therapist will create a personalized plan tailored to your specific needs, lifestyle, and goals.`)}</p>
          <InfoBox icon="✅" bg="#f0fdf4" color="#166534">{t('physio.treatment.detail.whatIsInfo', 'Physiotherapy is a non-invasive, drug-free approach to treating musculoskeletal conditions.')}</InfoBox>
        </Section>

        {/* ===== 5. SYMPTOMS ===== */}
        <Section icon="⚠️" title={t('physio.treatment.detail.symptoms', 'Symptoms We Treat')} open={openSections.symptoms} onToggle={() => toggle('symptoms')}>
          <p style={{ margin: '0 0 8px', fontSize: 11, color: '#999' }}>{t('physio.treatment.detail.symptomsDesc', 'If you experience any of these symptoms, physiotherapy can help:')}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {symptoms.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0' }}>
                <span style={{ color: '#e65100' }}>⚠</span>
                <span style={{ fontSize: 12 }}>{s}</span>
              </div>
            ))}
          </div>
          <InfoBox icon="💡" bg="#fff3e0" color="#e65100">{t('physio.treatment.detail.symptomsDisclaimer', 'Early intervention leads to better outcomes. Consult our physiotherapist for a proper evaluation.')}</InfoBox>
        </Section>

        {/* ===== 6. TREATMENT APPROACH ===== */}
        <Section icon="📋" title={t('physio.treatment.detail.approach', 'Our Treatment Approach')} open={openSections.approach} onToggle={() => toggle('approach')}>
          <p style={{ margin: '0 0 12px', fontSize: 11, color: '#999' }}>{t('physio.treatment.detail.approachDesc', 'Our step-by-step methodology for treating your condition:')}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 10 }}>
            {approach.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: i < approach.length - 1 ? '1px dashed #eee' : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${theme}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{step.icon}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>{step.title}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>{step.desc}</div>
                </div>
                {i < approach.length - 1 && <span style={{ marginLeft: 'auto', color: '#ccc', fontSize: 16 }}>↓</span>}
              </div>
            ))}
          </div>
          <InfoBox icon="✅" bg="#f0fdf4" color="#166534">{t('physio.treatment.detail.approachInfo', 'Each session builds on the previous one for progressive, sustainable recovery.')}</InfoBox>
        </Section>

        {/* ===== 7. BENEFITS ===== */}
        <Section icon="🎯" title={t('physio.treatment.detail.benefits', 'Key Benefits')} open={openSections.benefits} onToggle={() => toggle('benefits')}>
          <p style={{ margin: '0 0 8px', fontSize: 11, color: '#999' }}>{t('physio.treatment.detail.benefitsDesc', 'What you can expect from our physiotherapy program:')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ padding: '10px 12px', background: '#f8f9fa', borderRadius: 8, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{b.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>{b.title}</div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ===== 8. WHO SHOULD TAKE THIS ===== */}
        <Section icon="👤" title={t('physio.treatment.detail.whoShouldTake', 'Who Should Take This Treatment?')} open={openSections.who} onToggle={() => toggle('who')}>
          <p style={{ margin: '0 0 8px', fontSize: 11, color: '#999' }}>{t('physio.treatment.detail.whoShouldTakeDesc', 'This treatment is ideal for:')}</p>
          <ListItems items={whoShouldTake} />
          <InfoBox icon="✅" bg="#f0fdf4" color="#166534">{t('physio.treatment.detail.whoShouldTakeInfo', 'Our therapists assess each patient individually to determine the best treatment approach.')}</InfoBox>
        </Section>

        {/* ===== 9. WHAT TO EXPECT ===== */}
        <Section icon="📅" title={t('physio.treatment.detail.whatToExpect', 'What To Expect')} open={openSections.expect} onToggle={() => toggle('expect')}>
          <p style={{ margin: '0 0 10px', fontWeight: 600, fontSize: 12 }}>{t('physio.treatment.detail.duringSession', 'During a Session')}</p>
          <ListItems items={whatToExpect.duringSession} />
          <p style={{ margin: '10px 0 6px', fontWeight: 600, fontSize: 12 }}>{t('physio.treatment.detail.afterSession', 'After a Session')}</p>
          <ListItems items={whatToExpect.afterSession} />
          <p style={{ margin: '10px 0 6px', fontWeight: 600, fontSize: 12 }}>{t('physio.treatment.detail.recoveryTimeline', 'Recovery Timeline')}</p>
          <ListItems items={whatToExpect.timeline} />
          <InfoBox icon="💡" bg="#f0fdf4" color="#166534">{t('physio.treatment.detail.whatToExpectInfo', 'Consistency is key. Following your home exercise program accelerates recovery.')}</InfoBox>
        </Section>

        {/* ===== 10. TREATMENT TECHNIQUES ===== */}
        {techniques.length > 0 && (
          <Section icon="🔧" title={t('physio.treatment.detail.techniques', 'Treatment Techniques')} open={openSections.techniques} onToggle={() => toggle('techniques')}>
            <p style={{ margin: '0 0 10px', fontSize: 11, color: '#999' }}>{t('physio.treatment.detail.techniquesDesc', 'We use a combination of these evidence-based techniques:')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {techniques.map((tech, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: `${theme}08`, borderRadius: 8, border: `1px solid ${theme}20` }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{tech.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>{tech.name}</div>
                    <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{tech.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ===== 11. RECOMMENDED PACKAGE ===== */}
        <div style={{ background: '#fff8e1', borderRadius: 14, border: '1px solid #ffe082', padding: 16, marginBottom: 10 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16 }}>📦</span> {t('physio.treatment.detail.recommendedPackage', 'Recommended Package')}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>⭐ {popularPkg.name}</div>
              <div style={{ fontSize: 11, color: '#888' }}>{popularPkg.sessions} {t('physio.treatment.detail.sessions', 'sessions')} — ₹{sessionPrice}/{t('physio.treatment.detail.session', 'session')}</div>
              <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                {popularPkg.includes.map((inc, i) => (
                  <span key={i} style={{ fontSize: 9, padding: '1px 6px', borderRadius: 4, background: '#fff3cd', color: '#856404', fontWeight: 600 }}>{inc}</span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#e65100' }}>₹{popularPkg.price}</div>
              {popularPkg.originalPrice > popularPkg.price && (
                <div style={{ fontSize: 11, color: '#999', textDecoration: 'line-through' }}>₹{popularPkg.originalPrice}</div>
              )}
            </div>
          </div>
          <Link to={`/physiotherapy/book?treatment=${slug}`} style={{ display: 'block', textAlign: 'center', marginTop: 10, padding: '10px 0', background: theme, color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
            {t('physio.treatment.detail.bookThisPackage', 'Book This Package')} →
          </Link>
        </div>

        {/* ===== 12. RELATED TREATMENTS ===== */}
        {relatedConditions.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', padding: 16, marginBottom: 10 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>🔗</span> {t('physio.treatment.detail.relatedTreatments', 'Related Treatments')}
            </h3>
            <p style={{ fontSize: 11, color: '#999', margin: '0 0 8px' }}>{t('physio.treatment.detail.relatedDesc', 'Other conditions we treat in this category:')}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {relatedConditions.map((rc, i) => {
                const rcSlug = rc.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                return (
                  <Link key={i} to={`/physiotherapy/treatment/${rcSlug}`} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: `${theme}10`, border: `1px solid ${theme}30`, color: theme, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 12 }}>{category.icon}</span> {rc}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== 13. FAQ SECTION ===== */}
        <Section icon="❓" title={t('physio.treatment.detail.faq', 'Frequently Asked Questions')} open={openSections.faq} onToggle={() => toggle('faq')}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
            <Pill active={faqFilter === 'all'} onClick={() => setFaqFilter('all')} color={theme}>{t('physio.treatment.detail.faqAll', 'All')}</Pill>
            <Pill active={faqFilter === 'general'} onClick={() => setFaqFilter('general')} color={theme}>{t('physio.treatment.detail.faqGeneral', 'General')}</Pill>
            <Pill active={faqFilter === 'procedure'} onClick={() => setFaqFilter('procedure')} color={theme}>{t('physio.treatment.detail.faqProcedure', 'Procedure')}</Pill>
            <Pill active={faqFilter === 'recovery'} onClick={() => setFaqFilter('recovery')} color={theme}>{t('physio.treatment.detail.faqRecovery', 'Recovery')}</Pill>
            <Pill active={faqFilter === 'booking'} onClick={() => setFaqFilter('booking')} color={theme}>{t('physio.treatment.detail.faqBooking', 'Booking')}</Pill>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ border: '1px solid #e8edf2', borderRadius: 8, overflow: 'hidden' }}>
                <button onClick={() => setOpenSections(prev => ({ ...prev, [`faq_${i}`]: !prev[`faq_${i}`] }))} style={{ width: '100%', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, border: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, fontWeight: 600, color: '#1a1a1a', textAlign: 'left' }}>
                  {faq.q}
                  <span style={{ fontSize: 10, transition: 'transform 0.2s', transform: openSections[`faq_${i}`] ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0, color: '#999' }}>▾</span>
                </button>
                {openSections[`faq_${i}`] && (
                  <div style={{ padding: '0 12px 10px', fontSize: 11, color: '#888', lineHeight: 1.5 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* ===== 14. SPECIALIST DOCTORS ===== */}
        {therapistsMatched.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', padding: 16, marginBottom: 10 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16 }}>🧑‍⚕️</span> {t('physio.treatment.detail.specialists', 'Specialist Physiotherapists')}
            </h3>
            <p style={{ fontSize: 11, color: '#999', margin: '0 0 10px' }}>{t('physio.treatment.detail.specialistsDesc', 'Our expert therapists specializing in this condition:')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {therapistsMatched.map(th => (
                <div key={th.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#f8f9fa', borderRadius: 8 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${theme}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{th.image}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>{th.name}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{th.qualifications} · {th.experience} {t('physio.treatment.detail.years', 'years')}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <span style={{ color: '#f59e0b', fontSize: 11 }}>★</span>
                      <span style={{ fontSize: 11, fontWeight: 600 }}>{th.rating}</span>
                      <span style={{ fontSize: 10, color: '#999' }}>({th.sessions} {t('physio.treatment.detail.sessions', 'sessions')})</span>
                    </div>
                  </div>
                  <Link to={`/physiotherapy/therapist/${th.id}`} style={{ padding: '6px 14px', borderRadius: 6, background: theme, color: '#fff', fontSize: 11, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                    {t('physio.treatment.detail.viewProfile', 'View Profile')}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== 15. SOCIAL SHARING ===== */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf2', padding: 14, marginBottom: 10 }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, margin: '0 0 8px', color: '#888' }}>{t('physio.treatment.detail.share', '📤 Share this treatment')}</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noopener" style={{ width: 36, height: 36, borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, textDecoration: 'none' }}>💬</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" style={{ width: 36, height: 36, borderRadius: '50%', background: '#1877f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, textDecoration: 'none' }}>f</a>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" style={{ width: 36, height: 36, borderRadius: '50%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, textDecoration: 'none', color: '#fff' }}>𝕏</a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" style={{ width: 36, height: 36, borderRadius: '50%', background: '#0a66c2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, textDecoration: 'none' }}>in</a>
            <button onClick={() => { navigator.clipboard?.writeText(shareUrl); }} style={{ width: 36, height: 36, borderRadius: '50%', background: '#f0f0f0', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontFamily: 'inherit' }}>🔗</button>
          </div>
        </div>

        {/* ===== 16. TREATMENT SPEC CARD ===== */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf2', overflow: 'hidden', marginBottom: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ background: `linear-gradient(135deg, ${theme} 0%, ${theme}cc 100%)`, padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>{category.icon}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{conditionName}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{category.name}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
              <span style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 600, color: '#fff' }}>{category.name}</span>
              <span style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 600, color: '#fff' }}>{t('physio.treatment.detail.homeVisit', 'Home Visit')}</span>
              <span style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 600, color: '#fff' }}>{popularPkg.sessions} {t('physio.treatment.detail.sessions', 'Sessions')}</span>
            </div>
          </div>
          <div style={{ padding: '14px 16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <InfoItem icon="💰" label={t('physio.treatment.detail.packagePrice', 'Package Price')} value={`₹${popularPkg.price}`} valueColor="#e53935" bold />
              <InfoItem icon="🏷️" label={t('physio.treatment.detail.originalPrice', 'Original Price')} value={popularPkg.originalPrice > popularPkg.price ? `₹${popularPkg.originalPrice}` : '—'} valueColor={popularPkg.originalPrice > popularPkg.price ? '#999' : '#ccc'} strikethrough={popularPkg.originalPrice > popularPkg.price} />
              <InfoItem icon="📅" label={t('physio.treatment.detail.sessionsLabel', 'Sessions')} value={`${popularPkg.sessions} ${t('physio.treatment.detail.sessions', 'sessions')}`} />
              <InfoItem icon="⏱️" label={t('physio.treatment.detail.sessionDuration', 'Session Duration')} value={t('physio.treatment.detail.durationValue', '45 min')} />
              <InfoItem icon="🏠" label={t('physio.treatment.detail.homeVisitLabel', 'Home Visit')} value={t('physio.treatment.detail.available', 'Available')} valueColor="#059669" />
              <InfoItem icon="💻" label={t('physio.treatment.detail.online', 'Online')} value={t('physio.treatment.detail.available', 'Available')} valueColor="#059669" />
              <InfoItem icon="🏅" label={t('physio.treatment.detail.therapists', 'Therapists')} value={`${therapists.length}+ ${t('physio.treatment.detail.certified', 'Certified')}`} valueColor={theme} />
              <InfoItem icon="🔄" label={t('physio.treatment.detail.followUp', 'Follow-up')} value={t('physio.treatment.detail.free', 'Free Assessment')} valueColor="#059669" />
            </div>
            <div style={{ borderTop: '1px solid #f0f0f0', marginTop: 10, paddingTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 11, color: '#888' }}>
                <strong style={{ color: '#555' }}>{t('physio.treatment.detail.savings', 'Savings')}:</strong> {popularPkg.originalPrice > popularPkg.price ? `₹${popularPkg.originalPrice - popularPkg.price} (${Math.round((1 - popularPkg.price / popularPkg.originalPrice) * 100)}% off)` : t('physio.treatment.detail.bestPrice', 'Best Price')}
              </div>
              <div style={{ fontSize: 10, color: '#aaa' }}>{t('physio.treatment.detail.safeHygienic', '🛡️ Safe & Hygienic')}</div>
            </div>
          </div>
        </div>

        {/* ===== 17. SEO STRUCTURED DATA ===== */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'MedicalWebPage',
            name: `${conditionName} Physiotherapy Treatment`,
            description: category.description,
            url: typeof window !== 'undefined' ? window.location.href : '',
            about: {
              '@type': 'MedicalCondition',
              name: conditionName,
              associatedAnatomy: category.name,
            },
            offers: {
              '@type': 'Offer',
              price: popularPkg.price,
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
            },
          })
        }} />
      </div>

      {/* ===== STICKY MOBILE BOOKING BAR ===== */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999, background: '#fff', boxShadow: '0 -4px 16px rgba(0,0,0,0.08)', padding: '8px 16px 12px', display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid #eee' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conditionName}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#e53935' }}>₹{popularPkg.price}</span>
            {popularPkg.originalPrice > popularPkg.price && (
              <span style={{ fontSize: 11, color: '#999', textDecoration: 'line-through' }}>₹{popularPkg.originalPrice}</span>
            )}
            <span style={{ fontSize: 10, color: '#059669', fontWeight: 600 }}>{t('physio.treatment.detail.freeAssessment', 'Free Assessment')}</span>
          </div>
        </div>
        <a href="tel:+919700104108" style={{ width: 40, height: 40, borderRadius: '50%', background: theme, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none', color: '#fff', fontSize: 18 }}>📞</a>
        <Link to={`/physiotherapy/book?treatment=${slug}`} className="btn btn-primary" style={{ background: '#FF3B30', border: 'none', fontSize: 12, fontWeight: 700, padding: '10px 20px', borderRadius: 10, color: '#fff', textDecoration: 'none', boxShadow: '0 4px 14px rgba(255,59,48,0.3)', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center' }}>
          {t('physio.treatment.detail.bookNow', '📋 Book Now')}
        </Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .page-section { padding: 0; }
          .container { padding-left: 12px; padding-right: 12px; }
        }
        .btn-primary { transition: all 0.2s; border-radius: 10px; cursor: pointer; font-family: inherit; }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
      `}</style>
    </div>
  );
}
