# Traffic Splitting

Weighted traffic splitting lets you A/B test landing pages by distributing visitors across multiple destinations from a single funnel. The split decision happens in Edge Middleware alongside the existing funnel matching logic, so there is zero additional latency.

## How It Works

```
Visitor hits lp.coterie.com/the-diaper?utm_source=facebook
                        │
                        ▼
              ┌─────────────────┐
              │  Edge Middleware │
              │  (cached 60s)   │
              └────────┬────────┘
                       │
            ┌──────────┴──────────┐
            │  Match funnel rule  │
            │  (path + UTM)       │
            └──────────┬──────────┘
                       │
              Has routes?
              ┌────┴────┐
              No        Yes
              │         │
              ▼         ▼
         Rewrite to   ┌─────────────────────┐
         default LP   │ Check _frt_ cookie  │
                      └──────────┬──────────┘
                                 │
                      ┌──────────┴──────────┐
                  Valid cookie?          No cookie /
                      │                 stale cookie
                      ▼                     │
                 Serve same                 ▼
                 variant              ┌───────────────┐
                                      │ Random roll    │
                                      │ against weights│
                                      └───────┬───────┘
                                              │
                                    ┌─────────┴─────────┐
                                    │                   │
                                Page route          URL route
                                    │                   │
                                    ▼                   ▼
                              NextResponse        NextResponse
                              .rewrite()          .redirect()
                                    │             + UTM passthrough
                                    │             + _frt param
                                    ▼
                              Set _frt_ cookie
                              (30-day TTL)
```

### Sticky assignment

On a visitor's first request, `Math.random()` rolls against the cumulative weight distribution and assigns a variant. The result is stored in a cookie named `_frt_{sourcePath}` (e.g. `_frt_the-diaper`) so every subsequent visit serves the same variant for 30 days. If the assigned variant is removed from the funnel, the cookie becomes stale and the visitor is re-bucketed on their next visit (after the 60s Sanity cache expires).

### Route types

Each route has a **destination type**:

| Type | Middleware behavior | Use case |
|------|-------------------|----------|
| **Landing Page** | `NextResponse.rewrite()` — serves the page at the original URL | Testing one LP design against another |
| **External URL** | `NextResponse.redirect()` — 307 redirect to the target URL | Comparing LP performance against the main site or a third-party page |

### UTM passthrough (URL routes only)

When a visitor is redirected to an external URL, the middleware:

1. Copies all UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`) from the original request onto the redirect URL (won't overwrite params already present on the destination)
2. Appends a `_frt` query parameter set to the funnel's `sourcePath`, so the destination site's analytics can identify traffic that came through a funnel split

Example: a visitor hitting `lp.coterie.com/the-diaper?utm_source=facebook&utm_medium=cpc` who gets split to an external URL will be redirected to:

```
https://coterie.com/products/diapers?utm_source=facebook&utm_medium=cpc&_frt=the-diaper
```

## Weight Distribution

Weights are percentages that determine how traffic is divided:

- Each route specifies a weight between 1–99%
- The **default landing page** (set in the Destination section) receives the remainder: `100 − sum(route weights)`
- If route weights total 100% or more, the default page receives 0% traffic (the UI warns about this)

**Example:** Default LP + Route A (20%) + Route B (10%) → Default gets 70%, A gets 20%, B gets 10%.

## Data Model

### Sanity schema

The `routes` array field is added to the `funnel` document type. Each route is an inline object:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Human-readable label (e.g. "Main Site Variant") |
| `destinationType` | `'page'` \| `'url'` | Whether this route targets a local LP or external URL |
| `landingPage` | reference → page | Target page (when destinationType is `page`) |
| `targetUrl` | url | Target URL (when destinationType is `url`) |
| `weight` | number (1–99) | Percentage of traffic this route receives |

### TypeScript types

```typescript
// landing-pages/lib/sanity/types.ts

interface FunnelRoute {
  _key: string;
  name: string;
  destinationType?: 'page' | 'url';
  targetSlug?: string;   // resolved from landingPage reference
  targetUrl?: string;     // set directly for URL routes
  weight: number;
}

interface Funnel {
  sourcePath: string;
  targetSlug: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  routes?: FunnelRoute[];
}
```

### GROQ query

The funnel rules query resolves both page slugs and URL targets:

```groq
*[_type == "funnel" && enabled == true]{
  sourcePath,
  "targetSlug": landingPage->slug.current,
  utmSource, utmMedium, utmCampaign, utmTerm, utmContent,
  routes[]{
    _key, name, weight, destinationType,
    "targetSlug": landingPage->slug.current,
    targetUrl
  }
}
```

## Sanity Studio UI

The funnel editor in Sanity Studio has a **Traffic Splitting** section (between Destination and UTM Targeting) with:

- **Distribution bar** — colored horizontal bar showing the default page (green) and each route (blue, amber, purple, pink) with percentages. Hover for a tooltip breakdown.
- **Weight validation** — red warning card if route weights total 100% or more.
- **Route editor cards** — each route has fields for name, weight, destination type toggle (Landing Page / External URL), and the corresponding page select or URL input. A live preview shows the routing path and traffic percentage.
- **Summary badges** — when routes exist, the funnel summary shows traffic split badges instead of the single-destination arrow.

## Files

| File | What changed |
|------|-------------|
| `landing-pages/lib/sanity/types.ts` | `FunnelRoute` interface, `routes` field on `Funnel` |
| `landing-pages/lib/sanity/queries.ts` | `funnelRulesQuery` includes `routes[]` |
| `landing-pages/middleware.ts` | `findMatchingFunnel()`, `selectRoute()`, cookie logic, UTM passthrough |
| `coterie-landing-pages-sanity/schemaTypes/schemas/funnel.ts` | `routes` array field with `funnelRoute` object type |
| `coterie-landing-pages-sanity/desk/FunnelFormView.tsx` | Traffic Splitting section UI |

## Cookie Details

| Property | Value |
|----------|-------|
| Name | `_frt_{sourcePath}` (non-alphanumeric chars replaced with `_`) |
| Value | Page slug (for page routes) or full URL (for URL routes) |
| Max-Age | 30 days |
| Path | `/` |
| SameSite | `lax` |
| HttpOnly | `true` |
| Secure | `true` |

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| No routes defined | `selectRoute()` returns default slug. Zero behavior change from pre-split funnels. |
| Route weights total ≥ 100% | Default page gets 0% traffic. UI shows warning. Middleware distributes across routes only. |
| Cookie for a removed route | Slug/URL not found in valid targets → visitor re-bucketed on next request. |
| Same sourcePath, different UTMs | Different funnels match based on UTM specificity. Cookie is per-sourcePath, which is correct since different UTM combos match different funnels. |
| Destination URL already has UTM params | Middleware won't overwrite existing params on the destination; only fills in missing ones. |

## Testing

### In Sanity Studio
1. Create or edit a funnel
2. Expand the **Traffic Splitting** section
3. Add one or more routes with weights
4. Verify the distribution bar updates live
5. Save and confirm the funnel list shows `[split]` in the title

### In the browser
1. Visit the funnel's source path with matching UTM params
2. Check response headers for a `Set-Cookie: _frt_*` header on first visit
3. Verify the correct page renders (or redirect fires for URL routes)
4. Revisit the same URL — same variant should be served (no new cookie)
5. For URL routes, verify UTM params and `_frt` param appear on the redirect URL

### Backward compatibility
- Funnels without routes work identically to before
- No additional network calls — cookie read + `Math.random()` are sub-microsecond at the edge
- Sanity payload grows slightly (route data) but is already cached for 60s

---

*For Umami analytics setup, see [Umami Setup](./umami-setup.md). For overall architecture, see [Technical Architecture](./technical-architecture.md).*
