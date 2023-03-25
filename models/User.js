
const mongoose = require('mongoose');
const Schema = mongoose.Schema
const {v4} = require('uuid');
const uuidv4 = v4;

const USER_TYPES = {
    CONSUMER: "consumer",
    SUPPORT: "support"
};

const UserSchema =  new Schema({
        firstName: {
            type:String
        }, 
        lastName: {
            type:String
        },
        type: {
            type:String
        }
    },
    {
        timestamps:true,
        collection: "users",
    }
);



UserSchema.statics.createUser = async (firstName,lastname,type) => {
        try {
            const user = await this.create({firstName, lastname, type});
            return user;
        } catch (error) {
            console.log("Models: ",error);
            throw error;
        }
    };

UserSchema.statics.getUserById = async (req, res, id) => {
    try {
        console.log("get user by id");
        const { userid } = req;
        console.log("userid");
        console.log(userid);
        const user = await this.findById(userid);
        if(!user) throw ({error: 'No user with this id found'});
        
        console.log(user);
        return user;
    }
    catch (error) {
        throw error;
    }
    };

UserSchema.statics.getUsers = async () => {
    try {
        const users = await this.find();
        console.log("User List: ",users);
        return users;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    UserSchema: mongoose.model("users", UserSchema),
    TYPES: USER_TYPES    
}
