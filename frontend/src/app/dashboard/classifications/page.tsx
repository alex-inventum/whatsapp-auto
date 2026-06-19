'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ClassificationRule {
  id: string;
  tag: string;
  keywords: string;
  active: boolean;
}

export default function ClassificationsPage() {
  const [rules, setRules] = useState<ClassificationRule[]>([]);
  const [tag, setTag] = useState('');
  const [keywords, setKeywords] = useState('');

  useEffect(() => { loadRules(); }, []);

  async function loadRules() {
    const { data } = await supabase.from('classification_rules').select('*');
    setRules(data || []);
  }

  async function addRule() {
    if (!tag || !keywords) return;
    await supabase.from('classification_rules').insert({ tag, keywords, active: true });
    setTag(''); setKeywords('');
    loadRules();
  }

  async function deleteRule(id: string) {
    await supabase.from('classification_rules').delete().eq('id', id);
    loadRules();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-dark text-white p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold">Clasificacion de Mensajes</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border space-y-4">
          <h2 className="font-semibold">Nueva Clasificacion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Etiqueta (ej: ventas)" value={tag} onChange={(e) => setTag(e.target.value)} className="border rounded-lg px-3 py-2" />
            <input type="text" placeholder="Palabras clave (separadas por coma)" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="border rounded-lg px-3 py-2" />
          </div>
          <button onClick={addRule} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary">Agregar</button>
        </div>

        <div className="space-y-2">
          {rules.map((rule) => (
            <div key={rule.id} className="bg-white rounded-lg p-4 border flex items-center justify-between">
              <div>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm font-medium">{rule.tag}</span>
                <span className="ml-3 text-gray-600 text-sm">{rule.keywords}</span>
              </div>
              <button onClick={() => deleteRule(rule.id)} className="px-3 py-1 rounded text-sm bg-red-100 text-red-700">Eliminar</button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
