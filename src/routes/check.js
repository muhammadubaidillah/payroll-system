const express = require('express');
const { querySingle } = require('../../database/pgsql');

const router = express.Router();

router.get('/health', async (req, res) => res.send('OK'));

router.get('/db-connection', async (req, res) => {
  try {
    const { connection_status } = (await querySingle('SELECT 1 AS connection_status')) || {};

    if (connection_status === 1) {
      return res.status(200).send('Database connection successful');
    }

    res.status(500).send('Database connection failed');
  } catch (error) {
    res.status(500).send(`Database connection failed: ${error.message}`);
  }
});

module.exports = router;
