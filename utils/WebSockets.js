const { userInfo } = require("os");

class WebSockets {
    user = [];
    connection(cliet){
        //event fired when the chat room is disconnected.
        cliet.on("disconnected", () => {
            this.users = this.users.filter((user) => user.socketId !==cliet.id);
        });
        // Add identity of user mapped to the socket id.
        cliet.on("identity", (userId) => {
            this.users.push({
                socketId: cliet.id,
                userId: userId
            });
        });
        // subscribe person to chat & other user as well
        cliet.on("subscribe", (room, otherUserId="") => {
            this.subscribeOtherUser(room, otherUserId);
            cliet.join(room);
        });
        //mute a chat room
        cliet.on("unsubscribe", (room) => {
            cliet.leave(room);
        });
    }

    subscribeOtherUser(room, otherUserId){
        const userSockets = this.users.filter(
            (user) => user.userId === otherUserId
        );
        userSockets.map((userInfo) => {
            const socketConn = global.importScripts.sockets.connected(userInfo.socketId);
            if(socketConn) {
                socketConn.join(room);
            }
        });
    }
}

module.exports = new WebSockets();