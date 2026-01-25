# Product Overview

## What is Coterie Landing Pages?

Coterie Landing Pages is a dedicated marketing platform designed to convert paid traffic into customers. It serves as the primary entry point for users arriving from advertising campaigns (Facebook, Google, TikTok, etc.) and guides them through a personalized journey toward product discovery and purchase.

## Business Purpose

### Problem Statement
Parents shopping for premium diapers need guidance on:
1. Which diaper size fits their baby
2. Why Coterie products are worth the investment
3. How to get started with a subscription

### Solution
The landing pages platform addresses these needs through:
- **Personalized Recommendations** - The sizing quiz collects baby information and recommends the right diaper size
- **Educational Content** - Dynamic pages explain product benefits, safety standards, and customer testimonials
- **Seamless Conversion** - Direct paths to add products to cart or baby registry

## Target Audiences

### 1. Prospective Parents (Expecting)
- Users who are pregnant and researching diaper options
- Quiz flow asks for due date and recommends newborn bundles
- Content emphasizes preparation and quality

### 2. Current Parents (Baby Already Born)
- Users with babies who are evaluating switching brands
- Quiz collects current diaper size and brand preferences
- Content emphasizes comparison to other brands

### 3. UGC/Influencer Traffic
- Users arriving from creator content
- Dedicated landing pages (`/ugc`, `/influencer`)
- Social proof and authentic testimonials emphasized

## Core Features

### 1. Interactive Sizing Quiz
The flagship feature that guides users to personalized product recommendations.

**User Journey:**
```
Start → Baby Status → Name (optional) → Birth/Due Date → Brand Preference → Size → Results
```

**Key Capabilities:**
- Branching logic based on baby status (born vs. expecting)
- Personalized loading screen with baby's name
- Size recommendation engine
- Multiple conversion CTAs (Add to Cart, Babylist, Save)

**Success Metrics:**
- Quiz start rate
- Quiz completion rate
- Results page conversion rate

### 2. Dynamic Marketing Pages
CMS-managed pages that can be created and modified without engineering involvement.

**Page Types:**
- Campaign landing pages
- Product education pages
- Comparison pages
- Promotional pages

**Capabilities:**
- Drag-and-drop component arrangement in Sanity
- Real-time preview with draft mode
- A/B testing support via different page variants

### 3. Traffic Routing & Attribution
Intelligent routing that ensures users reach the right experience.

**Middleware Logic:**
- Mobile users with UTM parameters → Landing pages
- Desktop users with UTM parameters → Main store redirect
- Direct traffic → Landing pages

**Attribution Tracking:**
- Click IDs captured (gclid, fbclid, ttclid, msclkid)
- Cross-domain user identification
- Full marketing cookie preservation

## User Flows

### Primary Flow: Quiz to Purchase
```
Ad Click → Landing Page → Start Quiz → Complete Quiz → View Results → Add to Cart → Purchase
```

### Secondary Flow: Content to Purchase
```
Ad Click → Educational Page → Browse Content → CTA Click → Product Page → Purchase
```

### Tertiary Flow: Quiz to Registry
```
Ad Click → Quiz → Results → Add to Babylist → Registry Conversion (later)
```

## Platform Capabilities

| Capability | Description | Owner |
|------------|-------------|-------|
| Page Creation | Create new landing pages via Sanity CMS | Marketing |
| Quiz Configuration | Modify quiz questions and flow | Engineering |
| Analytics Dashboard | View conversion metrics | Analytics |
| A/B Testing | Test page variants | Growth |
| Content Updates | Update copy, images, CTAs | Marketing |

## Integration Points

### Upstream (Traffic Sources)
- Facebook/Instagram Ads
- Google Ads (Search, Display, Shopping)
- TikTok Ads
- Influencer/Creator links
- Email campaigns

### Downstream (Conversion Destinations)
- Coterie.com product pages
- Babylist registry
- Checkout flow

### Analytics Platforms
- Google Analytics 4
- Google Tag Manager
- Amplitude
- Attribution partners

## Success Criteria

### Conversion Metrics
- **Quiz Completion Rate**: % of users who start and finish the quiz
- **Quiz-to-Cart Rate**: % of quiz completers who add to cart
- **Landing Page CVR**: Overall conversion rate from landing page visit to purchase

### Engagement Metrics
- **Time on Page**: Average engagement time
- **Scroll Depth**: How far users scroll on content pages
- **CTA Click Rate**: Interaction with call-to-action buttons

### Technical Metrics
- **Page Load Speed**: Core Web Vitals (LCP, FID, CLS)
- **Mobile Performance**: Mobile-specific performance scores
- **Error Rate**: Client-side and server-side error frequency

## Roadmap Considerations

### Potential Enhancements
- Quiz personalization based on traffic source
- Dynamic product recommendations
- Multi-product quiz (diapers + wipes bundle)
- Returning user recognition
- Enhanced social proof (real-time purchase notifications)

### Technical Debt
- Refer to engineering documentation for current technical debt items

---

*For technical implementation details, see [Technical Architecture](./technical-architecture.md)*
