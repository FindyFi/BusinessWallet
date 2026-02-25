# Business Wallet - Web UI

A React + TypeScript web application for the Business Wallet system.

## Overview

This is the frontend user interface for Business Wallet, a digital wallet system for organizations to issue, store, share, and request verifiable credentials and documents.

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Installation

1. Install dependencies:

```bash
npm install
```

## Development

### Using Docker (Recommended)

From the repository root:

```bash
# Start development environment with hot-reload
docker compose -f docker-compose.dev.yml up web-ui-dev

# Or use the shorthand if only running web-ui
docker compose -f docker-compose.dev.yml up
```

The application will be available at `http://localhost:5173` with hot module replacement (HMR).

### Manual Setup

Start the development server with hot module replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building

### Using Docker

From the repository root:

```bash
# Build production image
docker compose build web-ui

# Or build and run
docker compose up -d web-ui
```

The application will be available at `http://localhost:3000`

### Manual Build

Build the application for production:

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Code Quality

### Linting

Check code for issues:

```bash
npm run lint
```

### Formatting

Format code with Prettier:

```bash
npm run format
```

## Project Structure

```
web-ui/
├── src/
│   ├── components/     # Reusable UI components
│   │   └── Layout.tsx  # Main application layout with navigation
│   ├── pages/          # Page components
│   │   ├── Home.tsx    # Home page
│   │   └── Credentials.tsx  # Credentials management page
│   ├── App.tsx         # Main application component with routing
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project dependencies and scripts
```

## Environment Variables

The dev server includes a built-in proxy: any request to `/credentials/*` is automatically
forwarded to the backend. No environment variables are required for local development.

| Variable | Description | Default / Notes |
|---|---|---|
| `API_PROXY_TARGET` | Backend URL used by the **Vite dev server proxy** (Node.js env var, not a `VITE_` prefix) | `http://localhost:3001` (backend port exposed by `docker-compose.dev.yml`) |
| `VITE_API_BASE_URL` | Backend base URL embedded in the **production build** (leave unset in dev to use the proxy) | `''` — set at build time for production |

For local development without Docker nothing needs to be configured — start the backend on port 3001 and run `npm run dev`.

When the backend runs on a different host or port, set `API_PROXY_TARGET` before starting the dev server:

```bash
API_PROXY_TARGET=http://localhost:3001 npm run dev
```

For a production build, set `VITE_API_BASE_URL` to the backend's public URL:

```bash
VITE_API_BASE_URL=https://api.example.com npm run build
```

## Available Routes

- `/` - Home page
- `/credentials` - Credentials management page
- `/issue` - Issue employee verifiable credentials (SD-JWT VC)

## TypeScript Configuration

The project uses strict TypeScript settings for maximum type safety:

- `strict: true`
- `strictNullChecks: true`
- `noImplicitAny: true`
- And additional strict mode flags

## License

See the LICENSE file in the root of the repository.

