const { getClientIp, maskSensitiveData } = require('../utils');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const { insertAuditLog } = require('../models/auditLogModel');

async function recordHit(req, res, next) {
  const clientIp = getClientIp(req);
  const requestId = uuidv4();

  res.locals.requestId = requestId;
  res.locals.clientIp = clientIp;
  res.locals.response = { request_id: requestId };

  next();
}

async function recordRequest(req, res, next) {
  const { requestId } = res.locals;
  const useBody = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase());

  const dataFromRequest = useBody ? req.body : req.query;

  const dataToLog = maskSensitiveData(dataFromRequest);

  logger.info(`[${requestId}] REQ: ${JSON.stringify(dataToLog)}`);

  next();
}

async function recordToAudit(req, res, next) {
  const { requestId, clientIp } = res.locals;

  const useBody = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase());

  const dataFromRequest = useBody ? req.body : req.query;

  let auditData = {};
  if (req.path === '/login') {
    auditData = {
      id: uuidv4(),
      path: req.path,
      payload: maskSensitiveData(dataFromRequest),
      userId: null,
      ipAddress: clientIp,
      requestId,
    };
  } else {
    const { user } = res.locals;

    auditData = {
      id: uuidv4(),
      path: req.path,
      payload: maskSensitiveData(dataFromRequest),
      userId: user.id,
      ipAddress: clientIp,
      requestId,
    };
  }

  await insertAuditLog(auditData);

  next();
}

async function recordResponse(req, res) {
  const { requestId, response } = res.locals;

  const { status, ...responseWithoutStatus } = response;

  const dataToLog = maskSensitiveData(responseWithoutStatus.data);

  logger.info(
    `[${requestId}] RESP: ${JSON.stringify({ ...responseWithoutStatus, data: dataToLog })}`
  );

  res.status(status).json(responseWithoutStatus);
}

module.exports = {
  recordHit,
  recordRequest,
  recordResponse,
  recordToAudit,
};
