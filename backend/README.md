# Business Wallet Backend

Backend API for the Business Wallet system, implementing core credential issuance and storage functionality.

## Overview

This backend provides REST APIs for:
- Issuing verifiable credentials
- Storing credentials securely
- Retrieving credentials by ID or holder

The current implementation uses in-memory storage with mocked cryptographic signing. This provides a foundation for future integration with PostgreSQL and the Credo framework for W3C Verifiable Credentials.

## Architecture

The backend follows a modular monolith architecture with clear separation of concerns:

- **`src/api/`** - REST API endpoints and routing
- **`src/domain/`** - Business logic for credential operations
- **`src/infrastructure/`** - Data persistence (currently in-memory)
- **`src/types/`** - TypeScript type definitions

## Prerequisites

- Node.js v18 or higher
- npm v9 or higher

## Installation

```bash
cd backend
npm install
```

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Health Check

```
GET /health
```

Returns server health status.

### Issue Credential

```
POST /api/v1/credentials
Content-Type: application/json

{
  "issuer": "did:example:issuer123",
  "credentialSubject": {
    "id": "did:example:holder456",
    "name": "Alice Smith",
    "email": "alice@example.com"
  },
  "expirationDate": "2025-12-31T23:59:59Z"
}
```

**Response (201 Created):**

```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1"
  ],
  "id": "urn:uuid:12345678-1234-5678-1234-567812345678",
  "type": ["VerifiableCredential"],
  "issuer": "did:example:issuer123",
  "issuanceDate": "2026-02-11T15:20:00.000Z",
  "expirationDate": "2025-12-31T23:59:59Z",
  "credentialSubject": {
    "id": "did:example:holder456",
    "name": "Alice Smith",
    "email": "alice@example.com"
  },
  "proof": {
    "type": "DataIntegrityProof",
    "created": "2026-02-11T15:20:00.000Z",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:example:issuer123#key-1",
    "proofValue": "bW9jay1zaWduYXR1cmUtLi4u"
  }
}
```

### Get Credential by ID

```
GET /api/v1/credentials/:id
```

**Response (200 OK):** Returns the credential object

**Response (404 Not Found):** If credential doesn't exist

### Get All Credentials

```
GET /api/v1/credentials
```

Optionally filter by holder:

```
GET /api/v1/credentials?holderId=did:example:holder456
```

**Response (200 OK):** Returns array of credentials

## Testing

### Run Tests

```bash
npm test
```

### Run Tests Once (CI mode)

```bash
npm run test:once
```

The test suite includes:
- Unit tests for credential issuance logic
- Tests for credential storage and retrieval
- Validation of credential structure and proof generation

## Linting and Formatting

### Run Linter

```bash
npm run lint
```

### Format Code

```bash
npm run format
```

## Current Implementation Notes

### Credential Signing (Mocked)

The current implementation uses **mocked cryptographic signing**. The proof generated is a base64-encoded placeholder and should **not be used in production**.

**Future work:**
- Integrate with Credo framework for real cryptographic signing
- Support multiple DID methods (did:web, did:key)
- Implement key management and rotation

### Storage (In-Memory)

Credentials are currently stored in-memory using a `Map` structure. This data is **lost when the server restarts**.

**Future work:**
- Migrate to PostgreSQL with proper schema
- Implement multi-tenant data isolation (row-level security)
- Add credential indexing and search capabilities
- Implement audit logging

### Authentication and Authorization

The API currently has **no authentication or authorization**. All endpoints are publicly accessible.

**Future work:**
- Implement OAuth2 with OpenID Connect
- Add role-based access control (RBAC)
- Integrate with Cerbos for policy-based authorization
- Add tenant isolation middleware

## Development Workflow

1. Make changes to the code
2. Run tests: `npm test`
3. Run linter: `npm run lint`
4. Format code: `npm run format`
5. Test the API manually or with integration tests

## Next Steps

Based on the architecture documents, the following enhancements are planned:

1. **Database Integration** - Migrate from in-memory to PostgreSQL
2. **Real Credential Signing** - Integrate Credo framework for W3C VC support
3. **Authentication** - Implement OAuth2/OIDC authentication
4. **Authorization** - Add RBAC with Cerbos policy engine
5. **Multi-Tenancy** - Implement tenant isolation
6. **API Specification** - Create OpenAPI 3.0+ specification
7. **Credential Revocation** - Add support for credential status
8. **Selective Disclosure** - Support SD-JWT VC format

## License

See [LICENSE](../LICENSE) for details.
# Backend implementation based on PR #15
