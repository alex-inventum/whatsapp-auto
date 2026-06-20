import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
const OBSIDIAN_HOST = process.env.OBSIDIAN_HOST || 'https://127.0.0.1:27124';
const OBSIDIAN_KEY = process.env.OBSIDIAN_API_KEY || '';

const genAI = new GoogleGenerativeAI(GEMINI_KEY);

const chatHistories = new Map<string, Array<{role: string; parts: Array<{text: string}>}>>();

async function fetchNote(path: string): Promise<string> {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const res = await fetch(`${OBSIDIAN_HOST}/vault/${encodeURIComponent(path)}`, {
      headers: { Authorization: `Bearer ${OBSIDIAN_KEY}` },
    });
    if (!res.ok) return '';
    return await res.text();
  } catch {
    return '';
  }
}

async function getKnowledgeBase(): Promise<string> {
  const notes = [
    'Negocio/Info General.md',
    'Negocio/Productos.md',
    'Negocio/FAQ.md',
    'Negocio/Reglas IA.md',
  ];
  const contents = await Promise.all(notes.map(fetchNote));
  return contents.filter(Boolean).join('\n\n---\n\n');
}

export async function POST(req: NextRequest) {
  const { message, sessionId = 'test' } = await req.json();
  if (!message) return NextResponse.json({ error: 'message required' }, { status: 400 });

  if (!GEMINI_KEY) {
    return NextResponse.json({ response: 'Error: GEMINI_API_KEY no configurada en variables de entorno' }, { status: 500 });
  }

  try {
    const kb = await getKnowledgeBase();

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: `Eres el asistente virtual de WhatsApp de una tienda de tecnologia.

USA ESTA INFORMACION PARA RESPONDER:
${kb}

REGLAS:
- Responde CORTO (2-3 oraciones maximo)
- Espanol informal pero profesional
- Maximo 1 emoji por mensaje
- Si no tienes info exacta, di que un asesor confirmara`,
    });

    if (!chatHistories.has(sessionId)) {
      chatHistories.set(sessionId, []);
    }
    const history = chatHistories.get(sessionId)!;

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message);
    const response = result.response.text();

    history.push({ role: 'user', parts: [{ text: message }] });
    history.push({ role: 'model', parts: [{ text: response }] });
    if (history.length > 20) history.splice(0, 2);

    return NextResponse.json({ response });
  } catch (error: any) {
    return NextResponse.json({ response: 'Error: ' + (error.message || 'Unknown') }, { status: 500 });
  }
}
