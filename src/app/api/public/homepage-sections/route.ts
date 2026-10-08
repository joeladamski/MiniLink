import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { mergeSections } from '@/lib/homepage-sections';

export const dynamic = 'force-dynamic';
export async function GET() {
  const [rows, settings] = await Promise.all([
    prisma.homepageSection.findMany(),
    prisma.platformSettings.findUnique({ where: { id: 'primary' }, select: { showHomepageLivePreview: true } }),
  ]);
  const sections = mergeSections(rows).map(s => s.key === 'live_preview' ? { ...s, enabled: s.enabled && (settings?.showHomepageLivePreview ?? true) } : s);
  return NextResponse.json({ sections }, { headers: { 'Cache-Control': 'no-store' } });
}
