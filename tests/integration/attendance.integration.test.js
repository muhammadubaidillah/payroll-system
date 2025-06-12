jest.mock('../../src/utils/jwt', () => ({
  verifyToken: jest.fn(),
}));

const request = require('supertest');
const app = require('../../index');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const { verifyToken } = require('../../src/utils/jwt');

describe('Attendance Routes (/attendance) - Protected', () => {
  let employeeToken;
  const testEmployeeId = 'emp123';

  beforeAll(() => {
    employeeToken = jwt.sign(
      { userId: testEmployeeId, role: 'employee' },
      config.jwtSecret || 'test-secret'
    );
  });

  describe('POST /attendance/clock-in', () => {
    beforeEach(() => {
      verifyToken.mockReset();
    });

    it('should allow an employee to clock in', async () => {
      verifyToken.mockReturnValueOnce({ userId: testEmployeeId, role: 'employee' }); // Mock verifyToken for employee
      const response = await request(app)
        .post('/attendance/clock-in')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({ notes: 'Starting my shift' });

      expect(response.statusCode).toBe(201);
    });

    it('should return 401 if no token is provided', async () => {
      const response = await request(app).post('/attendance/clock-in');
      expect(response.statusCode).toBe(401);
    });
  });

  describe('POST /attendance/clock-out', () => {});

  describe('GET /attendance/:employeeId', () => {});
});
