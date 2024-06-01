var express = require("express");
var router = express.Router();

//import database
var connection = require("../library/db");
var com = require("../library/com");

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

	await com.talk("http://localhost:3000/api/product-c", "json", bodyData, (response) => {
		response.json().then((data) => {
			res.json(data);
		});
	});
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

module.exports = router;
