import AdminControls from '../settings-controls';

export const dynamic = 'force-dynamic';

export default function AdminSettingsPage() {
  return (
    <div className="max-w-3xl space-y-5">
      <header>
        <h1 className="text-3xl font-bold">Platform Settings</h1>
        <p className="mt-2 text-gray-400">Control public-profile promotions across the platform.</p>
      </header>
      <AdminControls />
    </div>
  );
}
