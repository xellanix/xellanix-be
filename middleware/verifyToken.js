var jwt = require("jsonwebtoken");
var com = require("../library/com");

const verifyToken = (req, res, next) => {
	const token = com.getToken(req);
	if (token == null) return res.sendStatus(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) return res.sendStatus(403);
		req.email = decoded.email;
		next();
	});
};

const verifyTokenFn = (req) => {
	try {
		const token = com.getToken(req);
		if (token == null) throw new Error("No token provided");

		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
			if (err) throw new Error(`Invalid token: ${err.expiredAt} | ${new Date()}`);
			req.decoded = decoded;
		});

		console.log("Token Verified");

		return true;
	} catch (error) {
		console.error(error.message);
		return false;
	}
};

module.exports = { verifyToken, verifyTokenFn };
