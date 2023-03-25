const makeValidation = require("@withvoid/make-validation");
const {UserSchema, TYPES} = require("../models/User.js");
const { types } = require("util");
const User = require("../models/User.js");

module.exports = {
  
    onGetAllUsers: async (req, res) => {
        try {
            const users = await UserSchema.find();
            return res.status(200).json({success:true,users: users });
        } catch (error) {
            return res.status(500).json({success:false, error: error})
        }
    },
  
    onGetUserById: async (req, res) => {
        try{
            const {id} = req.body;
            const user = await UserSchema.findOne(id);
            console.log("1",user);
            return res.status(200).json({success:true, user});
        }catch(error){
            return res.status(500).json({success:false, error: error});
        }
    },
  
    onCreateUser: async (req, res) => {
    try {
      const validation = makeValidation((types) => ({
        payload: req.body,
        checks: {
          firstName: { type: types.string },
          lastName: { type: types.string },
          type: { type: types.enum, options: { enum: TYPES } },
        },
      }));
      if (!validation.success) return res.status(400).json(validation);

      const { firstName, lastName, type } = req.body;
      console.log(firstName);
      console.log(lastName);
      console.log(type);
      
      console.log(TYPES);
      console.log(UserSchema);
      const user = await UserSchema.createUser({firstName, lastName, type});
      return res.status(200).json({ success: true, user });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error });
    }
  },

    onDeleteUserById: async (req, res) => {
    try {
      const user = await UserModel.remove({_id: req.params.id});
      return res.status(200).json({ 
        success: true, 
        message: `Deleted a count of ${user.deletedCount} user.` 
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  },
};
