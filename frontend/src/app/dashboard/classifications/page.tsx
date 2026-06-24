'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';

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
    if (!confirm('Estas seguro de eliminar esta clasificacion?')) return;
    await supabase.from('classification_rules').delete().eq('id', id);
    loadRules();
  }

  return (
    <div>
      <PageHeader title="Clasificacion de Mensajes" subtitle="Etiqueta conversaciones automaticamente por palabras clave" />
      <div className="p-6 md:p-8 space-y-6">
        <div className="card p-6 animate-fade-in">
          <h2 className="font-semibold mb-4" style={{color:'var(--text-primary)'}}>Nueva Clasificacion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <input type="text" placeholder="Etiqueta (ej: ventas)" value={tag} onChange={(e) => setTag(e.target.value)} className="input" />
            <input type="text" placeholder="Palabras clave (separadas por coma)" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="input" />
          </div>
          <button onClick={addRule} className="btn-primary">+ Agregar</button>
        </div>

        <div className="space-y-2">
          {rules.length === 0 && (
            <div className="text-center py-12" style={{color:'var(--text-secondary)'}}>
              <p className="text-lg mb-1">Sin clasificaciones</p>
              <p className="text-sm">Crea etiquetas para organizar mensajes</p>
            </div>
          )}
          {rules.map((rule, i) => (
            <div key={rule.id} className="card p-4 flex items-center justify-between animate-slide-in" style={{animationDelay:`${i*0.05}s`}}>
              <div className="flex items-center gap-3">
                <span className="tag tag-purple">{rule.tag}</span>
                <span className="text-sm" style={{color:'var(--text-secondary)'}}>{rule.keywords}</span>
              </div>
              <button onClick={() => deleteRule(rule.id)} className="btn-danger">Eliminar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
