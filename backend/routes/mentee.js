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
// Route 1: router.post(path, array of validators or without array both will work, callback(req, res));
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
        // res.json({name:"Rahul Maurya", age: 21});

        // check for errors in input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }

        try {
            const { name, email, city, state, skills, phone, description, password } = req.body

            //  Check if email is already registered or not
            let mentee = await Mentee.findOne({ email });
            if (mentee) {
                return res.status(400).json({ success, error: "email already Registered" });
            }

            // Encrypting the password
            const salt = await bcrypt.genSalt(10);
            const secPassword = await bcrypt.hash(password, salt);

            // Third way of Creating user using asynchronous function
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


            // Generating new Token
            // Retrieving the unique id from database which is generated automatically by mongoDB
            const data = {
                mentee: {
                    id: mentee.id,
                }
            }

            // After successful registration authToken is generated and sended to user
            const authToken = jwt.sign(data, AUTH_KEY);
            // console.log(authToken);

            success = true;
            // to remove the password
            mentee.password = undefined
            res.json({ success, mentee, authToken });

            // Need to send response else the client would keep on waiting. Not needed when authToken is being sended
            // res.json(user);

            // Catch Error if bad requests occured
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ success, error: "Internal Server Error" });
        }
    });


//  Login mentee using POST: '/login' endpoint : No Login Required
// Route 2: router.post(path, array of validators or without array both will work, callback(req, res));
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
            return res.status(400).json({ success, errors: errors.array() });
        }

        try {
            const { email, password } = req.body;
            //  Check if email is already exists or not
            let mentee = await Mentee.findOne({ email });
            if (!mentee) {
                return res.status(400).json({ success, error: "Please Login using correct Credentials" });
            }

            const passwordMatch = await bcrypt.compare(password, mentee.password);
            if (!passwordMatch) {
                return res.status(400).json({ success, error: "Please Login using correct Credentials" });
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
            // console.log(authToken);

            success = true;
            // to remove the password
            mentee.password = undefined
            res.json({ success, mentee, authToken });

            // Need to send response else the client would keep on waiting. Not needed when authToken is being sended
            // res.json(user);

            // Catch Error if bad requests occured
        } catch (err) {
            console.error(err.message);
            res.status(500).send({ success, msg: "Internal Server Error" });
        }
    })



// Check Token using POST: '/check-mentee' endpoint : Login Required
// Route 3: router.post(path, array of validators or without array both will work, callback(req, res));
router.get('/check-mentee', fetchmentee,
    async (req, res) => {
        try {
            const { id } = req.mentee
            const mentee = await Mentee.findById(id).select("-password");
            res.send({ success: true, mentee });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        }
    });




// Check Token using POST: '/list-mentor' endpoint : Login Required
// list mentors for the mentee for the skills he is requiring
// Route 4: router.post(path, array of validators or without array both will work, callback(req, res));
router.get('/list-mentor', fetchmentee,
    async (req, res) => {
        let success = false
        try {
            const { id } = req.mentee
            const record = await Mentee.findById(id).select("skills");
            const skills = record.skills
            
            const mentors = await Mentor.find({ skills: { $in: skills } }).select("-password -__v")
            
            res.send({ success: true, msg: "fetching mentors successful", mentors })

        } catch (err) {
            console.error(err.message);
            res.status(500).send({ success, msg: "Internal Server Error" });
        }
    });


// Export the module
module.exports = router;