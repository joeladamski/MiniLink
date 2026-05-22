'use client';

import { useState } from 'react';
import { BadgeCheck } from 'lucide-react';

export default function CreatorBadge() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <span 
            className="relative inline-flex items-center ml-2.5 align-middle cursor-help group/badge select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* 1. Shimmering Dynamic Theme Ring (Spinning Halo) */}
            <span className={`absolute -inset-[3px] rounded-full bg-gradient-to-r from-[#1d9bf0] via-[#a855f7] to-[#f43f5e] blur-[2.5px] animate-[spin_4s_linear_infinite] transition-opacity duration-300 z-0 ${isHovered ? 'opacity-100' : 'opacity-70'}`} />

            {/* 2. High-Contrast Inner Backing Ring */}
            <span className="absolute inset-0 bg-neutral-950 rounded-full z-0 scale-[1.05]" />

            {/* 3. Glowing Verified Icon */}
            <BadgeCheck
                className={`relative w-6.5 h-6.5 z-10 drop-shadow-xl transition-all duration-700 ease-out ${isHovered ? 'scale-110 rotate-[360deg]' : ''}`}
                style={{
                    color: '#1d9bf0',
                    filter: 'drop-shadow(0 0 6px rgba(29, 155, 240, 0.7))',
                }}
                strokeWidth={2.5}
            />
            
            {/* 4. Interactive Glassmorphic Tooltip */}
            {isHovered && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3.5 py-1.5 bg-neutral-950/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out z-[9999] flex items-center gap-2">
                    {/* Pulsing Active Status Indicator */}
                    <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent whitespace-nowrap">
                        Verified Creator & Founder
                    </span>
                </div>
            )}
        </span>
    );
}
