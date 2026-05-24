'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Loader2, Check, Upload, Laptop, Smartphone, User, Palette, Lock } from 'lucide-react';
import Image from 'next/image';
import { CldUploadButton } from 'next-cloudinary';
import { useToast } from '@/components/ui/toaster';
import ProfilePreview from '@/components/dashboard/profile-preview';

const THEMES = [
    { id: 'default', name: 'Clean', preview: 'bg-gradient-to-br from-gray-100 to-gray-200' },
    { id: 'dark', name: 'Dark', preview: 'bg-gradient-to-br from-gray-900 to-gray-800' },
    { id: 'ocean', name: 'Ocean', preview: 'bg-gradient-to-br from-slate-900 via-cyan-900 to-sky-900' },
    { id: 'sunset', name: 'Sunset', preview: 'bg-gradient-to-br from-orange-400 to-pink-500' },
    { id: 'mint', name: 'Mint', preview: 'bg-gradient-to-br from-teal-400 to-emerald-500' },
    { id: 'gradient', name: 'Lavender', preview: 'bg-gradient-to-br from-purple-500 to-pink-500' },
    { id: 'glass', name: 'Glass', preview: 'bg-gradient-to-br from-cyan-400 to-blue-500' },
    { id: 'neon', name: 'Neon', preview: 'bg-gradient-to-br from-indigo-900 to-purple-900' },
    { id: 'minimal', name: 'Minimal', preview: 'bg-white border border-gray-200' },
    { id: 'monochrome', name: 'Monochrome', preview: 'bg-zinc-950 border border-zinc-800' },
    { id: 'cyber', name: 'Cyber', preview: 'bg-gradient-to-br from-fuchsia-900 to-blue-900' },
    { id: 'earthy', name: 'Earthy', preview: 'bg-gradient-to-br from-amber-100 to-stone-200' },
    { id: 'custom', name: 'Custom', preview: 'bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-400 dark:border-gray-600' },
];

const LAYOUTS = [
    {
        id: 'classic',
        name: 'Classic Circle',
        description: 'Centered circular avatar with interactive outer ring glows'
    },
    {
        id: 'cover',
        name: 'Cover Banner',
        description: 'Avatar fills the background with a smooth vertical bottom gradient fade'
    },
    {
        id: 'blob',
        name: 'Organic Blob',
        description: 'Name on top with avatar clipped inside an organic clover leaf shape'
    }
];

export default function AppearancePage() {
    const { user } = useUser();
    const { addToast } = useToast();
    const isAdmin = 
        user?.username?.toLowerCase() === 'tusharbhardwaj' ||
        (process.env.NEXT_PUBLIC_ADMIN_USERNAME && user?.username?.toLowerCase() === process.env.NEXT_PUBLIC_ADMIN_USERNAME.toLowerCase()) ||
        (process.env.NEXT_PUBLIC_ADMIN_USER_ID && user?.id === process.env.NEXT_PUBLIC_ADMIN_USER_ID);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
    const [profile, setProfile] = useState({
        username: '',
        name: '',
        bio: '',
        avatar: '',
        theme: 'default',
        customThemeBg: '#05010d',
        customThemeCard: 'rgba(20, 15, 35, 0.7)',
        customThemeText: '#ffffff',
        avatarLayout: 'classic',
        links: [] as any[],
    });

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const [profileRes, linksRes] = await Promise.all([
                fetch('/api/user/profile'),
                fetch('/api/links')
            ]);

            const profileData = await profileRes.json();
            const linksData = await linksRes.json();

            setProfile({
                username: profileData.username || '',
                name: profileData.name || '',
                bio: profileData.bio || '',
                avatar: profileData.avatar || '',
                theme: profileData.theme || 'default',
                customThemeBg: profileData.customThemeBg || '#05010d',
                customThemeCard: profileData.customThemeCard || 'rgba(20, 15, 35, 0.7)',
                customThemeText: profileData.customThemeText || '#ffffff',
                avatarLayout: profileData.avatarLayout || 'classic',
                links: Array.isArray(linksData) ? linksData.filter((l: any) => l.isActive) : [],
            });
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const router = useRouter();

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: profile.name,
                    bio: profile.bio,
                    avatar: profile.avatar,
                    theme: profile.theme,
                    customThemeBg: profile.customThemeBg,
                    customThemeCard: profile.customThemeCard,
                    customThemeText: profile.customThemeText,
                    avatarLayout: profile.avatarLayout,
                }),
            });

            if (res.ok) {
                // Update Clerk user name if changed
                // Update Clerk user name if changed
                if (user && profile.name) {
                    const nameParts = profile.name.trim().split(/\s+/);
                    const firstName = nameParts[0];
                    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

                    await user.update({
                        firstName: firstName,
                        lastName: lastName,
                    });
                }

                router.refresh();
                addToast({
                    title: 'Success',
                    description: 'Your profile appearance has been updated.',
                    variant: 'success',
                });
            } else {
                addToast({
                    title: 'Error',
                    description: 'Failed to save changes. Please try again.',
                    variant: 'error',
                });
            }
        } catch (error) {
            console.error('Failed to save profile:', error);
            addToast({
                title: 'Error',
                description: 'An unexpected error occurred.',
                variant: 'error',
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Appearance
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Customize how your profile looks
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Left Column - Editor */}
                <div className="lg:col-span-6 space-y-8">
                    {/* Profile Section */}
                    <div className="relative overflow-hidden bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200 dark:border-gray-800/50 rounded-2xl p-6 lg:p-8 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary-500" />
                            Profile Details
                        </h2>

                        <div className="flex flex-col sm:flex-row items-start gap-6 mb-8 p-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800/50">
                            {/* Avatar */}
                            <div className="flex-shrink-0 relative group">
                                <CldUploadButton
                                    uploadPreset="minilink_preset"
                                    onUpload={(result: any) => {
                                        if (result.info?.secure_url) {
                                            setProfile((prev) => ({ ...prev, avatar: result.info.secure_url }));
                                        }
                                    }}
                                    className="block relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-accent-400 ring-4 ring-white dark:ring-gray-800 shadow-xl group-hover:ring-primary-500/30 transition-all duration-300"
                                >
                                    {profile.avatar ? (
                                        <Image
                                            src={profile.avatar}
                                            alt="Avatar"
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                                            {(profile.name || user?.emailAddresses[0]?.emailAddress || 'U')[0].toUpperCase()}
                                        </div>
                                    )}
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Upload className="w-6 h-6 text-white" />
                                    </div>
                                </CldUploadButton>
                            </div>

                            <div className="flex-1 space-y-3 pt-1">
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Profile Picture</h3>
                                    <p className="text-sm text-gray-500">PNG, JPG or GIF up to 5MB</p>
                                </div>
                                <CldUploadButton
                                    uploadPreset="minilink_preset"
                                    onUpload={(result: any) => {
                                        if (result.info?.secure_url) {
                                            setProfile((prev) => ({ ...prev, avatar: result.info.secure_url }));
                                        }
                                    }}
                                    className="inline-flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow-sm shadow-primary-500/20 transition-all hover:-translate-y-0.5"
                                >
                                    <Upload className="w-4 h-4" />
                                    <span>Upload New Image</span>
                                </CldUploadButton>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-300 mb-2">Display Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder:text-gray-400"
                                    placeholder="Your Name"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block flex justify-between items-baseline text-sm font-semibold text-gray-900 dark:text-gray-300 mb-2">
                                    <span>Bio</span>
                                    <span className="text-xs font-medium text-gray-400">{profile.bio.length}/200</span>
                                </label>
                                <textarea
                                    className="w-full bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder:text-gray-400 min-h-[120px] resize-none"
                                    placeholder="Tell the world about yourself..."
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    maxLength={200}
                                />
                            </div>

                            {/* Layout Selection */}
                            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">Avatar & Header Layout</h3>
                                <p className="text-xs text-gray-500 mb-6">Choose how your avatar, name, and bio are arranged on your page.</p>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    {LAYOUTS.map((layout) => {
                                        const isSelected = profile.avatarLayout === layout.id;
                                        const isLocked = layout.id === 'cover' && !isAdmin;
                                        return (
                                            <button
                                                key={layout.id}
                                                type="button"
                                                onClick={() => {
                                                    if (isLocked) {
                                                        addToast({
                                                            title: 'Layout Exclusive 👑',
                                                            description: 'The Cover Banner layout is exclusive to the platform founder.',
                                                            variant: 'error',
                                                        });
                                                        return;
                                                    }
                                                    setProfile({ ...profile, avatarLayout: layout.id });
                                                }}
                                                className={`
                                                    relative text-left p-4 rounded-2xl border-2 transition-all flex flex-col justify-between h-44 overflow-hidden group
                                                    ${isSelected
                                                        ? 'border-primary-500 bg-primary-50/30 dark:bg-primary-900/5 shadow-sm'
                                                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-900/30'
                                                    }
                                                    ${isLocked ? 'opacity-70 cursor-not-allowed' : ''}
                                                `}
                                            >
                                                {/* Mini schematic preview of the layout */}
                                                <div className="w-full h-16 rounded-lg bg-gray-100 dark:bg-gray-950 border border-gray-200/50 dark:border-gray-800/50 flex flex-col items-center justify-center p-2 relative overflow-hidden">
                                                    {layout.id === 'classic' && (
                                                        <div className="flex flex-col items-center gap-1.5 w-full">
                                                            <div className="w-6 h-6 rounded-full border-2 border-primary-500 bg-primary-500/20 shrink-0" />
                                                            <div className="w-16 h-1.5 bg-gray-300 dark:bg-gray-700 rounded" />
                                                            <div className="w-10 h-1 bg-gray-200 dark:bg-gray-800 rounded" />
                                                        </div>
                                                    )}
                                                    {layout.id === 'cover' && (
                                                        <div className="w-full h-full relative flex flex-col justify-end p-1.5 bg-gradient-to-t from-gray-900 to-gray-800/40">
                                                            <div className="absolute top-1 left-2 w-3 h-3 rounded-full border border-white/20 bg-white/10" />
                                                            <div className="w-12 h-1 bg-white/80 rounded mb-0.5" />
                                                            <div className="w-8 h-0.5 bg-white/40 rounded" />
                                                        </div>
                                                    )}
                                                    {layout.id === 'blob' && (
                                                        <div className="flex flex-col items-center justify-between h-full py-0.5">
                                                            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded" />
                                                            <div className="w-8 h-8 rounded-full border-2 border-primary-500 bg-primary-500/20 shrink-0 relative flex items-center justify-center">
                                                                {/* Custom SVG inside the miniature layout representer */}
                                                                <svg viewBox="0 0 100 100" className="w-full h-full fill-primary-500/30 stroke-primary-500 stroke-[4px]">
                                                                    <path d="M 50 0 C 75 0, 90 15, 90 35 C 90 45, 80 50, 80 50 C 80 50, 90 55, 90 65 C 90 85, 75 100, 50 100 C 25 100, 10 85, 10 65 C 10 55, 20 50, 20 50 C 20 50, 10 45, 10 35 C 10 15, 25 0, 50 0 Z" />
                                                                </svg>
                                                            </div>
                                                            <div className="w-8 h-0.5 bg-gray-200 dark:bg-gray-800 rounded" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-3">
                                                    <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                                                        {layout.name}
                                                    </p>
                                                    <p className="text-[9px] leading-normal text-gray-500 mt-1 line-clamp-2">
                                                        {layout.description}
                                                    </p>
                                                </div>

                                                {/* Check indicator */}
                                                {isSelected && (
                                                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-sm">
                                                        <Check className="w-3 h-3" />
                                                    </div>
                                                )}
                                                {isLocked && (
                                                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center gap-1 text-[9px] font-bold text-amber-600 dark:text-amber-400 shadow-sm animate-scale-up-fade">
                                                        <Lock className="w-2.5 h-2.5" />
                                                        <span>Founder Exclusive</span>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Theme Section */}
                    <div className="relative overflow-hidden bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200 dark:border-gray-800/50 rounded-2xl p-6 lg:p-8 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Palette className="w-5 h-5 text-primary-500" />
                            Theme Selection
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {THEMES.map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => setProfile({ ...profile, theme: theme.id })}
                                    className={`
                                        relative group p-2 rounded-2xl border-2 transition-all overflow-hidden
                                        ${profile.theme === theme.id
                                            ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10 shadow-sm'
                                            : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                        }
                                    `}
                                >
                                    <div className={`w-full h-24 rounded-xl mb-3 shadow-inner border border-black/5 dark:border-white/5 ${theme.preview}`}></div>
                                    <p className={`text-sm font-semibold transition-colors ${profile.theme === theme.id ? 'text-primary-700 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200'}`}>{theme.name}</p>

                                    {/* Selected Indicator */}
                                    <div className={`absolute top-4 right-4 w-6 h-6 rounded-full bg-white dark:bg-gray-900 shadow-md flex items-center justify-center transition-all ${profile.theme === theme.id ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                                        <div className="w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center">
                                            <Check className="w-2.5 h-2.5 text-white" />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Custom Theme Editor */}
                        {profile.theme === 'custom' && (
                            <div className="mt-8 p-6 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-gray-50/80 dark:bg-gray-900/50 inset-shadow space-y-5 animate-fade-in-up">
                                <div>
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white">Custom Colors</h3>
                                    <p className="text-sm text-gray-500 mt-1">Pick your perfect palette. Your profile will automatically adapt to maintain perfect contrast and glass effects.</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Background</label>
                                        <div className="relative group">
                                            <input
                                                type="color"
                                                className="w-16 h-16 rounded-full cursor-pointer overflow-hidden p-0 border-0 bg-transparent block"
                                                value={profile.customThemeBg.startsWith('#') ? profile.customThemeBg.substring(0, 7) : '#05010d'}
                                                onChange={(e) => setProfile({ ...profile, customThemeBg: e.target.value })}
                                            />
                                            <div className="absolute inset-0 rounded-full ring-2 ring-black/5 dark:ring-white/10 pointer-events-none group-hover:ring-primary-500 transition-colors"></div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Card Fill</label>
                                        <div className="relative group">
                                            <input
                                                type="color"
                                                className="w-16 h-16 rounded-full cursor-pointer overflow-hidden p-0 border-0 bg-transparent block"
                                                value={profile.customThemeCard.startsWith('#') ? profile.customThemeCard.substring(0, 7) : '#201633'}
                                                onChange={(e) => {
                                                    const hex = e.target.value;
                                                    const r = parseInt(hex.slice(1, 3), 16);
                                                    const g = parseInt(hex.slice(3, 5), 16);
                                                    const b = parseInt(hex.slice(5, 7), 16);
                                                    setProfile({ ...profile, customThemeCard: `rgba(${r}, ${g}, ${b}, 0.7)` });
                                                }}
                                            />
                                            <div className="absolute inset-0 rounded-full ring-2 ring-black/5 dark:ring-white/10 pointer-events-none group-hover:ring-primary-500 transition-colors"></div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Text & Accents</label>
                                        <div className="relative group">
                                            <input
                                                type="color"
                                                className="w-16 h-16 rounded-full cursor-pointer overflow-hidden p-0 border-0 bg-transparent block"
                                                value={profile.customThemeText.startsWith('#') ? profile.customThemeText.substring(0, 7) : '#ffffff'}
                                                onChange={(e) => setProfile({ ...profile, customThemeText: e.target.value })}
                                            />
                                            <div className="absolute inset-0 rounded-full ring-2 ring-black/5 dark:ring-white/10 pointer-events-none group-hover:ring-primary-500 transition-colors"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center justify-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-sm shadow-primary-500/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none w-full sm:w-auto"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving Magic...
                                </>
                            ) : (
                                'Publish Changes'
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Column - Preview */}
                <div className="hidden lg:block lg:col-span-6">
                    <div className="sticky top-6">
                        <div className="flex items-center justify-between mb-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl border border-gray-200 dark:border-gray-800/50 rounded-2xl p-2 shadow-sm">
                            <div className="flex items-center gap-2 pl-4">
                                <div className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </div>
                                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">Live Preview</span>
                            </div>
                            <div className="flex relative bg-gray-100/80 dark:bg-gray-800/80 p-1 rounded-xl">
                                {/* Sliding Pill Background */}
                                <div
                                    className="absolute inset-y-1 left-1 bg-white dark:bg-gray-700 rounded-lg shadow-sm transition-transform duration-300 ease-out"
                                    style={{
                                        width: 'calc(50% - 4px)',
                                        transform: previewDevice === 'mobile' ? 'translateX(0)' : 'translateX(100%)'
                                    }}
                                />
                                <button
                                    onClick={() => setPreviewDevice('mobile')}
                                    className={`relative z-10 flex items-center justify-center w-12 py-1.5 rounded-lg transition-colors duration-300 ${previewDevice === 'mobile'
                                        ? 'text-primary-600 dark:text-primary-400'
                                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                                        }`}
                                >
                                    <Smartphone className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setPreviewDevice('desktop')}
                                    className={`relative z-10 flex items-center justify-center w-12 py-1.5 rounded-lg transition-colors duration-300 ${previewDevice === 'desktop'
                                        ? 'text-primary-600 dark:text-primary-400'
                                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                                        }`}
                                >
                                    <Laptop className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <ProfilePreview
                            device={previewDevice}
                            data={profile}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
