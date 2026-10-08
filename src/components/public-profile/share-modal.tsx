'use client';

import { X, Copy, Twitter, Facebook, MessageCircle, Send, Linkedin, Github } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        name: string | null;
        username: string | null;
        avatar: string | null;
        theme: string;
        customThemeBg: string | null;
        customThemeCard: string | null;
        customThemeText: string | null;
    };
    isInline?: boolean;
}

export default function ShareModal({ isOpen, onClose, user, isInline = false }: ShareModalProps) {
    const [copied, setCopied] = useState(false);
    const username = user.username || '';
    const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/${username}` : '';
    const shareTitle = `Check out ${user.name || username}'s BioLync Pro mini!`;

    const handleCopy = () => {
        navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = (platform: string) => {
        let url = '';
        switch (platform) {
            case 'x':
                url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(shareTitle)}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
                break;
            case 'whatsapp':
                url = `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + profileUrl)}`;
                break;
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;
                break;
            case 'messenger':
                url = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(profileUrl)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(profileUrl)}`;
                break;
        }

        if (url) {
            window.open(url, '_blank', 'width=600,height=400');
        }
    };

    if (!isOpen) return null;

    const shareOptions = [
        {
            id: 'x',
            label: 'X',
            color: 'bg-black',
            icon: (
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            )
        },
        {
            id: 'facebook',
            label: 'Facebook',
            color: 'bg-[#1877F2]',
            icon: (
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            )
        },
        {
            id: 'whatsapp',
            label: 'WhatsApp',
            color: 'bg-[#25D366]',
            icon: (
                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.298-.771.966-.944 1.166-.173.199-.347.223-.647.073-.302-.15-1.272-.469-2.422-1.494-.897-.8-1.502-1.787-1.68-2.087-.177-.3-.02-.461.13-.611.135-.134.302-.35.454-.525.148-.175.197-.299.299-.498.101-.199.05-.373-.025-.522-.075-.15-.672-1.62-.922-2.22-.243-.585-.487-.504-.672-.513-.173-.008-.372-.01-.572-.01-.199 0-.525.075-.798.373-.274.298-1.048 1.025-1.048 2.498 0 1.474 1.073 2.898 1.222 3.096.15.199 2.108 3.218 5.105 4.513.714.31 1.271.495 1.706.634.717.228 1.37.195 1.885.118.574-.086 1.767-.722 2.016-1.417.25-.694.25-1.289.175-1.417-.075-.128-.275-.198-.576-.349z" />
                    <path d="M12.072 0C5.405 0 0 5.405 0 12.072c0 2.128.547 4.132 1.506 5.88l-1.6 5.857 6.002-1.575a11.972 11.972 0 006.164 1.693c6.666 0 12.072-5.405 12.072-12.072C24.144 5.405 18.739 0 12.072 0zm0 22.083c-1.808 0-3.582-.486-5.12-1.405l-.367-.218-3.791.996 1.012-3.693-.24-.38a10.021 10.021 0 01-1.543-5.31c0-5.553 4.519-10.072 10.072-10.072s10.072 4.519 10.072 10.072-4.519 10.072-10.072 10.072z" />
                </svg>
            )
        },
        {
            id: 'linkedin',
            label: 'LinkedIn',
            color: 'bg-[#0077B5]',
            icon: (
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
            )
        },
        {
            id: 'messenger',
            label: 'Messenger',
            color: 'bg-gradient-to-tr from-[#006AFF] to-[#00E5FF]',
            icon: (
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.302 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.293 14.957l-3.078-3.283-6.01 3.283 6.61-7.017 3.078 3.283 6.01-3.283-6.61 7.017z" />
                </svg>
            )
        },
    ];

    const cardStyles = user.theme === 'custom' ? {
        background: user.customThemeCard || 'rgba(20, 15, 35, 0.7)',
        color: user.customThemeText || '#ffffff'
    } : {
        background: `var(--theme-card)`,
        color: `var(--theme-text)`
    };

    return (
        <div className={`${isInline ? 'absolute mt-7' : 'fixed'} inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300`}>
            <div className={`relative w-full ${isInline ? 'max-w-sm' : 'max-w-md'} bg-white rounded-[2rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 zoom-in-95 duration-500 flex flex-col theme-${user.theme}`}>
                {/* Header */}
                <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Share BioLync Pro mini</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className={`p-6 space-y-8 ${isInline ? 'max-h-[60vh]' : 'max-h-[80vh]'} overflow-y-auto bg-white font-sans`}>
                    {/* Profile Preview Card */}
                    <div
                        className="relative rounded-3xl overflow-hidden p-8 text-center backdrop-blur-2xl transition-all duration-500 hover:shadow-2xl group shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border border-white/10"
                        style={{
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                            color: '#ffffff',
                        }}
                    >
                        <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/20 rounded-full blur-3xl"></div>
                        </div>
                        <div className="relative z-10 scale-100 group-hover:scale-[1.02] transition-transform duration-500">
                            <div className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white/20 shadow-xl overflow-hidden relative">
                                {user.avatar ? (
                                    <Image src={user.avatar} alt={user.name || username} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                                        <span className="text-2xl font-bold">{username[0]?.toUpperCase() || 'M'}</span>
                                    </div>
                                )}
                            </div>
                            <h4 className="text-xl font-black mb-1">{user.name || `@${username}`}</h4>
                            <div className="flex items-center justify-center gap-1.5 font-bold text-violet-400">
                                <span className="text-sm">BioLync Pro mini</span>
                                <span>/</span>
                                <span className="text-sm">{username}</span>
                            </div>
                        </div>
                    </div>

                    {/* Share Grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-y-10 gap-x-2">
                        <button
                            onClick={handleCopy}
                            className="flex flex-col items-center gap-3 group"
                        >
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-all shadow-sm group-active:scale-90">
                                <Copy className={`w-5 h-5 text-gray-900 transition-transform ${copied ? 'scale-125 text-violet-600' : ''}`} />
                            </div>
                            <span className="text-[11px] font-bold text-gray-600 transition-colors group-hover:text-gray-900 text-center leading-tight">
                                {copied ? 'Copied!' : 'Copy link'}
                            </span>
                        </button>

                        {shareOptions.map((option, i) => (
                            <button
                                key={i}
                                onClick={() => handleShare(option.id)}
                                className="flex flex-col items-center gap-3 group"
                            >
                                <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center group-hover:scale-110 transition-all shadow-md group-active:scale-95`}>
                                    {option.icon}
                                </div>
                                <span className="text-[11px] font-bold text-gray-600 text-center leading-tight group-hover:text-gray-900 transition-colors">{option.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Footer Info */}
                    <div className="border-t border-gray-100 pt-6">
                        <h4 className="font-black text-gray-900 mb-2 font-sans tracking-tight">Join {username} on BioLync Pro mini</h4>
                        <p className="text-sm text-gray-500 font-medium mb-6 leading-relaxed">
                            Get your own free BioLync Pro mini. The link in bio loved by creators everywhere.
                        </p>
                        <div className="flex gap-3">
                            <Link
                                href="/sign-up"
                                className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-black py-4 rounded-full hover:scale-[1.02] active:scale-95 transition-all text-center shadow-lg hover:shadow-violet-500/20"
                            >
                                Sign up free
                            </Link>
                            <Link
                                href="/"
                                className="flex-1 border-2 border-violet-100 text-violet-600 font-black py-4 rounded-full hover:bg-violet-50 active:scale-95 transition-all text-center"
                            >
                                Find out more
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
