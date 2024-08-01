const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: '148.66.138.145',
    user: 'dbusrShnkr24',
    password: 'studDBpwWeb2!',
    database: 'dbShnkr24stud',
    connectTimeout: 10000 
});

pool.query = util.promisify(pool.query);

module.exports = pool;
