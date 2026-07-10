import { useEffect } from 'react';
import { useT } from '../../i18n/LanguageProvider';
import useAdminStore from '../../stores/adminStore';

export default function AdminContacts() {
  const t = useT();
  const contacts = useAdminStore(s => s.contacts);
  const refreshContacts = useAdminStore(s => s.refreshContacts);
  const markContactRead = useAdminStore(s => s.markContactRead);

  useEffect(() => { refreshContacts(); }, []);

  return (
    <div>
      {contacts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 13 }}>{t('admin.contacts.no_contacts', 'No contact submissions yet')}</div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {contacts.map(c => (
            <div key={c.id} style={{ background: c.read ? '#fff' : '#eff6ff', borderRadius: 12, padding: 16, border: `1px solid ${c.read ? '#e2e8f0' : '#bfdbfe'}`, cursor: 'pointer' }}
              onClick={() => markContactRead(c.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <strong style={{ fontSize: 14, color: '#0f172a' }}>{c.name || 'Anonymous'}</strong>
                  <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>{c.email || ''}</span>
                  <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>{c.phone || ''}</span>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
              </div>
              <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.5 }}>{c.message || c.query || ''}</div>
              {!c.read && <div style={{ marginTop: 8 }}><span style={{ padding: '2px 8px', borderRadius: 12, background: '#3b82f6', color: '#fff', fontSize: 10, fontWeight: 600 }}>New</span></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}