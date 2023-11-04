const whiteList = ["https://www.yoursite.com", "http://localhost:5173"]

const corsOptions = {
    //takes two options origin and optionsSuccessStatus
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true) //error,origin is allowed 
        } else {
            callback(new Error("Not allowed by CORS."))
        }
    },
    optionsSuccessStatus: 200
}
module.exports = corsOptions