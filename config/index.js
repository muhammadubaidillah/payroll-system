const dotenv = require('dotenv');
dotenv.config();

const config = {
  port: process.env.PORT || 3001,
  db: {
    url: process.env.DATABASE_URL,
  },
  log: {
    level: process.env.LOG_LEVEL || 'info',
    service_name: process.env.SERVICE_NAME || 'payroll-system',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiration: process.env.JWT_EXPIRATION || '1d',
  },
  salt: {
    rounds: process.env.SALT_ROUNDS || 10,
  },
  sensitive: {
    log_keys: process.env.SENSITIVE_LOG_KEYS || 'password,token',
  },
};

module.exports = config;
