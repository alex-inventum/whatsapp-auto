'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';

interface Message {
  id: string;
  sender: string;
  body: string;
  type: string;
  direction: string;
  classification: string;
  timestamp: string;
}

export default function ConversationPage() {
  const params = useParams();
  const phone = decodeURIComponent(params.phone as string);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [phone]);

  async function load() {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('sender', phone)
      .order('timestamp', { ascending: true })
      .limit(200);
    setMessages(data || []);
    setLoading(false);
  }

  const cleanPhone = phone.replace('@c.us', '').replace('@lid', '');

  return (
    <div className="flex flex-col" style={{ height: '100vh' }}>
      <PageHeader title={cleanPhone} subtitle="Conversacion completa" />

      <div className="px-6 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
        <a href="/dashboard/inbox" className="text-xs" style={{ color: 'var(--primary)' }}>&#8592; Volver al Inbox</a>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-3">
        {loading && (
          <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>Cargando conversacion...</div>
        )}
        {!loading && messages.length === 0 && (
          <div className="text-center py-16" style={{ color: 'var(--text-secondary)' }}>
            <p className="text-lg mb-1">Sin mensajes</p>
            <p className="text-sm">No hay historial para este contacto</p>
          </div>
        )}
        {messages.map((msg) => {
          const isOut = msg.direction === 'out';
          return (
            <div key={msg.id} className={`flex ${isOut ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className="max-w-[75%] rounded-2xl px-4 py-2.5" style={{
                background: isOut ? 'var(--primary)' : 'var(--bg-card)',
                color: isOut ? 'white' : 'var(--text-primary)',
                border: isOut ? 'none' : '1px solid var(--border)',
                borderBottomRightRadius: isOut ? '4px' : '16px',
                borderBottomLeftRadius: isOut ? '16px' : '4px',
              }}>
                <p className="text-sm whitespace-pre-wrap">{msg.body || `[${msg.type}]`}</p>
                <p className="text-[10px] mt-1 opacity-60 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
