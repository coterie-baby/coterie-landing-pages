# Analytics & Tracking

## Overview

The landing pages platform implements comprehensive analytics and attribution tracking to measure marketing effectiveness and user behavior. This document covers all tracking integrations and their implementation.

## Tracking Platforms

| Platform | Purpose | Identifier |
|----------|---------|------------|
| Google Tag Manager | Tag management & event routing | `GTM-N9NL6XQ` |
| Google Analytics 4 | Web analytics & reporting | Via GTM |
| Amplitude | Product analytics & session replay | API Key configured |
| Vercel Analytics | Performance monitoring (Core Web Vitals) | Automatic |

## Google Tag Manager (GTM)

### Implementation
GTM is loaded via `@next/third-parties` in the root layout:

```typescript
// app/layout.tsx
import { GoogleTagManager } from '@next/third-parties/google';

<GoogleTagManager gtmId="GTM-N9NL6XQ" />
```

### Data Layer Structure

The GTM data layer is enriched with comprehensive context on every page load:

```javascript
dataLayer.push({
  user_properties: {
    session_id: "uuid",
    user_id: "elevar-synced-id",
    coterie_lp_id: "cross-domain-id"
  },
  device: {
    screen_resolution: "1920x1080",
    viewport_size: "1440x900",
    encoding: "UTF-8",
    language: "en-US",
    colors: "24-bit"
  },
  page: {
    title: "Page Title",
    referrer: "https://facebook.com/...",
    url: "https://lp.coterie.com/landing",
    path: "/landing"
  },
  marketing: {
    cookies: { /* marketing cookies */ },
    click_ids: { /* ad platform click IDs */ },
    consent_v2: { /* consent state */ }
  }
});
```

### Key Files

| File | Purpose |
|------|---------|
| `/lib/gtm/context.ts` | Builds the enriched data layer object |
| `/lib/gtm/cookies.ts` | Collects marketing cookies |
| `/lib/gtm/device.ts` | Captures device information |
| `/lib/gtm/session.ts` | Manages user session and IDs |
| `/lib/gtm/tracking.tsx` | React component that injects data layer |

## Marketing Cookie Collection

The platform collects cookies from various marketing platforms for attribution:

### Collected Cookies

| Cookie | Platform | Purpose |
|--------|----------|---------|
| `_fbp` | Facebook | Browser ID |
| `_fbc` | Facebook | Click ID (from fbclid) |
| `_ga` | Google Analytics | Client ID |
| `_ga_*` | Google Analytics 4 | Measurement ID specific |
| `_uetsid` | Bing/Microsoft | Session ID |
| `_uetvid` | Bing/Microsoft | Visitor ID |
| `_ttp` | TikTok | Pixel ID |
| `_kx` | Klaviyo | User identifier |

### Click ID Tracking

URL parameters from ad platforms are captured and stored:

| Parameter | Platform | Example |
|-----------|----------|---------|
| `gclid` | Google Ads | `?gclid=abc123` |
| `fbclid` | Facebook/Meta | `?fbclid=def456` |
| `ttclid` | TikTok | `?ttclid=ghi789` |
| `msclkid` | Microsoft/Bing | `?msclkid=jkl012` |
| `irclickid` | Impact Radius | `?irclickid=mno345` |
| `market_id` | Custom | `?market_id=pqr678` |

## Cross-Domain Tracking

### Coterie LP ID
A first-party identifier (`coterie_lp_id`) is set to track users across the landing pages and main store:

- Generated on first visit
- Stored in first-party cookie
- Passed to main store on redirect
- Synced with Elevar for unified tracking

### Elevar Integration
User IDs are synced with Elevar for cross-platform identity resolution:

```javascript
// User ID is pulled from Elevar if available
user_id: window._elevar?.user_id || generateNewId()
```

## Amplitude Integration

### Configuration
Amplitude is initialized in `/amplitude.ts`:

```typescript
import { init } from '@amplitude/unified';

init({
  apiKey: 'YOUR_API_KEY',
  autocapture: true,
  sessionReplay: {
    sampleRate: 1.0  // 100% of sessions
  },
  defaultTracking: true
});
```

### Features Enabled
- **Autocapture**: Automatically tracks clicks, form submissions, page views
- **Session Replay**: Records user sessions for analysis (100% sample rate)
- **Default Tracking**: Standard events (page views, sessions, etc.)

## Vercel Analytics

### Speed Insights
Core Web Vitals are automatically tracked:
- **LCP** (Largest Contentful Paint)
- **FID** (First Input Delay)
- **CLS** (Cumulative Layout Shift)
- **TTFB** (Time to First Byte)
- **INP** (Interaction to Next Paint)

### Web Analytics
Page views and basic engagement metrics tracked automatically via Vercel.

## Event Tracking

### Standard Events

| Event | Description | When Fired |
|-------|-------------|------------|
| `page_view` | Page load | Every page navigation |
| `click` | Element click | User clicks (via Amplitude autocapture) |
| `form_submit` | Form submission | Form submissions |

### Custom Events

Custom events can be pushed to the data layer:

```javascript
// Push custom event to GTM
window.dataLayer.push({
  event: 'custom_event_name',
  event_category: 'category',
  event_label: 'label',
  event_value: 123
});
```

## UTM Parameter Handling

UTM parameters are preserved throughout the user journey:

| Parameter | Purpose |
|-----------|---------|
| `utm_source` | Traffic source (facebook, google, etc.) |
| `utm_medium` | Marketing medium (cpc, social, email) |
| `utm_campaign` | Campaign name |
| `utm_term` | Paid search keywords |
| `utm_content` | Ad creative identifier |

### Middleware Behavior
The middleware checks for UTM parameters to determine routing:
- Mobile + UTM → Serve landing pages
- Desktop + UTM → Redirect to main store
- No UTM → Serve landing pages

## Consent Management

The platform respects user consent preferences:

```javascript
marketing: {
  consent_v2: {
    analytics_storage: 'granted' | 'denied',
    ad_storage: 'granted' | 'denied',
    ad_user_data: 'granted' | 'denied',
    ad_personalization: 'granted' | 'denied'
  }
}
```

## Debugging

### GTM Preview Mode
1. Open GTM container in Google Tag Manager
2. Click "Preview" to enter debug mode
3. Navigate to landing pages
4. Debug panel shows all events and data layer state

### Data Layer Inspection
In browser console:
```javascript
// View current data layer
console.log(window.dataLayer);

// Watch for new pushes
dataLayer.push = function(obj) {
  console.log('dataLayer push:', obj);
  Array.prototype.push.call(this, obj);
};
```

### Amplitude Debugging
Amplitude events can be viewed in the Amplitude dashboard under "User Lookup" or "Event Stream".

## Adding New Tracking

### Adding a New Event

1. Define the event in GTM (trigger + tag)
2. Push event to data layer from code:

```typescript
// In your React component
const trackEvent = () => {
  window.dataLayer?.push({
    event: 'new_event_name',
    // ... event properties
  });
};
```

### Adding a New Cookie to Collection

Update `/lib/gtm/cookies.ts`:

```typescript
const MARKETING_COOKIES = [
  // ... existing cookies
  'new_cookie_name',
];
```

## Reporting

### Key Dashboards
- **Google Analytics 4**: Traffic, conversions, attribution
- **Amplitude**: Product analytics, funnels, retention
- **Vercel**: Performance metrics, Core Web Vitals
- **GTM**: Tag firing verification

### Attribution Reports
Attribution data flows through:
1. Landing pages capture click IDs and UTM params
2. Data pushed to GTM data layer
3. GTM routes to GA4 and other platforms
4. Cross-domain tracking links to main store conversions

---

*For technical architecture details, see [Technical Architecture](../technical-architecture.md)*
