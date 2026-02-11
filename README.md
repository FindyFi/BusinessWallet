# BusinessWallet

A Digital Wallet for organizations

## Overview

Business Wallet is a digital wallet system for organizations that enables them to issue, store, share, and request verifiable credentials and documents. It serves as a versatile communication tool supporting W3C Verifiable Credentials, OpenID4VC protocols, and registered delivery services.

## Project Structure

- `backend/` - Node.js + TypeScript REST API server
- `web-ui/` - React + TypeScript web application for the user interface

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation and Running

#### Backend API

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

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
- [Contributing](CONTRIBUTING.md) - Guidelines for contributing to the project

## License

See [LICENSE](LICENSE) for details.

