# Developer Guide

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd landing-pages
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file with the required environment variables:

```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=xsrqsuaf
NEXT_PUBLIC_SANITY_DATASET=staging
SANITY_API_READ_TOKEN=<token>

# Vercel
NEXT_PUBLIC_VERCEL_URL=http://localhost:3000

# Amplitude
AMPLITUDE_API_KEY=<key>
```

Contact the team lead for actual environment variable values.

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
landing-pages/
├── app/                    # Next.js App Router pages
│   ├── (main)/            # Pages with header/footer layout
│   ├── (quiz)/            # Quiz pages (minimal layout)
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utilities and business logic
│   ├── gtm/              # Google Tag Manager utilities
│   ├── quiz/             # Quiz state management
│   └── sanity/           # Sanity CMS client
├── types/                 # TypeScript definitions
├── public/               # Static assets
└── docs/                 # Documentation
```

## Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler check |

## Development Workflow

### Creating a New Page

1. Create a new directory under `app/(main)/`:
```bash
mkdir app/\(main\)/new-page
```

2. Create the page component:
```typescript
// app/(main)/new-page/page.tsx
export default function NewPage() {
  return (
    <main>
      <h1>New Page</h1>
    </main>
  );
}
```

3. The page will be available at `/new-page`.

### Creating a New Component

1. Create component file in `/components`:
```typescript
// components/my-component.tsx
interface MyComponentProps {
  title: string;
}

export function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>;
}
```

2. Import and use in pages:
```typescript
import { MyComponent } from '@/components/my-component';
```

### Styling

The project uses Tailwind CSS. Apply styles using utility classes:

```typescript
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <span className="text-lg font-semibold text-gray-900">Title</span>
</div>
```

For custom styles, edit `app/globals.css`.

## Code Conventions

### TypeScript
- Use TypeScript for all new files
- Define interfaces for component props
- Avoid `any` types

### Components
- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks

### File Naming
- Components: `kebab-case.tsx` (e.g., `my-component.tsx`)
- Utilities: `kebab-case.ts` (e.g., `format-date.ts`)
- Types: `kebab-case.ts` in `/types` directory

### Imports
- Use absolute imports with `@/` prefix
- Group imports: React, external libs, internal modules

```typescript
import { useState } from 'react';
import Image from 'next/image';

import { MyComponent } from '@/components/my-component';
import { formatDate } from '@/lib/utils';
```

## Environment Variables

### Public Variables
Prefixed with `NEXT_PUBLIC_` - available in browser:
```
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_VERCEL_URL
```

### Server-Only Variables
Not prefixed - only available on server:
```
SANITY_API_READ_TOKEN
AMPLITUDE_API_KEY
AMPLITUDE_SECRET_KEY
```

## Middleware

The middleware (`middleware.ts`) runs on the edge and handles traffic routing:

- Detects mobile vs desktop via User-Agent
- Checks for UTM parameters
- Redirects desktop traffic with UTM params to main store

To modify routing logic, edit `middleware.ts`.

## Testing Locally

### Testing Mobile Experience
Use browser DevTools to simulate mobile devices:
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select a mobile device

### Testing UTM Parameters
Add UTM params to test routing:
```
http://localhost:3000/?utm_source=test&utm_medium=test
```

### Testing Analytics
1. Open browser DevTools console
2. Check `window.dataLayer` for GTM events
3. Use GTM Preview mode for detailed debugging

## Deployment

### Automatic Deployments
- Pushes to `main` branch trigger production deployments
- Pull requests create preview deployments

### Manual Deployment
```bash
npm run build
```

Deployment is handled by Vercel automatically.

### Environment Variables in Production
Configure production environment variables in the Vercel dashboard.

## Troubleshooting

### Build Errors

**TypeScript errors:**
```bash
npm run type-check
```
Fix any type errors before committing.

**ESLint errors:**
```bash
npm run lint
```

### Development Server Issues

**Port in use:**
```bash
npm run dev -- -p 3001
```

**Clear Next.js cache:**
```bash
rm -rf .next
npm run dev
```

### Dependency Issues

**Clear node_modules:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## Performance Considerations

### Images
- Use Next.js `Image` component for automatic optimization
- Specify width and height to prevent layout shift
- Use appropriate image formats (WebP preferred)

### Code Splitting
- Use dynamic imports for large components:
```typescript
const HeavyComponent = dynamic(() => import('./heavy-component'));
```

### Bundle Size
- Avoid importing entire libraries
- Use tree-shakeable imports:
```typescript
// Good
import { format } from 'date-fns';

// Avoid
import * as dateFns from 'date-fns';
```

## Getting Help

- Check existing documentation in `/docs`
- Review component examples in codebase
- Contact the engineering team for assistance

---

*For architecture overview, see [Technical Architecture](./technical-architecture.md)*
