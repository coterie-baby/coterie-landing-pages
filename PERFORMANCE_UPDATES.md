claude mcp add --scope user --header "CONTEXT7_API_KEY: ctx7sk-e6e0b2bb-ce5c-4682-87df-1e514d06348b" --transport http context7 https://mcp.context7.com/mcp

1.  Unoptimized static images in /public (LCP, bandwidth)

Three files account for 6.5 MB of unoptimized assets served as-is:  
 ┌───────────────────────────────┬────────┐
│ File │ Size │  
 ├───────────────────────────────┼────────┤  
 │ /public/images/diaper_s1.png │ 2.8 MB │  
 ├───────────────────────────────┼────────┤  
 │ /public/images/baby-sleep.jpg │ 2.5 MB │  
 ├───────────────────────────────┼────────┤  
 │ /public/bg-placeholder.png │ 1.2 MB │  
 └───────────────────────────────┴────────┘  
 These should be compressed, converted to WebP, and served through
next/image or the Sanity CDN instead of raw from /public. The diaper hero
image alone is likely your LCP element — at 2.8 MB it will dominate load
time on any connection.

---

2. ~20 components unnecessarily marked 'use client' (JS bundle)

Out of 71 'use client' files, roughly 20 are purely presentational with
no hooks or event handlers. These ship unnecessary JavaScript and prevent
server rendering. Key offenders:

- components/usp2.tsx
- components/press-testimonials.tsx
- components/diaper-issue-breakdown.tsx
- components/three-column-table.tsx
- components/content-banner.tsx
- components/title-banner.tsx
- components/diptych-media-title.tsx
- components/safety-standards.tsx
- components/diaper-myth-reality.tsx
- components/diaper-problem-solver.tsx
- components/listicle-content.tsx
- components/testimonial-grid.tsx
- components/press-statements.tsx
- components/stepped-stats.tsx
- components/cart/cart-summary.tsx
- components/cart/cart-header.tsx
- components/cart/cart-shipping-bar.tsx
- components/ui/button.tsx

Audit each — if it only receives props and renders JSX, remove 'use
client' to let Next.js server-render it and exclude it from the JS
bundle.

---

3. CSS background-image for hero on /landing (LCP)

app/(main)/landing/page.tsx:41 loads a 4500x6000 Sanity image as a CSS
background-image. This bypasses Next.js image optimization entirely — no
responsive sizing, no WebP, no priority preload, no LCP hint. Replace
with <Image priority fill sizes="100vw" />.

---

4. Amplitude session replay at 100% sample rate (main thread)
   (Done)

Your Amplitude config has sessionReplay: { sampleRate: 1 } — recording
every session. Session replay instruments the DOM and captures mutations
on the main thread, directly impacting INP/FID. Drop to 0.1 (10%) or
lower for production.

---

5. Duplicate Sanity fetch in dynamic pages (TTFB)

app/(main)/[...slug]/page.tsx calls getPage() twice per request — once in
generateMetadata() and once in the page component. These are sequential,
doubling the Sanity round-trip. Fetch once and derive metadata from the
page object, or use React's cache() to deduplicate:

import { cache } from 'react';
const getPageCached = cache((slug: string) => getPage(slug));

---

6. styled-components installed but unused (bundle)

styled-components (~16-20 KB gzipped) is in package.json but has zero
imports in the codebase. Removing it eliminates dead weight from the
install and any transitive bundle inclusion.

---

7. Missing sizes attribute on next/image with fill (bandwidth)

Several fill images lack a sizes prop, causing the browser to download
the largest srcset candidate:

- components/usp2.tsx:121 — product cards
- app/(quiz)/sizing-quiz/page.tsx:14 — quiz hero
- app/(quiz)/sizing-quiz/results/page.tsx:230 — 96x96 recommendation
  image (should be sizes="96px")

---

8. Raw <img> tags missing optimization (bandwidth, CLS)

These components use <img> instead of next/image, missing lazy loading,
format negotiation, and responsive sizing:

- components/cart/cart-item.tsx:23 — product thumbnail in cart
- components/cart/cart-upsell-card.tsx:21 — upsell image
- components/testimonial-grid.tsx:128 — author avatars
- app/(quiz)/sizing-quiz/diaper-brand/page.tsx:55 — brand logos

---

9. Large client boundary at the layout level (hydration cost)

app/(main)/layout.tsx wraps all children in ShopifyProviderWrapper +
CartProvider — both are client components. This forces the entire page
subtree to hydrate on the client. Consider pushing these providers down
to only the components that need them (cart drawer, add-to-cart
sections), or splitting them so the cart context doesn't include UI state
like isOpen.

---

10. Cart and Quiz contexts cause broad re-renders (React)

Cart context: isOpen (UI state) lives alongside items (data state).
Opening/closing the drawer re-renders every useCart() consumer. Split
into CartDataContext and CartUIContext.

Quiz context: One provider holds 17 properties — answers, navigation,
computed values. A component that only needs currentStep re-renders when
any answer changes. Split into QuizNavigationContext and
QuizAnswersContext.

---

11. No dynamic imports for below-fold components (bundle)

The UGC page correctly uses next/dynamic for lazy loading. No other pages
do. Heavy below-fold components like reviews, social posts, award
slideshows, comparison tables, and AI chat should be dynamically imported
with loading skeletons — especially on the main PDP.

---

12. Four analytics scripts loaded simultaneously (main thread)

The root layout loads GTM, Amplitude, Vercel Analytics, Umami, and Vercel
Speed Insights. Consider whether all are needed in production, and defer
non-critical ones. Amplitude in particular (with session replay) is the
heaviest.

---

13. Missing dynamicParams: false on catch-all route (TTFB)

app/(main)/[...slug]/page.tsx uses generateStaticParams() but doesn't set
dynamicParams = false. Unknown slugs trigger on-demand SSR instead of
returning 404 immediately.

---

14. Monospace font in OTF format (bandwidth)

SuisseIntlMono-Regular.otf (59 KB) is the only non-WOFF2 font. Converting
to WOFF2 would cut it to ~20-25 KB.

---

15. Minor React patterns (rendering efficiency)

- Missing React.memo on CartItem, ReviewCard, and ProductCard — all
  rendered in lists and receive stable callbacks
- key={index} in comparison-table.tsx, three-column-table.tsx,
  stepped-stats.tsx — should use stable IDs
- Unmemoized computed values: getPageNumbers() in reviews, processedRows
  in comparison table, extendedPosts in social posts — all recreated every
  render
- Layout thrashing in usp2.tsx: getBoundingClientRect() on scroll should
  use IntersectionObserver instead
