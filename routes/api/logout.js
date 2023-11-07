const router = require("express").Router();
const { handleLogout } = require("../../controllers/refreshTokenController")
router.get("/", handleLogout)
module.exports = router