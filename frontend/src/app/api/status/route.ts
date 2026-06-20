import { NextResponse } from 'next/server';

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';

// Verifica que OpenRouter responda y haya modelos disponibles
export async function GET() {
  if (!OPENROUTER_KEY) {
    return NextResponse.json({ ok: false, detail: 'API key no configurada' });
  }

  try {
    // Test rapido: pedir lista de modelos (no consume cuota de generacion)
    const res = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { 'Authorization': `Bearer ${OPENROUTER_KEY}` },
    });

    if (!res.ok) {
      return NextResponse.json({ ok: false, detail: `HTTP ${res.status}` });
    }

    const data = await res.json();
    const freeCount = (data.data || []).filter((m: any) => m.id?.includes(':free')).length;

    return NextResponse.json({
      ok: true,
      detail: `${freeCount} modelos gratis disponibles`,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, detail: e.message || 'Error de conexion' });
  }
}
