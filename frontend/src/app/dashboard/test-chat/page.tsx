'use client';

import { useState, useRef, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';

interface Message { role: 'user' | 'ai'; text: string; time: string; }

export default function TestChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatRef.current?.scrollTo(0, chatRef.current.scrollHeight); }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', text: input, time: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/test-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.response || 'Sin respuesta', time: new Date().toLocaleTimeString() }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Error de conexion', time: new Date().toLocaleTimeString() }]);
    }
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  return (
    <div className="flex flex-col h-screen">
      <PageHeader title="Probar IA" subtitle="Simula una conversacion como cliente. La IA usa tu base de conocimiento." />

      <div ref={chatRef} className="flex-1 overflow-auto p-4 md:p-6 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-16" style={{color: 'var(--text-secondary)'}}>
            <div className="text-5xl mb-3">{'\uD83E\uDD16'}</div>
            <p className="text-sm">Escribe un mensaje para probar la IA</p>
            <p className="text-xs mt-1">Ej: &quot;Hola, tienen la EcoFlow River 3?&quot;</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className="max-w-[80%] rounded-2xl px-4 py-2.5" style={{
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))'
                : 'rgba(255, 255, 255, 0.04)',
              color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
              border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.08)' : 'none',
              borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
              borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '16px',
              boxShadow: msg.role === 'user'
                ? '0 4px 16px rgba(0, 168, 132, 0.2)'
                : '0 4px 16px rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(12px)',
            }}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              <p className="text-[10px] mt-1 opacity-60 text-right">{msg.time}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="px-4 py-3 rounded-2xl" style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderBottomLeftRadius: '4px', backdropFilter: 'blur(12px)'}}>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"/>
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay:'0.15s'}}/>
                <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay:'0.3s'}}/>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t" style={{borderColor: 'var(--border)', background: 'rgba(5,5,5,0.6)', backdropFilter: 'blur(20px)'}}>
        <div className="flex gap-2 max-w-3xl mx-auto">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje como cliente..." className="input flex-1" disabled={loading} />
          <button onClick={sendMessage} disabled={loading || !input.trim()} className="btn-primary px-5 disabled:opacity-50">Enviar</button>
        </div>
      </div>
    </div>
  );
}
