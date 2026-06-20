import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET ?key=info  -> devuelve { content, label }
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');

  if (key) {
    const { data, error } = await supabase.from('knowledge').select('*').eq('key', key).single();
    if (error || !data) return NextResponse.json({ content: '', label: '' });
    return NextResponse.json({ content: data.content || '', label: data.label || '' });
  }

  // Sin key: devuelve todas las entradas
  const { data } = await supabase.from('knowledge').select('*').order('key');
  return NextResponse.json({ items: data || [] });
}

// POST { key, content } -> guarda
export async function POST(req: NextRequest) {
  const { key, content } = await req.json();
  if (!key || content === undefined) {
    return NextResponse.json({ error: 'key and content required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('knowledge')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('key', key);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
