# Copilot Instructions for Business Wallet

## Project Overview

Business Wallet is a digital wallet system for organizations that enables them to issue, store, share, and request verifiable credentials and documents. It serves as a versatile communication tool supporting W3C Verifiable Credentials, OpenID4VC protocols, and registered delivery services.

**Key Capabilities:**
- Issue digital credentials to subjects (individuals, organizations, entities)
- Store credentials and documents securely with multi-tenant data isolation
- Share verified credentials with third parties using selective disclosure
- Request credentials from others
- Transmit and receive electronic documents through registered delivery services

## Technology Stack

- **Language:** TypeScript (primary language for frontend and backend)
- **Runtime:** Node.js (backend runtime environment)
- **Frontend:** React (web-based user interface)
- **Database:** PostgreSQL (primary database with ACID compliance)
- **Deployment:** Docker containers orchestrated with Kubernetes
- **API Specification:** OpenAPI 3.0+ (REST APIs)
- **Authentication:** OAuth 2.0 with OpenID Connect (OIDC)
- **Authorization:** Cerbos (policy-based access control)
- **Standards:** W3C Verifiable Credentials Data Model 2.0, OpenID4VC, eIDAS, GDPR

## Architecture Principles

### Modular Monolith
- Start as a modular monolith with clear bounded contexts
- Design module boundaries to allow future extraction into microservices
- Each module must have well-defined public interfaces
- Modules must not share database tables

### API-First Development
- Write OpenAPI specifications FIRST before implementation
- All functionality must be exposed through REST APIs
- Enable integration with ERP, CRM, and other core business systems
- Support both synchronous and asynchronous operations

### Security and Privacy
- Implement defense in depth (network, authentication, authorization, encryption, audit logging)
- Build GDPR compliance from the start (privacy by design)
- Use TLS for all communications
- Encrypt data at rest and in transit
- Maintain comprehensive audit logs for all significant actions
- Support selective disclosure to minimize data exposure

### Standards Compliance
- Prefer established standards over proprietary solutions
- Follow W3C Verifiable Credentials Data Model 2.0
- Implement OpenID4VC protocols (OID4VCI for issuance, OID4VP for presentation)
- Support both SD-JWT VC and W3C VC DM credential formats
- Ensure interoperability with EU Digital Identity Wallets

## Coding Standards

### TypeScript Best Practices
- Use strict TypeScript configuration with no implicit `any`
- Provide explicit types for all function parameters and return values
- Use interfaces for object shapes and type aliases for unions/intersections
- Prefer `const` over `let`, avoid `var` entirely
- Use async/await over raw promises for asynchronous code
- Enable all strict type checking options

### Code Organization
- Follow separation of concerns: presentation layer, application layer, domain layer, infrastructure layer
- Each layer depends only on abstractions, not concrete implementations
- Use dependency injection for all dependencies
- Keep business logic independent of frameworks and external dependencies

### Naming Conventions
- Use PascalCase for classes, interfaces, types, and React components
- Use camelCase for variables, functions, and methods
- Use UPPER_SNAKE_CASE for constants
- Use descriptive names that clearly indicate purpose
- Do not prefix interfaces (TypeScript allows interfaces and classes to coexist with the same name)

### Error Handling
- Use structured error types with clear error codes
- Provide meaningful error messages for debugging
- Log errors with appropriate context (tenant ID, user ID, operation)
- Never expose sensitive information in error messages to clients

### Testing
- Write unit tests for business logic
- Write integration tests for API endpoints
- Mock external dependencies in tests
- Use test data builders for creating test fixtures
- Ensure tests are deterministic and isolated

## Multi-Tenancy

- System supports both on-premises and multi-tenant SaaS deployments
- Use configuration-driven deployment mode (no code changes required)
- Enforce tenant data isolation at database level (row-level security) and application level (middleware)
- Each tenant has a unique identifier included in all data operations
- Never mix tenant data or allow cross-tenant access

## Accessibility

- Web UI must conform to WCAG 2.1 Level AA standards
- Consider accessibility from the design phase
- Use semantic HTML elements
- Provide appropriate ARIA labels
- Ensure keyboard navigation works for all interactive elements
- Test with screen readers and assistive technologies

## Development Workflow

### Before Starting Work
- Review existing architecture documentation (`architecture.md`, `requirements.md`)
- Check OpenAPI specifications for API contracts
- Understand module boundaries and dependencies

### When Adding New Features
- Update OpenAPI specification first
- Implement domain logic before infrastructure
- Add comprehensive tests
- Update documentation if public interfaces change
- Use feature flags for gradual rollout

### When Making Changes
- Make minimal, surgical changes
- Preserve backward compatibility for APIs (use semantic versioning)
- Update audit logging for security-relevant changes
- Consider privacy implications (GDPR compliance)
- Test with multiple tenants to ensure data isolation

## API Development

- All APIs must follow REST principles
- Use proper HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Use appropriate HTTP status codes
- Version APIs in the URL path (e.g., `/api/v1/`)
- Follow semantic versioning for breaking changes
- Provide pagination for list endpoints
- Implement rate limiting for public APIs
- Return consistent error response format

## Credential Handling

- Support W3C Verifiable Credentials Data Model 2.0
- Implement both SD-JWT VC and JSON-LD with Data Integrity proofs
- Enable selective disclosure when presenting credentials
- Validate credentials using cryptographic proof verification
- Support credential revocation with verifiable status
- Be agnostic to credential types (support custom schemas)
- Ensure credential operations are auditable

## Documentation

- Keep architecture.md and requirements.md up to date
- Document all public APIs in OpenAPI specification
- Write clear README files for each module
- Include code comments only when they explain "why", not "what"
- Document configuration options and environment variables
- Maintain changelog for API versions

## Performance and Scalability

- Design for horizontal scaling
- Use event-driven architecture for asynchronous operations
- Implement caching where appropriate (but ensure tenant isolation)
- Use connection pooling for database access
- Monitor and optimize database queries
- Implement circuit breakers for external service calls

## Observability

- Use structured logging (JSON format)
- Include correlation IDs in all log entries
- Implement distributed tracing (OpenTelemetry)
- Provide health check endpoints
- Collect metrics for monitoring
- Set up alerts for error rates and performance issues
