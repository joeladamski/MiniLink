# BioLync Pro mini — Build 003 Admin Foundation

## Scope
- Owner-only `/admin` overview with real aggregate counts (creators, links, page views, link clicks) and newest creator accounts.
- Owner-only `/admin/creators` read-only directory with server-side search over name, username and email, deterministic pagination (20 per page), and public profile links.
- Owner-only `/admin/settings` retains independent, persistent MINI ANON AI and creator acquisition Show/Hide switches from Build 002.
- Shared admin sidebar with Overview, Creators, Settings, and return to creator dashboard.

## Access and governance
- All `/admin/*` pages are protected at the shared server layout by authenticated Clerk identity matched against server-only `PLATFORM_OWNER_CLERK_USER_ID`.
- Existing settings API separately checks authorization on every GET and PUT.
- Directory is read-only by design: no delete, suspend, or role-write controls in this release.
- The directory includes creator emails and MUST remain owner-only.

## Release checks
1. Confirm owner opens `/admin`, `/admin/creators`, `/admin/settings`.
2. Verify overview totals match database counts and are not invented placeholders.
3. Search by partial name, username and email; test pagination, empty state, and malformed page query.
4. Confirm settings switches persist, remain functional, and public creator profiles reflect them after refresh.
5. Confirm non-owner and signed-out users cannot access any admin page, including direct deep links.
6. Confirm normal creator dashboard, profile, links and analytics remain functional.
7. Review Hostinger runtime logs after deployment; do not merge automatically.

## Deferred work
- Role-based administration, audit logs, suspensions, and media governance.
- Signed media uploads, dependency remediation, and production migrations.
- No new Prisma schema migration is required for Build 003.
