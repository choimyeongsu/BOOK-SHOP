const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const addLike = (req, res) => {
	const bookId = req.params.id;

	const decodedJwt = decodeJwt(req);

	const sql = `INSERT INTO likes VALUES(?,?)`;
	let values = [decodedJwt.id, Number(bookId)];
	conn.query(sql, values, (err, results, fileds) => {
		if (err) {
			console.log(err);
			return res.status(StatusCodes.BAD_REQUEST).end();
		}
		return res.status(StatusCodes.CREATED).json(results);
	});
};

const removeLike = (req, res) => {
	const bookId = req.params.id;

	const decodedJwt = decodeJwt(req);

	const sql = `DELETE FROM likes WHERE user_id= ? AND liked_book_id=?`;
	let values = [decodedJwt.id, Number(bookId)];
	conn.query(sql, values, (err, results, fields) => {
		if (err) {
			console.log(err);
			return res.status(StatusCodes.BAD_REQUEST).end();
		}
		return res.status(StatusCodes.OK).json(results);
	});
};

function decodeJwt(req) {
	const receivedJwt = req.headers["authorization"];
	return jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
}

module.exports = {
	addLike,
	removeLike,
};
