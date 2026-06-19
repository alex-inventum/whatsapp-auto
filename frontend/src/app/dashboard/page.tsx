'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'loading'>('loading');

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-dark text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">WhatsApp Auto</h1>
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                status === 'connected' ? 'bg-green-400' : 'bg-red-400'
              }`}
            />
            <span className="text-sm">
              {status === 'connected' ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto flex gap-1 p-2">
          <a href="/dashboard" className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium">Inicio</a>
          <a href="/dashboard/auto-replies" className="px-4 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium">Respuestas</a>
          <a href="/dashboard/forwards" className="px-4 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium">Reenvios</a>
          <a href="/dashboard/classifications" className="px-4 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium">Clasificacion</a>
          <a href="/dashboard/messages" className="px-4 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium">Mensajes</a>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-sm text-gray-500">Mensajes Hoy</h3>
            <p className="text-3xl font-bold text-dark mt-1">0</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-sm text-gray-500">Respuestas Auto</h3>
            <p className="text-3xl font-bold text-primary mt-1">0</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-sm text-gray-500">Reenvios</h3>
            <p className="text-3xl font-bold text-secondary mt-1">0</p>
          </div>
        </div>
      </div>
    </main>
  );
}
