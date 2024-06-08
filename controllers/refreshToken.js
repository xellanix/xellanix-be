var Users = require("../models/userModel");
var jwt = require("jsonwebtoken");
var com = require("../library/com");
var jwt_decode = require("jwt-decode");

const refreshToken = async (req, res) => {
	try {
		const refreshToken = com.getToken(req);
		if (!refreshToken) return res.sendStatus(401);
		const user = await Users.findAll({
			where: {
				refresh_token: refreshToken,
			},
		});
		if (!user[0]) return res.sendStatus(403);
		jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
			if (err) return res.sendStatus(403);
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
			const jwt_decoded = jwt_decode.jwtDecode(accessToken);
			res.json({ accessToken, jwt_decoded });
		});
	} catch (error) {
		console.log(error);
	}
};

module.exports = refreshToken;
