import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import AdminControls from './settings-controls';

export const dynamic = 'force-dynamic';
export default function AdminPage() {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');
  if (!process.env.PLATFORM_OWNER_CLERK_USER_ID || userId !== process.env.PLATFORM_OWNER_CLERK_USER_ID) redirect('/dashboard');
  return <AdminControls />;
}
