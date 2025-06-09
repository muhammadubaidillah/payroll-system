const express = require('express');
const helmet = require('helmet');

require('./libs/config');
const log = require('./libs/logger');

const checkRoute = require('./routes/check');
const usersRoute = require('./routes/users');

const app = express();

app.use(helmet());

app.use('/check', checkRoute);
app.use('/users', usersRoute);

app.use('/', (req, res) => {
  res.send({
    error: 'invalid_path',
    error_description: 'You shall not pass',
  });
});

app.listen(process.env.PORT || 3001, '0.0.0.0', () =>
  log.info(`Listening at port ${process.env.PORT || 3001}`)
);
