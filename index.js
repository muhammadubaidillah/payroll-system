const express = require('express');
const helmet = require('helmet');
const config = require('./config');
const log = require('./src/utils/logger');

const checkRoute = require('./src/routes/check');
const usersRoute = require('./src/routes/users');
const authRoute = require('./src/routes/authRoutes');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/check', checkRoute);
app.use('/users', usersRoute);
app.use('/auth', authRoute);

app.use('/', (req, res) => {
  res.send({
    error: 'invalid_path',
    error_description: 'You shall not pass',
  });
});

app.listen(config.port || 3001, '0.0.0.0', () =>
  log.info(`Listening at port ${config.port || 3001}`)
);
