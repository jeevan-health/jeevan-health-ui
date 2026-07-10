import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';
import { vaccines } from '../data/vaccinationData';

const SEO_PAGES = {
  'vaccination-at-home-hyderabad': {
    title: 'Vaccination at Home Hyderabad – Doorstep Immunization',
    subtitle: 'Get vaccinated at the comfort of your home. Trained nurses with cold-chain maintained vaccines delivered to your doorstep across Hyderabad.',
    focus: 'home',
  },
  'vaccination-near-me': {
    title: 'Vaccination Near Me – Best Vaccination in Hyderabad',
    subtitle: 'Find the best vaccination services near you in Hyderabad. Book at our clinic or get a home visit for all routine and travel vaccines.',
    focus: 'local',
  },
  'flu-vaccine-cost': {
    title: 'Flu Vaccine Cost in Hyderabad – Affordable Influenza Shot',
    subtitle: 'Affordable flu vaccine in Hyderabad starting from ₹1,299. Annual influenza protection with home visit option. Book your flu shot today.',
    focus: 'pricing',
  },
  'travel-vaccination-hyderabad': {
    title: 'Travel Vaccination Hyderabad – Haji, Umrah, International Travel',
    subtitle: 'Complete travel vaccination services in Hyderabad. Yellow fever, meningitis, typhoid, hepatitis — with WHO-certified certificates for international travel.',
    focus: 'travel',
  },
  'childhood-vaccination-schedule': {
    title: 'Childhood Vaccination Schedule – Complete Baby Immunization',
    subtitle: 'Complete childhood immunization schedule from birth to adolescence. All routine vaccines including BCG, Pentavalent, MMR, and boosters.',
    focus: 'pediatric',
  },
  'hpv-vaccine-hyderabad': {
    title: 'HPV Vaccine Hyderabad – Cervical Cancer Prevention',
    subtitle: 'HPV vaccine in Hyderabad starting at ₹3,499. Protect against cervical cancer with Gardasil vaccine. Safe for girls and women aged 9-45.',
    focus: 'women',
  },
  'typhoid-vaccine-cost': {
    title: 'Typhoid Vaccine Cost – Oral & Injectable Options',
    subtitle: 'Typhoid vaccine at affordable prices. Oral and injectable options available. Protection against typhoid fever for the whole family.',
    focus: 'pricing',
  },
  'hepatitis-b-vaccine': {
    title: 'Hepatitis B Vaccine – Schedule, Dose & Cost',
    subtitle: 'Complete Hepatitis B vaccination schedule at ₹499 per dose. 4-dose series for infants and 3-dose series for adults. Book at home.',
    focus: 'adult',
  },
  'dengue-fever-vaccine': {
    title: 'Dengue Fever Prevention – Vaccination & Awareness',
    subtitle: 'Dengue vaccine in Hyderabad for ages 9-45. Protect against all 4 serotypes. Recommended for those with prior dengue infection.',
    focus: 'seasonal',
  },
  'vaccination-for-seniors': {
    title: 'Vaccination for Senior Citizens – Shingles, Pneumonia & Flu',
    subtitle: 'Essential vaccines for senior citizens including shingles (Shingrix), pneumococcal, influenza, and tetanus. Home vaccination available.',
    focus: 'geriatric',
  },
  'corporate-vaccination-camp': {
    title: 'Corporate Vaccination Camp – On-site Immunization for Employees',
    subtitle: 'On-site corporate vaccination camps in Hyderabad. Flu shots, hepatitis, typhoid, and more for your workforce. Bulk booking with health reports.',
    focus: 'corporate',
  },
  'baby-vaccination-at-home': {
    title: 'Baby Vaccination at Home – Safe Infant Immunization',
    subtitle: 'Safe infant vaccination at home. Trained pediatric nurses administer birth doses and routine vaccines in a comfortable home environment.',
    focus: 'infant',
  },
};

const CATEGORY_MAP = {
  'vaccination-at-home-hyderabad': ['baby', 'child', 'adult', 'women', 'senior', 'travel', 'newborn'],
  'vaccination-near-me': ['baby', 'child', 'adult', 'women', 'senior', 'travel'],
  'flu-vaccine-cost': ['adult'],
  'travel-vaccination-hyderabad': ['travel'],
  'childhood-vaccination-schedule': ['baby', 'child', 'newborn'],
  'hpv-vaccine-hyderabad': ['women'],
  'typhoid-vaccine-cost': ['child', 'travel'],
  'hepatitis-b-vaccine': ['baby', 'adult'],
  'dengue-fever-vaccine': ['travel'],
  'vaccination-for-seniors': ['senior'],
  'corporate-vaccination-camp': ['baby', 'child', 'adult', 'women', 'senior', 'travel'],
  'baby-vaccination-at-home': ['baby', 'newborn'],
};

const WHY_CHOOSE = {
  home: [
    { icon: '🏠', title: 'doorstep.service', desc: 'Trained nurses visit your home with all vaccines in cold-chain maintained carriers' },
    { icon: '🗺️', title: 'all.hyderabad', desc: 'Serving all areas including Gachibowli, Madhapur, Kukatpally, Banjara Hills & more' },
    { icon: '⏰', title: 'flexible.timing', desc: 'Morning and evening slots available — book at your convenience' },
    { icon: '📋', title: 'digital.records', desc: 'Digital vaccination records with automated dose reminders' },
  ],
  local: [
    { icon: '📍', title: 'multiple.locations', desc: 'Vaccination centers across Hyderabad for easy access' },
    { icon: '📱', title: 'instant.booking', desc: 'Book your slot in minutes — no waiting, no hassle' },
    { icon: '🧑‍⚕️', title: 'expert.staff', desc: 'Trained healthcare professionals for safe vaccine administration' },
    { icon: '⭐', title: 'trusted.service', desc: 'Trusted by 10000+ families across Hyderabad' },
  ],
  pricing: [
    { icon: '💰', title: 'best.prices', desc: 'Affordable vaccination packages with no hidden charges' },
    { icon: '📊', title: 'price.match', desc: 'We match or beat any legitimate price quote' },
    { icon: '📦', title: 'family.packages', desc: 'Special discounts on family vaccination packages' },
    { icon: '🔄', title: 'transparent.pricing', desc: 'Clear pricing with full cost breakdown before booking' },
  ],
  travel: [
    { icon: '✈️', title: 'travel.ready', desc: 'All travel vaccines including yellow fever, typhoid, hepatitis, meningitis' },
    { icon: '📜', title: 'international.cert', desc: 'WHO-certified vaccination certificates for travel requirements' },
    { icon: '⏱️', title: 'quick.schedule', desc: 'Rapid vaccination schedules for last-minute travel needs' },
    { icon: '🩺', title: 'travel.consult', desc: 'Expert consultation on destination-specific vaccine requirements' },
  ],
  pediatric: [
    { icon: '👶', title: 'baby.friendly', desc: 'Gentle vaccine administration by trained pediatric nurses' },
    { icon: '📅', title: 'complete.schedule', desc: 'Full immunization schedule from birth to adolescence' },
    { icon: '📱', title: 'reminder.service', desc: 'Automated reminders for each vaccine dose and booster' },
    { icon: '📋', title: 'growth.tracking', desc: 'Digital vaccination records integrated with growth monitoring' },
  ],
  women: [
    { icon: '👩', title: 'women.focused', desc: 'Specialized vaccines for women including HPV and Tdap' },
    { icon: '🛡️', title: 'cancer.prevention', desc: 'HPV vaccine for cervical cancer prevention' },
    { icon: '🤰', title: 'pregnancy.safe', desc: 'Safe vaccination during pregnancy for mother and baby' },
    { icon: '⭐', title: 'expert.guidance', desc: 'Consult with gynecologists on recommended vaccines' },
  ],
  adult: [
    { icon: '💪', title: 'adult.protection', desc: 'Essential vaccines for adults including flu, hepatitis, tetanus' },
    { icon: '🏥', title: 'health.screening', desc: 'Pre-vaccination health assessment included' },
    { icon: '📊', title: 'immunity.check', desc: 'Titer testing to check immunity levels before vaccination' },
    { icon: '🔄', title: 'booster.reminders', desc: 'Track when your next booster dose is due' },
  ],
  seasonal: [
    { icon: '🌡️', title: 'seasonal.protection', desc: 'Protect against seasonal outbreaks and epidemics' },
    { icon: '🦟', title: 'mosquito.borne', desc: 'Vaccines for dengue and other vector-borne diseases' },
    { icon: '📢', title: 'outbreak.alerts', desc: 'Stay informed about vaccine-preventable disease outbreaks' },
    { icon: '🏠', title: 'family.protection', desc: 'Protect the whole family during seasonal outbreaks' },
  ],
  geriatric: [
    { icon: '👴', title: 'senior.care', desc: 'Vaccines designed for aging immune systems' },
    { icon: '🛡️', title: 'shingles.protection', desc: 'Shingrix vaccine to prevent painful shingles' },
    { icon: '🫁', title: 'pneumonia.prevention', desc: 'Pneumococcal vaccine for seniors 60+' },
    { icon: '🏠', title: 'home.vaccination', desc: 'Convenient home vaccination for seniors with mobility issues' },
  ],
  corporate: [
    { icon: '🏢', title: 'onsite.camps', desc: 'Vaccination camps at your workplace for employee wellness' },
    { icon: '📋', title: 'bulk.booking', desc: 'Efficient vaccination for large groups and departments' },
    { icon: '📊', title: 'health.reports', desc: 'Detailed vaccination reports for HR and management' },
    { icon: '💼', title: 'employee.wellness', desc: 'Boost employee health and productivity with preventive care' },
  ],
  infant: [
    { icon: '🍼', title: 'newborn.care', desc: 'Birth doses administered safely by trained pediatric nurses' },
    { icon: '🏠', title: 'home.visit', desc: 'No need to take the newborn out — we come to you' },
    { icon: '🧸', title: 'gentle.technique', desc: 'Specially trained in infant vaccine administration' },
    { icon: '📱', title: 'digital.records', desc: 'Complete digital immunization record from day one' },
  ],
};

const PRICING_VACCINES = {
  'vaccination-at-home-hyderabad': ['flu-vaccine', 'typhoid-vaccine', 'hpv-vaccine'],
  'vaccination-near-me': ['flu-vaccine', 'pentavalent-vaccine', 'typhoid-vaccine'],
  'flu-vaccine-cost': ['flu-vaccine', 'tetanus-vaccine', 'pneumococcal-adult-vaccine'],
  'travel-vaccination-hyderabad': ['yellow-fever-vaccine', 'meningococcal-vaccine', 'hepatitis-a-vaccine'],
  'childhood-vaccination-schedule': ['pentavalent-vaccine', 'mmr-vaccine', 'pcv-vaccine'],
  'hpv-vaccine-hyderabad': ['hpv-vaccine', 'tdap-vaccine', 'hepatitis-b-vaccine'],
  'typhoid-vaccine-cost': ['typhoid-vaccine', 'hepatitis-a-vaccine', 'cholera-vaccine'],
  'hepatitis-b-vaccine': ['hepatitis-b-vaccine', 'flu-vaccine', 'tetanus-vaccine'],
  'dengue-fever-vaccine': ['dengue-vaccine', 'flu-vaccine', 'typhoid-vaccine'],
  'vaccination-for-seniors': ['shingles-vaccine', 'pneumococcal-adult-vaccine', 'flu-vaccine'],
  'corporate-vaccination-camp': ['flu-vaccine', 'typhoid-vaccine', 'hepatitis-b-vaccine'],
  'baby-vaccination-at-home': ['bcg-vaccine', 'hepatitis-b-vaccine', 'pentavalent-vaccine'],
};

const FAQS = {
  'vaccination-at-home-hyderabad': [
    { q: 'Which areas of Hyderabad do you cover for home vaccination?', a: 'We cover all major areas including Gachibowli, Madhapur, Hitech City, Kukatpally, Banjara Hills, Jubilee Hills, Secunderabad, LB Nagar, Miyapur, and more.' },
    { q: 'How are vaccines kept cold during transport?', a: 'Our nurses carry vaccines in certified cold-chain maintained carriers with temperature monitoring to ensure vaccine efficacy.' },
    { q: 'Can I book a same-day home vaccination?', a: 'Yes, same-day home vaccination is available depending on nurse availability in your area.' },
    { q: 'Is home vaccination safe for infants?', a: 'Absolutely. Our pediatric nurses are trained in infant vaccination and maintain strict safety protocols.' },
  ],
  'vaccination-near-me': [
    { q: 'How do I find a vaccination center near me in Hyderabad?', a: 'Use Jeevan Healthcare to find vaccination services near you. Book at our clinic or opt for a home visit.' },
    { q: 'Are vaccines available on weekends near me?', a: 'Yes, weekend appointments are available at all our vaccination centers across Hyderabad.' },
    { q: 'How much does vaccination cost near me?', a: 'Vaccination prices start from ₹299 for basic vaccines. Full pricing is transparent with no hidden charges.' },
    { q: 'Can I get a same-day vaccination appointment near me?', a: 'Yes, same-day appointments are available at most locations. Book online for a confirmed slot within minutes.' },
    { q: 'Do I need a prescription for vaccination?', a: 'Most routine vaccines do not require a prescription. Travel vaccines may need a consultation first.' },
  ],
  'flu-vaccine-cost': [
    { q: 'What is the cost of a flu shot in Hyderabad?', a: 'The flu vaccine costs ₹1,299 per dose. We also offer family packages with discounts on multiple doses.' },
    { q: 'How often do I need a flu vaccine?', a: 'The flu vaccine is recommended annually as flu strains change each year.' },
    { q: 'Is the flu vaccine covered by insurance?', a: 'Many health insurance plans cover the annual flu shot. We provide invoices for insurance claims.' },
    { q: 'Can I get the flu vaccine at home?', a: 'Yes, home vaccination for flu is available across Hyderabad at no extra cost.' },
  ],
  'travel-vaccination-hyderabad': [
    { q: 'Which travel vaccines do I need for Hajj or Umrah?', a: 'Meningococcal vaccine is mandatory for Hajj and Umrah. Yellow fever may be required based on your travel route.' },
    { q: 'How far in advance should I get travel vaccines?', a: 'Ideally 4-6 weeks before travel to allow time for vaccine schedules to complete and immunity to develop.' },
    { q: 'Do you provide WHO-certified yellow fever certificates?', a: 'Yes, we provide the official WHO International Certificate of Vaccination for yellow fever.' },
    { q: 'What travel vaccines are recommended for international travel?', a: 'Common travel vaccines include hepatitis A, typhoid, yellow fever, meningitis, polio booster, and rabies.' },
  ],
  'childhood-vaccination-schedule': [
    { q: 'What is the complete childhood vaccination schedule?', a: 'The schedule starts at birth with BCG, OPV, and Hepatitis B. Followed by Pentavalent, PCV, Rotavirus, IPV at 6, 10, 14 weeks. MMR at 9 months. Boosters continue until 5 years.' },
    { q: 'What happens if my child misses a vaccine dose?', a: 'Catch-up vaccination is possible. Consult our pediatrician to create a customized catch-up schedule.' },
    { q: 'Are childhood vaccines safe?', a: 'Yes, all vaccines in our schedule are WHO-approved and extensively tested for safety and efficacy.' },
    { q: 'Can I get the entire vaccination schedule done at home?', a: 'Most childhood vaccines can be administered at home by our trained pediatric nurses.' },
    { q: 'Do you provide a digital vaccination record?', a: 'Yes, we provide a complete digital immunization record with reminder alerts for upcoming doses.' },
  ],
  'hpv-vaccine-hyderabad': [
    { q: 'What is the cost of HPV vaccine in Hyderabad?', a: 'The HPV vaccine (Gardasil) costs ₹3,499 per dose. A 2-dose schedule for ages 9-14 and 3-dose for ages 15+.' },
    { q: 'Who should get the HPV vaccine?', a: 'The HPV vaccine is recommended for girls and boys aged 9-14 years, and can be taken up to 45 years.' },
    { q: 'Is the HPV vaccine safe?', a: 'Yes, over 120 million doses have been distributed worldwide with an excellent safety record.' },
    { q: 'Can the HPV vaccine prevent cervical cancer?', a: 'Yes, HPV causes over 99% of cervical cancer cases. The vaccine is highly effective in preventing it.' },
    { q: 'Is the HPV vaccine available at home?', a: 'Yes, the HPV vaccine can be administered at home or at our clinic.' },
  ],
  'typhoid-vaccine-cost': [
    { q: 'How much does the typhoid vaccine cost?', a: 'The injectable typhoid vaccine costs ₹999. The oral typhoid vaccine (Vivotif capsules) costs ₹1,799.' },
    { q: 'What is the difference between oral and injectable typhoid vaccine?', a: 'The injectable is a single shot with protection for 3 years. The oral is 4 capsules taken every other day with 5-year protection.' },
    { q: 'How long does the typhoid vaccine protect?', a: 'The injectable protects for 3 years, oral protects for 5 years. Boosters are recommended.' },
    { q: 'Can children get the typhoid vaccine?', a: 'Yes, the injectable is for ages 2+ and the oral for ages 6+.' },
  ],
  'hepatitis-b-vaccine': [
    { q: 'What is the schedule for Hepatitis B vaccine?', a: 'For infants: 4 doses at birth, 6, 10, and 14 weeks. For adults: 3 doses over 6 months (0, 1, 6 months).' },
    { q: 'How much does the Hepatitis B vaccine cost?', a: 'The Hepatitis B vaccine costs ₹499 per dose for the regular schedule.' },
    { q: 'How long does Hepatitis B vaccine protect?', a: 'Protection lasts for at least 20-30 years, often lifelong after completing the full series.' },
    { q: 'Can adults take the Hepatitis B vaccine?', a: 'Yes, the vaccine is recommended for all unvaccinated adults, especially healthcare workers.' },
    { q: 'Is Hepatitis B vaccine available at home?', a: 'Yes, the complete Hepatitis B schedule is available at home.' },
  ],
  'dengue-fever-vaccine': [
    { q: 'Who should get the dengue vaccine?', a: 'Individuals aged 9-45 with laboratory-confirmed prior dengue infection. Serological testing is recommended before vaccination.' },
    { q: 'What is the cost of the dengue vaccine?', a: 'The dengue vaccine costs ₹3,499 per dose. A 3-dose schedule is required over 12 months.' },
    { q: 'How effective is the dengue vaccine?', a: 'It is highly effective in preventing severe dengue in those with prior infection, reducing hospitalization risk by over 80%.' },
    { q: 'Can I get the dengue vaccine without prior infection?', a: 'The vaccine is recommended only for those with confirmed prior dengue infection due to theoretical risk.' },
  ],
  'vaccination-for-seniors': [
    { q: 'Which vaccines are essential for senior citizens?', a: 'Key vaccines include shingles (Shingrix), pneumococcal (pneumonia), annual flu shot, tetanus booster, and RSV vaccine.' },
    { q: 'Is the shingles vaccine covered by insurance?', a: 'Many senior health plans cover the Shingrix vaccine. We provide documentation for insurance claims.' },
    { q: 'Can seniors get vaccinated at home?', a: 'Yes, we offer home vaccination for seniors with mobility issues across all Hyderabad areas.' },
    { q: 'What is the cost of the shingles vaccine for seniors?', a: 'The Shingrix vaccine costs ₹4,999 per dose. A 2-dose schedule is recommended 2-6 months apart.' },
    { q: 'Is the pneumococcal vaccine a one-time dose?', a: 'The initial dose is followed by a booster after 5 years for seniors 65+.' },
  ],
  'corporate-vaccination-camp': [
    { q: 'How many employees do you need for a corporate camp?', a: 'We organize camps for a minimum of 20 employees. Larger groups get better pricing.' },
    { q: 'Which vaccines are offered in corporate camps?', a: 'We offer flu shots, hepatitis B, typhoid, tetanus, and COVID-19 vaccines for corporate employees.' },
    { q: 'How far in advance should we book a corporate camp?', a: 'We recommend booking 1-2 weeks in advance to arrange vaccines and scheduling.' },
    { q: 'Do you provide health reports for our HR team?', a: 'Yes, we provide detailed vaccination reports and certificates for each employee.' },
    { q: 'Can we schedule camps across multiple office locations?', a: 'Yes, we can coordinate camps across multiple Hyderabad locations on consecutive days.' },
  ],
  'baby-vaccination-at-home': [
    { q: 'Which vaccines can be given to babies at home?', a: 'All routine infant vaccines including BCG, Hepatitis B, OPV, Pentavalent, PCV, Rotavirus, and IPV can be given at home.' },
    { q: 'How soon after birth can I book a home vaccination?', a: 'Birth doses can be scheduled within 24 hours of delivery. Our nurse visits your home with all necessary supplies.' },
    { q: 'Is home vaccination safe for newborn babies?', a: 'Yes, our pediatric nurses are specifically trained in neonatal vaccination and follow strict safety protocols.' },
    { q: 'Do you provide a vaccination schedule reminder?', a: 'Yes, we set up automated reminders for every dose so you never miss a vaccination.' },
    { q: 'What if my baby has a reaction to the vaccine?', a: 'Our nurses stay for 30 minutes after vaccination to monitor for any immediate reactions.' },
  ],
};

const COLORS = {
  heroFrom: '#0D47A1',
  heroTo: '#1976D2',
  accent: '#F59E0B',
  accentHover: '#D97706',
  primary: '#1976D2',
  primaryLight: '#BBDEFB',
  bg: '#F5F9FF',
  text: '#0F172A',
  textMuted: '#64748B',
};

const _STEP_ICONS = ['💉', '📅', '🏠', '✅'];

function getFilteredVaccines(slug) {
  const categories = CATEGORY_MAP[slug] || ['baby', 'child', 'adult'];
  return vaccines.filter(v => categories.includes(v.category)).slice(0, 6);
}

function getPricingVaccines(slug) {
  const slugs = PRICING_VACCINES[slug] || ['flu-vaccine', 'typhoid-vaccine', 'hepatitis-b-vaccine'];
  return slugs.map(s => vaccines.find(v => v.slug === s)).filter(Boolean);
}

export default function VaccineSeoLanding() {
  const t = useT();
  const { slug } = useParams();
  const page = SEO_PAGES[slug];
  const [expandedFaq, setExpandedFaq] = useState(null);

  if (!page) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: 56, marginBottom: 12 }}>💉</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px', color: '#0F172A' }}>
            {t('vaccine.seo.notfound', 'Page Not Found')}
          </h1>
          <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 20px' }}>
            {t('vaccine.seo.notfound.desc', 'The vaccination service page you are looking for does not exist.')}
          </p>
          <Link to="/vaccination-at-home" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 24px', background: COLORS.primary, color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>
            ← {t('back.to.vaccination', 'Back to Vaccination')}
          </Link>
        </div>
      </div>
    );
  }

  const features = WHY_CHOOSE[page.focus] || WHY_CHOOSE.home;
  const faqs = FAQS[slug] || [];
  const filteredVaccines = getFilteredVaccines(slug);
  const pricingVaccines = getPricingVaccines(slug);

  return (
    <div>
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'LocalBusiness',
              name: 'Jeevan HealthCare',
              description: SEO_PAGES[slug].subtitle,
              url: `https://jeevanhealthcare.com/vaccination/seo/${slug}`,
              telephone: '+919700104108',
              areaServed: 'Hyderabad',
              address: { '@type': 'PostalAddress', addressLocality: 'Hyderabad', addressCountry: 'IN' },
              aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '3520' },
            },
            {
              '@type': 'MedicalBusiness',
              name: 'Jeevan HealthCare Vaccination Services',
              description: SEO_PAGES[slug].subtitle,
              medicalSpecialty: 'Immunization',
              availableService: filteredVaccines.map(v => ({
                '@type': 'MedicalProcedure',
                name: v.name,
                procedureType: 'Vaccination',
                price: `₹${v.price}`,
                priceCurrency: 'INR',
              })),
            },
          ],
        })}
      </script>

      <div style={{ background: `linear-gradient(135deg, ${COLORS.heroFrom} 0%, ${COLORS.heroTo} 100%)`, padding: '40px 0 48px', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/vaccination-at-home" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
            ← {t('back.to.vaccination', 'Back to Vaccination')}
          </Link>
          <h1 className="v-hero-title" style={{ color: '#fff', fontSize: 36, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.15 }}>
            {t(`vaccine.seo.${slug}.title`, page.title)}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, margin: '0 0 16px', maxWidth: 600, lineHeight: 1.5 }}>
            {t(`vaccine.seo.${slug}.subtitle`, page.subtitle)}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {[
              t('vaccine.seo.trust.certified', 'Certified'),
              t('vaccine.seo.trust.homevisit', 'Home Visit'),
              t('vaccine.seo.trust.vaccines', '50+ Vaccines'),
              t('vaccine.seo.trust.families', '10000+ Happy Families'),
            ].map(b => (
              <span key={b} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: 20 }}>
                <span style={{ color: '#22C55E', fontSize: 12 }}>✓</span> {b}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to={`/vaccination/book?source=google&kw=${slug}`} style={{ background: COLORS.accent, border: 'none', color: '#fff', height: 48, padding: '0 28px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {t('vaccine.seo.book', 'Book Vaccination')} →
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
              <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px', color: '#0f172a' }}>{t(`vaccine.seo.${slug}.feature.${f.title}`, f.title.split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))}</h3>
              <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.4 }}>{t(`vaccine.seo.${slug}.feature.${f.title}.desc`, f.desc)}</p>
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
              { icon: '💉', title: t('select.vaccine', 'Select Vaccine'), desc: t('choose.vaccine.needed', 'Choose the vaccine you need for yourself or your family') },
              { icon: '📅', title: t('book.appointment', 'Book Appointment'), desc: t('pick.date.time', 'Pick a convenient date and time for your session') },
              { icon: '🏠', title: t('visit.or.clinic', 'Visit or Clinic'), desc: t('nurse.comes.home', 'Nurse visits your home or visit our clinic') },
              { icon: '✅', title: t('get.vaccinated', 'Get Vaccinated'), desc: t('safe.vaccination', 'Safe vaccination with digital records and dose reminders') },
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

      {filteredVaccines.length > 0 && (
        <div className="page-section container">
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
            {t('our.vaccines', 'Our Vaccines')}
          </h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>
            {t('vaccines.available', 'Choose from our range of vaccines')}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
            {filteredVaccines.map(v => (
              <div key={v.id} style={{ padding: 16, borderRadius: 14, border: '1px solid #e2e8f0', background: '#fff' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{v.name}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>{v.brand}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: COLORS.primary }}>₹{v.price}</span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>per dose</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 8 }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: COLORS.primaryLight, color: COLORS.primary, fontWeight: 600 }}>{v.doseCount} dose{v.doseCount > 1 ? 's' : ''}</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: '#F3F4F6', color: '#4B5563', fontWeight: 600 }}>{v.availability}</span>
                </div>
                <p style={{ fontSize: 11, color: '#475569', margin: '0 0 10px', lineHeight: 1.4 }}>{v.description}</p>
                <Link to={`/vaccination/book?source=google&kw=${slug}&vaccine=${v.slug}`} style={{ display: 'block', textAlign: 'center', height: 36, lineHeight: '36px', borderRadius: 8, background: COLORS.primary, color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                  {t('book.now', 'Book Now')} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {pricingVaccines.length > 0 && (
        <div className="page-section" style={{ background: COLORS.bg }}>
          <div className="container">
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>
              {t('vaccine.pricing', 'Vaccination Pricing')}
            </h2>
            <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px', textAlign: 'center' }}>
              {t('vaccine.pricing.subtitle', 'Transparent pricing for popular vaccines')}
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 14, overflow: 'hidden', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: COLORS.primary, color: '#fff' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>{t('vaccine.name', 'Vaccine')}</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>{t('price', 'Price')}</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>{t('doses', 'Doses')}</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>{t('schedule', 'Schedule')}</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingVaccines.map((v, i) => (
                    <tr key={v.slug} style={{ borderBottom: i < pricingVaccines.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>{v.name}</td>
                      <td style={{ padding: '12px 16px', color: COLORS.primary, fontWeight: 700 }}>₹{v.price}<span style={{ fontWeight: 400, color: '#94a3b8', fontSize: 11 }}>/dose</span></td>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>{v.doseCount}</td>
                      <td style={{ padding: '12px 16px', color: '#475569', fontSize: 12 }}>{v.doseInterval}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {faqs.length > 0 && (
        <div className="page-section container" style={{ maxWidth: 700 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>
            {t('faq.heading', 'Frequently Asked Questions')}
          </h2>
          <div style={{ display: 'grid', gap: 8 }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ borderRadius: 10, border: '1px solid #e2e8f0', overflow: 'hidden', background: '#fff' }}>
                <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, fontFamily: 'inherit', textAlign: 'left' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', flex: 1 }}>{t(`vaccine.seo.${slug}.faq.q${i}`, f.q)}</span>
                  <span style={{ fontSize: 16, color: '#94a3b8', transition: 'transform 0.2s', transform: expandedFaq === i ? 'rotate(180deg)' : 'none' }}>▼</span>
                </button>
                {expandedFaq === i && (
                  <div style={{ padding: '0 16px 12px', fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{t(`vaccine.seo.${slug}.faq.a${i}`, f.a)}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="page-section" style={{ background: `linear-gradient(135deg, ${COLORS.heroFrom}, ${COLORS.heroTo})`, textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
            {t('vaccine.seo.cta.title', 'Protect Your Family Today')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 16 }}>
            {t('vaccine.seo.cta.subtitle', 'Book your vaccination and stay protected against preventable diseases')}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={`/vaccination/book?source=google&kw=${slug}`} style={{ background: COLORS.accent, border: 'none', color: '#fff', height: 48, padding: '0 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {t('vaccine.seo.book', 'Book Vaccination')} →
            </Link>
            <a href={`https://wa.me/919700104108?text=Hi%2C%20I%20want%20to%20know%20more%20about%20${slug}`} target="_blank" rel="noopener noreferrer" style={{ background: '#25d366', border: 'none', color: '#fff', height: 48, padding: '0 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none', borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
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
