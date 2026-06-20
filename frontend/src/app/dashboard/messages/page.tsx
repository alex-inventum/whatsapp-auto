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

  useEffect(() => { loadMessages(); }, []);

  async function loadMessages() {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);
    setMessages(data || []);
  }

  return (
    <div>
      <PageHeader title="Mensajes Recientes" subtitle="Ultimos 50 mensajes recibidos" />
      <div className="p-6 md:p-8">
        <div className="space-y-2">
          {messages.length === 0 && (
            <div className="text-center py-12" style={{color:'var(--text-secondary)'}}>
              <p className="text-lg mb-1">No hay mensajes aun</p>
              <p className="text-sm">Los mensajes recibidos apareceran aqui</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={msg.id} className="card p-4 animate-slide-in" style={{animationDelay:`${i*0.03}s`}}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm" style={{color:'var(--text-primary)'}}>{msg.sender.replace('@c.us','')}</span>
                  {msg.classification && <span className="tag tag-purple">{msg.classification}</span>}
                </div>
                <span className="text-xs" style={{color:'var(--text-secondary)',opacity:0.7}}>{new Date(msg.timestamp).toLocaleString()}</span>
              </div>
              <p className="mt-2 text-sm" style={{color:'var(--text-secondary)'}}>{msg.body || `[${msg.type}]`}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
