const pool = require('../models/db');

exports.getChatsByUser = (req, res) => {
    const userID = req.user.id;
    console.log(`Fetching chats for user ID: ${userID}`);

    const query = `
        SELECT c.chatID, c.lastMessage, c.lastMessageTime, cu.userID, u.firstName, u.img
        FROM tbl_115_chats c
        JOIN tbl_115_chat_users cu ON c.chatID = cu.chatID
        JOIN tbl_115_users u ON cu.userID = u.userID
        WHERE cu.userID = ?
        ORDER BY c.lastMessageTime DESC
    `;

    pool.query(query, [userID], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query error' });
            return;
        }
        console.log(`Fetched chats: ${JSON.stringify(results)}`);
        res.json(results);
    });
};
