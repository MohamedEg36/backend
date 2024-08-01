const pool = require('../models/db');

exports.getAllRescueRequests = (req, res) => {
    const query = `SELECT * FROM tbl_115_rescue_requests`;
    pool.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query error' });
            return;
        }
        res.json(results);
    });
};
