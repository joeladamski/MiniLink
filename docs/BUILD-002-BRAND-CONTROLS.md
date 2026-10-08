# BioLync Pro mini — Build 002 Brand & Promotion Controls

Owner-only admin page: `/admin`.

## Hostinger configuration

- `PLATFORM_OWNER_CLERK_USER_ID`: the existing Clerk user ID; server-only.
- `NEXT_PUBLIC_PLATFORM_NAME=BioLync Pro mini`: public brand name. Redeploy after changing a NEXT_PUBLIC variable.

## Controls

Two independent, site-wide Show/Hide settings: MINI ANON AI promotional floating widget and creator acquisition button. They are persisted in `PlatformSettings` and default to visible when no row exists. The API checks Clerk authentication and owner ID on every read/write. Settings apply to public creator pages on subsequent requests.

## Deployment

This branch adds one Prisma model. The current development build performs `prisma db push`; check its logs after deployment. Before production, adopt version-controlled migrations instead of schema push during build. No auto-deploy or merge was executed.

## Acceptance tests

1. Owner can open `/admin`, flip each switch independently, refresh and see persistence.
2. Non-owner gets redirected away from `/admin`; direct calls to `/api/admin/platform-settings` return 403.
3. Refresh public profile after switching off each control; hidden widgets disappear, links/avatar remain.
4. Turn each control back on and verify return.
5. Verify site-wide branding. Some legacy MiniLink strings in landing and ancillary screens may remain for follow-up cleanup.

## Limitations

The floating widget currently uses promotional copy; no LLM connection is established by these changes. Authentication for media uploads and dependency audit are still pending.
