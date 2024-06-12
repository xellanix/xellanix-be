var express = require("express");
var router = express.Router();

//import database
var { connect, executeQueryWithParams } = require("../library/db");
var com = require("../library/com");

/**
 * INDEX PRODUCT
 */
router.get("/", async function (req, res, next) {
	//query
	const resp = await com.listen(res, "http://localhost:3000/api/product-r", "json");
	const rjson = await resp?.json();
	let filteredResp = rjson?.filter((item) => {
		return item?.access_type === "user";
	});
	res.render("product/index", { products: filteredResp || "" });
});

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
	try {
		const [rows, fields] = await executeQueryWithParams(
			"SELECT access_id FROM type_access WHERE access_type = ?",
			[req.body.access_type]
		);

		let { product_name, description, learn_link } = req.body;

		const resp = await com.talk(res, "http://localhost:3000/api/product-c", "json", {
			access_id: rows[0].access_id,
			product_name: product_name,
			description: description,
			learn_link: learn_link,
		});

		resp ? res.redirect("/product") : res.render("product/create", formData);
	} catch (error) {
		req.flash("error", err);
		res.render("product/create", {
			access_id: access_id,
			product_name: product_name,
			description: description,
			learn_link: learn_link,
		});
	}
});

router.get("/delete/(:id)", async function (req, res, next) {
	let id = req.params.id;

	const resp = await com.listen(res, `http://localhost:3000/api/product-d/${id}`, "json");
	const rjson = await resp?.json();
	console.log(rjson);
	res.redirect("/product");
});

module.exports = router;
