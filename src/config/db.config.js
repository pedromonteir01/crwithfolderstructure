const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    port: 7007,
    password: 'ds564',
    database: 'clashroyaledb'
});

module.exports = pool;