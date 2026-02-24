# Business Wallet Backend API

REST API backend for the Business Wallet application, built with Node.js, TypeScript, Express, and [Credo](https://github.com/openwallet-foundation/credo-ts) for verifiable credential operations.

## Technology Stack

- **Runtime:** Node.js (v20+)
- **Language:** TypeScript
- **Framework:** Express.js v5
- **VC Framework:** [Credo](https://github.com/openwallet-foundation/credo-ts) (AC-0013) — core SSI/VC library
- **Key Management:** Aries Askar (via `@hyperledger/aries-askar-nodejs`)
- **Database:** PostgreSQL (production) / SQLite (development default)
- **API Standard:** OpenAPI 3.0+ (`openapi.yaml`)

## Project Structure

```
backend/
├── src/
│   ├── index.ts                        # Main application entry point
│   ├── agent/
│   │   └── credoAgent.ts               # Credo agent initialisation & lifecycle
│   ├── routes/
│   │   └── credentials.ts              # Credential API route handlers
│   ├── services/
│   │   └── employeeCredentialService.ts # SD-JWT VC issuance logic
│   └── types/
│       └── credentials.ts              # TypeScript types & interfaces
├── dist/                               # Compiled JavaScript output (generated)
├── Dockerfile                          # Production multi-stage Docker image
├── Dockerfile.dev                      # Development Docker image
├── openapi.yaml                        # OpenAPI 3.0 specification
├── package.json                        # Project dependencies and scripts
├── tsconfig.json                       # TypeScript configuration
└── README.md                           # This file
```

## Available Scripts

### `npm run dev`
Runs the API server in development mode with hot-reloading via `nodemon`.
The server restarts automatically on source changes.

### `npm run build`
Compiles TypeScript to JavaScript in the `dist/` directory.

### `npm start`
Runs the compiled JavaScript from the `dist/` directory.
Use in production after running `npm run build`.

### `npm run lint`
Type-checks the TypeScript code without emitting files.

## Getting Started

### Prerequisites

- Node.js v20 or higher (required for prebuilt Askar native binaries)
- npm v9 or higher

### Installation

```bash
cd backend
npm install
```

### Configuration

Copy the root `.env.example` to `.env` and set the required variables:

```bash
cp ../.env.example ../.env
```

| Variable | Required | Default | Description |
|---|---|---|---|
| `WALLET_KEY` | **Yes** | — | Master key to encrypt the Askar wallet. Generate with `openssl rand -hex 32`. |
| `WALLET_ID` | No | `business-wallet` | Identifier for the Askar wallet/database. |
| `DB_TYPE` | No | `sqlite` | Storage backend: `sqlite` or `postgres`. |
| `DB_HOST` | No | `localhost:5432` | PostgreSQL host (when `DB_TYPE=postgres`). |
| `DB_USER` | No | `businesswallet` | PostgreSQL username. |
| `DB_PASSWORD` | No | — | PostgreSQL password. |
| `EMPLOYEE_VCT_URI` | No | `https://businesswallet.example.com/credentials/types/employee/v1` | URI for employee credential VC Type Metadata. |
| `PORT` | No | `3000` | HTTP server port. |

### Running the Development Server

```bash
WALLET_KEY=my-dev-key npm run dev
```

The API will be available at `http://localhost:3000`.

## API Endpoints

### `GET /health`

Returns the health status of the API server.

**Response:** `200 OK`

```json
{
  "status": "ok",
  "timestamp": "2026-02-11T15:30:00.000Z",
  "service": "business-wallet-api",
  "version": "0.1.0"
}
```

### `POST /credentials/employee`

Issues an SD-JWT VC employee credential (FR-0011).

All claims are selectively disclosable (FR-0008, FR-0010).

**Request body:**

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "jobTitle": "Software Engineer",
  "startDate": "2024-01-15",
  "endDate": "2025-12-31"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `firstName` | string | Yes | Employee's given name |
| `lastName` | string | Yes | Employee's family name |
| `jobTitle` | string | Yes | Job title or position |
| `startDate` | string (ISO 8601) | Yes | Employment start date (YYYY-MM-DD) |
| `endDate` | string (ISO 8601) | No | Employment end date (YYYY-MM-DD) |

**Response:** `201 Created`

```json
{
  "credential": "eyJhbGciOiJFUzI1NiIsInR5cCI6InZjK3NkLWp3dCJ9...",
  "format": "vc+sd-jwt"
}
```

### `GET /.well-known/vct/employee`

Returns the SD-JWT VC Type Metadata document for the employee credential type (TR-0009).

## Credo Integration (AC-0013)

Business Wallet uses [Credo](https://github.com/openwallet-foundation/credo-ts) as its core SSI/VC framework, aligned with architectural choice AC-0013.

### Key components

| Component | Description |
|---|---|
| `@credo-ts/core` | Core agent, SD-JWT VC module, DID management |
| `@credo-ts/node` | Node.js-specific agent dependencies |
| `@credo-ts/askar` | Aries Askar wallet & key management module |
| `@hyperledger/aries-askar-nodejs` | Native Askar bindings for Node.js |

### Agent lifecycle

1. On server startup, `initializeCredoAgent()` initialises the Credo agent with the Askar wallet.
2. A `did:key` issuer DID (P-256 / ES256) is created on first run and persisted in the Askar wallet.
3. The issuer DID is reused on subsequent restarts.
4. On server shutdown, `shutdownCredoAgent()` closes the wallet gracefully.

### SD-JWT VC issuance

Credentials are signed using `agent.sdJwtVc.sign()` with the issuer's `did:key`. All claims are placed in the SD-JWT disclosure frame, enabling selective disclosure per FR-0008 and FR-0010.


## Building for Production

1. Build the TypeScript code:

```bash
npm run build
```

2. Start the production server (ensure `WALLET_KEY` and DB vars are set):

```bash
NODE_ENV=production WALLET_KEY=<key> DB_TYPE=postgres node dist/index.js
```

## TypeScript Configuration

The project uses strict TypeScript settings:

- Strict type checking enabled
- No implicit `any`
- Strict null checks
- Unused locals/parameters detection

All code must pass type checking before deployment (`npm run lint`).
