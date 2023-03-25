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
        body("phone", "Enter valid phone number").isLength({ min: 10, max: 10 }),
        body("password", "Password must be of minimum 5 length").isLength({ min: 5 }),
        body("skills", "Enter valid skills(array)").isArray(),
        body("rating", "Enter valid rating").isNumeric(),
        body("company", "Enter valid company").isLength({ min: 3 }),
        body("position", "Enter valid position").isLength({ min: 3 }),
    ],
    async (req, res) => {
        let success = false;
        // check for errors in input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({ success, errors: errors.array() });
        }

        try {
            const { name, email, city, state, skills, phone, description, rating, company, position, password } = req.body

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
            res.json({ success, mentor, authToken });

            // Need to send response else the client would keep on waiting. Not needed when authToken is being sended
            // res.json(user);

            // Catch Error if bad requests occured
        } catch (err) {
            console.error(err.message);
            res.status(500).send({ success, msg: "Internal Server Error" });
        }
    })


// update mentor details
router.post('/update-mentor-details',
    // body(fieldname, errorMsg)
    [
        body("name", "Enter valid name").isLength({ min: 5 }),
        body("email", "Enter valid Email").isEmail(),
        body("city", "Enter city name(min length: 3)").isLength({ min: 5 }),
        body("state", "Enter state name(min length: 3)").isLength({ min: 5 }),
        body("phone", "Enter valid phone number").isLength({ min: 10, max: 10 }),
        body("skills", "Enter valid skills(array)").isArray(),
        body("rating", "Enter valid rating").isNumeric(),
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
            const { name, email, city, state, skills, phone, description, rating, company, position } = req.body
            const { id } = req.mentor

            //  Check if email is already registered or not
            let mentor = await Mentor.findOne({ email });
            if (!mentor) {
                return res.json({ success, error: "Email not Registered" });
            }

            // Third way of Creating user using asynchronous function
            const result = await Mentor.findByIdAndUpdate(
                { id },
                {
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
                });

            success = true;
            
            res.json({ success, result });

            // Catch Error if bad requests occured
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ success, error: "Internal Server Error" });
        }
    });



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




// Check Token using POST: '/get-mentor-skills' endpoint : Login Required
// list mentor skills
// Route 4: router.post(path, array of validators or without array both will work, callback(req, res));
router.get('/get-mentor-skills', fetchmentor,
    async (req, res) => {
        let success = false
        try {
            const { id } = req.mentor
            const record = await Mentor.findById(id).select("skills");
            const skills = record.skills

            res.send({ success: true, msg: "fetching mentor skills successful", skills })

        } catch (err) {
            console.error(err.message);
            res.status(500).send({ success, msg: "Internal Server Error" });
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
            const _id = mentor._id

            // Updating the mentor password
            mentor = await Mentor.updateOne({ _id },
                {
                    $set: {
                        password: secPassword
                    }
                }
            );

            success = true;
            // to remove the password
            mentor.password = undefined
            res.json({ success, msg: "password updated successfully", mentor });

            // Catch Error if bad requests occured
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ success, error: "Internal Server Error" });
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
            const _id = mentor._id

            const result = await Mentor.updateOne(
                { _id },
                { $addToSet: { skills: { $each: skills } } }
            )

            success = true;
            res.json({ success, msg: "skills updated", result });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ success, error: "Internal Server Error" });
        }
    }
)

// Export the module
module.exports = router;