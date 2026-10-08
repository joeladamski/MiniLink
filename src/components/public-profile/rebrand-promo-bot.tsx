'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Sparkles, ArrowRight } from 'lucide-react';

interface RebrandPromoBotProps {
    username: string | null;
    name: string | null;
    theme?: string | null;
    customThemeBg?: string | null;
    customThemeCard?: string | null;
    customThemeText?: string | null;
}

export default function RebrandPromoBot({
    username,
    name,
    theme = 'default',
    customThemeBg,
    customThemeCard,
    customThemeText
}: RebrandPromoBotProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Extract first name
    const firstName = name ? name.split(' ')[0] : (username || 'This creator');

    // Theme values for inline styling (matching page.tsx)
    const themeClass = `theme-${theme || 'default'}`;
    const customStyles = theme === 'custom' ? {
        '--theme-bg': customThemeBg || '#05010d',
        '--theme-card': customThemeCard || 'rgba(20, 15, 35, 0.7)',
        '--theme-text': customThemeText || '#ffffff',
        '--theme-link-bg': 'color-mix(in srgb, var(--theme-card) 50%, transparent)',
        '--theme-link-border': 'color-mix(in srgb, var(--theme-text) 20%, transparent)',
        '--theme-link-hover': 'color-mix(in srgb, var(--theme-card) 80%, transparent)',
    } as React.CSSProperties : {} as React.CSSProperties;

    // Mapping of themes to their primary and secondary color palettes for glowing effects and badges
    const themeColorMap: Record<string, { primary: string; secondary: string; glow: string }> = {
        default: { primary: '#7c3aed', secondary: '#db2777', glow: 'rgba(124, 58, 237, 0.15)' },
        dark: { primary: '#818cf8', secondary: '#c084fc', glow: 'rgba(129, 140, 248, 0.15)' },
        gradient: { primary: '#fda4af', secondary: '#f472b6', glow: 'rgba(253, 164, 175, 0.15)' },
        glass: { primary: '#0284c7', secondary: '#2563eb', glow: 'rgba(2, 132, 199, 0.15)' },
        neon: { primary: '#00ff88', secondary: '#00e5ff', glow: 'rgba(0, 255, 136, 0.2)' },
        minimal: { primary: '#18181b', secondary: '#71717a', glow: 'rgba(24, 24, 27, 0.1)' },
        ocean: { primary: '#38bdf8', secondary: '#2dd4bf', glow: 'rgba(56, 189, 248, 0.15)' },
        sunset: { primary: '#ea580c', secondary: '#db2777', glow: 'rgba(234, 88, 12, 0.15)' },
        mint: { primary: '#059669', secondary: '#10b981', glow: 'rgba(5, 150, 105, 0.15)' },
        monochrome: { primary: '#f5f5f5', secondary: '#a3a3a3', glow: 'rgba(245, 245, 245, 0.1)' },
        cyber: { primary: '#ff00ff', secondary: '#00ffff', glow: 'rgba(255, 0, 255, 0.2)' },
        earthy: { primary: '#9a3412', secondary: '#c2410c', glow: 'rgba(154, 52, 18, 0.1)' }
    };

    const activeColors = (() => {
        if (theme === 'custom' && customThemeText) {
            return {
                primary: customThemeText,
                secondary: customThemeBg && !customThemeBg.includes('rgba') ? customThemeBg : '#8b5cf6',
                glow: `color-mix(in srgb, ${customThemeText} 15%, transparent)`
            };
        }
        return themeColorMap[theme || 'default'] || themeColorMap.default;
    })();

    useEffect(() => {
        // Check session storage to see if they closed it in this session
        const closedSession = sessionStorage.getItem('minilink_bot_closed');
        if (closedSession === 'true') {
            setIsClosed(true);
            return;
        }

        // Pop up the bot message after a delay of 3.5 seconds
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 3500);

        return () => clearTimeout(timer);
    }, []);

    const handleBotClick = () => {
        if (!isVisible) {
            setIsVisible(true);
            setIsClosed(false);
            sessionStorage.removeItem('minilink_bot_closed');
        } else {
            setIsVisible(false);
            setIsClosed(true);
            // Persist close state for the session so it doesn't annoy them repeatedly
            sessionStorage.setItem('minilink_bot_closed', 'true');
        }
    };

    return (
        <div className={`fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 select-none ${themeClass}`} style={customStyles}>
            
            {/* 1. Dynamic Chat Bubble popup */}
            {isVisible && (
                <div
                    className="w-[300px] sm:w-[320px] rounded-3xl p-[1.5px] shadow-2xl animate-in slide-in-from-bottom-5 zoom-in-95 duration-500 ease-out relative overflow-hidden shrink-0"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        background: 'color-mix(in srgb, var(--theme-text) 12%, transparent)',
                        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.3)'
                    }}
                >
                    {/* Sweeping Light Ray (Border Sweep) - Dynamic gradients per theme */}
                    <div 
                        className="absolute top-0 bottom-0 w-24 pointer-events-none z-0"
                        style={{
                            animation: 'border-beam-sweep 4s infinite linear',
                            background: `linear-gradient(to right, transparent, color-mix(in srgb, ${activeColors.primary} 40%, transparent) 30%, ${activeColors.secondary} 50%, color-mix(in srgb, ${activeColors.primary} 40%, transparent) 70%, transparent)`
                        }}
                    />

                    {/* Inline style for keyframes to keep component self-contained */}
                    <style>{`
                        @keyframes border-beam-sweep {
                            0% { left: -50%; }
                            40% { left: 150%; }
                            100% { left: 150%; }
                        }
                    `}</style>

                    {/* Inner Card Mask (Covers the center so light is only visible on the 1.5px border) */}
                    <div 
                        className="w-full h-full rounded-[22.5px] p-5 backdrop-blur-2xl flex flex-col gap-3.5 relative z-10"
                        style={{
                            background: 'color-mix(in srgb, var(--theme-card) 95%, transparent)',
                            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1)'
                         }} 
                    >
                        {/* Background Light Glow inside bubble - themed dynamically */}
                        <div 
                            className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl pointer-events-none"
                            style={{
                                background: activeColors.glow
                            }}
                        />

                        {/* Header Bar */}
                        <div className="flex items-center justify-between z-10">
                            <div className="flex items-center gap-2">
                                {/* Animated Bot Avatar using MiniLink's signature logo styling - themed dynamically */}
                                <div className="relative w-8 h-8 shrink-0">
                                    <div 
                                        className="absolute inset-0 rounded-lg"
                                        style={{
                                            background: `linear-gradient(to bottom right, ${activeColors.primary}, ${activeColors.secondary})`
                                        }}
                                    />
                                    <div className="absolute inset-[1.5px] rounded-[7px] bg-white dark:bg-[#0a0a0f] flex items-center justify-center">
                                        <span 
                                            className="text-[13px] font-black bg-clip-text text-transparent leading-none"
                                            style={{
                                                backgroundImage: `linear-gradient(to bottom right, ${activeColors.primary}, ${activeColors.secondary})`
                                            }}
                                        >
                                            M
                                        </span>
                                    </div>
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-black rounded-full animate-pulse z-10" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-[11px] font-black tracking-wider uppercase" style={{ color: 'var(--theme-text)' }}>
                                        Mini Anon AI
                                    </span>
                                    <span className="text-[9px] font-bold opacity-60" style={{ color: 'var(--theme-text)' }}>
                                        Active Platform Assistant
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Chat Bubble Message */}
                        <div className="text-left text-xs sm:text-[13px] leading-relaxed font-medium z-10" style={{ color: 'color-mix(in srgb, var(--theme-text) 90%, transparent)' }}>
                            Hey there! 👋 <br />
                            <span className="font-extrabold" style={{ color: 'var(--theme-text)' }}>{firstName}</span> created this premium, high-speed profile in seconds using <a href="/" className="font-extrabold hover:underline transition-all duration-300" style={{ color: activeColors.primary }} >{process.env.NEXT_PUBLIC_PLATFORM_NAME || 'BioLync Pro mini'}</a>. <br />
                            You can claim and build yours for free too!
                        </div>

                        {/* Call to Action CTA Button */}
                        <a
                            href="/"
                            className="group flex items-center justify-center gap-2 py-2.5 px-5 rounded-2xl text-[12px] font-bold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] z-10 text-white select-none shrink-0"
                            style={{
                                background: `linear-gradient(135deg, ${activeColors.primary} 0%, ${activeColors.secondary} 100%)`,
                                boxShadow: `0 4px 15px color-mix(in srgb, ${activeColors.primary} 30%, transparent)`
                            }}
                        >
                            Create your own {process.env.NEXT_PUBLIC_PLATFORM_NAME || 'BioLync Pro mini'}
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </a>
                    </div>
                </div>
            )}

            {/* 2. Floating Bot Button (Launcher) */}
            <button
                onClick={handleBotClick}
                className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group overflow-hidden border"
                style={{
                    background: 'color-mix(in srgb, var(--theme-card) 90%, transparent)',
                    borderColor: isVisible ? 'var(--theme-text)' : 'color-mix(in srgb, var(--theme-text) 12%, transparent)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                }}
            >
                {/* Glow behind bot launcher when bubble is open or closed - themed dynamically */}
                <div 
                    className="absolute -inset-1 rounded-full opacity-40 blur-[3px] animate-[spin_8s_linear_infinite] pointer-events-none group-hover:opacity-60 transition-opacity" 
                    style={{
                        background: `linear-gradient(to top right, ${activeColors.primary}, ${activeColors.secondary})`
                    }}
                />
                
                {/* Center backdrop to pop icon */}
                <div className="absolute inset-[2px] bg-neutral-950/10 rounded-full z-0" />

                {/* Speech Icon or Cross depending on open state */}
                {isVisible ? (
                    <X className="w-6 h-6 z-10 transition-transform duration-300 rotate-90" style={{ color: 'var(--theme-text)' }} />
                ) : (
                    <MessageCircle className="w-6 h-6 z-10 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6" style={{ color: 'var(--theme-text)' }} />
                )}
            </button>
        </div>
    );
}
