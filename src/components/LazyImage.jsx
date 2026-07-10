import { useState, useRef, useEffect } from 'react';

export default function LazyImage({ src, alt, style, className, fallback, onClick, ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          obs.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    obs.observe(imgRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={imgRef} style={{ position: 'relative', overflow: 'hidden', ...style }} className={className} onClick={onClick}>
      {error ? (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', color: '#999', fontSize: 12 }}>
          {fallback || '⚠️'}
        </div>
      ) : loaded ? (
        <img
          src={src}
          alt={alt}
          onError={() => setError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          {...props}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', background: '#f0f0f0', animation: 'lazyPulse 1.5s infinite' }} />
      )}
    </div>
  );
}
