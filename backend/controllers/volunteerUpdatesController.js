const pool = require('../models/db');

exports.getUpdates = (req, res) => {
    const sql = 'SELECT * FROM tbl_115_update ORDER BY date DESC';

    pool.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching volunteer updates:', err);
            return res.status(500).json({ message: 'Error fetching volunteer updates' });
        }
        res.json(results);
    });
};
