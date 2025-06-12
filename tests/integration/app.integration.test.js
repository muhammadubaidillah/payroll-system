const request = require('supertest');
const app = require('../../index'); // Import your app
const jwt = require('jsonwebtoken'); // To generate test tokens
const config = require('../../config'); // To use the same jwtSecret for generating test tokens
const { verifyToken } = require('../../src/utils/jwt'); // Import for mocking

// Mock any external services or complex dependencies if necessary
// For example, if your routes interact with a database, you might mock the DB layer.

// Mock the logger to prevent console output during tests, unless desired
jest.mock('../../src/utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

jest.mock('../../database/pgsql', () => ({
  querySingle: jest.fn(),
}));
// Mock the verifyToken function used by authMiddleware
jest.mock('../../src/utils/jwt', () => ({
  verifyToken: jest.fn(),
}));

// Mock the middlewares that log requests/responses if their output is not being tested here
// or if they have side effects not desired in these specific tests.
// For simplicity, we'll let them run but their logger calls are mocked.

describe('Integration Tests', () => {
  describe('Check Routes (/check)', () => {
    describe('GET /check/health', () => {
      it('should return 200 OK', async () => {
        const res = await request(app).get('/check/health');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toBe('OK');
      });
    });

    describe('GET /check/db-connection', () => {
      const { querySingle } = require('../../database/pgsql');

      beforeEach(() => {
        querySingle.mockReset();
      });

      it('should return 200 if DB connection is successful', async () => {
        querySingle.mockResolvedValue({ connection_status: 1 });
        const res = await request(app).get('/check/db-connection');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toBe('Database connection successful');
      });

      it('should return 500 if DB connection fails', async () => {
        querySingle.mockResolvedValue({ connection_status: 0 }); // Or mock it to throw an error
        const res = await request(app).get('/check/db-connection');
        expect(res.statusCode).toEqual(500);
        expect(res.text).toBe('Database connection failed');
      });

      it('should return 500 if querySingle throws an error', async () => {
        querySingle.mockRejectedValue(new Error('DB error'));
        const res = await request(app).get('/check/db-connection');
        expect(res.statusCode).toEqual(500);
        expect(res.text).toBe('Database connection failed: DB error');
      });
    });
  });

  describe('GET /unhandled-route', () => {
    it('should return 404 (or your catch-all response)', async () => {
      const response = await request(app).get('/nonexistentroute123');
      expect(response.statusCode).toEqual(200); // Because your catch-all sends 200
      expect(response.body).toEqual({
        success: false,
        message: 'You shall not pass',
      });
    });
  });

  describe('GET /payroll (Example Protected Route)', () => {
    beforeEach(() => {
      // Reset the mock for verifyToken before each protected route test
      verifyToken.mockReset();
    });

    it('should return 401 if no token is provided', async () => {
      const response = await request(app).get('/payroll');
      expect(response.statusCode).toEqual(401); // Assuming tokenVerification sends 401
      expect(response.body.message).toEqual('Access denied. No token provided.');
    });

    it('should allow access with a valid token', async () => {
      const testToken = 'fake-valid-token'; // The actual token string doesn't matter when verifyToken is mocked
      const mockUserPayload = { userId: 'testuser123', role: 'employee' };
      // Mock verifyToken to return a valid payload for this test
      verifyToken.mockReturnValueOnce(mockUserPayload);

      const response = await request(app)
        .get('/payroll')
        .set('Authorization', `Bearer ${testToken}`);

      // Expect the request to pass token verification and reach the route handler
      expect(response.statusCode).not.toEqual(401); // Should pass token verification
      expect(response.statusCode).not.toEqual(400); // Should not be an invalid token
      // Add more specific assertions based on payrollRoute's behavior
      // e.g., expect(response.statusCode).toEqual(200);
      // expect(response.body).toEqual(expect.any(Array)); // if it returns a list
    });
  });
});
