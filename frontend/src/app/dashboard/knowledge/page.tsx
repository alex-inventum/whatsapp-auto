'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';

interface Note { path: string; content: string; }

const NOTE_FILES = [
  { path: 'Negocio/Info General.md', label: 'Info General' },
  { path: 'Negocio/Productos.md', label: 'Productos' },
  { path: 'Negocio/FAQ.md', label: 'FAQ' },
  { path: 'Negocio/Reglas IA.md', label: 'Reglas IA' },
];

export default function KnowledgePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState(0);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadNotes(); }, []);

  async function loadNotes() {
    setLoading(true);
    const loaded: Note[] = [];
    for (const file of NOTE_FILES) {
      try {
        const res = await fetch(`/api/knowledge?path=${encodeURIComponent(file.path)}`);
        const data = await res.json();
        loaded.push({ path: file.path, content: data.content || '' });
      } catch {
        loaded.push({ path: file.path, content: '' });
      }
    }
    setNotes(loaded);
    if (loaded.length > 0) setContent(loaded[0].content);
    setLoading(false);
  }

  function selectNote(idx: number) {
    setSelected(idx);
    setContent(notes[idx]?.content || '');
    setStatus('');
  }

  async function saveNote() {
    setSaving(true);
    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: NOTE_FILES[selected].path, content }),
      });
      if (res.ok) {
        setStatus('Guardado');
        const updated = [...notes];
        updated[selected] = { ...updated[selected], content };
        setNotes(updated);
      } else { setStatus('Error al guardar'); }
    } catch { setStatus('Sin conexion a Obsidian (PC debe estar encendida)'); }
    setSaving(false);
    setTimeout(() => setStatus(''), 4000);
  }

  return (
    <div>
      <PageHeader title="Base de Conocimiento" subtitle="Edita la informacion que usa la IA. Los cambios se aplican en ~5 minutos." />
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            {NOTE_FILES.map((file, i) => (
              <button key={file.path} onClick={() => selectNote(i)} className="w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all"
                style={selected === i ? {background:'rgba(0,168,132,0.12)',color:'var(--primary-light)',fontWeight:500} : {color:'var(--text-secondary)'}}>
                {file.label}
              </button>
            ))}
          </div>

          <div className="md:col-span-3">
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm" style={{color:'var(--text-primary)'}}>{NOTE_FILES[selected]?.label}</h3>
                <div className="flex items-center gap-3">
                  {status && <span className="text-xs" style={{color:'var(--primary-light)'}}>{status}</span>}
                  <button onClick={saveNote} disabled={saving || loading} className="btn-primary text-xs py-2 px-4 disabled:opacity-50">
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} disabled={loading}
                className="input w-full font-mono text-xs" style={{minHeight:'420px',resize:'vertical',lineHeight:'1.7'}}
                placeholder={loading ? 'Cargando...' : 'Escribe la informacion aqui...'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
