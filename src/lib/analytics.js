const GTM_ID = import.meta.env.VITE_GTM_ID || '';
const GA4_ID = import.meta.env.VITE_GA4_ID || '';
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || '';

const isDev = import.meta.env.DEV;

function log(...args) {
  if (isDev) console.log('[Analytics]', ...args);
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.async = true;
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export function initAnalytics() {
  if (typeof window === 'undefined') return;
  if (!GTM_ID && !GA4_ID && !META_PIXEL_ID) {
    log('No analytics IDs configured — skipping');
    return;
  }
  log('Initializing with', { GTM_ID, GA4_ID, META_PIXEL_ID });

  if (GTM_ID) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    loadScript(`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`).catch(() => log('GTM load failed'));
  }

  if (GA4_ID) {
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`).then(() => {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function(){ window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', GA4_ID);
    }).catch(() => log('GA4 load failed'));
  }

  if (META_PIXEL_ID) {
    !function(f,b,e,v,n,t,s){
      if(f.fbq) return;
      n=f.fbq=function(){ n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments); };
      if(!f._fbq) f._fbq=n;
      n.push=n; n.loaded=!0; n.version='2.0';
      n.queue=[]; t=b.createElement(e); t.async=!0;
      t.src=v; s=b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t,s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }
}

export function gtag(...args) {
  try {
    if (typeof window !== 'undefined' && window.gtag) window.gtag(...args);
  } catch (e) { log('gtag error:', e); }
}

export function fbq(...args) {
  try {
    if (typeof window !== 'undefined' && window.fbq) window.fbq(...args);
  } catch (e) { log('fbq error:', e); }
}

export function pageView(pathname) {
  if (isDev) { log('page_view:', pathname); return; }
  gtag('event', 'page_view', { page_path: pathname, page_title: document.title });
  if (META_PIXEL_ID) fbq('track', 'PageView');
}

export function trackBooking(service, details = {}) {
  if (isDev) { log('trackBooking:', service, details); return; }
  gtag('event', 'booking', { service, ...details });
  if (META_PIXEL_ID) fbq('track', 'Purchase', { content_name: service, content_type: 'service', value: details.amount || 0, currency: 'INR' });
}

export function trackSignup(method) {
  if (isDev) { log('trackSignup:', method); return; }
  gtag('event', 'sign_up', { method });
  if (META_PIXEL_ID) fbq('track', 'CompleteRegistration');
}

export function trackLead(source) {
  if (isDev) { log('trackLead:', source); return; }
  gtag('event', 'generate_lead', { value: 1, currency: 'INR', lead_source: source });
  if (META_PIXEL_ID) fbq('track', 'Lead');
}

export function trackSearch(term) {
  if (isDev) { log('trackSearch:', term); return; }
  gtag('event', 'search', { search_term: term });
}

export function trackViewContent(contentType, contentId, name) {
  if (isDev) { log('trackViewContent:', contentType, contentId, name); return; }
  gtag('event', 'view_item', { content_type: contentType, content_id: contentId, name });
  if (META_PIXEL_ID) fbq('track', 'ViewContent', { content_type: contentType, content_ids: [contentId], content_name: name });
}

export function trackAddToCart(item, price, quantity = 1) {
  if (isDev) { log('trackAddToCart:', item, price, quantity); return; }
  gtag('event', 'add_to_cart', { currency: 'INR', value: price, items: [{ id: item, price, quantity }] });
  if (META_PIXEL_ID) fbq('track', 'AddToCart', { content_ids: [item], content_type: 'product', value: price, currency: 'INR' });
}

export function trackBeginCheckout(items, value) {
  if (isDev) { log('trackBeginCheckout:', items, value); return; }
  gtag('event', 'begin_checkout', { currency: 'INR', value, items });
  if (META_PIXEL_ID) fbq('track', 'InitiateCheckout', { value, currency: 'INR' });
}

export function trackPurchase(transactionId, value, items) {
  if (isDev) { log('trackPurchase:', transactionId, value, items); return; }
  gtag('event', 'purchase', { transaction_id: transactionId, currency: 'INR', value, items });
  if (META_PIXEL_ID) fbq('track', 'Purchase', { value, currency: 'INR', transaction_id: transactionId });
}
