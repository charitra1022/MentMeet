const express = require('express');
//controllers
const chatRoom = require('../controllers/chatRoom.js');

const router = express.Router();

router.get('/', chatRoom.getRecentConversation)
    .get('/:roomId', chatRoom.getConversationByRoomId)
    .post('/initiate', chatRoom.initiate)
    .post('/:roomId/message', chatRoom.postMessage)
    .put('/:roomId/mark-read', chatRoom.markConversationReadByRoomId)

module.exports = router;
