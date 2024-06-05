var express = require("express");
var router = express.Router();

//import database
var connection = require("../library/db");
var com = require("../library/com");

const localhost = "http://localhost:3000/";

// Create product
router.post("/eb82c110-9a34-46a0-9587-db8bf8576014", async function (req, res, next) {
	const { prod_name, prod_desc, prod_url } = req.body;

	// Log the received data
	console.log("Received data:", req.body);

	const bodyData = {
		access_id: 1,
		product_name: prod_name,
		description: prod_desc,
		learn_link: prod_url,
	};

	const resp = await com.talk(res, localhost + "api/product-c", "json", bodyData);
	resp && res.json(await resp.json());
});

// Read product
router.get("/da24dea7-d4ce-4e31-a531-96d6c466ea38", async function (req, res, next) {
	const resp = await com.listen(res, localhost + "api/product-r", "json");
	resp && res.json(await resp.json());
});

// Create member
// use this UUIDv4:
// 23b9d3e8-ae4d-4420-b136-ea905f7844ed
router.post("/23b9d3e8-ae4d-4420-b136-ea905f7844ed", async function (req, res, next) {
	const { member_name, member_role, member_img } = req.body;

	// Log the received data
	console.log("Received data:", req.body);

	const bodyData = {
		access_id: 1,
		member_name: member_name,
		member_role: member_role,
		member_photo:member_img,
	};

	const resp = await com.talk(res, localhost + "api/member-c", "json", bodyData);
	resp && res.json(await resp.json());
});


// Read member
router.get("/2410fb2e-bd08-4678-be1b-c05ebb13a5c1", async function (req, res, next) {
	const resp = await com.listen(res, localhost + "api/member-r", "json");
	resp && res.json(await resp.json());
});

router.post("/product-c", function (req, res, next) {
	let access_id = req.body.access_id;
	let product_name = req.body.product_name;
	let description = req.body.description;
	let learn_link = req.body.learn_link;
	let errors = false;

	let formData = {
		access_id: access_id,
		product_name: product_name,
		description: description,
		learn_link: learn_link,
	};

	try {
		console.log(formData);
		if (access_id < 1 || access_id > 3) {
			errors = true;

			// set flash message
			req.flash("error", "Invalid access id");
			// render to add.ejs with flash message
			res.render("product/create", formData);
			throw new Error("Missing required fields: access_id");
		}

		if (product_name.length === 0) {
			errors = true;

			// set flash message
			req.flash("error", "Please enter the product name");
			// render to add.ejs with flash message
			res.render("product/create", formData);
			throw new Error("Missing required fields: product_name");
		}

		if (description.length === 0) {
			errors = true;

			// set flash message
			req.flash("error", "Please enter the description");
			// render to add.ejs with flash message
			res.render("product/create", formData);
			throw new Error("Missing required fields: description");
		}

		if (learn_link.length === 0) {
			errors = true;

			// set flash message
			req.flash("error", "Please enter the learn link");
			// render to add.ejs with flash message
			res.render("product/create", formData);
			throw new Error("Missing required fields: learn_link");
		}

		// if no error
		if (!errors) {
			// insert query
			connection.query("INSERT INTO product SET ?", formData, function (err, result) {
				//if(err) throw err
				if (err) {
					req.flash("error", err);

					// render to add.ejs
					res.render("product/create", {
						access_id: formData.access_id,
						product_name: formData.product_name,
						description: formData.description,
						learn_link: formData.learn_link,
					});
				} else {
					req.flash("success", "Data saved successfully");
					res.json({ message: `Product with name ${product_name} created successfully` });
				}
			});
		}
	} catch (error) {
		console.error("Error in /api/product-c route:", error.message);
		res.status(400).json({ error: error.message });
	}
});

router.get("/product-r", function (req, res, next) {
	try {
		connection.query(
			"SELECT product_id, access_type, product_name, description, learn_link FROM product JOIN type_access ON product.access_id = type_access.access_id ORDER BY type_access.access_id, product_id, product_name",
			function (err, rows) {
				if (err) {
					req.flash("error", err);
					res.render("product", {
						products: "",
					});
					throw new Error("Query error: " + err.message);
				} else {
					const items = rows.map((row) => {
						return {
							product_id: row.product_id,
							access_type: row.access_type,
							product_name: row.product_name,
							description: row.description,
							learn_link: row.learn_link,
						};
					});
					res.json(items);
				}
			}
		);
	} catch (error) {
		console.error("Error in /api/product-r route:", error.message);
		res.status(400).json({ error: error.message });
	}
});

router.get("/member-r", function (req, res, next) {
	try {
		connection.query(
			"SELECT member_id, access_type, member_name, member_role, member_photo FROM member JOIN type_access ON member.access_id = type_access.access_id ORDER BY member_id, member_role, member_name",
			function (err, rows) {
				if (err) {
					req.flash("error", err);
					res.render("member", {
						members: "",
					});
					throw new Error("Query error: " + err.message);
				} else {
					const items = rows.map((row) => {
						const member = {
							member_id: row.member_id,
							access_type: row.access_type,
							member_name: row.member_name,
							member_role: row.member_role,
							member_photo: row.member_photo,
						};
						return member;
					});
					res.json(items);
				}
			}
		);
	} catch (error) {
		console.error("Error in /api/member-r route:", error.message);
		res.status(400).json({ error: error.message });
	}
});

router.post("/member-c", function (req, res, next) {
	let access_id = req.body.access_id;
	let member_name = req.body.member_name;
	let member_role = req.body.member_role;
	let member_photo = req.body.member_photo;
	let errors = false;

	let formData = {
		access_id: access_id,
		member_name: member_name,
		member_role: member_role,
		member_photo: member_photo,
	};

	try {
		if (access_id < 1 || access_id > 3) {
			errors = true;

			// set flash message
			req.flash("error", "Invalid access id");
			// render to add.ejs with flash message
			res.render("member/create", formData);
			throw new Error("Missing required fields: access_id");
		}

		if (member_name.length === 0) {
			errors = true;

			// set flash message
			req.flash("error", "Please enter the member_name");
			// render to add.ejs with flash message
			res.render("member/create", formData);
			throw new Error("Missing required fields: member_name");
		}

		if (member_role.length === 0) {
			errors = true;

			// set flash message
			req.flash("error", "Please enter the member_role");
			// render to add.ejs with flash message
			res.render("member/create", formData);
			throw new Error("Missing required fields: member_role");
		}

		if (member_photo.length === 0) {
			errors = true;

			// set flash message
			req.flash("error", "Please enter the member_photo");
			// render to add.ejs with flash message
			res.render("member/create", formData);
			throw new Error("Missing required fields: member_photo");
		}

		// if no error
		if (!errors) {
			// insert query
			connection.query("INSERT INTO member SET ?", formData, function (err, result) {
				//if(err) throw err
				if (err) {
					req.flash("error", err);

					// render to add.ejs
					res.render("member/create", {
						access_id: formData.access_id,
						member_name: formData.member_name,
						member_role: formData.member_role,
						member_photo: formData.member_photo,
					});
				} else {
					req.flash("success", "Data saved successfully");
					res.json({ message: `Member with name ${member_name} created successfully` });
				}
			});
		}
	} catch (error) {
		console.error("Error in /api/member-c route:", error.message);
		res.status(400).json({ error: error.message });
	}
});


module.exports = router;
