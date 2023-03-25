const makeValidation = require("@withvoid/make-validation");
const chatRoom  = require("../models/ChatRoom");

const CHAT_ROOM_TYPES = {
  CONSUMER_TO_CONSUMER: "consumer-to-consumer", 
  CONSUMER_TO_SUPPORT: "consumer-to-support",
};


module.exports = {
    initiate: async (req, res) => {
      console.log("Hello Bro");
      try {
        const validation = makeValidation(types => ({
          payload: req.body, 
          checks: {
            userIds: {
              type : types.array, 
              options: { 
                unique: true,
                empty: false,
                stringOnly: true
              }
            },
            type: {type: types.enum, options: {enum: CHAT_ROOM_TYPES}}
          }
        }));
        console.log("Hello There 1", req.body);
        if(!validation.success) return res.status(400).json({...validation});
        console.log("Hello There");
        const {userIds, type} = req.body;
        // const { userIds: chatInitiator} = req;
        const chatInitiator = userIds
        const allUserIds = [...userIds, chatInitiator];
        // console.log("chat: "+req.body);
        console.log("Hello ");
        console.log(chatRoom);
        const chatRoomSch = await chatRoom.initiateChat(allUserIds, type, chatInitiator);
        return res.status(200).json({success:true, chatRoomSch});
      } catch (error) {
        return res.status(500).json({success:false, error:error.message})
      }
    },
    postMessage: async (req, res) => { },
    getRecentConversation: async (req, res) => { },
    getConversationByRoomId: async (req, res) => { },
    markConversationReadByRoomId: async (req, res) => { },
  }

  