const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, chatController.getChats);
router.post('/create', authenticateToken, chatController.createChat);

module.exports = router;