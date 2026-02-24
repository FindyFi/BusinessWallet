import type { VcTypeMetadata, EmployeeCredentialRequest } from '../types/credentials';
import type { CredoAgent } from '../agent/credoAgent';

/**
 * The URI that identifies the employee credential type and serves as the `vct` claim
 * value in issued credentials.  The well-known metadata endpoint is mounted at
 * `/.well-known/vct/employee` to serve this document.
 */
export const EMPLOYEE_VCT_URI =
  process.env['EMPLOYEE_VCT_URI'] ??
  'https://businesswallet.example.com/credentials/types/employee/v1';

/**
 * SD-JWT VC Type Metadata for the employee credential type.
 *
 * @see https://www.ietf.org/archive/id/draft-ietf-oauth-sd-jwt-vc-13.html#name-sd-jwt-vc-type-metadata
 */
export const EMPLOYEE_VC_TYPE_METADATA: VcTypeMetadata = {
  vct: EMPLOYEE_VCT_URI,
  name: 'Employee Credential',
  description:
    "A verifiable credential confirming a person's employment status and role within an organization.",
  display: [
    {
      lang: 'en',
      name: 'Employee Credential',
      description:
        "A verifiable credential confirming a person's employment status and role within an organization.",
    },
  ],
  claims: [
    {
      path: ['firstName'],
      sd: 'allowed',
      display: [{ lang: 'en', label: 'First Name' }],
    },
    {
      path: ['lastName'],
      sd: 'allowed',
      display: [{ lang: 'en', label: 'Last Name' }],
    },
    {
      path: ['jobTitle'],
      sd: 'allowed',
      display: [{ lang: 'en', label: 'Job Title' }],
    },
    {
      path: ['startDate'],
      sd: 'allowed',
      display: [{ lang: 'en', label: 'Start Date' }],
    },
    {
      path: ['endDate'],
      sd: 'allowed',
      display: [{ lang: 'en', label: 'End Date' }],
    },
  ],
} as const;

/**
 * Issues an SD-JWT VC employee credential using the Credo agent.
 *
 * All five employee claims are made selectively disclosable so that the holder
 * can choose which claims to reveal to a verifier (FR-0008 / FR-0010).
 *
 * The credential is issued as a bearer VC (no holder key binding) which is
 * appropriate for the REST API issuance flow (FR-0011).  Holder binding can be
 * added in a later iteration when the holder's DID or JWK is provided.
 *
 * @param agent        - Initialised Credo agent (AC-0013)
 * @param issuerDidUrl - Verification method DID URL used to sign the credential
 * @param request      - Validated employee data from the API request body
 * @returns            Compact SD-JWT VC string (e.g. `header.payload.sig~disc~`)
 */
export async function issueEmployeeCredential(
  agent: CredoAgent,
  issuerDidUrl: string,
  request: EmployeeCredentialRequest,
): Promise<string> {
  // Build the payload; iss is the bare DID (without the fragment/key reference)
  const issuerDid = issuerDidUrl.split('#')[0];
  const payload: Record<string, unknown> = {
    vct: EMPLOYEE_VCT_URI,
    iss: issuerDid,
    iat: Math.floor(Date.now() / 1000),
    firstName: request.firstName,
    lastName: request.lastName,
    jobTitle: request.jobTitle,
    startDate: request.startDate,
    ...(request.endDate !== undefined ? { endDate: request.endDate } : {}),
  };

  // Mark all present claims as selectively disclosable (FR-0008, FR-0010)
  const sdClaims = ['firstName', 'lastName', 'jobTitle', 'startDate'];
  if (request.endDate !== undefined) sdClaims.push('endDate');

  const { compact } = await agent.sdJwtVc.sign({
    payload,
    issuer: { method: 'did', didUrl: issuerDidUrl },
    disclosureFrame: { _sd: sdClaims },
  });

  return compact;
}
