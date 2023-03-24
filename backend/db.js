const mongoose = require('mongoose');
// const MONGO_URI = "mongodb+srv://rahulm682:12345@farmer.wctomfb.mongodb.net/test";
const MONGO_URI = "mongodb://localhost:27017/hack_36";

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
    console.log("Mongo has connected succesfully");
});
mongoose.connection.on("reconnected", () => {
    console.log("Mongo has reconnected");
});
mongoose.connection.on("error", (error) => {
    console.log("Mongo connection has an error", error);
    mongoose.disconnect();
});
mongoose.connection.on("disconnected", () => {
    console.log("Mongo connection is disconnected");
});