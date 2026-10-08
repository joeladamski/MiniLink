import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ReactNode } from 'react';

export const dynamic = 'force-dynamic';

const items = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/creators', label: 'Creators' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');
  if (!process.env.PLATFORM_OWNER_CLERK_USER_ID || userId !== process.env.PLATFORM_OWNER_CLERK_USER_ID) redirect('/dashboard');

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 lg:flex">
      <aside className="w-full border-b border-gray-800 bg-gray-900 lg:min-h-screen lg:w-60 lg:border-b-0 lg:border-r">
        <div className="p-5">
          <Link href="/admin" className="text-lg font-bold text-white">BioLync Pro mini</Link>
          <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">Platform Administration</p>
        </div>
        <nav aria-label="Platform administration" className="flex flex-wrap gap-2 px-4 pb-5 lg:flex-col">
          {items.map(item => (
            <Link key={item.href} href={item.href} className="rounded-lg px-4 py-2 text-sm text-gray-200 transition hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-fuchsia-400">{item.label}</Link>
          ))}
          <Link href="/dashboard" className="rounded-lg px-4 py-2 text-sm text-purple-300 hover:bg-gray-800">← Creator dashboard</Link>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}
