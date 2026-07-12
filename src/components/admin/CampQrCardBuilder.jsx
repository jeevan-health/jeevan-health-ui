import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

/** Always patient site — never admin host. */
export const PATIENT_ORIGIN = 'https://jeevanhealthcare.com';
export const SITE_DISPLAY = 'www.jeevanhealthcare.com';
const JEEVAN_LOGO_URL = '/logo.png';

export const DEFAULT_HEADLINE = 'Welcome to Jeevan HealthCare';
export const DEFAULT_TAGLINE = 'Scan to register · Get your lab report on email & app';

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (!String(src).startsWith('data:')) img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

async function makeQrDataUrl(text) {
  return QRCode.toDataURL(text, {
    width: 400,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: { dark: '#0f172a', light: '#ffffff' },
  });
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawContained(ctx, img, boxX, boxY, boxW, boxH) {
  const scale = Math.min(boxW / img.width, boxH / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  const x = boxX + (boxW - w) / 2;
  const y = boxY + (boxH - h) / 2;
  ctx.drawImage(img, x, y, w, h);
}

function wrapText(ctx, text, maxWidth) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  if (!words.length) return [''];
  const lines = [];
  let line = words[0];
  for (let i = 1; i < words.length; i++) {
    const test = `${line} ${words[i]}`;
    if (ctx.measureText(test).width <= maxWidth) line = test;
    else {
      lines.push(line);
      line = words[i];
    }
  }
  lines.push(line);
  return lines;
}

export async function renderCampCardPng({
  campUrl,
  headline,
  tagline,
  companyLogoDataUrl,
}) {
  const W = 720;
  const H = companyLogoDataUrl ? 980 : 920;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#F0F7FF';
  ctx.fillRect(0, 0, W, H);

  const pad = 36;
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(15, 23, 42, 0.12)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 10;
  drawRoundedRect(ctx, pad, pad, W - pad * 2, H - pad * 2, 28);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  const barGrad = ctx.createLinearGradient(pad, pad, W - pad, pad);
  barGrad.addColorStop(0, '#0F5DA8');
  barGrad.addColorStop(1, '#1A7AD4');
  ctx.fillStyle = barGrad;
  drawRoundedRect(ctx, pad, pad, W - pad * 2, 10, 4);
  ctx.fill();
  ctx.fillRect(pad, pad + 6, W - pad * 2, 8);

  let y = pad + 48;
  const logoBoxH = 88;
  const logoBoxW = companyLogoDataUrl ? 220 : 280;
  try {
    const jeevanImg = await loadImage(JEEVAN_LOGO_URL);
    if (companyLogoDataUrl) {
      const partnerImg = await loadImage(companyLogoDataUrl);
      const gap = 28;
      const totalW = logoBoxW * 2 + gap;
      const startX = (W - totalW) / 2;
      drawContained(ctx, jeevanImg, startX, y, logoBoxW, logoBoxH);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX + logoBoxW + gap / 2, y + 12);
      ctx.lineTo(startX + logoBoxW + gap / 2, y + logoBoxH - 12);
      ctx.stroke();
      drawContained(ctx, partnerImg, startX + logoBoxW + gap, y, logoBoxW, logoBoxH);
    } else {
      drawContained(ctx, jeevanImg, (W - logoBoxW) / 2, y, logoBoxW, logoBoxH);
    }
  } catch {
    ctx.fillStyle = '#0F5DA8';
    ctx.font = 'bold 28px system-ui, Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Jeevan HealthCare', W / 2, y + 50);
  }
  y += logoBoxH + 36;

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 32px system-ui, Segoe UI, sans-serif';
  ctx.textAlign = 'center';
  wrapText(ctx, headline || DEFAULT_HEADLINE, W - pad * 2 - 40).forEach((ln) => {
    ctx.fillText(ln, W / 2, y);
    y += 40;
  });
  y += 8;

  ctx.fillStyle = '#64748b';
  ctx.font = '500 18px system-ui, Segoe UI, sans-serif';
  wrapText(ctx, tagline || DEFAULT_TAGLINE, W - pad * 2 - 48).forEach((ln) => {
    ctx.fillText(ln, W / 2, y);
    y += 26;
  });
  y += 28;

  const qrSize = 340;
  const qrX = (W - qrSize) / 2;
  try {
    const qrDataUrl = await makeQrDataUrl(campUrl);
    const qrImg = await loadImage(qrDataUrl);
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, qrX - 12, y - 12, qrSize + 24, qrSize + 24, 16);
    ctx.fill();
    ctx.stroke();
    ctx.drawImage(qrImg, qrX, y, qrSize, qrSize);
  } catch {
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(qrX, y, qrSize, qrSize);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillText('QR unavailable', W / 2, y + qrSize / 2);
  }
  y += qrSize + 36;

  ctx.fillStyle = '#1866C9';
  ctx.font = 'bold 20px system-ui, Segoe UI, sans-serif';
  ctx.fillText(SITE_DISPLAY, W / 2, y);
  y += 26;
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px system-ui, Segoe UI, sans-serif';
  ctx.fillText(campUrl, W / 2, y);

  return canvas.toDataURL('image/png');
}

/**
 * Editable QR card builder. campUrl must be patient-site /camp or /camp/:slug.
 */
export default function CampQrCardBuilder({
  campUrl,
  headline: initialHeadline = DEFAULT_HEADLINE,
  tagline: initialTagline = DEFAULT_TAGLINE,
  companyLogo: initialLogo = null,
  downloadName = 'jeevan-camp-qr',
  onChange,
  showSave = false,
  onSave,
  saving = false,
}) {
  const [headline, setHeadline] = useState(initialHeadline || DEFAULT_HEADLINE);
  const [tagline, setTagline] = useState(initialTagline || DEFAULT_TAGLINE);
  const [companyLogo, setCompanyLogo] = useState(initialLogo || null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    setHeadline(initialHeadline || DEFAULT_HEADLINE);
    setTagline(initialTagline || DEFAULT_TAGLINE);
    setCompanyLogo(initialLogo || null);
  }, [initialHeadline, initialTagline, initialLogo]);

  useEffect(() => {
    onChange?.({ headline, tagline, companyLogo });
  }, [headline, tagline, companyLogo]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const dataUrl = await renderCampCardPng({
          campUrl,
          headline,
          tagline,
          companyLogoDataUrl: companyLogo,
        });
        if (!cancelled) {
          setPreviewUrl(dataUrl);
          setError('');
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not render preview');
      }
    })();
    return () => { cancelled = true; };
  }, [campUrl, headline, tagline, companyLogo]);

  const onLogoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, WebP)');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Company logo must be under 2 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCompanyLogo(String(reader.result));
      setError('');
    };
    reader.onerror = () => setError('Could not read logo file');
    reader.readAsDataURL(file);
  };

  const handleDownload = async () => {
    setDownloading(true);
    setError('');
    try {
      const dataUrl = previewUrl || await renderCampCardPng({
        campUrl,
        headline,
        tagline,
        companyLogoDataUrl: companyLogo,
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${downloadName}-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError(err.message || 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="camp-qr-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 18 }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700 }}>Card settings</h3>

        <label style={label}>Headline</label>
        <input
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          style={input}
          placeholder={DEFAULT_HEADLINE}
          maxLength={80}
        />

        <label style={{ ...label, marginTop: 12 }}>Tagline</label>
        <textarea
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          style={{ ...input, resize: 'vertical', minHeight: 64 }}
          placeholder={DEFAULT_TAGLINE}
          maxLength={160}
          rows={2}
        />

        <label style={{ ...label, marginTop: 12 }}>Camp / partner company logo (optional)</label>
        <p style={{ margin: '0 0 8px', fontSize: 11, color: '#94a3b8' }}>
          Side-by-side with Jeevan logo. Leave empty for Jeevan only.
        </p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()}>
            {companyLogo ? 'Change logo' : 'Upload company logo'}
          </button>
          {companyLogo && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ color: '#b91c1c', borderColor: '#fecaca' }}
              onClick={() => {
                setCompanyLogo(null);
                if (fileRef.current) fileRef.current.value = '';
              }}
            >
              Remove
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/*"
            onChange={onLogoFile}
            style={{ display: 'none' }}
          />
        </div>
        {companyLogo && (
          <div style={{ marginTop: 10, padding: 10, background: '#F8FAFC', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={companyLogo} alt="Company logo" style={{ height: 40, maxWidth: 120, objectFit: 'contain' }} />
            <span style={{ fontSize: 11, color: '#64748b' }}>Partner logo ready</span>
          </div>
        )}

        <div style={{ marginTop: 16, padding: 12, background: '#F0F7FF', borderRadius: 10, border: '1px solid #dbeafe' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0F5DA8', marginBottom: 4 }}>QR destination (fixed)</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1866C9', wordBreak: 'break-all' }}>{campUrl}</div>
          <p style={{ margin: '6px 0 0', fontSize: 11, color: '#64748b' }}>
            Locked to patient portal — never admin host.
          </p>
        </div>

        {error && (
          <div style={{ marginTop: 12, padding: 10, background: '#FEF2F2', color: '#b91c1c', borderRadius: 8, fontSize: 12 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
          <button
            type="button"
            className="btn btn-primary btn-block"
            style={{ minHeight: 46 }}
            onClick={handleDownload}
            disabled={downloading || !previewUrl}
          >
            {downloading ? 'Preparing…' : '⬇️ Download camp card (PNG)'}
          </button>
          {showSave && (
            <button
              type="button"
              className="btn btn-outline btn-block"
              style={{ minHeight: 44 }}
              disabled={saving}
              onClick={() => onSave?.({ headline, tagline, companyLogo })}
            >
              {saving ? 'Saving…' : '💾 Save branding to camp'}
            </button>
          )}
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 18 }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700 }}>Preview</h3>
        <div style={{
          background: '#F8FAFC',
          borderRadius: 12,
          padding: 12,
          display: 'flex',
          justifyContent: 'center',
          minHeight: 320,
          border: '1px dashed #e2e8f0',
        }}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Camp QR card preview"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: 8, boxShadow: '0 8px 24px rgba(15,23,42,0.08)' }}
            />
          ) : (
            <p style={{ color: '#94a3b8', fontSize: 13, alignSelf: 'center' }}>Rendering card…</p>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .camp-qr-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const label = {
  fontSize: 11,
  fontWeight: 600,
  color: '#64748b',
  display: 'block',
  marginBottom: 4,
};

const input = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #e2e8f0',
  fontSize: 13,
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};
