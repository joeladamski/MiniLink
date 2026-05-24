import { auth, currentUser } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import {
    Link2,
    ArrowUpRight,
    Eye,
    MousePointer,
    TrendingUp,
    Plus,
    Copy,
    Check
} from 'lucide-react';
import { cookies, headers } from 'next/headers';
import CopyButton from '@/components/dashboard/copy-button';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard | MiniLink',
};

export default async function DashboardPage() {
    const { userId } = auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
        return null;
    }

    // Ensure user exists in Prisma
    let dbUser = await prisma.user.findUnique({
        where: { id: userId },
    });

    const cookieStore = cookies();
    const claimedUsername = cookieStore.get('minilink_claim')?.value;

    if (!dbUser) {
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        if (email) {
            // Check for existing user with same email (Legacy/NextAuth user)
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                // User exists but with different ID -> Migrate them
                const timestamp = Date.now();

                // 1. Rename old email AND username to free up unique constraints
                await prisma.user.update({
                    where: { id: existingUser.id },
                    data: {
                        email: `${email}.migrated.${timestamp}`,
                        username: `${existingUser.username || 'user'}_migrated_${timestamp}`
                    }
                });

                // 2. Create new user with Clerk ID
                dbUser = await prisma.user.create({
                    data: {
                        id: userId,
                        email: email,
                        username: existingUser.username, // Keep original username
                        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
                        avatar: clerkUser.imageUrl,
                    }
                });

                // 3. Move data (Links, PageViews) to new user
                await prisma.link.updateMany({
                    where: { userId: existingUser.id },
                    data: { userId: userId }
                });
                await prisma.pageView.updateMany({
                    where: { userId: existingUser.id },
                    data: { userId: userId }
                });

                // 4. Delete old user (now empty of relations)
                await prisma.user.delete({
                    where: { id: existingUser.id }
                });

            } else {
                // Completely new user
                // Completely new user
                let finalUsername = clerkUser.username || email.split('@')[0];

                if (claimedUsername) {
                    // Quick check to ensure the claimed username wasn't taken in the meantime
                    const taken = await prisma.user.findFirst({
                        where: {
                            username: {
                                equals: claimedUsername,
                                mode: 'insensitive'
                            }
                        }
                    });
                    if (!taken) {
                        finalUsername = claimedUsername;
                    }
                }

                dbUser = await prisma.user.create({
                    data: {
                        id: userId,
                        email: email,
                        username: finalUsername,
                        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
                        avatar: clerkUser.imageUrl,
                    }
                });
            }
        }
    }

    // Process claim cookie for existing users who might want to change their username via the claim flow
    if (dbUser && claimedUsername && dbUser.username !== claimedUsername) {
        const taken = await prisma.user.findFirst({
            where: {
                username: {
                    equals: claimedUsername,
                    mode: 'insensitive'
                }
            }
        });
        if (!taken) {
            dbUser = await prisma.user.update({
                where: { id: dbUser.id },
                data: { username: claimedUsername }
            });
        }
    }


    const [user, links, totalViews, totalClicks, totalLinksCount] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: { username: true, name: true, createdAt: true },
        }),
        prisma.link.findMany({
            where: { userId: userId, isFolder: false },
            orderBy: { clicks: 'desc' },
            take: 5,
        }),
        prisma.pageView.count({
            where: { userId: userId },
        }),
        prisma.link.aggregate({
            where: { userId: userId, isFolder: false },
            _sum: { clicks: true },
        }),
        prisma.link.count({
            where: { userId: userId, isFolder: false },
        }),
    ]);

    const headersList = headers();
    const host = headersList.get('host') || 'minianonlink.vercel.app';
    const protocol = headersList.get('x-forwarded-proto') || 'https';

    const profileUrl = user?.username
        ? `${protocol}://${host}/${user.username}`
        : null;

    const stats = [
        {
            label: 'Profile Views',
            value: totalViews,
            icon: Eye,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            label: 'Total Clicks',
            value: totalClicks?._sum?.clicks || 0,
            icon: MousePointer,
            color: 'from-purple-500 to-pink-500'
        },
        {
            label: 'Total Links',
            value: totalLinksCount,
            icon: Link2,
            color: 'from-orange-500 to-red-500'
        },
        {
            label: 'CTR',
            value: totalViews > 0
                ? `${(((totalClicks?._sum?.clicks || 0) / totalViews) * 100).toFixed(1)}%`
                : '0%',
            icon: TrendingUp,
            color: 'from-green-500 to-emerald-500'
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome back, {dbUser?.name || clerkUser.firstName}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Here is how your MiniLink is performing
                </p>
            </div>

            {/* Profile URL Card */}
            {profileUrl && (
                <div className="relative overflow-hidden mb-8 p-6 lg:p-8 rounded-2xl bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200 dark:border-gray-800/50 shadow-sm group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-all duration-700 pointer-events-none translate-x-1/2 -translate-y-1/2" />

                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div>
                            <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 uppercase tracking-wider mb-2">Your MiniLink URL</p>
                            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-all">{profileUrl}</p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <CopyButton text={profileUrl} />
                            <Link
                                href={`/${user?.username}`}
                                target="_blank"
                                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm shadow-primary-500/20 hover:-translate-y-0.5 w-full sm:w-auto"
                            >
                                <span>Visit</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 lg:mb-10">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="relative overflow-hidden bg-white/60 dark:bg-gray-900/40 backdrop-blur-md border border-gray-200 dark:border-gray-800/50 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group"
                    >
                        {/* Soft background flare */}
                        <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`} />

                        <div className="relative z-10">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="w-6 h-6 text-white drop-shadow-md" />
                            </div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1 font-[family-name:var(--font-geist-mono)]">
                                {stat.value}
                            </p>
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                {stat.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions & Top Links */}
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Quick Actions */}
                <div className="relative overflow-hidden bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200 dark:border-gray-800/50 rounded-2xl p-6 lg:p-8 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            href="/dashboard/links"
                            className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/80 dark:bg-gray-800/50 border border-transparent hover:border-primary-200/50 dark:hover:border-primary-800/30 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 group hover:-translate-y-1"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-4 border border-primary-100 dark:border-primary-800/50 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                <Plus className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Add New Link</span>
                        </Link>
                        <Link
                            href="/dashboard/appearance"
                            className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/80 dark:bg-gray-800/50 border border-transparent hover:border-accent-200/50 dark:hover:border-accent-800/30 hover:shadow-xl hover:shadow-accent-500/5 transition-all duration-300 group hover:-translate-y-1"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center mb-4 border border-accent-100 dark:border-accent-800/50 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-7 h-7 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">Customize Theme</span>
                        </Link>
                    </div>
                </div>

                {/* Top Links */}
                <div className="relative overflow-hidden bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200 dark:border-gray-800/50 rounded-2xl p-6 lg:p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top Performing Links</h2>
                        <Link
                            href="/dashboard/analytics"
                            className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                        >
                            View all
                        </Link>
                    </div>
                    {links.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                <Link2 className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-900 dark:text-white font-medium mb-1">No links yet</p>
                            <Link
                                href="/dashboard/links"
                                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium transition-colors"
                            >
                                Add your first link
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {links.slice(0, 5).map((link: any, index: number) => {
                                // Add beautiful metallic colors for top 3
                                let rankBadgeClass = "bg-gray-100 dark:bg-gray-800 text-gray-500 border border-gray-200/80 dark:border-gray-700";
                                if (index === 0) rankBadgeClass = "bg-gradient-to-br from-amber-200 to-yellow-400 dark:from-yellow-500 dark:to-amber-600 text-yellow-900 dark:text-yellow-50 border-0 shadow-sm";
                                if (index === 1) rankBadgeClass = "bg-gradient-to-br from-slate-200 to-gray-400 dark:from-slate-400 dark:to-gray-600 text-slate-800 dark:text-slate-50 border-0 shadow-sm";
                                if (index === 2) rankBadgeClass = "bg-gradient-to-br from-orange-200 to-amber-500 dark:from-orange-500 dark:to-amber-700 text-orange-950 dark:text-orange-50 border-0 shadow-sm";

                                return (
                                    <div
                                        key={link.id}
                                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white/80 dark:bg-gray-800/50 border border-gray-100/50 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-primary-100 dark:hover:border-primary-900/30 transition-all gap-4"
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-extrabold shrink-0 ${rankBadgeClass}`}>
                                                #{index + 1}
                                            </div>
                                            <div className="min-w-0 pr-4">
                                                <p className="font-bold text-gray-900 dark:text-white text-sm truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-0.5">
                                                    {link.title}
                                                </p>
                                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-primary-500 truncate hover:underline flex items-center gap-1 w-fit">
                                                    {link.url}
                                                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-900 rounded-lg shrink-0 self-end sm:self-auto border border-gray-200 dark:border-gray-800/50">
                                            <MousePointer className="w-3.5 h-3.5 text-primary-500" />
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{link.clicks.toLocaleString()}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
