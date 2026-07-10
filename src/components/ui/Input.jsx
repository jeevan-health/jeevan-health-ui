import { useState } from 'react';

export default function Input({ label, error, type = 'text', value, onChange, placeholder, required, style, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 12, ...style }}>
      {label && (
        <label style={{
          display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary, #6b7280)',
          marginBottom: 4, fontFamily: 'inherit',
        }}>
          {label}{required && <span style={{ color: 'var(--danger, #EF4444)' }}> *</span>}
        </label>
      )}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '10px 12px', fontSize: 13, fontFamily: 'inherit',
          borderRadius: 8, border: error ? '1.5px solid var(--danger, #EF4444)' : focused ? '1.5px solid var(--brand-secondary, #1866C9)' : '1px solid var(--border-color, #d1d5db)',
          background: 'var(--input-bg, #fff)', color: 'var(--text-primary, #111827)',
          outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
          ...props.style,
        }}
        {...props}
      />
      {error && <p style={{ fontSize: 10, color: 'var(--danger, #EF4444)', margin: '3px 0 0' }}>{error}</p>}
    </div>
  );
}
