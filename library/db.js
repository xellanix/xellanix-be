let mysql = require("mysql2/promise");

let connection = null;

const connect = async () => {
	if (connection) return connection;

	try {
		connection = await mysql.createConnection({
			host: "localhost",
			user: "root",
			password: "",
			database: "xellanix_development",
		});
		console.log("Connected to MySQL as id " + connection.threadId);

		return connection;
	} catch (error) {
		console.error("Error connecting to MySQL:", error.stack);
	}
};

const executeQueryWithParams = async (query, params) => {
	const connection = await connect();
	const [rows, fields] = await connection.execute(query, params);
	return [rows, fields];
};

const executeQuery = async (query) => {
	const connection = await connect();
	const [rows, fields] = await connection.execute(query);
	return [rows, fields];
};

module.exports = { connect, executeQuery, executeQueryWithParams };
