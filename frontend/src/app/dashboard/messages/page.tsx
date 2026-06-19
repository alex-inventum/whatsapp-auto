'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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
    <main className="min-h-screen bg-gray-50">
      <header className="bg-dark text-white p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold">Mensajes Recientes</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-2">
          {messages.length === 0 && (
            <p className="text-gray-500 text-center py-8">No hay mensajes aun</p>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white rounded-lg p-4 border">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-sm">{msg.sender}</span>
                  {msg.classification && (
                    <span className="ml-2 bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">{msg.classification}</span>
                  )}
                </div>
                <span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleString()}</span>
              </div>
              <p className="mt-1 text-gray-700">{msg.body || `[${msg.type}]`}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
