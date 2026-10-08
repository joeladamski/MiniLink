import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { DEFAULT_SECTIONS, mergeSections, safeDestination, SECTION_KEYS } from '@/lib/homepage-sections';

export const dynamic = 'force-dynamic';
function owner() { const { userId } = auth(); return Boolean(userId && process.env.PLATFORM_OWNER_CLERK_USER_ID && userId === process.env.PLATFORM_OWNER_CLERK_USER_ID); }
export async function GET() {
  if (!owner()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return NextResponse.json({ sections: mergeSections(await prisma.homepageSection.findMany()) }, { headers: { 'Cache-Control': 'no-store' } });
}
export async function PUT(request: Request) {
  if (!owner()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (!input || typeof input !== 'object' || Array.isArray(input)) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  const obj = input as Record<string, unknown>;
  if (Object.keys(obj).length !== 1 || !('section' in obj) || !obj.section || typeof obj.section !== 'object' || Array.isArray(obj.section)) return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
  const s = obj.section as Record<string, unknown>;
  const fields = ['key','enabled','title','subtitle','body','primaryLabel','primaryUrl','secondaryLabel','secondaryUrl','sortOrder'];
  if (Object.keys(s).some(k => !fields.includes(k)) || !SECTION_KEYS.includes(s.key as any) || typeof s.enabled !== 'boolean' || !Number.isInteger(s.sortOrder) || (s.sortOrder as number) < 0 || (s.sortOrder as number) > 999) return NextResponse.json({ error: 'Invalid section fields' }, { status: 400 });
  for (const field of fields.filter(k => !['key','enabled','sortOrder'].includes(k))) {
    if (typeof s[field] !== 'string' || (s[field] as string).length > (field === 'body' ? 1000 : 200)) return NextResponse.json({ error: 'Invalid text for ' + field }, { status: 400 });
  }
  if ((s.primaryUrl && !safeDestination(s.primaryUrl as string)) || (s.secondaryUrl && !safeDestination(s.secondaryUrl as string))) return NextResponse.json({ error: 'Only local /path or #section links are allowed' }, { status: 400 });
  const data = { enabled: s.enabled as boolean, title: s.title as string, subtitle: s.subtitle as string, body: s.body as string, primaryLabel: s.primaryLabel as string, primaryUrl: s.primaryUrl as string, secondaryLabel: s.secondaryLabel as string, secondaryUrl: s.secondaryUrl as string, sortOrder: s.sortOrder as number };
  const saved = await prisma.homepageSection.upsert({ where: { key: s.key as string }, create: { key: s.key as string, ...data }, update: data });
  return NextResponse.json({ section: saved });
}
