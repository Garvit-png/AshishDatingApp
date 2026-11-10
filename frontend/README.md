# Ashish Chhipa — Website

Next.js site + a no-code **Website Studio** at `/admin`.

## How content works (one file)

Everything editable on the site lives in **`src/data/site.json`**:
text, images, products, sessions, testimonials, popups, menu, footer and settings.

- `src/content/types.ts` — the shape of that file
- `src/content/defaults.ts` — original content (used for "Reset" buttons and as a fallback for missing fields)
- `src/content/normalize.ts` — fills in anything missing so old data never breaks the site

## Website Studio (`/admin`)

1. Log in with the passcode.
2. Edit any section — the live preview (computer/phone) updates instantly.
3. Press **Publish**. The dashboard commits `site.json` to GitHub, Vercel redeploys,
   and the live site updates in ~1–2 minutes.

Unpublished edits are kept in the browser, with undo/redo (Ctrl/⌘+Z) and a
"Discard" button. Uploaded images are resized automatically and stored in
`public/uploads/`.

## Environment variables

| Name | Purpose |
| --- | --- |
| `ADMIN_PASSCODE` | Passcode for `/admin` |
| `OTP_SECRET` | Secret used to sign admin sessions (any long random string) |
| `GITHUB_TOKEN` | Token with write access to this repo's contents |
| `GITHUB_OWNER` / `GITHUB_REPO` | Repo to save to |
| `GITHUB_BRANCH` | Branch Vercel deploys from (default `main`) |

## Develop

```bash
npm install
npm run dev
```
