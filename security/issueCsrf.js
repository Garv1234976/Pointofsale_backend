require("dotenv").config();

const {generateCsrfToken} = require('./csrf');

module.exports = function issueCsrf(req, res, next){
    const csrfToken = generateCsrfToken();

    res.cookie('csrf_token', csrfToken, {
        httpOnly : false,
        secure: false,
        sameSite: 'lax'
    });

    req.csrfToken = csrfToken;
    next()
}