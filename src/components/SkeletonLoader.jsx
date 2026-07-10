export function SkeletonBox({ width = '100%', height = 16, radius = 6, style }) {
  return (
    <div style={{
      width, height, borderRadius: radius, background: 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
      backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease infinite', ...style,
    }} />
  );
}

export function SkeletonCard() {
  return (
    <div style={{
      padding: 20, borderRadius: 12, border: '1px solid #e5e7eb', background: '#fff',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <SkeletonBox width="40%" height={14} />
      <SkeletonBox height={12} />
      <SkeletonBox height={12} width="80%" />
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <SkeletonBox width={60} height={24} radius={12} />
        <SkeletonBox width={80} height={24} radius={12} />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 12, padding: '10px 12px' }}>
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBox key={i} height={12} style={{ flex: i === 0 ? 2 : 1 }} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: 'flex', gap: 12, padding: '10px 12px', borderTop: '1px solid #f3f4f6' }}>
          {Array.from({ length: cols }).map((_, c) => (
            <SkeletonBox key={c} height={10} style={{ flex: c === 0 ? 2 : 1 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
          borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff',
        }}>
          <SkeletonBox width={36} height={36} radius="50%" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <SkeletonBox width="50%" height={12} />
            <SkeletonBox width="70%" height={10} />
          </div>
          <SkeletonBox width={60} height={24} radius={12} />
        </div>
      ))}
    </div>
  );
}

export default function SkeletonLoader({ variant = 'card', count = 3 }) {
  if (variant === 'table') return <SkeletonTable rows={count} />;
  if (variant === 'list') return <SkeletonList count={count} />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

export function SkeletonStyle() {
  return <style>{`
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  `}</style>;
}
