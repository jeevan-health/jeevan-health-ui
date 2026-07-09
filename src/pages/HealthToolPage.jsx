import { useParams, Link } from 'react-router-dom';
import BmiCalculator from '../components/healthTools/BmiCalculator';
import HeartHealthCalculator from '../components/healthTools/HeartHealthCalculator';
import { CalorieCalc, DiabetesRiskCalc, IdealWeightCalc, BoneHealthCalc, StressWellnessCalc } from '../components/healthTools/ExtraCalculators';

const CALCULATORS = {
  'bmi-calculator': {
    title: 'BMI Calculator',
    description: 'Calculate your Body Mass Index (BMI) and understand your health category. BMI helps assess if you are underweight, normal, overweight, or obese.',
    icon: '⚖️',
    color: '#1866C9',
    component: BmiCalculator,
  },
  'bmr-calculator': {
    title: 'Daily Calorie & BMR Calculator',
    description: 'Calculate your Basal Metabolic Rate (BMR) and daily calorie needs based on your age, gender, height, weight, and activity level.',
    icon: '🔥',
    color: '#F97316',
    component: CalorieCalc,
  },
  'diabetes-risk-calculator': {
    title: 'Diabetes Risk Assessment',
    description: 'Assess your risk of developing type 2 diabetes. Early detection and lifestyle changes can significantly reduce your risk.',
    icon: '🩸',
    color: '#F59E0B',
    component: DiabetesRiskCalc,
  },
  'heart-risk-calculator': {
    title: 'Heart Risk Assessment',
    description: 'Evaluate your risk of heart disease based on lifestyle, family history, and health factors. Early intervention can prevent complications.',
    icon: '❤️',
    color: '#DC2626',
    component: HeartHealthCalculator,
  },
  'ideal-weight-calculator': {
    title: 'Ideal Weight Calculator',
    description: 'Find your ideal weight range based on height and gender. Maintain a healthy weight for better overall wellness.',
    icon: '📏',
    color: '#06B6D4',
    component: IdealWeightCalc,
  },
  'bone-health-calculator': {
    title: 'Bone Health Assessment',
    description: 'Assess your risk of osteoporosis and bone health issues. Early detection can help prevent fractures.',
    icon: '🦴',
    color: '#6366F1',
    component: BoneHealthCalc,
  },
};

export default function HealthToolPage() {
  const { slug } = useParams();
  const tool = CALCULATORS[slug];

  if (!tool) {
    return (
      <div className="page-section container text-center" style={{ padding: '80px 16px' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔬</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Calculator Not Found</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>The health calculator you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  const Component = tool.component;

  return (
    <div className="page-section container" style={{ maxWidth: 640, margin: '0 auto', padding: '32px 16px' }}>
      <Link to="/" style={{ fontSize: 12, color: '#1866C9', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
        ← Home
      </Link>

      <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 32 }}>{tool.icon}</span>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>{tool.title}</h1>
            <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0', lineHeight: 1.5 }}>{tool.description}</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 20 }}>
          <Component />
        </div>

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>
            This calculator is for informational purposes only and is not a substitute for professional medical advice.
            Always consult your healthcare provider for personalized health guidance.
          </p>
        </div>
      </div>
    </div>
  );
}

export { CALCULATORS };