const path = require("path");
const PORT = process.env.PORT || 3500;
const express = require("express");
const App = express();
const cors = require("cors");
const { requestLogger } = require("./middleware/eventLogger")
const errorHandler = require("./middleware/errorHandler")
//Request Logger ...
App.use(requestLogger);


const whiteList = ["https://www.yoursite.com", "http://localhost:5173"]

const corsOptions = { //takes two options origin and optionsSuccessStatus
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true) //error,origin is allowed 
        } else {
            callback(new Error("Not allowed by CORS."))
        }
    },
    optionsSuccessStatus: 200
}


App.use(cors(corsOptions))

//for handling url encoded form data
//and Content-Type:application/x-www-form-urlencoded
App.use(express.urlencoded({ extended: false }));
//built in middle ware for handling json data
App.use(express.json())

//for serving static files 
App.use("/", express.static(path.join(__dirname, 'public'))); //with out path also works
App.use("/subdir", express.static(path.join(__dirname, "public")))



App.use("/", require("./routes/root"));
App.use("/subdir", require("./routes/subdir"));

App.use("/api/employees", require("./routes/api/employees"))


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



