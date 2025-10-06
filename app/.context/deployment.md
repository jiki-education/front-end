# Deployment

## Target Platform

Cloudflare Workers with Next.js Edge Runtime

## Deployment Process

1. Content repository changes trigger GitHub Actions
2. Frontend rebuilds with latest content and exercises
3. Deploy to Cloudflare Workers using Cloudflare CLI
4. Global edge distribution for low-latency access

## Build Process

- Exercises compiled alongside Next.js application
- Markdown content processed at build time
- Static assets optimized and bundled
- TypeScript compilation with strict mode
- Interpreters package bundled as workspace dependency

## Environment Configuration

- **Production URL**: TBD (pending launch)
- **Development**: http://localhost:3060
- **Edge Runtime**: Cloudflare Workers compatibility
- **Features**:
  - Purchasing power parity (PPP) pricing based on location
  - Full internationalization support
  - Mobile-first responsive design

## Current Status

The application is in active development with deployment infrastructure being finalized for the January 2025 launch.
