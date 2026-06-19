'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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
    <main className="min-h-screen bg-gray-50">
      <header className="bg-dark text-white p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold">Reglas de Reenvio</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border space-y-4">
          <h2 className="font-semibold">Nueva Regla de Reenvio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="De (numero, opcional)" value={fromNumber} onChange={(e) => setFromNumber(e.target.value)} className="border rounded-lg px-3 py-2" />
            <input type="text" placeholder="Reenviar a (numero)" value={forwardTo} onChange={(e) => setForwardTo(e.target.value)} className="border rounded-lg px-3 py-2" />
            <select value={messageType} onChange={(e) => setMessageType(e.target.value)} className="border rounded-lg px-3 py-2">
              <option value="">Cualquier tipo</option>
              <option value="chat">Texto</option>
              <option value="image">Imagen</option>
              <option value="document">Documento</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
            </select>
            <input type="text" placeholder="Palabra clave (opcional)" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="border rounded-lg px-3 py-2" />
          </div>
          <button onClick={addRule} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary">Agregar Regla</button>
        </div>

        <div className="space-y-2">
          {rules.map((rule) => (
            <div key={rule.id} className="bg-white rounded-lg p-4 border flex items-center justify-between">
              <div className="text-sm">
                <span>{rule.from_number || 'Cualquiera'}</span>
                <span className="text-gray-400 mx-2">→</span>
                <span className="font-medium">{rule.forward_to}</span>
                {rule.message_type && <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{rule.message_type}</span>}
              </div>
              <button onClick={() => deleteRule(rule.id)} className="px-3 py-1 rounded text-sm bg-red-100 text-red-700">Eliminar</button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
