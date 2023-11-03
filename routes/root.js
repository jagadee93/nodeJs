const express = require("express")
const router = express.Router();
const path = require('path');
router.get("^/$|/index(.html)?", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "..", "views", "index.html"));
});


router.get('^/$|/new(.html)?', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "..", "views", "New.html"))
});


router.get("^/$|/old(.html)?", (req, res) => {
    res.status(300).sendFile(path.join(__dirname, "..", "views", "index.html"))
})



module.exports = router