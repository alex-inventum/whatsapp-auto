'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';

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

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Ahora';
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `hace ${days}d`;
}

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadConversations(); }, []);

  async function loadConversations() {
    const { data } = await supabase.from('conversations').select('*').order('updated_at', { ascending: false });
    setConversations(data || []);
  }

  async function updateState(id: string, newState: string) {
    await supabase.from('conversations').update({ state: newState, updated_at: new Date().toISOString() }).eq('id', id);
    loadConversations();
  }

  const filtered = filter === 'all' ? conversations : conversations.filter(c => c.state === filter);

  return (
    <div>
      <PageHeader title="Inbox" subtitle="Conversaciones clasificadas por estado de atencion" />
      <div className="p-6 md:p-8">
        <div className="flex gap-2 flex-wrap mb-6 animate-fade-in">
          <button onClick={() => setFilter('all')} className="tag cursor-pointer" style={filter==='all' ? {background:'rgba(0,168,132,0.15)',color:'var(--primary-light)'} : {background:'var(--bg-hover)',color:'var(--text-secondary)'}}>Todos ({conversations.length})</button>
          {Object.entries(STATE_CONFIG).map(([key, cfg]) => (
            <button key={key} onClick={() => setFilter(key)} className="tag cursor-pointer" style={{background: filter === key ? cfg.bg : 'var(--bg-hover)', color: filter === key ? cfg.color : 'var(--text-secondary)'}}>
              {cfg.label} ({conversations.filter(c => c.state === key).length})
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="text-center py-12" style={{color:'var(--text-secondary)'}}>
              <p className="text-lg mb-1">Sin conversaciones</p>
              <p className="text-sm">Las conversaciones apareceran cuando lleguen mensajes</p>
            </div>
          )}
          {filtered.map((conv, i) => {
            const cfg = STATE_CONFIG[conv.state] || STATE_CONFIG.nuevo;
            return (
              <div key={conv.id} className="card p-4 animate-slide-in" style={{animationDelay:`${i*0.03}s`}}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:cfg.color}}/>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm" style={{color:'var(--text-primary)'}}>{conv.phone.replace('@c.us','').replace('@lid','')}</span>
                        <span className="text-xs" style={{color:'var(--text-secondary)'}}>{timeAgo(conv.updated_at)}</span>
                      </div>
                      <p className="text-xs mt-0.5 truncate" style={{color:'var(--text-secondary)'}}>{conv.last_message}</p>
                    </div>
                  </div>
                  <select value={conv.state} onChange={(e) => updateState(conv.id, e.target.value)} className="input" style={{width:'auto',fontSize:'12px',padding:'6px 28px 6px 10px'}}>
                    {Object.entries(STATE_CONFIG).map(([key, c]) => (
                      <option key={key} value={key}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
