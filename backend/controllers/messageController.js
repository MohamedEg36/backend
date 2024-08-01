const pool = require('../models/db');

exports.addMessage = (req, res) => {
    const { fromUserID, toUserID, carID, message, date } = req.body;
    const newMessage = { fromUserID, toUserID, carID, message, date };

    console.log('Inserting message:', newMessage); // Debugging line

    pool.query('INSERT INTO tbl_115_new_messages SET ?', newMessage, (err, result) => {
        if (err) throw err;
        res.json({ messageID: result.insertId, ...newMessage });
    });
};

exports.getMessages = (req, res) => {
    const { carID } = req.query;
    const userID = req.user.id;

    console.log('Fetching messages for userID:', userID, 'and carID:', carID); // Debugging line

    pool.query(
        'SELECT * FROM tbl_115_new_messages WHERE carID = ? AND (fromUserID = ? OR toUserID = ?)',
        [carID, userID, userID],
        (err, results) => {
            if (err) {
                console.error('Error fetching messages:', err);
                res.status(500).json({ error: 'Database query error' });
                return;
            }
            console.log('Fetched messages:', results); // Debugging line
            res.json(results);
        }
    );
};
