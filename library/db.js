let mysql = require("mysql");

let connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "xellanix_development",
});

connection.connect(function (error) {
	if (error) {
		console.error("Error connecting to MySQL:", error.stack);
		return;
	}
	console.log("Connected to MySQL as id " + connection.threadId);
});

module.exports = connection;
