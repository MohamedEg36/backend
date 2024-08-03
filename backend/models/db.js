const mysql = require('mysql');
const util = require('util');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT, 10) 
});

pool.query = util.promisify(pool.query);

module.exports = pool;
