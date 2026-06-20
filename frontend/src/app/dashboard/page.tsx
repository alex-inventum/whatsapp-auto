'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';

export default function Dashboard() {
  const [stats, setStats] = useState({ messages: 0, conversations: 0, rules: 0, pending: 0 });

  useEffect(() => { loadStats(); }, []);

  async function loadStats() {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const [msgs, convs, replies, pending] = await Promise.all([
      supabase.from('messages').select('id', { count: 'exact', head: true }).gte('timestamp', today.toISOString()),
      supabase.from('conversations').select('id', { count: 'exact', head: true }),
      supabase.from('auto_replies').select('id', { count: 'exact', head: true }).eq('active', true),
      supabase.from('conversations').select('id', { count: 'exact', head: true }).eq('state', 'pago_pendiente'),
    ]);
    setStats({
      messages: msgs.count || 0,
      conversations: convs.count || 0,
      rules: replies.count || 0,
      pending: pending.count || 0,
    });
  }

  const cards = [
    { label: 'Mensajes Hoy', value: stats.messages, color: 'var(--primary)', bg: 'rgba(0,168,132,0.12)', icon: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z' },
    { label: 'Conversaciones', value: stats.conversations, color: '#5B5EA6', bg: 'rgba(91,94,166,0.15)', icon: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z' },
    { label: 'Reglas Activas', value: stats.rules, color: '#3B82F6', bg: 'rgba(59,130,246,0.15)', icon: 'M12 2L4.5 20.3l.7.7L12 18l6.8 3 .7-.7z' },
    { label: 'Pago Pendiente', value: stats.pending, color: '#F97316', bg: 'rgba(249,115,22,0.15)', icon: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z' },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Resumen de actividad de tu WhatsApp" />
      <div className="p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c, i) => (
            <div key={c.label} className="card p-5 animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{c.label}</p>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: c.bg }}>
                  <svg width="16" height="16" fill={c.color} viewBox="0 0 24 24"><path d={c.icon} /></svg>
                </div>
              </div>
              <p className="text-3xl font-bold mt-3" style={{ color: 'var(--text-primary)' }}>{c.value}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div>
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Acciones Rapidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/dashboard/test-chat" className="card p-5 hover:scale-[1.02] transition-transform">
              <div className="text-2xl mb-2">\uD83E\uDD16</div>
              <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Probar IA</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Simula una conversacion con el bot</p>
            </a>
            <a href="/dashboard/inbox" className="card p-5 hover:scale-[1.02] transition-transform">
              <div className="text-2xl mb-2">\uD83D\uDCE5</div>
              <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Ver Inbox</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Conversaciones por estado</p>
            </a>
            <a href="/dashboard/knowledge" className="card p-5 hover:scale-[1.02] transition-transform">
              <div className="text-2xl mb-2">\uD83E\uDDE0</div>
              <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Base de Conocimiento</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Edita lo que sabe la IA</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
