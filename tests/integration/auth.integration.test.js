const request = require('supertest');
const app = require('../../index');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const { querySingle } = require('../../database/pgsql');
const { validateLogin } = require('../../src/middlewares/validations/authValidation');
const bcrypt = require('bcryptjs');

jest.mock('../../database/pgsql', () => ({
  querySingle: jest.fn(),
}));
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('Auth Routes (/auth)', () => {
  beforeEach(() => {
    querySingle.mockReset();
    bcrypt.compare.mockReset();
  });

  describe('POST /auth/login', () => {
    it('should login a user with valid credentials and return a token', async () => {
      querySingle.mockResolvedValueOnce({
        id: 'user123',
        email: 'test@example.com',
        password_hash: 'hashedpassword123',
        role: 'employee',
      });
      bcrypt.compare.mockResolvedValueOnce(true);

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.statusCode).toBe(200); // Or 201, etc.
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    it('should return 401 for invalid credentials', async () => {
      querySingle.mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(response.statusCode).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });

    it('should return 400 for missing email or password', async () => {
      const response = await request(app).post('/auth/login').send({ email: 'test@example.com' }); // Missing password

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });
});
