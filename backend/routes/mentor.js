const express = require('express');
const router = express.Router();

// bcryptjs package for password hashing and encryption
const bcrypt = require('bcryptjs');

const Mentor = require('../models/Mentor');

// import validators
const { body, validationResult } = require('express-validator');

// JSON Web Token to generate unique Token for user
const jwt = require('jsonwebtoken');
// Signature Key
const AUTH_KEY = "MYNameISRahul@6820";

const fetchmentor = require('../middleware/fetchmentor.js');
const Mentee = require('../models/Mentee');


// Create new mentor using POST: '/create-mentor' endpoint : No Login Required
// router.post(path, array of validators or without array both will work, callback(req, res));
router.post('/create-mentor',
    // body(fieldname, errorMsg)
    [
        body("name", "Enter valid name").isLength({ min: 5 }),
        body("email", "Enter valid Email").isEmail(),
        body("city", "Enter city name(min length: 3)").isLength({ min: 5 }),
        body("state", "Enter state name(min length: 3)").isLength({ min: 5 }),
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
            const { name, email, city, state, phone, password } = req.body

            //  Check if email is already registered or not
            let mentor = await Mentor.findOne({ email });
            if (mentor) {
                return res.json({ success, error: "email already Registered" });
            }

            // Encrypting the password
            const salt = await bcrypt.genSalt(10);
            const secPassword = await bcrypt.hash(password, salt);

            // Third way of Creating user using asynchronous function
            mentor = await Mentor.create({
                name,
                email,
                city,
                state,
                phone,
                password: secPassword
            });


            if (!mentor) {
                return res.json({ success, msg: "user not created" })
            }

            // Generating new Token
            // Retrieving the unique id from database which is generated automatically by mongoDB
            const data = {
                mentor: {
                    id: mentor.id,
                }
            }

            // After successful registration authToken is generated and sended to user
            const authToken = jwt.sign(data, AUTH_KEY);
            // console.log(authToken);

            success = true;
            // to remove the password
            mentor.password = undefined
            return res.json({ success, mentor, authToken });

            // Need to send response else the client would keep on waiting. Not needed when authToken is being sended
            // res.json(user);

            // Catch Error if bad requests occured
        } catch (err) {
            const msg = err.message.split(":").at(-1).trim()
            return res.json({ success, error: msg });
        }
    });


//  Login mentor using POST: '/login' endpoint : No Login Required
// router.post(path, array of validators or without array both will work, callback(req, res));
router.post('/login-mentor',
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
            let mentor = await Mentor.findOne({ email });
            if (!mentor) {
                return res.json({ success, error: "Email not registered" });
            }

            const passwordMatch = await bcrypt.compare(password, mentor.password);
            if (!passwordMatch) {
                return res.json({ success, error: "Incorrect password" });
            }

            // If Login Successful Generate new Token
            // Retrieving the unique id from database which is generated automatically by mongoDB
            const data = {
                mentor: {
                    id: mentor.id,
                }
            }

            // After successful login authToken is generated and sended to user
            const authToken = jwt.sign(data, AUTH_KEY);
            // console.log(authToken);

            success = true;
            // to remove the password
            mentor.password = undefined
            return res.json({ success, mentor, authToken });

            // Catch Error if bad requests occured
        } catch (err) {
            const msg = err.message.split(":").at(-1).trim()
            return res.json({ success, error: msg });
        }
    })


// update mentor details
router.post('/update-mentor-details',
    // body(fieldname, errorMsg)
    [
        body("name", "Enter valid name").isLength({ min: 5 }),
        body("city", "Enter city name(min length: 3)").isLength({ min: 5 }),
        body("state", "Enter state name(min length: 3)").isLength({ min: 5 }),
        body("phone", "Enter valid phone number").isLength({ min: 10, max: 10 }),
        body("skills", "Enter valid skills(array)").isArray(),
        body("rating", "Enter rating").isNumeric(),
        body("company", "Enter valid company").isLength({ min: 3 }),
        body("position", "Enter valid position").isLength({ min: 3 }),
    ],
    fetchmentor,
    async (req, res) => {
        let success = false;
        // check for errors in input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({ success, errors: errors.array() });
        }

        try {
            const { name, city, state, skills, phone, description, rating, company, position } = req.body
            const { id } = req.mentor

            //  Check if email is already registered or not
            let mentor = await Mentor.findById(id);
            if (!mentor) {
                return res.json({ success, error: "Mentor not found" });
            }

            const result = await Mentor.findByIdAndUpdate(
                { _id: id },
                {
                    name,
                    city,
                    state,
                    skills,
                    phone,
                    description,
                    rating,
                    company,
                    position,
                },
                { new: true }
            );
            // new : true indicates to return the updated document

            if (!result) {
                return res.json({ success, msg: "Mentor details not updated" })
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



// Check Token using POST: '/check-mentor' endpoint : Login Required
// router.post(path, array of validators or without array both will work, callback(req, res));
router.get('/get-mentor-details', fetchmentor,
    async (req, res) => {
        try {
            const { id } = req.mentor
            const mentor = await Mentor.findById(id).select("-password");

            if (!mentor) {
                return res.json({ success, msg: "mentor not found" })
            }

            return res.json({ success: true, mentor });
        } catch (err) {
            const msg = err.message.split(":").at(-1).trim()
            return res.json({ success, error: msg });
        }
    });


// Check Token using POST: '/get-mentor-skills' endpoint : Login Required
// list mentor skills
// router.post(path, array of validators or without array both will work, callback(req, res));
router.get('/get-mentor-skills', fetchmentor,
    async (req, res) => {
        let success = false
        try {
            const { id } = req.mentor
            const mentor = await Mentor.findById(id).select("skills");

            if (!mentor) {
                return res.json({ success, msg: "mentor not found" })
            }

            const skills = mentor.skills

            return res.json({ success: true, msg: "fetching mentor skills successful", skills })
        } catch (err) {
            const msg = err.message.split(":").at(-1).trim()
            return res.json({ success, error: msg });
        }
    });


// api for updating the mentor password
// login required
router.post('/update-mentor-password', fetchmentor,
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
            const { id } = req.mentor

            // Encrypting the password
            const salt = await bcrypt.genSalt(10);
            const secPassword = await bcrypt.hash(password, salt);

            let mentor = await Mentor.findById(id)
            if (!mentor) {
                return res.json({ success, msg: "mentor not found" });
            }
            const _id = mentor._id

            // Updating the mentor password
            mentor = await Mentor.updateOne({ _id },
                {
                    $set: {
                        password: secPassword
                    }
                }
            );

            if (!mentor) {
                return res.json({ success, msg: "password not updated" })
            }

            success = true;
            // to remove the password
            mentor.password = undefined
            return res.json({ success, msg: "password updated successfully", mentor });

            // Catch Error if bad requests occured
        } catch (err) {
            const msg = err.message.split(":").at(-1).trim()
            return res.json({ success, error: msg });
        }
    })



// adding more skills in mentor skillset
router.post('/add-mentor-skills', fetchmentor,
    async (req, res) => {
        let success = false
        try {
            const { id } = req.mentor
            const { skills } = req.body
            let mentor = await Mentor.findById(id)

            if (!mentor) {
                return res.json({ success, msg: "mentor not found" })
            }

            const _id = mentor._id

            const result = await Mentor.updateOne(
                { _id },
                { $addToSet: { skills: { $each: skills } } }
            )

            if (!result) {
                return res.json({ success, msg: "skills not added" })
            }

            success = true;
            return res.json({ success, msg: "mentor skill added", result });
        } catch (err) {
            const msg = err.message.split(":").at(-1).trim()
            return res.json({ success, error: msg });
        }
    }
)


// get the mentor for mentee dashboard
// if id provided then get the details of that mentor
// else list all the mentors
router.get('/get-mentor', async (req, res) => {
    let success = false
    try {
        const { id } = req.headers
        let mentor
        if (id) {
            mentor = await Mentor.findById(id)
        } else {
            mentor = await Mentor.find()
        }

        if (!mentor) {
            return res.json({ success, msg: "mentor not found" })
        }

        mentor.password = undefined
        success = true
        return res.json({ success, mentor })
    } catch (err) {
        const msg = err.message.split(":").at(-1).trim()
        return res.json({ success, error: msg });
    }
})


// route for adding the to following list of the mentor
// and then adding mentor to the followers list of the mentee
router.post('/add-following-mentor', fetchmentor, async (req, res) => {
    const { id } = req.mentor
    const { mentee_id } = req.body

    let _id = id
    let success = false
    try {

        if (id === mentee_id) {
            return res.json({ success, msg: "following and follower ids cannot be same" })
        }

        let result1 = await Mentor.findByIdAndUpdate(
            { _id },
            {
                $addToSet: { "following": mentee_id }
            },
            { new: true }
        )

        if (!result1) {
            return res.json({ success, msg: "following not added" })
        }

        let mentor_id = id
        _id = mentee_id
        let result2 = await Mentee.findByIdAndUpdate(
            { _id },
            {
                $addToSet: { "followers": mentor_id }
            },
            { new: true }
        )

        // need to revert the above changes if current operation fails
        if (!result2) {
            return res.json({ success, msg: "followers not added" })
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


// route for removing from the following list of the mentor
// and then removing mentor from the followers list of the mentee
router.post('/remove-following-mentor', fetchmentor, async (req, res) => {
    const { id } = req.mentor
    const { mentee_id } = req.body

    let _id = id
    let success = false
    try {

        if (id === mentee_id) {
            return res.json({ success, msg: "following and follower ids cannot be same" })
        }

        let result1 = await Mentor.findByIdAndUpdate(
            { _id },
            {
                $unset: { "following": mentee_id }
            },
            { new: true }
        )

        if (!result1) {
            return res.json({ success, msg: "following not removed" })
        }

        let mentor_id = id
        _id = mentee_id
        let result2 = await Mentee.findByIdAndUpdate(
            { _id },
            {
                $unset: { "followers": mentor_id }
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