'use client';

import { useState, useEffect } from 'react';

interface Note {
  path: string;
  content: string;
}

const OBSIDIAN_URL = 'https://127.0.0.1:27124';
const OBSIDIAN_KEY = 'Bearer 02ddc495339ce71c4ba10b659c9ab9878610e0e2494c4a561677213f8fc3e172';

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

  useEffect(() => { loadNotes(); }, []);

  async function loadNotes() {
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
        setStatus('Guardado!');
        const updated = [...notes];
        updated[selected] = { ...updated[selected], content };
        setNotes(updated);
      } else {
        setStatus('Error al guardar');
      }
    } catch {
      setStatus('Error de conexion');
    }
    setSaving(false);
    setTimeout(() => setStatus(''), 3000);
  }

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-6 animate-fade-in">
        <a href="/dashboard" className="text-xs mb-3 inline-block" style={{color: 'var(--primary)'}}>\u2190 Volver al Dashboard</a>
        <h1 className="text-2xl font-bold" style={{color: 'var(--text-primary)'}}>Base de Conocimiento</h1>
        <p className="text-sm mt-1" style={{color: 'var(--text-secondary)'}}>Edita la informacion que usa la IA para responder. Los cambios se aplican en 5 minutos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sidebar */}
        <div className="space-y-1">
          {NOTE_FILES.map((file, i) => (
            <button
              key={file.path}
              onClick={() => selectNote(i)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${selected === i ? 'font-medium' : ''}`}
              style={selected === i ? {background:'rgba(0,168,132,0.12)',color:'var(--primary-light)'} : {color:'var(--text-secondary)'}}
            >
              {file.label}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="md:col-span-3">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm" style={{color:'var(--text-primary)'}}>{NOTE_FILES[selected]?.label}</h3>
              <div className="flex items-center gap-2">
                {status && <span className="text-xs" style={{color:'var(--primary-light)'}}>{status}</span>}
                <button onClick={saveNote} disabled={saving} className="btn-primary text-xs py-2 px-4">
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input w-full font-mono text-xs"
              style={{minHeight:'400px',resize:'vertical',lineHeight:'1.6'}}
              placeholder="Escribe la informacion aqui..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
