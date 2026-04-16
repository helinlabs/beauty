# Beauty Platform - Claude Code Guide

## Project Overview
Beauty platform with admin dashboard for managing reservations, referrers, and treatments.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **React**: 19
- **Main Site Styling**: styled-components
- **Admin Styling**: Tailwind CSS v4 + shadcn/ui
- **i18n**: next-intl (admin), custom dictionaries (main)
- **Languages**: Korean (ko), English (en)

## Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── (main)/          # Main site pages (styled-components)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── influencers/
│   │   │   ├── procedures/
│   │   │   └── book/
│   │   └── (admin)/         # Admin pages (Tailwind CSS)
│   │       ├── layout.tsx
│   │       ├── admin-login/
│   │       └── admin/
│   │           ├── dashboard/
│   │           ├── reservations/
│   │           └── referrers/
│   └── layout.tsx
├── components/
│   ├── *.tsx                # Main site components (styled-components)
│   └── admin/               # Admin components (Tailwind CSS)
│       └── ui/              # shadcn UI components
├── styles/
│   ├── GlobalStyles.tsx     # styled-components globals
│   └── admin.css            # Tailwind CSS for admin
├── i18n/
│   ├── config.ts            # Main site i18n config
│   ├── dictionaries.ts      # Main site translations
│   └── admin/               # Admin i18n (next-intl)
├── lib/
│   ├── admin-auth.ts        # Admin authentication
│   ├── admin-utils.ts       # Tailwind cn() utility
│   └── reservations.ts      # Reservation data/types
├── providers/
│   └── reservations-provider.tsx
└── hooks/
    └── use-mobile.ts
messages/                    # Admin translations (next-intl)
├── ko.json
└── en.json
```

## Route Groups

### (main) - Main Website
- Uses styled-components for styling
- Custom i18n with dictionaries
- Public-facing pages

### (admin) - Admin Dashboard
- Uses Tailwind CSS + shadcn/ui
- next-intl for i18n
- Protected routes (cookie-based auth)

## Key Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run typecheck    # TypeScript check
npm run lint         # ESLint
```

## Development Guidelines

### Adding Admin Components
1. Use shadcn/ui components from `src/components/admin/ui/`
2. Use `cn()` from `@/lib/admin-utils` for class merging
3. Follow Tailwind CSS conventions

### Adding Main Site Components
1. Use styled-components
2. Follow existing patterns in `src/components/`
3. Use theme from `src/styles/theme.ts`

### Adding Translations
- **Admin**: Edit `messages/ko.json` and `messages/en.json`
- **Main**: Edit `src/i18n/dictionaries/ko.json` and `en.json`

### Creating New Admin Pages
1. Create page in `src/app/[locale]/(admin)/admin/[feature]/page.tsx`
2. Use async params: `params: Promise<{ locale: string }>`
3. Import admin components from `@/components/admin/`

## Environment Variables

```env
# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=

# Meta Pixel (optional)
NEXT_PUBLIC_META_PIXEL_ID=

# Site URL
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Deployment
- GitHub Actions deploys to GCP Cloud Run on push to main
- Requires GCP secrets configured in GitHub repository
