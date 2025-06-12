const request = require('supertest');
const app = require('../../index');
const jwt = require('jsonwebtoken');
const config = require('../../config');

describe('Overtime Routes (/overtime) - Protected', () => {
  let employeeToken, adminToken;
  const testEmployeeId = 'emp123';

  beforeAll(() => {
    employeeToken = jwt.sign(
      { userId: testEmployeeId, role: 'employee' },
      config.jwtSecret || 'test-secret'
    );
    adminToken = jwt.sign({ userId: 'admin001', role: 'admin' }, config.jwtSecret || 'test-secret');
  });

  describe('POST /overtime/request', () => {
    it('should allow an employee to submit an overtime request', async () => {
      const overtimeData = { date: '2023-10-26', hours: 2, reason: 'Urgent task' };
      const response = await request(app)
        .post('/overtime/request')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send(overtimeData);

      expect(response.statusCode).toBe(201);
    });
  });

  describe('GET /overtime (Admin)', () => {
    it('should allow admin to get all overtime requests', async () => {
      const response = await request(app)
        .get('/overtime')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.statusCode).toBe(200);
    });
  });
});
