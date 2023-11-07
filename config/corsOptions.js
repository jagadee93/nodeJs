const allowedOrigins = require("./allowedOrigins");
const corsOptions = {
    //takes two options origin and optionsSuccessStatus
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true) //error,origin is allowed 
        } else {
            callback(new Error("Not allowed by CORS."))
        }
    },
    optionsSuccessStatus: 200
}
module.exports = corsOptions