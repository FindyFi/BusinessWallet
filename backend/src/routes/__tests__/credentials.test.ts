import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import type { CredoAgent } from '../../agent/credoAgent';

// Mock the credoAgent module before importing the app
vi.mock('../../agent/credoAgent', () => {
  const mockSign = vi.fn();
  const mockAgent: Partial<CredoAgent> = {
    sdJwtVc: { sign: mockSign } as unknown as CredoAgent['sdJwtVc'],
  };
  return {
    getCredoAgent: vi.fn(() => mockAgent),
    getIssuerDidUrl: vi.fn(() => 'did:key:zMockKey#key-1'),
  };
});

// Import after mocking so the mock is used by the router
import app from '../../app';
import { getCredoAgent } from '../../agent/credoAgent';
import { EMPLOYEE_VC_TYPE_METADATA } from '../../services/employeeCredentialService';

// A fake compact SD-JWT VC with a decodable header
const FAKE_HEADER = Buffer.from(JSON.stringify({ alg: 'ES256', typ: 'vc+sd-jwt' })).toString('base64url');
const FAKE_COMPACT = `${FAKE_HEADER}.eyJwYXlsb2FkIjoiZmFrZSJ9.c2lnbmF0dXJl~disc~`;

function getMockSign(): ReturnType<typeof vi.fn> {
  const agent = getCredoAgent() as unknown as { sdJwtVc: { sign: ReturnType<typeof vi.fn> } };
  return agent.sdJwtVc.sign;
}

/** Builds a valid request body for POST /credentials/employee. */
function buildValidBody(overrides?: Record<string, unknown>): Record<string, unknown> {
  return {
    firstName: 'Jane',
    lastName: 'Doe',
    jobTitle: 'Software Engineer',
    startDate: '2024-01-15',
    ...overrides,
  };
}

describe('POST /credentials/employee', () => {
  beforeEach(() => {
    getMockSign().mockReset();
    getMockSign().mockResolvedValue({ compact: FAKE_COMPACT });
  });

  // --- Happy path ---

  it('returns 201 with credential and format on success', async () => {
    const res = await request(app)
      .post('/credentials/employee')
      .send(buildValidBody())
      .expect(201);

    expect(res.body).toEqual({
      credential: FAKE_COMPACT,
      format: 'vc+sd-jwt',
    });
  });

  it('returns a compact string whose header decodes to typ vc+sd-jwt and alg ES256', async () => {
    const res = await request(app)
      .post('/credentials/employee')
      .send(buildValidBody())
      .expect(201);

    const [headerB64] = (res.body.credential as string).split('.');
    const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString()) as Record<string, unknown>;
    expect(header).toMatchObject({ alg: 'ES256', typ: 'vc+sd-jwt' });
  });

  it('returns 201 when optional endDate is provided', async () => {
    const res = await request(app)
      .post('/credentials/employee')
      .send(buildValidBody({ endDate: '2025-12-31' }))
      .expect(201);

    expect(res.body).toHaveProperty('credential');
    expect(res.body).toHaveProperty('format', 'vc+sd-jwt');
  });

  // --- Validation errors ---

  it('returns 400 when firstName is missing', async () => {
    const { firstName: _, ...body } = buildValidBody();
    void _;
    const res = await request(app)
      .post('/credentials/employee')
      .send(body)
      .expect(400);

    expect(res.body).toMatchObject({
      error: 'VALIDATION_ERROR',
      message: expect.stringContaining('firstName') as string,
    });
  });

  it('returns 400 when lastName is missing', async () => {
    const { lastName: _, ...body } = buildValidBody();
    void _;
    const res = await request(app)
      .post('/credentials/employee')
      .send(body)
      .expect(400);

    expect(res.body).toMatchObject({
      error: 'VALIDATION_ERROR',
      message: expect.stringContaining('lastName') as string,
    });
  });

  it('returns 400 when jobTitle is missing', async () => {
    const { jobTitle: _, ...body } = buildValidBody();
    void _;
    const res = await request(app)
      .post('/credentials/employee')
      .send(body)
      .expect(400);

    expect(res.body).toMatchObject({
      error: 'VALIDATION_ERROR',
      message: expect.stringContaining('jobTitle') as string,
    });
  });

  it('returns 400 when startDate is missing', async () => {
    const { startDate: _, ...body } = buildValidBody();
    void _;
    const res = await request(app)
      .post('/credentials/employee')
      .send(body)
      .expect(400);

    expect(res.body).toMatchObject({
      error: 'VALIDATION_ERROR',
      message: expect.stringContaining('startDate') as string,
    });
  });

  it('returns 400 when a required field is an empty string', async () => {
    const res = await request(app)
      .post('/credentials/employee')
      .send(buildValidBody({ firstName: '' }))
      .expect(400);

    expect(res.body).toMatchObject({ error: 'VALIDATION_ERROR' });
  });

  it('returns 400 when startDate is not a valid ISO 8601 date', async () => {
    const res = await request(app)
      .post('/credentials/employee')
      .send(buildValidBody({ startDate: 'not-a-date' }))
      .expect(400);

    expect(res.body).toMatchObject({
      error: 'VALIDATION_ERROR',
      message: expect.stringContaining('startDate') as string,
    });
  });

  it('returns 400 when startDate has an impossible calendar date', async () => {
    const res = await request(app)
      .post('/credentials/employee')
      .send(buildValidBody({ startDate: '2024-02-30' }))
      .expect(400);

    expect(res.body).toMatchObject({ error: 'VALIDATION_ERROR' });
  });

  it('returns 400 when endDate is not a valid ISO 8601 date', async () => {
    const res = await request(app)
      .post('/credentials/employee')
      .send(buildValidBody({ endDate: '31-12-2025' }))
      .expect(400);

    expect(res.body).toMatchObject({
      error: 'VALIDATION_ERROR',
      message: expect.stringContaining('endDate') as string,
    });
  });

  it('returns 400 when endDate is an empty string', async () => {
    const res = await request(app)
      .post('/credentials/employee')
      .send(buildValidBody({ endDate: '' }))
      .expect(400);

    expect(res.body).toMatchObject({ error: 'VALIDATION_ERROR' });
  });

  // --- Agent / issuance errors ---

  it('returns 500 with ISSUANCE_ERROR when the agent throws', async () => {
    getMockSign().mockRejectedValue(new Error('Agent unavailable'));

    const res = await request(app)
      .post('/credentials/employee')
      .send(buildValidBody())
      .expect(500);

    expect(res.body).toMatchObject({
      error: 'ISSUANCE_ERROR',
      message: 'Failed to issue employee credential',
    });
  });
});

describe('GET /.well-known/vct/employee', () => {
  it('returns 200 with the VC Type Metadata document', async () => {
    const res = await request(app)
      .get('/.well-known/vct/employee')
      .expect(200);

    expect(res.body).toEqual(EMPLOYEE_VC_TYPE_METADATA);
  });

  it('includes the correct vct URI in the metadata', async () => {
    const res = await request(app)
      .get('/.well-known/vct/employee')
      .expect(200);

    expect(res.body).toHaveProperty('vct');
    expect(typeof res.body.vct).toBe('string');
  });

  it('lists all employee claims in the metadata', async () => {
    const res = await request(app)
      .get('/.well-known/vct/employee')
      .expect(200);

    const claimPaths = (res.body.claims as Array<{ path: string[] }>).map((c) => c.path[0]);
    expect(claimPaths).toContain('firstName');
    expect(claimPaths).toContain('lastName');
    expect(claimPaths).toContain('jobTitle');
    expect(claimPaths).toContain('startDate');
    expect(claimPaths).toContain('endDate');
  });
});
