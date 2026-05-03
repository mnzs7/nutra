# VitaShop - Suplementos e Farmácia Online

A production-ready Next.js 14 e-commerce website for health supplements, built with TypeScript, Tailwind CSS, Zustand, Framer Motion, and more.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS
- **State**: Zustand (persisted to localStorage)
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Themes**: next-themes (dark mode)

## Features

- Full e-commerce flow (browse → product detail → cart → checkout → confirmation)
- 12 mock products across 6 categories
- Advanced product filtering and sorting
- Interactive health quiz with personalized recommendations
- Product comparator (up to 3 products)
- Subscribe & Save 15% monthly subscription option
- Loyalty points program (250 welcome bonus, €1 = 1 point)
- Free shipping progress bar (threshold: €50)
- Toast notification system
- Smart search with autocomplete
- PWA support (manifest + service worker)
- WCAG 2.1 AA accessibility
- Loading skeleton screens
- Dark mode support
- Fully responsive (mobile-first)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── ui/           # Base UI components
│   ├── layout/       # Header, Footer
│   ├── products/     # Product-specific components
│   ├── cart/         # Cart components
│   ├── checkout/     # Checkout flow
│   ├── home/         # Homepage sections
│   └── search/       # Search components
├── lib/
│   ├── data/         # Mock product data
│   ├── store/        # Zustand stores
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions
│   └── types/        # TypeScript types
public/
├── manifest.json     # PWA manifest
└── sw.js             # Service worker
```

## Deploy to Vercel

```bash
npx vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values (all optional for the demo).
