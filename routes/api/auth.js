const router = require("express").Router();
const { RegisterUser, userLogin } = require("../../controllers/userController")
router.post("/register", RegisterUser);
router.post("/login", userLogin);
module.exports = router
