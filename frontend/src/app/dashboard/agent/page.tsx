'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';

interface Action {
  id: string;
  action_type: string;
  phone: string;
  detail: string;
  created_at: string;
}

interface BrainItem {
  key: string;
  label: string;
  content: string;
  updated_at: string;
}

const ACTION_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  followup: { label: 'Seguimiento', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
  close: { label: 'Cierre', color: '#8696A0', bg: 'rgba(134,150,160,0.15)' },
  opportunity: { label: 'Oportunidad', color: '#EAB308', bg: 'rgba(234,179,8,0.15)' },
  escalation: { label: 'Escalamiento', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
};

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Ahora';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export default function AgentPage() {
  const [actions, setActions] = useState<Action[]>([]);
  const [brain, setBrain] = useState<BrainItem[]>([]);
  const [selectedBrain, setSelectedBrain] = useState<BrainItem | null>(null);
  const [editing, setEditing] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAll();
    const interval = setInterval(loadAll, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadAll() {
    const [actRes, brainRes] = await Promise.all([
      supabase.from('agent_actions').select('*').order('created_at', { ascending: false }).limit(30),
      supabase.from('agent_brain').select('*').order('key'),
    ]);
    setActions(actRes.data || []);
    setBrain(brainRes.data || []);
  }

  function openBrain(item: BrainItem) {
    setSelectedBrain(item);
    setEditing(item.content);
  }

  async function saveBrain() {
    if (!selectedBrain) return;
    setSaving(true);
    await supabase.from('agent_brain').update({ content: editing, updated_at: new Date().toISOString() }).eq('key', selectedBrain.key);
    setSaving(false);
    setSelectedBrain(null);
    loadAll();
  }

  const todayActions = actions.filter(a => {
    const today = new Date(); today.setHours(0,0,0,0);
    return new Date(a.created_at) >= today;
  });

  return (
    <div>
      <PageHeader title="Agente Autonomo" subtitle="Tu empleado IA que gestiona conversaciones 24/7" />
      <div className="p-6 md:p-8 space-y-6">
        {/* Stats rapidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4 animate-fade-in">
            <p className="text-xs" style={{color:'var(--text-secondary)'}}>Acciones hoy</p>
            <p className="text-2xl font-bold mt-1" style={{color:'var(--text-primary)'}}>{todayActions.length}</p>
          </div>
          <div className="card p-4 animate-fade-in" style={{animationDelay:'0.08s'}}>
            <p className="text-xs" style={{color:'var(--text-secondary)'}}>Seguimientos</p>
            <p className="text-2xl font-bold mt-1" style={{color:'#3B82F6'}}>{todayActions.filter(a=>a.action_type==='followup').length}</p>
          </div>
          <div className="card p-4 animate-fade-in" style={{animationDelay:'0.16s'}}>
            <p className="text-xs" style={{color:'var(--text-secondary)'}}>Oportunidades</p>
            <p className="text-2xl font-bold mt-1" style={{color:'#EAB308'}}>{todayActions.filter(a=>a.action_type==='opportunity').length}</p>
          </div>
          <div className="card p-4 animate-fade-in" style={{animationDelay:'0.24s'}}>
            <p className="text-xs" style={{color:'var(--text-secondary)'}}>Cerradas</p>
            <p className="text-2xl font-bold mt-1" style={{color:'var(--text-secondary)'}}>{todayActions.filter(a=>a.action_type==='close').length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Acciones recientes */}
          <div>
            <h3 className="font-semibold mb-3" style={{color:'var(--text-primary)'}}>Actividad Reciente</h3>
            <div className="space-y-2">
              {actions.length === 0 && (
                <div className="text-center py-8" style={{color:'var(--text-secondary)'}}>
                  <p>El agente aun no ha realizado acciones</p>
                  <p className="text-xs mt-1">Se activa cuando el bot esta corriendo</p>
                </div>
              )}
              {actions.map((a, i) => {
                const cfg = ACTION_LABELS[a.action_type] || { label: a.action_type, color: 'var(--text-secondary)', bg: 'var(--bg-hover)' };
                return (
                  <div key={a.id} className="card p-3 animate-slide-in" style={{animationDelay:`${i*0.03}s`}}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="tag" style={{background:cfg.bg, color:cfg.color}}>{cfg.label}</span>
                        <span className="text-xs truncate" style={{color:'var(--text-secondary)'}}>{a.detail}</span>
                      </div>
                      <span className="text-xs flex-shrink-0 ml-2" style={{color:'var(--text-secondary)'}}>{timeAgo(a.created_at)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cerebro del agente */}
          <div>
            <h3 className="font-semibold mb-3" style={{color:'var(--text-primary)'}}>Cerebro del Agente</h3>
            <div className="space-y-2">
              {brain.map(item => (
                <button key={item.key} onClick={() => openBrain(item)} className="card p-3 w-full text-left hover:border-[var(--primary)] transition-all">
                  <p className="font-medium text-sm" style={{color:'var(--text-primary)'}}>{item.label}</p>
                  <p className="text-xs mt-0.5 truncate" style={{color:'var(--text-secondary)'}}>{item.content.substring(0, 60)}...</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal de edicion del cerebro */}
        {selectedBrain && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.7)'}}>
            <div className="card p-6 w-full max-w-2xl max-h-[80vh] flex flex-col" style={{background:'var(--bg-card)'}}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold" style={{color:'var(--text-primary)'}}>{selectedBrain.label}</h3>
                <div className="flex gap-2">
                  <button onClick={saveBrain} disabled={saving} className="btn-primary text-xs py-2 px-4">{saving ? 'Guardando...' : 'Guardar'}</button>
                  <button onClick={() => setSelectedBrain(null)} className="btn-secondary text-xs py-2 px-4">Cerrar</button>
                </div>
              </div>
              <textarea value={editing} onChange={e => setEditing(e.target.value)} className="input flex-1 font-mono text-xs" style={{minHeight:'300px', resize:'vertical', lineHeight:'1.7'}} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
