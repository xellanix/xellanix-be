var express = require('express');
var router = express.Router();
var getUsers = require ("../controllers/users");
var Register = require ("../controllers/users");
var Login = require ("../controllers/users");

router.get('/', getUsers);
router.post('/', Register);
router.post('/', Login);
/* GET users listing. */
/* router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});  */

module.exports = router;
