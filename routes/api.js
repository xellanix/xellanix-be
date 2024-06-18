var express = require("express");
var router = express.Router();
var { put, del } = require("@vercel/blob");

//import database
var { sql } = require("@vercel/postgres");
var com = require("../library/com");
var utils = require("../library/utils");
var { verifyTokenFn } = require("../middleware/verifyToken");
const { randomUUID } = require("crypto");

function getOrigin(req) {
	// http://localhost:3000
	return `${req.protocol}://${req.get("host")}`;
}

async function getAccessID() {
	try {
		const { rows } = await sql`SELECT * FROM type_access;`;

		return rows;
	} catch (error) {
		throw new Error("Query error: " + error.message);
	}
}

async function filterAsync(arr, callback) {
	const results = await Promise.all(arr.map(callback));

	return arr.filter((_item, index) => results[index]);
}

// Create product
router.post("/eb82c110-9a34-46a0-9587-db8bf8576014", async function (req, res, next) {
	const verify = verifyTokenFn(req);
	const user_access_id = req?.decoded?.access_id || 1;
	if (!user_access_id || user_access_id === 1) return;

	const { prod_name, prod_desc, prod_url } = req.body;

	const bodyData = {
		access_id: 1,
		product_name: prod_name,
		description: prod_desc,
		learn_link: prod_url,
	};

	const resp = await com.talk(res, getOrigin(req) + "/api/product-c", "json", bodyData);
	resp && res.json(await resp.json());
});

// Read product
router.get("/da24dea7-d4ce-4e31-a531-96d6c466ea38", async function (req, res, next) {
	const verify = verifyTokenFn(req);
	const access_id = req?.decoded?.access_id || 1;

	const resp = await com.listen(res, getOrigin(req) + "/api/product-r", "json");
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

// Get product info (update)
router.get("/9b6c7e7d-9d7f-4c60-80eb-ac24cef7f264/(:id)", async function (req, res, next) {
	const verify = verifyTokenFn(req);
	const user_access_id = req?.decoded?.access_id || 1;
	if (!user_access_id || user_access_id === 1) return;

	const product_id = req.params.id;

	const resp = await com.listen(res, `${getOrigin(req)}/api/product-gu/${product_id}`, "json");
	const rjson = await resp?.json();

	resp && res.json(rjson);
});

// Update product
router.post("/b137a6ba-db3d-4a82-a5c5-d0b33cd2cbf9/(:id)", async function (req, res, next) {
	const verify = verifyTokenFn(req);
	const user_access_id = req?.decoded?.access_id || 1;
	if (!user_access_id || user_access_id === 1) return;

	const product_id = req.params.id;
	let { prod_name, prod_desc, prod_url } = req.body;

	const formData = {
		access_id: 1,
		product_name: prod_name,
		description: prod_desc,
		learn_link: prod_url,
	};

	const resp = await com.talk(
		res,
		`http://localhost:3000/api/product-u/${product_id}`,
		"json",
		formData
	);
	const rjson = await resp?.json();

	resp && res.json(rjson);
});

// Delete product
router.get("/295c6c91-e2b9-4c53-bc27-0b7bdcf3c517/(:id)", async function (req, res, next) {
	const verify = verifyTokenFn(req);
	const user_access_id = req?.decoded?.access_id || 1;
	if (!user_access_id || user_access_id === 1) return;

	const product_id = req.params.id;
	const resp = await com.listen(res, `http://localhost:3000/api/product-d/${product_id}`, "json");

	const rjson = await resp?.json();

	resp && res.json(rjson);
});

// Create member
router.post("/23b9d3e8-ae4d-4420-b136-ea905f7844ed", async function (req, res, next) {
	const verify = verifyTokenFn(req);
	const user_access_id = req?.decoded?.access_id || 1;
	if (!user_access_id || user_access_id === 1) return;

	const { member_img, member_name, member_role, member_img_ext } = req.body;

	const bodyData = {
		access_id: 1,
		member_name: member_name,
		member_role: member_role,
		member_photo: member_img,
		member_photo_ext: member_img_ext,
	};

	const resp = await com.talk(res, getOrigin(req) + "/api/member-c", "json", bodyData);
	resp && res.json(await resp.json());
});

// Read member
router.get("/2410fb2e-bd08-4678-be1b-c05ebb13a5c1", async function (req, res, next) {
	const verify = verifyTokenFn(req);
	const access_id = req?.decoded?.access_id || 1;

	const resp = await com.listen(res, getOrigin(req) + "/api/member-r", "json");
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

// Get member info (update)
router.get("/9cb41cdb-70fb-4957-984d-d649c39130a1/(:id)", async function (req, res, next) {
	const verify = verifyTokenFn(req);
	const user_access_id = req?.decoded?.access_id || 1;
	if (!user_access_id || user_access_id === 1) return;

	const member_id = req.params.id;

	const resp = await com.listen(res, `${getOrigin(req)}/api/member-gu/${member_id}`, "json");
	const rjson = await resp?.json();

	resp && res.json(rjson);
});

// Update member
router.post("/2a4bb58c-3fbd-429a-ad26-ced47bae82a7/(:id)", async function (req, res, next) {
	const verify = verifyTokenFn(req);
	const user_access_id = req?.decoded?.access_id || 1;
	if (!user_access_id || user_access_id === 1) return;

	let member_id = req.params.id;
	const { member_name, member_role, member_img, member_img_ext } = req.body;

	const formData = {
		access_id: 1,
		member_name: member_name,
		member_role: member_role,
		...(!utils.isNullOrEmpty(member_img) && {
			member_photo: member_img,
			member_photo_ext: member_img_ext,
		}),
	};

	const resp = await com.talk(
		res,
		`${getOrigin(req)}/api/member-u/${member_id}`,
		"json",
		formData
	);
	resp && res.json(await resp.json());
});

// Delete member
router.get("/bd7d187c-0fe5-4887-870c-81aa2b6a4152/(:id)", async function (req, res, next) {
	const verify = verifyTokenFn(req);
	const user_access_id = req?.decoded?.access_id || 1;
	if (!user_access_id || user_access_id === 1) return;

	const member_id = req.params.id;
	const resp = await com.listen(res, `http://localhost:3000/api/member-d/${member_id}`, "json");
	const rjson = await resp?.json();

	resp && res.json(rjson);
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
			const { access_id, description, learn_link } = formData;
			// insert query
			const { rows } =
				await sql`INSERT INTO product (access_id, product_name, description, learn_link) VALUES (${access_id}, ${formData.product_name}, ${description}, ${learn_link});`;

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
		const { rows } =
			await sql`SELECT product_id, access_type, product_name, description, learn_link FROM product JOIN type_access ON product.access_id = type_access.access_id ORDER BY type_access.access_id, product_id, product_name;`;

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

router.get("/product-gu/(:id)", async function (req, res, next) {
	const product_id = req.params.id;

	try {
		const { rows } = await sql`SELECT * FROM product WHERE product_id = ${product_id};`;

		res.json({
			product_id: rows[0].product_id,
			access_id: rows[0].access_id,
			product_name: rows[0].product_name,
			description: rows[0].description,
			learn_link: rows[0].learn_link,
		});
	} catch (error) {
		console.error("Error in /api/product-gu route:", error.message);
		res.status(400).json({ error: error.message });
	}
});

router.post("/product-u/(:id)", async function (req, res, next) {
	let product_id = req.params.id;
	let { access_id, product_name, description, learn_link } = req.body;
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
			const { access_id, description, learn_link } = formData;
			// insert query
			await sql`UPDATE product SET access_id = ${access_id}, product_name = ${formData.product_name}, description = ${description}, learn_link = ${learn_link} WHERE product_id = ${product_id};`;

			req.flash("success", "Data updated successfully");
			res.json({ message: `Product with name ${product_name} updated successfully` });
		}
	} catch (error) {
		console.error("Error in /api/product-u route:", error.message);
		res.status(400).json({ error: error.message });
	}
});

router.get("/product-d/(:id)", async function (req, res, next) {
	try {
		let id = req.params.id;
		await sql`DELETE FROM product WHERE product_id = ${id};`;

		req.flash("success", "Data deleted successfully");
		res.json({ message: `Product with id ${id} deleted successfully` });
	} catch (error) {
		console.error("Error in /api/product-d route:", error.message);
		res.status(400).json({ error: error.message });
	}
});

router.post("/member-c", async function (req, res, next) {
	let { access_id, member_name, member_role, member_photo, member_photo_ext } = req.body;
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
			throw new Error("Missing required fields: access_id");
		}

		const isNullEntries = utils.isNullEntries({ member_name, member_role, member_photo });
		if (isNullEntries) {
			errors = true;

			// set flash message
			req.flash("error", `Please enter the ${isNullEntries.readableEntry}`);
			throw new Error(`Missing required fields: ${isNullEntries.entry}`);
		}

		const base64Data = member_photo.replace(/^data:image\/\w+;base64,/, "");
		const buffer = Buffer.from(base64Data, "base64");

		const filename = randomUUID().replace(/-/g, "") + "." + member_photo_ext;
		const fullPath = `images/uploads/${filename}`;

		// upload buffer to blob
		const blob = await put(fullPath, buffer, {
			access: "public",
		});

		formData.member_photo = blob.url;

		// if no error
		if (!errors) {
			const { access_id, member_role, member_photo } = formData;
			// insert query
			await sql`INSERT INTO member (access_id, member_name, member_role, member_photo) VALUES (${access_id}, ${formData.member_name}, ${member_role}, ${member_photo});`;

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
		const { rows } =
			await sql`SELECT member_id, access_type, member_name, member_role, member_photo FROM member JOIN type_access ON member.access_id = type_access.access_id ORDER BY type_access.access_id, member_id, member_role, member_name;`;

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

router.post("/member-u/(:id)", async function (req, res, next) {
	let member_id = req.params.id;
	let { access_id, member_name, member_role, member_photo, member_photo_ext } = req.body;

	let formData = {
		access_id: access_id,
		member_name: member_name,
		member_role: member_role,
	};

	try {
		if (access_id < 1 || access_id > 3) {
			errors = true;

			// set flash message
			req.flash("error", "Invalid access id");
			throw new Error("Missing required fields: access_id");
		}

		const photoUpdated = !utils.isNullOrEmpty(member_photo_ext);
		const isNullEntries = utils.isNullEntries({
			member_name,
			member_role,
			...(photoUpdated && { member_photo }),
		});
		if (isNullEntries) {
			errors = true;

			// set flash message
			req.flash("error", `Please enter the ${isNullEntries.readableEntry}`);
			throw new Error(`Missing required fields: ${isNullEntries.entry}`);
		}

		if (photoUpdated) {
			const base64Data = member_photo.replace(/^data:image\/\w+;base64,/, "");
			const buffer = Buffer.from(base64Data, "base64");

			const filename = randomUUID().replace(/-/g, "") + "." + member_photo_ext;
			const fullPath = `images/uploads/${filename}`;

			let member_photo_old = (
				await sql`SELECT member_photo FROM member WHERE member_id = ${member_id};`
			)?.rows[0]?.member_photo;

			// upload buffer to blob
			const blob = await put(fullPath, buffer, {
				access: "public",
			});

			formData.member_photo = blob.url;

			// delete the blob
			member_photo_old && (await del(member_photo_old));
		}

		await sql`UPDATE member SET access_id = ${formData.access_id}, member_name = ${formData.member_name}, member_role = ${formData.member_role}, member_photo = ${formData.member_photo} WHERE member_id = ${member_id};`;

		req.flash("success", "Data updated successfully");
		res.json({ message: `Member with name ${member_name} updated successfully` });
	} catch (error) {
		console.error("Error in /api/member-u route:", error.message);
		res.status(400).json({ error: error.message });
	}
});

router.get("/member-gu/(:id)", async function (req, res, next) {
	const member_id = req.params.id;

	try {
		const { rows } = await sql`SELECT * FROM member WHERE member_id = ${member_id};`;

		res.json({
			member_id: rows[0].member_id,
			access_id: rows[0].access_id,
			member_name: rows[0].member_name,
			member_role: rows[0].member_role,
			member_photo: rows[0].member_photo,
		});
	} catch (error) {
		console.error("Error in /api/member-gu route:", error.message);
		res.status(400).json({ error: error.message });
	}
});

router.get("/member-d/(:id)", async function (req, res, next) {
	try {
		const member_id = req.params.id;

		let member_photo_old = (
			await sql`SELECT member_photo FROM member WHERE member_id = ${member_id};`
		)?.rows[0]?.member_photo;

		const { rows } = await sql`DELETE FROM member WHERE member_id = ${member_id};`;

		// delete the blob
		member_photo_old && (await del(member_photo_old));

		req.flash("success", "Data deleted successfully");
		res.json({ message: `Member with id ${member_id} deleted successfully` });
	} catch (error) {
		console.error("Error in /api/member-d route:", error.message);
		res.status(400).json({ error: error.message });
	}
});

module.exports = router;
