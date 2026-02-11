# Docker Setup for Business Wallet

This document describes the Docker setup for local development and deployment of the Business Wallet application.

## Overview

The Docker setup provides two deployment modes:
1. **Production** - Optimized build with nginx serving static files
2. **Development** - Hot-reload development server with Vite

## Services

### Web UI (Frontend)
- **Production**: React app built and served by nginx on port 3000
- **Development**: Vite dev server with hot-reload on port 5173

### PostgreSQL Database
- PostgreSQL 15 on port 5432
- Persistent data storage using Docker volumes
- Health checks configured
- Ready for future backend integration

## Quick Start

### Production Mode

```bash
# Start all services
docker compose up -d

# Access the application
# Web UI: http://localhost:3000
# Database: localhost:5432

# Stop services
docker compose down
```

### Development Mode

```bash
# Start development environment
docker compose -f docker-compose.dev.yml up

# Access the application
# Web UI: http://localhost:5173 (with hot-reload)
# Database: localhost:5432

# Stop services
docker compose -f docker-compose.dev.yml down
```

## Environment Variables

Copy `.env.example` to `.env` and customize:

```bash
cp .env.example .env
```

Available variables:
- `DB_PASSWORD` - PostgreSQL password (default: changeme)

## Architecture

### Production (docker-compose.yml)

- **Multi-stage build**: Builds React app in Node.js container, serves with nginx
- **Optimized images**: Production image only contains built files and nginx
- **Security headers**: Configured in nginx.conf
- **Caching**: Static assets cached for 1 year

### Development (docker-compose.dev.yml)

- **Hot-reload**: Source files mounted for instant updates
- **Preserved dependencies**: node_modules from image, not mounted
- **Full dev tools**: All development dependencies available
- **Source maps**: Enabled for debugging

## File Structure

```
.
├── docker-compose.yml          # Production configuration
├── docker-compose.dev.yml      # Development configuration
├── .env.example                # Environment variables template
└── web-ui/
    ├── Dockerfile              # Production build
    ├── Dockerfile.dev          # Development build
    ├── nginx.conf              # nginx configuration
    └── .dockerignore           # Build exclusions
```

## Database

PostgreSQL is included for future backend development:
- Database: `businesswallet`
- User: `businesswallet`
- Password: From `DB_PASSWORD` environment variable
- Data persists in Docker volume `postgres-data`

## Troubleshooting

### npm install timeouts

The Dockerfiles include increased timeout settings for npm to handle slow network connections:
```dockerfile
RUN npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-timeout 300000 && \
    npm install
```

### Port conflicts

If ports 3000, 5173, or 5432 are already in use, modify the port mappings in docker-compose.yml:
```yaml
ports:
  - "8080:80"  # Change 3000 to 8080 for web-ui
```

### Rebuilding images

Force rebuild after code changes:
```bash
docker compose build --no-cache
```

## Future Enhancements

- Add backend service when backend is implemented
- Configure nginx for backend API proxying
- Add Docker health checks for web-ui
- Implement multi-stage backend builds
- Add docker-compose.prod.yml for production deployments
