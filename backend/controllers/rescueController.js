const pool = require('../models/db');

exports.submitRescueRequest = (req, res) => {
    const userID = req.user.id;
    const { location, time, reason } = req.body;
    const newRequest = { userID, location, time, reason };

    pool.query('INSERT INTO tbl_115_rescue_requests SET ?', newRequest, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error submitting rescue request' });
        }

        const requestID = result.insertId;

        pool.query('SELECT volunteerID FROM tbl_115_volunteers WHERE status = "available" AND notify = TRUE', (err, volunteers) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error fetching volunteers' });
            }

            const notifications = volunteers.map(volunteer => ({
                volunteerID: volunteer.volunteerID,
                requestID: requestID
            }));

            pool.query('INSERT INTO tbl_115_volunteer_notifications (volunteerID, requestID) VALUES ?', [notifications.map(notification => [notification.volunteerID, notification.requestID])], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Error notifying volunteers' });
                }

                res.json({ requestID: requestID, ...newRequest });
            });
        });
    });
};


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