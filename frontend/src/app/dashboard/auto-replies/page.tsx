'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';

interface AutoReply {
  id: string;
  keyword: string;
  match_type: string;
  response: string;
  active: boolean;
}

export default function AutoRepliesPage() {
  const [rules, setRules] = useState<AutoReply[]>([]);
  const [keyword, setKeyword] = useState('');
  const [matchType, setMatchType] = useState('contains');
  const [response, setResponse] = useState('');

  useEffect(() => { loadRules(); }, []);

  async function loadRules() {
    const { data } = await supabase.from('auto_replies').select('*');
    setRules(data || []);
  }

  async function addRule() {
    if (!keyword || !response) return;
    await supabase.from('auto_replies').insert({ keyword, match_type: matchType, response, active: true });
    setKeyword(''); setResponse('');
    loadRules();
  }

  async function toggleRule(id: string, active: boolean) {
    await supabase.from('auto_replies').update({ active: !active }).eq('id', id);
    loadRules();
  }

  async function deleteRule(id: string) {
    if (!confirm('Estas seguro de eliminar esta regla?')) return;
    await supabase.from('auto_replies').delete().eq('id', id);
    loadRules();
  }

  return (
    <div>
      <PageHeader title="Respuestas Automaticas" subtitle="Respuestas instantaneas segun palabras clave (tienen prioridad sobre la IA)" />
      <div className="p-6 md:p-8 space-y-6">
        <div className="card p-6 animate-fade-in">
          <h2 className="font-semibold mb-4" style={{color: 'var(--text-primary)'}}>Nueva Regla</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <input type="text" placeholder="Palabra clave..." value={keyword} onChange={(e) => setKeyword(e.target.value)} className="input" />
            <select value={matchType} onChange={(e) => setMatchType(e.target.value)} className="input">
              <option value="contains">Contiene</option>
              <option value="exact">Exacto</option>
              <option value="startsWith">Empieza con</option>
            </select>
            <input type="text" placeholder="Respuesta automatica..." value={response} onChange={(e) => setResponse(e.target.value)} className="input" />
          </div>
          <button onClick={addRule} className="btn-primary">+ Agregar Regla</button>
        </div>

        <div className="space-y-2">
          {rules.length === 0 && (
            <div className="text-center py-12" style={{color: 'var(--text-secondary)'}}>
              <p className="text-lg mb-1">Sin reglas configuradas</p>
              <p className="text-sm">La IA respondera todo automaticamente hasta que agregues reglas</p>
            </div>
          )}
          {rules.map((rule, i) => (
            <div key={rule.id} className="card p-4 flex items-center justify-between animate-slide-in" style={{animationDelay: `${i * 0.05}s`}}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${rule.active ? 'bg-green-400' : 'bg-gray-500'}`}/>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm" style={{color: 'var(--text-primary)'}}>{rule.keyword}</span>
                    <span className="tag tag-blue">{rule.match_type}</span>
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{color: 'var(--text-secondary)'}}>{rule.response}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0 ml-4">
                <button onClick={() => toggleRule(rule.id, rule.active)} className={`tag cursor-pointer ${rule.active ? 'tag-green' : 'tag-red'}`}>
                  {rule.active ? 'Activa' : 'Inactiva'}
                </button>
                <button onClick={() => deleteRule(rule.id)} className="btn-danger">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
