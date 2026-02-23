# Business Wallet Backend API

REST API backend for the Business Wallet application, built with Node.js, TypeScript, and Express.

## Technology Stack

- **Runtime:** Node.js (v18+)
- **Language:** TypeScript
- **Framework:** Express.js
- **API Standard:** RESTful API (OpenAPI 3.0+ ready)

## Project Structure

```
backend/
├── src/
│   └── index.ts          # Main application entry point
├── dist/                 # Compiled JavaScript output (generated)
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

Or open in your browser:
```
http://localhost:3000/health
```

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

Issues an SD-JWT VC employee credential. All claims are wrapped as selective
disclosures (FR-0008). Returns the credential in compact SD-JWT serialisation
(`<jwt>~<disclosure1>~…~<disclosureN>~`).

**Request body (required fields: `firstName`, `lastName`, `jobTitle`, `startDate`; optional: `endDate`):**

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "jobTitle": "Software Engineer",
  "startDate": "2024-01-15"
}
```

**Response:** `201 Created`

```json
{
  "credential": "eyJ...~eyJ...~eyJ...~eyJ...~eyJ...~",
  "format": "vc+sd-jwt"
}
```

### POST /credentials/employee/verify

Verifies an SD-JWT VC employee credential and returns the selectively disclosed
claims. The presenter may include any subset of the disclosures to achieve
selective disclosure (FR-0008).

**Request body:**

```json
{ "credential": "eyJ...~eyJ...~" }
```

**Response:** `200 OK`

```json
{
  "valid": true,
  "vct": "https://businesswallet.example.com/credentials/types/employee/v1",
  "iss": "https://businesswallet.example.com",
  "iat": 1705286400,
  "disclosedClaims": { "firstName": "Jane", "jobTitle": "Software Engineer" }
}
```

### GET /.well-known/vct/employee

Returns the SD-JWT VC Type Metadata document for the employee credential type
(TR-0009).

### GET /.well-known/jwks.json

Returns the issuer's JSON Web Key Set (JWKS) for signature verification (TR-0007).

## Configuration

The following environment variables can be used to configure the server:

- `PORT` - Server port (default: `3000`)
- `ISSUER_URI` - Issuer URI embedded in issued credentials (default: `https://businesswallet.example.com`)
- `ISSUER_PRIVATE_KEY_PEM` - PEM-encoded EC P-256 private key for signing credentials.
  When unset an ephemeral key is generated at startup (development / test only).
- `EMPLOYEE_VCT_URI` - URI for the employee credential type (default: `https://businesswallet.example.com/credentials/types/employee/v1`)

Create a `.env` file in the backend directory for local configuration:
```
PORT=3000
ISSUER_URI=https://businesswallet.example.com
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

This is a minimal scaffold ready for extension with additional endpoints. The structure is designed to support:

- **API versioning** (e.g., `/api/v1/`)
- **Modular routing** (separate route files)
- **Middleware** (authentication, authorization, logging)
- **Database integration** (PostgreSQL)
- **OpenAPI specification** (automatic documentation)
- **Multi-tenancy support**

See the [architecture documentation](../architecture.md) for design principles and guidelines.

## TypeScript Configuration

The project uses strict TypeScript settings:
- Strict type checking enabled
- No implicit `any`
- Strict null checks
- Unused locals/parameters detection

All code must pass type checking before deployment.
