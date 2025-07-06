# CLAUDE.md - Jobbsiffror Project Guide

## Claude Code agentic instructions
You are a senior architect and you will never write any code.
Your purpose is to setup a detailed implementation plan under a folder "tasks". You will be talking to me, the boss, to make sure the tasks are defined properly. Everytime we discuss, it will always be about defining and refining a specific task. Later, another agent will implement these tasks and mark them as completed.

## Project Overview

**Jobbsiffror** is a read-only Swedish job statistics dashboard that displays employment data from Swedish government APIs. The application provides interactive visualizations and analytics to help users understand employment trends across Sweden.

- **Live Site**: https://jobbsiffror.se
- **Purpose**: Display Swedish economic data, primarily job numbers by profession and region
- **Status**: Read-only data visualization application (no user-generated content)

## Quick Start Commands

```bash
# Install dependencies
pnpm install

# Start development server (with Turbopack)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Code quality
pnpm lint          # Run ESLint
pnpm lint:fix      # Fix linting issues and format code
pnpm lint:strict   # Run ESLint with zero warnings tolerance
pnpm format        # Format code with Prettier
pnpm format:check  # Check code formatting
```

## Tech Stack & Architecture

### Core Technologies
- **Framework**: Next.js 15 with App Router, Vercel and TanStack query
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm (v10.6.2)
- **Runtime**: React 19

### Key Libraries
- **UI Components**: Shadcn-ui (Radix UI primitives)
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Tables**: Tanstack React Table
- **Charts**: Recharts
- **Search Params**: Nuqs
- **Command Interface**: kbar
- **Theme System**: next-themes
- **Error Tracking**: Sentry (optional)

### Architecture Pattern
Feature-based organization with clear separation of concerns:

```
src/
├── app/              # Next.js App Router (pages, layouts, API routes)
├── features/         # Feature modules (auth, overview, products, kanban)
├── components/       # Shared components (UI primitives, layout)
├── lib/              # Core utilities and configurations
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── constants/        # Application constants and mock data
└── config/           # Configuration files
```

## Data Integration

### Primary Data Source
**Swedish JobTech Historical Ads API** (`historical.api.jobtechdev.se`)

### API Capabilities
- **Main Search**: `/search` - Advanced filtering by occupation, location, employer, skills, date ranges
- **Individual Ads**: `/ad/{id}` - Retrieve specific job ads
- **Statistics**: `/stats` - Taxonomy-based statistics and aggregations
- **Historical Data**: Support for historical date ranges and seasonal filtering

### API Constraints & Strategy
- **Rate Limited**: Requests have usage limits with timeouts up to 600 seconds
- **Large Datasets**: Responses can be substantial (max 100 results per request, max offset 2000)
- **No Persistence**: No local database - rely entirely on API responses
- **Caching Strategy**: Heavy caching at multiple levels (server-side, client-side, CDN)
- **Pagination**: Implement intelligent pagination (limit 100, offset max 2000)

## Development Guidelines

### Code Style
- **Language**: All user-facing text must be in Swedish (no localization needed)
- **Dead Code**: Never comment out unused code - remove it entirely
- **Simplicity**: Keep changes minimal and focused - avoid complex modifications
- **Components**: Use Shadcn-ui components, install new ones if needed

### Path Aliases
- `@/*` → `./src/*`
- `~/*` → `./public/*`

### Environment Setup
1. Copy `env.example.txt` to `.env.local`
2. Configure optional Sentry settings
3. Authentication (Clerk) is present but disabled for this read-only app

## Key Features & Pages

### Main Navigation
- **Dashboard** (`/dashboard/overview`): Main analytics dashboard
- **Product** (`/dashboard/product`): Data management interface
- **Kanban** (`/dashboard/kanban`): Task management (if enabled)
- **Profile** (`/dashboard/profile`): User profile (if auth enabled)

### Dashboard Components
- **Overview Page**: Statistics cards, charts, and recent activity
- **Data Visualization**: Area charts, bar graphs, pie charts using Recharts
- **Advanced Tables**: Sortable, filterable data tables with Tanstack React Table
- **Theme System**: Dark/light mode with system preference detection

## File Structure Deep Dive

### Critical Files
- `src/app/layout.tsx` - Root layout with providers and theme setup
- `src/app/page.tsx` - Root page (redirects to dashboard)
- `src/app/dashboard/layout.tsx` - Dashboard layout with sidebar
- `src/constants/data.ts` - Navigation items and mock data
- `src/lib/utils.ts` - Core utilities (cn function, formatBytes)
- `components.json` - Shadcn-ui configuration

### Feature Modules
- `src/features/overview/` - Dashboard overview components
- `src/features/products/` - Product management
- `src/features/kanban/` - Kanban board functionality
- `src/features/auth/` - Authentication (currently disabled)

### Component Library
- `src/components/ui/` - Shadcn-ui components
- `src/components/layout/` - Layout components (sidebar, header, providers)
- `src/components/kbar/` - Command interface components

## Authentication Status

- **Current State**: Disabled (commented out in code)
- **Provider**: Clerk (configured but not active)
- **Reason**: Read-only application for public Swedish economic data
- **Future**: May be enabled if app becomes SaaS product

## Performance & SEO

- **SEO Priority**: SEO and Web Core Vitals are paramount to success
- **Caching**: Multi-level caching strategy for API responses
- **Loading States**: Skeleton components for better UX
- **Error Handling**: Comprehensive error boundaries and fallbacks

## Development Workflow

### Existing Tooling
- **Pre-commit Hooks**: Husky + lint-staged
- **Code Quality**: ESLint (extends Next.js) + Prettier
- **Type Safety**: TypeScript strict mode
- **Build Tool**: Next.js with Turbopack for dev server

### Project Rules (.cursorrules)
The project follows a specific workflow:
1. **Plan First**: Create plan in `tasks/todo.md` before coding
2. **Verification**: Get plan approved before implementation
3. **Incremental**: Mark tasks complete as you go
4. **Simplicity**: Keep changes minimal and focused
5. **Documentation**: Add review section to todo.md when done

## Common Tasks

### Adding New UI Components
1. Use existing Shadcn-ui components from `src/components/ui/`
2. Install new Shadcn components if needed: `npx shadcn-ui@latest add [component]`
3. Document custom components in `CUSTOM_COMPONENTS.md`

### Data Fetching Patterns
1. Implement caching strategy for API calls
2. Use React Query or similar for server state management
3. Handle rate limiting and large dataset pagination
4. Add loading states and error boundaries

### Styling Guidelines
1. Use Tailwind CSS v4 classes
2. Follow Shadcn-ui design system
3. Implement responsive design (`@container` queries available)
4. Support dark/light themes

## API Integration Examples

The `/docs/historical-vacancies-integration/` directory contains:
- `historical.api.jobtechdev.se.swagger.json` - Complete API specification
- `example-search-response.json` - Sample API response structure
- `occupation-groups.json` - Available occupation taxonomies

## Troubleshooting

### Common Issues
1. **Build Failures**: Check TypeScript strict mode compliance
2. **API Rate Limits**: Implement proper caching and request throttling
3. **Large Datasets**: Use pagination and virtual scrolling for performance
4. **Theme Issues**: Verify theme provider setup in layout.tsx

### Debug Mode
- Development server includes detailed error reporting
- Sentry integration available for production error tracking
- Console logging should be removed in production builds

## Future Considerations

- **SaaS Potential**: Authentication system ready for activation
- **Scaling**: Caching strategy designed for high traffic
- **Localization**: Currently Swedish-only, architecture supports expansion
- **Real-time Data**: WebSocket integration possible for live updates

---

*This guide should help you quickly understand and work with the Jobbsiffror codebase. Focus on the data integration patterns and Swedish job market context when making changes.*