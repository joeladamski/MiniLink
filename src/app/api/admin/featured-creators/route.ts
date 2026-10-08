import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET() {
  const { userId } = auth();
  if (!userId || !process.env.PLATFORM_OWNER_CLERK_USER_ID || userId !== process.env.PLATFORM_OWNER_CLERK_USER_ID) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const users = await prisma.user.findMany({ where: { username: { not: null } }, select: { username: true, name: true }, orderBy: { createdAt: 'desc' }, take: 200 });
  return NextResponse.json({ users }, { headers: { 'Cache-Control': 'no-store' } });
}
