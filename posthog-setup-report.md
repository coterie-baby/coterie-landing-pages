# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Coterie landing pages project. This integration leverages Next.js 15.4.8's `instrumentation-client.ts` for optimal client-side initialization and includes comprehensive event tracking across your sizing quiz, AI assistant features, and conversion touchpoints.

## Integration Summary

### Core Setup
- **PostHog SDK**: `posthog-js` v1.310.1 installed via npm
- **Initialization**: Using `instrumentation-client.ts` (Next.js 15.3+ approach)
- **Environment Variables**: Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env`
- **Error Tracking**: Enabled via `capture_exceptions: true`
- **Automatic Pageviews**: Enabled via `defaults: '2025-05-24'`

### User Identification
- Users are identified by email when they save their quiz results
- Person properties include: email, baby_name, quiz_completed status, and recommended_size

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `quiz_started` | User clicks 'Get started' button to begin the sizing quiz | `app/(quiz)/sizing-quiz/page.tsx` |
| `quiz_question_answered` | User selects an answer for a quiz question | `lib/quiz/context.tsx` |
| `quiz_completed` | User completes the sizing quiz and receives a recommendation | `app/(quiz)/sizing-quiz/results/page.tsx` |
| `add_to_cart_clicked` | User clicks 'Add to cart' button on quiz results | `app/(quiz)/sizing-quiz/results/page.tsx` |
| `add_to_babylist_clicked` | User clicks 'Add to Babylist' button | `app/(quiz)/sizing-quiz/results/page.tsx` |
| `email_saved` | User submits email to save their recommendation | `app/(quiz)/sizing-quiz/results/page.tsx` |
| `order_type_selected` | User selects subscription or one-time purchase | `components/order-type-selector.tsx` |
| `ai_assistant_opened` | User opens the floating AI chat assistant | `components/floating-ai-button.tsx` |
| `ai_chat_message_sent` | User sends a message to the AI assistant | `components/ai-chat-assistant.tsx` |
| `ai_product_finder_completed` | User completes the AI product finder flow | `components/ai-product-finder.tsx` |
| `cta_clicked` | User clicks any CTA banner button | `components/cta-banner.tsx` |
| `floating_cta_clicked` | User clicks the floating 'Try Coterie' CTA | `components/floating-cta.tsx` |
| `review_vote_submitted` | User votes on a review as helpful or not | `components/reviews/index.tsx` |
| `size_selected` | User selects a diaper size on the PDP | `components/purchase/piano-key.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

### Dashboard
- **Analytics basics**: [https://us.posthog.com/project/272031/dashboard/940542](https://us.posthog.com/project/272031/dashboard/940542)

### Insights
1. **Quiz Conversion Funnel**: [https://us.posthog.com/project/272031/insights/lb8EJ0H8](https://us.posthog.com/project/272031/insights/lb8EJ0H8)
   - Tracks: Quiz Started → Quiz Completed → Add to Cart

2. **AI Engagement Overview**: [https://us.posthog.com/project/272031/insights/AcgcA8ge](https://us.posthog.com/project/272031/insights/AcgcA8ge)
   - Tracks user engagement with AI assistant and product finder

3. **CTA Click Performance**: [https://us.posthog.com/project/272031/insights/fEv8VKzS](https://us.posthog.com/project/272031/insights/fEv8VKzS)
   - Tracks clicks on CTA banner and floating CTA buttons

4. **Order Type Preferences**: [https://us.posthog.com/project/272031/insights/ft6v8AKU](https://us.posthog.com/project/272031/insights/ft6v8AKU)
   - Breakdown of subscription vs one-time purchase selections

5. **Lead Capture Funnel**: [https://us.posthog.com/project/272031/insights/rj71mEem](https://us.posthog.com/project/272031/insights/rj71mEem)
   - Tracks: Quiz Completed → Email Saved → Add to Babylist

## Files Modified

- `instrumentation-client.ts` - PostHog initialization
- `.env` - Environment variables
- `app/(quiz)/sizing-quiz/page.tsx` - Quiz start tracking
- `lib/quiz/context.tsx` - Quiz question tracking
- `app/(quiz)/sizing-quiz/results/page.tsx` - Quiz completion and conversion tracking
- `components/order-type-selector.tsx` - Order type selection tracking
- `components/floating-ai-button.tsx` - AI assistant open tracking
- `components/ai-chat-assistant.tsx` - AI chat message tracking
- `components/ai-product-finder.tsx` - Product finder completion tracking
- `components/cta-banner.tsx` - CTA click tracking
- `components/floating-cta.tsx` - Floating CTA tracking
- `components/reviews/index.tsx` - Review vote tracking
- `components/purchase/piano-key.tsx` - Size selection tracking
