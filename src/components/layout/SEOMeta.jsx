import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useCmsStore from '../../stores/cmsStore';

export default function SEOMeta() {
  const loc = useLocation();
  const routes = useCmsStore(s => s.content?.seo?.routes) || {};

  useEffect(() => {
    const meta = routes[loc.pathname] || routes['/'] || {};
    if (meta.title) document.title = meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (meta.description) {
      if (desc) desc.setAttribute('content', meta.description);
      else { const m = document.createElement('meta'); m.name = 'description'; m.content = meta.description; document.head.appendChild(m); }
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (meta.title) {
      if (ogTitle) ogTitle.setAttribute('content', meta.title);
      else { const m = document.createElement('meta'); m.setAttribute('property', 'og:title'); m.content = meta.title; document.head.appendChild(m); }
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (meta.description) {
      if (ogDesc) ogDesc.setAttribute('content', meta.description);
      else { const m = document.createElement('meta'); m.setAttribute('property', 'og:description'); m.content = meta.description; document.head.appendChild(m); }
    }
    if (meta.ogImage) {
      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) ogImg.setAttribute('content', meta.ogImage);
      else { const m = document.createElement('meta'); m.setAttribute('property', 'og:image'); m.content = meta.ogImage; document.head.appendChild(m); }
    }
  }, [loc.pathname, routes]);

  return null;
}