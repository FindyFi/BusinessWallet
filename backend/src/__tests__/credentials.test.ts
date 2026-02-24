/**
 * End-to-end tests for the Employee Credential API.
 *
 * Covers the full credential lifecycle: issuance, verification, and selective
 * disclosure (FR-0010, FR-0011, FR-0008, TR-0009).
 */
import request from 'supertest';
import app from '../app';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Issues an employee credential via the REST API using the default required
 * fields, returning the compact SD-JWT VC string.
 */
async function issueCredential(
  overrides: Partial<{
    firstName: string;
    lastName: string;
    jobTitle: string;
    startDate: string;
    endDate: string;
  }> = {},
): Promise<string> {
  const body = {
    firstName: 'Jane',
    lastName: 'Doe',
    jobTitle: 'Software Engineer',
    startDate: '2024-01-15',
    ...overrides,
  };
  const response = await request(app).post('/credentials/employee').send(body);
  expect(response.status).toBe(201);
  return response.body.credential as string;
}

// ---------------------------------------------------------------------------
// POST /credentials/employee — Issuance
// ---------------------------------------------------------------------------

describe('POST /credentials/employee', () => {
  it('issues an SD-JWT VC with all required fields', async () => {
    const response = await request(app).post('/credentials/employee').send({
      firstName: 'Jane',
      lastName: 'Doe',
      jobTitle: 'Software Engineer',
      startDate: '2024-01-15',
    });

    expect(response.status).toBe(201);
    expect(response.body.format).toBe('vc+sd-jwt');
    expect(typeof response.body.credential).toBe('string');

    // Compact SD-JWT: JWT ~ disc1 ~ disc2 ~ disc3 ~ disc4 ~ (trailing ~)
    const parts = (response.body.credential as string).split('~');
    // At least: JWT + 4 disclosures + trailing empty = 6 segments
    expect(parts.length).toBeGreaterThanOrEqual(6);
  });

  it('includes endDate disclosure when the optional field is provided', async () => {
    const response = await request(app).post('/credentials/employee').send({
      firstName: 'John',
      lastName: 'Smith',
      jobTitle: 'Manager',
      startDate: '2023-06-01',
      endDate: '2024-12-31',
    });

    expect(response.status).toBe(201);
    const parts = (response.body.credential as string).split('~');
    // JWT + 5 disclosures + trailing empty = 7 segments
    expect(parts.length).toBeGreaterThanOrEqual(7);
  });

  it('returns 400 when firstName is missing', async () => {
    const response = await request(app)
      .post('/credentials/employee')
      .send({ lastName: 'Doe', jobTitle: 'Engineer', startDate: '2024-01-15' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('VALIDATION_ERROR');
    expect(response.body.message).toContain('firstName');
  });

  it('returns 400 when lastName is missing', async () => {
    const response = await request(app)
      .post('/credentials/employee')
      .send({ firstName: 'Jane', jobTitle: 'Engineer', startDate: '2024-01-15' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('VALIDATION_ERROR');
    expect(response.body.message).toContain('lastName');
  });

  it('returns 400 when jobTitle is missing', async () => {
    const response = await request(app)
      .post('/credentials/employee')
      .send({ firstName: 'Jane', lastName: 'Doe', startDate: '2024-01-15' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('VALIDATION_ERROR');
    expect(response.body.message).toContain('jobTitle');
  });

  it('returns 400 when startDate is missing', async () => {
    const response = await request(app)
      .post('/credentials/employee')
      .send({ firstName: 'Jane', lastName: 'Doe', jobTitle: 'Engineer' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('VALIDATION_ERROR');
    expect(response.body.message).toContain('startDate');
  });

  it('returns 400 when startDate is not a valid ISO 8601 date', async () => {
    const response = await request(app).post('/credentials/employee').send({
      firstName: 'Jane',
      lastName: 'Doe',
      jobTitle: 'Engineer',
      startDate: 'not-a-date',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when startDate contains an impossible date (e.g. Feb 30)', async () => {
    const response = await request(app).post('/credentials/employee').send({
      firstName: 'Jane',
      lastName: 'Doe',
      jobTitle: 'Engineer',
      startDate: '2024-02-30',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when endDate is not a valid ISO 8601 date', async () => {
    const response = await request(app).post('/credentials/employee').send({
      firstName: 'Jane',
      lastName: 'Doe',
      jobTitle: 'Engineer',
      startDate: '2024-01-15',
      endDate: '31-12-2024',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('VALIDATION_ERROR');
  });
});

// ---------------------------------------------------------------------------
// POST /credentials/employee/verify — Verification
// ---------------------------------------------------------------------------

describe('POST /credentials/employee/verify', () => {
  it('verifies a valid credential and returns all disclosed claims', async () => {
    const credential = await issueCredential();

    const response = await request(app)
      .post('/credentials/employee/verify')
      .send({ credential });

    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(true);
    expect(response.body.disclosedClaims.firstName).toBe('Jane');
    expect(response.body.disclosedClaims.lastName).toBe('Doe');
    expect(response.body.disclosedClaims.jobTitle).toBe('Software Engineer');
    expect(response.body.disclosedClaims.startDate).toBe('2024-01-15');
    expect(response.body.disclosedClaims.endDate).toBeUndefined();
  });

  it('verifies a credential with optional endDate', async () => {
    const credential = await issueCredential({ endDate: '2025-06-30' });

    const response = await request(app)
      .post('/credentials/employee/verify')
      .send({ credential });

    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(true);
    expect(response.body.disclosedClaims.endDate).toBe('2025-06-30');
  });

  it('returns the vct, iss and iat fields from the verified credential', async () => {
    const credential = await issueCredential();

    const response = await request(app)
      .post('/credentials/employee/verify')
      .send({ credential });

    expect(response.status).toBe(200);
    expect(typeof response.body.vct).toBe('string');
    expect(response.body.vct.length).toBeGreaterThan(0);
    expect(typeof response.body.iss).toBe('string');
    expect(response.body.iss.length).toBeGreaterThan(0);
    expect(typeof response.body.iat).toBe('number');
    expect(response.body.iat).toBeGreaterThan(0);
  });

  it('supports selective disclosure — only disclosed claims are visible', async () => {
    // Issue credential, then present with only firstName and jobTitle disclosures
    const credential = await issueCredential();
    const parts = credential.split('~');

    // parts[0] = JWT, parts[1..4] = disclosures for firstName, lastName, jobTitle, startDate
    // We need to identify which disclosure corresponds to firstName and jobTitle.
    // Decode each disclosure and pick the two we want.
    const jwtPart = parts[0];
    const disclosures = parts.slice(1).filter((d) => d.length > 0);

    const wantedKeys = new Set(['firstName', 'jobTitle']);
    const selectedDisclosures = disclosures.filter((d) => {
      const decoded = JSON.parse(Buffer.from(d, 'base64url').toString('utf8')) as unknown[];
      return typeof decoded[1] === 'string' && wantedKeys.has(decoded[1]);
    });

    // Build a partial SD-JWT with only the selected disclosures
    const partialSdJwt = [jwtPart, ...selectedDisclosures, ''].join('~');

    const response = await request(app)
      .post('/credentials/employee/verify')
      .send({ credential: partialSdJwt });

    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(true);
    expect(response.body.disclosedClaims.firstName).toBe('Jane');
    expect(response.body.disclosedClaims.jobTitle).toBe('Software Engineer');
    // Non-disclosed claims must not appear in the result
    expect(response.body.disclosedClaims.lastName).toBeUndefined();
    expect(response.body.disclosedClaims.startDate).toBeUndefined();
  });

  it('returns 400 when credential field is missing', async () => {
    const response = await request(app).post('/credentials/employee/verify').send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('VALIDATION_ERROR');
  });

  it('returns 400 for a credential with an invalid JWT structure', async () => {
    const response = await request(app)
      .post('/credentials/employee/verify')
      .send({ credential: 'notavalidjwt~' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('VERIFICATION_ERROR');
  });

  it('returns 400 for a tampered credential (modified disclosure)', async () => {
    const credential = await issueCredential();
    const parts = credential.split('~');

    // Replace the first disclosure with a tampered version
    const tamperedDisclosure = Buffer.from(
      JSON.stringify(['fake-salt', 'firstName', 'Attacker']),
    ).toString('base64url');
    parts[1] = tamperedDisclosure;
    const tamperedCredential = parts.join('~');

    const response = await request(app)
      .post('/credentials/employee/verify')
      .send({ credential: tamperedCredential });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('VERIFICATION_ERROR');
  });
});

// ---------------------------------------------------------------------------
// GET /.well-known/vct/employee — VC Type Metadata
// ---------------------------------------------------------------------------

describe('GET /.well-known/vct/employee', () => {
  it('returns a valid SD-JWT VC Type Metadata document', async () => {
    const response = await request(app).get('/.well-known/vct/employee');

    expect(response.status).toBe(200);
    expect(typeof response.body.vct).toBe('string');
    expect(response.body.vct.length).toBeGreaterThan(0);
    expect(response.body.name).toBe('Employee Credential');
    expect(typeof response.body.description).toBe('string');
  });

  it('includes all five employee credential claims', async () => {
    const response = await request(app).get('/.well-known/vct/employee');

    expect(response.status).toBe(200);
    const claims = response.body.claims as Array<{ path: string[]; sd: string }>;
    expect(Array.isArray(claims)).toBe(true);
    expect(claims).toHaveLength(5);

    const claimPaths = claims.map((c) => c.path[0]);
    expect(claimPaths).toContain('firstName');
    expect(claimPaths).toContain('lastName');
    expect(claimPaths).toContain('jobTitle');
    expect(claimPaths).toContain('startDate');
    expect(claimPaths).toContain('endDate');
  });

  it('marks all claims as selectively disclosable (sd: "allowed")', async () => {
    const response = await request(app).get('/.well-known/vct/employee');

    const claims = response.body.claims as Array<{ sd: string }>;
    for (const claim of claims) {
      expect(claim.sd).toBe('allowed');
    }
  });
});

// ---------------------------------------------------------------------------
// GET /.well-known/jwks.json — Issuer JWKS
// ---------------------------------------------------------------------------

describe('GET /.well-known/jwks.json', () => {
  it('returns a JWKS with the issuer EC public key', async () => {
    const response = await request(app).get('/.well-known/jwks.json');

    expect(response.status).toBe(200);
    const keys = response.body.keys as Array<{ kty: string; use: string; alg: string }>;
    expect(Array.isArray(keys)).toBe(true);
    expect(keys.length).toBeGreaterThan(0);

    const key = keys[0];
    expect(key.kty).toBe('EC');
    expect(key.use).toBe('sig');
    expect(key.alg).toBe('ES256');
  });

  it('the JWKS key contains the EC P-256 curve parameters', async () => {
    const response = await request(app).get('/.well-known/jwks.json');

    const key = (response.body.keys as Array<{ crv: string; x: string; y: string }>)[0];
    expect(key.crv).toBe('P-256');
    expect(typeof key.x).toBe('string');
    expect(typeof key.y).toBe('string');
  });
});
