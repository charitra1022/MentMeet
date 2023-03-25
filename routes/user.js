const express = require('express');
//controllers
const users = require('../controllers/user.js');

const router = express.Router();

    router.get('/getById', users.onGetUserById)
        .get('/getAll', users.onGetAllUsers)
    .post('/create', users.onCreateUser)
    .delete('/delete', users.onDeleteUserById)

module.exports =  router;

