# Technical Architecture

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x |
| UI Library | React | 19.x |
| Styling | Tailwind CSS | 4.x |
| CMS | Sanity | v3 |
| Hosting | Vercel | Edge |
| Analytics | GTM, GA4, Amplitude | - |

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Traffic Sources                          │
│    (Facebook, Google, TikTok, Email, Influencer Links)         │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Vercel Edge Network                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Middleware                            │   │
│  │  • Mobile detection                                      │   │
│  │  • UTM parameter checking                               │   │
│  │  • Desktop redirect to main store                       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js Application                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Quiz Flow   │  │ Dynamic Pages│  │   Static Pages       │  │
│  │  /sizing-quiz│  │ /[...page]   │  │   /ugc, /influencer  │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   Shared Services                        │   │
│  │  • GTM Data Layer    • Quiz Context                     │   │
│  │  • Sanity Client     • Analytics                        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
┌─────────────────────────────┐   ┌─────────────────────────────┐
│        Sanity CMS           │   │     Analytics Platforms     │
│  • Page content             │   │  • GTM (GTM-N9NL6XQ)       │
│  • Component data           │   │  • Google Analytics 4       │
│  • Media assets             │   │  • Amplitude                │
└─────────────────────────────┘   │  • Vercel Analytics         │
                                  └─────────────────────────────┘
```

## Directory Structure

```
landing-pages/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Main layout group
│   │   ├── layout.tsx            # Header, footer, announcements
│   │   ├── page.tsx              # Homepage
│   │   ├── landing/              # Marketing landing page
│   │   ├── [...page]/            # Dynamic Sanity pages
│   │   ├── ugc/                  # UGC landing page
│   │   ├── influencer/           # Influencer landing page
│   │   └── subscription-perks/   # Subscription benefits
│   │
│   ├── (quiz)/                   # Quiz layout group (no header/footer)
│   │   └── sizing-quiz/
│   │       ├── page.tsx          # Quiz intro
│   │       ├── baby/             # First question
│   │       ├── name/             # Name question
│   │       ├── birthdate/        # Birthdate question
│   │       ├── due-date/         # Due date question
│   │       ├── diaper-brand/     # Brand preference
│   │       ├── diaper-size/      # Size question
│   │       └── results/          # Recommendations
│   │
│   ├── api/                      # API routes
│   │   └── draft-mode/           # Sanity preview
│   │
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   └── actions.ts                # Server actions
│
├── components/                   # React components
│   ├── global/                   # Header, footer
│   ├── quiz/                     # Quiz-specific components
│   ├── ui/                       # Primitive UI components
│   ├── purchase/                 # E-commerce components
│   └── [feature-components]/     # Page section components
│
├── lib/                          # Core utilities
│   ├── gtm/                      # GTM tracking logic
│   │   ├── context.ts            # Data layer builder
│   │   ├── cookies.ts            # Cookie collection
│   │   ├── device.ts             # Device info
│   │   ├── session.ts            # Session management
│   │   └── tracking.tsx          # GTM injection
│   │
│   ├── quiz/                     # Quiz engine
│   │   ├── context.tsx           # Quiz state (React Context)
│   │   └── config.ts             # Question configuration
│   │
│   ├── sanity/                   # Sanity CMS client
│   │   ├── client.ts             # API client
│   │   ├── image.ts              # Image URL builder
│   │   └── queries.ts            # GROQ queries
│   │
│   └── utils.ts                  # General utilities
│
├── types/                        # TypeScript definitions
│   └── sanity.ts                 # Sanity component types
│
├── public/                       # Static assets
│   ├── images/
│   ├── fonts/
│   └── brand-logos/
│
├── docs/                         # Documentation (this folder)
│
├── middleware.ts                 # Edge middleware
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
└── package.json                  # Dependencies
```

## Key Architectural Patterns

### 1. Route Groups
Next.js route groups `(main)` and `(quiz)` provide different layouts:

- **(main)**: Full layout with header, footer, and announcement bar
- **(quiz)**: Minimal layout optimized for the quiz flow (mobile-first)

### 2. Dynamic Page Generation
The catch-all route `app/(main)/[...page]/page.tsx` renders Sanity-managed pages:

```typescript
// Fetches page data from Sanity by slug
const page = await sanityClient.fetch(pageQuery, { slug });

// Renders components dynamically
return page.components.map(component => (
  <ComponentRenderer key={component._key} component={component} />
));
```

### 3. Component Renderer Pattern
`ComponentRenderer.tsx` maps Sanity component types to React components:

```typescript
switch (component._type) {
  case 'titleBanner':
    return <TitleBanner {...component} />;
  case 'comparisonTable':
    return <ComparisonTable {...component} />;
  // ... additional component types
}
```

### 4. Quiz State Management
Quiz state is managed via React Context (`QuizProvider`):

```typescript
// Context provides quiz state across all quiz pages
const { answers, setAnswer, getNextQuestion } = useQuiz();

// Answers persist as user navigates through quiz
setAnswer('babyStatus', 'already-here');
```

### 5. Analytics Data Layer
GTM data is enriched server-side and injected into the page:

```typescript
// Builds comprehensive tracking context
const gtmContext = buildGTMContext({
  cookies: getMarketingCookies(request),
  device: getDeviceInfo(request),
  user: getUserSession(request),
});

// Injected into GTM data layer on page load
<GTMTracking context={gtmContext} />
```

## Middleware Logic

The edge middleware (`middleware.ts`) handles traffic routing:

```typescript
export function middleware(request: NextRequest) {
  const isMobile = MOBILE_REGEX.test(userAgent);
  const hasUtmParams = searchParams.has('utm_source') || ...;

  // Desktop traffic with UTM params → redirect to main store
  if (!isMobile && hasUtmParams) {
    return NextResponse.redirect('https://www.coterie.com/products/the-diaper');
  }

  // All other traffic → serve landing pages
  return NextResponse.next();
}
```

**Routing Logic:**

| Device | UTM Params | Result |
|--------|------------|--------|
| Mobile | Yes | Landing Pages |
| Mobile | No | Landing Pages |
| Desktop | Yes | Redirect to Store |
| Desktop | No | Landing Pages |

## Data Flow

### Quiz Data Flow
```
User Input → Quiz Context → Local State → Results Page → GTM Event
                                              ↓
                                    Size Recommendation Algorithm
                                              ↓
                                    Product Recommendation Display
```

### Page Rendering Flow
```
Request → Middleware → Route Handler → Sanity Fetch → Component Render → HTML Response
                           ↓
                    Cache Check (ISR)
```

### Analytics Data Flow
```
Page Load → GTM Data Layer Injection → GTM Container → GA4/Amplitude
     ↓
User Action → Event Trigger → GTM Data Layer Push → Analytics Platforms
```

## Performance Optimizations

### 1. Dynamic Imports
Components are lazy-loaded to reduce initial bundle size:

```typescript
const TitleBanner = dynamic(() => import('./title-banner'));
```

### 2. Image Optimization
- Next.js Image component with automatic optimization
- Sanity CDN for CMS images
- Responsive image sizing

### 3. Static Generation with ISR
- Pages are statically generated at build time
- Incremental Static Regeneration for content updates
- Draft mode for real-time preview

### 4. Edge Middleware
- Traffic routing happens at the edge (low latency)
- No origin server round-trip for redirects

## Security Considerations

### 1. Environment Variables
Sensitive configuration stored in environment variables:
- Sanity API tokens
- Amplitude API keys
- Database credentials

### 2. Content Security
- Sanity content is sanitized before rendering
- No user-generated content injection points

### 3. Cookie Handling
- Marketing cookies collected for attribution only
- No PII stored in cookies
- Cross-domain tracking via first-party IDs

## Monitoring & Observability

### Vercel Analytics
- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Error tracking

### Amplitude
- Session replay (100% sample rate)
- User behavior analytics
- Funnel analysis

### GTM/GA4
- Page views and events
- Conversion tracking
- Attribution reporting

---

*For development setup, see [Developer Guide](./developer-guide.md)*
