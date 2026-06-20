import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse, ChatMessage } from '@/lib/ai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Lee la base de conocimiento desde Supabase
async function getKnowledgeBase(): Promise<string> {
  try {
    const { data } = await supabase.from('knowledge').select('*').order('key');
    if (!data || data.length === 0) return '';
    return data.map((r: any) => `## ${r.label}\n${r.content}`).join('\n\n---\n\n');
  } catch {
    return '';
  }
}

const chatHistories = new Map<string, ChatMessage[]>();

export async function POST(req: NextRequest) {
  const { message, sessionId = 'test' } = await req.json();
  if (!message) return NextResponse.json({ error: 'message required' }, { status: 400 });

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ response: 'Error: OPENROUTER_API_KEY no configurada en Vercel' }, { status: 500 });
  }

  try {
    const kb = await getKnowledgeBase();
    const systemPrompt = `Eres el asistente virtual de WhatsApp de una tienda de tecnologia. Responde SIEMPRE en espanol.

USA ESTA INFORMACION:
${kb}

REGLAS ESTRICTAS:
- Responde CORTO (2-3 oraciones maximo)
- Espanol informal pero profesional
- Maximo 1 emoji por mensaje
- Si no tienes info exacta de precios, di que un asesor confirmara
- Se amable y orientado a vender`;

    if (!chatHistories.has(sessionId)) {
      chatHistories.set(sessionId, []);
    }
    const history = chatHistories.get(sessionId)!;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
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
