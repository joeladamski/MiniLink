import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Providers from '@/components/providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
    title: `${process.env.NEXT_PUBLIC_PLATFORM_NAME || 'MiniLink'} - Build Your Link in Bio`,
    description: 'MiniLink is the ultimate link-in-bio tool for creators, influencers, and businesses. Share all your content, social profiles, and products with a single, highly customizable URL.',
    keywords: ['linktree alternative', 'link in bio', 'social media links', 'creator tools', 'portfolio link', 'custom bio link'],
    authors: [{ name: 'Tushar Bhardwaj', url: 'https://tushar-bhardwaj.vercel.app' }],
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    openGraph: {
        title: 'MiniLink - Build Your Free Link in Bio',
        description: 'Share all your links, content, and products with one powerful, customizable bio link. Fast, secure, and 100% free.',
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        siteName: process.env.NEXT_PUBLIC_PLATFORM_NAME || 'MiniLink',
        images: [
            {
                url: '/og-image.png', // Assuming we might add an og-image later, or it uses a default
                width: 1200,
                height: 630,
                alt: 'MiniLink - Your fully customizable Link in Bio',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MiniLink - Build Your Free Link in Bio',
        description: 'Create your personalized link-in-bio page in seconds. Open-source, fast, and completely free.',
        creator: '@Tusharab2004',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <body className={`${inter.variable} font-sans`}>
                    <Providers>
                        {children}
                        <Toaster />
                    </Providers>
                </body>
            </html>
        </ClerkProvider>
    );
}
