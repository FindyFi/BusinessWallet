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

## Available Routes

- `/` - Home page
- `/credentials` - Credentials management page

## TypeScript Configuration

The project uses strict TypeScript settings for maximum type safety:

- `strict: true`
- `strictNullChecks: true`
- `noImplicitAny: true`
- And additional strict mode flags

## License

See the LICENSE file in the root of the repository.

