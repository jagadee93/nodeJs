const path = require("path");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 3500;
const express = require("express");
const App = express();
const cors = require("cors");
const { requestLogger } = require("./middleware/eventLogger");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");
const verifyJwt = require("./middleware/verifyJwt");
const cookieParser = require("cookie-parser")
const credentials = require("./middleware/credentials")
//Request Logger ...
App.use(requestLogger);

//handle credentials before cors 

App.use(credentials); //this is a preflight request handler it should be before cors .if not used cors throws error rew.header is not set 

App.use(cors(corsOptions))
//for handling url encoded form data
//and Content-Type:application/x-www-form-urlencoded
App.use(express.urlencoded({ extended: false }));
//built in middle ware for handling json data
App.use(express.json())

App.use(cookieParser()) //for handling cookies 


//for serving static files 
App.use("/", express.static(path.join(__dirname, 'public'))); //with out path also works


App.use("/api/refresh", require("./routes/api/refresh"))
App.use("/api/auth", require("./routes/api/auth"));
App.use('/api/logout', require("./routes/api/logout"))
App.use(verifyJwt) // protected routes ( applies all to all routes )
App.use("/api/employees", require("./routes/api/employees"));




App.all("*", (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, "views", "404.html"))
    }
    if (req.accepts("json")) {
        res.json({ error: "file does not exists" })
    } else {
        res.send("File not Found")
    }

})

//custom error handler 
App.use(errorHandler);

App.listen(PORT, () => {
    console.log("server listening on PORt" + PORT)
})



