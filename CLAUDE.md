# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Production build (runs type-check + static generation)
npm run start        # Serve production build
npm run lint         # ESLint via next lint
npm run type-check   # tsc --noEmit (no test suite — verify types here)
```

There are no automated tests. Use `npm run type-check` after edits and `npm run build` before any deploy to catch issues. The build generates 26 static/SSG pages.

## Architecture

**Next.js 14 App Router** — all pages under `src/app/`, all components under `src/components/`. No `pages/` directory.

### State Management (Zustand, all in `src/lib/store/`)

Five persisted stores:
- `cartStore` — items, coupons (`VITA10`/`SAVE15`/`WELCOME20`), points, shipping logic. Free shipping threshold: €50, cost: €4.99. Subscribe & Save applies a 15% price reduction at the store level (not via coupon). Stored as `vitashop-cart` in localStorage.
- `wishlistStore` — product IDs only, persisted as `vitashop-wishlist`.
- `compareStore` — up to 3 products, session storage (`vitashop-compare`).
- `toastStore` — not persisted; max 5 stacked toasts, auto-dismiss (default 3s, errors 5s).
- `pointsStore` — balance + transaction history, persisted as `vitashop-points`. 250 points welcome bonus seeded on first load. 100 points = €1 discount.

**Never call store computed methods (e.g. `getSubtotal()`, `getTotal()`) directly in render** — use the `useCart` hook in `src/lib/hooks/useCart.ts` instead, which also wires toast feedback and points on checkout.

### Data Layer

All product data is static mock data in `src/lib/data/products.ts` — 12 products across 6 categories (`vitaminas`, `proteina`, `omega3`, `pre-treino`, `sono`, `colageno`). No API calls; the site is fully static. Product images use `https://picsum.photos/seed/{slug}/400/400`.

The `Product` type in `src/lib/types/index.ts` is the single source of truth for shape. All 30+ types live in that one file.

### Routing

| Route | Notes |
|---|---|
| `/` | Static homepage with 6 section components |
| `/products` | Client component; filters via URL params (`?category=`, `?q=`) with `useSearchParams` wrapped in `<Suspense>` |
| `/products/[slug]` | SSG; slugs come from `products.ts` |
| `/cart` | Client; reads cartStore |
| `/checkout` | Multi-step (shipping → payment → confirmation); Zod schemas per step; no real payment |
| `/quiz` | 5-step questionnaire → 2.5s fake analysis → recommendations |
| `/compare` | Reads compareStore; table diff view |
| `/account`, `/account/orders`, `/account/profile` | UI-only, no real auth |
| `/auth/login`, `/auth/register` | UI-only forms with react-hook-form + Zod |

### UI Conventions

- `cn()` utility (`src/lib/utils/cn.ts`) wraps `clsx` + `tailwind-merge` — always use it for conditional classes.
- All prices in Euro (€). `formatPrice()` in `src/lib/utils/formatPrice.ts` handles formatting and points calculation.
- Dark mode via `next-themes` with `class` strategy — use `dark:` Tailwind variants throughout.
- Framer Motion is used for page transitions, toast animations, and micro-interactions. Keep animations under 300ms for interactions.
- Icons come from `lucide-react` only — do not introduce other icon libraries.
- Primary brand color: `green-600` (`#16a34a`). Use Tailwind's `green-*` scale for brand UI.

### Accessibility

- Every page needs a `<main id="main-content">` (already in `layout.tsx`).
- All interactive custom components need `aria-label`, `role`, and keyboard handler (`onKeyDown` for Enter/Space).
- The skip-to-content link is in `layout.tsx` and styled via `.skip-to-content` in `globals.css`.

### PWA

`public/manifest.json` and `public/sw.js` are static files. The service worker is registered inline in `layout.tsx`. Icons referenced in the manifest (`/icons/icon-*.png`) are placeholders — add real PNG files before deploy.

## Key Constraints

- No backend, database, or auth provider — everything is localStorage/Zustand.
- `next.config.mjs` whitelists only `picsum.photos` for `next/image`. Adding other image hosts requires updating `remotePatterns`.
- `NEXT_PUBLIC_APP_URL` must be set in `.env.local` for correct OpenGraph `metadataBase`.
