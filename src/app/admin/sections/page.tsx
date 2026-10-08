import { HomepageSectionsEditor } from './sections-editor';
export const dynamic = 'force-dynamic';
export default function Page() {
  return <div className="max-w-5xl space-y-5"><h1 className="text-3xl font-bold">Homepage Sections</h1><p className="text-gray-400">Edit homepage copy, visibility, buttons and display order. Save each section independently.</p><HomepageSectionsEditor /></div>;
}
