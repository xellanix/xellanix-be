var express = require("express");
var router = express.Router();

const multer = require("multer");
// limit filesize to 5 MB
const upload = multer({
	dest: "./public/images/uploads/",
	storage: multer.memoryStorage(),
});

//import database
let { sql } = require("@vercel/postgres");
var com = require("../library/com");

/**
 * INDEX MEMBER
 */
router.get("/", async function (req, res, next) {
	//query
	const resp = await com.listen(res, "http://localhost:3000/api/member-r", "json");
	const rjson = await resp?.json();
	let filteredResp = rjson?.filter((item) => {
		return item?.access_type === "user";
	});
	res.render("member/index", { members: filteredResp || "" });
});

router.get("/create", function (req, res, next) {
	res.render("member/create", {
		access_id: 1,
		member_name: "",
		member_role: "",
		member_photo: "",
	});
});

router.post("/store", upload.single("member_photo"), async function (req, res, next) {
	let access_id = 1;
	let { member_name, member_role } = req.body;
	console.log(req.body);
	let file = req.file;
	/* let member_photo = req.file; */
	let member_photo = "";

	try {
		const { rows } =
			await sql`SELECT access_id FROM type_access WHERE access_type = ${req.body.access_type};`;

		access_id = rows[0].access_id;

		const formData = {
			access_id: access_id,
			member_name: member_name,
			member_role: member_role,
			member_photo: member_photo,
		};

		console.log(formData);

		/* const resp = await com.talk(res, "http://localhost:3000/api/member-c", "json", formData);
		resp ? res.redirect(302, "/member") : res.render("member/create", formData); */
	} catch (error) {
		req.flash("error", error);
		res.render("member/create", {
			access_id: access_id,
			member_name: member_name,
			member_role: member_role,
			member_photo: member_photo,
		});
		console.log(error);
	}
});

router.get("/edit/(:id)", async function (req, res, next) {
	let member_id = req.params.id;

	const resp = await com.listen(res, `http://localhost:3000/api/member-gu/${member_id}`, "json");

	if (resp) {
		const rjson = await resp.json();
		res.render("member/edit", {
			member_id: rjson.member_id,
			access_id: rjson.access_id,
			member_name: rjson.member_name,
			member_role: rjson.member_role,
			member_photo: rjson.member_photo,
		});
	} else {
		req.flash("error", "There's a failure when fetching member data");
		res.redirect("/member");
	}
});

/**
 * UPDATE POST
 */
router.post("/update/(:id)", upload.single("member_photo"), async function (req, res, next) {
	let access_id = 1;
	let member_id = req.params.id;
	let { access_type, member_name, member_role } = req.body;
	let member_photo = req.file;

	try {
		const { rows } =
			await sql`SELECT access_id FROM type_access WHERE access_type = ${access_type};`;
		access_id = rows[0].access_id;

		const formData = {
			access_id: access_id,
			member_name: member_name,
			member_role: member_role,
			member_photo: member_photo,
		};

		const resp = await com.talk(
			res,
			`http://localhost:3000/api/member-u/${member_id}`,
			"json",
			formData
		);
		resp ? res.redirect(302, "/member") : res.render("member/update/(:id)", formData);
	} catch (err) {
		console.error(err);
		req.flash("error", err.message);
		res.render("member/edit", {
			member_id: member_id,
			access_id: access_id,
			member_name: member_name,
			member_role: member_role,
			member_photo: member_photo,
		});
	}
});

router.get("/delete/(:id)", async function (req, res, next) {
	let id = req.params.id;

	const resp = await com.listen(res, `http://localhost:3000/api/member-d/${id}`, "json");
	const rjson = await resp?.json();
	console.log(rjson);
	res.redirect("/member");
});

module.exports = router;
