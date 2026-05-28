import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { Link2, Crown } from 'lucide-react';
import LinkButton from '@/components/link-button';
import ProfileLinks from '@/components/public-profile/profile-links';
import PromoFooter from '@/components/public-profile/promo-footer';
import UnclaimedProfile from '@/components/public-profile/unclaimed-profile';
import ProfileAvatar from '@/components/public-profile/profile-avatar';
import ProfileActions from '@/components/public-profile/profile-actions';
import CreatorBadge from '@/components/public-profile/creator-badge';
import RebrandPromoBot from '@/components/public-profile/rebrand-promo-bot';

interface Props {
    params: { username: string };
}

export async function generateMetadata({ params }: Props) {
    const user = await prisma.user.findUnique({
        where: { username: params.username },
        select: { name: true, bio: true, username: true, avatar: true },
    });

    if (!user) {
        return {
            title: `Claim /${params.username} | MiniLink`,
            description: `The username /${params.username} is available! Claim it now on MiniLink to build your perfect profile.`,
        };
    }

    return {
        title: `${user.name || user.username} | MiniLink`,
        description: user.bio || `Check out ${user.name || user.username}'s links`,
        openGraph: {
            title: `${user.name || user.username} | MiniLink`,
            description: user.bio || `Check out ${user.name || user.username}'s links`,
        },
        icons: {
            icon: user.avatar || '/favicon.ico',
        },
    };
}

export default async function ProfilePage({ params }: Props) {
    const user = await prisma.user.findUnique({
        where: { username: params.username },
        include: {
            links: {
                where: {
                    isActive: true,
                    parentId: null
                },
                orderBy: { order: 'asc' },
                include: {
                    children: {
                        where: { isActive: true },
                        orderBy: { order: 'asc' }
                    }
                }
            },
        },
    });

    if (!user) {
        return <UnclaimedProfile username={params.username} />;
    }

    // Record page view
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || null;
    const referer = headersList.get('referer') || null;

    await prisma.pageView.create({
        data: {
            userId: user.id,
            userAgent,
            referer,
        },
    });

    const isAdmin = user.username?.toLowerCase() === 'tusharbhardwaj';
    const themeClass = `theme-${user.theme || 'default'}`;

    const customStyles = user.theme === 'custom' ? {
        '--theme-bg': user.customThemeBg || '#05010d',
        '--theme-card': user.customThemeCard || 'rgba(20, 15, 35, 0.7)',
        '--theme-text': user.customThemeText || '#ffffff',
        '--theme-link-bg': 'color-mix(in srgb, var(--theme-card) 50%, transparent)',
        '--theme-link-border': 'color-mix(in srgb, var(--theme-text) 20%, transparent)',
        '--theme-link-hover': 'color-mix(in srgb, var(--theme-card) 80%, transparent)',
        background: 'var(--theme-bg)'
    } as React.CSSProperties : { background: 'var(--theme-bg)' };

    return (
        <div className={`min-h-screen overflow-x-hidden ${themeClass}`} style={customStyles}>
            <ProfileActions user={{
                name: user.name,
                username: user.username,
                avatar: user.avatar,
                theme: user.theme,
                customThemeBg: user.customThemeBg,
                customThemeCard: user.customThemeCard,
                customThemeText: user.customThemeText
            }} />
            <div className={`max-w-lg mx-auto px-4 pb-12 ${
                user.avatarLayout === 'cover' ? 'pt-24 sm:pt-12' : 'pt-12'
            }`}>
                {/* Profile Header (Dynamic layout chosen by user) */}
                {(!user.avatarLayout || user.avatarLayout === 'classic') && (
                    <div className="relative mb-12 animate-scale-up-fade">
                        {/* Background Glass Card */}
                        <div
                            className="absolute inset-x-0 top-12 bottom-0 rounded-[3rem] backdrop-blur-2xl transition-all duration-500 hover:shadow-2xl"
                            style={{
                                background: 'color-mix(in srgb, var(--theme-card) 60%, transparent)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            {/* Ambient Glows Inside Card */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl pointer-events-none mix-blend-overlay"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/5 rounded-full blur-3xl pointer-events-none"></div>
                        </div>

                        <div className="relative pt-4 px-6 pb-10 text-center z-10">
                            {/* Avatar - Bounces and rolls in! */}
                            <div className="animate-bounce-roll" style={{ animationDelay: '150ms' }}>
                                <ProfileAvatar user={user} isAdmin={isAdmin} />
                            </div>

                            {/* Name - Rolls and slides in! */}
                            <div className="animate-roll-in" style={{ animationDelay: '350ms' }}>
                                <h1
                                    className="text-3xl font-extrabold mb-3 tracking-tight"
                                    style={{ color: 'var(--theme-text)', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                                >
                                    {user.name || `@${user.username}`}
                                    {isAdmin && <CreatorBadge />}
                                </h1>
                            </div>

                            {/* Bio - Springs up! */}
                            {user.bio && (
                                <div className="animate-spring-up" style={{ animationDelay: '500ms' }}>
                                    <p
                                        className="text-base sm:text-lg max-w-sm mx-auto leading-relaxed font-medium"
                                        style={{ color: 'color-mix(in srgb, var(--theme-text) 85%, transparent)' }}
                                    >
                                        {user.bio}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {user.avatarLayout === 'cover' && (
                    <div className="relative mb-12 animate-scale-up-fade group">
                        {/* 1. Subtle Volumetric Breathing Glow (Fades in on group hover) */}
                        <div className="absolute -inset-4 bg-[color-mix(in srgb,var(--theme-text)_6%,transparent)] rounded-[3.5rem] blur-2xl opacity-20 group-hover:opacity-35 transition-all duration-1000 animate-pulse pointer-events-none" />

                        {/* 2. Precision Glowing Border Contour (Active Moving Circumference Light) */}
                        <div 
                            className="absolute -inset-[2.5px] rounded-[3.08rem] overflow-hidden pointer-events-none z-0"
                            style={{
                                padding: '2.5px',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                maskComposite: 'exclude',
                            }}
                        >
                            {/* Dual rotating laser sweeps */}
                            <div 
                                className="absolute w-[200%] h-[200%] -left-1/2 -top-1/2 animate-[spin_4.5s_linear_infinite]"
                                style={{
                                    background: 'conic-gradient(from 0deg, transparent 35%, var(--theme-text) 50%, transparent 65%, transparent 85%, var(--theme-text) 92%, transparent 100%)',
                                }}
                            />
                        </div>

                        {/* 3. Ambient Laser Edge Glow (Adds volume and soft bloom to the moving laser) */}
                        <div 
                            className="absolute -inset-[2px] rounded-[3.06rem] pointer-events-none transition-all duration-700 opacity-60 group-hover:opacity-85 z-0" 
                            style={{
                                boxShadow: '0 0 22px -2px color-mix(in srgb, var(--theme-text) 40%, transparent), inset 0 0 8px color-mix(in srgb, var(--theme-text) 15%, transparent)',
                            }}
                        />

                        {/* Crown Badge floating in corner for Admin (outside card, tilted 45 degrees left on curved corner) */}
                        {isAdmin && (
                            <div className="absolute -top-2.5 -left-2.5 z-30 pointer-events-none -rotate-[45deg] animate-bounce-roll">
                                <div className="absolute inset-0 bg-yellow-400/40 rounded-full blur-md animate-pulse" />
                                <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 flex items-center justify-center shadow-lg border-2 border-yellow-200/50">
                                    <Crown className="w-4.5 h-4.5 text-yellow-900 drop-shadow-sm" strokeWidth={2.5} />
                                </div>
                            </div>
                        )}

                        <div className="relative rounded-[3rem] border shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col z-10"
                            style={{
                                background: 'var(--theme-card)',
                                borderColor: 'color-mix(in srgb, var(--theme-text) 8%, transparent)',
                            }}
                        >
                            {/* Top Image Container - Outer layout wrapper (rounded-t to clip the background banner) */}
                            <div className="relative w-full h-[330px] overflow-hidden rounded-t-[2.9rem]">
                                {/* Inner masking wrapper (no overflow-hidden, handles mask-image perfectly) */}
                                <div 
                                    className="relative w-full h-full"
                                    style={{
                                        WebkitMaskImage: 'linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.02) 12%, rgba(0, 0, 0, 0.6) 45%, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 1) 100%)',
                                        maskImage: 'linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.02) 12%, rgba(0, 0, 0, 0.6) 45%, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 1) 100%)'
                                    }}
                                >
                                    {user.avatar ? (
                                        <Image
                                            src={user.avatar}
                                            alt={user.name || user.username || "Cover Background"}
                                            fill
                                            className="object-cover absolute inset-0 z-0 select-none scale-[1.01] hover:scale-105 transition-transform duration-1000 animate-image-reveal"
                                            sizes="(max-width: 640px) 100vw, 512px"
                                            priority
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/80 to-accent-500/80 z-0 animate-image-reveal" />
                                    )}
                                    
                                    {/* Ambient Vignette */}
                                    <div className="absolute inset-0 bg-black/10 z-10" />

                                    {/* Glowing Laser Scanner Line */}
                                    <div className="absolute left-0 right-0 h-[4px] bg-gradient-to-r from-transparent via-[var(--theme-text)] to-transparent opacity-95 shadow-[0_0_15px_4px_color-mix(in srgb,var(--theme-text)_80%,transparent)] animate-laser-scan z-20 pointer-events-none" />
                                </div>
                            </div>
                            
                            {/* Bottom Content Area - positioned to overlap the soft faded area */}
                            <div className="relative px-6 pb-8 pt-2 text-center z-20 flex flex-col items-center -mt-8">
                                {/* Name - Centered */}
                                <div className="animate-roll-in mb-2" style={{ animationDelay: '350ms' }}>
                                    <h1
                                        className="text-3xl font-extrabold tracking-tight flex items-center justify-center gap-1.5"
                                        style={{ color: 'var(--theme-text)', textShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
                                    >
                                        {user.name || `@${user.username}`}
                                        {isAdmin && <CreatorBadge />}
                                    </h1>
                                </div>

                                {/* Bio - Centered */}
                                {user.bio && (
                                    <div className="animate-spring-up max-w-sm mx-auto" style={{ animationDelay: '500ms' }}>
                                        <p
                                            className="text-base sm:text-lg leading-relaxed font-medium"
                                            style={{ color: 'color-mix(in srgb, var(--theme-text) 85%, transparent)' }}
                                        >
                                            {user.bio}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {user.avatarLayout === 'blob' && (
                    <div className="relative mb-12 animate-scale-up-fade">
                        <div
                            className="absolute inset-0 rounded-[3rem] backdrop-blur-2xl transition-all duration-500 hover:shadow-2xl"
                            style={{
                                background: 'color-mix(in srgb, var(--theme-card) 60%, transparent)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl pointer-events-none mix-blend-overlay"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/5 rounded-full blur-3xl pointer-events-none"></div>
                        </div>

                        <div className="relative pt-8 px-6 pb-10 text-center z-10 flex flex-col items-center">
                            {/* Name - Rolls and slides in! */}
                            <div className="animate-roll-in mb-6 w-full" style={{ animationDelay: '200ms' }}>
                                <h1
                                    className="text-3xl font-extrabold tracking-tight flex items-center justify-center gap-1.5"
                                    style={{ color: 'var(--theme-text)', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                                >
                                    {user.name || `@${user.username}`}
                                    {isAdmin && <CreatorBadge />}
                                </h1>
                            </div>

                            {/* Organic Blob Avatar in the center - Bounces and rolls in! */}
                            <div className="animate-bounce-roll shrink-0 relative" style={{ animationDelay: '350ms' }}>
                                <ProfileAvatar user={user} isAdmin={isAdmin} layout="blob" />
                            </div>

                            {/* Bio - Springs up! */}
                            {user.bio && (
                                <div className="animate-spring-up w-full" style={{ animationDelay: '500ms' }}>
                                    <p
                                        className="text-base sm:text-lg max-w-sm mx-auto leading-relaxed font-medium"
                                        style={{ color: 'color-mix(in srgb, var(--theme-text) 85%, transparent)' }}
                                    >
                                        {user.bio}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <ProfileLinks links={user.links} />

                {/* Footer - Promotional */}
                <PromoFooter name={user.name || `@${user.username}`} />
            </div>
            <RebrandPromoBot
                username={user.username}
                name={user.name}
                theme={user.theme}
                customThemeBg={user.customThemeBg}
                customThemeCard={user.customThemeCard}
                customThemeText={user.customThemeText}
            />
        </div>
    );
}
