# Build 004D — Unified featured creator landing hero

## Requested layout
- Remove the `See It In Action` heading and description block.
- Remove the static laptop creation-flow showcase from the landing page.
- Present an enlarged live featured-creator phone on the **left**, and the existing CMS-managed Hero title, subtitle, description and CTA buttons on the **right**.
- Place **Everything You Need** immediately after the combined hero.
- Maintain the existing selected creator in Admin > Homepage Sections > Live Preview, the Hero fields in Admin > Homepage Sections > Hero, and the independent visibility switches.
- Stack preview and copy vertically on narrow screens; preserve safe spacing on desktop.
- The phone displays the real public creator page in a same-origin iframe. A brand-safe placeholder is shown if no creator is configured, rather than the original developer's demo profile.

## Settings semantics
- Hero enabled: controls promotional heading and buttons within combined section.
- Live Preview section enabled AND its Platform Settings master switch enabled: controls the featured phone independently.
- Both disabled: combined section hidden; next visible section rises to the top.
- This change does not modify database tables or the public profile page.

## Verification before merge/deploy
1. Run `npm run build` (with a valid database environment) and validate JSX and TypeScript.
2. Confirm featured user is selectable and appears in the large left phone.
3. Verify editing Hero title/description/buttons in Admin updates right-hand copy.
4. Verify responsive layout at 375px, 768px, 1280px and 1600px.
5. Verify Live Preview/hero switches, sign-in CTA and See Features anchor.
6. Check background, default light/dark modes and iframe scrolling.
7. Confirm no previous author's demonstration portrait, marketing text or URLs remain inside the homepage showcase.

Note: visual mockup uses ornamental orbiting icons. This first implementation provides subtle decorative highlights, not an external illustrated asset. No build/test has been executed by this GitHub-only change.
