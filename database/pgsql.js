const { Pool } = require('pg');
const config = require('../config');
const log = require('../src/utils/logger');

const pool = new Pool({
  connectionString: config.db.url,
  ssl: { rejectUnauthorized: false },
});

pool.on('connect', async () => {
  log.debug(`client connected ${new Date().getTime()}`);
});

pool.on('error', async (error) => {
  log.debug(error);
});

pool.on('remove', async () => {
  log.debug(`client release ${new Date().getTime()}`);
});

async function getConnection() {
  try {
    return await pool.connect();
  } catch (error) {
    return null;
  }
}

async function release(client) {
  try {
    client.release();
  } catch (error) {
    log.debug(error);
  }
}

async function query(text, values) {
  const client = await getConnection();
  if (client === null) {
    return null;
  }

  let rs = null;
  try {
    rs = await client.query(text, values);
  } catch (error) {
    log.error(`DB ERROR ${error}`);
    log.error(`DB QRY ${text}`);
    log.error(values);
  } finally {
    release(client);
  }
  return rs;
}

async function queryList(sql, bind) {
  const res = await query(sql, bind);

  return res && res.rowCount > 0 ? res.rows : [];
}

async function querySingle(sql, bind) {
  const res = await query(sql, bind);

  return res && res.rowCount > 0 ? res.rows[0] : false;
}

async function queryCount(sql, bind) {
  const res = await query(sql, bind);
  let column;
  const match = sql.match(/COUNT\(.*\) AS ([a-zA-Z0-9_]+)/);
  if (match.length > 1) {
    [, column] = match;
  } else {
    column = 'jumlah';
  }

  return res && res.rowCount > 0 ? parseInt(res.rows[0][column], 10) : 0;
}

module.exports = {
  query,
  queryList,
  querySingle,
  queryCount,
};
