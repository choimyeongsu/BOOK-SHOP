const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

function decodeJwt(req, res) {
	try {
		const receivedJwt = req.headers["authorization"];
		return jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
	} catch (err) {
		console.log(err);
		return err;
	}
}

const addToCart = (req, res) => {
	const { book_id, quantity } = req.body;

	const decodedJwt = decodeJwt(req, res);
	if (decodedJwt instanceof jwt.TokenExpiredError) {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			message: "로그인 세션이 만료되었습니다. 다시 로그인 해주세요",
		});
	} else if (decodedJwt instanceof jwt.JsonWebTokenError) {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			message: "토큰 값을 확인해주세요",
		});
	} else {
		const sql = `INSERT INTO cartItems(book_id,quantity,user_id) VALUE(?,?,?)`;
		let values = [book_id, quantity, decodedJwt.id];
		conn.query(sql, values, (err, results, fields) => {
			if (err) {
				console.log(err);
				return res.status(StatusCodes.BAD_REQUEST).end();
			}
			return res.status(StatusCodes.CREATED).json(results);
		});
	}
};
const getCartItems = (req, res) => {
	const { selected } = req.body;

	const decodedJwt = decodeJwt(req, res);
	if (decodedJwt instanceof jwt.TokenExpiredError) {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			message: "로그인 세션이 만료되었습니다. 다시 로그인 해주세요",
		});
	} else if (decodedJwt instanceof jwt.JsonWebTokenError) {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			message: "토큰 값을 확인해주세요",
		});
	} else {
		const sql = `SELECT cartItems.id, cartItems.book_id,  books.title, books.summary, cartItems.quantity, books.price
        FROM cartItems LEFT OUTER JOIN books 
        ON cartItems.book_id=books.id 
        WHERE user_id=? AND cartItems.id IN(?)`;
		let values = [decodedJwt.id, selected];
		console.log(values);
		conn.query(sql, values, (err, results, fields) => {
			if (err) {
				console.log(err);
				return res.status(StatusCodes.BAD_REQUEST).end();
			}
			console.log(results);
			return res.status(StatusCodes.OK).json(results);
		});
	}
};
const removeCartItem = (req, res) => {
	const cartItemId = req.params.id;

	const sql = `DELETE FROM cartItems WHERE cartItems.id=?`;
	let values = [cartItemId];
	conn.query(sql, values, (err, results, fields) => {
		if (err) {
			console.log(err);
			return res.status(StatusCodes.BAD_REQUEST).end();
		}
		return res.status(StatusCodes.OK).json(results);
	});
};

module.exports = {
	addToCart,
	getCartItems,
	removeCartItem,
};
