import type { VcTypeMetadata } from '../types/credentials';

/**
 * The URI that identifies the employee credential type and serves as the `vct` claim
 * value in issued credentials.  The well-known metadata endpoint is mounted at
 * `/.well-known/vct/employee` to serve this document.
 */
export const EMPLOYEE_VCT_URI =
  process.env.EMPLOYEE_VCT_URI ??
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
