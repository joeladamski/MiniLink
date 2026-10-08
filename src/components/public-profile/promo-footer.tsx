'use client';

import Link from 'next/link';
import { Link2, Heart } from 'lucide-react';

interface PromoFooterProps {
    name?: string | null;
}

export default function PromoFooter({ name }: PromoFooterProps) {
    const displayName = name || 'MiniLink';

    return (
        <div className="mt-16 pb-12 flex justify-center opacity-0 animate-[fadeInUp_0.6s_ease-out_1s_forwards] relative z-50">
            <Link
                href="/"
                className="pointer-events-auto inline-flex items-center justify-center px-10 py-4 bg-white text-gray-900 rounded-full text-[15px] font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border border-gray-200"
            >
                Join {displayName} on {process.env.NEXT_PUBLIC_PLATFORM_NAME || 'BioLync Pro mini'}
            </Link>
        </div>
    );
}

