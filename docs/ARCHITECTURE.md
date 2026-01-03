# Architecture Documentation

## 1. Overview
- **Project name**: base-template
- **Created with**: Better-T-Stack
- **Type**: TypeScript monorepo using Turborepo
- **Package manager**: Bun (v1.3.5)

## 2. Tech Stack Summary
- **Frontend**: React 19, TanStack Start (SSR), TanStack Router, TanStack Query
- **Styling**: TailwindCSS v4, shadcn/ui components
- **Backend**: TanStack Start API routes (file-based routing)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better-Auth with email/password
- **Payments**: Polar.sh integration via @polar-sh/better-auth
- **AI**: Vercel AI SDK with Google Gemini (gemini-2.5-flash)
- **Build System**: Turborepo with Vite

## 3. Project Structure
```
base-template/
├── apps/
│   └── web/                    # Main web application
│       ├── src/
│       │   ├── components/     # React components (UI + features)
│       │   ├── functions/      # Server functions (getUser, getPayment)
│       │   ├── lib/            # Client utilities (auth-client, utils)
│       │   ├── middleware/     # TanStack Start middleware (auth)
│       │   └── routes/         # File-based routes
│       │       └── api/        # API endpoints (auth, ai)
├── packages/
│   ├── auth/                   # @base-template/auth - Better-Auth config
│   ├── config/                 # @base-template/config - Shared TS config
│   ├── db/                     # @base-template/db - Drizzle ORM + schema
│   └── env/                    # @base-template/env - Type-safe env vars
```

## 4. Package Details

### @base-template/db
- Drizzle ORM with PostgreSQL (pg driver)
- Schema in `src/schema/` - exports auth tables (user, session, account, verification)
- Relations defined for user ↔ session ↔ account

### @base-template/auth
- Better-Auth with Drizzle adapter
- Email/password authentication enabled
- Polar.sh plugin for payments/subscriptions
- TanStack Start cookie integration

### @base-template/env
- Uses @t3-oss/env-core for type-safe environment variables
- **Server env**: DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, POLAR_ACCESS_TOKEN, POLAR_SUCCESS_URL, CORS_ORIGIN, NODE_ENV
- **Web env**: Separate client-side safe exports

### @base-template/config
- Shared TypeScript configuration (tsconfig.base.json)

## 5. Data Flow
1. **Request Lifecycle**: Request → TanStack Router → Route handler
2. **Authentication**: Auth middleware extracts session from headers via Better-Auth
3. **Authorization**: Protected routes redirect to /login if no session
4. **Auth Proxy**: API routes at `/api/auth/*` proxy to Better-Auth handler
5. **AI Streaming**: API routes at `/api/ai/*` stream responses from Vercel AI SDK

## 6. Authentication Flow
- Better-Auth handles `/api/auth/*` endpoints
- **Auth Client (Browser)**: `authClient` from `better-auth/react` with Polar plugin
- **Auth Server**: `auth` instance with Drizzle adapter, session management
- **Middleware**: `authMiddleware` adds session to route context

## 7. Payment Integration
- **Platform**: Polar.sh for subscriptions
- **User Sync**: Customer created on signup
- **Checkout**: Flow with success URL redirect
- **Management**: Customer portal for subscription management
- **Products**: Defined by slug (e.g., "pro")

## 8. Development Commands
```bash
bun install           # Install dependencies
bun run dev          # Start development server
bun run build        # Build all packages
bun run check-types  # TypeScript type checking
bun run db:push      # Push schema to database
bun run db:studio    # Open Drizzle Studio
bun run db:generate  # Generate migrations
bun run db:migrate   # Run migrations
```

## 9. Environment Setup
The following environment variables are required:
- **DATABASE_URL**: PostgreSQL connection string
- **BETTER_AUTH_SECRET**: Auth secret (min 32 chars)
- **BETTER_AUTH_URL**: Auth server URL
- **POLAR_ACCESS_TOKEN**: Polar.sh API token
- **POLAR_SUCCESS_URL**: Redirect URL after checkout
- **CORS_ORIGIN**: Allowed CORS origin

## 10. Key Files Reference
- `apps/web/src/routes/__root.tsx`: Root route component with layout and providers
- `apps/web/src/routes/api/auth/$.ts`: Better-Auth API handler proxy
- `apps/web/src/routes/api/ai/$.ts`: AI SDK streaming endpoint
- `packages/auth/src/index.ts`: Main Better-Auth configuration and plugin setup
- `packages/db/src/schema/index.ts`: Central database schema export
- `packages/env/src/server.ts`: Server-side environment variable validation
- `apps/web/src/middleware/auth.ts`: Authentication middleware for TanStack Start
