import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';
const MODELS = [
  'google/gemma-2-9b-it:free',
  'qwen/qwen-2.5-7b-instruct:free',
  'meta-llama/llama-3.1-8b-instruct:free',
];

const KNOWLEDGE_BASE = `# Informacion del Negocio

## Tipo
Tienda virtual de tecnologia

## Especialidad
- Cargadores para portatil (todas las marcas)
- Estaciones de energia portatil (EcoFlow River 3, River 2 Pro, etc.)
- Accesorios de carga y energia

## Horario de Atencion
- Lunes a Viernes: 8:00 AM - 12:00 PM y 2:00 PM - 5:30 PM
- Sabados: Consultar disponibilidad
- Domingos: Cerrado

## Productos Principales

### EcoFlow River 3
- Capacidad: 256Wh, Potencia: 600W
- Ideal para: camping, emergencias, trabajo remoto

### EcoFlow River 2 Pro
- Capacidad: 768Wh, Potencia: 800W
- Ideal para: uso prolongado, multiples dispositivos

### Cargadores para Portatil
- Universales (45W, 65W, 90W, 100W)
- Por marca: Dell, HP, Lenovo, Asus, Acer, Apple
- USB-C Power Delivery

## FAQ
- Envios a todo el pais (2-5 dias habiles)
- Garantia: EcoFlow 2 anos, Cargadores 6 meses
- Pagos: Transferencia, Nequi, Daviplata, Tarjeta, Contraentrega
- Devolucion: 5 dias habiles, producto sin uso`;

const chatHistories = new Map<string, Array<{role: string; content: string}>>();

async function tryModel(model: string, messages: Array<{role: string; content: string}>): Promise<string | null> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://whatsapp-auto-xiwi.vercel.app',
      'X-Title': 'WhatsApp Auto',
    },
    body: JSON.stringify({ model, messages, max_tokens: 200 }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || null;
}

export async function POST(req: NextRequest) {
  const { message, sessionId = 'test' } = await req.json();
  if (!message) return NextResponse.json({ error: 'message required' }, { status: 400 });

  if (!OPENROUTER_KEY) {
    return NextResponse.json({ response: 'Error: OPENROUTER_API_KEY no configurada' }, { status: 500 });
  }

  try {
    if (!chatHistories.has(sessionId)) {
      chatHistories.set(sessionId, []);
    }
    const history = chatHistories.get(sessionId)!;

    const messages = [
      {
        role: 'system',
        content: `Eres el asistente virtual de WhatsApp de una tienda de tecnologia. Responde en espanol.

USA ESTA INFORMACION:
${KNOWLEDGE_BASE}

REGLAS ESTRICTAS:
- Responde CORTO (2-3 oraciones maximo)
- Espanol informal pero profesional
- Maximo 1 emoji por mensaje
- Si no tienes info exacta de precios, di que un asesor confirmara`
      },
      ...history,
      { role: 'user', content: message }
    ];

    // Try models in order until one works
    let response: string | null = null;
    for (const model of MODELS) {
      response = await tryModel(model, messages);
      if (response) break;
    }

    if (!response) {
      return NextResponse.json({ response: 'Los modelos estan ocupados, intenta en unos segundos.' });
    }

    history.push({ role: 'user', content: message });
    history.push({ role: 'assistant', content: response });
    if (history.length > 20) history.splice(0, 2);

    return NextResponse.json({ response });
  } catch (error: any) {
    return NextResponse.json({ response: 'Error: ' + (error.message || 'Unknown') }, { status: 500 });
  }
}
