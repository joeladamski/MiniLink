# Build 004C — Live Preview featured creator

- Homepage Live Preview is now the first content section, immediately beneath the navigation, before the original Hero. The existing Hero remains unchanged.
- Admin > Homepage Sections > Live Preview provides a dropdown of up to 200 registered creators with public usernames, with a blank/default option.
- Selecting a creator renders their actual public creator profile inside the phone frame using a same-origin iframe; no hardcoded developer profile is shown when a creator is selected.
- Creator selection is stored in the existing HomepageSection row. Existing section/master visibility toggles continue to apply.
- Admin selection list is owner-only and the saved username is checked against the Users table.
- Database schema adds nullable HomepageSection.featuredUsername. Requires Prisma schema sync.
- The pre-existing default static demo remains when no creator is selected. The admin list is limited to 200 recent registered accounts in this first iteration; expanded search is future work.
- Test owner chooser, saved persistence, homepage order, visibility off/on, creator profile rendering on desktop and mobile, iframe scroll, and unauthenticated public access. Test public profile links and third-party embed constraints; only same-origin creator URLs are used.
- Build and CI validation have not been executed here. Merge only after review.
