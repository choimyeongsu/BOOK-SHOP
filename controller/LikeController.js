const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const addLike = (req, res) => {
	const bookId = req.params.id;

	const decodedJwt = decodeJwt(req);
	if (decodedJwt instanceof jwt.TokenExpiredError) {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			message: "로그인 세션이 만료되었습니다. 다시 로그인 해주세요",
		});
	} else if (decodedJwt instanceof jwt.JsonWebTokenError) {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			message: "토큰 값을 확인해주세요",
		});
	} else {
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
	const bookId = req.params.id;

	const decodedJwt = decodeJwt(req);
	if (decodedJwt instanceof jwt.TokenExpiredError) {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			message: "로그인 세션이 만료되었습니다. 다시 로그인 해주세요",
		});
	} else if (decodedJwt instanceof jwt.JsonWebTokenError) {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			message: "토큰 값을 확인해주세요",
		});
	} else {
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

function decodeJwt(req, res) {
	try {
		const receivedJwt = req.headers["authorization"];
		return jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
	} catch (err) {
		console.log(err);
		return err;
	}
}
module.exports = {
	addLike,
	removeLike,
};
