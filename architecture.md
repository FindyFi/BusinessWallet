# Business Wallet Architecture

**Version:** 0.1.0  
**Last Updated:** 2026-02-07  
**Status:** Draft

## Document Overview

The Business Wallet is a versatile communication tool designed for organizations. It enables users to issue, store, share, and request digital credentials, as well as transmit and receive electronic documents through registered delivery services. This document outlines the architectural choices and guidelines that will govern the design, development, and evolution of the Business Wallet system.

The architecture prioritizes modularity, maintainability, and adaptability to change, while ensuring compliance with relevant standards (W3C VC Data Model, OpenID4VC, eIDAS, GDPR) and supporting both on-premises and multi-tenant SaaS deployment modes.

## Architectural Choices

### AC-0001: TypeScript as Primary Programming Language

**Description:**  
TypeScript shall be the primary programming language for the Business Wallet system, used for both frontend and backend development. TypeScript provides static type checking, enhanced IDE support, and improved code maintainability compared to plain JavaScript. It has a mature ecosystem with extensive libraries for web development, cryptographic operations, and credential handling (e.g., W3C VC libraries). The unified language across the stack reduces context-switching for developers and enables code sharing between frontend and backend components.

*Alternatives considered:* Java/Kotlin (heavier runtime, less suitable for web UI), Python (less type safety), Go (excellent for backend but separate frontend language needed).

---

### AC-0002: Node.js Runtime Environment

**Description:**  
Node.js shall serve as the backend runtime environment. It provides excellent performance for I/O-bound operations (credential verification, API calls, document transmission), has a vast ecosystem of packages, and supports modern JavaScript/TypeScript features. Node.js is well-suited for building RESTful APIs and integrates seamlessly with cloud platforms and container orchestration systems.

*Alternatives considered:* Deno (newer, smaller ecosystem), Bun (less mature).

---

### AC-0003: React for Web User Interface

**Description:**  
React shall be used as the frontend framework for the web-based user interface (FR-0001). React's component-based architecture supports modular UI development, has excellent TypeScript support, and offers a large ecosystem of accessible UI component libraries. Server-side rendering (SSR) capabilities can improve initial load times and SEO if needed.

*Alternatives considered:* Vue.js (smaller ecosystem), Angular (steeper learning curve, more opinionated).

---

### AC-0004: PostgreSQL as Primary Database

**Description:**  
PostgreSQL shall be the primary relational database for storing tenant data, user accounts, credentials, documents, and audit logs. PostgreSQL provides robust ACID compliance, excellent support for JSON data types (useful for credential storage), strong security features, and proven scalability. Row-level security policies can support multi-tenant data isolation (TR-0002).

*Alternatives considered:* MySQL/MariaDB (less advanced JSON support), MongoDB (document store less suitable for complex relational queries and RBAC).

---

### AC-0005: Container-Based Deployment with Docker and Kubernetes

**Description:**  
The system shall be containerized using Docker and orchestrated with Kubernetes. This enables consistent deployments across on-premises and cloud environments (TR-0001), supports horizontal scaling, provides health monitoring and self-healing capabilities, and simplifies multi-tenant resource management. Helm charts shall be provided for Kubernetes deployments.

*Alternatives considered:* Virtual machines (less portable, higher overhead), serverless (vendor lock-in concerns, less suitable for on-premises).

---

### AC-0006: OpenAPI 3.0+ for API Specification

**Description:**  
All REST APIs shall be specified using OpenAPI 3.0+ specification (TR-0003). OpenAPI provides machine-readable API documentation, enables automatic client SDK generation, supports validation of request/response payloads, and integrates with API gateway solutions. The specification shall be the source of truth for API contracts.

*Alternatives considered:* GraphQL (more complex for simple CRUD operations, less standardized tooling for enterprise integrations).

---

### AC-0007: OAuth 2.0 with OpenID Connect for Authentication

**Description:**  
API authentication shall use OAuth 2.0 with OpenID Connect (OIDC) as specified in TR-0004. This provides industry-standard token-based authentication, supports single sign-on (SSO) scenarios, enables scope-based permission delegation aligned with the RBAC model, and allows integration with enterprise identity providers. The system shall support both acting as an OAuth provider and integrating with external providers.

*Alternatives considered:* API keys only (less secure, no delegation), SAML (older, more complex).

---

### AC-0008: Cerbos for Policy-Based Access Control

**Description:**  
Authorization decisions shall be externalized to a policy engine. Cerbos is recommended as an open-source policy decision point (PDP) that supports the hybrid RBAC/ABAC model (TR-0005). Policies are defined declaratively in YAML, enabling clear audit trails and policy versioning. This separation allows access control logic to evolve independently of application code.

*Alternatives considered:* OPA/Rego (more complex policy language), built-in authorization (less flexible, harder to audit).

---

### AC-0009: W3C Verifiable Credentials Data Model 2.0

**Description:**  
All credentials issued, stored, and verified by the Business Wallet shall conform to the W3C Verifiable Credentials Data Model 2.0. This ensures interoperability with other credential ecosystems, compliance with emerging EU regulations (eIDAS 2.0), and compatibility with OpenID4VC protocols. JSON-LD with Data Integrity proofs shall be the primary credential format.

*Alternatives considered:* SD-JWT VC (shall also be supported for selective disclosure scenarios), mDoc (focused on mobile, less relevant for business contexts).

---

### AC-0010: OpenID for Verifiable Credentials (OpenID4VC) Protocols

**Description:**  
Credential issuance and presentation shall follow OpenID4VC protocols (OID4VCI for issuance, OID4VP for presentation). These protocols are becoming the industry standard for credential exchange, provide strong security guarantees, and ensure interoperability with EU Digital Identity Wallets and other compliant systems.

*Alternatives considered:* DIDComm (less standardized for enterprise use), custom protocols (interoperability issues).

---

### AC-0011: Multi-Tenant Architecture with Logical Isolation

**Description:**  
The system shall implement multi-tenancy using logical isolation within a shared infrastructure. Each tenant shall have a unique identifier (tenant ID) that is enforced at the database level using row-level security and at the application level through middleware. This approach balances resource efficiency with security requirements (TR-0002).

*Alternatives considered:* Physical isolation (separate databases per tenant - higher cost, operational complexity), schema-per-tenant (migration complexity).

---

### AC-0012: Event-Driven Architecture for Asynchronous Operations

**Description:**  
Asynchronous operations (batch credential issuance, document delivery notifications, audit logging) shall be handled through an event-driven architecture. A message queue (such as Redis Streams or RabbitMQ) shall decouple producers from consumers, enabling reliable processing, retry mechanisms, and horizontal scaling of workers.

*Alternatives considered:* Synchronous processing only (scalability limits), webhooks only (reliability concerns).

---

## Architectural Guidelines

### AG-0001: Modular Monolith as Initial Architecture

**Description:**  
The system shall begin as a modular monolith with clear bounded contexts, rather than microservices. This approach reduces initial complexity, simplifies deployment, and enables faster iteration during early development. Module boundaries shall be designed to allow future extraction into microservices if scaling requirements demand it. Each module shall have a well-defined public interface and shall not share database tables with other modules.

---

### AG-0002: Configuration-Driven Deployment Mode

**Description:**  
The difference between on-premises and SaaS deployments shall be entirely configuration-driven (TR-0001). Feature flags and environment variables shall control tenant provisioning behavior, authentication providers, and resource limits. No code changes shall be required to switch deployment modes. All configuration options shall be documented and have sensible defaults.

---

### AG-0003: API-First Development

**Description:**  
All functionality shall be exposed through APIs before building user interfaces. OpenAPI specifications shall be written first, reviewed, and approved before implementation begins. This ensures the system remains integration-friendly, enables parallel frontend/backend development, and produces consistent, well-documented APIs.

---

### AG-0004: Defense in Depth for Security

**Description:**  
Security shall be implemented in multiple layers: network security (TLS, firewalls), authentication (OAuth2/OIDC), authorization (policy engine), input validation, encryption at rest and in transit, and comprehensive audit logging. No single security control shall be the only line of defense. Security requirements shall be treated as first-class functional requirements.

---

### AG-0005: Privacy by Design

**Description:**  
GDPR compliance shall be built into the architecture from the start, not added later. This includes: data minimization (collect only necessary data), purpose limitation (use data only for stated purposes), storage limitation (configurable retention policies), data subject rights (export, deletion), and privacy impact assessments for new features. Credential verification shall use selective disclosure where possible.

---

### AG-0006: Separation of Concerns

**Description:**  
Clear separation shall be maintained between: presentation layer (UI), application layer (business logic), domain layer (core entities and rules), and infrastructure layer (databases, external services). Each layer shall depend only on abstractions, not concrete implementations. This enables testing in isolation, technology replacement, and easier comprehension.

---

### AG-0007: Explicit Dependencies and Inversion of Control

**Description:**  
All dependencies shall be explicitly declared and injected (dependency injection). Modules shall depend on interfaces, not concrete implementations. This improves testability, enables mocking for unit tests, and allows swapping implementations without changing consuming code. A lightweight dependency injection container shall be used.

---

### AG-0008: Comprehensive Audit Logging

**Description:**  
All significant actions (credential operations, access control changes, authentication events, document transmissions) shall generate audit log entries. Audit logs shall be immutable, timestamped, include actor identity and tenant context, and be stored separately from operational data. Log retention shall be configurable to meet regulatory requirements.

---

### AG-0009: Graceful Degradation and Resilience

**Description:**  
The system shall be designed to degrade gracefully when external dependencies (identity providers, delivery services) are unavailable. Circuit breakers shall protect against cascade failures. Retry logic with exponential backoff shall handle transient failures. Users shall receive meaningful feedback when functionality is limited.

---

### AG-0010: Iterative and Incremental Development

**Description:**  
Features shall be delivered incrementally, with working software at each iteration. Avoid large, monolithic feature releases. Use feature flags to enable gradual rollout and A/B testing. Prefer simple solutions that can be enhanced over complex solutions that anticipate future needs ("YAGNI" principle).

---

### AG-0011: Semantic Versioning for APIs

**Description:**  
All APIs shall follow semantic versioning (MAJOR.MINOR.PATCH). Breaking changes require a major version increment and shall maintain backward compatibility with the previous major version for a documented deprecation period. API versioning shall be implemented in the URL path (e.g., `/api/v1/`).

---

### AG-0012: Standards Compliance and Interoperability

**Description:**  
Prefer established standards over proprietary solutions. Credential formats shall follow W3C specifications. API authentication shall follow OAuth2/OIDC standards. Document delivery shall support registered delivery services per eIDAS. Interoperability testing with reference implementations shall be part of the development process.

---

### AG-0013: Accessibility as a Core Requirement

**Description:**  
The web user interface shall conform to WCAG 2.1 Level AA accessibility standards. Accessibility shall be considered from the design phase, not retrofitted. Automated accessibility testing shall be integrated into the CI/CD pipeline. User testing with assistive technologies shall be conducted regularly.

---

### AG-0014: Observability and Monitoring

**Description:**  
The system shall be designed for observability with structured logging, distributed tracing (OpenTelemetry), and metrics collection. Health check endpoints shall be provided for all services. Dashboards and alerts shall be configured for key performance indicators and error rates. This enables proactive issue detection and performance optimization.

---

### AG-0015: Infrastructure as Code

**Description:**  
All infrastructure (cloud resources, Kubernetes configurations, database schemas) shall be defined as code and version-controlled. Terraform or equivalent shall be used for cloud resource provisioning. Database migrations shall be automated and reversible. This ensures reproducible deployments and enables infrastructure changes through the same review process as application code.

---
