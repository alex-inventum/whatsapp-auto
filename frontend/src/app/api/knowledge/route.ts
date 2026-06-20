import { NextRequest, NextResponse } from 'next/server';

const OBSIDIAN_HOST = 'https://127.0.0.1:27124';
const OBSIDIAN_KEY = 'Bearer 02ddc495339ce71c4ba10b659c9ab9878610e0e2494c4a561677213f8fc3e172';

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path');
  if (!path) return NextResponse.json({ error: 'path required' }, { status: 400 });

  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const res = await fetch(`${OBSIDIAN_HOST}/vault/${encodeURIComponent(path)}`, {
      headers: { Authorization: OBSIDIAN_KEY },
    });
    if (!res.ok) return NextResponse.json({ content: '' });
    const content = await res.text();
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ content: '', error: 'Connection failed' });
  }
}

export async function POST(req: NextRequest) {
  const { path, content } = await req.json();
  if (!path || content === undefined) {
    return NextResponse.json({ error: 'path and content required' }, { status: 400 });
  }

  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const res = await fetch(`${OBSIDIAN_HOST}/vault/${encodeURIComponent(path)}`, {
      method: 'PUT',
      headers: {
        Authorization: OBSIDIAN_KEY,
        'Content-Type': 'text/markdown',
      },
      body: content,
    });
    if (res.ok || res.status === 204) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  } catch {
    return NextResponse.json({ error: 'Connection failed' }, { status: 500 });
  }
}
