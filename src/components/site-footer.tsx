import Link from 'next/link';

export function SiteFooter() {
    const name = process.env.NEXT_PUBLIC_PLATFORM_NAME || 'MiniLink';
    return (
        <footer className="py-8 px-4 border-t border-gray-200/50 dark:border-white/5 bg-white dark:bg-[#0a0a0f]">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Link href="/" className="font-semibold text-gray-900 dark:text-white">{name}</Link>
                <span>Creator profiles and links</span>
                <a className="hover:underline" href="https://github.com/minianon/MiniLink" target="_blank" rel="noopener noreferrer">Open-source foundation</a>
            </div>
        </footer>
    );
}
