# Business Wallet Backend API

REST API backend for the Business Wallet application, built with Node.js, TypeScript, and Express.

## Technology Stack

- **Runtime:** Node.js (v18+)
- **Language:** TypeScript
- **Framework:** Express.js
- **SSI/VC Foundation:** [Credo (credo-ts)](https://github.com/openwallet-foundation/credo-ts)
- **API Standard:** RESTful API (OpenAPI 3.0+ ready)

## Project Structure

```
backend/
├── src/
│   ├── index.ts                            # Main application entry point
│   ├── agent/
│   │   └── CredoAgent.ts                  # Credo agent lifecycle and credential issuance
│   ├── routes/
│   │   └── credentials.ts                 # Credential API routes
│   ├── services/
│   │   └── employeeCredentialService.ts   # Employee VC type metadata
│   ├── storage/
│   │   └── InMemoryStorageService.ts      # In-memory Credo StorageService
│   └── types/
│       └── credentials.ts                 # TypeScript types for credentials
├── dist/                 # Compiled JavaScript output (generated)
├── openapi.yaml          # OpenAPI 3.0 specification
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## Available Scripts

### `npm run dev`
Runs the API server in development mode with hot-reloading.
The server will restart automatically when you make changes to the source code.

### `npm run build`
Compiles TypeScript to JavaScript in the `dist/` directory.
Run this before deploying to production.

### `npm start`
Runs the compiled JavaScript from the `dist/` directory.
Use this in production after running `npm run build`.

### `npm run lint`
Type-checks the TypeScript code without emitting files.
Use this to verify code correctness.

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

### Running the Development Server

Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Testing the API

#### Health Check Endpoint

Test the health endpoint using curl:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-11T15:30:00.000Z",
  "service": "business-wallet-api",
  "version": "0.1.0"
}
```

#### Issue an Employee Credential

```bash
curl -X POST http://localhost:3000/credentials/employee \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "jobTitle": "Software Engineer",
    "startDate": "2024-01-15"
  }'
```

Returns a compact SD-JWT VC (`vc+sd-jwt`) signed with ES256.  All claims are selectively disclosable.

#### Employee VC Type Metadata

```bash
curl http://localhost:3000/.well-known/vct/employee
```

Returns the SD-JWT VC Type Metadata document as defined in draft-ietf-oauth-sd-jwt-vc.

## API Endpoints

### GET /health

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

### POST /credentials/employee

Issues a cryptographically-signed SD-JWT VC employee credential.

**Request body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `firstName` | string | ✅ | Employee's first name |
| `lastName` | string | ✅ | Employee's last name |
| `jobTitle` | string | ✅ | Job title |
| `startDate` | string (YYYY-MM-DD) | ✅ | Employment start date |
| `endDate` | string (YYYY-MM-DD) | ❌ | Employment end date (if known) |

**Response:** `201 Created` — compact SD-JWT VC string.

### GET /.well-known/vct/employee

Returns the SD-JWT VC Type Metadata document for the Employee credential type.

## Credo Architecture

The credential subsystem is built on [Credo (credo-ts)](https://github.com/openwallet-foundation/credo-ts):

- **Key management** — `NodeKeyManagementService` from `@credo-ts/node` manages P-256 signing keys using Node.js Web Crypto API.
- **DID management** — A `did:jwk` DID is created at startup and used as the credential issuer.
- **SD-JWT VC signing** — `agent.sdJwtVc.sign()` issues standards-compliant credentials with selective disclosure.
- **Storage** — `InMemoryStorageService` provides a lightweight Credo-compatible `StorageService` (replace with Askar or DrizzleStorageModule for production persistence).

The Credo agent is initialised once during application startup (`initCredoAgent()`) and reused for all subsequent issuance requests.

## Configuration

The following environment variables can be used to configure the server:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Set to `production` to enforce HTTPS-only VCT metadata URLs (default: allows http in development)
- `EMPLOYEE_VCT_URI` - Override the employee credential type URI (default: `https://businesswallet.example.com/credentials/types/employee/v1`)

Create a `.env` file in the backend directory for local configuration:
```
PORT=3000
```

## Building for Production

1. Build the TypeScript code:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Future Extension

The structure is designed to support:

- **API versioning** (e.g., `/api/v1/`)
- **Modular routing** (separate route files)
- **Authentication middleware** (OAuth 2.0 / OIDC)
- **Persistent storage** (replace `InMemoryStorageService` with Askar or DrizzleStorageModule + PostgreSQL)
- **OpenAPI validation** (automatic request/response validation)
- **Multi-tenancy support**

See the [architecture documentation](../architecture.md) for design principles and guidelines.

## TypeScript Configuration

The project uses strict TypeScript settings:
- Strict type checking enabled
- No implicit `any`
- Strict null checks
- Unused locals/parameters detection

All code must pass type checking before deployment.
