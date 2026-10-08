import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
function isOwner(userId: string | null) {
  return Boolean(userId && process.env.PLATFORM_OWNER_CLERK_USER_ID && userId === process.env.PLATFORM_OWNER_CLERK_USER_ID);
}
export async function GET() {
  const { userId } = auth();
  if (!isOwner(userId)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const settings = await prisma.platformSettings.findUnique({ where: { id: 'primary' } });
  return NextResponse.json({ showFloatingAssistant: settings?.showFloatingAssistant ?? true, showAcquisitionButton: settings?.showAcquisitionButton ?? true, showProfileJoinBadge: settings?.showProfileJoinBadge ?? true, showProfileShareButton: settings?.showProfileShareButton ?? true, showHomepageLivePreview: settings?.showHomepageLivePreview ?? true });
}
export async function PUT(request: Request) {
  const { userId } = auth();
  if (!isOwner(userId)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  const values = body as Record<string, unknown>;
  const keys = Object.keys(values);
  if (!keys.length || keys.some(k => !['showFloatingAssistant','showAcquisitionButton','showProfileJoinBadge','showProfileShareButton','showHomepageLivePreview'].includes(k)) || keys.some(k => typeof values[k] !== 'boolean')) {
    return NextResponse.json({ error: 'Only boolean promotional settings are accepted' }, { status: 400 });
  }
  const data = { ...(typeof values.showFloatingAssistant === 'boolean' ? { showFloatingAssistant: values.showFloatingAssistant } : {}), ...(typeof values.showAcquisitionButton === 'boolean' ? { showAcquisitionButton: values.showAcquisitionButton } : {}), ...(typeof values.showProfileJoinBadge === 'boolean' ? { showProfileJoinBadge: values.showProfileJoinBadge } : {}), ...(typeof values.showProfileShareButton === 'boolean' ? { showProfileShareButton: values.showProfileShareButton } : {}), ...(typeof values.showHomepageLivePreview === 'boolean' ? { showHomepageLivePreview: values.showHomepageLivePreview } : {}) };
  const result = await prisma.platformSettings.upsert({ where: { id: 'primary' }, create: { id: 'primary', ...data }, update: data });
  return NextResponse.json({ showFloatingAssistant: result.showFloatingAssistant, showAcquisitionButton: result.showAcquisitionButton, showProfileJoinBadge: result.showProfileJoinBadge, showProfileShareButton: result.showProfileShareButton, showHomepageLivePreview: result.showHomepageLivePreview });
}
