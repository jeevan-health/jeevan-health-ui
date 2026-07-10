import { useLocation } from 'react-router-dom';

export default function PageTransition({ children, duration = 250 }) {
  const location = useLocation();

  return (
    <div key={location.pathname} style={{
      animation: `pageEnter ${duration}ms ease`,
    }}>
      {children}
      <style>{`
        @keyframes pageEnter {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
