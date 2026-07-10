import { useT } from '../i18n/LanguageProvider';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vaccines } from '../data/vaccinationData.js';

const DISMISSED_KEY = 'jh_vaccine_cross_sell_dismissed';

const RECOMMENDATIONS = [
  {
    key: 'travel',
    message:
      'Planning travel? Get mandatory vaccines at home \u2014 Typhoid, Hepatitis A, Meningococcal, Yellow Fever, and more.',
    slug: 'travel',
    matchCondition(c) {
      if (!c) return false;
      const n = c.toLowerCase();
      return n.includes('travel') || n.includes('umrah') || n.includes('haji');
    },
    matchAge() {
      return false;
    },
  },
  {
    key: 'tdap',
    message:
      'Protect yourself & your baby. Tdap vaccine in 3rd trimester, HPV for young adults.',
    slug: 'tdap',
    matchCondition(c) {
      if (!c) return false;
      const n = c.toLowerCase();
      return (
        n.includes('pregnancy') ||
        n.includes('pregnant') ||
        n.includes('planning') ||
        n.includes('baby')
      );
    },
    matchAge() {
      return false;
    },
  },
  {
    key: 'seniors',
    message:
      'Shingles, Pneumonia, & Flu vaccines \u2014 specially priced senior package.',
    slug: 'seniors',
    matchCondition() {
      return false;
    },
    matchAge(age) {
      return age > 60;
    },
  },
  {
    key: 'baby',
    message:
      'Complete baby vaccination schedule at home. BCG, Polio, Pentavalent, MMR & more.',
    slug: 'baby',
    matchCondition() {
      return false;
    },
    matchAge(age, _hasChildren) {
      return age < 2;
    },
  },
  {
    key: 'hpv',
    message:
      'HPV vaccine recommended for children 9-14. Protects against cervical cancer.',
    slug: 'hpv',
    matchCondition(c) {
      if (!c) return false;
      const n = c.toLowerCase();
      return n.includes('cancer') || n.includes('hpv');
    },
    matchAge(age) {
      return age >= 9 && age <= 14;
    },
  },
  {
    key: 'flu',
    message:
      'Annual Flu shot & Pneumonia vaccine recommended for chronic conditions.',
    slug: 'flu',
    matchCondition(c) {
      if (!c) return false;
      const n = c.toLowerCase();
      return n.includes('diabetes') || n.includes('heart') || n.includes('kidney');
    },
    matchAge() {
      return false;
    },
  },
  {
    key: 'complete',
    message:
      '50+ vaccines at home. Certified nurses, safe storage, digital records. Book now.',
    slug: 'complete',
    matchCondition() {
      return true;
    },
    matchAge() {
      return true;
    },
  },
];

function determineRecommendation(patientAge, patientCondition, hasChildren) {
  const nonDefault = RECOMMENDATIONS.slice(0, -1);

  if (patientCondition) {
    const c = String(patientCondition);
    for (const rec of nonDefault) {
      if (rec.matchCondition(c)) return rec;
    }
  }

  if (patientAge !== undefined && patientAge !== null) {
    const age = Number(patientAge);
    if (!isNaN(age)) {
      for (const rec of nonDefault) {
        if (rec.matchAge(age, hasChildren)) return rec;
      }
    }
  }

  if (hasChildren) return RECOMMENDATIONS[3];

  return RECOMMENDATIONS[RECOMMENDATIONS.length - 1];
}

function getDismissedSlugs() {
  try {
    const val = localStorage.getItem(DISMISSED_KEY);
    if (val) return JSON.parse(val);
  } catch {}
  return [];
}

function persistDismissedSlug(slug) {
  try {
    const current = getDismissedSlugs();
    if (!current.includes(slug)) {
      current.push(slug);
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(current));
    }
  } catch {}
}

export default function VaccineCrossSell({
  patientAge,
  patientCondition,
  hasChildren = false,
  source = 'dashboard',
  compact = false,
}) {
  const { t } = useT();
  const rec = determineRecommendation(patientAge, patientCondition, hasChildren);

  const [dismissed, setDismissed] = useState(() => {
    const slugs = getDismissedSlugs();
    return slugs.includes(rec.slug);
  });

  useEffect(() => {
    const slugs = getDismissedSlugs();
    setDismissed(slugs.includes(rec.slug));
  }, [rec.slug]);

  if (dismissed) return null;

  const handleDismiss = () => {
    persistDismissedSlug(rec.slug);
    setDismissed(true);
  };

  const ctaPath = `/vaccination/book?source=${source}&condition=${rec.slug}`;

  if (compact) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 14px',
          backgroundColor: '#e3f2fd',
          border: '1px solid #90caf9',
          borderRadius: '8px',
          fontSize: '13px',
          lineHeight: 1.4,
        }}
      >
        <span role="img" aria-label="vaccine" style={{ fontSize: '18px' }}>
          {'\uD83D\uDC89'}
        </span>
        <span style={{ flex: 1, color: '#0D47A1' }}>
          {t(`vaccine.crossell.${rec.key}.message`, rec.message)}
        </span>
        <Link
          to={ctaPath}
          style={{
            color: '#0D47A1',
            fontWeight: 600,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            fontSize: '13px',
          }}
        >
          {t('vaccine.crossell.bookNow', 'Book Now')}
        </Link>
        <button
          onClick={handleDismiss}
          aria-label={t('vaccine.crossell.dismiss', 'Dismiss')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#90caf9',
            fontSize: '16px',
            padding: '0 2px',
            lineHeight: 1,
          }}
        >
          {'\u2715'}
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        border: '1px solid #90caf9',
        borderLeft: '4px solid #0D47A1',
        borderRadius: '10px',
        backgroundColor: '#e3f2fd',
        padding: '20px 24px',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <button
        onClick={handleDismiss}
        aria-label={t('vaccine.crossell.dismiss', 'Dismiss')}
        style={{
          position: 'absolute',
          top: '10px',
          right: '12px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#90caf9',
          fontSize: '18px',
          padding: '4px 6px',
          lineHeight: 1,
          borderRadius: '4px',
        }}
      >
        {'\u2715'}
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div
          style={{
            backgroundColor: '#bbdefb',
            borderRadius: '8px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span role="img" aria-label="vaccine" style={{ fontSize: '24px' }}>
            {'\uD83D\uDC89'}
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              margin: '0 0 6px',
              fontSize: '16px',
              fontWeight: 700,
              color: '#0D47A1',
            }}
          >
            {t('vaccine.crossell.heading', 'Vaccination Recommended')}
          </h3>

          <p
            style={{
              margin: '0 0 14px',
              fontSize: '14px',
              color: '#1565C0',
              lineHeight: 1.5,
              maxWidth: '520px',
            }}
          >
            {t(`vaccine.crossell.${rec.key}.message`, rec.message)}
          </p>

          <Link
            to={ctaPath}
            style={{
              display: 'inline-block',
              backgroundColor: '#0D47A1',
              color: '#fff',
              padding: '10px 22px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            {t('vaccine.crossell.book', 'Book Vaccination')}
          </Link>

          <p
            style={{
              margin: '10px 0 0',
              fontSize: '11px',
              color: '#90caf9',
            }}
          >
            {t(
              'vaccine.crossell.poweredBy',
              'Powered by Jeevan Healthcare Vaccination Services'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
