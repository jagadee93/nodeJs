const router = require("express").Router();
const verifyJwt = require("../../middleware/verifyJwt")
const {
    getEmployees,
    addNewEmployee,
    editEmployee,
    deleteEmployee,
    getEmployeeById
} = require("../../controllers/employeeController")
router.route("/")
    .get(getEmployees)
    .post(addNewEmployee)//post(verifyJwt, addNewEmployee)
    .put(editEmployee)
    .delete(deleteEmployee);

router.route("/:id")
    .get(getEmployeeById);

module.exports = router;