const { logEvents } = require("./eventLogger.js")

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}\t ${err.message}`, "errLog.docx");
    console.log(err.stack);
    res.status(500).send(err.message) //make sure to send 500 
}

module.exports = errorHandler