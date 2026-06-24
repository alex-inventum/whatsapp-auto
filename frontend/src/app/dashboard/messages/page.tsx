'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';

interface Message {
  id: string;
  sender: string;
  body: string;
  type: string;
  classification: string;
  timestamp: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [limit, setLimit] = useState(50);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadMessages(); }, []);

  async function loadMessages(newLimit?: number) {
    setLoading(true);
    const l = newLimit || limit;
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(l);
    setMessages(data || []);
    setHasMore((data?.length || 0) >= l);
    setLoading(false);
  }

  function loadMore() {
    const newLimit = limit + 50;
    setLimit(newLimit);
    loadMessages(newLimit);
  }

  function timeAgo(ts: string) {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Ahora';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `${days}d`;
  }

  return (
    <div>
      <PageHeader title="Mensajes Recientes" subtitle={`${messages.length} mensajes cargados`} />
      <div className="p-6 md:p-8">
        <div className="space-y-2">
          {!loading && messages.length === 0 && (
            <div className="text-center py-12" style={{color:'var(--text-secondary)'}}>
              <p className="text-lg mb-1">No hay mensajes aun</p>
              <p className="text-sm">Los mensajes recibidos apareceran aqui</p>
            </div>
          )}
          {loading && messages.length === 0 && (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="h-4 bg-[var(--bg-hover)] rounded w-1/3 mb-2"/>
                  <div className="h-3 bg-[var(--bg-hover)] rounded w-2/3"/>
                </div>
              ))}
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={msg.id} className="card p-4 animate-slide-in" style={{animationDelay:`${i*0.02}s`}}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm" style={{color:'var(--text-primary)'}}>{msg.sender.replace('@c.us','').replace('@lid','')}</span>
                  {msg.classification && <span className="tag tag-purple">{msg.classification}</span>}
                </div>
                <span className="text-xs font-medium" style={{color:'var(--text-secondary)'}}>{timeAgo(msg.timestamp)}</span>
              </div>
              <p className="mt-2 text-sm" style={{color:'var(--text-secondary)'}}>{msg.body || `[${msg.type}]`}</p>
            </div>
          ))}
        </div>
        {hasMore && messages.length > 0 && (
          <div className="mt-4 text-center">
            <button onClick={loadMore} className="btn-secondary text-sm">Cargar mas mensajes</button>
          </div>
        )}
      </div>
    </div>
  );
}
