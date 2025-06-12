jest.mock('../../src/utils/jwt', () => ({
  verifyToken: jest.fn(),
}));

const request = require('supertest');
const app = require('../../index');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const { verifyToken } = require('../../src/utils/jwt');

describe('Payslip Routes (/payslip) - Protected', () => {
  let employeeToken, adminToken;
  const testEmployeeId = 'emp001';
  const testAdminId = 'admin001';
  const payslipIdToTest = 'payslipXYZ';

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

  describe('GET /payslip (Employee)', () => {
    it('should allow an employee to get their own payslips', async () => {
      const response = await request(app)
        .get('/payslip')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.statusCode).toBe(200);
    });

    it('should return 401 if no token is provided', async () => {
      const response = await request(app).get('/payslip');
      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /payslip/:payslipId (Employee/Admin)', () => {
    it('should allow an employee to get their own specific payslip', async () => {
      const response = await request(app)
        .get(`/payslip/${payslipIdToTest}`)
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.statusCode).toBe(200);
    });

    it('should allow an admin to get any specific payslip', async () => {
      const response = await request(app)
        .get(`/payslip/${payslipIdToTest}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.statusCode).toBe(200);
    });

    it('should return 404 if payslip not found or not authorized', async () => {
      const response = await request(app)
        .get(`/payslip/nonexistent`)
        .set('Authorization', `Bearer ${employeeToken}`);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('POST /payslip/generate (Admin)', () => {
    beforeEach(() => {
      verifyToken.mockReset();
    });

    it('should allow an admin to generate a payslip', async () => {
      verifyToken.mockReturnValueOnce({ userId: testAdminId, role: 'admin' });

      const generationPayload = {
        employeeId: 'emp001',
        period: '2025-06',
        baseSalary: 5000000,
        overtime: 250000,
        reimbursement: 100000,
      };

      const response = await request(app)
        .post('/payslip/generate')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(generationPayload);

      expect(response.statusCode).toBe(201);
    });
  });
});
