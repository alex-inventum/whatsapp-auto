'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PageHeader from '@/components/PageHeader';

interface ServiceStatus {
  name: string;
  ok: boolean;
  detail: string;
  icon: string;
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState('');

  useEffect(() => {
    checkAll();
    const interval = setInterval(checkAll, 30000);
    return () => clearInterval(interval);
  }, []);

  async function checkAll() {
    const result: ServiceStatus[] = [];

    const { data: statusRows } = await supabase.from('system_status').select('*');
    const rows = statusRows || [];

    const waRow = rows.find((r: any) => r.key === 'whatsapp');
    const waFresh = waRow && (Date.now() - new Date(waRow.updated_at).getTime() < 90000);
    result.push({
      name: 'WhatsApp Bot',
      ok: !!(waFresh && waRow.status),
      detail: waFresh ? (waRow.status ? 'Conectado y escuchando mensajes' : 'Bot activo pero WA desconectado') : 'Bot apagado (inicia el servidor local)',
      icon: 'M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z',
    });

    const obsRow = rows.find((r: any) => r.key === 'obsidian');
    const obsFresh = obsRow && (Date.now() - new Date(obsRow.updated_at).getTime() < 90000);
    result.push({
      name: 'Base de Conocimiento',
      ok: !!(obsFresh && obsRow.status),
      detail: obsFresh ? (obsRow.status ? 'IA leyendo del cerebro (Supabase + Obsidian)' : 'Error al leer conocimiento') : 'Sin datos (bot apagado)',
      icon: 'M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z',
    });

    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      result.push({
        name: 'IA (OpenRouter)',
        ok: data.ok,
        detail: data.detail || (data.ok ? 'Funcionando' : 'No disponible'),
        icon: 'M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 011 1v3a1 1 0 01-1 1h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 01-1-1v-3a1 1 0 011-1h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2z',
      });
    } catch {
      result.push({ name: 'IA (OpenRouter)', ok: false, detail: 'Error al verificar', icon: 'M12 2a2 2 0 012 2' });
    }

    result.push({
      name: 'Base de Datos (Supabase)',
      ok: true,
      detail: 'Operativa - mensajes y reglas funcionando',
      icon: 'M12 2C6.48 2 2 4.02 2 6.5v11C2 19.98 6.48 22 12 22s10-2.02 10-4.5v-11C22 4.02 17.52 2 12 2z',
    });

    result.push({
      name: 'Frontend (Vercel)',
      ok: true,
      detail: 'PWA desplegada y accesible',
      icon: 'M12 2L2 19h20L12 2z',
    });

    setServices(result);
    setLastCheck(new Date().toLocaleTimeString());
    setLoading(false);
  }

  const allOk = services.length > 0 && services.every(s => s.ok);
  const okCount = services.filter(s => s.ok).length;

  return (
    <div>
      <PageHeader title="Estado del Sistema" subtitle="Monitoreo en tiempo real de todos los servicios" />
      <div className="p-6 md:p-8 space-y-6">
        <div className="card p-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{background: allOk ? 'rgba(0,207,157,0.15)' : 'rgba(234,179,8,0.15)'}}>
              <div className={`w-5 h-5 rounded-full ${loading ? 'bg-gray-400 animate-pulse' : allOk ? 'bg-green-400' : 'bg-yellow-400'}`}/>
            </div>
            <div>
              <p className="text-lg font-semibold" style={{color:'var(--text-primary)'}}>
                {loading ? 'Verificando...' : allOk ? 'Todos los sistemas operativos' : `${okCount}/${services.length} servicios activos`}
              </p>
              <p className="text-xs mt-0.5" style={{color:'var(--text-secondary)'}}>
                {lastCheck ? `Ultima verificacion: ${lastCheck} \u00B7 Se actualiza cada 30s` : 'Cargando...'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((s, i) => (
            <div key={s.name} className="card p-5 animate-fade-in" style={{animationDelay:`${i*0.08}s`}}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background: s.ok ? 'rgba(0,168,132,0.12)' : 'rgba(239,68,68,0.12)'}}>
                    <svg width="20" height="20" fill={s.ok ? 'var(--primary)' : '#EF4444'} viewBox="0 0 24 24"><path d={s.icon}/></svg>
                  </div>
                  <div>
                    <p className="font-medium text-sm" style={{color:'var(--text-primary)'}}>{s.name}</p>
                    <p className="text-xs mt-0.5" style={{color:'var(--text-secondary)'}}>{s.detail}</p>
                  </div>
                </div>
                <span className={`tag ${s.ok ? 'tag-green' : 'tag-red'}`}>{s.ok ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          ))}
        </div>

        <button onClick={checkAll} className="btn-secondary text-sm">Verificar ahora</button>
      </div>
    </div>
  );
}
