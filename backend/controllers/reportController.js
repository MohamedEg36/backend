const pool = require('../models/db');

exports.getReports = (req, res) => {
    const userID = req.user.id;
    pool.query('SELECT * FROM tbl_115_reports WHERE userID = ?', [userID], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
};

exports.getReportById = (req, res) => {
    const { id } = req.params;
    pool.query('SELECT * FROM tbl_115_reports WHERE reportID = ?', [id], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
};

exports.addReport = (req, res) => {
    const userID = req.user.id;
    const { plate, reason, location, date, image, map, carID } = req.body;
    const newReport = { plate, reason, location, date, image, map, userID, carID };

    pool.query('INSERT INTO tbl_115_reports SET ?', newReport, (err, result) => {
        if (err) throw err;
        res.json({ reportID: result.insertId, ...newReport });
    });
};

exports.deleteReport = (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM tbl_115_reports WHERE reportID = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.status(200).json({ message: 'Report deleted successfully' });
    });
};


