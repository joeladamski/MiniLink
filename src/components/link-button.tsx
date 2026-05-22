'use client';

import Image from 'next/image';
import { Link2, ArrowRight } from 'lucide-react';

interface LinkButtonProps {
    link: {
        id: string;
        url: string;
        title: string;
    };
    icon: React.ReactNode;
    brandColor?: string;
}

export default function LinkButton({
    link,
    icon,
    brandColor = 'var(--theme-text)'
}: LinkButtonProps) {
    const handleClick = async () => {
        // Track click - fire and forget
        try {
            fetch(`/api/track/${link.id}`, { method: 'POST' });
        } catch (error) {
            console.error('Failed to track click', error);
        }
    };

    return (
        <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="group relative flex items-center w-full p-2 rounded-[1.25rem] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:z-20 overflow-hidden bg-[var(--theme-link-bg)] hover:bg-[var(--theme-link-hover)] border border-[var(--theme-link-border)] text-[var(--theme-text)] backdrop-blur-xl shadow-md hover:shadow-lg"
            style={{
                boxShadow: '0 4px 12px -3px rgba(0,0,0,0.08), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
            }}
        >
            {/* Shimmer Effect Sweep */}
            <div className="absolute inset-0 scale-[2.0] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover:animate-[shimmer_2s_ease-out_infinite] pointer-events-none" />

            {/* Inner glow border (Subtle) */}
            <div className="absolute inset-0 rounded-[1.25rem] ring-1 ring-inset ring-white/10 pointer-events-none" />

            {/* Logo Brand Colored Glowing Icon Container */}
            <div
                className="relative shrink-0 w-[3.5rem] h-[3.5rem] flex items-center justify-center rounded-xl transition-all duration-300 overflow-hidden border shadow-sm group-hover:scale-105 group-hover:rotate-3"
                style={{
                    background: 'color-mix(in srgb, var(--theme-card) 95%, var(--theme-text) 5%)',
                    borderColor: `color-mix(in srgb, ${brandColor} 30%, transparent)`,
                    boxShadow: `0 0 8px color-mix(in srgb, ${brandColor} 12%, transparent), inset 0 1px 3px rgba(0,0,0,0.1)`
                }}
            >
                {/* Dynamic hover overlay to brighten the border and glow */}
                <div 
                    className="absolute inset-0 border-[1.5px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                        borderColor: brandColor,
                        boxShadow: `0 0 12px color-mix(in srgb, ${brandColor} 50%, transparent)`
                    }}
                />

                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 flex items-center justify-center">
                    {icon}
                </div>
            </div>

            {/* Text Content */}
            <div className="flex-1 flex justify-center pr-[3.5rem]">
                <span className="font-bold text-[15px] sm:text-[17px] tracking-wide transition-all duration-300 truncate px-2 group-hover:scale-[1.02] group-hover:translate-x-0.5 group-hover:rotate-1 inline-block" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    {link.title}
                </span>
            </div>

            {/* Elegant Right Arrow Indicator (slides in and glows on hover) */}
            <div 
                className="absolute right-5 w-8 h-8 rounded-full flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out z-10"
                style={{
                    background: 'color-mix(in srgb, var(--theme-text) 6%, transparent)',
                    color: 'var(--theme-text)'
                }}
            >
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>
        </a>
    );
}
