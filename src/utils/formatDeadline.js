/** Format assessment deadlines in India time for candidates (Hyderabad ops). */

export function formatDeadlineIst(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return (
    d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }) + ' IST'
  );
}

/** Whole hours remaining (ceil), min 0. */
export function hoursRemaining(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const ms = d.getTime() - Date.now();
  if (ms <= 0) return 0;
  return Math.ceil(ms / (60 * 60 * 1000));
}
