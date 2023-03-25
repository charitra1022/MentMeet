// JSON Web Token to generate unique Token for user
const jwt = require('jsonwebtoken');
// Signature Key
const AUTH_KEY = "MYNameISRahul@6820";

// middleware fxn(request, response, callbackfxn)
const fetchmentee = (req, res, next) => {
    let success = false
    // Get the authenticated token from the header having key: auth-token
    const authToken = req.header('auth-token');
    if (!authToken) {
        res.json({ success, error: "Not valid Token" });
        return
    }

    // Fetch data after verifying the token received from the user and fetch the data(body) from token
    try {
        const data = jwt.verify(authToken, AUTH_KEY);
        req.mentor = data.mentor;
        next();
    } catch (err) {
        const msg = err.message.split(":").at(-1).trim()
        res.json({ success, error: msg });
    }

}

module.exports = fetchmentee;