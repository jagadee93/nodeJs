const router = require("express").Router();
const { verifyRefreshToken } = require("../../controllers/refreshTokenController");
router.get('/', verifyRefreshToken);
module.exports = router