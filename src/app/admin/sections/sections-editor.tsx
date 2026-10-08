'use client';
import { useEffect, useState } from 'react';
import type { SectionContent } from '@/lib/homepage-sections';
const labels: Record<string,string> = { hero:'Hero',live_preview:'Live Preview',features:'Features',final_cta:'Final Call to Action' };
export function HomepageSectionsEditor() {
  const [sections,setSections]=useState<SectionContent[]>([]);
  const [creators,setCreators]=useState<{username:string;name:string|null}[]>([]);
  const [pending,setPending]=useState<string|null>(null);
  const [notice,setNotice]=useState('');
  const [error,setError]=useState('');
  useEffect(()=>{fetch('/api/admin/homepage-sections',{cache:'no-store'}).then(async r=>{if(!r.ok)throw Error('Unable to load sections');return r.json();}).then(d=>setSections(d.sections)).catch(e=>setError(e.message));},[]);
  useEffect(()=>{fetch('/api/admin/featured-creators',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(d=>{if(d?.users)setCreators(d.users.filter((u:{username:string|null})=>Boolean(u.username)));}).catch(()=>{});},[]);
  function edit(key:string,field:keyof SectionContent,value:string|boolean|number|null){setSections(a=>a.map(s=>s.key===key?{...s,[field]:value}:s));setNotice('');}
  async function save(s:SectionContent) {
    setPending(s.key);setError('');setNotice('');
    try {const r=await fetch('/api/admin/homepage-sections',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({section:s})});const data=await r.json();if(!r.ok)throw Error(data.error||'Save failed');setNotice((labels[s.key]||s.key)+' saved. Refresh the homepage to preview.');}
    catch(e){setError(e instanceof Error?e.message:'Save failed');}finally{setPending(null);}
  }
  if(!sections.length&&!error)return <p>Loading sections…</p>;
  return <div className="space-y-5">
    {error&&<p role="alert" className="text-red-300">{error}</p>}{notice&&<p role="status" className="text-green-300">{notice}</p>}
    {[...sections].sort((a,b)=>a.sortOrder-b.sortOrder).map(s=><section key={s.key} className="rounded-xl border border-gray-800 bg-gray-900 p-5 sm:p-6 space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between"><h2 className="text-xl font-semibold">{labels[s.key]||s.key}</h2><label className="flex gap-2 items-center"><input type="checkbox" checked={s.enabled} onChange={e=>edit(s.key,'enabled',e.target.checked)} className="accent-fuchsia-500"/> Enabled</label></div>
      {s.key==='live_preview' && <label className="block text-sm text-gray-300">Featured creator<select value={s.featuredUsername || ''} onChange={e=>edit(s.key,'featuredUsername',e.target.value||null)} className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-950 p-3 text-white"><option value="">Default preview (no creator selected)</option>{creators.map(u=><option key={u.username} value={u.username}>{u.name || u.username} (@{u.username})</option>)}</select><span className="block mt-1 text-xs text-gray-400">Only creators with a public username can appear in Live Preview.</span></label>}
      {(['title','subtitle','body','primaryLabel','primaryUrl','secondaryLabel','secondaryUrl'] as const).map(field=><label key={field} className="block text-sm text-gray-300"><span className="block mb-1">{({title:'Title',subtitle:'Subtitle',body:'Body',primaryLabel:'Primary button label',primaryUrl:'Primary button URL',secondaryLabel:'Secondary button label',secondaryUrl:'Secondary button URL'} as Record<string,string>)[field]}</span>{field==='body'?<textarea value={s[field]} maxLength={1000} onChange={e=>edit(s.key,field,e.target.value)} rows={3} className="w-full rounded-lg border border-gray-700 bg-gray-950 p-3 text-white"/>:<input value={s[field]} maxLength={200} onChange={e=>edit(s.key,field,e.target.value)} className="w-full rounded-lg border border-gray-700 bg-gray-950 p-3 text-white"/>}</label>)}
      
      <button disabled={pending!==null} onClick={()=>save(s)} className="rounded-lg bg-fuchsia-600 px-5 py-3 font-semibold text-white hover:bg-fuchsia-500 disabled:opacity-50">{pending===s.key?'Saving…':'Save section'}</button>
      {s.key==='live_preview'&&<p className="text-xs text-gray-400">The separate Live Preview master switch in Settings must also be enabled for this section to appear.</p>}
    </section>)}
  </div>;
}
