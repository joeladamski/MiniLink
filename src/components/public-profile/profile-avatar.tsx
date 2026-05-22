'use client';

import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, Maximize2, Crown, ArrowLeft } from 'lucide-react';

interface ProfileAvatarProps {
    user: {
        name: string | null;
        username: string | null;
        avatar: string | null;
        theme?: string | null;
        customThemeBg?: string | null;
        customThemeCard?: string | null;
        customThemeText?: string | null;
    };
    isAdmin?: boolean;
    layout?: 'classic' | 'blob';
}

export default function ProfileAvatar({ user, isAdmin = false, layout = 'classic' }: ProfileAvatarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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

    const toggleOpen = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    // Handle Escape key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Lock body scrolling when lightbox is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const isBlob = layout === 'blob';

    return (
        <>
            {isBlob && (
                <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
                    <defs>
                        <clipPath id="public-blob-clip" clipPathUnits="objectBoundingBox">
                            <path d="M 0.5 0 C 0.75 0, 0.9 0.15, 0.9 0.35 C 0.9 0.45, 0.8 0.5, 0.8 0.5 C 0.8 0.5, 0.9 0.55, 0.9 0.65 C 0.9 0.85, 0.75 1, 0.5 1 C 0.25 1, 0.1 0.85, 0.1 0.65 C 0.1 0.55, 0.2 0.5, 0.2 0.5 C 0.2 0.5, 0.1 0.45, 0.1 0.35 C 0.1 0.15, 0.25 0, 0.5 0 Z" />
                        </clipPath>
                    </defs>
                </svg>
            )}

            <div
                className={`relative w-32 h-32 mx-auto group cursor-pointer ${
                    isBlob ? 'mb-6' : 'mb-8'
                }`}
                onClick={toggleOpen}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {isBlob ? (
                    /* Organic Blob Aura */
                    <div 
                        className="absolute -inset-1.5 bg-gradient-to-r from-[var(--theme-text)] via-transparent to-[var(--theme-text)] opacity-40 blur-[2px] animate-[spin_8s_linear_infinite]"
                        style={{
                            clipPath: 'url(#public-blob-clip)',
                            WebkitClipPath: 'url(#public-blob-clip)',
                        }}
                    />
                ) : (
                    <>
                        {/* 1. Outer Lens Glow (Breathing) */}
                        <div className="absolute -inset-4 bg-white/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-1000 animate-pulse"></div>

                        {/* 2. Slow Outer Ring (Faint) */}
                        <div className="absolute -inset-2 border border-white/10 rounded-full animate-[spin_10s_linear_infinite] opacity-50 group-hover:opacity-80 transition-opacity"></div>

                        {/* 3. Rotating Theme-Colored Halo (Soft Glow) */}
                        <div
                            className="absolute -inset-2 rounded-full opacity-40 blur-[4px] animate-[spin_6s_linear_infinite] pointer-events-none"
                            style={{
                                background: 'conic-gradient(from 0deg, var(--theme-text) 0%, transparent 50%, var(--theme-text) 100%)',
                            }}
                        />

                        {/* 4. Rotating Theme-Colored Sweep (Sharp Light) */}
                        <div
                            className="absolute -inset-1.5 rounded-full opacity-75 blur-[1.5px] animate-[spin_3s_linear_infinite] pointer-events-none"
                            style={{
                                background: 'conic-gradient(from 180deg, var(--theme-text) 0%, transparent 60%, var(--theme-text) 100%)',
                            }}
                        />

                        {/* 5. Frosted Glass Border */}
                        <div className="absolute inset-0 bg-white/20 dark:bg-black/20 rounded-full scale-[1.04] backdrop-blur-md border border-white/50 shadow-2xl"></div>
                    </>
                )}

                {/* 6. Avatar Container */}
                <div 
                    className={`relative w-full h-full overflow-hidden bg-white dark:bg-gray-950 shadow-inner group-hover:scale-[0.97] transition-transform duration-700 z-10 ${
                        isBlob ? 'shadow-xl' : 'rounded-full ring-1 ring-white/10'
                    }`}
                    style={isBlob ? {
                        clipPath: 'url(#public-blob-clip)',
                        WebkitClipPath: 'url(#public-blob-clip)',
                    } : undefined}
                >
                    {user.avatar ? (
                        <Image
                            src={user.avatar}
                            alt={user.name || user.username || 'User'}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="128px"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                            <span className={`${isBlob ? 'text-4xl' : 'text-5xl'} font-black text-white drop-shadow-md`}>
                                {(user.name || user.username || 'U')[0].toUpperCase()}
                            </span>
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                        <Maximize2 className="w-6 h-6 text-white/80" />
                    </div>
                </div>

                {/* Crown Badge for Admin */}
                {isAdmin && (
                    <div className={`absolute z-20 pointer-events-none -rotate-[20deg] ${
                        isBlob ? 'top-0 -left-2' : '-top-1 -left-1'
                    }`}>
                        {/* Gold glow */}
                        <div className="absolute inset-0 bg-yellow-400/40 rounded-full blur-md animate-pulse" />
                        <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30 border-2 border-yellow-200/50 ring-2 ring-yellow-400/20">
                            <Crown className="w-4.5 h-4.5 text-yellow-900 drop-shadow-sm" strokeWidth={2.5} />
                        </div>
                    </div>
                )}

            </div>

            {/* Lightbox / Modal (WhatsApp Style) */}
            {isOpen && mounted && createPortal(
                <div
                    className={`fixed inset-0 z-[100] flex flex-col animate-in fade-in duration-300 overflow-hidden select-none ${themeClass}`}
                    style={customStyles}
                    onClick={toggleOpen}
                >
                    {/* 1. WhatsApp Style Header Bar */}
                    <div 
                        className="relative w-full h-16 flex items-center justify-between px-4 z-[110] border-b"
                        style={{
                            background: 'color-mix(in srgb, var(--theme-card) 75%, transparent)',
                            borderColor: 'color-mix(in srgb, var(--theme-text) 8%, transparent)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3">
                            <button
                                className="p-2 -ml-2 rounded-full transition-all active:scale-95 hover:bg-black/5 dark:hover:bg-white/5"
                                style={{
                                    color: 'var(--theme-text)',
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleOpen();
                                }}
                            >
                                <ArrowLeft className="w-6 h-6" style={{ color: 'var(--theme-text)' }} />
                            </button>
                            <span className="font-semibold text-lg tracking-tight select-none" style={{ color: 'var(--theme-text)' }}>
                                {user.name || `@${user.username}`}
                            </span>
                        </div>
                    </div>

                    {/* 2. Main Image Container (Full Screen Center) */}
                    <div
                        className="flex-1 w-full flex items-center justify-center p-2 z-[105]"
                        onClick={toggleOpen}
                    >
                        <div
                            className="relative w-[min(90vw,80vh,500px)] aspect-square animate-in zoom-in-95 duration-300 ease-out shrink-0 rounded-3xl overflow-hidden"
                            style={{
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 50px color-mix(in srgb, var(--theme-text) 15%, transparent)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {user.avatar ? (
                                <Image
                                    src={user.avatar}
                                    alt={user.name || user.username || 'User'}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 100vw, 800px"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center rounded-none shadow-2xl">
                                    <span className="text-9xl font-black text-white">
                                        {(user.name || user.username || 'U')[0].toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
