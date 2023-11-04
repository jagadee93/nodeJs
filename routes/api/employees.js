const router = require("express").Router();
const {
    getEmployees,
    addNewEmployee,
    editEmployee,
    deleteEmployee,
    getEmployeeById
} = require("../../controllers/employeeController")
router.route("/")
    .get(getEmployees)
    .post(addNewEmployee)
    .put(editEmployee)
    .delete(deleteEmployee);

router.route("/:id")
    .get(getEmployeeById);

module.exports = router;