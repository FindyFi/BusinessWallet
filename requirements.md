# Business Wallet Requirements Specification

**Version:** 0.3.0  
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

### FR-0006: Credential Issuance
**Description:** The system shall enable organizations to issue digital credentials to subjects (individuals, organizations, or other entities). Credentials are issued directly by the organization that owns the wallet; delegation or proxy issuance on behalf of other organizations is not supported.

**User Story:**  
As an organization administrator, I want to issue digital credentials to employees, partners, or customers so that they can prove their relationship or qualifications to third parties.

**Acceptance Criteria:**  
- Given an authorized user, when they create a credential, then the credential is signed with the organization's cryptographic keys
- Given a credential template, when a user issues a credential, then all required claims are populated
- Given an issuance request, when the credential is created, then it is stored and made available to the holder

**Priority:** Critical  
**Status:** Proposed

---

### FR-0007: Credential Type Agnosticism
**Description:** The system shall be agnostic to credential types and support any credential schema. The system shall not be limited to predefined credential types but shall allow organizations to define and use custom credential schemas for any use case (employment verification, professional certifications, business certifications, legal documents, supplier qualifications, etc.).

**User Story:**  
As an organization administrator, I want to define custom credential schemas so that I can issue credentials for any business need without system limitations.

**Acceptance Criteria:**  
- Given any valid credential schema, when an organization configures it, then the system accepts and stores the schema
- Given a custom schema, when a credential is issued using it, then the credential conforms to the schema structure
- Given multiple credential types, when viewing the wallet, then all types are displayed uniformly

**Priority:** High  
**Status:** Proposed

---

### FR-0008: Selective Disclosure
**Description:** The system shall support selective disclosure, allowing credential holders to share only specific claims from a credential without revealing the entire credential content. This enables privacy-preserving presentations where holders can prove specific attributes (e.g., "over 18") without disclosing unnecessary information (e.g., exact birthdate).

**User Story:**  
As a credential holder, I want to share only specific claims from my credential so that I can prove what is necessary without revealing my complete personal data.

**Acceptance Criteria:**  
- Given a credential with multiple claims, when presenting to a verifier, then the holder can select which claims to disclose
- Given a selective disclosure request, when the presentation is created, then undisclosed claims are cryptographically hidden
- Given a selectively disclosed credential, when verified, then only the disclosed claims are visible to the verifier

**Priority:** High  
**Status:** Proposed

---

### FR-0009: Credential Revocation
**Description:** The system shall support credential revocation, allowing issuers to invalidate previously issued credentials. Revocation status shall be verifiable by relying parties.

**User Story:**  
As a credential issuer, I want to revoke a credential I previously issued so that relying parties know it is no longer valid.

**Acceptance Criteria:**  
- Given an issued credential, when the issuer revokes it, then the revocation is recorded
- Given a revoked credential, when a verifier checks its status, then the revocation is detectable
- Given a revocation event, when it occurs, then an audit trail is maintained

**Priority:** Medium  
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

### TR-0006: Multi-Format Credential Support
**Description:** The system shall support multiple credential format standards:
- **SD-JWT VC (Selective Disclosure JWT Verifiable Credentials):** JSON-based credentials with built-in selective disclosure capabilities
- **W3C Verifiable Credentials Data Model (VC DM):** JSON-LD based credentials following the W3C standard

The system shall be capable of issuing, storing, presenting, and verifying credentials in both formats. Format selection shall be configurable per credential type or issuance.

**Rationale:** Supporting both SD-JWT VC and W3C VC DM ensures interoperability with different ecosystems. SD-JWT VC provides efficient selective disclosure, while W3C VC DM offers semantic interoperability through JSON-LD.

**Priority:** Critical  
**Status:** Proposed

---

### TR-0007: Cryptographic Verification
**Description:** Credential verification shall rely primarily on cryptographic proof validation. The system shall verify credentials by:
- Validating digital signatures against the issuer's public key
- Checking credential integrity (tamper detection)
- Verifying proof formats (e.g., JWS, Data Integrity Proofs)

Verification shall be self-contained and not require real-time communication with the issuer for basic validity checks.

**Rationale:** Cryptographic verification provides offline capability, reduces latency, and maintains privacy by not notifying issuers of verification events.

**Priority:** Critical  
**Status:** Proposed

---

### TR-0008: OpenID Federation Trust Establishment
**Description:** The system shall support OpenID Federation for establishing trust between verifiers and issuers. This enables:
- Dynamic discovery of issuer metadata and public keys
- Hierarchical trust chains through trust anchors
- Automated trust policy evaluation
- Federation-based issuer validation

**Rationale:** OpenID Federation provides a scalable, standards-based approach to trust establishment that supports cross-organizational and cross-border credential verification without requiring manual trust configuration.

**Priority:** High  
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

**SD-JWT VC (Selective Disclosure JWT Verifiable Credential):** A credential format based on JSON Web Tokens that supports selective disclosure of claims, allowing holders to reveal only specific attributes.

**W3C VC DM (W3C Verifiable Credentials Data Model):** A W3C standard defining the data model for verifiable credentials using JSON-LD for semantic interoperability.

**Selective Disclosure:** The capability for a credential holder to present only specific claims from a credential without revealing all contained information.

**OpenID Federation:** A specification for establishing trust between parties in a federated manner, enabling dynamic discovery of metadata and trust chain validation.

**Trust Anchor:** A trusted entity at the top of a trust chain that vouches for subordinate entities in a federation.

**Credential Schema:** A formal definition of the structure and data types of claims within a credential.

**Revocation:** The process by which an issuer invalidates a previously issued credential, making it no longer valid.

**Cryptographic Proof:** Mathematical evidence that a credential was issued by a specific entity and has not been tampered with.

