const { v4: uuid } = require("uuid")
const { format } = require("date-fns")
const fsPromises = require("fs").promises;
const fs = require("fs");
const path = require("path");


const logEvents = async (message, fileName) => {
    const id = uuid();
    const date = format(new Date(), 'ddMMyyyy\t HH:mm:ss');
    try {
        if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
            await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
        }
        const log = `${date}\t${id}\t${message}\n`;
        await fsPromises.appendFile(path.join(__dirname, "..", "logs", fileName), log, "utf-8");
    } catch (err) {
        console.log(err)
    }
}


const requestLogger = (req, res, next) => {
    console.log(req.method);
    logEvents(`method:${req.method}\t origin:${req.headers.origin}\t url:${req.url}`, "reqLog.docx");
    next();
}

module.exports = { requestLogger, logEvents };