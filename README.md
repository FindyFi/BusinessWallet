# BusinessWallet

A Digital Wallet for organizations

## Overview

Business Wallet is a digital wallet system for organizations that enables them to issue, store, share, and request verifiable credentials and documents. It serves as a versatile communication tool supporting W3C Verifiable Credentials, OpenID4VC protocols, and registered delivery services.

## Project Structure

- `web-ui/` - React + TypeScript web application for the user interface

## Getting Started

You can run the Business Wallet using either Docker (recommended) or directly with Node.js.

### Option 1: Docker Setup (Recommended)

#### Prerequisites

- Docker (v20.10 or higher)
- Docker Compose (v2.0 or higher)

#### Quick Start

1. Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/FindyFi/BusinessWallet.git
cd BusinessWallet
```

2. Start all services with a single command:

**For Production:**
```bash
docker compose up -d
```

**For Development (with hot-reload):**
```bash
docker compose -f docker-compose.dev.yml up
```

3. Access the application:
   - Web UI: `http://localhost:3000` (production) or `http://localhost:5173` (development)
   - PostgreSQL: `localhost:5432` (for future backend integration)

4. Stop the services:

```bash
docker compose down
```

To stop and remove volumes (database data):
```bash
docker compose down -v
```

#### Environment Variables

Copy `.env.example` to `.env` and customize as needed:

```bash
cp .env.example .env
```

### Option 2: Manual Setup (Without Docker)

#### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

#### Installation and Running

1. Navigate to the web UI directory:

```bash
cd web-ui
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

For more detailed information about the web UI, see the [web-ui/README.md](web-ui/README.md).

## Documentation

- [Architecture](architecture.md) - System architecture and design decisions
- [Requirements](requirements.md) - Detailed requirements and specifications
- [Contributing](CONTRIBUTING.md) - Guidelines for contributing to the project

## License

See [LICENSE](LICENSE) for details.

