var express = require("express");
var router = express.Router();
var { getUsers, signup, signin, signout } = require("../controllers/users");
var { verifyToken } = require("../middleware/verifyToken");
var refreshToken = require("../controllers/refreshToken");

router.post("/", signin);
router.get("/signup", verifyToken, getUsers); //fungsi getUsers dibatasi oleh verifyToken sehingga user perlu login untuk dapat melihat
router.post("/signup", signup);
router.get("/token", refreshToken);
router.get("/signout", signout);
/* GET users listing. */
/* router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});  */

module.exports = router;
