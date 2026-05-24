'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { Loader2, AlertTriangle, Copy, Check, CheckCircle2, XCircle, Globe, User, ShieldAlert, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

export default function SettingsPage() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const { addToast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [copied, setCopied] = useState(false);
    const [username, setUsername] = useState('');
    const [originalUsername, setOriginalUsername] = useState('');
    const [error, setError] = useState('');
    const [profileUrl, setProfileUrl] = useState('');
    const [displayDomain, setDisplayDomain] = useState('link.minianon.in');

    // Live checking state
    const [isChecking, setIsChecking] = useState(false);
    const [availability, setAvailability] = useState<'idle' | 'available' | 'taken'>('idle');

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    // Debounced username check
    useEffect(() => {
        if (username === originalUsername) {
            setAvailability('idle');
            return;
        }

        if (username.length < 3) {
            setAvailability('idle');
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setAvailability('idle');
            return;
        }

        const checkUsername = async () => {
            setIsChecking(true);
            try {
                const res = await fetch(`/api/user/check-username?username=${encodeURIComponent(username)}`);
                const data = await res.json();
                setAvailability(data.available ? 'available' : 'taken');
            } catch (err) {
                console.error('Failed to check username:', err);
                setAvailability('idle');
            } finally {
                setIsChecking(false);
            }
        };

        const timeoutId = setTimeout(() => {
            checkUsername();
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [username, originalUsername]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const origin = window.location.origin;
            const host = window.location.host;
            setDisplayDomain(host);
            if (originalUsername) {
                setProfileUrl(`${origin}/${originalUsername}`);
            } else {
                setProfileUrl('');
            }
        }
    }, [originalUsername]);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/user/profile');
            const data = await res.json();
            setUsername(data.username || '');
            setOriginalUsername(data.username || '');
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveUsername = async () => {
        if (!username.trim()) {
            setError('Username cannot be empty');
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setError('Username can only contain letters, numbers, and underscores');
            return;
        }

        if (username.length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }

        if (availability === 'taken') {
            return;
        }

        setIsSaving(true);
        setError('');

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to update username');
                return;
            }

            setOriginalUsername(username);
            setAvailability('idle');
            router.refresh();

            addToast({
                title: 'Success',
                description: 'Username updated successfully.',
                variant: 'success',
            });

            // Optionally update Clerk username if you want to sync, 
            // but for now we are syncing local DB username.
            if (user) {
                try {
                    await user.update({ username });
                } catch (clerkError) {
                    // Ignore Clerk update errors as long as our DB is updated
                    console.warn('Clerk username sync failed:', clerkError);
                }
            }

        } catch (error) {
            setError('Something went wrong');
            addToast({
                title: 'Error',
                description: 'Failed to update username.',
                variant: 'error',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Manage your account and profile preferences
                </p>
            </div>

            <div className="space-y-6">
                {/* Username Section */}
                <div className="relative overflow-hidden bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200 dark:border-gray-800/50 rounded-2xl p-6 lg:p-8 shadow-sm group">
                    <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-all duration-700" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center border border-primary-200/50 dark:border-primary-800/50">
                                <Globe className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your MiniLink URL</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Choose a unique handle for your profile.</p>
                            </div>
                        </div>

                        <div className="mb-6 max-w-xl">
                            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-300 mb-2">Username</label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1 flex items-stretch relative group/input">
                                    <div className="flex items-center px-4 bg-gray-50 dark:bg-gray-800/50 border border-r-0 border-gray-200 dark:border-gray-700 rounded-l-xl text-gray-500 text-sm font-medium z-10 transition-colors group-focus-within/input:border-primary-500 group-focus-within/input:text-primary-600 dark:group-focus-within/input:text-primary-400">
                                        {displayDomain}/
                                    </div>
                                    <div className="relative flex-1 flex">
                                        <input
                                            type="text"
                                            className={`w-full bg-white dark:bg-gray-900 px-3 py-2.5 text-gray-900 dark:text-white rounded-r-xl border border-l-0 ${availability === 'taken'
                                                ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                                : availability === 'available'
                                                    ? 'border-green-500 focus:border-green-500 focus:ring-4 focus:ring-green-500/10'
                                                    : 'border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10'
                                                } outline-none transition-all pr-12`}
                                            value={username}
                                            onChange={(e) => {
                                                setUsername(e.target.value.toLowerCase());
                                                if (error) setError('');
                                            }}
                                            placeholder="username"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center bg-white dark:bg-gray-900 pl-2">
                                            {isChecking && <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />}
                                            {!isChecking && availability === 'available' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                            {!isChecking && availability === 'taken' && <XCircle className="w-5 h-5 text-red-500" />}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSaveUsername}
                                    disabled={isSaving || isChecking || availability === 'taken' || username === originalUsername || username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)}
                                    className="btn-primary whitespace-nowrap px-6 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all"
                                >
                                    {isSaving ? (
                                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>

                            {/* Feedback Messages */}
                            <div className="mt-2 min-h-[20px]">
                                {error && (
                                    <p className="text-red-500 text-sm flex items-center gap-1.5 animate-in slide-in-from-top-1 fade-in font-medium">
                                        <AlertTriangle className="w-4 h-4" /> {error}
                                    </p>
                                )}
                                {!error && availability === 'taken' && (
                                    <p className="text-red-500 text-sm flex items-center gap-1.5 animate-in slide-in-from-top-1 fade-in font-medium">
                                        <XCircle className="w-4 h-4" /> This username is already taken.
                                    </p>
                                )}
                                {!error && availability === 'available' && username !== originalUsername && (
                                    <p className="text-green-600 dark:text-green-400 text-sm flex items-center gap-1.5 animate-in slide-in-from-top-1 fade-in font-medium">
                                        <CheckCircle2 className="w-4 h-4" /> Username is available!
                                    </p>
                                )}
                                {!error && availability === 'idle' && username.length > 0 && username.length < 3 && username !== originalUsername && (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                        Username must be at least 3 characters.
                                    </p>
                                )}
                            </div>
                        </div>

                        {profileUrl && (
                            <div className="flex items-center gap-3 p-4 bg-gray-50/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/80 rounded-xl mt-4 max-w-xl transition-colors hover:bg-gray-100/80 dark:hover:bg-gray-800/80 group/copy">
                                <div className="p-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
                                    <Globe className="w-4 h-4 text-gray-400" />
                                </div>
                                <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{profileUrl}</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleCopy}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-sm border ${copied
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50'
                                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                Copy
                                            </>
                                        )}
                                    </button>
                                    <a
                                        href={profileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm shadow-primary-500/20"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Visit
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Account Section */}
                <div className="relative overflow-hidden bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200 dark:border-gray-800/50 rounded-2xl p-6 lg:p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border border-blue-200/50 dark:border-blue-800/50">
                            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Account Details</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Your connected email address.</p>
                        </div>
                    </div>

                    <div className="max-w-xl">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-300 mb-2">Email Address</label>
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-medium">
                            {user?.emailAddresses[0]?.emailAddress}
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="relative overflow-hidden bg-red-50/50 dark:bg-red-950/10 backdrop-blur-xl border border-red-200/50 dark:border-red-900/30 rounded-2xl p-6 lg:p-8 shadow-sm">
                    <div className="absolute -right-12 -top-12 w-40 h-40 bg-red-500/10 dark:bg-red-500/5 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center border border-red-200 dark:border-red-800 shrink-0 mt-1 sm:mt-0">
                                <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-red-600 dark:text-red-400">Danger Zone</h2>
                                <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">
                                    Sign out of your current session on this device.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => signOut(() => router.push('/'))}
                            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-sm shadow-red-500/20 transition-all hover:-translate-y-0.5 whitespace-nowrap self-start sm:self-auto"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
