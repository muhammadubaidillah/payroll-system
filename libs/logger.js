const pino = require('pino');
const pretty = require('pino-pretty');
require('./config');

const logger = pino(
  pretty({
    colorize: true,
    translateTime: 'SYS:standard',
  })
);
logger.level = logger.levels.values[process.env.LOG_LEVEL] || Infinity;

logger.debug('log initiated');

module.exports = logger;
