import React from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n/LanguageProvider';

export default function Onboarding() {
  const t = useT();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-body)', padding: 16, textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🏥</div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>{t('onboarding.title', 'Jeevan HealthCare at Home')}</h1>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 320, marginBottom: 24 }}>
        {t('onboarding.subtitle', "India's most trusted diagnostics platform. Book tests online and get free home sample collection.")}
      </p>
      <Link to="/signup" className="btn btn-primary btn-lg" style={{ padding: '14px 48px', fontSize: 16 }}>{t('onboarding.getStarted', 'Get Started')}</Link>
      <Link to="/" style={{ marginTop: 12, fontSize: 13, color: 'var(--primary)' }}>{t('onboarding.browseTests', 'Browse tests →')}</Link>
    </div>
  );
}
