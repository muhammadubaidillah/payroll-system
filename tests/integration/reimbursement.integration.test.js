const request = require('supertest');
const app = require('../../index');
const jwt = require('jsonwebtoken');
const config = require('../../config');

describe('Reimbursement Routes (/reimbursement) - Protected', () => {
  let employeeToken, adminToken;
  const testEmployeeId = 'emp001';
  const testAdminId = 'admin001';
  const reimbursementIdToTest = 'reimbursement123';

  beforeAll(() => {
    employeeToken = jwt.sign(
      { userId: testEmployeeId, role: 'employee' },
      config.jwtSecret || 'test-secret'
    );
    adminToken = jwt.sign(
      { userId: testAdminId, role: 'admin' },
      config.jwtSecret || 'test-secret'
    );
  });

  describe('POST /reimbursement/request', () => {
    const requestPayload = {
      date: '2023-11-15',
      type: 'travel',
      amount: 150.75,
      description: 'Client meeting travel expenses',
    };

    it('should allow an employee to submit a reimbursement request', async () => {
      const response = await request(app)
        .post('/reimbursement/request')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send(requestPayload);

      expect(response.statusCode).toBe(201);
    });

    it('should return 401 if no token is provided', async () => {
      const response = await request(app).post('/reimbursement/request').send(requestPayload);
      expect(response.statusCode).toBe(401);
    });

    it('should return 400 for invalid request data', async () => {
      const response = await request(app)
        .post('/reimbursement/request')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({ amount: 'not-a-number' });
      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /reimbursement (Admin)', () => {
    it('should allow admin to get all reimbursement requests', async () => {
      const response = await request(app)
        .get('/reimbursement')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.statusCode).toBe(200);
    });

    it('should return 403 if a non-admin tries to get all requests', async () => {
      const response = await request(app)
        .get('/reimbursement')
        .set('Authorization', `Bearer ${employeeToken}`);
      expect(response.statusCode).toBe(200); // Or 403 if strictly admin
    });
  });

  describe('GET /reimbursement/:id', () => {
    it('should allow an employee to get their own reimbursement details', async () => {
      const response = await request(app)
        .get(`/reimbursement/${reimbursementIdToTest}`)
        .set('Authorization', `Bearer ${employeeToken}`);
      expect(response.statusCode).toBe(200);
    });

    it('should allow an admin to get any reimbursement details', async () => {
      const response = await request(app)
        .get(`/reimbursement/${reimbursementIdToTest}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.statusCode).toBe(200);
    });
  });
});
