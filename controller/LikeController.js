const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const decodeJwt = require("../DecodeJwt");

const addLike = (req, res) => {
	const decodedJwt = decodeJwt(req, res);
	if (decodedJwt.id) {
		const bookId = req.params.id;
		const sql = `INSERT INTO likes VALUES(?,?)`;
		let values = [decodedJwt.id, Number(bookId)];
		conn.query(sql, values, (err, results, fileds) => {
			if (err) {
				console.log(err);
				return res.status(StatusCodes.BAD_REQUEST).end();
			}
			return res.status(StatusCodes.CREATED).json(results);
		});
	}
};

const removeLike = (req, res) => {
	const decodedJwt = decodeJwt(req, res);
	if (decodedJwt.id) {
		const bookId = req.params.id;
		const sql = `DELETE FROM likes WHERE user_id= ? AND liked_book_id=?`;
		let values = [decodedJwt.id, Number(bookId)];
		conn.query(sql, values, (err, results, fields) => {
			if (err) {
				console.log(err);
				return res.status(StatusCodes.BAD_REQUEST).end();
			}
			return res.status(StatusCodes.OK).json(results);
		});
	}
};

module.exports = {
	addLike,
	removeLike,
};
