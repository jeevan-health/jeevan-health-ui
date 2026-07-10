import { useT } from '../i18n/LanguageProvider';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RECOMMENDATIONS = [
  {
    key: 'diabetes',
    label: 'Diabetes Physio',
    message:
      'Your HbA1c indicates diabetes. Our physiotherapy program helps manage blood sugar through exercise & lifestyle guidance.',
    slug: 'diabetes-physio',
    matchTest(name, _value, _status) {
      const n = name.toLowerCase();
      return (n.includes('hba1c') || n.includes('hemoglobin')) && parseFloat(_value) > 6.5;
    },
    matchCondition(c) {
      return c === 'diabetes';
    },
  },
  {
    key: 'weight',
    label: 'Weight Management',
    message:
      'Weight management physiotherapy \u2014 personalized exercise program to help you lose weight safely.',
    slug: 'weight-management',
    matchTest(name, _value) {
      return name.toLowerCase().includes('bmi') && parseFloat(_value) > 30;
    },
    matchCondition(c) {
      return c === 'obesity' || c === 'overweight';
    },
  },
  {
    key: 'cardiac',
    label: 'Cardiac Rehab',
    message:
      'Heart health physiotherapy \u2014 cardiac rehabilitation program to strengthen your heart.',
    slug: 'cardiac-rehab',
    matchTest(name, _value) {
      const n = name.toLowerCase();
      return (n.includes('cholesterol') || n.includes('ldl')) && parseFloat(_value) > 200;
    },
    matchCondition(c) {
      return c.includes('cardiac') || c.includes('heart') || c === 'cholesterol';
    },
  },
  {
    key: 'pain',
    label: 'Pain Relief',
    message:
      'We noticed you may have joint/back concerns. Our pain relief package starts at \u20B94,499.',
    slug: 'pain-relief',
    matchTest(name, _value, _status) {
      const n = name.toLowerCase();
      const s = (_status || '').toLowerCase();
      return n.includes('back') || n.includes('joint') || n.includes('pain') || s.includes('pain');
    },
    matchCondition(c) {
      return c.includes('pain') || c.includes('back') || c.includes('joint');
    },
  },
  {
    key: 'senior',
    label: 'Senior Care',
    message:
      'Senior care physiotherapy at home. Improve mobility, prevent falls, stay independent.',
    slug: 'senior-care',
    matchTest(name, _value) {
      return name.toLowerCase().includes('age') && parseFloat(_value) > 60;
    },
    matchCondition(c) {
      return c.includes('senior') || c.includes('elder') || c === 'age';
    },
  },
  {
    key: 'womens',
    label: "Women's Health",
    message:
      'Pregnancy & post-natal physiotherapy \u2014 safe exercises for you and your baby.',
    slug: 'womens-health',
    matchTest(name) {
      const n = name.toLowerCase();
      return n.includes('pregnan') || n.includes('natal');
    },
    matchCondition(c) {
      return c.includes('pregnan') || c.includes('natal') || c === 'postnatal';
    },
  },
  {
    key: 'general',
    label: 'General Physio',
    message: 'Complete physiotherapy care at home. Recover faster with expert guidance.',
    slug: 'general-physio',
    matchTest() {
      return true;
    },
    matchCondition() {
      return true;
    },
  },
];

function determineRecommendation(testResults, patientCondition) {
  if (Array.isArray(testResults) && testResults.length > 0) {
    for (let i = 0; i < RECOMMENDATIONS.length - 1; i++) {
      const rec = RECOMMENDATIONS[i];
      for (const result of testResults) {
        if (rec.matchTest(result.testName || '', result.value || '', result.status || '')) {
          return rec;
        }
      }
    }
  }

  if (patientCondition) {
    const c = patientCondition.toLowerCase();
    for (let i = 0; i < RECOMMENDATIONS.length - 1; i++) {
      const rec = RECOMMENDATIONS[i];
      if (rec.matchCondition(c)) {
        return rec;
      }
    }
  }

  return RECOMMENDATIONS[RECOMMENDATIONS.length - 1];
}

function PhysioIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="5" r="2" stroke="#0d9488" strokeWidth="1.5" fill="#ccfbf1" />
      <path
        d="M6 22v-5l-2-3 2-3V8c0-1.5 1-3 2.5-3S11 6.5 11 8v2l3 1 3-1V8c0-1.5 1-3 2.5-3S22 6.5 22 8v3l-2 3v5"
        stroke="#0d9488"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 17c0 2 0 5 3 5h6c3 0 3-3 3-5"
        stroke="#0d9488"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const DISMISSED_KEY = 'jh_cross_sell_dismissed';

export default function PhysioCrossSell({
  testResults,
  patientCondition,
  source = 'dashboard',
  compact = false,
}) {
  const { t } = useT();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISSED_KEY) === 'true') {
        setDismissed(true);
      }
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  if (dismissed) return null;

  const rec = determineRecommendation(testResults, patientCondition);

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, 'true');
    } catch {
      /* localStorage unavailable */
    }
    setDismissed(true);
  };

  const ctaPath = `/physiotherapy/book?source=cross-sell&condition=${rec.slug}`;

  if (compact) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 14px',
          backgroundColor: '#f0fdfa',
          border: '1px solid #99f6e4',
          borderRadius: '8px',
          fontSize: '13px',
          lineHeight: 1.4,
        }}
      >
        <PhysioIcon />
        <span style={{ flex: 1, color: '#115e59' }}>
          {t(`crossell.${rec.key}.message`, rec.message)}
        </span>
        <Link
          to={ctaPath}
          style={{
            color: '#0d9488',
            fontWeight: 600,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            fontSize: '13px',
          }}
        >
          {t('crossell.bookNow', 'Book Now')}
        </Link>
        <button
          onClick={handleDismiss}
          aria-label={t('crossell.dismiss', 'Dismiss')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#5eead4',
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
        border: '1px solid #99f6e4',
        borderLeft: '4px solid #0d9488',
        borderRadius: '10px',
        backgroundColor: '#f0fdfa',
        padding: '20px 24px',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <button
        onClick={handleDismiss}
        aria-label={t('crossell.dismiss', 'Dismiss')}
        style={{
          position: 'absolute',
          top: '10px',
          right: '12px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#5eead4',
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
            backgroundColor: '#ccfbf1',
            borderRadius: '8px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <PhysioIcon />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              margin: '0 0 6px',
              fontSize: '16px',
              fontWeight: 700,
              color: '#134e4a',
            }}
          >
            {t('crossell.recommended', 'Recommended for You')}
          </h3>

          <p
            style={{
              margin: '0 0 14px',
              fontSize: '14px',
              color: '#115e59',
              lineHeight: 1.5,
              maxWidth: '520px',
            }}
          >
            {t(`crossell.${rec.key}.message`, rec.message)}
          </p>

          <Link
            to={ctaPath}
            style={{
              display: 'inline-block',
              backgroundColor: '#0d9488',
              color: '#fff',
              padding: '10px 22px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            {t('crossell.bookSession', 'Book Physiotherapy Session')}
          </Link>

          <p
            style={{
              margin: '10px 0 0',
              fontSize: '11px',
              color: '#99f6e4',
            }}
          >
            {t('crossell.poweredBy', 'Powered by Jeevan Healthcare Physiotherapy')}
          </p>
        </div>
      </div>
    </div>
  );
}
