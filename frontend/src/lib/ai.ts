// Cliente de IA robusto con fallback multi-modelo y reintentos
// Prioriza modelos que funcionan de forma estable en OpenRouter

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';

// Modelos ordenados por confiabilidad (los que funcionan primero)
const MODELS = [
  'openai/gpt-oss-120b:free',
  'openai/gpt-oss-20b:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen3-next-80b-a3b-instruct:free',
  'meta-llama/llama-3.2-3b-instruct:free',
];

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callModel(model: string, messages: ChatMessage[]): Promise<{ content: string | null; rateLimited: boolean }> {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://whatsapp-auto-xiwi.vercel.app',
        'X-Title': 'WhatsApp Auto',
      },
      body: JSON.stringify({ model, messages, max_tokens: 300, temperature: 0.7 }),
    });

    const data = await res.json();

    // Rate limited?
    if (data.error?.code === 429) {
      return { content: null, rateLimited: true };
    }

    const content = data.choices?.[0]?.message?.content;
    // Algunos modelos devuelven content null con reasoning - los saltamos
    if (!content || content.trim() === '') {
      return { content: null, rateLimited: false };
    }

    return { content: content.trim(), rateLimited: false };
  } catch {
    return { content: null, rateLimited: false };
  }
}

// Genera respuesta probando modelos en cascada
export async function generateAIResponse(messages: ChatMessage[]): Promise<string | null> {
  if (!OPENROUTER_KEY) return null;

  for (const model of MODELS) {
    const { content, rateLimited } = await callModel(model, messages);
    if (content) return content;
    // Si fue rate limit, prueba siguiente modelo de inmediato
    if (rateLimited) continue;
  }

  // Segundo intento con pequeno delay (por si fue rate limit temporal)
  await new Promise(r => setTimeout(r, 1500));
  for (const model of MODELS) {
    const { content } = await callModel(model, messages);
    if (content) return content;
  }

  return null;
}
