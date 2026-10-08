import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = await prisma.platformSettings.findUnique({ where: { id: 'primary' }, select: { showHomepageLivePreview: true } });
  return NextResponse.json(
    { showHomepageLivePreview: settings?.showHomepageLivePreview ?? true },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
