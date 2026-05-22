'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import PromoFooter from '@/components/public-profile/promo-footer';
import ProfileLinks from '@/components/public-profile/profile-links';
import ProfileActions from '@/components/public-profile/profile-actions';

interface ProfilePreviewProps {
    data: {
        name: string;
        username: string;
        bio: string;
        avatar: string;
        theme: string;
        customThemeBg?: string;
        customThemeCard?: string;
        customThemeText?: string;
        avatarLayout?: string;
        links: any[];
    };
    device?: 'mobile' | 'desktop';
}

export default function ProfilePreview({ data, device = 'mobile' }: ProfilePreviewProps) {
    const themeClass = `theme-${data.theme || 'default'}`;
    const isMobile = device === 'mobile';
    const [domain, setDomain] = useState('minianonlink.vercel.app');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Only use window.location.host if it's NOT the local dev environment,
            // otherwise stick to the official branded domain for the clean "wow" factor.
            const host = window.location.host;
            if (host.includes('minilink') || host.includes('vercel.app')) {
                setDomain(host);
            }
        }
    }, []);

    const customStyles = data.theme === 'custom' ? {
        '--theme-bg': data.customThemeBg || '#05010d',
        '--theme-card': data.customThemeCard || 'rgba(20, 15, 35, 0.7)',
        '--theme-text': data.customThemeText || '#ffffff',
        '--theme-link-bg': 'color-mix(in srgb, var(--theme-card) 50%, transparent)',
        '--theme-link-border': 'color-mix(in srgb, var(--theme-text) 20%, transparent)',
        '--theme-link-hover': 'color-mix(in srgb, var(--theme-card) 80%, transparent)',
        background: 'var(--theme-bg)'
    } as React.CSSProperties : { background: 'var(--theme-bg)' };

    // The content inside the device screen
    const screenContent = (
        <div className={`w-full h-full ${isModalOpen ? 'overflow-hidden' : 'overflow-y-auto'} hide-scrollbar relative ${themeClass}`} style={customStyles}>
            <ProfileActions
                user={{
                    name: data.name,
                    username: data.username,
                    avatar: data.avatar,
                    theme: data.theme,
                    customThemeBg: data.customThemeBg || null,
                    customThemeCard: data.customThemeCard || null,
                    customThemeText: data.customThemeText || null,
                }}
                isInline={true}
                onOpenChange={setIsModalOpen}
            />
            <div className={`px-4 pb-12 flex flex-col min-h-full ${!isMobile ? 'items-center max-w-sm mx-auto' : ''} ${
                data.avatarLayout === 'cover' ? 'pt-24' : 'pt-12'
            }`}>

                {/* Dynamic Conditional Header Layout */}
                {(!data.avatarLayout || data.avatarLayout === 'classic') && (
                    <div
                        className="text-center mb-6 p-4 rounded-3xl backdrop-blur-lg w-full border"
                        style={{
                            background: 'var(--theme-card)',
                            borderColor: 'color-mix(in srgb, var(--theme-text) 8%, transparent)',
                            color: 'var(--theme-text)'
                        }}
                    >
                        <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden ring-4 ring-white/30">
                            {data.avatar ? (
                                <Image
                                    src={data.avatar}
                                    alt="Avatar"
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-white">
                                        {(data.name || data.username || 'U')[0]?.toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>

                        <h2 className="text-lg font-bold mb-1 line-clamp-1">
                            {data.name || `@${data.username || 'username'}`}
                        </h2>
                        {data.bio && (
                            <p className="text-xs opacity-80 line-clamp-3">
                                {data.bio}
                            </p>
                        )}
                    </div>
                )}

                  {data.avatarLayout === 'cover' && (
                    <div className="relative mb-6 group">
                        {/* 1. Subtle Volumetric Breathing Glow */}
                        <div className="absolute -inset-2.5 bg-[color-mix(in srgb,var(--theme-text)_6%,transparent)] rounded-[2rem] blur-xl opacity-15 group-hover:opacity-25 transition-all duration-1000 animate-pulse pointer-events-none" />

                        {/* 2. Precision Moving Circumference Light */}
                        <div 
                            className="absolute -inset-[2px] rounded-[1.6rem] overflow-hidden pointer-events-none z-0"
                            style={{
                                padding: '2px',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                maskComposite: 'exclude',
                            }}
                        >
                            <div 
                                className="absolute w-[200%] h-[200%] -left-1/2 -top-1/2 animate-[spin_4.5s_linear_infinite]"
                                style={{
                                    background: 'conic-gradient(from 0deg, transparent 35%, var(--theme-text) 50%, transparent 65%)',
                                }}
                            />
                        </div>

                        {/* 3. Ambient Laser Edge Glow */}
                        <div 
                            className="absolute -inset-[1.5px] rounded-[1.55rem] pointer-events-none transition-all duration-700 opacity-60 group-hover:opacity-85 z-0" 
                            style={{
                                boxShadow: '0 0 15px -2px color-mix(in srgb, var(--theme-text) 35%, transparent), inset 0 0 6px color-mix(in srgb, var(--theme-text) 15%, transparent)',
                            }}
                        />

                        <div
                            className="relative rounded-3xl backdrop-blur-lg w-full overflow-hidden flex flex-col border z-10"
                            style={{
                                background: 'var(--theme-card)',
                                borderColor: 'color-mix(in srgb, var(--theme-text) 8%, transparent)',
                                color: 'var(--theme-text)'
                            }}
                        >
                        {/* Top Image Container */}
                        <div className="relative w-full h-[190px] overflow-hidden">
                            {/* Inner masking wrapper (no overflow-hidden, handles mask-image perfectly) */}
                            <div 
                                className="relative w-full h-full"
                                style={{
                                    WebkitMaskImage: 'linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.02) 12%, rgba(0, 0, 0, 0.6) 45%, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 1) 100%)',
                                    maskImage: 'linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0.02) 12%, rgba(0, 0, 0, 0.6) 45%, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 1) 100%)'
                                }}
                            >
                                {data.avatar ? (
                                    <Image
                                        src={data.avatar}
                                        alt="Cover"
                                        fill
                                        className="object-cover absolute inset-0 z-0 select-none animate-image-reveal"
                                        sizes="(max-width: 640px) 100vw, 512px"
                                        priority
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/80 to-accent-500/80 z-0 animate-image-reveal" />
                                )}
                                <div className="absolute inset-0 bg-black/10 z-10" />

                                {/* Glowing Laser Scanner Line */}
                                <div className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[var(--theme-text)] to-transparent opacity-95 shadow-[0_0_12px_3px_color-mix(in srgb,var(--theme-text)_80%,transparent)] animate-laser-scan z-20 pointer-events-none" />
                            </div>
                        </div>

                        {/* Bottom Content Area */}
                        <div className="relative px-4 pb-5 pt-1 text-center z-20 flex flex-col items-center -mt-5">
                            <h2 className="text-base font-bold mb-1 w-full truncate">
                                {data.name || `@${data.username || 'username'}`}
                            </h2>
                             {data.bio && (
                                <p className="text-[10px] opacity-80 max-w-xs line-clamp-3 leading-normal">
                                    {data.bio}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                )}

                {data.avatarLayout === 'blob' && (
                    <div
                        className="text-center mb-6 p-5 rounded-3xl backdrop-blur-lg w-full flex flex-col items-center border"
                        style={{
                            background: 'var(--theme-card)',
                            borderColor: 'color-mix(in srgb, var(--theme-text) 8%, transparent)',
                            color: 'var(--theme-text)'
                        }}
                    >
                        <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
                            <defs>
                                <clipPath id="preview-blob-clip" clipPathUnits="objectBoundingBox">
                                    <path d="M 0.5 0 C 0.75 0, 0.9 0.15, 0.9 0.35 C 0.9 0.45, 0.8 0.5, 0.8 0.5 C 0.8 0.5, 0.9 0.55, 0.9 0.65 C 0.9 0.85, 0.75 1, 0.5 1 C 0.25 1, 0.1 0.85, 0.1 0.65 C 0.1 0.55, 0.2 0.5, 0.2 0.5 C 0.2 0.5, 0.1 0.45, 0.1 0.35 C 0.1 0.15, 0.25 0, 0.5 0 Z" />
                                </clipPath>
                            </defs>
                        </svg>

                        <h2 className="text-lg font-bold mb-3.5 w-full truncate">
                            {data.name || `@${data.username || 'username'}`}
                        </h2>

                        <div 
                            className="w-24 h-24 mb-3.5 overflow-hidden shadow-lg shrink-0 relative transition-transform duration-500 hover:scale-105"
                            style={{
                                clipPath: 'url(#preview-blob-clip)',
                                WebkitClipPath: 'url(#preview-blob-clip)',
                            }}
                        >
                            {data.avatar ? (
                                <Image
                                    src={data.avatar}
                                    alt="Avatar"
                                    fill
                                    className="w-full h-full object-cover"
                                    sizes="96px"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                                    <span className="text-2xl font-black text-white">
                                        {(data.name || data.username || 'U')[0]?.toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {data.bio && (
                            <p className="text-xs opacity-80 max-w-xs line-clamp-3 leading-relaxed">
                                {data.bio}
                            </p>
                        )}
                    </div>
                )}

                {/* Links */}
                <div className="space-y-3 flex-1 w-full">
                    {data.links && data.links.length > 0 ? (
                        <ProfileLinks links={data.links} />
                    ) : (
                        <div className="text-center p-4 opacity-50 text-sm" style={{ color: 'var(--theme-text)' }}>
                            No links added yet
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <div className="scale-90 origin-bottom">
                        <PromoFooter name={data.name} />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`
            ${isMobile
                ? 'border-[12px] border-gray-900 rounded-[3rem] max-w-[320px] aspect-[9/19] bg-gray-900 shadow-2xl overflow-hidden'
                : 'w-full max-w-4xl mx-auto transform scale-[0.85] sm:scale-100 transition-transform'
            } 
            relative transition-all duration-300 mx-auto
        `}>
            {isMobile ? (
                <>
                    {/* Phone Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-gray-900 rounded-b-xl z-20"></div>
                    {/* Screen Content for Mobile */}
                    <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden">
                        {screenContent}
                    </div>
                </>
            ) : (
                // Laptop Frame (High Fidelity)
                <div className="relative">
                    {/* Laptop Screen Frame */}
                    <div className="relative bg-gray-900 rounded-t-xl p-2 shadow-2xl mx-auto z-10">
                        {/* Camera */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-700 rounded-full z-20"></div>

                        {/* Screen Content Container */}
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative z-10">
                            {/* Browser Chrome */}
                            <div className="h-7 bg-gray-200 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-800 flex items-center px-3 gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] border border-[#E0443E]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] border border-[#D89E24]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840] border border-[#1AAB29]"></div>
                                </div>
                                {/* Address Bar */}
                                <div className="flex-1 mx-2">
                                    <div className="bg-white dark:bg-gray-800 rounded-md h-5 flex items-center px-2 shadow-sm border border-gray-200 dark:border-gray-700">
                                        <div className="flex-1 flex items-center gap-1 text-[10px] text-gray-500">
                                            <span className="text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg></span>
                                            <span className="truncate">
                                                {domain}
                                                /{data.username || 'username'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actual Preview Area */}
                            <div className="aspect-video w-full bg-white dark:bg-gray-950 pointer-events-auto overflow-hidden">
                                <div className="w-[200%] h-[200%] origin-top-left transform scale-50">
                                    {screenContent}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Laptop Base */}
                    <div className="relative w-[110%] -left-[5%] h-3 bg-gray-300 dark:bg-gray-700 rounded-b-xl -mt-1 shadow-md z-0">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-gray-400 dark:bg-gray-600 rounded-b"></div>
                    </div>
                    {/* Shadow/Feet */}
                    <div className="w-[114%] -left-[7%] relative h-1.5 bg-gray-200 dark:bg-gray-800 rounded-b-3xl mx-auto shadow-lg mt-0"></div>
                </div>
            )}
        </div>
    );
}
