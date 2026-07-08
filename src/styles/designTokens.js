export const colors = {
  // Primary — Cyan Blue for CTAs, buttons, highlights, links
  brandPrimary: '#00D9FF',
  brandPrimaryRgb: '0, 217, 255',
  brandPrimaryDark: '#00B8D6',
  brandPrimaryLight: '#E6FAFF',

  // Secondary — Royal Medical Blue for header, nav, footer, hero
  brandSecondary: '#1866C9',
  brandSecondaryRgb: '24, 102, 201',
  brandSecondaryDark: '#0F4A96',
  brandSecondaryLight: '#E8F1FC',

  // Supporting backgrounds
  white: '#FFFFFF',
  lightBlue: '#F4FCFF',
  lightGrey: '#F8FAFC',

  // Semantic
  success: '#2ECC71',
  successLight: '#E8F8EF',
  warning: '#FF9800',
  warningLight: '#FFF3E0',
  danger: '#EF4444',
  dangerLight: '#FDE8E8',

  // Text
  textDark: '#1a1a2e',
  textBody: '#334155',
  textSecondary: '#64748b',
  textLight: '#8b9bb5',

  // Borders
  border: '#e2e8f0',
};

export const typography = {
  fontFamily: "'Avant Garde', 'AvantGarde', 'Century Gothic', 'ITC Avant Garde Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFamilyMono: "'SF Mono', 'Fira Code', monospace",

  sizes: {
    h1: '56px',
    h2: '42px',
    h3: '32px',
    h4: '24px',
    body: '18px',
    small: '15px',
  },

  weights: {
    h1: 700,
    h2: 700,
    h3: 600,
    h4: 500,
    body: 400,
    small: 400,
  },
};

export const radii = {
  card: '24px',
  button: '16px',
  input: '12px',
  badge: '14px',
  modal: '20px',
  small: '8px',
};

export const shadows = {
  card: '0 10px 40px rgba(0, 0, 0, 0.08)',
  cardHover: '0 16px 48px rgba(0, 0, 0, 0.12)',
  button: '0 4px 14px rgba(0, 217, 255, 0.35)',
  modal: '0 20px 60px rgba(0, 0, 0, 0.15)',
  nav: '0 4px 20px rgba(0, 0, 0, 0.06)',
};

export const spacing = {
  cardPadding: '30px',
  sectionGap: '24px',
  gridGap: '12px',
};

export const animations = {
  hoverLift: 'translateY(-8px)',
  hoverScale: 'scale(1.02)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

export const gradients = {
  hero: 'linear-gradient(135deg, #1866C9 0%, #00D9FF 100%)',
  heroAlt: 'linear-gradient(135deg, #1866C9 0%, #0F4A96 100%)',
  cardHeader: 'linear-gradient(135deg, #1866C9 0%, #00D9FF 100%)',
  primary: 'linear-gradient(135deg, #00D9FF 0%, #00B8D6 100%)',
  section: 'linear-gradient(135deg, #F4FCFF 0%, #FFFFFF 100%)',
} ;

export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '992px',
  wide: '1200px',
};
