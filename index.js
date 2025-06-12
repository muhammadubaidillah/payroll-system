const express = require('express');
const helmet = require('helmet');
const config = require('./config');
const logger = require('./src/utils/logger');

const { tokenVerification } = require('./src/middlewares/authMiddleware');
const { recordHit, recordRequest, recordResponse } = require('./src/middlewares');

const checkRoute = require('./src/routes/checkRoute');
// const usersRoute = require('./src/routes/users');
const authRoute = require('./src/routes/authRoute');
const payrollRoute = require('./src/routes/payrollRoute');
const attendanceRoute = require('./src/routes/attendanceRoute');
const overtimeRoute = require('./src/routes/overtimeRoute');
const reimbursementRoute = require('./src/routes/reimbursementRoute');
const payslipRoute = require('./src/routes/payslipRoute');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/check', checkRoute);

app.use('/auth', recordHit, recordRequest, authRoute, recordResponse);

app.use('/payroll', recordHit, recordRequest, tokenVerification, payrollRoute, recordResponse);
app.use(
  '/attendance',
  recordHit,
  recordRequest,
  tokenVerification,
  attendanceRoute,
  recordResponse
);
app.use('/overtime', recordHit, recordRequest, tokenVerification, overtimeRoute, recordResponse);
app.use(
  '/reimbursement',
  recordHit,
  recordRequest,
  tokenVerification,
  reimbursementRoute,
  recordResponse
);
app.use('/payslip', recordHit, recordRequest, tokenVerification, payslipRoute, recordResponse);

app.use('/', (req, res) => {
  res.send({
    success: false,
    message: 'You shall not pass',
  });
});

if (require.main === module) {
  app.listen(config.port || 3001, '0.0.0.0', () =>
    logger.info(`Listening at port ${config.port || 3001}`)
  );
}

module.exports = app;
