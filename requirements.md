# Business Wallet Requirements Specification

**Version:** 0.2.0  
**Last Updated:** 2026-02-07  
**Status:** Draft

## Document Overview

The Business Wallet is a versatile communication tool designed for organizations. It enables users to issue, store, share, and request digital credentials, as well as transmit and receive electronic documents through registered delivery services. This document captures the functional and technical requirements for the Business Wallet system.

**Key Capabilities:**
- Issue digital credentials to others
- Store credentials and documents securely
- Share verified credentials with third parties
- Request credentials from others
- Transmit and receive electronic documents through registered delivery services

**Key Characteristics:**
- Machine-readable credential formats
- Cross-border interoperability
- Automation capabilities
- Integration with core business systems (ERP, CRM, etc.)
- Verifiable digital identity infrastructure

## Functional Requirements

### FR-0001: Web-Based User Interface
**Description:** The Business Wallet shall provide a web-based user interface accessible via modern web browsers. The UI shall enable users to perform all credential and document management operations without requiring desktop or mobile application installation.

**Priority:** Critical  
**Status:** Proposed

---

### FR-0002: Role-Based Access Control
**Description:** The system shall support role-based access control with predefined system roles. Users shall be assigned one or more roles that determine their base-level permissions within the organization.

**Priority:** Critical  
**Status:** Proposed

---

### FR-0003: Custom Role Definition
**Description:** Organizations shall be able to define custom roles beyond the predefined system roles. Custom roles shall be composable from available permissions and assignable to users within the organization.

**Priority:** High  
**Status:** Proposed

---

### FR-0004: Fine-Grained Resource Permissions
**Description:** Beyond role-based permissions, the system shall support fine-grained permissions at the individual resource level. This enables restricting or granting access to specific credential types, document categories, or other resources independent of role assignments.

**Priority:** High  
**Status:** Proposed

---

### FR-0005: Tenant Self-Provisioning
**Description:** In SaaS deployment mode, the system should allow organizations to self-register as tenants through an automated onboarding process.

**Priority:** Low (Nice-to-have)  
**Status:** Proposed

---

## Technical Requirements

### TR-0001: Unified Deployment Architecture
**Description:** The Business Wallet shall use a single codebase supporting both on-premises and multi-tenant SaaS deployments. Deployment mode shall be configurable through environment variables or configuration files without code changes.

**Rationale:** Reduces maintenance overhead, ensures feature parity between deployment modes, and simplifies development.

**Priority:** Critical  
**Status:** Proposed

---

### TR-0002: Tenant Data Isolation
**Description:** In multi-tenant SaaS deployment, the system shall ensure complete data isolation between tenants. No tenant shall be able to access, view, or infer data belonging to another tenant.

**Rationale:** Data isolation is fundamental for security, privacy, and regulatory compliance in multi-tenant systems.

**Priority:** Critical  
**Status:** Proposed

---

### TR-0003: REST API Architecture
**Description:** The system shall expose all functionality through RESTful APIs following OpenAPI 3.0+ specification. APIs shall enable integration with organization core systems (ERP, CRM, etc.) and support both synchronous and asynchronous operations where appropriate.

**Rationale:** REST APIs provide broad compatibility, well-understood patterns, and extensive tooling support for enterprise integrations.

**Priority:** Critical  
**Status:** Proposed

---

### TR-0004: OAuth2 API Authentication
**Description:** API authentication shall use OAuth2 protocol. OAuth2 scopes shall map to the internal permission model, enabling API clients to request specific permissions aligned with the RBAC and resource-based permission system.

**Rationale:** OAuth2 is the industry standard for API authentication, provides token-based security, and supports scope-based permission delegation.

**Priority:** Critical  
**Status:** Proposed

---

### TR-0005: Hybrid Permission Architecture
**Description:** The permission system architecture shall combine Role-Based Access Control (RBAC) with fine-grained resource-based permissions (Attribute-Based Access Control patterns). The architecture shall support:
- Predefined system roles
- Custom organization-defined roles
- Per-resource permission overrides
- Permission inheritance and composition

**Rationale:** Hybrid model provides administrative simplicity of roles while enabling precise access control when needed.

**Priority:** Critical  
**Status:** Proposed

---

## Glossary

**Business Wallet:** A digital solution enabling organizations to manage, issue, store, share, and request verifiable credentials and documents.

**Credential:** A digitally signed attestation containing claims about a subject, issued by an authority.

**Verifiable Credential (VC):** A tamper-evident credential with authorship that can be cryptographically verified, following the W3C VC Data Model.

**Issuer:** An entity that creates and signs credentials for holders.

**Holder:** An entity that possesses credentials and can present them to verifiers.

**Verifier:** An entity that receives and validates credentials presented by holders.

**eIDAS:** European Union regulation on electronic identification and trust services.

**GDPR:** General Data Protection Regulation - EU regulation on data protection and privacy.

**OpenID4VC:** OpenID for Verifiable Credentials - protocols for credential issuance and presentation.

**Registered Delivery Service:** A service providing proof of sending and/or receiving electronic documents.

**RBAC (Role-Based Access Control):** Access control model where permissions are associated with roles, and users are assigned to roles.

**ABAC (Attribute-Based Access Control):** Access control model where access decisions are based on attributes of users, resources, and environment.

**OAuth2:** Industry-standard protocol for authorization, enabling third-party applications to obtain limited access to resources.

**Multi-tenant:** Software architecture where a single instance serves multiple organizations (tenants) with logical data separation.

**On-premises:** Software deployed and operated on the customer's own infrastructure rather than in the cloud.

