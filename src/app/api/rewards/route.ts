// src/app/api/friends/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

type Ctx<P extends Record<string, string>> = { params: Promise<P> };

export async function GET(req: NextRequest, context: Ctx<{ id: string }>) {
  const { id } = await context.params; // 👈 important
  return NextResponse.json({ ok: true, id });
}

export async function POST(req: NextRequest, context: Ctx<{ id: string }>) {
  const { id } = await context.params;
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({ ok: true, id, body }, { status: 201 });
}
