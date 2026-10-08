'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Settings = { showFloatingAssistant: boolean; showAcquisitionButton: boolean };
export default function AdminControls() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  useEffect(() => { fetch('/api/admin/platform-settings', { cache: 'no-store' }).then(async r => { if (!r.ok) throw new Error('Unable to load platform settings'); return r.json(); }).then(setSettings).catch(e => setError(e.message)); }, []);
  async function update(key: keyof Settings, value: boolean) {
    if (!settings || saving) return;
    setSaving(true); setError(''); setNotice('');
    try {
      const response = await fetch('/api/admin/platform-settings', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({[key]:value}) });
      if (!response.ok) throw new Error('Could not save this setting');
      setSettings(await response.json()); setNotice('Saved. Refresh a public creator page to see the change.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Save failed'); }
    finally { setSaving(false); }
  }
  return <main className="min-h-screen bg-gray-950 text-white px-6 py-12"><div className="max-w-3xl mx-auto space-y-7">
    <div><Link href="/dashboard" className="text-purple-300 hover:underline">← Creator dashboard</Link><h1 className="text-3xl font-bold mt-5">BioLync Pro mini · Platform Admin</h1><p className="text-gray-400 mt-2">Owner controls for public creator-profile promotions. Changes apply platform-wide.</p></div>
    {error && <p role="alert" className="text-red-300">{error}</p>}{notice && <p role="status" className="text-green-300">{notice}</p>}
    {!settings ? <p>Loading settings…</p> : <div className="space-y-4">
      {([{key:'showFloatingAssistant',title:'MINI ANON AI floating assistant',desc:'Show or hide the floating promotional assistant on all public creator profiles.'},{key:'showAcquisitionButton',title:'Creator acquisition button',desc:'Show or hide the “Join this creator” button on all public creator profiles.'}] as const).map(item => <section key={item.key} className="rounded-xl border border-gray-800 bg-gray-900 p-6 flex items-center justify-between gap-6"><div><h2 className="font-semibold text-lg">{item.title}</h2><p className="text-gray-400 text-sm mt-1">{item.desc}</p></div><label className="flex items-center gap-3"><span className="text-sm">{settings[item.key] ? 'Show' : 'Hide'}</span><input type="checkbox" aria-label={item.title} checked={settings[item.key]} disabled={saving} onChange={e=>update(item.key,e.target.checked)} className="w-5 h-5 accent-fuchsia-500"/></label></section>)}
    </div>}
  </div></main>;
}
