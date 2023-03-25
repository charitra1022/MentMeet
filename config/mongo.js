

const config =  require('./index.js');

const mongoose = require('mongoose');
const CONNECTION_URL = `mongodb://0.0.0.0:27017/chatdb`

mongoose.connect(CONNECTION_URL, {
    useNewURLParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
    console.log("Connected Successfully");
})

mongoose.connection.on('reconnected', () => {
    console.log("Reconnected Successfully");
})

mongoose.connection.on('error', (error) => {
    console.log("Connection has an error", error);
    mongoose.disconnect()
})

mongoose.connection.on('disconnected', (error) => {
    console.log("Disconnected Successfully");
})
