const allowedOrigins = require("../config/allowedOrigins")

//credentials
//for request with fetch and when sending cookies 


const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Credentials", true);
    }
    next();
}

module.exports = credentials