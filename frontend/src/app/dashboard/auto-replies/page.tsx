'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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

  useEffect(() => {
    loadRules();
  }, []);

  async function loadRules() {
    const { data } = await supabase.from('auto_replies').select('*');
    setRules(data || []);
  }

  async function addRule() {
    if (!keyword || !response) return;
    await supabase.from('auto_replies').insert({
      keyword,
      match_type: matchType,
      response,
      active: true,
    });
    setKeyword('');
    setResponse('');
    loadRules();
  }

  async function toggleRule(id: string, active: boolean) {
    await supabase.from('auto_replies').update({ active: !active }).eq('id', id);
    loadRules();
  }

  async function deleteRule(id: string) {
    await supabase.from('auto_replies').delete().eq('id', id);
    loadRules();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-dark text-white p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold">Respuestas Automaticas</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Add new rule */}
        <div className="bg-white rounded-xl p-6 shadow-sm border space-y-4">
          <h2 className="font-semibold">Nueva Regla</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Palabra clave"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="border rounded-lg px-3 py-2"
            />
            <select
              value={matchType}
              onChange={(e) => setMatchType(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="contains">Contiene</option>
              <option value="exact">Exacto</option>
              <option value="startsWith">Empieza con</option>
            </select>
            <input
              type="text"
              placeholder="Respuesta automatica"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="border rounded-lg px-3 py-2"
            />
          </div>
          <button
            onClick={addRule}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary"
          >
            Agregar Regla
          </button>
        </div>

        {/* Rules list */}
        <div className="space-y-2">
          {rules.map((rule) => (
            <div key={rule.id} className="bg-white rounded-lg p-4 border flex items-center justify-between">
              <div>
                <span className="font-medium">{rule.keyword}</span>
                <span className="text-gray-400 mx-2">→</span>
                <span className="text-gray-600">{rule.response}</span>
                <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">{rule.match_type}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleRule(rule.id, rule.active)}
                  className={`px-3 py-1 rounded text-sm ${rule.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                >
                  {rule.active ? 'Activa' : 'Inactiva'}
                </button>
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="px-3 py-1 rounded text-sm bg-red-100 text-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
