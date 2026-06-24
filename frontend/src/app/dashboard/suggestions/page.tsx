'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';

interface Suggestion {
  id: string;
  type: string;
  title: string;
  detail: string;
  payload: any;
  status: string;
  created_at: string;
}

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  classification: { label: 'Etiqueta', color: '#A5A8F0', bg: 'rgba(91,94,166,0.2)' },
  auto_reply: { label: 'Respuesta', color: '#93C5FD', bg: 'rgba(59,130,246,0.15)' },
  forward: { label: 'Reenvio', color: '#00CF9D', bg: 'rgba(0,207,157,0.15)' },
  knowledge_gap: { label: 'Pregunta sin respuesta', color: '#EAB308', bg: 'rgba(234,179,8,0.15)' },
};

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('agent_suggestions').select('*').eq('status', 'pending').order('created_at', { ascending: false });
    setSuggestions(data || []);
    setLoading(false);
  }

  async function approve(s: Suggestion) {
    if (s.type === 'classification' && s.payload) {
      await supabase.from('classification_rules').insert({ tag: s.payload.tag, keywords: s.payload.keywords, active: true });
    } else if (s.type === 'auto_reply' && s.payload) {
      await supabase.from('auto_replies').insert({ keyword: s.payload.keyword, match_type: s.payload.match_type || 'contains', response: s.payload.response, active: true });
    }
    await supabase.from('agent_suggestions').update({ status: 'approved' }).eq('id', s.id);
    load();
  }

  async function reject(id: string) {
    await supabase.from('agent_suggestions').update({ status: 'rejected' }).eq('id', id);
    load();
  }

  return (
    <div>
      <PageHeader title="Sugerencias del Agente" subtitle="El agente propone mejoras analizando las conversaciones. Apruebalas o rechazalas." />
      <div className="p-6 md:p-8">
        {loading && (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => <div key={i} className="card p-4 animate-pulse"><div className="h-4 bg-[var(--bg-hover)] rounded w-2/3"/></div>)}
          </div>
        )}

        {!loading && suggestions.length === 0 && (
          <div className="text-center py-12" style={{color:'var(--text-secondary)'}}>
            <div className="text-4xl mb-3">{String.fromCodePoint(0x2728)}</div>
            <p className="text-lg mb-1">Sin sugerencias pendientes</p>
            <p className="text-sm">El agente analiza las conversaciones cada 30 minutos y propondra mejoras aqui</p>
          </div>
        )}

        <div className="space-y-3">
          {suggestions.map((s, i) => {
            const cfg = TYPE_CONFIG[s.type] || { label: s.type, color: 'var(--text-secondary)', bg: 'var(--bg-hover)' };
            const isGap = s.type === 'knowledge_gap';
            return (
              <div key={s.id} className="card p-5 animate-slide-in" style={{animationDelay:`${i*0.05}s`}}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="tag" style={{background:cfg.bg, color:cfg.color}}>{cfg.label}</span>
                    </div>
                    <p className="font-medium text-sm" style={{color:'var(--text-primary)'}}>{s.title}</p>
                    <p className="text-xs mt-1" style={{color:'var(--text-secondary)'}}>{s.detail}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {!isGap && (
                      <button onClick={() => approve(s)} className="btn-primary text-xs py-2 px-4">Aprobar</button>
                    )}
                    <button onClick={() => reject(s.id)} className="btn-secondary text-xs py-2 px-4">{isGap ? 'Descartar' : 'Rechazar'}</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
