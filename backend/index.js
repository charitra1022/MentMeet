const express = require('express')
require('./db');

const app = express()
const port = 5000

app.use(express.json());

// using cors
var cors = require('cors')
app.use(cors())

app.use('/', require('./routes/mentee'));
app.use('/', require('./routes/mentor'));


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})