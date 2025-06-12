const { tokenVerification } = require('../../../src/middlewares/authMiddleware');
const logger = require('../../../src/utils/logger');
const { verifyToken } = require('../../../src/utils/jwt');

jest.mock('../../../src/utils/jwt', () => ({
  verifyToken: jest.fn(),
}));
jest.mock('../../../src/utils/logger', () => ({
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
}));

describe('Auth Middleware - tokenVerification', () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      locals: {},
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    logger.warn.mockClear();
    logger.error.mockClear();
    verifyToken.mockClear();
  });

  test('should call next() if token is valid', () => {
    mockRequest.headers.authorization = 'Bearer validtoken123';
    const decodedPayload = { userId: 1, username: 'testuser' };
    verifyToken.mockReturnValue(decodedPayload);

    tokenVerification(mockRequest, mockResponse, nextFunction);

    expect(verifyToken).toHaveBeenCalledWith('validtoken123');
    expect(mockResponse.locals.user).toEqual(decodedPayload);
    expect(nextFunction).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  test('should return 401 if no token is provided', () => {
    tokenVerification(mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Access denied. No token provided.',
    });
    expect(logger.warn).toHaveBeenCalledWith(
      'Access denied. No token provided or malformed header.'
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should return 401 if token is malformed (no Bearer)', () => {
    mockRequest.headers.authorization = 'invalidtoken123';
    tokenVerification(mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Access denied. No token provided.',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should return 401 if verifyToken returns null (e.g. expired/invalid)', () => {
    mockRequest.headers.authorization = 'Bearer invalidtoken123';
    verifyToken.mockReturnValue(null);

    tokenVerification(mockRequest, mockResponse, nextFunction);

    expect(verifyToken).toHaveBeenCalledWith('invalidtoken123');
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid or expired token',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('should return 400 if verifyToken throws an error (e.g. malformed token)', () => {
    mockRequest.headers.authorization = 'Bearer invalidtoken123';
    verifyToken.mockImplementation(() => {
      throw new Error('jwt malformed');
    });

    tokenVerification(mockRequest, mockResponse, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ success: false, message: 'Invalid token.' });
    expect(logger.error).toHaveBeenCalledWith('Invalid token: jwt malformed');
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
