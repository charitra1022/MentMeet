const express = require('express');
const router = express.Router();

// bcryptjs package for password hashing and encryption
const bcrypt = require('bcryptjs');

const Mentee = require('../models/Mentee');
const Mentor = require('../models/Mentor');

// import validators
const { body, validationResult } = require('express-validator');

// JSON Web Token to generate unique Token for user
const jwt = require('jsonwebtoken');
// Signature Key
const AUTH_KEY = "MYNameISRahul@6820";

const fetchmentee = require('../middleware/fetchMentee.js');

// Create new mentee using POST: '/create-mentee' endpoint : No Login Required
// router.post(path, array of validators or without array both will work, callback(req, res));
router.post('/create-mentee',
    // body(fieldname, errorMsg)
    [
        body("name", "Enter valid name").isLength({ min: 5 }),
        body("email", "Enter valid Email").isEmail(),
        body("city", "Enter city name(min length: 3)").isLength({ min: 5 }),
        body("state", "Enter state name(min length: 3)").isLength({ min: 5 }),
        body("skills", "Enter valid skills(array)").isArray(),
        body("phone", "Enter valid phone number").isLength({ min: 10, max: 10 }),
        body("password", "Password must be of minimum 5 length").isLength({ min: 5 })
    ],
    async (req, res) => {
        let success = false;

        // check for errors in input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({ success, errors: errors.array() });
        }

        try {
            const { name, email, city, state, skills, phone, description, password } = req.body

            //  Check if email is already registered or not
            let mentee = await Mentee.findOne({ email });
            if (mentee) {
                return res.json({ success, error: "email already Registered" });
            }

            // Encrypting the password
            const salt = await bcrypt.genSalt(10);
            const secPassword = await bcrypt.hash(password, salt);

            // Creating user using asynchronous function
            mentee = await Mentee.create({
                name,
                email,
                city,
                state,
                skills,
                phone,
                description,
                password: secPassword
            });

            if (!mentee) {
                return res.json({ success, msg: "user not created" })
            }

            // Generating new Token
            // Retrieving the unique id from database which is generated automatically by mongoDB
            const data = {
                mentee: {
                    id: mentee.id,
                }
            }

            // After successful registration authToken is generated and sended to user
            const authToken = jwt.sign(data, AUTH_KEY);

            success = true;
            // to remove the password
            mentee.password = undefined
            return res.json({ success, mentee, authToken });

            // Catch Error if bad requests occured
        } catch (err) {
            const msg = err.message.split(":").at(-1).trim()
            return res.json({ success, error: msg });
        }
    });


//  Login mentee using POST: '/login' endpoint : No Login Required
// router.post(path, array of validators or without array both will work, callback(req, res));
router.post('/login-mentee',
    // body(fieldname, errorMsg)
    [
        body("email", "Enter Correct email").isEmail(),
        body("password", "Password Required").exists()
    ],
    async (req, res) => {
        let success = false

        // check for errors in input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({ success, errors: errors.array() });
        }

        try {
            const { email, password } = req.body;
            //  Check if email is already exists or not
            let mentee = await Mentee.findOne({ email });
            if (!mentee) {
                return res.json({ success, error: "Email not registered" });
            }

            const passwordMatch = await bcrypt.compare(password, mentee.password);
            if (!passwordMatch) {
                return res.json({ success, error: "Incorrect Password" });
            }

            // If Login Successful Generate new Token
            // Retrieving the unique id from database which is generated automatically by mongoDB
            const data = {
                mentee: {
                    id: mentee.id,
                }
            }

            // After successful login authToken is generated and sended to user
            const authToken = jwt.sign(data, AUTH_KEY);

            success = true;
            // to remove the password
            mentee.password = undefined
            return res.json({ success, mentee, authToken });

            // Catch Error if bad requests occured
        } catch (err) {
            const msg = err.message.split(":").at(-1).trim()
            return res.json({ success, error: msg });
        }
    })


// Check Token using POST: '/check-mentee' endpoint : Login Required
// router.post(path, array of validators or without array both will work, callback(req, res));
router.get('/get-mentee-details', fetchmentee,
    async (req, res) => {
        let success = false
        try {
            const { id } = req.mentee
            const mentee = await Mentee.findById(id).select("-password");

            if (!mentee) {
                return res.json({ success, msg: "mentee not found" })
            }

            return res.json({ success: true, mentee });
        } catch (err) {
            const msg = err.message.split(":").at(-1).trim()
            return res.json({ success, error: msg });
        }
    });


// update mentee details
router.post('/update-mentee-details',
    // body(fieldname, errorMsg)
    [
        body("name", "Enter valid name").isLength({ min: 5 }),
        body("city", "Enter city name(min length: 3)").isLength({ min: 5 }),
        body("state", "Enter state name(min length: 3)").isLength({ min: 5 }),
        body("phone", "Enter valid phone number").isLength({ min: 10, max: 10 }),
        body("skills", "Enter valid skills(array)").isArray(),
    ],
    fetchmentee,
    async (req, res) => {
        let success = false;
        // check for errors in input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({ success, errors: errors.array() });
        }

        try {
            const { name, city, state, skills, phone, description } = req.body
            const { id } = req.mentee

            //  Check if email is already registered or not
            let mentee = await Mentee.findById(id);
            if (!mentee) {
                return res.json({ success, error: "Mentee not found" });
            }

            const result = await Mentee.findByIdAndUpdate(
                { _id: id },
                {
                    name, 
                    city, 
                    state, 
                    skills, 
                    phone, 
                    description
                },
                { new: true }
            );
            // new : true indicates to return the updated document

            if (!result) {
                return res.json({ success, msg: "Mentee details not updated" })
            }

            success = true;
            result.password = undefined
            return res.json({ success, result });

            // Catch Error if bad requests occured
        } catch (err) {
            const msg = err.message.split(":").at(-1).trim()
            return res.json({ success, error: msg });
        }
    });


// Check Token using POST: '/list-mentor' endpoint : Login Required
// list all mentors for the mentee for the skills he is requiring
// router.post(path, array of validators or without array both will work, callback(req, res));
router.get('/list-mentor', fetchmentee,
    async (req, res) => {
        let success = false
        try {
            const { id } = req.mentee
            const mentee = await Mentee.findById(id).select("skills");

            if (!mentee) {
                return res.json({ success, msg: "mentee not found" })
            }

            const skills = mentee.skills

            const mentors = await Mentor.find({ skills: { $in: skills } }).select("-password -__v")

            if (!mentors) {
                return res.json({ success, msg: "mentor not found" })
            }

            return res.json({ success: true, msg: "fetching mentors successful", mentors })

        } catch (err) {
            const msg = err.message.split(":").at(-1).trim()
            return res.json({ success, error: msg });
        }
    });


// Check Token using POST: '/get-mentee-skills' endpoint : Login Required
// list mentee skills
// Route 4: router.post(path, array of validators or without array both will work, callback(req, res));
router.get('/get-mentee-skills', fetchmentee,
    async (req, res) => {
        let success = false
        try {
            const { id } = req.mentee
            const mentee = await Mentee.findById(id).select("skills");

            if (!mentee) {
                return res.json({ success, msg: "mentee not found" })
            }

            const skills = mentee.skills

            return res.json({ success: true, msg: "fetching mentee skills successful", skills })

        } catch (err) {
            const msg = err.message.split(":").at(-1).trim()
            return res.json({ success, error: msg });
        }
    });


// adding more skills in mentee skillset
router.post('/add-mentee-skills', fetchmentee,
    async (req, res) => {
        let success = false
        try {
            const { id } = req.mentee
            const { skills } = req.body
            let mentee = await Mentee.findById(id)

            if (!mentee) {
                return res.json({ success, msg: "mentee not found" })
            }

            const _id = mentee._id

            const result = await Mentee.updateOne(
                { _id },
                { $addToSet: { skills: { $each: skills } } }
            )

            if (!result) {
                return res.json({ success, msg: "skills not added" })
            }

            success = true;
            return res.json({ success, msg: "mentee skills added", result });
        } catch (err) {
            const msg = err.message.split(":").at(-1).trim()
            return res.json({ success, error: msg });
        }
    }
)



// get the mentee for mentor dashboard
// if id provided then get the details of that mentee
// else list all the mentees
router.get('/get-mentee', async (req, res) => {
    let success = false
    try {
        const { id } = req.headers
        let mentee
        if (id) {
            mentee = await Mentee.findById(id)
        } else {
            mentee = await Mentee.find()
        }

        if (!mentee) {
            return res.json({ success, msg: "mentee not found" })
        }

        mentee.password = undefined
        success = true
        return res.json({ success, mentee })
    } catch (err) {
        const msg = err.message.split(":").at(-1).trim()
        return res.json({ success, error: msg });
    }
})



// api for updating the mentee password
// login required
router.post('/update-mentee-password', fetchmentee,
    // body(fieldname, errorMsg)
    [
        body("password", "Password must be of minimum 5 length").isLength({ min: 5 })
    ],
    async (req, res) => {
        let success = false;
        // check for errors in input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({ success, errors: errors.array() });
        }

        try {
            const { password } = req.body
            const { id } = req.mentee

            // Encrypting the password
            const salt = await bcrypt.genSalt(10);
            const secPassword = await bcrypt.hash(password, salt);

            let mentee = await Mentee.findById(id)
            if (!mentee) {
                return res.json({ success, msg: "mentor not found" });
            }
            const _id = mentee._id

            // Updating the mentor password
            mentee = await Mentee.updateOne({ _id },
                {
                    $set: {
                        password: secPassword
                    }
                }
            );

            if (!mentee) {
                return res.json({ success, msg: "password not updated" })
            }

            success = true;
            // to remove the password
            mentee.password = undefined
            return res.json({ success, msg: "password updated successfully", mentee });

            // Catch Error if bad requests occured
        } catch (err) {
            const msg = err.message.split(":").at(-1).trim()
            return res.json({ success, error: msg });
        }
    })



// route for adding the to following list of the mentee
// and then adding mentee to the followers list of the mentor
router.post('/add-following-mentee', fetchmentee, async (req, res) => {
    const { id } = req.mentee
    const { mentor_id } = req.body

    let _id = id
    let success = false
    try {
        if (id === mentor_id) {
            return res.json({ success, msg: "following and follower ids cannot be same" })
        }

        let result1 = await Mentee.findByIdAndUpdate(
            { _id },
            {
                $addToSet: { "following": mentor_id }
            },
            { new: true }
        )

        if (!result1) {
            return res.json({ success, msg: "following not added" })
        }

        let mentee_id = id
        _id = mentor_id
        let result2 = await Mentor.findByIdAndUpdate(
            { _id },
            {
                $addToSet: { "followers": mentee_id }
            },
            { new: true }
        )

        // need to revert the above changes if current operation fails
        if (!result2) {
            return res.json({ success, msg: "followers not added" })
        }

        success = true;

        // remove the result from response afterwards
        result2.password = undefined
        return res.json({ success, msg: "transaction done", result2 });
    } catch (err) {
        const msg = err.message.split(":").at(-1).trim()
        return res.json({ success, error: msg });
    }
})



// route for removing from the following list of the mentee
// and then removing mentee from the followers list of the mentor
router.post('/remove-following-mentee', fetchmentee, async (req, res) => {
    const { id } = req.mentee
    const { mentor_id } = req.body

    let _id = id
    let success = false
    try {

        if (id === mentor_id) {
            return res.json({ success, msg: "following and follower ids cannot be same" })
        }

        let result1 = await Mentee.findByIdAndUpdate(
            { _id },
            {
                $unset: { "following": mentor_id }
            },
            { new: true }
        )

        if (!result1) {
            return res.json({ success, msg: "following not removed" })
        }

        let mentee_id = id
        _id = mentor_id
        let result2 = await Mentor.findByIdAndUpdate(
            { _id },
            {
                $unset: { "followers": mentee_id }
            },
            { new: true }
        )

        // need to revert the above changes if current operation fails
        if (!result2) {
            return res.json({ success, msg: "followers not removed" })
        }

        // remove the result from response afterwards
        success = true;
        result2.password = undefined
        return res.json({ success, msg: "transaction done", result1, result2 });
    } catch (err) {
        const msg = err.message.split(":").at(-1).trim()
        return res.json({ success, error: msg });
    }
})


// Export the module
module.exports = router;