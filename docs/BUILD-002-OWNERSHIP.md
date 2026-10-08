# Build 002 — Platform Ownership & Identity (Phase 1)

This branch introduces owner identity based on Clerk's immutable user ID rather than a hardcoded username. It does **not** yet create a full platform administrator console or role-management system.

## Required configuration

Add `PLATFORM_OWNER_CLERK_USER_ID` to Hostinger's **server-side** environment variables, using the Clerk **user ID** of your intended platform owner (a value such as `user_...`). Do not use the Clerk application ID, email address, or username. Do **not** prefix the variable with `NEXT_PUBLIC_`.

Optional: `NEXT_PUBLIC_PLATFORM_NAME` changes the site-footer brand and basic page metadata. It does not yet replace every MiniLink reference across the entire application. Existing `NEXT_PUBLIC_APP_URL` is used for metadata URLs.

After setting the variables, redeploy the app to activate them.

## Security notes

- Cover-banner authorization is enforced server-side using the authenticated Clerk user ID.
- The UI receives an `isPlatformOwner` flag from the authenticated profile API; never trust this flag for server authorization.
- Unsigned Cloudinary uploads and dependency vulnerabilities remain outstanding and must be addressed before opening registration broadly.
- The current `prisma db push` build step is for the disposable development database only; migrate to version-controlled migrations before handling production data.

## Acceptance tests (manual)

1. Existing creator can sign in, navigate the dashboard, and view/edit ordinary appearance settings.
2. With owner ID configured, owner can choose and save the cover-banner layout.
3. A different Clerk account cannot save the cover-banner layout via the API (HTTP 403), regardless of username.
4. Public creator profile still renders and the founder badge appears only for the configured owner.
5. Site footer and metadata use the configured platform name; unconverted landing-page copy may still say MiniLink.
6. No unreviewed changes are merged to `master` until the test deployment passes.
