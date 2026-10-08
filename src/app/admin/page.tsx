import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [creators, links, profileViews, clicks, recent] = await Promise.all([
    prisma.user.count(),
    prisma.link.count(),
    prisma.pageView.count(),
    prisma.click.count(),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, username: true, createdAt: true },
    }),
  ]);
  const metrics = [
    { label: 'Creators', value: creators },
    { label: 'Links', value: links },
    { label: 'Profile views', value: profileViews },
    { label: 'Link clicks', value: clicks },
  ];
  return (
    <div className="max-w-6xl space-y-8">
      <header><h1 className="text-3xl font-bold">Platform Overview</h1><p className="mt-2 text-gray-400">Creator activity and platform operations at a glance.</p></header>
      <section aria-label="Platform metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(metric => <div key={metric.label} className="rounded-xl border border-gray-800 bg-gray-900 p-5"><p className="text-sm text-gray-400">{metric.label}</p><p className="mt-3 text-3xl font-bold">{metric.value.toLocaleString('en-US')}</p></div>)}
      </section>
      <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold">Recent creators</h2><Link className="text-purple-300 hover:underline" href="/admin/creators">View directory →</Link></div>
        {recent.length ? <ul className="divide-y divide-gray-800">{recent.map(user => <li key={user.id} className="flex items-center justify-between gap-3 py-3"><div><p className="font-medium">{user.name || user.username || 'Unnamed creator'}</p><p className="text-sm text-gray-400">{user.username ? '@' + user.username : 'No username'}</p></div><time className="text-sm text-gray-400" dateTime={user.createdAt.toISOString()}>{user.createdAt.toISOString().slice(0,10)}</time></li>)}</ul> : <p className="text-gray-400">No creator accounts yet.</p>}
      </section>
      <section className="rounded-xl border border-gray-800 bg-gray-900 p-6"><h2 className="text-xl font-semibold">Platform controls</h2><p className="mt-2 text-gray-400">Manage the floating assistant and acquisition button without redeploying.</p><Link href="/admin/settings" className="mt-4 inline-block rounded-lg bg-fuchsia-600 px-5 py-3 font-semibold hover:bg-fuchsia-500">Manage promotions →</Link></section>
    </div>
  );
}
