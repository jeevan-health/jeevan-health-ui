import { Link } from 'react-router-dom';
import useSettingsStore from '../stores/settingsStore';

/** Banner when patient is in reports-only launch mode */
export default function FeatureGateBanner() {
  const reportsOnly = useSettingsStore((s) => s.reportsOnly);
  const accessMessage = useSettingsStore((s) => s.accessMessage);
  const accessMode = useSettingsStore((s) => s.accessMode);

  if (!reportsOnly) return null;

  return (
    <div style={{
      margin: '0 0 14px',
      padding: '12px 14px',
      borderRadius: 12,
      background: 'linear-gradient(135deg, #EFF6FF, #F0FDF4)',
      border: '1px solid #bfdbfe',
      fontSize: 12,
      color: '#1e3a5f',
      lineHeight: 1.5,
    }}
    >
      <div style={{ fontWeight: 800, marginBottom: 4 }}>📋 Reports access active</div>
      <div>
        {accessMessage
          || 'Full booking is not open yet. You can view lab reports and manage your profile.'}
      </div>
      <div style={{ marginTop: 8 }}>
        <Link to="/dashboard?tab=reports" style={{ color: '#1866C9', fontWeight: 700 }}>
          Open my reports →
        </Link>
        {accessMode === 'reports_only_camp_users' && (
          <span style={{ color: '#64748b', marginLeft: 8 }}>(camp registration mode)</span>
        )}
      </div>
    </div>
  );
}
