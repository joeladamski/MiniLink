# Build 004B — Editable Homepage Sections

## Implemented
- Owner-only Admin → Homepage Sections editor at `/admin/sections`.
- PostgreSQL `HomepageSection` records for Hero, Live Preview, Features, and Final CTA, with stable keyed defaults.
- Each section can be enabled/disabled and have its copy edited; Hero and Final CTA primary button labels and local URLs can also be edited.
- Hero secondary link label and internal anchor/URL can be edited.
- Live Preview respects BOTH its section visibility and the existing platform feature switch in `/admin/settings`.
- Homepage fetches a public read-only projection; writing is owner-only via independently authorized API.
- No additional creator-profile or creator-dashboard changes.

## Limitations in this first CMS slice
- Sections remain in their existing visual order. `sortOrder` is stored but is not yet exposed as an editable control, nor used for reordering the complex static homepage layout.
- Media/mockups and the Trusted By, FAQ, and other internal elements are not editable yet.
- Copy/visibility currently fetch after client mount, so the default section may briefly render before the stored state is fetched. A later server-rendered homepage will remove this flash.
- Section editor retains generic optional button fields for forward compatibility; only relevant existing hero/final CTA buttons are rendered on the homepage.
- Server-side Prisma schema sync is required before opening new sections pages. Back up the DB and verify deployment logs.

## Verification
1. Verify `/admin/sections` allows owner-only editing; nonowners are redirected, and PUT/GET admin API returns 403.
2. Confirm title, description, and hero CTA edits save and persist after refresh.
3. Disable each section individually, refresh public home, and confirm only that section disappears.
4. Confirm toggling `showHomepageLivePreview` off in existing Admin Settings overrides a live-preview section still marked enabled.
5. Confirm section URLs accept local paths and internal anchors, and reject external/script URLs.
6. Confirm creator pages, profiles, links, analytics and Admin Overview still function.
7. After deployment verify Prisma `HomepageSection` table exists and there are no runtime errors.

No CI/build or production verification has been performed in the connector workspace.
