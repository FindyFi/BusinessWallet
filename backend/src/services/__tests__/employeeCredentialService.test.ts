import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  issueEmployeeCredential,
  EMPLOYEE_VCT_URI,
  EMPLOYEE_VC_TYPE_METADATA,
} from '../employeeCredentialService';
import type { EmployeeCredentialRequest } from '../../types/credentials';
import type { CredoAgent } from '../../agent/credoAgent';

/** Creates a mock Credo agent with a stubbed sdJwtVc.sign method. */
function createMockAgent(compact: string): CredoAgent {
  return {
    sdJwtVc: {
      sign: vi.fn().mockResolvedValue({ compact }),
    },
  } as unknown as CredoAgent;
}

/** Builds a valid employee credential request for use in tests. */
function buildValidRequest(overrides?: Partial<EmployeeCredentialRequest>): EmployeeCredentialRequest {
  return {
    firstName: 'Jane',
    lastName: 'Doe',
    jobTitle: 'Software Engineer',
    startDate: '2024-01-15',
    ...overrides,
  };
}

const MOCK_ISSUER_DID_URL = 'did:key:zDnaeq1234#key-1';
const MOCK_ISSUER_DID = 'did:key:zDnaeq1234';

// A fake SD-JWT VC compact string with a valid base64url-encoded header
// Header: {"alg":"ES256","typ":"vc+sd-jwt"}
const MOCK_HEADER = Buffer.from(JSON.stringify({ alg: 'ES256', typ: 'vc+sd-jwt' })).toString('base64url');
const MOCK_COMPACT = `${MOCK_HEADER}.eyJwYXlsb2FkIjoiZmFrZSJ9.c2lnbmF0dXJl~disc1~disc2~`;

describe('issueEmployeeCredential', () => {
  let mockAgent: CredoAgent;

  beforeEach(() => {
    mockAgent = createMockAgent(MOCK_COMPACT);
  });

  it('returns a compact SD-JWT VC string', async () => {
    const request = buildValidRequest();
    const result = await issueEmployeeCredential(mockAgent, MOCK_ISSUER_DID_URL, request);

    expect(result).toBe(MOCK_COMPACT);
  });

  it('calls agent.sdJwtVc.sign with the correct payload and disclosure frame', async () => {
    const request = buildValidRequest();
    await issueEmployeeCredential(mockAgent, MOCK_ISSUER_DID_URL, request);

    const signMock = vi.mocked(mockAgent.sdJwtVc.sign);
    expect(signMock).toHaveBeenCalledOnce();

    const callArg = signMock.mock.calls[0][0];
    expect(callArg.payload).toMatchObject({
      vct: EMPLOYEE_VCT_URI,
      iss: MOCK_ISSUER_DID,
      firstName: 'Jane',
      lastName: 'Doe',
      jobTitle: 'Software Engineer',
      startDate: '2024-01-15',
    });
    expect(callArg.payload).toHaveProperty('iat');
    expect(callArg.payload).not.toHaveProperty('endDate');
    expect(callArg.issuer).toEqual({ method: 'did', didUrl: MOCK_ISSUER_DID_URL });
    expect(callArg.disclosureFrame).toEqual({
      _sd: ['firstName', 'lastName', 'jobTitle', 'startDate'],
    });
  });

  it('includes endDate in payload and disclosure frame when provided', async () => {
    const request = buildValidRequest({ endDate: '2025-12-31' });
    await issueEmployeeCredential(mockAgent, MOCK_ISSUER_DID_URL, request);

    const signMock = vi.mocked(mockAgent.sdJwtVc.sign);
    const callArg = signMock.mock.calls[0][0];

    expect(callArg.payload).toHaveProperty('endDate', '2025-12-31');
    expect(callArg.disclosureFrame).toEqual({
      _sd: ['firstName', 'lastName', 'jobTitle', 'startDate', 'endDate'],
    });
  });

  it('strips the fragment from issuerDidUrl to derive the iss claim', async () => {
    const request = buildValidRequest();
    await issueEmployeeCredential(mockAgent, 'did:key:zABC#key-99', request);

    const signMock = vi.mocked(mockAgent.sdJwtVc.sign);
    expect(signMock.mock.calls[0][0].payload).toHaveProperty('iss', 'did:key:zABC');
  });

  it('sets iat to a recent Unix timestamp', async () => {
    const before = Math.floor(Date.now() / 1000);
    const request = buildValidRequest();
    await issueEmployeeCredential(mockAgent, MOCK_ISSUER_DID_URL, request);
    const after = Math.floor(Date.now() / 1000);

    const signMock = vi.mocked(mockAgent.sdJwtVc.sign);
    const iat = signMock.mock.calls[0][0].payload['iat'] as number;
    expect(iat).toBeGreaterThanOrEqual(before);
    expect(iat).toBeLessThanOrEqual(after);
  });

  it('propagates errors thrown by the agent', async () => {
    const failingAgent = {
      sdJwtVc: {
        sign: vi.fn().mockRejectedValue(new Error('Signing failed')),
      },
    } as unknown as CredoAgent;

    const request = buildValidRequest();
    await expect(
      issueEmployeeCredential(failingAgent, MOCK_ISSUER_DID_URL, request),
    ).rejects.toThrow('Signing failed');
  });
});

describe('EMPLOYEE_VC_TYPE_METADATA', () => {
  it('has the correct vct URI', () => {
    expect(EMPLOYEE_VC_TYPE_METADATA.vct).toBe(EMPLOYEE_VCT_URI);
  });

  it('includes all employee claim paths', () => {
    const paths = EMPLOYEE_VC_TYPE_METADATA.claims?.map((c) => c.path[0]);
    expect(paths).toEqual(['firstName', 'lastName', 'jobTitle', 'startDate', 'endDate']);
  });

  it('marks all claims as selectively disclosable', () => {
    for (const claim of EMPLOYEE_VC_TYPE_METADATA.claims ?? []) {
      expect(claim.sd).toBe('allowed');
    }
  });
});
