# Build 004A — Branding & feature controls

## Implemented
- Prisma `PlatformSettings` gains three booleans defaulting to true: `showProfileJoinBadge`, `showProfileShareButton`, and `showHomepageLivePreview`.
- Admin Settings includes persistent independent Show/Hide switches for all three, plus the existing floating assistant and acquisition CTA.
- Public creator pages use server-side settings to conditionally render the upper-left join/signup badge and upper-right share button.
- The client-rendered homepage fetches a read-only public endpoint for Live Preview visibility. The endpoint returns only the single public boolean, not admin settings or credentials.
- Replaces remaining user-facing MiniLink copy in identified share/join modals, homepage, creator dashboard and creator account settings; repository path remains unchanged.

## Deploy checks
1. Review Prisma schema sync for the three new columns; back up PostgreSQL before deploy. Current dev build uses `prisma db push`. Production should use versioned migrations.
2. As owner, navigate to `/admin/settings`, disable the left corner badge and right corner share button independently. Refresh the public profile and confirm each disappears.
3. Disable homepage Live Preview and refresh `/`. Confirm See It In Action disappears while other sections remain.
4. Re-enable all three and verify persistence; non-owner cannot edit settings.
5. Test signup and sharing dialogs when badges are visible and creator analytics/profile editor unaffected.
6. Inspect all routes for remaining branding/attribution and links before public launch. Source code identifiers and upstream license/attribution are intentionally not rewritten.
7. The new homepage flag is fetched after mount. Until fetched it defaults to visible; suppressing initial flash can be a follow-up server-render optimization.

## Deferred
Security and package auditing, authenticated signed uploads, versioned database migrations, and richer CMS/editor from Build 004B. No live verification or CI claims are made here.
