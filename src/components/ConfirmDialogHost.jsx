import useDialogStore from '../stores/dialogStore';

/**
 * Renders the global confirm modal. Mount once in App root.
 */
export default function ConfirmDialogHost() {
  const open = useDialogStore((s) => s.open);
  const title = useDialogStore((s) => s.title);
  const message = useDialogStore((s) => s.message);
  const confirmLabel = useDialogStore((s) => s.confirmLabel);
  const cancelLabel = useDialogStore((s) => s.cancelLabel);
  const danger = useDialogStore((s) => s.danger);
  const accept = useDialogStore((s) => s.accept);
  const dismiss = useDialogStore((s) => s.dismiss);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="jh-confirm-title"
      onClick={dismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100050,
        background: 'rgba(15, 23, 42, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        animation: 'jhDlgFade 0.15s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 24px 60px rgba(15,23,42,0.25)',
          overflow: 'hidden',
          animation: 'jhDlgPop 0.2s ease',
          fontFamily: 'inherit',
        }}
      >
        <div style={{ padding: '22px 22px 8px' }}>
          <div
            id="jh-confirm-title"
            style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}
          >
            {title}
          </div>
          <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
            {message}
          </p>
        </div>
        <div style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'flex-end',
          padding: '16px 22px 20px',
          flexWrap: 'wrap',
        }}
        >
          <button
            type="button"
            onClick={dismiss}
            style={{
              minHeight: 42,
              padding: '0 18px',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              background: '#fff',
              color: '#334155',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={accept}
            autoFocus
            style={{
              minHeight: 42,
              padding: '0 18px',
              borderRadius: 10,
              border: 'none',
              background: danger
                ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
                : 'linear-gradient(135deg, #1866C9, #0F4A96)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes jhDlgFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes jhDlgPop { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
