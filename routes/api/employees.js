const router = require("express").Router();
const path = require('path');
//'E:\CODING\MERN\REACT\REACT_P\react_protected_routing\server\public\data\employees.json'
const data = require(path.join(__dirname, "..", "..", "public", "data", "employees.json"));
console.log(data)
router.route("/")
    .get((req, res) => {
        res.json(data);
    })
    .post((req, res) => {
        res.json({
            "firstName": req.body.firstName,
            "salary": req.body.salary
        });
    })
    .put((req, res) => {
        res.json({
            "firstName": req.body.firstName,
            "salary": req.body.salary
        });
    })
    .delete((req, res) => {
        res.json({ "id": req.body.id })
    });

router.route("/:id")
    .get((req, res) => {
        res.json({ "id": req.params.id });
    });

module.exports = router;