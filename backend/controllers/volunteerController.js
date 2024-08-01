const pool = require('../models/db');

exports.registerVolunteer = (req, res) => {
    const userID = req.user.id;

    const query = `
        INSERT INTO tbl_115_volunteers (userID, status)
        VALUES (?, 'available')
        ON DUPLICATE KEY UPDATE status='available'
    `;

    pool.query(query, [userID], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error registering as volunteer' });
        }
        res.json({ message: 'Successfully registered as volunteer' });
    });
};

exports.getVolunteerStatus = (req, res) => {
    const userID = req.user.id;

    const query = `
        SELECT status
        FROM tbl_115_volunteers
        WHERE userID = ?
    `;

    pool.query(query, [userID], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching volunteer status' });
        }
        if (results.length > 0) {
            res.json({ isVolunteer: true, status: results[0].status });
        } else {
            res.json({ isVolunteer: false });
        }
    });
};

exports.updateNotificationPreference = (req, res) => {
    const userID = req.user.id;
    const notify = req.body.notify ? 'available' : 'unavailable';

    const query = `
        UPDATE tbl_115_volunteers
        SET status = ?
        WHERE userID = ?
    `;

    pool.query(query, [notify, userID], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error updating notification preference' });
        }
        res.json({ message: 'Notification preference updated' });
    });
};
