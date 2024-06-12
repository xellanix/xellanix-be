var express = require("express");
var router = express.Router();
const multer = require("multer");
//limit filesize to 5 MB
const upload = multer({ dest: "./public/images/uploads/", limits: { fileSize: 5000000 } });

//import database
var { connect, executeQuery, executeQueryWithParams } = require("../library/db");
var com = require("../library/com");
var utils = require("../library/utils");
var { verifyTokenFn } = require("../middleware/verifyToken");
var path = require("path");
var fs = require("fs");

const localhost = "http://localhost:3000/";

// Create product
router.post("/eb82c110-9a34-46a0-9587-db8bf8576014", async function (req, res, next) {
	const { prod_name, prod_desc, prod_url } = req.body;

	const bodyData = {
		access_id: 1,
		product_name: prod_name,
		description: prod_desc,
		learn_link: prod_url,
	};

	const resp = await com.talk(res, localhost + "api/product-c", "json", bodyData);
	resp && res.json(await resp.json());
});

async function getAccessID() {
	try {
		const [results, fields] = await executeQuery("SELECT * FROM type_access");

		return results;
	} catch (error) {
		throw new Error("Query error: " + err.message);
	}
}

async function filterAsync(arr, callback) {
	const results = await Promise.all(arr.map(callback));

	return arr.filter((_item, index) => results[index]);
}

// Read product
router.get("/da24dea7-d4ce-4e31-a531-96d6c466ea38", async function (req, res, next) {
	const verify = verifyTokenFn(req);
	const access_id = req?.decoded?.access_id || 1;

	const resp = await com.listen(res, localhost + "api/product-r", "json");
	const rjson = await resp?.json();

	const accessID = await getAccessID();

	const findAccessID = (access_type) =>
		accessID.find((row) => {
			return row.access_type == access_type;
		})?.access_id || 1;

	let filteredResp = await filterAsync(rjson, (item) => {
		const item_access_id = findAccessID(item.access_type);
		return item_access_id <= access_id;
	});

	resp &&
		res.json({
			items: filteredResp,
			action:
				access_id >= 2
					? {
							edit: access_id >= 2,
							delete: access_id >= 2,
					  }
					: {},
		});
});

// Create member
// use this UUIDv4:
// 23b9d3e8-ae4d-4420-b136-ea905f7844ed
router.post(
	"/23b9d3e8-ae4d-4420-b136-ea905f7844ed",
	upload.single("member_img"),
	async function (req, res, next) {
		const { member_name, member_role } = req.body;
		const member_img = req.file;

		const bodyData = {
			access_id: 1,
			member_name: member_name,
			member_role: member_role,
			member_photo: member_img,
		};

		const resp = await com.talk(res, localhost + "api/member-c", "json", bodyData);
		resp && res.json(await resp.json());
	}
);

// Read member
router.get("/2410fb2e-bd08-4678-be1b-c05ebb13a5c1", async function (req, res, next) {
	const verify = verifyTokenFn(req);
	const access_id = req?.decoded?.access_id || 1;

	const resp = await com.listen(res, localhost + "api/member-r", "json");
	const rjson = await resp?.json();

	const accessID = await getAccessID();

	const findAccessID = (access_type) =>
		accessID.find((row) => {
			return row.access_type == access_type;
		})?.access_id || 1;

	let filteredResp = await filterAsync(rjson, (item) => {
		const item_access_id = findAccessID(item.access_type);
		return item_access_id <= access_id;
	});

	resp &&
		res.json({
			items: filteredResp,
			action:
				access_id >= 2
					? {
							edit: access_id >= 2,
							delete: access_id >= 2,
					  }
					: {},
		});
});

router.post("/product-c", async function (req, res, next) {
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
		if (access_id < 1 || access_id > 3) {
			errors = true;

			// set flash message
			req.flash("error", "Invalid access id");
			throw new Error("Missing required fields: access_id");
		}

		const isNullEntries = utils.isNullEntries({ product_name, description, learn_link });
		if (isNullEntries) {
			errors = true;

			// set flash message
			req.flash("error", `Please enter the ${isNullEntries.readableEntry}`);
			throw new Error(`Missing required fields: ${isNullEntries.entry}`);
		}

		// if no error
		if (!errors) {
			// insert query
			await executeQueryWithParams("INSERT INTO product SET ?", formData);

			req.flash("success", "Data saved successfully");
			res.json({ message: `Product with name ${product_name} created successfully` });
		}
	} catch (error) {
		console.error("Error in /api/product-c route:", error.message);
		res.status(400).json({ error: error.message });
	}
});

router.get("/product-r", async function (req, res, next) {
	try {
		const [rows] = await executeQuery(
			"SELECT product_id, access_type, product_name, description, learn_link FROM product JOIN type_access ON product.access_id = type_access.access_id ORDER BY type_access.access_id, product_id, product_name"
		);

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
	} catch (error) {
		console.error("Error in /api/product-r route:", error.message);
		res.status(400).json({ error: error.message });
	}
});

router.get("/product-d/(:id)", async function (req, res, next) {
	try {
		let id = req.params.id;
		const [rows] = await executeQueryWithParams("DELETE FROM product WHERE product_id = ?", [
			id,
		]);

		req.flash("success", "Data deleted successfully");
		res.json({ message: `Product with id ${id} deleted successfully` });
	} catch (error) {
		console.error("Error in /api/product-d route:", error.message);
		res.status(400).json({ error: error.message });
	}
});

router.post("/member-c", async function (req, res, next) {
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

	console.log(formData);

	try {
		if (access_id < 1 || access_id > 3) {
			errors = true;

			// set flash message
			req.flash("error", "Invalid access id");
			throw new Error("Missing required fields: access_id");
		}

		const isNullEntries = utils.isNullEntries({ member_name, member_role, member_photo });
		if (isNullEntries) {
			errors = true;

			// set flash message
			req.flash("error", `Please enter the ${isNullEntries.readableEntry}`);
			throw new Error(`Missing required fields: ${isNullEntries.entry}`);
		}

		const file = member_photo;
		const fileSize = file.size;
		const ext = path.extname(file.originalname);
		const filename = file.filename + ext;
		const url = `${req.protocol}://${req.get("host")}/images/uploads/${filename}`;
		fs.rename(
			`./public/images/uploads/${file.filename}`,
			`./public/images/uploads/${filename}`,
			function (err) {
				if (err) {
					errors = true;

					// set flash message
					req.flash("error", `file rename error: ${err.message}`);
					throw new Error(`fs rename error: ${err.message}`);
				}
			}
		);
		formData.member_photo = url;

		// if no error
		if (!errors) {
			// insert query
			await executeQueryWithParams("INSERT INTO member SET ?", formData);

			req.flash("success", "Data saved successfully");
			res.json({ message: `Member with name ${member_name} created successfully` });
		}
	} catch (error) {
		console.error("Error in /api/member-c route:", error.message);
		res.status(400).json({ error: error.message });
	}
});

router.get("/member-r", async function (req, res, next) {
	try {
		const [rows] = await executeQuery(
			"SELECT member_id, access_type, member_name, member_role, member_photo FROM member JOIN type_access ON member.access_id = type_access.access_id ORDER BY type_access.access_id, member_id, member_role, member_name"
		);

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
	} catch (error) {
		console.error("Error in /api/member-r route:", error.message);
		res.status(400).json({ error: error.message });
	}
});

router.get("/member-d/(:id)", async function (req, res, next) {
	try {
		let id = req.params.id;
		const [rows] = await executeQueryWithParams("DELETE FROM member WHERE member_id = ?", [id]);

		req.flash("success", "Data deleted successfully");
		res.json({ message: `Member with id ${id} deleted successfully` });
	} catch (error) {
		console.error("Error in /api/member-d route:", error.message);
		res.status(400).json({ error: error.message });
	}
});

module.exports = router;
