'use client';

import { useState } from 'react';

import {
    Globe,
    Mail,
    MessageCircle,
    Send, // We will use a generic icon for folders if not provided
    Music2,
    Twitch,
    Coffee,
    ShoppingBag,
    Link2,
    Folder,
    FolderOpen,
    ChevronDown,
    Laptop,
    Share2
} from 'lucide-react';
import Image from 'next/image';
import LinkButton from '@/components/link-button';
import {
    XIcon,
    InstagramIcon,
    YoutubeIcon,
    LinkedinIcon,
    GithubIcon,
    FacebookIcon,
    WhatsappIcon,
    TelegramIcon,
    SpotifyIcon,
    TwitchIcon,
    KofiIcon,
    MediumIcon,
    TopmateIcon,
    LeetCodeIcon,
    CodeChefIcon,
    CodeforcesIcon,
    HackerRankIcon,
    HackerEarthIcon,
    GeeksforGeeksIcon
} from '@/components/icons';

const iconMap: Record<string, any> = {
    website: Globe,
    instagram: InstagramIcon,
    youtube: YoutubeIcon,
    twitter: XIcon,
    github: GithubIcon,
    linkedin: LinkedinIcon,
    facebook: FacebookIcon,
    medium: MediumIcon,
    topmate: TopmateIcon,
    whatsapp: WhatsappIcon,
    telegram: TelegramIcon,
    spotify: SpotifyIcon,
    twitch: TwitchIcon,
    kofi: KofiIcon,
    email: Mail,
    shop: ShoppingBag,
    leetcode: LeetCodeIcon,
    codechef: CodeChefIcon,
    codeforces: CodeforcesIcon,
    hackerrank: HackerRankIcon,
    hackerearth: HackerEarthIcon,
    gfg: GeeksforGeeksIcon,
    laptop: Laptop,
    socials: Share2,
    link: Link2,
};

const getIconColor = (iconName: string | null | undefined): string => {
    if (!iconName) return 'var(--theme-text)';
    
    const colors: Record<string, string> = {
        website: '#0ea5e9', // Sky blue
        instagram: '#e1306c', // Instagram gradient red/pink
        youtube: '#ff0000', // YouTube red
        twitter: '#1d9bf0', // Twitter blue
        github: '#64748b', // Slate gray
        linkedin: '#0077b5', // LinkedIn blue
        facebook: '#1877f2', // Facebook blue
        medium: '#00ab6c', // Medium green
        whatsapp: '#25d366', // WhatsApp green
        telegram: '#229ed9', // Telegram blue
        spotify: '#1db954', // Spotify green
        twitch: '#9146ff', // Twitch purple
        kofi: '#ff5e5b', // Ko-fi red
        email: '#ea4335', // Gmail red
        shop: '#ec4899', // Shop pink
        leetcode: '#ffa116', // Leetcode orange
        codechef: '#b45309', // Codechef brown
        codeforces: '#3b82f6', // Codeforces blue
        hackerrank: '#2ec866', // Hackerrank green
        hackerearth: '#3275b3', // Hackerearth blue
        gfg: '#2f8d46', // GFG green
        laptop: '#06b6d4', // Cyan
        socials: '#a855f7', // Purple
        link: '#64748b', // Slate
    };
    
    return colors[iconName.toLowerCase()] || 'var(--theme-text)';
};

interface Props {
    links: any[];
}

export default function ProfileLinks({ links }: Props) {
    const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

    const toggleFolder = (folderId: string) => {
        setExpandedFolders(prev => ({
            ...prev,
            [folderId]: !prev[folderId]
        }));
    };
    const visibleLinks = links.filter(link => {
        if (link.isFolder) {
            return link.children && link.children.length > 0;
        }
        return true;
    });

    return (
        <div className="space-y-4 relative">
            {visibleLinks.map((link, index) => {
                const IconComponent = (link.icon && iconMap[link.icon]) ? iconMap[link.icon] : (link.isFolder ? Folder : Link2);
                const isCustomIcon = link.icon?.startsWith('http');
                const isExpanded = expandedFolders[link.id];

                if (link.isFolder) {
                    return (
                        <div
                            key={link.id}
                            className="opacity-0 animate-spring-up relative z-10"
                            style={{ animationDelay: `${600 + index * 100}ms` }}
                        >
                            <button
                                onClick={() => toggleFolder(link.id)}
                                className="w-full relative group overflow-hidden rounded-[1.25rem] bg-black/20 dark:bg-white/[0.03] backdrop-blur-xl border border-white/10 p-4 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
                                style={{
                                    borderColor: 'var(--theme-link-border)',
                                    background: 'var(--theme-link-bg)'
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                <div className="relative flex items-center gap-4 z-10 w-full">
                                    <div
                                        className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/10"
                                        style={{ color: 'var(--theme-text)' }}
                                    >
                                        {isCustomIcon && link.icon ? (
                                            <Image
                                                src={link.icon}
                                                alt=""
                                                width={20}
                                                height={20}
                                                className="w-5 h-5 object-contain"
                                            />
                                        ) : link.icon && iconMap[link.icon] ? (
                                            <IconComponent className="w-5 h-5" />
                                        ) : (
                                            isExpanded ? <FolderOpen className="w-5 h-5" /> : <Folder className="w-5 h-5" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0 pr-2 pb-1 text-left">
                                        <div
                                            className="font-bold text-[17px] tracking-tight truncate group-hover:opacity-100 transition-opacity"
                                            style={{ color: 'var(--theme-text)' }}
                                        >
                                            {link.title}
                                        </div>
                                    </div>

                                    <div
                                        className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-all"
                                        style={{ color: 'var(--theme-text)' }}
                                    >
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                            </button>

                            {/* Expanded Children Container */}
                            <div
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="space-y-3 pl-4 pr-1 border-l-2 border-white/10 py-1">
                                    {link.children?.map((child: any, childIdx: number) => {
                                        const ChildIcon = (child.icon && iconMap[child.icon]) ? iconMap[child.icon] : Link2;
                                        const isChildCustom = child.icon?.startsWith('http');

                                        return (
                                            <div key={child.id} className="relative z-0 hover:z-50">
                                                <LinkButton
                                                    link={{
                                                        id: child.id,
                                                        url: child.url,
                                                        title: child.title
                                                    }}
                                                    icon={
                                                        isChildCustom && child.icon ? (
                                                            <Image
                                                                src={child.icon}
                                                                alt=""
                                                                width={20}
                                                                height={20}
                                                                className="w-5 h-5 object-contain"
                                                            />
                                                        ) : (
                                                            <ChildIcon className="w-5 h-5" />
                                                        )
                                                    }
                                                    brandColor={getIconColor(child.icon)}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                }

                return (
                    <div
                        key={link.id}
                        className="opacity-0 animate-spring-up relative hover:z-50"
                        style={{ animationDelay: `${600 + index * 100}ms` }}
                    >
                        <LinkButton
                            link={{
                                id: link.id,
                                url: link.url,
                                title: link.title
                            }}
                            icon={
                                isCustomIcon && link.icon ? (
                                    <Image
                                        src={link.icon}
                                        alt=""
                                        width={20}
                                        height={20}
                                        className="w-5 h-5 object-contain"
                                    />
                                ) : (
                                    <IconComponent className="w-5 h-5" />
                                )
                            }
                            brandColor={getIconColor(link.icon)}
                        />
                    </div>
                );
            })}
        </div>
    );
}
