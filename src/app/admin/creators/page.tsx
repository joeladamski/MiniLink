import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

type SearchParams = { q?: string | string[]; page?: string | string[] };
export default async function CreatorsPage({ searchParams }: { searchParams?: SearchParams }) {
  const rawQuery = typeof searchParams?.q === 'string' ? searchParams.q : '';
  const query = rawQuery.trim().slice(0, 100);
  const rawPage = typeof searchParams?.page === 'string' ? Number(searchParams.page) : 1;
  const requestedPage = Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const where = query ? {
    OR: [
      { name: { contains: query, mode: 'insensitive' as const } },
      { username: { contains: query, mode: 'insensitive' as const } },
      { email: { contains: query, mode: 'insensitive' as const } },
    ],
  } : {};
  const total = await prisma.user.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const creators = await prisma.user.findMany({
    where,
    orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true, name: true, username: true, email: true, avatar: true, createdAt: true,
      _count: { select: { links: true, pageViews: true } },
    },
  });
  const hrefFor = (target: number) => '/admin/creators?' + new URLSearchParams({ ...(query ? { q: query } : {}), page: String(target) }).toString();
  return (
    <div className="max-w-6xl space-y-6">
      <div><h1 className="text-3xl font-bold">Creators</h1><p className="mt-2 text-gray-400">Read-only directory of registered creator accounts.</p></div>
      <form action="/admin/creators" method="GET" className="flex max-w-xl gap-2">
        <input type="search" name="q" aria-label="Search creators" defaultValue={query} maxLength={100} placeholder="Search name, username or email" className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white" />
        <button type="submit" className="rounded-lg bg-fuchsia-600 px-5 py-3 font-semibold text-white hover:bg-fuchsia-500">Search</button>
      </form>
      <p className="text-sm text-gray-400">{total} matching creator{total === 1 ? '' : 's'} · Page {page} of {totalPages}</p>
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="min-w-full divide-y divide-gray-800 text-left text-sm">
          <thead className="bg-gray-900 text-gray-300"><tr><th className="p-4">Creator</th><th className="p-4">Email</th><th className="p-4">Registered</th><th className="p-4">Links</th><th className="p-4">Views</th><th className="p-4">Profile</th></tr></thead>
          <tbody className="divide-y divide-gray-800">
            {creators.map(creator => <tr key={creator.id} className="hover:bg-gray-900/60">
              <td className="p-4"><span className="font-semibold">{creator.name || 'Unnamed creator'}</span><div className="text-gray-400">{creator.username ? '@' + creator.username : 'No username'}</div></td>
              <td className="p-4 text-gray-300">{creator.email}</td>
              <td className="p-4 whitespace-nowrap text-gray-300">{creator.createdAt.toISOString().slice(0, 10)}</td>
              <td className="p-4">{creator._count.links}</td>
              <td className="p-4">{creator._count.pageViews}</td>
              <td className="p-4">{creator.username ? <Link className="text-purple-300 hover:underline" href={'/' + encodeURIComponent(creator.username)} target="_blank" rel="noopener noreferrer">View profile ↗</Link> : <span className="text-gray-500">Not set up</span>}</td>
            </tr>)}
            {!creators.length && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No creators match this search.</td></tr>}
          </tbody>
        </table>
      </div>
      <nav aria-label="Creator directory pagination" className="flex items-center justify-between">
        {page > 1 ? <Link href={hrefFor(page - 1)} className="rounded-lg border border-gray-700 px-4 py-2 hover:bg-gray-800">← Previous</Link> : <span className="text-gray-500">First page</span>}
        {page < totalPages ? <Link href={hrefFor(page + 1)} className="rounded-lg border border-gray-700 px-4 py-2 hover:bg-gray-800">Next →</Link> : <span className="text-gray-500">Last page</span>}
      </nav>
    </div>
  );
}
