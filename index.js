const http = require('http');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');

require('./config/mongo.js');

//routes
const indexRouter = require('./routes/index.js');
const userRouter = require('./routes/user.js');
const chatRoomRouter = require('./routes/chatRoom.js');
const deleteRouter = require('./routes/delete.js');

//middleware
const {decode} = require('./middlewares/jwt.js');
const { ExplainVerbosity } = require('mongodb');

//sockets
const socketio = require('socket.io')(3500);

//socket configuration
const WebSockets = require('./utils/WebSockets.js');
const { Server } = require('engine.io');



const app = express();

const PORT = 3000;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use("/", indexRouter);
app.use('/users', userRouter);
app.use("/room", decode, chatRoomRouter);
app.use("/delete", deleteRouter);

app.set("PORT", PORT);
//catch 404 and forward to error handler

app.use("*", (req, res) => {
    return res.status(404).json({
        success:false,
        message: "API endpoint doesn't exist"
    })
});

//Create HTTP server
const server = http.createServer(app);
//Create socket connection
global.io = socketio.listen(server);
global.io.on('connection', WebSockets.connection);
server.listen(PORT);
server.on("listening", () => {
    console.log(`Listening on port:: http://localhost:${PORT}`);
});


