const router = require("express").Router();
const verifyJwt = require("../../middleware/verifyJwt");
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require("../../middleware/verifyRoles")
const {
    getEmployees,
    addNewEmployee,
    editEmployee,
    deleteEmployee,
    getEmployeeById
} = require("../../controllers/employeeController")
router.route("/")
    .get(verifyRoles(ROLES_LIST.User), getEmployees)
    .post(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), addNewEmployee)//post(verifyJwt, addNewEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), editEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin), deleteEmployee);

router.route("/:id")
    .get(getEmployeeById);

module.exports = router;