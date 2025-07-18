# Jobbsiffror

<div align="center"><strong>Swedish Job Statistics Dashboard</strong></div>
<div align="center">Built with Next.js 15 and modern web technologies</div>
<br />
<div align="center">
<a href="https://jobbsiffror.se">Visit jobbsiffror.se</a>
</div>

## Overview

Jobbsiffror is a public Swedish job statistics dashboard that displays employment data from Swedish government APIs. The application provides interactive visualizations and analytics to help users understand employment trends across Sweden. This is a read-only application focused entirely on data visualization with no authentication required.

### Tech Stack

- **Framework** - [Next.js 15](https://nextjs.org) with App Router and React 19
- **Language** - [TypeScript](https://www.typescriptlang.org) (strict mode)
- **Styling** - [Tailwind CSS v4](https://tailwindcss.com)
- **Components** - [Shadcn-ui](https://ui.shadcn.com) (Radix UI primitives)
- **Data Fetching** - [TanStack Query](https://tanstack.com/query) (React Query)
- **Data Visualization** - [Recharts](https://recharts.org)
- **State Management** - [Zustand](https://zustand-demo.pmnd.rs)
- **Search Params** - [Nuqs](https://nuqs.47ng.com/)
- **Tables** - [Tanstack React Table](https://tanstack.com/table)
- **Forms** - [React Hook Form](https://react-hook-form.com) with [Zod](https://zod.dev)
- **Command Interface** - [kbar](https://kbar.vercel.app/)
- **Date Utilities** - [date-fns](https://date-fns.org/)
- **Animation** - [Motion](https://motion.dev/)
- **Theme System** - [next-themes](https://github.com/pacocoursey/next-themes)
- **Analytics** - [Vercel Analytics](https://vercel.com/analytics) & [Speed Insights](https://vercel.com/docs/speed-insights)
- **Error Tracking** - [Sentry](https://sentry.io) (optional)
- **Testing** - [Jest](https://jestjs.io/) with [Testing Library](https://testing-library.com/)
- **Linting** - [ESLint](https://eslint.org)
- **Formatting** - [Prettier](https://prettier.io)
- **Package Manager** - [pnpm](https://pnpm.io/)

## Data Source

The application integrates with the **Swedish JobTech Historical Ads API** (`historical.api.jobtechdev.se`) to provide comprehensive employment statistics. 

### API Capabilities
- **Main Search**: `/search` - Advanced filtering by occupation, location, employer, skills, date ranges
- **Individual Ads**: `/ad/{id}` - Retrieve specific job advertisements
- **Statistics**: `/stats` - Taxonomy-based statistics and aggregations
- **Historical Data**: Support for historical date ranges and seasonal filtering

### API Constraints & Strategy
- **Rate Limited**: Requests have usage limits with timeouts up to 600 seconds
- **Large Datasets**: Responses can be substantial (max 100 results per request, max offset 2000)
- **No Persistence**: No local database - relies entirely on API responses
- **Caching Strategy**: Multi-level caching (server-side, client-side, CDN) for optimal performance
- **Intelligent Pagination**: Handles API limits (max 100 results, offset limit 2000)

## Architecture

Feature-based organization with clear separation of concerns:

```plaintext
src/
├── app/                    # Next.js App Router (pages, layouts)
│   ├── dashboard/         # Dashboard pages and layouts
│   │   ├── vacancies/     # Main job statistics with dynamic filtering
│   │   └── product/       # Data management interface
│   ├── contact/           # Contact page
│   ├── privacy/           # Privacy policy
│   └── terms/             # Terms of service
├── components/            # Shared UI components
│   ├── ui/               # Shadcn-ui components (Radix UI primitives)
│   ├── layout/           # Layout components (sidebar, header, providers)
│   └── kbar/             # Command interface components
├── features/             # Feature modules
│   ├── overview/         # Dashboard overview and chart components
│   └── products/         # Product management features
├── lib/                  # Core utilities and configurations
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
├── constants/            # Swedish regions, occupations, and app constants
├── services/             # External API integrations (JobTech API)
└── config/               # Configuration files
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended package manager)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd jobbsiffror
```

2. Install dependencies:

```bash
pnpm install
```

3. Create environment file:

```bash
cp env.example.txt .env.local
```

4. Configure environment variables in `.env.local`

5. Start development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Development Commands

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix linting issues and format code
- `pnpm lint:strict` - Run ESLint with zero warnings tolerance
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm test` - Run Jest tests
- `pnpm prepare` - Setup Husky pre-commit hooks

## Features

- **Dynamic Vacancies Dashboard**: Swedish employment data with real-time filtering by region, occupation, and date range
- **Interactive Data Visualization**: Area charts, bar graphs, and pie charts showing job market trends over time
- **SEO-Friendly Routes**: Dynamic URLs like `/dashboard/vacancies/stockholm/systemutvecklare` for optimal search visibility
- **Advanced Filtering**: URL-persistent filtering with month-range date picker, region selector, and occupation categories
- **Statistics Cards**: Real-time job market metrics including total vacancies, most active regions and occupations
- **Swedish Language Interface**: All content and UI elements in Swedish for the target market
- **Responsive Design**: Mobile-first responsive interface with container queries
- **Theme Support**: Dark and light mode with system preference detection
- **Command Interface**: Keyboard shortcuts and command palette (kbar) for power users
- **Performance Optimized**: Multi-level caching, skeleton loading states, and efficient data fetching
- **Legal Pages**: Complete privacy policy, terms of service, and contact information
- **Analytics Integration**: Vercel Analytics and Speed Insights for performance monitoring

## License

This project is licensed under the MIT License.
