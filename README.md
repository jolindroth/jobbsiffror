# Jobbsiffror

<div align="center"><strong>Swedish Job Statistics Dashboard</strong></div>
<div align="center">Built with Next.js 15 and modern web technologies</div>
<br />
<div align="center">
<a href="https://jobbsiffror.se">Visit jobbsiffror.se</a>
</div>

## Overview

Jobbsiffror is a read-only web application that displays Swedish economic data, primarily job numbers for various professions and regions. The application provides interactive visualizations and analytics to help users understand employment trends across Sweden.

### Tech Stack

- **Framework** - [Next.js 15](https://nextjs.org) with App Router
- **Language** - [TypeScript](https://www.typescriptlang.org)
- **Styling** - [Tailwind CSS v4](https://tailwindcss.com)
- **Components** - [Shadcn-ui](https://ui.shadcn.com) (Radix UI)
- **Data Visualization** - [Recharts](https://recharts.org)
- **State Management** - [Zustand](https://zustand-demo.pmnd.rs)
- **Search Params** - [Nuqs](https://nuqs.47ng.com/)
- **Tables** - [Tanstack React Table](https://tanstack.com/table)
- **Forms** - [React Hook Form](https://react-hook-form.com) with [Zod](https://zod.dev)
- **Command Interface** - [kbar](https://kbar.vercel.app/)
- **Error Tracking** - [Sentry](https://sentry.io) (optional)
- **Linting** - [ESLint](https://eslint.org)
- **Formatting** - [Prettier](https://prettier.io)

## Data Source

The application fetches data from Swedish government public APIs that provide employment statistics. Key considerations:

- **Rate Limited**: APIs have usage limits that must be respected
- **Large Datasets**: Responses can contain substantial amounts of data
- **Caching Strategy**: Heavy reliance on caching to minimize API calls and improve performance
- **No Persistence**: No local database storage, data is cached temporarily

## Architecture

Feature-based organization structure:

```plaintext
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard pages and layouts
│   │   ├── vacancies/     # Main job statistics with dynamic filtering
│   │   ├── product/       # Data management
│   │   ├── kanban/        # Task management
│   │   └── profile/       # User profile
│   └── auth/              # Authentication pages
├── components/            # Shared UI components
│   ├── ui/               # Base UI components (Shadcn-ui)
│   └── layout/           # Layout components
├── features/             # Feature-specific modules
│   ├── overview/         # Chart components and data visualization
│   ├── products/         # Data management
│   └── kanban/           # Task management
├── lib/                  # Core utilities and API services
├── hooks/                # Custom React hooks
├── types/                # TypeScript definitions
├── constants/            # Swedish regions, occupations, and app constants
└── services/            # External API integrations (JobTech API)
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
- `pnpm format` - Format code with Prettier

## Features

- **Dynamic Vacancies Dashboard**: Swedish employment data with URL-based filtering by region and occupation
- **Data Visualization**: Interactive charts showing job trends by profession and region over time
- **SEO-Friendly Routes**: Dynamic URLs like `/dashboard/vacancies/stockholm/systemutvecklare` for better search visibility
- **Advanced Filtering**: Date range, region, and occupation filtering with URL persistence
- **Responsive Design**: Mobile-friendly interface
- **Theme Support**: Dark and light mode themes
- **Performance Optimized**: Efficient data fetching and caching strategies

## License

This project is licensed under the MIT License.
