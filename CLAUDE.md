# CLAUDE.md - Over The Top Solar (Awadh Enterprises)

## Project Overview
- **Brand**: Over The Top Solar (Awadh Enterprises - Solar Solutions)
- **Location**: Bari Basahi, Mirzapur, Uttar Pradesh 231001, India
- **Phone**: +91 89530 69011
- **Stack**: Next.js 16 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Supabase (Postgres, Auth, Storage) + Three.js / React Three Fiber + GSAP / Lenis / Framer Motion

## Commands
- `npm run dev`: Start development server on port 3001
- `npm run build`: Build production application
- `npm run start`: Start production server on port 3001
- `npm run typecheck`: TypeScript type check (`tsc --noEmit`)
- `npm run lint`: ESLint check (`eslint src`)

## Architecture & Code Rules
1. **Never Break Working Functionality**:
   - Bilingual support (`EN`/`हिन्दी`) via `<T>` LanguageProvider
   - Existing admin management (`/admin`) and secure session cookies
   - Enquiry popup with WhatsApp and future Google Sheets endpoint
   - Dynamic 3D canvas with low-power / reduced-motion fallback
2. **Design Standards**:
   - Palette: Warm ivory/white base, deep navy (`#0A1628` / `#062149`), solar gold/amber (`#FFB800` / `#F5A900`), electric blue accent
   - No generic templates; purposeful motion; WCAG AA contrast compliance
   - Never invent credentials, fake reviews, or unauthorized government approvals
3. **Database & API Standards**:
   - Server Components by default; Client Components only for interactivity (`'use client'`)
   - Strict Row Level Security (RLS) on all Supabase tables
   - No sensitive keys or service-role tokens on client-facing code

