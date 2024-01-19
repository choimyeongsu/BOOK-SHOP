const decodeJwt = require("../middlewares/DecodeJwt");
const query = require("../utils/Query");

const addLike = (req, res) => {
	const decodedJwt = decodeJwt(req, res);
	if (decodedJwt.id) {
		const bookId = req.params.id;
		const sql = `INSERT INTO likes VALUES(?,?)`;
		const values = [decodedJwt.id, Number(bookId)];
		query(sql, values, req, res);
	}
};

const removeLike = (req, res) => {
	const decodedJwt = decodeJwt(req, res);
	if (decodedJwt.id) {
		const bookId = req.params.id;
		const sql = `DELETE FROM likes WHERE user_id= ? AND liked_book_id=?`;
		const values = [decodedJwt.id, Number(bookId)];
		query(sql, values, req, res);
	}
};

module.exports = {
	addLike,
	removeLike,
};
