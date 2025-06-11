const express = require('express');
const helmet = require('helmet');
const config = require('./config');
const log = require('./src/utils/logger');

const { tokenVerification } = require('./src/middlewares/authMiddleware');

const checkRoute = require('./src/routes/check');
const usersRoute = require('./src/routes/users');
const authRoute = require('./src/routes/authRoute');
const payrollRoute = require('./src/routes/payrollRoute');
const attendanceRoute = require('./src/routes/attendanceRoute');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/check', checkRoute);
app.use('/users', usersRoute);
app.use('/auth', authRoute);
app.use('/payroll', tokenVerification, payrollRoute);
app.use('/attendance', tokenVerification, attendanceRoute);

app.use('/', (req, res) => {
  res.send({
    error: 'invalid_path',
    error_description: 'You shall not pass',
  });
});

app.listen(config.port || 3001, '0.0.0.0', () =>
  log.info(`Listening at port ${config.port || 3001}`)
);
