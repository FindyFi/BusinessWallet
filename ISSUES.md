# Business Wallet - GitHub Issues and Labels Setup

**Version:** 1.0.0  
**Last Updated:** 2026-02-07  
**Status:** Ready for Implementation

This document provides the complete setup for GitHub labels and issues for the Business Wallet project. It maps all requirements from `requirements.md` to trackable issues.

---

## Part 1: Label Definitions

### Requirement Labels
Create these labels to link issues to their source requirements.

| Label Name | Color | Description |
|------------|-------|-------------|
| `FR-0001` | `#0E8A16` | Web-Based User Interface |
| `FR-0002` | `#0E8A16` | Role-Based Access Control |
| `FR-0003` | `#0E8A16` | Custom Role Definition |
| `FR-0004` | `#0E8A16` | Fine-Grained Resource Permissions |
| `FR-0005` | `#0E8A16` | Tenant Self-Provisioning |
| `FR-0006` | `#0E8A16` | Credential Issuance |
| `FR-0007` | `#0E8A16` | Credential Type Agnosticism |
| `FR-0008` | `#0E8A16` | Selective Disclosure |
| `FR-0009` | `#0E8A16` | Credential Revocation |
| `TR-0001` | `#1D76DB` | Unified Deployment Architecture |
| `TR-0002` | `#1D76DB` | Tenant Data Isolation |
| `TR-0003` | `#1D76DB` | REST API Architecture |
| `TR-0004` | `#1D76DB` | OAuth2 API Authentication |
| `TR-0005` | `#1D76DB` | Hybrid Permission Architecture |
| `TR-0006` | `#1D76DB` | Multi-Format Credential Support |
| `TR-0007` | `#1D76DB` | Cryptographic Verification |
| `TR-0008` | `#1D76DB` | OpenID Federation Trust Establishment |

### Status Labels
| Label Name | Color | Description |
|------------|-------|-------------|
| `status:Backlog` | `#FBCA04` | Issue not yet refined or ready |
| `status:Ready` | `#0E8A16` | Issue meets Definition of Ready |
| `status:In-Progress` | `#1D76DB` | Issue is actively being worked on |
| `status:In-Review` | `#6F42C1` | Issue is in code review or testing |
| `status:Done` | `#0D1117` | Issue meets Definition of Done |

### Priority Labels
| Label Name | Color | Description |
|------------|-------|-------------|
| `priority:Critical` | `#B60205` | Must be completed for MVP |
| `priority:High` | `#D93F0B` | Important for full functionality |
| `priority:Medium` | `#FBCA04` | Enhances the system |
| `priority:Low` | `#C2E0C6` | Nice to have |

### Type Labels
| Label Name | Color | Description |
|------------|-------|-------------|
| `type:Feature` | `#A2EEEF` | New functionality |
| `type:Bug` | `#D73A4A` | Something isn't working |
| `type:Task` | `#D4C5F9` | Technical task or chore |
| `type:Spike` | `#F9D0C4` | Research or investigation |

---

## Part 2: Issue Definitions

### Phase 1: Foundation (Critical Infrastructure)

---

#### Issue: TR-0001 - Unified Deployment Architecture

**Title:** 🏗️ [TR-0001] Implement Unified Deployment Architecture

**Labels:** `TR-0001`, `status:Backlog`, `priority:Critical`, `type:Feature`

**Body:**

```markdown
## Description

The Business Wallet shall use a single codebase supporting both on-premises and multi-tenant SaaS deployments. Deployment mode shall be configurable through environment variables or configuration files without code changes.

**Requirement Reference:** [TR-0001](requirements.md#tr-0001-unified-deployment-architecture)

**Rationale:** Reduces maintenance overhead, ensures feature parity between deployment modes, and simplifies development.

## User Story

As a DevOps engineer, I want to deploy the Business Wallet in different modes (on-premises or SaaS) using the same codebase so that I can support various customer requirements without maintaining separate codebases.

## Acceptance Criteria

- [ ] Given the application codebase, when deployed with `DEPLOYMENT_MODE=on-premises`, then the application runs in single-tenant mode
- [ ] Given the application codebase, when deployed with `DEPLOYMENT_MODE=saas`, then the application runs in multi-tenant mode
- [ ] Given any deployment mode, when environment variables are changed, then no code modifications are required
- [ ] Given the configuration system, when a new deployment is created, then sensible defaults are provided

## Implementation Guidelines

- Follow AG-0002: Configuration-Driven Deployment Mode
- Use environment variables for all deployment-specific settings
- Create a configuration module that abstracts deployment mode differences
- Document all configuration options with defaults

## Technical Considerations

- Reference AC-0005: Container-Based Deployment with Docker and Kubernetes
- Reference AG-0001: Modular Monolith as Initial Architecture
- Ensure Helm charts support both deployment modes

## Definition of Ready Checklist

- [x] Clear Description: The issue has a clear, unambiguous description
- [x] Acceptance Criteria: Specific, testable acceptance criteria defined
- [x] Priority Assigned: Critical
- [ ] Size Estimated: To be estimated
- [ ] Dependencies Identified: No blocking dependencies
- [ ] Technical Approach Understood: Needs spike if unclear
- [ ] API Contract Defined: N/A (infrastructure)
- [ ] Security Considerations Documented: Configuration security needs review
- [ ] Privacy Impact Assessed: N/A
- [ ] Multi-Tenancy Impact Assessed: Core to multi-tenancy support
- [ ] No Open Questions: All questions answered

## Definition of Done Checklist

- [ ] Code Implemented: All acceptance criteria implemented
- [ ] Code Review Passed: At least one reviewer approved
- [ ] TypeScript Standards Met: Strict mode, no `any` types
- [ ] Tests Written: Unit and integration tests
- [ ] Security Scan Passed: No vulnerabilities
- [ ] Documentation Updated: Configuration options documented
- [ ] Acceptance Testing Complete: Both modes tested
```

---

#### Issue: TR-0003 - REST API Architecture

**Title:** 🔌 [TR-0003] Implement REST API Architecture with OpenAPI

**Labels:** `TR-0003`, `status:Backlog`, `priority:Critical`, `type:Feature`

**Body:**

```markdown
## Description

The system shall expose all functionality through RESTful APIs following OpenAPI 3.0+ specification. APIs shall enable integration with organization core systems (ERP, CRM, etc.) and support both synchronous and asynchronous operations where appropriate.

**Requirement Reference:** [TR-0003](requirements.md#tr-0003-rest-api-architecture)

**Rationale:** REST APIs provide broad compatibility, well-understood patterns, and extensive tooling support for enterprise integrations.

## User Story

As an integration developer, I want well-documented REST APIs so that I can integrate the Business Wallet with our organization's ERP and CRM systems.

## Acceptance Criteria

- [ ] Given the API layer, when a new endpoint is added, then it follows RESTful principles (proper HTTP methods, status codes)
- [ ] Given any API endpoint, when accessed, then it conforms to the OpenAPI 3.0+ specification
- [ ] Given the API documentation, when viewed, then it is automatically generated from the OpenAPI spec
- [ ] Given an API request, when it fails, then a consistent error response format is returned
- [ ] Given the API versioning, when a new version is released, then it follows semantic versioning in the URL path (e.g., `/api/v1/`)

## Implementation Guidelines

- Follow AG-0003: API-First Development - write OpenAPI spec first
- Follow AC-0006: OpenAPI 3.0+ for API Specification
- Follow AG-0011: Semantic Versioning for APIs
- Implement request/response validation using the OpenAPI spec
- Generate TypeScript types from OpenAPI spec for type safety

## Technical Considerations

- Set up express.js or similar framework with OpenAPI middleware
- Configure automatic API documentation generation (e.g., Swagger UI)
- Implement request validation against OpenAPI schema
- Set up API rate limiting infrastructure

## Definition of Ready Checklist

- [x] Clear Description: The issue has a clear, unambiguous description
- [x] Acceptance Criteria: Specific, testable acceptance criteria defined
- [x] Priority Assigned: Critical
- [ ] Size Estimated: To be estimated
- [ ] Dependencies Identified: TR-0001 should be completed first
- [ ] Technical Approach Understood: API-first approach defined
- [x] API Contract Defined: Initial OpenAPI spec to be created
- [ ] Security Considerations Documented: Rate limiting, input validation
- [ ] Privacy Impact Assessed: N/A for infrastructure
- [ ] Multi-Tenancy Impact Assessed: APIs must support tenant context
- [ ] No Open Questions: All questions answered

## Definition of Done Checklist

- [ ] Code Implemented: All acceptance criteria implemented
- [ ] Code Review Passed: At least one reviewer approved
- [ ] TypeScript Standards Met: Types generated from OpenAPI
- [ ] Tests Written: API endpoint tests
- [ ] OpenAPI Specification Created: Base spec documented
- [ ] Security Scan Passed: No vulnerabilities
- [ ] Documentation Updated: API docs auto-generated
- [ ] Acceptance Testing Complete: APIs manually tested
```

---

#### Issue: TR-0002 - Tenant Data Isolation

**Title:** 🔒 [TR-0002] Implement Tenant Data Isolation

**Labels:** `TR-0002`, `status:Backlog`, `priority:Critical`, `type:Feature`

**Body:**

```markdown
## Description

In multi-tenant SaaS deployment, the system shall ensure complete data isolation between tenants. No tenant shall be able to access, view, or infer data belonging to another tenant.

**Requirement Reference:** [TR-0002](requirements.md#tr-0002-tenant-data-isolation)

**Rationale:** Data isolation is fundamental for security, privacy, and regulatory compliance in multi-tenant systems.

## User Story

As a tenant administrator, I want complete assurance that my organization's data is isolated from other tenants so that I can trust the system with sensitive business credentials and documents.

## Acceptance Criteria

- [ ] Given the database schema, when a tenant queries data, then only data belonging to that tenant is returned
- [ ] Given row-level security policies, when any database query executes, then tenant_id is enforced
- [ ] Given application middleware, when a request is processed, then tenant context is validated and injected
- [ ] Given audit logs, when reviewed, then tenant isolation violations are detectable
- [ ] Given a malicious query attempt, when a tenant tries to access another tenant's data, then the attempt is blocked and logged

## Implementation Guidelines

- Follow AC-0004: PostgreSQL with row-level security
- Follow AC-0011: Multi-Tenant Architecture with Logical Isolation
- Implement middleware that extracts and validates tenant_id from JWT tokens
- All database queries must include tenant_id in WHERE clauses
- Use database views with row-level security as an additional safeguard

## Technical Considerations

- PostgreSQL row-level security (RLS) policies
- Tenant context propagation through request lifecycle
- Database connection pooling with tenant awareness
- Testing strategy for tenant isolation verification

## Security Considerations

- Tenant ID must be extracted from authenticated token, never from request body
- SQL injection must be prevented to avoid RLS bypass
- Audit all cross-tenant access attempts
- Regular security testing for isolation breaches

## Definition of Ready Checklist

- [x] Clear Description: The issue has a clear, unambiguous description
- [x] Acceptance Criteria: Specific, testable acceptance criteria defined
- [x] Priority Assigned: Critical
- [ ] Size Estimated: To be estimated
- [ ] Dependencies Identified: TR-0001, TR-0004 (for tenant ID from tokens)
- [ ] Technical Approach Understood: RLS + middleware approach
- [ ] API Contract Defined: Tenant context in headers/tokens
- [x] Security Considerations Documented: Critical security feature
- [x] Privacy Impact Assessed: Core privacy protection
- [x] Multi-Tenancy Impact Assessed: Core multi-tenancy feature
- [ ] No Open Questions: All questions answered

## Definition of Done Checklist

- [ ] Code Implemented: All acceptance criteria implemented
- [ ] Code Review Passed: Security-focused review required
- [ ] TypeScript Standards Met: Tenant types properly defined
- [ ] Tests Written: Isolation tests with multiple tenants
- [ ] Security Scan Passed: No vulnerabilities
- [ ] RLS Policies Created: Database policies in place
- [ ] Documentation Updated: Tenant isolation documented
- [ ] Acceptance Testing Complete: Cross-tenant access attempts blocked
```

---

### Phase 2: Authentication & Authorization

---

#### Issue: TR-0004 - OAuth2 API Authentication

**Title:** 🔐 [TR-0004] Implement OAuth2 API Authentication

**Labels:** `TR-0004`, `status:Backlog`, `priority:Critical`, `type:Feature`

**Body:**

```markdown
## Description

API authentication shall use OAuth2 protocol. OAuth2 scopes shall map to the internal permission model, enabling API clients to request specific permissions aligned with the RBAC and resource-based permission system.

**Requirement Reference:** [TR-0004](requirements.md#tr-0004-oauth2-api-authentication)

**Rationale:** OAuth2 is the industry standard for API authentication, provides token-based security, and supports scope-based permission delegation.

## User Story

As an API consumer, I want to authenticate using OAuth2 so that I can securely access the Business Wallet APIs with appropriate permissions.

## Acceptance Criteria

- [ ] Given an OAuth2 client, when requesting a token, then the system issues valid JWT access tokens
- [ ] Given an API request with a valid token, when processed, then the user identity and permissions are extracted
- [ ] Given OAuth2 scopes, when defined, then they map to internal RBAC permissions
- [ ] Given an expired token, when used, then the request is rejected with 401 Unauthorized
- [ ] Given token refresh, when requested with valid refresh token, then a new access token is issued
- [ ] Given an external identity provider, when configured, then users can authenticate via SSO

## Implementation Guidelines

- Follow AC-0007: OAuth 2.0 with OpenID Connect for Authentication
- Support both acting as an OAuth provider and integrating with external providers
- Implement standard OAuth2 flows: Authorization Code, Client Credentials
- JWT tokens should contain tenant_id, user_id, roles, and scopes

## Technical Considerations

- Use established OAuth2 library (e.g., node-oauth2-server, passport.js)
- JWT token structure and signing (RS256 recommended)
- Token storage and revocation
- Integration with Cerbos for authorization (TR-0005)

## Security Considerations

- Secure token storage (never in localStorage for web clients)
- Token expiration and refresh strategy
- PKCE for public clients
- Rate limiting on token endpoints

## Definition of Ready Checklist

- [x] Clear Description: The issue has a clear, unambiguous description
- [x] Acceptance Criteria: Specific, testable acceptance criteria defined
- [x] Priority Assigned: Critical
- [ ] Size Estimated: To be estimated
- [ ] Dependencies Identified: TR-0001, TR-0003
- [ ] Technical Approach Understood: OAuth2 + OIDC approach
- [ ] API Contract Defined: Token endpoints spec needed
- [x] Security Considerations Documented: Authentication security critical
- [ ] Privacy Impact Assessed: User identity handling
- [x] Multi-Tenancy Impact Assessed: Tenant ID in tokens
- [ ] No Open Questions: All questions answered

## Definition of Done Checklist

- [ ] Code Implemented: All acceptance criteria implemented
- [ ] Code Review Passed: Security-focused review required
- [ ] TypeScript Standards Met: Token types defined
- [ ] Tests Written: Auth flow tests
- [ ] Security Scan Passed: No vulnerabilities
- [ ] OpenAPI Updated: Auth endpoints documented
- [ ] Documentation Updated: Auth flow documented
- [ ] Acceptance Testing Complete: OAuth flows tested end-to-end
```

---

#### Issue: FR-0002 - Role-Based Access Control

**Title:** 👥 [FR-0002] Implement Role-Based Access Control

**Labels:** `FR-0002`, `status:Backlog`, `priority:Critical`, `type:Feature`

**Body:**

```markdown
## Description

The system shall support role-based access control with predefined system roles. Users shall be assigned one or more roles that determine their base-level permissions within the organization.

**Requirement Reference:** [FR-0002](requirements.md#fr-0002-role-based-access-control)

## User Story

As an organization administrator, I want to assign predefined roles to users so that I can control their access to system features based on their job function.

## Acceptance Criteria

- [ ] Given predefined system roles, when the system starts, then roles like Admin, Issuer, Verifier, Viewer are available
- [ ] Given a user, when assigned a role, then they inherit all permissions associated with that role
- [ ] Given a user with multiple roles, when checking permissions, then permissions are combined (union)
- [ ] Given a role assignment, when changed, then the user's effective permissions update immediately
- [ ] Given an unauthorized action, when attempted, then it is blocked with 403 Forbidden

## Predefined System Roles

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| Admin | Full system access | All permissions |
| Issuer | Can issue credentials | Create, read credentials |
| Verifier | Can verify credentials | Read, verify credentials |
| Viewer | Read-only access | Read credentials, documents |

## Implementation Guidelines

- Follow AC-0008: Cerbos for Policy-Based Access Control
- Define roles as Cerbos policies in YAML
- Integrate role checking at API middleware level
- Audit all permission checks

## Technical Considerations

- Role-permission mapping stored in configuration (not database initially)
- Cerbos PDP integration
- Permission caching strategy
- Integration with OAuth2 scopes (TR-0004)

## Definition of Ready Checklist

- [x] Clear Description: The issue has a clear, unambiguous description
- [x] Acceptance Criteria: Specific, testable acceptance criteria defined
- [x] Priority Assigned: Critical
- [ ] Size Estimated: To be estimated
- [ ] Dependencies Identified: TR-0004 (authentication), TR-0002 (tenant isolation)
- [ ] Technical Approach Understood: Cerbos policy approach
- [ ] API Contract Defined: Role assignment endpoints needed
- [x] Security Considerations Documented: Authorization is security-critical
- [ ] Privacy Impact Assessed: User role data handling
- [x] Multi-Tenancy Impact Assessed: Roles are tenant-specific
- [ ] No Open Questions: All questions answered

## Definition of Done Checklist

- [ ] Code Implemented: All acceptance criteria implemented
- [ ] Code Review Passed: At least one reviewer approved
- [ ] TypeScript Standards Met: Role and permission types defined
- [ ] Tests Written: Role assignment and permission check tests
- [ ] Cerbos Policies Created: Role definitions in YAML
- [ ] Security Scan Passed: No vulnerabilities
- [ ] Documentation Updated: Roles documented
- [ ] Acceptance Testing Complete: Role-based access tested
```

---

#### Issue: TR-0005 - Hybrid Permission Architecture

**Title:** 🛡️ [TR-0005] Implement Hybrid Permission Architecture (RBAC + ABAC)

**Labels:** `TR-0005`, `status:Backlog`, `priority:Critical`, `type:Feature`

**Body:**

```markdown
## Description

The permission system architecture shall combine Role-Based Access Control (RBAC) with fine-grained resource-based permissions (Attribute-Based Access Control patterns). The architecture shall support:
- Predefined system roles
- Custom organization-defined roles
- Per-resource permission overrides
- Permission inheritance and composition

**Requirement Reference:** [TR-0005](requirements.md#tr-0005-hybrid-permission-architecture)

**Rationale:** Hybrid model provides administrative simplicity of roles while enabling precise access control when needed.

## User Story

As an organization administrator, I want a flexible permission system so that I can use simple role assignments for most users while setting specific permissions for sensitive resources.

## Acceptance Criteria

- [ ] Given a user with a role, when accessing resources, then role permissions apply as baseline
- [ ] Given a resource with custom permissions, when accessed, then resource-level permissions override role permissions
- [ ] Given permission inheritance, when a child resource is accessed, then parent permissions are inherited unless overridden
- [ ] Given permission composition, when evaluating access, then the most specific permission wins
- [ ] Given the Cerbos policy engine, when a permission check is made, then the decision is externalized to Cerbos

## Implementation Guidelines

- Follow AC-0008: Cerbos for Policy-Based Access Control
- Implement permission evaluation: Resource-specific > Role-based > Default deny
- Store resource permissions in database with tenant isolation
- Cache permission decisions for performance

## Technical Considerations

- Cerbos policy structure for hybrid model
- Permission evaluation order and precedence
- Database schema for resource permissions
- Performance optimization for permission checks

## Definition of Ready Checklist

- [x] Clear Description: The issue has a clear, unambiguous description
- [x] Acceptance Criteria: Specific, testable acceptance criteria defined
- [x] Priority Assigned: Critical
- [ ] Size Estimated: To be estimated
- [ ] Dependencies Identified: FR-0002 (RBAC), TR-0004 (auth)
- [ ] Technical Approach Understood: Cerbos hybrid approach
- [ ] API Contract Defined: Permission endpoints needed
- [x] Security Considerations Documented: Authorization architecture critical
- [ ] Privacy Impact Assessed: Permission data handling
- [x] Multi-Tenancy Impact Assessed: Permissions are tenant-scoped
- [ ] No Open Questions: All questions answered

## Definition of Done Checklist

- [ ] Code Implemented: All acceptance criteria implemented
- [ ] Code Review Passed: Security-focused review
- [ ] TypeScript Standards Met: Permission types defined
- [ ] Tests Written: Complex permission scenario tests
- [ ] Cerbos Policies Created: Hybrid policies in YAML
- [ ] Security Scan Passed: No vulnerabilities
- [ ] Documentation Updated: Permission model documented
- [ ] Acceptance Testing Complete: Permission scenarios tested
```

---

### Phase 3: Core Credential Features

---

#### Issue: TR-0006 - Multi-Format Credential Support

**Title:** 📜 [TR-0006] Implement Multi-Format Credential Support (SD-JWT VC & W3C VC DM)

**Labels:** `TR-0006`, `status:Backlog`, `priority:Critical`, `type:Feature`

**Body:**

```markdown
## Description

The system shall support multiple credential format standards:
- **SD-JWT VC (Selective Disclosure JWT Verifiable Credentials):** JSON-based credentials with built-in selective disclosure capabilities
- **W3C Verifiable Credentials Data Model (VC DM):** JSON-LD based credentials following the W3C standard

The system shall be capable of issuing, storing, presenting, and verifying credentials in both formats. Format selection shall be configurable per credential type or issuance.

**Requirement Reference:** [TR-0006](requirements.md#tr-0006-multi-format-credential-support)

**Rationale:** Supporting both SD-JWT VC and W3C VC DM ensures interoperability with different ecosystems.

## User Story

As an organization administrator, I want to issue credentials in different formats so that our credentials are compatible with various verifier systems and regulatory requirements.

## Acceptance Criteria

- [ ] Given a credential issuance request, when SD-JWT VC format is specified, then the credential is issued in SD-JWT format
- [ ] Given a credential issuance request, when W3C VC DM format is specified, then the credential is issued in JSON-LD format with Data Integrity proofs
- [ ] Given stored credentials, when retrieved, then both formats are stored uniformly
- [ ] Given a credential type configuration, when format is specified, then it becomes the default for that type
- [ ] Given Credo framework, when integrated, then both formats are supported through its APIs

## Implementation Guidelines

- Follow AC-0013: Credo as SSI/Verifiable Credentials Framework
- Follow AC-0009: W3C Verifiable Credentials Data Model 2.0
- Use Credo's credential format modules for both SD-JWT VC and JSON-LD
- Abstract format differences behind a common interface

## Technical Considerations

- Credo framework integration
- Credential storage schema (format-agnostic)
- Format conversion capabilities (if possible)
- Key management for different proof types

## Definition of Ready Checklist

- [x] Clear Description: The issue has a clear, unambiguous description
- [x] Acceptance Criteria: Specific, testable acceptance criteria defined
- [x] Priority Assigned: Critical
- [ ] Size Estimated: To be estimated
- [ ] Dependencies Identified: TR-0001, TR-0003
- [ ] Technical Approach Understood: Credo framework approach
- [ ] API Contract Defined: Credential format in API spec
- [ ] Security Considerations Documented: Cryptographic proof security
- [ ] Privacy Impact Assessed: Credential data handling (GDPR)
- [x] Multi-Tenancy Impact Assessed: Credentials are tenant-scoped
- [ ] No Open Questions: All questions answered

## Definition of Done Checklist

- [ ] Code Implemented: All acceptance criteria implemented
- [ ] Code Review Passed: At least one reviewer approved
- [ ] TypeScript Standards Met: Credential types defined
- [ ] Tests Written: Format-specific tests
- [ ] Credo Integration Complete: Framework properly integrated
- [ ] Security Scan Passed: No vulnerabilities
- [ ] Documentation Updated: Formats documented
- [ ] Acceptance Testing Complete: Both formats tested
```

---

#### Issue: TR-0007 - Cryptographic Verification

**Title:** 🔏 [TR-0007] Implement Cryptographic Verification

**Labels:** `TR-0007`, `status:Backlog`, `priority:Critical`, `type:Feature`

**Body:**

```markdown
## Description

Credential verification shall rely primarily on cryptographic proof validation. The system shall verify credentials by:
- Validating digital signatures against the issuer's public key
- Checking credential integrity (tamper detection)
- Verifying proof formats (e.g., JWS, Data Integrity Proofs)

Verification shall be self-contained and not require real-time communication with the issuer for basic validity checks.

**Requirement Reference:** [TR-0007](requirements.md#tr-0007-cryptographic-verification)

**Rationale:** Cryptographic verification provides offline capability, reduces latency, and maintains privacy by not notifying issuers of verification events.

## User Story

As a verifier, I want to cryptographically verify credentials so that I can trust their authenticity without contacting the issuer for every verification.

## Acceptance Criteria

- [ ] Given a credential with JWS signature, when verified, then the signature is validated against the issuer's public key
- [ ] Given a credential with Data Integrity proof, when verified, then the proof is validated
- [ ] Given a tampered credential, when verification is attempted, then the tampering is detected and verification fails
- [ ] Given verification, when performed, then no real-time communication with the issuer is required
- [ ] Given a verification result, when returned, then it includes details about what was verified

## Implementation Guidelines

- Follow AC-0013: Credo framework for verification
- Implement verification for both SD-JWT VC and W3C VC DM formats
- Cache issuer public keys for performance
- Support DID resolution for key discovery

## Technical Considerations

- Credo verification APIs
- Key caching and refresh strategy
- DID resolution methods (did:web, did:key)
- Offline verification capabilities

## Definition of Ready Checklist

- [x] Clear Description: The issue has a clear, unambiguous description
- [x] Acceptance Criteria: Specific, testable acceptance criteria defined
- [x] Priority Assigned: Critical
- [ ] Size Estimated: To be estimated
- [ ] Dependencies Identified: TR-0006 (credential formats)
- [ ] Technical Approach Understood: Credo verification approach
- [ ] API Contract Defined: Verification API spec needed
- [x] Security Considerations Documented: Cryptographic security critical
- [ ] Privacy Impact Assessed: Verification doesn't notify issuer
- [ ] Multi-Tenancy Impact Assessed: Verification is stateless
- [ ] No Open Questions: All questions answered

## Definition of Done Checklist

- [ ] Code Implemented: All acceptance criteria implemented
- [ ] Code Review Passed: Crypto review required
- [ ] TypeScript Standards Met: Verification types defined
- [ ] Tests Written: Verification tests with various credentials
- [ ] Security Scan Passed: No vulnerabilities
- [ ] Documentation Updated: Verification process documented
- [ ] Acceptance Testing Complete: Manual verification testing
```

---

#### Issue: FR-0006 - Credential Issuance

**Title:** 🎫 [FR-0006] Implement Credential Issuance

**Labels:** `FR-0006`, `status:Backlog`, `priority:Critical`, `type:Feature`

**Body:**

```markdown
## Description

The system shall enable organizations to issue digital credentials to subjects (individuals, organizations, or other entities). Credentials are issued directly by the organization that owns the wallet; delegation or proxy issuance on behalf of other organizations is not supported.

**Requirement Reference:** [FR-0006](requirements.md#fr-0006-credential-issuance)

## User Story

As an organization administrator, I want to issue digital credentials to employees, partners, or customers so that they can prove their relationship or qualifications to third parties.

## Acceptance Criteria

- [ ] Given an authorized user, when they create a credential, then the credential is signed with the organization's cryptographic keys
- [ ] Given a credential template, when a user issues a credential, then all required claims are populated
- [ ] Given an issuance request, when the credential is created, then it is stored and made available to the holder
- [ ] Given OID4VCI protocol, when a holder initiates issuance, then the credential is delivered via standard protocol
- [ ] Given issuance, when completed, then an audit log entry is created

## Implementation Guidelines

- Follow AC-0010: OpenID for Verifiable Credentials (OpenID4VC) Protocols
- Follow AC-0013: Credo framework for credential operations
- Implement OID4VCI credential issuance flow
- Support both SD-JWT VC and W3C VC DM formats (TR-0006)

## Technical Considerations

- Credo OID4VCI module
- Key management for signing
- Credential storage and retrieval
- Issuance workflow (offer → request → issue)

## Definition of Ready Checklist

- [x] Clear Description: The issue has a clear, unambiguous description
- [x] Acceptance Criteria: Specific, testable acceptance criteria defined
- [x] Priority Assigned: Critical
- [ ] Size Estimated: To be estimated
- [ ] Dependencies Identified: TR-0006, TR-0007, TR-0004, FR-0002
- [ ] Technical Approach Understood: OID4VCI approach with Credo
- [ ] API Contract Defined: OID4VCI endpoints spec needed
- [x] Security Considerations Documented: Key management critical
- [x] Privacy Impact Assessed: Credential data handling (GDPR)
- [x] Multi-Tenancy Impact Assessed: Credentials are tenant-scoped
- [ ] No Open Questions: All questions answered

## Definition of Done Checklist

- [ ] Code Implemented: All acceptance criteria implemented
- [ ] Code Review Passed: At least one reviewer approved
- [ ] TypeScript Standards Met: Issuance types defined
- [ ] Tests Written: Issuance flow tests
- [ ] OID4VCI Compliance: Protocol conformance tested
- [ ] Audit Logging: Issuance events logged
- [ ] Security Scan Passed: No vulnerabilities
- [ ] Documentation Updated: Issuance flow documented
- [ ] Acceptance Testing Complete: End-to-end issuance tested
```

---

### Phase 4: User Interface

---

#### Issue: FR-0001 - Web-Based User Interface

**Title:** 🖥️ [FR-0001] Implement Web-Based User Interface

**Labels:** `FR-0001`, `status:Backlog`, `priority:Critical`, `type:Feature`

**Body:**

```markdown
## Description

The Business Wallet shall provide a web-based user interface accessible via modern web browsers. The UI shall enable users to perform all credential and document management operations without requiring desktop or mobile application installation.

**Requirement Reference:** [FR-0001](requirements.md#fr-0001-web-based-user-interface)

## User Story

As a user, I want to access the Business Wallet through my web browser so that I can manage credentials and documents without installing additional software.

## Acceptance Criteria

- [ ] Given modern web browsers (Chrome, Firefox, Safari, Edge), when accessing the application, then all functionality is available
- [ ] Given the UI, when performing credential operations, then all CRUD operations are supported
- [ ] Given the UI, when navigating, then the interface is intuitive and follows consistent patterns
- [ ] Given accessibility requirements, when tested, then WCAG 2.1 Level AA compliance is achieved
- [ ] Given responsive design, when accessed on different screen sizes, then the UI adapts appropriately

## Implementation Guidelines

- Follow AC-0003: React for Web User Interface
- Follow AG-0013: Accessibility as a Core Requirement
- Use component-based architecture with React
- Implement with accessible UI component library (e.g., Radix UI, Chakra UI)

## Technical Considerations

- React with TypeScript
- State management (React Query, Zustand, or similar)
- Form handling and validation
- Routing strategy
- Authentication UI flow

## Definition of Ready Checklist

- [x] Clear Description: The issue has a clear, unambiguous description
- [x] Acceptance Criteria: Specific, testable acceptance criteria defined
- [x] Priority Assigned: Critical
- [ ] Size Estimated: To be estimated (likely needs breakdown)
- [ ] Dependencies Identified: TR-0003 (APIs), TR-0004 (auth)
- [ ] Technical Approach Understood: React component approach
- [ ] API Contract Defined: APIs must exist first
- [ ] Security Considerations Documented: XSS, CSRF protection
- [ ] Privacy Impact Assessed: User data in browser
- [ ] Multi-Tenancy Impact Assessed: Tenant context in UI
- [ ] UI Mockups Provided: Wireframes needed
- [x] Accessibility Requirements Specified: WCAG 2.1 AA
- [ ] No Open Questions: All questions answered

## Definition of Done Checklist

- [ ] Code Implemented: All acceptance criteria implemented
- [ ] Code Review Passed: At least one reviewer approved
- [ ] TypeScript Standards Met: Strict types throughout
- [ ] Tests Written: Component and integration tests
- [ ] Accessibility Tested: WCAG 2.1 AA compliance verified
- [ ] Keyboard Navigation: All interactive elements accessible
- [ ] Screen Reader Support: ARIA labels provided
- [ ] Security Scan Passed: No vulnerabilities
- [ ] Documentation Updated: Component documentation
- [ ] Acceptance Testing Complete: User testing completed

## Note: Recommend Splitting

This issue is large and should be split into smaller issues:
1. UI Foundation (project setup, routing, auth flow)
2. Dashboard View
3. Credential List View
4. Credential Detail View
5. Credential Issuance Flow
6. Settings and Profile Views
```

---

### Phase 5: Enhanced Features

---

#### Issue: FR-0007 - Credential Type Agnosticism

**Title:** 📋 [FR-0007] Implement Credential Type Agnosticism (Custom Schemas)

**Labels:** `FR-0007`, `status:Backlog`, `priority:High`, `type:Feature`

**Body:**

```markdown
## Description

The system shall be agnostic to credential types and support any credential schema. The system shall not be limited to predefined credential types but shall allow organizations to define and use custom credential schemas for any use case.

**Requirement Reference:** [FR-0007](requirements.md#fr-0007-credential-type-agnosticism)

## User Story

As an organization administrator, I want to define custom credential schemas so that I can issue credentials for any business need without system limitations.

## Acceptance Criteria

- [ ] Given any valid credential schema, when an organization configures it, then the system accepts and stores the schema
- [ ] Given a custom schema, when a credential is issued using it, then the credential conforms to the schema structure
- [ ] Given multiple credential types, when viewing the wallet, then all types are displayed uniformly
- [ ] Given schema validation, when a credential is created, then it validates against the schema

## Implementation Guidelines

- Support JSON Schema for credential type definitions
- Implement schema registry per tenant
- Generate UI forms dynamically from schemas
- Validate credentials against their schemas

## Definition of Ready Checklist

- [x] Clear Description: The issue has a clear, unambiguous description
- [x] Acceptance Criteria: Specific, testable acceptance criteria defined
- [x] Priority Assigned: High
- [ ] Size Estimated: To be estimated
- [ ] Dependencies Identified: TR-0006, FR-0006
- [ ] Technical Approach Understood: JSON Schema approach
- [ ] API Contract Defined: Schema CRUD API needed
- [ ] Security Considerations Documented: Schema injection prevention
- [ ] Privacy Impact Assessed: Schema may define PII fields
- [x] Multi-Tenancy Impact Assessed: Schemas are tenant-scoped
- [ ] No Open Questions: All questions answered

## Definition of Done Checklist

- [ ] Code Implemented: All acceptance criteria implemented
- [ ] Code Review Passed: At least one reviewer approved
- [ ] TypeScript Standards Met: Schema types defined
- [ ] Tests Written: Schema validation tests
- [ ] Security Scan Passed: No vulnerabilities
- [ ] Documentation Updated: Schema definition guide
- [ ] Acceptance Testing Complete: Custom schemas tested
```

---

#### Issue: FR-0008 - Selective Disclosure

**Title:** 🔐 [FR-0008] Implement Selective Disclosure

**Labels:** `FR-0008`, `status:Backlog`, `priority:High`, `type:Feature`

**Body:**

```markdown
## Description

The system shall support selective disclosure, allowing credential holders to share only specific claims from a credential without revealing the entire credential content. This enables privacy-preserving presentations.

**Requirement Reference:** [FR-0008](requirements.md#fr-0008-selective-disclosure)

## User Story

As a credential holder, I want to share only specific claims from my credential so that I can prove what is necessary without revealing my complete personal data.

## Acceptance Criteria

- [ ] Given a credential with multiple claims, when presenting to a verifier, then the holder can select which claims to disclose
- [ ] Given a selective disclosure request, when the presentation is created, then undisclosed claims are cryptographically hidden
- [ ] Given a selectively disclosed credential, when verified, then only the disclosed claims are visible to the verifier

## Implementation Guidelines

- Leverage SD-JWT VC format for selective disclosure (TR-0006)
- Use Credo's selective disclosure capabilities
- Implement UI for claim selection during presentation
- Follow OID4VP protocol for presentation (AC-0010)

## Definition of Ready Checklist

- [x] Clear Description: The issue has a clear, unambiguous description
- [x] Acceptance Criteria: Specific, testable acceptance criteria defined
- [x] Priority Assigned: High
- [ ] Size Estimated: To be estimated
- [ ] Dependencies Identified: TR-0006, TR-0007
- [ ] Technical Approach Understood: SD-JWT VC approach
- [ ] API Contract Defined: Presentation API needed
- [x] Security Considerations Documented: Cryptographic hiding critical
- [x] Privacy Impact Assessed: Core privacy feature
- [ ] Multi-Tenancy Impact Assessed: N/A (holder operation)
- [ ] No Open Questions: All questions answered

## Definition of Done Checklist

- [ ] Code Implemented: All acceptance criteria implemented
- [ ] Code Review Passed: Crypto review required
- [ ] TypeScript Standards Met: Disclosure types defined
- [ ] Tests Written: Selective disclosure tests
- [ ] Security Scan Passed: No vulnerabilities
- [ ] Documentation Updated: Selective disclosure guide
- [ ] Acceptance Testing Complete: Privacy-preserving presentation tested
```

---

#### Issue: FR-0003 - Custom Role Definition

**Title:** 👤 [FR-0003] Implement Custom Role Definition

**Labels:** `FR-0003`, `status:Backlog`, `priority:High`, `type:Feature`

**Body:**

```markdown
## Description

Organizations shall be able to define custom roles beyond the predefined system roles. Custom roles shall be composable from available permissions and assignable to users within the organization.

**Requirement Reference:** [FR-0003](requirements.md#fr-0003-custom-role-definition)

## User Story

As an organization administrator, I want to create custom roles so that I can define access patterns specific to my organization's structure.

## Acceptance Criteria

- [ ] Given organization admin permissions, when creating a role, then a new custom role can be defined
- [ ] Given available permissions, when composing a role, then any combination can be selected
- [ ] Given a custom role, when assigned to users, then they receive the composed permissions
- [ ] Given a custom role, when modified, then user permissions update accordingly
- [ ] Given a custom role, when deleted, then users lose the associated permissions

## Implementation Guidelines

- Extend Cerbos policies for custom roles (TR-0005)
- Store custom roles in database per tenant
- Implement role management UI
- Audit all role changes

## Definition of Ready Checklist

- [x] Clear Description: The issue has a clear, unambiguous description
- [x] Acceptance Criteria: Specific, testable acceptance criteria defined
- [x] Priority Assigned: High
- [ ] Size Estimated: To be estimated
- [ ] Dependencies Identified: FR-0002, TR-0005
- [ ] Technical Approach Understood: Database + Cerbos approach
- [ ] API Contract Defined: Role CRUD API needed
- [x] Security Considerations Documented: Role manipulation is sensitive
- [ ] Privacy Impact Assessed: N/A
- [x] Multi-Tenancy Impact Assessed: Roles are tenant-scoped
- [ ] No Open Questions: All questions answered

## Definition of Done Checklist

- [ ] Code Implemented: All acceptance criteria implemented
- [ ] Code Review Passed: At least one reviewer approved
- [ ] TypeScript Standards Met: Role types defined
- [ ] Tests Written: Custom role tests
- [ ] Audit Logging: Role changes logged
- [ ] Security Scan Passed: No vulnerabilities
- [ ] Documentation Updated: Custom roles guide
- [ ] Acceptance Testing Complete: Role management tested
```

---

#### Issue: FR-0004 - Fine-Grained Resource Permissions

**Title:** 🎯 [FR-0004] Implement Fine-Grained Resource Permissions

**Labels:** `FR-0004`, `status:Backlog`, `priority:High`, `type:Feature`

**Body:**

```markdown
## Description

Beyond role-based permissions, the system shall support fine-grained permissions at the individual resource level. This enables restricting or granting access to specific credential types, document categories, or other resources independent of role assignments.

**Requirement Reference:** [FR-0004](requirements.md#fr-0004-fine-grained-resource-permissions)

## User Story

As an organization administrator, I want to set specific permissions on individual resources so that I can precisely control who can access sensitive credentials.

## Acceptance Criteria

- [ ] Given a resource, when permissions are set, then access is controlled at the resource level
- [ ] Given resource permissions, when they conflict with role permissions, then resource permissions take precedence
- [ ] Given a user without role permissions, when granted resource access, then they can access that specific resource
- [ ] Given a user with role permissions, when denied resource access, then they cannot access that specific resource

## Implementation Guidelines

- Build on TR-0005 Hybrid Permission Architecture
- Implement resource permission storage
- Integrate with Cerbos for fine-grained checks
- Implement permission management UI

## Definition of Ready Checklist

- [x] Clear Description: The issue has a clear, unambiguous description
- [x] Acceptance Criteria: Specific, testable acceptance criteria defined
- [x] Priority Assigned: High
- [ ] Size Estimated: To be estimated
- [ ] Dependencies Identified: TR-0005, FR-0002
- [ ] Technical Approach Understood: ABAC pattern with Cerbos
- [ ] API Contract Defined: Permission API needed
- [x] Security Considerations Documented: Fine-grained access critical
- [ ] Privacy Impact Assessed: Access to sensitive data
- [x] Multi-Tenancy Impact Assessed: Permissions are tenant-scoped
- [ ] No Open Questions: All questions answered

## Definition of Done Checklist

- [ ] Code Implemented: All acceptance criteria implemented
- [ ] Code Review Passed: Security-focused review
- [ ] TypeScript Standards Met: Permission types defined
- [ ] Tests Written: Complex permission scenario tests
- [ ] Audit Logging: Permission changes logged
- [ ] Security Scan Passed: No vulnerabilities
- [ ] Documentation Updated: Permission model guide
- [ ] Acceptance Testing Complete: Fine-grained access tested
```

---

#### Issue: TR-0008 - OpenID Federation Trust Establishment

**Title:** 🌐 [TR-0008] Implement OpenID Federation Trust Establishment

**Labels:** `TR-0008`, `status:Backlog`, `priority:High`, `type:Feature`

**Body:**

```markdown
## Description

The system shall support OpenID Federation for establishing trust between verifiers and issuers. This enables:
- Dynamic discovery of issuer metadata and public keys
- Hierarchical trust chains through trust anchors
- Automated trust policy evaluation
- Federation-based issuer validation

**Requirement Reference:** [TR-0008](requirements.md#tr-0008-openid-federation-trust-establishment)

**Rationale:** OpenID Federation provides a scalable, standards-based approach to trust establishment.

## User Story

As a verifier, I want to automatically establish trust with credential issuers through federation so that I don't need to manually configure trust for every issuer.

## Acceptance Criteria

- [ ] Given a federated issuer, when their credential is verified, then trust is established via federation
- [ ] Given a trust anchor configuration, when an issuer is checked, then the trust chain is validated
- [ ] Given issuer metadata, when discovered, then public keys are automatically retrieved
- [ ] Given trust policy rules, when evaluating an issuer, then policies are automatically applied

## Implementation Guidelines

- Follow OpenID Federation specification
- Implement entity statement discovery
- Implement trust chain validation
- Cache federation metadata appropriately

## Definition of Ready Checklist

- [x] Clear Description: The issue has a clear, unambiguous description
- [x] Acceptance Criteria: Specific, testable acceptance criteria defined
- [x] Priority Assigned: High
- [ ] Size Estimated: To be estimated
- [ ] Dependencies Identified: TR-0007 (verification)
- [ ] Technical Approach Understood: OpenID Federation spec
- [ ] API Contract Defined: Federation endpoints spec
- [x] Security Considerations Documented: Trust chain security critical
- [ ] Privacy Impact Assessed: Metadata exposure
- [ ] Multi-Tenancy Impact Assessed: Federation config per tenant
- [ ] No Open Questions: All questions answered

## Definition of Done Checklist

- [ ] Code Implemented: All acceptance criteria implemented
- [ ] Code Review Passed: Security-focused review
- [ ] TypeScript Standards Met: Federation types defined
- [ ] Tests Written: Trust chain validation tests
- [ ] Security Scan Passed: No vulnerabilities
- [ ] Documentation Updated: Federation setup guide
- [ ] Acceptance Testing Complete: Federation tested with reference implementation
```

---

### Phase 6: Additional Features

---

#### Issue: FR-0009 - Credential Revocation

**Title:** ❌ [FR-0009] Implement Credential Revocation

**Labels:** `FR-0009`, `status:Backlog`, `priority:Medium`, `type:Feature`

**Body:**

```markdown
## Description

The system shall support credential revocation, allowing issuers to invalidate previously issued credentials. Revocation status shall be verifiable by relying parties.

**Requirement Reference:** [FR-0009](requirements.md#fr-0009-credential-revocation)

## User Story

As a credential issuer, I want to revoke a credential I previously issued so that relying parties know it is no longer valid.

## Acceptance Criteria

- [ ] Given an issued credential, when the issuer revokes it, then the revocation is recorded
- [ ] Given a revoked credential, when a verifier checks its status, then the revocation is detectable
- [ ] Given a revocation event, when it occurs, then an audit trail is maintained
- [ ] Given revocation checking, when performed, then it's efficient and privacy-preserving

## Implementation Guidelines

- Implement Status List 2021 or similar revocation mechanism
- Integrate revocation with Credo framework
- Consider privacy-preserving revocation (no disclosure of which specific credential)
- Implement revocation UI for issuers

## Definition of Ready Checklist

- [x] Clear Description: The issue has a clear, unambiguous description
- [x] Acceptance Criteria: Specific, testable acceptance criteria defined
- [x] Priority Assigned: Medium
- [ ] Size Estimated: To be estimated
- [ ] Dependencies Identified: FR-0006, TR-0007
- [ ] Technical Approach Understood: Status List approach
- [ ] API Contract Defined: Revocation API needed
- [x] Security Considerations Documented: Revocation integrity critical
- [x] Privacy Impact Assessed: Privacy-preserving revocation
- [x] Multi-Tenancy Impact Assessed: Revocation is tenant-scoped
- [ ] No Open Questions: All questions answered

## Definition of Done Checklist

- [ ] Code Implemented: All acceptance criteria implemented
- [ ] Code Review Passed: At least one reviewer approved
- [ ] TypeScript Standards Met: Revocation types defined
- [ ] Tests Written: Revocation flow tests
- [ ] Audit Logging: Revocation events logged
- [ ] Security Scan Passed: No vulnerabilities
- [ ] Documentation Updated: Revocation guide
- [ ] Acceptance Testing Complete: Revocation flow tested
```

---

#### Issue: FR-0005 - Tenant Self-Provisioning

**Title:** 🏢 [FR-0005] Implement Tenant Self-Provisioning

**Labels:** `FR-0005`, `status:Backlog`, `priority:Low`, `type:Feature`

**Body:**

```markdown
## Description

In SaaS deployment mode, the system should allow organizations to self-register as tenants through an automated onboarding process.

**Requirement Reference:** [FR-0005](requirements.md#fr-0005-tenant-self-provisioning)

## User Story

As a new organization, I want to sign up for the Business Wallet SaaS service so that I can start using it quickly without manual approval processes.

## Acceptance Criteria

- [ ] Given the SaaS registration page, when an organization signs up, then a new tenant is provisioned
- [ ] Given registration, when completed, then the organization admin can immediately access their wallet
- [ ] Given tenant provisioning, when it occurs, then all required resources are created (database schemas, default roles)
- [ ] Given the onboarding flow, when completed, then the organization is guided through initial setup

## Implementation Guidelines

- Implement only for SaaS deployment mode (TR-0001)
- Create tenant provisioning service
- Implement email verification for organization admin
- Set up default roles and permissions
- Create onboarding wizard UI

## Definition of Ready Checklist

- [x] Clear Description: The issue has a clear, unambiguous description
- [x] Acceptance Criteria: Specific, testable acceptance criteria defined
- [x] Priority Assigned: Low (Nice-to-have)
- [ ] Size Estimated: To be estimated
- [ ] Dependencies Identified: TR-0001, TR-0002, TR-0004, FR-0002
- [ ] Technical Approach Understood: Self-service provisioning
- [ ] API Contract Defined: Registration API needed
- [ ] Security Considerations Documented: Registration security
- [ ] Privacy Impact Assessed: Organization data collection (GDPR)
- [x] Multi-Tenancy Impact Assessed: Creates new tenants
- [ ] UI Mockups Provided: Onboarding flow mockups needed
- [ ] No Open Questions: All questions answered

## Definition of Done Checklist

- [ ] Code Implemented: All acceptance criteria implemented
- [ ] Code Review Passed: At least one reviewer approved
- [ ] TypeScript Standards Met: Provisioning types defined
- [ ] Tests Written: Provisioning flow tests
- [ ] Email Verification: Working email flow
- [ ] Security Scan Passed: No vulnerabilities
- [ ] Documentation Updated: Onboarding guide
- [ ] Acceptance Testing Complete: Self-registration tested end-to-end
```

---

## Part 3: Implementation Checklist

### Label Creation (GitHub CLI Commands)

```bash
# Requirement Labels (Green for FR, Blue for TR)
gh label create "FR-0001" --color "0E8A16" --description "Web-Based User Interface"
gh label create "FR-0002" --color "0E8A16" --description "Role-Based Access Control"
gh label create "FR-0003" --color "0E8A16" --description "Custom Role Definition"
gh label create "FR-0004" --color "0E8A16" --description "Fine-Grained Resource Permissions"
gh label create "FR-0005" --color "0E8A16" --description "Tenant Self-Provisioning"
gh label create "FR-0006" --color "0E8A16" --description "Credential Issuance"
gh label create "FR-0007" --color "0E8A16" --description "Credential Type Agnosticism"
gh label create "FR-0008" --color "0E8A16" --description "Selective Disclosure"
gh label create "FR-0009" --color "0E8A16" --description "Credential Revocation"
gh label create "TR-0001" --color "1D76DB" --description "Unified Deployment Architecture"
gh label create "TR-0002" --color "1D76DB" --description "Tenant Data Isolation"
gh label create "TR-0003" --color "1D76DB" --description "REST API Architecture"
gh label create "TR-0004" --color "1D76DB" --description "OAuth2 API Authentication"
gh label create "TR-0005" --color "1D76DB" --description "Hybrid Permission Architecture"
gh label create "TR-0006" --color "1D76DB" --description "Multi-Format Credential Support"
gh label create "TR-0007" --color "1D76DB" --description "Cryptographic Verification"
gh label create "TR-0008" --color "1D76DB" --description "OpenID Federation Trust Establishment"

# Status Labels
gh label create "status:Backlog" --color "FBCA04" --description "Issue not yet refined or ready"
gh label create "status:Ready" --color "0E8A16" --description "Issue meets Definition of Ready"
gh label create "status:In-Progress" --color "1D76DB" --description "Issue is actively being worked on"
gh label create "status:In-Review" --color "6F42C1" --description "Issue is in code review or testing"
gh label create "status:Done" --color "0D1117" --description "Issue meets Definition of Done"

# Priority Labels
gh label create "priority:Critical" --color "B60205" --description "Must be completed for MVP"
gh label create "priority:High" --color "D93F0B" --description "Important for full functionality"
gh label create "priority:Medium" --color "FBCA04" --description "Enhances the system"
gh label create "priority:Low" --color "C2E0C6" --description "Nice to have"

# Type Labels
gh label create "type:Feature" --color "A2EEEF" --description "New functionality"
gh label create "type:Bug" --color "D73A4A" --description "Something isn't working"
gh label create "type:Task" --color "D4C5F9" --description "Technical task or chore"
gh label create "type:Spike" --color "F9D0C4" --description "Research or investigation"
```

### Issue Creation Order

| Order | Issue | Requirement | Dependencies |
|-------|-------|-------------|--------------|
| 1 | Unified Deployment Architecture | TR-0001 | None |
| 2 | REST API Architecture | TR-0003 | TR-0001 |
| 3 | Tenant Data Isolation | TR-0002 | TR-0001 |
| 4 | OAuth2 API Authentication | TR-0004 | TR-0001, TR-0003 |
| 5 | Role-Based Access Control | FR-0002 | TR-0004, TR-0002 |
| 6 | Hybrid Permission Architecture | TR-0005 | FR-0002, TR-0004 |
| 7 | Multi-Format Credential Support | TR-0006 | TR-0001, TR-0003 |
| 8 | Cryptographic Verification | TR-0007 | TR-0006 |
| 9 | Credential Issuance | FR-0006 | TR-0006, TR-0007, TR-0004, FR-0002 |
| 10 | Web-Based User Interface | FR-0001 | TR-0003, TR-0004 |
| 11 | Credential Type Agnosticism | FR-0007 | TR-0006, FR-0006 |
| 12 | Selective Disclosure | FR-0008 | TR-0006, TR-0007 |
| 13 | Custom Role Definition | FR-0003 | FR-0002, TR-0005 |
| 14 | Fine-Grained Resource Permissions | FR-0004 | TR-0005, FR-0002 |
| 15 | OpenID Federation Trust Establishment | TR-0008 | TR-0007 |
| 16 | Credential Revocation | FR-0009 | FR-0006, TR-0007 |
| 17 | Tenant Self-Provisioning | FR-0005 | TR-0001, TR-0002, TR-0004, FR-0002 |

---

## Part 4: Project Board Setup

### Columns (in order)

1. **Backlog** - Issues waiting for refinement
2. **Ready** - Issues that meet DoR, ready to be pulled
3. **In Progress** - Issues currently being worked on
4. **In Review** - Issues under code review or testing
5. **Done** - Completed issues

### Automation Rules

- When issue is labeled `status:Ready`, move to "Ready" column
- When issue is labeled `status:In-Progress`, move to "In Progress" column
- When issue is labeled `status:In-Review`, move to "In Review" column
- When issue is labeled `status:Done` or closed, move to "Done" column
