const mysql = require("mysql2/promise");

const createConnection = async () => {
	return await mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "root",
		database: "Bookshop",
		dateStrings: true,
	});
};

module.exports = createConnection;
