import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const ToastContext = createContext(null);

const TOAST_TYPES = {
  success: { bg: '#065f46', border: '#059669', icon: '✓' },
  error: { bg: '#991b1b', border: '#dc2626', icon: '✕' },
  info: { bg: '#1e40af', border: '#2563eb', icon: 'ℹ' },
  warning: { bg: '#854d0e', border: '#ca8a04', icon: '⚠' },
};

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const remove = useCallback((id) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const add = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    const t = TOAST_TYPES[type] || TOAST_TYPES.info;
    setToasts(prev => [...prev, { id, message, type, ...t }]);
    timers.current[id] = setTimeout(() => remove(id), duration);
  }, [remove]);

  const toast = useCallback((msg, opts) => {
    if (typeof opts === 'string') add(msg, opts);
    else add(msg, opts?.type || 'info', opts?.duration || 4000);
  }, [add]);

  useEffect(() => {
    return () => Object.values(timers.current).forEach(clearTimeout);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{
        position: 'fixed', top: 16, right: 16, zIndex: 100000,
        display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px', borderRadius: 8, background: t.bg, border: `1px solid ${t.border}`,
            color: '#fff', fontSize: 13, fontWeight: 500, boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            minWidth: 260, maxWidth: 400, animation: 'toastSlideIn 0.25s ease',
            fontFamily: 'inherit',
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{t.icon}</span>
            <span style={{ flex: 1, lineHeight: 1.4 }}>{t.message}</span>
            <button onClick={() => remove(t.id)} style={{
              background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
              borderRadius: '50%', width: 20, height: 20, fontSize: 10, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              fontFamily: 'inherit',
            }}>✕</button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes toastSlideIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) return () => {};
  return ctx;
}
