var express = require("express");
var router = express.Router();

//import database
var connection = require("../library/db");
var com = require("../library/com");

/**
 * CREATE POST
 */
router.get("/create", function (req, res, next) {
	res.render("product/create", {
		access_id: 1,
		product_name: "",
		description: "",
		learn_link: "",
	});
});

/**
 * STORE POST
 */
router.post("/store", async function (req, res, next) {
	console.log(req.body.access_type);
	connection.query(
		"SELECT access_id FROM type_access WHERE access_type = ?",
		[req.body.access_type],
		function (err, rows) {
			if (err) {
				req.flash("error", err);
				res.render("product/create", {
					access_id: access_id,
					product_name: product_name,
					description: description,
					learn_link: learn_link,
				});
			} else {
				access_id = rows[0].access_id;
				console.log("accent_id: " + access_id);
				process_create(access_id);
			}
		}
	);

	async function process_create(access_id) {
		let { product_name, description, learn_link } = req.body;

		console.log("accent_id: " + access_id);

		await com.talk(
			"http://localhost:3000/api/product-c",
			"json",
			{
				access_id: access_id,
				product_name: product_name,
				description: description,
				learn_link: learn_link,
			},
			(response) => {
				res.redirect("/product");
			}
		);
	}
});

module.exports = router;
