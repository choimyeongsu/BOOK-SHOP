const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const decodeJwt = require("../DecodeJwt");

const addToCart = (req, res) => {
	const { book_id, quantity } = req.body;

	const decodedJwt = decodeJwt(req, res);
	if (decodedJwt.id) {
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
	if (decodedJwt.id) {
		let sql = `SELECT cartItems.id, cartItems.book_id, books.title, books.summary, cartItems.quantity, books.price
		FROM cartItems LEFT OUTER JOIN books 
		ON cartItems.book_id=books.id `;
		let values = [decodedJwt.id];
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
