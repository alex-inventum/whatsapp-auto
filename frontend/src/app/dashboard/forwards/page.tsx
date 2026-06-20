'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';

interface ForwardRule {
  id: string;
  from_number: string;
  forward_to: string;
  message_type: string;
  keyword: string;
  active: boolean;
}

export default function ForwardsPage() {
  const [rules, setRules] = useState<ForwardRule[]>([]);
  const [fromNumber, setFromNumber] = useState('');
  const [forwardTo, setForwardTo] = useState('');
  const [messageType, setMessageType] = useState('');
  const [keyword, setKeyword] = useState('');

  useEffect(() => { loadRules(); }, []);

  async function loadRules() {
    const { data } = await supabase.from('forward_rules').select('*');
    setRules(data || []);
  }

  async function addRule() {
    if (!forwardTo) return;
    await supabase.from('forward_rules').insert({
      from_number: fromNumber || null,
      forward_to: forwardTo,
      message_type: messageType || null,
      keyword: keyword || null,
      active: true,
    });
    setFromNumber(''); setForwardTo(''); setMessageType(''); setKeyword('');
    loadRules();
  }

  async function deleteRule(id: string) {
    await supabase.from('forward_rules').delete().eq('id', id);
    loadRules();
  }

  return (
    <div>
      <PageHeader title="Reglas de Reenvio" subtitle="Reenvia mensajes automaticamente a otros numeros" />
      <div className="p-6 md:p-8 space-y-6">
        <div className="card p-6 animate-fade-in">
          <h2 className="font-semibold mb-4" style={{color:'var(--text-primary)'}}>Nueva Regla</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <input type="text" placeholder="De (numero, opcional)" value={fromNumber} onChange={(e) => setFromNumber(e.target.value)} className="input" />
            <input type="text" placeholder="Reenviar a (numero)" value={forwardTo} onChange={(e) => setForwardTo(e.target.value)} className="input" />
            <select value={messageType} onChange={(e) => setMessageType(e.target.value)} className="input">
              <option value="">Cualquier tipo</option>
              <option value="chat">Texto</option>
              <option value="image">Imagen</option>
              <option value="document">Documento</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </select>
            <input type="text" placeholder="Palabra clave (opcional)" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="input" />
          </div>
          <button onClick={addRule} className="btn-primary">+ Agregar Regla</button>
        </div>

        <div className="space-y-2">
          {rules.length === 0 && (
            <div className="text-center py-12" style={{color:'var(--text-secondary)'}}>
              <p className="text-lg mb-1">Sin reglas de reenvio</p>
              <p className="text-sm">Agrega tu primera regla</p>
            </div>
          )}
          {rules.map((rule, i) => (
            <div key={rule.id} className="card p-4 flex items-center justify-between animate-slide-in" style={{animationDelay:`${i*0.05}s`}}>
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <span style={{color:'var(--text-secondary)'}}>{rule.from_number || 'Cualquiera'}</span>
                <span style={{color:'var(--primary)'}}>\u2192</span>
                <span className="font-medium" style={{color:'var(--text-primary)'}}>{rule.forward_to}</span>
                {rule.message_type && <span className="tag tag-blue">{rule.message_type}</span>}
                {rule.keyword && <span className="tag tag-purple">{rule.keyword}</span>}
              </div>
              <button onClick={() => deleteRule(rule.id)} className="btn-danger">Eliminar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
