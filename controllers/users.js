var { sql } = require("@vercel/postgres");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var dotenv = require("dotenv");
var com = require("../library/com");

const getUsers = async (req, res) => {
	try {
		/* const users = await Users.findAll({
			attributes: ["user_id", "username", "email"],
		}); */
		const users = (await sql`SELECT * FROM "user";`).rows;
		res.json(users);
	} catch (error) {
		console.log(error);
	}
};

const signup = async (req, res) => {
	const { name, email, password, confPassword } = req.body;
	if (password !== confPassword)
		return res.status(400).json({ message: "Password and Confirm Password doesn't match" });
	const salt = await bcrypt.genSalt();
	console.log({ salt, password });
	const hashPassword = await bcrypt.hash(password, salt);
	try {
		/* await Users.create({
			username: name,
			email: email,
			password: hashPassword,
			user_photo: "",
			access_id: 1,
		}); */
		await sql`INSERT INTO "user" (username, email, password, user_photo, access_id, createdAt, updatedAt) VALUES (${name}, ${email}, ${hashPassword}, ${""}, ${1}, ${new Date()}, ${new Date()});`;
		res.json({ message: "Sign up successfully" });
	} catch (error) {
		console.log(error);
	}
};

const signin = async (req, res) => {
	try {
		const user = (await sql`SELECT * FROM "user" WHERE email = ${req.body.email};`).rows;
		const match = await bcrypt.compare(req.body.password, user[0].password);
		if (!match) {
			console.log("Wrong password");
			return res.status(400).json({ message: "Wrong password" });
		}
		const userId = user[0].user_id;
		const name = user[0].username;
		const email = user[0].email;
		const access_id = user[0].access_id;
		const accessToken = jwt.sign(
			{ userId, name, email, access_id },
			process.env.ACCESS_TOKEN_SECRET,
			{
				expiresIn: "20s",
			}
		);
		const refreshToken = jwt.sign(
			{ userId, name, email, access_id },
			process.env.REFRESH_TOKEN_SECRET,
			{
				expiresIn: "1d",
			}
		);
		await sql`UPDATE "user" SET refresh_token = ${refreshToken} WHERE user_id = ${userId};`;
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: false,
			sameSite: "Lax",
			path: "/", // Ensure the cookie is sent with every request to the server
			maxAge: 24 * 60 * 60 * 1000,
		});
		res.json({ accessToken, refreshToken, message: `Welcome back ${name}` });
	} catch (error) {
		res.status(404).json({ message: "Email not found" });
	}
};

const signout = async (req, res) => {
	console.log("checkpoint 1");
	const refreshToken = com.getToken(req);
	if (!refreshToken) return res.sendStatus(204);
	const user = (await sql`SELECT * FROM "user" WHERE refresh_token = ${refreshToken};`).rows;
	if (!user[0]) return res.sendStatus(204);
	const userId = user[0].user_id;
	await sql`UPDATE "user" SET refresh_token = ${null} WHERE user_id = ${userId};`;
	res.clearCookie("refreshToken");
	return res.sendStatus(200);
};

module.exports = { getUsers, signup, signin, signout };
