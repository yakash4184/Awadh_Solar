# Architecture & Implementation Plan: Over The Top Solar (Awadh Enterprises)

## 1. Overview & Brand Identity
- **Legal/Local Entity**: Awadh Enterprises
- **Brand Line**: Over The Top Solar — Clean Energy, Sustainable Future
- **Locality**: Bari Basahi, Mirzapur, Uttar Pradesh 231001, India (Phone: 89530 69011)
- **Primary Goal**: Award-level, light-theme animated 3D motion website and business platform with zero layout shifts and low-power mobile fallbacks.

## 2. Technical Stack
- **Framework**: Next.js 16 (App Router, Turbopack & Webpack supported)
- **Language**: TypeScript 5.9 (Strict mode enabled)
- **Styling**: Tailwind CSS v4 + Custom Modern Theme CSS (`globals.css`, `experience.css`, `admin.css`)
- **3D & Motion**: Three.js, `@react-three/fiber`, `@react-three/drei`, GSAP, Lenis, Framer Motion
- **Backend & Database**: Supabase (Postgres with RLS, Auth, Storage)
- **Deployment**: Vercel / Node.js standalone with ISR caching

## 3. Database Schema Roadmap (Supabase Postgres)
- `site_content`: Cached JSONB row for bilingual copy, countdown timer, hero photos, solution cards, products, calculator constants.
- `leads`: Enquiries with unique Lead ID, name, phone, requirement, bill range, locality, preferred contact, sync status to Google Sheets.
- `profiles`: User roles (`owner`, `admin`, `sales`, `accountant`, `customer`) linked to `auth.users`.
- `estimates`: Line items, discount, tax, subtotal (integer paise / decimal safe arithmetic), status, RLS for customer view.
- `invoices`: Sequential concurrency-safe invoice numbering, payment tracking, immutable snapshots.

## 4. Milestones
- [x] **Milestone 1**: Brand system, scroll-driven sun journey, 3D rooftop scene, shop video showcase with portrait frame and halo lighting, countdown banner, responsive bilingual navigation.
- [ ] **Milestone 2**: Supabase schema expansion (leads, estimates, invoices, user profiles with RLS).
- [ ] **Milestone 3**: CMS enhancements, dynamic public routes, PM Surya Ghar information portal.
- [ ] **Milestone 4**: Google Sheets webhook / Apps Script sync integration for enquiries.
- [ ] **Milestone 5**: Customer account portal (`/account`) for viewing estimates and project milestones.
- [ ] **Milestone 6**: Invoicing, payment receipts, audit logging.
- [ ] **Milestone 7**: Vitest/Playwright tests, automated Lighthouse audits, SEO pass.
- [ ] **Milestone 8**: Deployment checklists, environment configurations, backup procedures.

