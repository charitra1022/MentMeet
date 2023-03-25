const mongoose = require('mongoose');
const {v4} = require('uuid');
const uuidv4 = v4;

const chatRoomSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuidv4().replace(/\-/g, ""),    
    },
    userIds: Array,
    type: String, 
    chatInitiator: String,  
    },
    {
        timestamps:true, 
        collection: "chatrooms",
    }
);

chatRoomSchema.statics.initiateChat = async (userIds, type, chatInitiator) => {
    try {
        console.log("initiate chat: "+userIds +" "+type+" "+chatInitiator);
        const availableRoom = await this.find({
            userIds: {
                $size: userIds.length, 
                $all: [...userIds],
            },
            type,
        });
        if(availableRoom){
            return {
                isNew: false, 
                message: 'retrieving an old chat room', 
                chatRoomId: availableRoom._doc._id,
                type: availableRoom._doc.type,
            };
        }

        const newRoom = await this.create({userIds, type, chatInitiator});
        return {
            isNew: true, 
            message: 'create a new chatroom',
            chatRoomId: newRoom._doc._id, 
            type: newRoom._doc.type,
        };
    } catch (error) {
        console.log('error on start chat method', error);
        throw error;
    }
}

module.exports =  mongoose.model("ChatRoom", chatRoomSchema)