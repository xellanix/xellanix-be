var express = require("express");
var router = express.Router();

//import database
var { connect, executeQueryWithParams } = require("../library/db");
let { sql } = require("@vercel/postgres");
var com = require("../library/com");

/**
 * INDEX PRODUCT
 */
router.get("/", async function (req, res, next) {
	//query
	const resp = await com.listen(
		res,
		`${req.protocol}://${req.get("host")}/api/product-r`,
		"json"
	);
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
	let access_id = 1;
	let { product_name, description, learn_link } = req.body;

	try {
		const { rows } =
			await sql`SELECT access_id FROM type_access WHERE access_type = ${req.body.access_type};`;

		access_id = rows[0].access_id;

		const resp = await com.talk(
			res,
			`${req.protocol}://${req.get("host")}/api/product-c`,
			"json",
			{
				access_id: access_id,
				product_name: product_name,
				description: description,
				learn_link: learn_link,
			}
		);

		resp ? res.redirect(302, "/product") : res.render("product/create", formData);
	} catch (error) {
		req.flash("error", error);
		res.render("product/create", {
			access_id: access_id,
			product_name: product_name,
			description: description,
			learn_link: learn_link,
		});
	}
});

//edit post
router.get("/edit/(:id)", async function (req, res, next) {
	let product_id = req.params.id;
	const resp = await com.listen(
		res,
		`${req.protocol}://${req.get("host")}/api/product-gu/${product_id}`,
		"json"
	);

	if (resp) {
		const rjson = await resp.json();
		res.render("product/edit", {
			product_id: rjson.product_id,
			access_id: rjson.access_id,
			product_name: rjson.product_name,
			description: rjson.description,
			learn_link: rjson.learn_link,
		});
	} else {
		req.flash("error", "There's a failure when fetching product data");
		res.redirect("/product");
	}
});

/**
 * UPDATE POST
 */
router.post("/update/(:id)", async function (req, res, next) {
	let product_id = req.params.id;
	let { access_type, product_name, description, learn_link } = req.body;
	let access_id = 1;

	try {
		const { rows } =
			await sql`SELECT access_id FROM type_access WHERE access_type = ${access_type};`;

		access_id = rows[0].access_id;

		const formData = {
			access_id: access_id,
			product_name: product_name,
			description: description,
			learn_link: learn_link,
		};

		const resp = await com.talk(
			res,
			`${req.protocol}://${req.get("host")}/api/product-u/${product_id}`,
			"json",
			formData
		);
		resp ? res.redirect(302, "/product") : res.render("product/update/(:id)", formData);
	} catch (err) {
		req.flash("error", err.message);
		res.render("product/edit", {
			product_id: product_id,
			access_id: access_id,
			product_name: product_name,
			description: description,
			learn_link: learn_link,
		});
	}
});

router.get("/delete/(:id)", async function (req, res, next) {
	let id = req.params.id;

	const resp = await com.listen(
		res,
		`${req.protocol}://${req.get("host")}/api/product-d/${id}`,
		"json"
	);
	const rjson = await resp?.json();
	console.log(rjson);
	res.redirect("/product");
});

module.exports = router;
