import { useState } from 'react';
import { TOOLS } from '../../utils/healthCalculations';
import HealthToolModal from './HealthToolModal';
import { useT } from '../../i18n/LanguageProvider';
import BmiCalculator from './BmiCalculator';
import BpCalculator from './BpCalculator';
import HeartHealthCalculator from './HeartHealthCalculator';
import MenstrualCycleCalc from './MenstrualCycleCalc';
import OvulationFertility from './OvulationFertility';
import PregnancyDueDateCalc from './PregnancyDueDateCalc';
import PregnancyHealthTracker from './PregnancyHealthTracker';
import ChildGrowthCalculator from './ChildGrowthCalculator';
import { IdealWeightCalc, CalorieCalc, DiabetesRiskCalc, BoneHealthCalc, StressWellnessCalc } from './ExtraCalculators';

const CALCULATORS = {
  bmi: { comp: BmiCalculator, title: 'BMI Calculator', icon: '⚖️' },
  bp: { comp: BpCalculator, title: 'Blood Pressure Tracker', icon: '🫀' },
  heart: { comp: HeartHealthCalculator, title: 'Heart Health Assessment', icon: '❤️' },
  menstrual: { comp: MenstrualCycleCalc, title: 'Menstrual Cycle Calculator', icon: '📅' },
  ovulation: { comp: OvulationFertility, title: 'Ovulation & Fertility', icon: '🌸' },
  pregnancy: { comp: PregnancyDueDateCalc, title: 'Pregnancy Due Date Calculator', icon: '🤰' },
  pregnancyTracker: { comp: PregnancyHealthTracker, title: 'Pregnancy Health Tracker', icon: '👶' },
  child: { comp: ChildGrowthCalculator, title: 'Child Growth Tracker', icon: '👶' },
  diabetes: { comp: DiabetesRiskCalc, title: 'Diabetes Risk Calculator', icon: '🩸' },
  calorie: { comp: CalorieCalc, title: 'Daily Calorie Calculator', icon: '🔥' },
  bone: { comp: BoneHealthCalc, title: 'Bone Health Assessment', icon: '🦴' },
  wellness: { comp: StressWellnessCalc, title: 'Stress & Wellness Check', icon: '🧠' },
  idealWeight: { comp: IdealWeightCalc, title: 'Ideal Weight Calculator', icon: '📏' },
};

export default function HealthToolsGrid() {
  const t = useT();
  const [openTool, setOpenTool] = useState(null);

  const activeCalc = CALCULATORS[openTool];

  return (
    <>
      <div className="card" style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          🩺 {t('healthTools.title', 'Health Tools')}
          <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 400 }}>{t('healthTools.tapToUse', '(Tap to use)')}</span>
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: 8 }}>
          {TOOLS.map(tool => (
            <button
              key={tool.key}
              onClick={() => setOpenTool(tool.key)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                padding: '10px 4px', borderRadius: 10, border: 'none',
                background: openTool === tool.key ? `${tool.color}15` : '#f8f9fa',
                cursor: 'pointer', fontFamily: 'inherit', width: '100%',
                transition: 'all 0.15s', borderBottom: `2px solid ${openTool === tool.key ? tool.color : 'transparent'}`,
              }}
            >
              <span style={{ fontSize: 20 }}>{tool.icon}</span>
              <span style={{ fontSize: 9, color: '#64748b', fontWeight: 500, lineHeight: 1.2, textAlign: 'center' }}>{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      <HealthToolModal
        open={!!activeCalc}
        onClose={() => setOpenTool(null)}
        title={activeCalc?.title || ''}
        icon={activeCalc?.icon || ''}
      >
        {activeCalc && <activeCalc.comp />}
      </HealthToolModal>
    </>
  );
}
