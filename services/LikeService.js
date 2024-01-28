const createConnection = require("../mariadb");

const addLike = async (decodedJwt, bookId) => {
	const conn = await createConnection();
	try {
		if (decodedJwt.id) {
			const sql = `INSERT INTO likes VALUES(?,?)`;
			const values = [decodedJwt.id, Number(bookId)];
			const [result, fields] = await conn.execute(sql, values);
			return result;
		}
	} catch (err) {
		console.log(err);
		return err;
	}
};

const removeLike = async (decodedJwt, bookId) => {
	const conn = await createConnection();
	try {
		if (decodedJwt.id) {
			const sql = `DELETE FROM likes WHERE user_id= ? AND liked_book_id=?`;
			const values = [decodedJwt.id, Number(bookId)];
			const [result, fields] = await conn.execute(sql, values);
			return result;
		}
	} catch (err) {
		console.log(err);
		return err;
	}
};

module.exports = {
	addLike,
	removeLike,
};
