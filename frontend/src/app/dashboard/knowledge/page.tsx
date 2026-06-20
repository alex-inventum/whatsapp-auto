'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';

interface KItem { key: string; label: string; content: string; }

const TABS = [
  { key: 'info', label: 'Info General', icon: 'M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z' },
  { key: 'productos', label: 'Productos', icon: 'M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z' },
  { key: 'faq', label: 'FAQ', icon: 'M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z' },
  { key: 'reglas', label: 'Reglas IA', icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z' },
];

export default function KnowledgePage() {
  const [items, setItems] = useState<Record<string, KItem>>({});
  const [active, setActive] = useState('info');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'ok' | 'err' | ''; msg: string }>({ type: '', msg: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    const map: Record<string, KItem> = {};
    for (const tab of TABS) {
      try {
        const res = await fetch(`/api/knowledge?key=${tab.key}`);
        const data = await res.json();
        map[tab.key] = { key: tab.key, label: tab.label, content: data.content || '' };
      } catch {
        map[tab.key] = { key: tab.key, label: tab.label, content: '' };
      }
    }
    setItems(map);
    setContent(map['info']?.content || '');
    setLoading(false);
  }

  function selectTab(key: string) {
    setActive(key);
    setContent(items[key]?.content || '');
    setStatus({ type: '', msg: '' });
  }

  async function save() {
    setSaving(true);
    setStatus({ type: '', msg: '' });
    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: active, content }),
      });
      if (res.ok) {
        setStatus({ type: 'ok', msg: 'Guardado correctamente' });
        setItems({ ...items, [active]: { ...items[active], content } });
      } else {
        setStatus({ type: 'err', msg: 'No se pudo guardar' });
      }
    } catch {
      setStatus({ type: 'err', msg: 'Error de conexion' });
    }
    setSaving(false);
    setTimeout(() => setStatus({ type: '', msg: '' }), 4000);
  }

  const dirty = items[active]?.content !== content;

  return (
    <div>
      <PageHeader title="Base de Conocimiento" subtitle="Edita lo que sabe la IA. Los cambios se aplican en pocos minutos." />
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
          {/* Tabs */}
          <div className="space-y-1.5">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => selectTab(tab.key)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all text-left"
                style={active === tab.key
                  ? { background: 'rgba(0,168,132,0.12)', color: 'var(--primary-light)', fontWeight: 500 }
                  : { background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d={tab.icon} /></svg>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Editor */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{TABS.find(t => t.key === active)?.label}</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{content.length} caracteres</p>
              </div>
              <div className="flex items-center gap-3">
                {status.msg && (
                  <span className="text-xs flex items-center gap-1" style={{ color: status.type === 'ok' ? 'var(--primary-light)' : '#FCA5A5' }}>
                    {status.type === 'ok' ? '\u2713' : '\u2717'} {status.msg}
                  </span>
                )}
                <button onClick={save} disabled={saving || loading || !dirty} className="btn-primary text-xs py-2 px-5 disabled:opacity-40">
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
            <div className="p-5">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
                className="input w-full font-mono"
                style={{ minHeight: '440px', resize: 'vertical', lineHeight: '1.7', fontSize: '13px' }}
                placeholder={loading ? 'Cargando...' : 'Escribe la informacion que la IA usara para responder...'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
