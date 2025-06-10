const pino = require('pino');
const pretty = require('pino-pretty');
const config = require('../../config');

const logger = pino(
  pretty({
    colorize: true,
    translateTime: 'SYS:standard',
  })
);
logger.level = logger.levels.values[config.log.level] || Infinity;

logger.debug('log initiated');

module.exports = logger;
