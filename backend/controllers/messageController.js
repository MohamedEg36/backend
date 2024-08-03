// backend/controllers/messageController.js
const pool = require('../models/db');

exports.addMessage = async (req, res) => {
    const { fromUserID, toUserID, carID, message, date } = req.body;

    try {
        // Check if a chat exists between these users for this car
        let chat = await pool.query(
            'SELECT * FROM tbl_115_chats WHERE carID = ? OR ((userID1 = ? AND userID2 = ?) OR (userID1 = ? AND userID2 = ?))',
            [carID, fromUserID, toUserID, toUserID, fromUserID]
        );

        let chatID;

        if (chat.length === 0) {
            // Create a new chat
            let result = await pool.query(
                'INSERT INTO tbl_115_chats (carID, userID1, userID2) VALUES (?, ?, ?)',
                [carID, fromUserID, toUserID]
            );
            chatID = result.insertId;
        } else {
            chatID = chat[0].chatID;
        }

        // Insert the message
        const newMessage = { fromUserID, toUserID, carID, chatID, message, date };
        await pool.query('INSERT INTO tbl_115_messages SET ?', newMessage);

        // Update the chat's last message
        await pool.query(
            'UPDATE tbl_115_chats SET lastMessage = ?, lastMessageTime = ? WHERE chatID = ?',
            [message, date, chatID]
        );

        res.json({ ...newMessage, chatID });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding message' });
    }
};

exports.getMessages = (req, res) => {
    const { carID } = req.query;
    const userID = req.user.id;

    pool.query(
        'SELECT * FROM tbl_115_messages WHERE carID = ?  OR (fromUserID = ? OR toUserID = ?)',
        [carID, userID, userID],
        (err, results) => {
            if (err) throw err;
            res.json(results);
        }
    );
};
