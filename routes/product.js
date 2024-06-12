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

//edit post
router.get("/edit/(:id)", async function (req, res, next) {
	let product_id = req.params.id;

	try {
		const [rows, fields] = await executeQueryWithParams(
			"SELECT * FROM product WHERE product_id = ?",
			[product_id]
		);

		// render to edit.ejs
		res.render("product/edit", {
			product_id: rows[0].product_id,
			access_id: rows[0].access_id,
			product_name: rows[0].product_name,
			description: rows[0].description,
			learn_link: rows[0].learn_link,
		});
	} catch (err) {
		console.error(err);
		req.flash("error", "Terjadi kesalahan saat mengambil data produk");
		res.redirect("/product");
	}
});

/**
 * UPDATE POST
 */
router.post("/update/(:id)", async function (req, res, next) {
	try {
		let product_id = req.params.id;
		let { access_type, product_name, description, learn_link } = req.body;

		const [access_id] = await executeQueryWithParams(
			"SELECT access_id FROM type_access WHERE access_type = ?",
			[access_type]
		);

		const formData = {
			access_id: access_id[0].access_id,
			product_name: product_name,
			description: description,
			learn_link: learn_link,
		};

		const resp = await com.talk(
			res,
			`http://localhost:3000/api/product-u/${product_id}`,
			"json",
			formData
		);
		resp ? res.redirect("/product") : res.render("product/update/(:id)", formData);
	} catch (err) {
		req.flash("error", err.message);
		res.render("product/edit", {
			product_id: product_id,
			access_id: access_id[0].access_id,
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
