const createConnection = require("../mariadb");

const allCategorys = async () => {
	const conn = await createConnection();
	try {
		const sql = "SELECT * FROM category";
		const [result, fields] = await conn.execute(sql, []);
		console.log(result);
		return result;
	} catch (err) {
		console.log(err);
		return err;
	}
};

module.exports = {
	allCategorys,
};
