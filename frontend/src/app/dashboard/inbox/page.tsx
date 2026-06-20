'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Conversation {
  id: string;
  phone: string;
  state: string;
  last_message: string;
  updated_at: string;
}

const STATE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  nuevo: { label: 'Nuevo', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
  esperando: { label: 'Esperando', color: '#EAB308', bg: 'rgba(234,179,8,0.15)' },
  respondido: { label: 'Respondido', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
  atendido: { label: 'Atendido', color: '#00CF9D', bg: 'rgba(0,207,157,0.15)' },
  pago_pendiente: { label: 'Pago Pendiente', color: '#F97316', bg: 'rgba(249,115,22,0.15)' },
};

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadConversations(); }, []);

  async function loadConversations() {
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });
    setConversations(data || []);
  }

  async function updateState(id: string, newState: string) {
    await supabase.from('conversations').update({ state: newState, updated_at: new Date().toISOString() }).eq('id', id);
    loadConversations();
  }

  const filtered = filter === 'all' ? conversations : conversations.filter(c => c.state === filter);

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-6 animate-fade-in">
        <a href="/dashboard" className="text-xs mb-3 inline-block" style={{color: 'var(--primary)'}}>\u2190 Volver al Dashboard</a>
        <h1 className="text-2xl font-bold" style={{color: 'var(--text-primary)'}}>Inbox</h1>
        <p className="text-sm mt-1" style={{color: 'var(--text-secondary)'}}>Conversaciones clasificadas por estado de atencion</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6 animate-fade-in" style={{animationDelay:'0.1s'}}>
        <button onClick={() => setFilter('all')} className={`tag cursor-pointer ${filter === 'all' ? 'tag-green' : ''}`} style={filter !== 'all' ? {background:'var(--bg-hover)',color:'var(--text-secondary)'} : {}}>Todos ({conversations.length})</button>
        {Object.entries(STATE_CONFIG).map(([key, cfg]) => (
          <button key={key} onClick={() => setFilter(key)} className="tag cursor-pointer" style={{background: filter === key ? cfg.bg : 'var(--bg-hover)', color: filter === key ? cfg.color : 'var(--text-secondary)'}}>
            {cfg.label} ({conversations.filter(c => c.state === key).length})
          </button>
        ))}
      </div>

      {/* Conversations */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-12" style={{color:'var(--text-secondary)'}}>
            <p className="text-lg">Sin conversaciones</p>
          </div>
        )}
        {filtered.map((conv, i) => {
          const cfg = STATE_CONFIG[conv.state] || STATE_CONFIG.nuevo;
          return (
            <div key={conv.id} className="card p-4 animate-slide-in" style={{animationDelay:`${i*0.03}s`}}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm" style={{color:'var(--text-primary)'}}>{conv.phone.replace('@c.us','')}</span>
                    <span className="tag" style={{background:cfg.bg, color:cfg.color}}>{cfg.label}</span>
                  </div>
                  <p className="text-xs mt-1 truncate" style={{color:'var(--text-secondary)'}}>{conv.last_message}</p>
                  <p className="text-xs mt-0.5" style={{color:'var(--text-secondary)',opacity:0.6}}>{new Date(conv.updated_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-1 ml-4">
                  <select
                    value={conv.state}
                    onChange={(e) => updateState(conv.id, e.target.value)}
                    className="input text-xs py-1 px-2"
                    style={{width:'auto',fontSize:'11px'}}
                  >
                    {Object.entries(STATE_CONFIG).map(([key, cfg]) => (
                      <option key={key} value={key}>{cfg.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
