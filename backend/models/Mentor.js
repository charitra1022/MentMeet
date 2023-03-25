const mongoose = require('mongoose');
// import schema from mongoose to make new Schems
// import { Schema } from 'mongoose';
const Schema = mongoose.Schema;


const validateEmail = (email) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const MentorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    skills: {
        type: Array,
    },
    phone: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
    },
    description: {
        type: String,
    },
    company: {
        type: String,
    },
    position: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    following: {
        type: Array
    },
    followers: {
        type: Array
    }
});

module.exports = mongoose.model('mentor', MentorSchema);