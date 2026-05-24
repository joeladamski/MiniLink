'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, Check, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface JoinModalProps {
    isOpen: boolean;
    onClose: () => void;
    isInline?: boolean;
}

export default function JoinModal({ isOpen, onClose, isInline = false }: JoinModalProps) {
    const [wordIndex, setWordIndex] = useState(0);
    const words = ['musicians.', 'creators.', 'influencers.', 'artists.', 'monetizers.', 'everyone.'];
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    // Claim state
    const [username, setUsername] = useState('');
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [checking, setChecking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [domain, setDomain] = useState('link.minianon.in');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const host = window.location.host;
            if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
                setDomain(host);
            }
        }
    }, []);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            const interval = setInterval(() => {
                setWordIndex((prev) => (prev + 1) % words.length);
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [isOpen, words.length]);

    // Availability check with debounce
    useEffect(() => {
        if (!username || username.length < 3) {
            setIsAvailable(null);
            setChecking(false);
            return;
        }

        const checkAvailability = async () => {
            setChecking(true);
            try {
                const res = await fetch(`/api/user/check-username?username=${username}&strict=true`);
                const data = await res.json();
                setIsAvailable(data.available);
            } catch (err) {
                console.error('Error checking username:', err);
            } finally {
                setChecking(false);
            }
        };

        const timeout = setTimeout(checkAvailability, 500);
        return () => clearTimeout(timeout);
    }, [username]);

    const handleClaim = () => {
        if (!username || !isAvailable) return;

        // Set the claim cookie
        Cookies.set('minilink_claim', username, { expires: 1 / 24, path: '/' });
        router.push('/sign-up');
    };

    if (!isOpen) return null;

    return (
        <div className={`${isInline ? 'absolute mt-7' : 'fixed'} inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300`}>
            <div className={`relative w-full ${isInline ? 'max-w-md' : 'max-w-lg'} bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 zoom-in-95 duration-500 border border-white/10`}
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-20"
                >
                    <X className="w-6 h-6 text-white" />
                </button>

                <div className="px-8 pt-16 pb-12 relative z-10 font-sans">
                    {/* Logo/Icon */}
                    <div className="mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gray-900 border border-white/20 flex items-center justify-center shadow-lg transform -rotate-12">
                            <span className="text-xl font-black bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">M</span>
                        </div>
                    </div>

                    {/* Headline */}
                    <h2 className={`${isInline ? 'text-[1.75rem] sm:text-[2rem]' : 'text-[2.5rem] sm:text-[3.25rem]'} font-black leading-[1.1] text-white mb-6 tracking-tight`}>
                        The only link in bio <br />
                        loved by <br />
                        <div className="h-16 overflow-hidden relative">
                            {words.map((word, i) => (
                                <span
                                    key={i}
                                    className={`absolute inset-x-0 top-0 text-violet-400 transition-all duration-1000 ease-in-out transform ${i === wordIndex
                                        ? 'translate-y-0 opacity-100'
                                        : i === (wordIndex - 1 + words.length) % words.length
                                            ? '-translate-y-full opacity-0'
                                            : 'translate-y-full opacity-0'
                                        }`}
                                >
                                    {word}
                                </span>
                            ))}
                        </div>
                    </h2>

                    <p className="text-lg font-medium text-white/70 mb-10 max-w-md leading-relaxed">
                        Everything you are, in one simple link. Join the next generation of creators and brands everywhere.
                    </p>

                    {/* Claim Username Input */}
                    <div className="space-y-4 mb-10">
                        <div className={`relative flex items-stretch bg-white/5 border-2 rounded-2xl transition-all shadow-xl overflow-hidden ${isAvailable === true
                            ? 'border-green-500/50'
                            : isAvailable === false
                                ? 'border-red-500/50'
                                : 'border-white/10 group-focus-within:border-violet-500'
                            }`}>
                            <div className="flex items-center pl-5 pr-1 text-white/40 font-bold whitespace-nowrap bg-white/[0.02]">
                                {domain}/
                            </div>
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="yourname"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                                    className="w-full bg-transparent py-5 pl-1 pr-12 text-lg font-bold text-white placeholder:text-white/20 outline-none"
                                />
                                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                                    {checking ? (
                                        <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                                    ) : isAvailable === true ? (
                                        <Check className="w-5 h-5 text-green-500" />
                                    ) : isAvailable === false ? (
                                        <AlertCircle className="w-5 h-5 text-red-500" />
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {isAvailable === false && (
                            <p className="text-red-400 text-sm font-bold animate-in fade-in slide-in-from-top-1 px-2">
                                Whoops! This username is already taken. Try another.
                            </p>
                        )}
                        {isAvailable === true && (
                            <p className="text-green-400 text-sm font-bold animate-in fade-in slide-in-from-top-1 px-2">
                                Great choice! This MiniLink is available.
                            </p>
                        )}

                        <button
                            onClick={handleClaim}
                            disabled={!isAvailable || checking}
                            className={`w-full text-white text-lg font-bold py-5 rounded-full transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${isAvailable
                                ? 'bg-gradient-to-r from-violet-600 to-pink-600 hover:scale-[1.02] hover:shadow-violet-500/30'
                                : 'bg-white/10 text-white/30 cursor-not-allowed'
                                }`}
                        >
                            {checking ? 'Checking...' : 'Claim your MiniLink'}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/sign-up"
                            className="px-8 py-3.5 border-2 border-violet-400/30 text-violet-400 font-bold rounded-full hover:bg-violet-400 hover:text-white transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                        >
                            Sign up free
                        </Link>
                        <Link
                            href="/"
                            className="px-8 py-3.5 border-2 border-white/10 text-white/60 font-bold rounded-full hover:border-white/20 hover:text-white transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Find out more
                        </Link>
                    </div>
                </div>

                {/* Decorative Mockup */}
                <div className="absolute -bottom-16 -right-16 w-80 h-80 rotate-[15deg] opacity-10 pointer-events-none hidden sm:block">
                    <div className="w-full h-full bg-gradient-to-br from-violet-600 via-purple-500 to-pink-500 rounded-[3rem] p-6 shadow-2xl backdrop-blur-3xl border border-white/20">
                        <div className="w-full h-2/3 bg-white/20 rounded-[1.5rem] mb-4"></div>
                        <div className="w-1/2 h-8 bg-white/20 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
