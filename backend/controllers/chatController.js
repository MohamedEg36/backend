const pool = require('../models/db');

exports.createChat = (req, res) => {
    const { fromUserID, toUserID, carID } = req.body;
    const query = `
        INSERT INTO tbl_115_chats (fromUserID, toUserID, carID)
        VALUES (?, ?, ?)
    `;
    pool.query(query, [fromUserID, toUserID, carID], (err, result) => {
        if (err) throw err;
        res.json({ chatID: result.insertId });
    });
};

exports.getChats = (req, res) => {
    const userID = req.user.id;
    const query = `
        SELECT 
            c.chatID, 
            c.carID, 
            IF(c.fromUserID = ?, c.toUserID, c.fromUserID) AS otherUserID,
            u.img AS userImage, 
            ca.plate AS carPlate, 
            c.lastMessage, 
            c.lastMessageTime
        FROM tbl_115_chats c
        JOIN tbl_115_users u ON u.userID = IF(c.fromUserID = ?, c.toUserID, c.fromUserID)
        JOIN tbl_115_cars ca ON ca.carID = c.carID
        WHERE c.toUserID = ? OR c.fromUserID = ?
        ORDER BY c.lastMessageTime DESC
    `;
    pool.query(query, [userID, userID, userID, userID], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
};
