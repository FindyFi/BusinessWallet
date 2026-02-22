/**
 * Types for verifiable credential operations, aligned with the OpenAPI specification
 * and the SD-JWT VC specification (draft-ietf-oauth-sd-jwt-vc).
 */

/** Request body for issuing an employee credential. */
export interface EmployeeCredentialRequest {
  /** The employee's given (first) name. */
  readonly firstName: string;
  /** The employee's family (last) name. */
  readonly lastName: string;
  /** The employee's job title or position within the organization. */
  readonly jobTitle: string;
  /** ISO 8601 date (YYYY-MM-DD) when the employee started in the current position. */
  readonly startDate: string;
  /** ISO 8601 date (YYYY-MM-DD) when the position ended. Omit if still active. */
  readonly endDate?: string;
}

/** Response body returned after successfully issuing an employee credential. */
export interface EmployeeCredentialResponse {
  /** The issued SD-JWT VC in compact serialization format. */
  readonly credential: string;
  /** The credential format identifier. */
  readonly format: 'vc+sd-jwt';
}

/** Localized display entry for a credential type or claim. */
export interface VcTypeDisplay {
  readonly lang: string;
  readonly name: string;
  readonly description?: string;
}

/** Display entry for a single claim within VC Type Metadata. */
export interface ClaimDisplay {
  readonly lang: string;
  readonly label: string;
}

/** Definition of a single claim within VC Type Metadata. */
export interface ClaimDefinition {
  /** JSON path components pointing to the claim value in the credential. */
  readonly path: readonly string[];
  /** Whether the claim may be selectively disclosed. */
  readonly sd: 'always' | 'allowed' | 'never';
  readonly display?: readonly ClaimDisplay[];
}

/**
 * SD-JWT VC Type Metadata document as specified in draft-ietf-oauth-sd-jwt-vc.
 * @see https://www.ietf.org/archive/id/draft-ietf-oauth-sd-jwt-vc-13.html#name-sd-jwt-vc-type-metadata
 */
export interface VcTypeMetadata {
  /** URI uniquely identifying this credential type. */
  readonly vct: string;
  /** Human-readable name for this credential type. */
  readonly name: string;
  readonly description?: string;
  readonly display?: readonly VcTypeDisplay[];
  readonly claims?: readonly ClaimDefinition[];
}

/** Standard error response. */
export interface ErrorResponse {
  readonly error: string;
  readonly message: string;
}
