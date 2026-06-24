'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';

interface GroupSetting {
  id: string;
  group_id: string;
  group_name: string;
  respond: boolean;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<GroupSetting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadGroups(); }, []);

  async function loadGroups() {
    setLoading(true);
    const { data } = await supabase.from('group_settings').select('*').order('group_name');
    setGroups(data || []);
    setLoading(false);
  }

  async function toggleGroup(id: string, current: boolean) {
    await supabase.from('group_settings').update({ respond: !current }).eq('id', id);
    loadGroups();
  }

  async function deleteGroup(id: string) {
    if (!confirm('Eliminar este grupo de la lista?')) return;
    await supabase.from('group_settings').delete().eq('id', id);
    loadGroups();
  }

  const activeCount = groups.filter(g => g.respond).length;

  return (
    <div>
      <PageHeader title="Grupos" subtitle={`${groups.length} grupos detectados - ${activeCount} con respuestas activas`} />
      <div className="p-6 md:p-8 space-y-4">
        <div className="card p-4 animate-fade-in">
          <p className="text-sm" style={{color:'var(--text-secondary)'}}>
            Los grupos se detectan automaticamente cuando llega un mensaje. Activa los que quieres que el bot responda.
          </p>
        </div>

        {loading && (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-4 animate-pulse"><div className="h-4 bg-[var(--bg-hover)] rounded w-1/2"/></div>
            ))}
          </div>
        )}

        {!loading && groups.length === 0 && (
          <div className="text-center py-12" style={{color:'var(--text-secondary)'}}>
            <p className="text-lg mb-1">Sin grupos detectados</p>
            <p className="text-sm">Los grupos apareceran automaticamente cuando reciban mensajes</p>
          </div>
        )}

        <div className="space-y-2">
          {groups.map((group, i) => (
            <div key={group.id} className="card p-4 flex items-center justify-between animate-slide-in" style={{animationDelay:`${i*0.04}s`}}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${group.respond ? 'bg-green-400' : 'bg-gray-500'}`} />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate" style={{color:'var(--text-primary)'}}>{group.group_name}</p>
                  <p className="text-xs truncate" style={{color:'var(--text-secondary)'}}>{group.group_id.replace('@g.us','')}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0 ml-4">
                <button
                  onClick={() => toggleGroup(group.id, group.respond)}
                  className={`tag cursor-pointer ${group.respond ? 'tag-green' : 'tag-red'}`}
                >
                  {group.respond ? 'Activo' : 'Inactivo'}
                </button>
                <button onClick={() => deleteGroup(group.id)} className="btn-danger">Quitar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
