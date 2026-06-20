import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse, ChatMessage } from '@/lib/ai';

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

const SYSTEM_PROMPT = `Eres el asistente virtual de WhatsApp de una tienda de tecnologia. Responde SIEMPRE en espanol.

USA ESTA INFORMACION:
${KNOWLEDGE_BASE}

REGLAS ESTRICTAS:
- Responde CORTO (2-3 oraciones maximo)
- Espanol informal pero profesional
- Maximo 1 emoji por mensaje
- Si no tienes info exacta de precios, di que un asesor confirmara
- Se amable y orientado a vender`;

const chatHistories = new Map<string, ChatMessage[]>();

export async function POST(req: NextRequest) {
  const { message, sessionId = 'test' } = await req.json();
  if (!message) return NextResponse.json({ error: 'message required' }, { status: 400 });

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ response: 'Error: OPENROUTER_API_KEY no configurada en Vercel' }, { status: 500 });
  }

  try {
    if (!chatHistories.has(sessionId)) {
      chatHistories.set(sessionId, []);
    }
    const history = chatHistories.get(sessionId)!;

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: message },
    ];

    const response = await generateAIResponse(messages);

    if (!response) {
      return NextResponse.json({ response: 'Los servidores de IA estan saturados. Intenta de nuevo en unos segundos.' });
    }

    history.push({ role: 'user', content: message });
    history.push({ role: 'assistant', content: response });
    if (history.length > 20) history.splice(0, 2);

    return NextResponse.json({ response });
  } catch (error: any) {
    return NextResponse.json({ response: 'Error: ' + (error.message || 'Unknown') }, { status: 500 });
  }
}
