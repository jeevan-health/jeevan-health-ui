import { useEffect, useState } from 'react';
import useAuthStore from '../stores/authStore.js';
import {
  enablePushNotifications,
  getExistingPushSubscription,
  notificationPermission,
  sendTestPush,
} from '../services/pushService.js';
import './enable-push-button.css';

/**
 * Opt-in Web Push (Phase 8). Shown when signed in and browser supports push.
 * When alerts are on, block variant can send a self-test notification.
 */
export default function EnablePushButton({ variant = 'default', className = '' }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [state, setState] = useState('idle'); // idle | loading | on | off | blocked | unsupported | not_configured
  const [hint, setHint] = useState('');
  const [testBusy, setTestBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!isAuthenticated()) {
        setState('idle');
        return;
      }
      const perm = notificationPermission();
      if (perm === 'unsupported') {
        setState('unsupported');
        return;
      }
      if (perm === 'denied') {
        setState('blocked');
        return;
      }
      try {
        const sub = await getExistingPushSubscription();
        if (cancelled) return;
        if (sub) setState('on');
        else setState('off');
      } catch {
        if (!cancelled) setState('off');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  if (!isAuthenticated()) return null;
  if (state === 'unsupported' || state === 'idle') return null;

  const onClick = async () => {
    if (state === 'on' || state === 'blocked') return;
    setState('loading');
    setHint('');
    try {
      const r = await enablePushNotifications();
      if (r.ok) {
        setState('on');
        setHint(r.message);
      } else if (r.status === 'denied') {
        setState('blocked');
        setHint(r.message);
      } else if (r.status === 'not_configured') {
        setState('not_configured');
        setHint(r.message);
      } else {
        setState('off');
        setHint(r.message || 'Could not enable alerts');
      }
    } catch (e) {
      setState('off');
      setHint(e?.response?.data?.error?.message || e.message || 'Failed');
    }
  };

  const onTest = async () => {
    setTestBusy(true);
    setHint('');
    try {
      const r = await sendTestPush();
      setHint(r.message || (r.sent > 0 ? 'Test sent' : 'No delivery'));
    } catch (e) {
      setHint(e?.response?.data?.error?.message || e.message || 'Test failed');
    } finally {
      setTestBusy(false);
    }
  };

  const label =
    state === 'on'
      ? 'Alerts on'
      : state === 'loading'
        ? 'Enabling…'
        : state === 'blocked'
          ? 'Alerts blocked'
          : state === 'not_configured'
            ? 'Alerts (setup pending)'
            : 'Enable alerts';

  const btnClass =
    variant === 'header'
      ? `enable-push-btn enable-push-btn--header ${className}`
      : variant === 'block'
        ? `btn btn-outline-dark enable-push-btn enable-push-btn--block ${className}`
        : `btn btn-outline-dark enable-push-btn ${className}`;

  return (
    <div className={`enable-push-wrap ${variant === 'block' ? 'enable-push-wrap--block' : ''}`}>
      <button
        type="button"
        className={btnClass}
        onClick={onClick}
        disabled={state === 'loading' || state === 'on' || state === 'blocked' || state === 'not_configured'}
        title={hint || label}
        aria-label={label}
      >
        <span className="enable-push-icon" aria-hidden>
          {state === 'on' ? '🔔' : '🔕'}
        </span>
        <span className="enable-push-label">{label}</span>
      </button>
      {state === 'on' && variant === 'block' ? (
        <button
          type="button"
          className="btn btn-outline-dark enable-push-test"
          onClick={onTest}
          disabled={testBusy}
        >
          {testBusy ? 'Sending…' : 'Send test alert'}
        </button>
      ) : null}
      {hint && variant === 'block' ? <p className="enable-push-hint muted">{hint}</p> : null}
    </div>
  );
}
