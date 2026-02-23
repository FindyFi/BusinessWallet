import request from 'supertest';
import app from '../index';

const VALID_REQUEST = {
  firstName: 'Jane',
  lastName: 'Doe',
  jobTitle: 'Software Engineer',
  startDate: '2024-01-15',
};

describe('POST /credentials/employee', () => {
  it('issues a credential for a valid request', async () => {
    const res = await request(app).post('/credentials/employee').send(VALID_REQUEST);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('credential');
    expect(res.body).toHaveProperty('format', 'vc+sd-jwt');
    expect(typeof res.body.credential).toBe('string');
    expect(res.body.credential.split('.').length).toBe(3);
  });

  it('includes optional endDate when provided', async () => {
    const res = await request(app)
      .post('/credentials/employee')
      .send({ ...VALID_REQUEST, endDate: '2025-12-31' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('format', 'vc+sd-jwt');
  });

  it('returns 400 when firstName is missing', async () => {
    const { firstName: _omit, ...body } = VALID_REQUEST;
    const res = await request(app).post('/credentials/employee').send(body);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'VALIDATION_ERROR');
    expect(res.body.message).toMatch(/firstName/);
  });

  it('returns 400 when lastName is missing', async () => {
    const { lastName: _omit, ...body } = VALID_REQUEST;
    const res = await request(app).post('/credentials/employee').send(body);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'VALIDATION_ERROR');
    expect(res.body.message).toMatch(/lastName/);
  });

  it('returns 400 when jobTitle is missing', async () => {
    const { jobTitle: _omit, ...body } = VALID_REQUEST;
    const res = await request(app).post('/credentials/employee').send(body);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'VALIDATION_ERROR');
    expect(res.body.message).toMatch(/jobTitle/);
  });

  it('returns 400 when startDate is missing', async () => {
    const { startDate: _omit, ...body } = VALID_REQUEST;
    const res = await request(app).post('/credentials/employee').send(body);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'VALIDATION_ERROR');
    expect(res.body.message).toMatch(/startDate/);
  });

  it('returns 400 for an invalid startDate format', async () => {
    const res = await request(app)
      .post('/credentials/employee')
      .send({ ...VALID_REQUEST, startDate: 'not-a-date' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'VALIDATION_ERROR');
    expect(res.body.message).toMatch(/startDate/);
  });

  it('returns 400 for a non-existent startDate (e.g. Feb 30)', async () => {
    const res = await request(app)
      .post('/credentials/employee')
      .send({ ...VALID_REQUEST, startDate: '2024-02-30' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'VALIDATION_ERROR');
  });

  it('returns 400 for an invalid endDate format', async () => {
    const res = await request(app)
      .post('/credentials/employee')
      .send({ ...VALID_REQUEST, endDate: 'bad-date' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'VALIDATION_ERROR');
    expect(res.body.message).toMatch(/endDate/);
  });

  it('returns 400 when a required field is an empty string', async () => {
    const res = await request(app)
      .post('/credentials/employee')
      .send({ ...VALID_REQUEST, firstName: '   ' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'VALIDATION_ERROR');
  });
});

describe('GET /.well-known/vct/employee', () => {
  it('returns the VC Type Metadata document', async () => {
    const res = await request(app).get('/.well-known/vct/employee');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('vct');
    expect(res.body).toHaveProperty('name', 'Employee Credential');
    expect(res.body).toHaveProperty('claims');
    expect(Array.isArray(res.body.claims)).toBe(true);
  });
});

describe('GET /health', () => {
  it('returns service health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('service', 'business-wallet-api');
  });
});
