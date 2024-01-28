const createConnection = require("../mariadb");

//bookId, quantity 예외처리
const addToCart = async (bookId, quantity, decodedJwt) => {
	const conn = await createConnection();
	try {
		if (decodedJwt.id) {
			const sql = `INSERT INTO cartItems(book_id,quantity,user_id) VALUE(?,?,?)`;
			const values = [bookId, quantity, decodedJwt.id];
			const [result, fields] = await conn.execute(sql, values);
			return result;
		}
	} catch (err) {
		console.log(err);
		return err;
	}
};

const getCartItems = async (selected, decodedJwt) => {
	const conn = await createConnection();
	try {
		if (decodedJwt.id) {
			let sql = `SELECT cartItems.id, (cartItems.book_id) AS bookId, books.title, books.summary, cartItems.quantity, books.price
            FROM cartItems LEFT OUTER JOIN books 
            ON cartItems.book_id=books.id 
            WHERE cartItems.user_id=?`;
			const values = [decodedJwt.id];
			//선택한 장바구니 목록 조회
			if (selected) {
				sql = sql + ` AND cartItems.id IN(?)`;
				values.push(selected);
			}
			const [result] = await conn.query(sql, values);
			return result;
		}
	} catch (err) {
		console.log(err);
		return err;
	}
};
//cartItemId 예외처리필요
const removeCartItem = async (cartItemId, decodedJwt) => {
	const conn = await createConnection();
	try {
		if (decodedJwt.id) {
			const sql = `DELETE FROM cartItems WHERE cartItems.id=?`;
			const values = [cartItemId];
			console.log(values);
			const [result, fields] = await conn.execute(sql, values);
			console.log(result);
			return result;
		}
	} catch (err) {
		console.log(err);
		return err;
	}
};

module.exports = {
	addToCart,
	getCartItems,
	removeCartItem,
};
