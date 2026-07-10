export function enableLazyImages() {
  if (typeof window === 'undefined') return;

  function applyLazy() {
    document.querySelectorAll('img:not([loading])').forEach(img => {
      if (!img.closest('[data-no-lazy]')) {
        img.setAttribute('loading', 'lazy');
      }
    });
  }

  applyLazy();
  const observer = new MutationObserver(applyLazy);
  observer.observe(document.body || document.documentElement, {
    childList: true, subtree: true,
  });
  return () => observer.disconnect();
}
