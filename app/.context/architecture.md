# Frontend Architecture

## Overview

The Jiki frontend is a Next.js application designed for global edge deployment on Cloudflare Workers, providing a learn-to-code platform with interactive exercises and content.

## Key Architectural Decisions

### Edge Deployment

- Deployed on Cloudflare Workers for global low-latency access
- Uses Next.js Edge Runtime for compatibility
- Static assets and exercises bundled at deployment time

### Exercise System

- Exercises compiled and deployed alongside the Next.js app
- Each exercise has a standardized entry point for rendering
- "Run Code" executes tests locally using custom interpreters
- Test results and progress sent to Rails API after local execution
- API determines which exercise to show next

### Content Management

- Markdown content statically built and inserted during deployment
- Content repo pushes trigger automatic FE redeployment via GitHub Actions
- Build-time processing for optimal performance

### State Management

- User progress tracked via Rails API
- Local execution results synced to backend
- Client-side routing with linear progression (Duolingo-style)

### Internationalization

- Full i18n support for global audience
- Right-to-left (RTL) language support
- Purchasing power parity (PPP) pricing display based on location

### Performance Optimizations

- Static generation at build time
- Edge caching strategies
- Bundle optimization for exercises and content
- Mobile-first responsive design
- React Compiler for automatic component optimization
- React 19 features for improved performance and DX

## Project Structure

Following Next.js best practices, we use the "Store project files outside of app" strategy:

### Directory Organization

```
/app                    # Only routing files (page.tsx, layout.tsx, etc.)
  /dashboard           # User dashboard showing levels and lessons
  /lesson/[slug]       # Dynamic route for lesson content (video or exercise)
  /dev                 # Development-only tools and utilities (blocked in production)
    /video-exercise    # Video player testing
/components            # Reusable React components used by pages
  /video-exercise      # Video lesson player component
  /coding-exercise    # Coding exercise system
  /index-page          # Dashboard components
    /exercise-path     # Level/lesson display system
/lib                   # Core libraries and utilities
  /api                 # API client and endpoints
    /lessons.ts        # Lesson-specific API calls
    /levels.ts         # Level and progress API
/utils                 # Utility functions and shared logic
/public               # Static assets
/tests                # Test files organized by type (unit, integration, e2e)
/scripts              # Build and development scripts
/middleware.ts        # Edge middleware for route protection and filtering
```

### Key Principles

- **App directory**: Contains only routing-related files - pages, layouts, loading, and error boundaries
- **Components directory**: All UI components that pages use live here, organized by feature or type
- **Utils directory**: Shared utility functions and helpers
- **Tests directory**: Centralized test organization separate from source code
- **Separation of concerns**: Business logic, components, and utilities are kept outside the app directory
- **Clean routing**: The app directory structure directly mirrors the URL structure without clutter

This approach provides:

- Better code organization and maintainability
- Clear separation between routing and implementation
- Easier navigation and discovery of components
- Flexibility to reorganize components without affecting routing

## Routing Architecture

### Main Application Routes

- **`/dashboard`**: User's learning dashboard
  - Displays levels as sections with lesson nodes
  - Shows progress and completion status
  - Progressive unlocking of content
- **`/lesson/[slug]`**: Dynamic lesson route
  - Fetches lesson details from API
  - Routes to appropriate component based on type:
    - Video lessons → `VideoExercise` component
    - Coding exercises → `CodingExercise` component
  - Handles authentication and progress tracking

### Content Flow

1. User logs in → Redirected to `/dashboard`
2. Dashboard fetches levels and progress from `/levels` API
3. User clicks lesson → Navigates to `/lesson/[slug]`
4. Lesson page fetches details from `/lessons/:slug` API
5. Appropriate component renders based on lesson type
6. Completion tracked via API, user returns to dashboard

## Development Environment

### Development-Only Routes

The `/dev` route provides access to development tools and utilities that are only available in development mode:

- **Location**: `/app/dev/` directory contains all development-specific pages
- **Protection**: Middleware at `/middleware.ts` blocks access to `/dev/*` routes in production (returns 404)
- **Detection**: Routes are available when `NODE_ENV === 'development'` or `VERCEL_ENV === 'development'`
- **Purpose**: Debug panels, component galleries, test data generators, and other dev tools
- **Video Testing**: `/dev/video-exercise` for testing video player with mock data
