'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [status] = useState<'connected' | 'disconnected'>('disconnected');

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--border)] flex flex-col" style={{background: 'var(--bg-card)'}}>
        <div className="p-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{background: 'var(--primary)'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
            </div>
            <div>
              <h1 className="font-semibold text-sm" style={{color: 'var(--text-primary)'}}>WA Auto</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-400' : 'bg-red-400'}`}/>
                <span className="text-xs" style={{color: 'var(--text-secondary)'}}>{status === 'connected' ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <a href="/dashboard" className="nav-item active">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M4 13h6a1 1 0 001-1V4a1 1 0 00-1-1H4a1 1 0 00-1 1v8a1 1 0 001 1zm0 8h6a1 1 0 001-1v-4a1 1 0 00-1-1H4a1 1 0 00-1 1v4a1 1 0 001 1zm10 0h6a1 1 0 001-1v-8a1 1 0 00-1-1h-6a1 1 0 00-1 1v8a1 1 0 001 1zm0-18v4a1 1 0 001 1h6a1 1 0 001-1V4a1 1 0 00-1-1h-6a1 1 0 00-1 1z"/></svg>
            Dashboard
          </a>
          <a href="/dashboard/inbox" className="nav-item">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5v-3h3.56c.69 1.19 1.97 2 3.45 2s2.75-.81 3.45-2H19v3zm0-5h-4.99c0 1.1-.9 2-2 2s-2-.9-2-2H5V5h14v9z"/></svg>
            Inbox
          </a>
          <a href="/dashboard/auto-replies" className="nav-item">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
            Respuestas
          </a>
          <a href="/dashboard/forwards" className="nav-item">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
            Reenvios
          </a>
          <a href="/dashboard/classifications" className="nav-item">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"/></svg>
            Clasificacion
          </a>
          <a href="/dashboard/messages" className="nav-item">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/></svg>
            Mensajes
          </a>
          <a href="/dashboard/knowledge" className="nav-item">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            Conocimiento
          </a>
        </nav>

        <div className="p-3 border-t border-[var(--border)]">
          <div className="card p-3">
            <p className="text-xs" style={{color: 'var(--text-secondary)'}}>IA Activa</p>
            <p className="text-sm font-medium mt-0.5" style={{color: 'var(--primary-light)'}}>Gemini 2.0 Flash</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-semibold" style={{color: 'var(--text-primary)'}}>Dashboard</h2>
          <p className="text-sm mt-1" style={{color: 'var(--text-secondary)'}}>Resumen de actividad de tu WhatsApp</p>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card p-5 animate-fade-in">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium" style={{color: 'var(--text-secondary)'}}>Mensajes Hoy</p>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: 'rgba(0, 168, 132, 0.12)'}}>
                  <svg width="16" height="16" fill="var(--primary)" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                </div>
              </div>
              <p className="text-2xl font-bold mt-2" style={{color: 'var(--text-primary)'}}>0</p>
              <p className="text-xs mt-1" style={{color: 'var(--text-secondary)'}}>+0% vs ayer</p>
            </div>

            <div className="card p-5 animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium" style={{color: 'var(--text-secondary)'}}>Respuestas IA</p>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: 'rgba(91, 94, 166, 0.15)'}}>
                  <svg width="16" height="16" fill="#5B5EA6" viewBox="0 0 24 24"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/></svg>
                </div>
              </div>
              <p className="text-2xl font-bold mt-2" style={{color: 'var(--text-primary)'}}>0</p>
              <p className="text-xs mt-1" style={{color: 'var(--text-secondary)'}}>enviadas hoy</p>
            </div>

            <div className="card p-5 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium" style={{color: 'var(--text-secondary)'}}>Reenvios</p>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: 'rgba(59, 130, 246, 0.15)'}}>
                  <svg width="16" height="16" fill="#3B82F6" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
                </div>
              </div>
              <p className="text-2xl font-bold mt-2" style={{color: 'var(--text-primary)'}}>0</p>
              <p className="text-xs mt-1" style={{color: 'var(--text-secondary)'}}>procesados</p>
            </div>

            <div className="card p-5 animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium" style={{color: 'var(--text-secondary)'}}>Conversaciones</p>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: 'rgba(234, 179, 8, 0.15)'}}>
                  <svg width="16" height="16" fill="#EAB308" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </div>
              </div>
              <p className="text-2xl font-bold mt-2" style={{color: 'var(--text-primary)'}}>0</p>
              <p className="text-xs mt-1" style={{color: 'var(--text-secondary)'}}>activas</p>
            </div>
          </div>

          {/* Connection Status */}
          <div className="card p-6">
            <h3 className="font-semibold mb-4" style={{color: 'var(--text-primary)'}}>Estado de Conexion</h3>
            <div className="flex items-center gap-4 p-4 rounded-lg" style={{background: 'var(--bg-main)'}}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${status === 'connected' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <div className={`w-4 h-4 rounded-full ${status === 'connected' ? 'bg-green-400' : 'bg-red-400'}`}/>
              </div>
              <div>
                <p className="font-medium" style={{color: 'var(--text-primary)'}}>{status === 'connected' ? 'WhatsApp Conectado' : 'WhatsApp Desconectado'}</p>
                <p className="text-xs mt-0.5" style={{color: 'var(--text-secondary)'}}>{status === 'connected' ? 'Bot activo - Gemini respondiendo mensajes' : 'Inicia el bot desde el escritorio para conectar'}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="font-semibold mb-4" style={{color: 'var(--text-primary)'}}>Acceso Rapido</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <a href="/dashboard/inbox" className="card p-4 text-center hover:border-[var(--primary)]">
                <p className="text-2xl mb-1">📥</p>
                <p className="text-xs" style={{color: 'var(--text-secondary)'}}>Inbox</p>
              </a>
              <a href="/dashboard/auto-replies" className="card p-4 text-center hover:border-[var(--primary)]">
                <p className="text-2xl mb-1">⚡</p>
                <p className="text-xs" style={{color: 'var(--text-secondary)'}}>Reglas</p>
              </a>
              <a href="/dashboard/knowledge" className="card p-4 text-center hover:border-[var(--primary)]">
                <p className="text-2xl mb-1">🧠</p>
                <p className="text-xs" style={{color: 'var(--text-secondary)'}}>Conocimiento</p>
              </a>
              <a href="/dashboard/messages" className="card p-4 text-center hover:border-[var(--primary)]">
                <p className="text-2xl mb-1">💬</p>
                <p className="text-xs" style={{color: 'var(--text-secondary)'}}>Mensajes</p>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
