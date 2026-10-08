export const SECTION_KEYS = ['hero', 'live_preview', 'features', 'final_cta'] as const;
export type SectionKey = typeof SECTION_KEYS[number];
export type SectionContent = { key: SectionKey; enabled: boolean; title: string; subtitle: string; body: string; primaryLabel: string; primaryUrl: string; secondaryLabel: string; secondaryUrl: string; sortOrder: number; featuredUsername?: string | null };
export const DEFAULT_SECTIONS: SectionContent[] = [
  { key: 'hero', enabled: true, title: 'One Link For', subtitle: 'Everything You Create', body: 'Create your personalized link hub in seconds. Share your content, track your impact, and grow your audience — completely free.', primaryLabel: 'Create Your BioLync Pro mini', primaryUrl: '/sign-up', secondaryLabel: 'See Features', secondaryUrl: '#features', sortOrder: 10 },
  { key: 'live_preview', enabled: true, title: 'See It In Action', subtitle: 'Watch how easily you can build and customize your page in real-time.', body: '', primaryLabel: '', primaryUrl: '', secondaryLabel: '', secondaryUrl: '', sortOrder: 20 },
  { key: 'features', enabled: true, title: 'Everything You Need', subtitle: 'Build your perfect link hub with powerful features designed for creators', body: '', primaryLabel: '', primaryUrl: '', secondaryLabel: '', secondaryUrl: '', sortOrder: 30 },
  { key: 'final_cta', enabled: true, title: 'Ready to Share', subtitle: 'Your World?', body: 'Create your personalized BioLync Pro mini in under 60 seconds. No credit card required.', primaryLabel: 'Get Started Free', primaryUrl: '/sign-up', secondaryLabel: '', secondaryUrl: '', sortOrder: 40 },
];
export function mergeSections(rows: (Omit<Partial<SectionContent>, 'key'> & { key: string })[]): SectionContent[] {
  return DEFAULT_SECTIONS.map(def => {
    const stored = rows.find(r => r.key === def.key);
    if (!stored) return def;
    const { key: _databaseKey, ...overrides } = stored;
    return { ...def, ...overrides };
  });
}
export function safeDestination(url: string): boolean {
  return (url.startsWith('/') && !url.startsWith('//') || /^#[a-zA-Z][a-zA-Z0-9_-]*$/.test(url)) && !url.includes('\\') && !/[\r\n]/.test(url);
}
