var express = require("express");
var router = express.Router();

//import database
var connection = require("../library/db");
var com = require("../library/com");

/**
 * INDEX MEMBER
 */
router.get("/", async function (req, res, next) {
	//query
	const resp = await com.listen("http://localhost:3000/api/member-r", "json");
	resp && res.render("member/index", { members: await resp.json() });
});

module.exports = router;
