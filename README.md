# BusinessWallet

A Digital Wallet for organizations

## Overview

Business Wallet is a digital wallet system for organizations that enables them to issue, store, share, and request verifiable credentials and documents. It serves as a versatile communication tool supporting W3C Verifiable Credentials, OpenID4VC protocols, and registered delivery services.

The backend is built on [Credo](https://github.com/openwallet-foundation/credo-ts) (AC-0013), an open-source TypeScript framework by the OpenWallet Foundation, which provides SD-JWT VC issuance, DID management, and key management via Aries Askar.

## Project Structure

```
BusinessWallet/
├── backend/          - Node.js + TypeScript REST API (Credo-based VC operations)
├── web-ui/           - React + TypeScript web application
├── architecture.md   - System architecture and design decisions
├── requirements.md   - Requirements specification
├── docker-compose.yml     - Production Docker Compose
└── docker-compose.dev.yml - Development Docker Compose
```

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

2. Copy the environment file and configure secrets:

```bash
cp .env.example .env
# Edit .env and set WALLET_KEY to a strong random value:
#   openssl rand -hex 32
```

3. Start all services with a single command:

**For Production:**
```bash
docker compose up -d
```

**For Development (with hot-reload):**
```bash
docker compose -f docker-compose.dev.yml up
```

4. Access the application:
   - Web UI: `http://localhost:3000` (production) or `http://localhost:5173` (development)
   - Backend API: `http://localhost:3001` (both modes)
   - PostgreSQL: `localhost:5432`

5. Test the backend:

```bash
# Health check
curl http://localhost:3001/health

# Issue an employee credential
curl -X POST http://localhost:3001/credentials/employee \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Jane","lastName":"Doe","jobTitle":"Engineer","startDate":"2024-01-15"}'

# Get VC Type Metadata
curl http://localhost:3001/.well-known/vct/employee
```

6. Stop the services:

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

| Variable | Required | Default | Description |
|---|---|---|---|
| `WALLET_KEY` | **Yes** | — | Master key for the Askar wallet. Use `openssl rand -hex 32`. |
| `WALLET_ID` | No | `business-wallet` | Wallet store identifier. |
| `DB_PASSWORD` | No | `changeme` | PostgreSQL password. |
| `EMPLOYEE_VCT_URI` | No | Example URI | URI for employee credential type metadata. |

### Option 2: Manual Setup (Without Docker)

#### Prerequisites

- Node.js (v20 or higher) — required for prebuilt Askar native binaries
- npm (v9 or higher)
- PostgreSQL (optional; SQLite is used by default)

#### Backend API

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Set required environment variables:

```bash
export WALLET_KEY=$(openssl rand -hex 32)
```

4. Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

Test the health endpoint:
```bash
curl http://localhost:3000/health
```

For more detailed information about the backend API, see the [backend/README.md](backend/README.md).

#### Web UI

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
- [Backend README](backend/README.md) - Backend API, Credo integration, and configuration
- [Contributing](CONTRIBUTING.md) - Guidelines for contributing to the project

## License

See [LICENSE](LICENSE) for details.
