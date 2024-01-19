const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const decodeJwt = require("../DecodeJwt");

const addToCart = (req, res) => {
	const decodedJwt = decodeJwt(req, res);
	if (decodedJwt.id) {
		const { bookId, quantity } = req.body;
		const sql = `INSERT INTO cartItems(book_id,quantity,user_id) VALUE(?,?,?)`;
		const values = [bookId, quantity, decodedJwt.id];
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
	const decodedJwt = decodeJwt(req, res);
	if (decodedJwt.id) {
		const { selected } = req.body;
		let sql = `SELECT cartItems.id, (cartItems.book_id) AS bookId, books.title, books.summary, cartItems.quantity, books.price
		FROM cartItems LEFT OUTER JOIN books 
		ON cartItems.book_id=books.id `;
		const values = [decodedJwt.id];
		//선택한 장바구니 목록 조회
		if (selected) {
			sql = sql + `WHERE cartItems.user_id=? AND cartItems.id IN(?)`;
			values.push(selected);
			conn.query(sql, values, (err, results, fields) => {
				if (err) {
					console.log(err);
					return res.status(StatusCodes.BAD_REQUEST).end();
				}
				console.log(results);
				return res.status(StatusCodes.OK).json(results);
			});
			//장바구니 목록 조회
		} else {
			sql = sql + `WHERE cartItems.user_id=?`;
			conn.query(sql, values, (err, results, fields) => {
				if (err) {
					console.log(err);
					return res.status(StatusCodes.BAD_REQUEST).end();
				}
				console.log(results);
				return res.status(StatusCodes.OK).json(results);
			});
		}
	}
};
const removeCartItem = (req, res) => {
	const decodedJwt = (req, res);
	if (decodedJwt.id) {
		const cartItemId = req.params.id;

		const sql = `DELETE FROM cartItems WHERE cartItems.id=?`;
		const values = [cartItemId];
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
	addToCart,
	getCartItems,
	removeCartItem,
};
