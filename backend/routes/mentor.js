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


// Create new mentor using POST: '/create-mentor' endpoint : No Login Required
// Route 1: router.post(path, array of validators or without array both will work, callback(req, res));
router.post('/create-mentor',
    // body(fieldname, errorMsg)
    [
        body("name", "Enter valid name").isLength({ min: 5 }),
        body("email", "Enter valid Email").isEmail(),
        body("city", "Enter city name(min length: 3)").isLength({ min: 5 }),
        body("state", "Enter state name(min length: 3)").isLength({ min: 5 }),
        body("skills", "Enter valid skills(array)").isArray(),
        body("phone", "Enter valid phone number").isLength({ min: 10, max: 10 }),
        body("rating", "Enter valid rating").isNumeric(),
        body("company", "Enter valid company").isLength({ min: 3 }),
        body("position", "Enter valid position").isLength({ min: 3 }),
        body("password", "Password must be of minimum 5 length").isLength({ min: 5 })
    ],
    async (req, res) => {
        let success = false;
        // check for errors in input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }

        try {
            const { name, email, city, state, skills, phone, description, rating, company, position, password } = req.body

            //  Check if email is already registered or not
            let mentor = await Mentor.findOne({ email });
            if (mentor) {
                return res.status(400).json({ success, error: "email already Registered" });
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
                skills,
                phone,
                description,
                rating,
                company,
                position,
                password: secPassword
            });


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
            res.json({ success, mentor, authToken });

            // Need to send response else the client would keep on waiting. Not needed when authToken is being sended
            // res.json(user);

            // Catch Error if bad requests occured
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ success, error: "Internal Server Error" });
        }
    });


//  Login mentor using POST: '/login' endpoint : No Login Required
// Route 2: router.post(path, array of validators or without array both will work, callback(req, res));
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
            return res.status(400).json({ success, errors: errors.array() });
        }

        try {
            const { email, password } = req.body;
            //  Check if email is already exists or not
            let mentor = await Mentor.findOne({ email });
            if (!mentor) {
                return res.status(400).json({ success, error: "Please Login using correct Credentials" });
            }

            const passwordMatch = await bcrypt.compare(password, mentor.password);
            if (!passwordMatch) {
                return res.status(400).json({ success, error: "Please Login using correct Credentials" });
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
            res.json({ success, mentor, authToken });

            // Need to send response else the client would keep on waiting. Not needed when authToken is being sended
            // res.json(user);

            // Catch Error if bad requests occured
        } catch (err) {
            console.error(err.message);
            res.status(500).send({ success, msg: "Internal Server Error" });
        }
    })



// Check Token using POST: '/check-mentor' endpoint : Login Required
// Route 3: router.post(path, array of validators or without array both will work, callback(req, res));
router.get('/check-mentor', fetchmentor,
    async (req, res) => {
        try {
            const { id } = req.mentor
            const mentor = await Mentor.findById(id).select("-password");
            res.send({ success: true, mentor });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
        }
    });


// Export the module
module.exports = router;