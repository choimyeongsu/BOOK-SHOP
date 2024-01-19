const mysql = require("mysql2/promise");
//const conn = require('../mariadb');
const { StatusCodes } = require("http-status-codes");
const decodeJwt = require("../middlewares/DecodeJwt");

const order = async (req, res) => {
	const conn = await mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "root",
		database: "Bookshop",
		dateStrings: true,
	});

	const decodedJwt = decodeJwt(req, res);
	if (decodedJwt.id) {
		//배송지
		const { items, delivery, totalQuantity, totalPrice, firstBookTitle } = req.body;
		let sql = "INSERT INTO delivery(address,receiver,contact) VALUE(?,?,?)";
		let values = [delivery.address, delivery.receiver, delivery.contact];
		let [rows, fields] = await conn.execute(sql, values);
		const deliveryId = rows.insertId;

		//주문
		sql = `INSERT INTO orders(book_title, total_quantity, total_price, user_id, delivery_id)
         VALUE(?,?,?,?,?)`;
		values = [firstBookTitle, totalQuantity, totalPrice, decodedJwt.id, deliveryId];
		[rows, fields] = await conn.execute(sql, values);
		const orderId = rows.insertId;
		console.log("주문번호");
		console.log(orderId);

		//장바구니에서 선택한 상품 목록 조회
		sql = `SELECT book_id,quantity FROM cartItems WHERE id IN(?)`;
		const [orderItems] = await conn.query(sql, [items]);
		console.log(orderItems);

		//주문된 책 목록 조회
		sql = `INSERT INTO orderedBook(order_id,book_id,quantity) VALUES ?`;
		values = [];
		orderItems.forEach((item) => {
			values.push([orderId, item.book_id, item.quantity]);
		});
		console.log(values);
		[rows, fields] = await conn.query(sql, [values]);
		console.log(rows);
		if (rows.affectedRows >= 1) {
			//장바구니에서 선택한 상품 삭제
			const deleteResult = await deleteCartItems(conn, items);

			return res.status(StatusCodes.OK).json(rows[0]);
		} else return res.status(StatusCodes.BAD_REQUEST).end();
	}
};

const deleteCartItems = async (conn, items) => {
	const sql = `DELETE FROM cartItems WHERE id IN(?)`;
	const values = items;
	const result = await conn.query(sql, [values]);
	return result;
};

const getOrders = async (req, res) => {
	const conn = await mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "root",
		database: "Bookshop",
		dateStrings: true,
	});
	const decodedJwt = decodeJwt(req, res);
	if (decodedJwt.id) {
		let sql = `SELECT orders.id,(book_title) AS bookTitle, (total_quantity) AS totalQuantity, (total_price) AS totalPrice , (created_at) AS createdAt,address,receiver,contact
        FROM orders LEFT OUTER JOIN delivery ON orders.delivery_id=delivery.id 
		WHERE user_id=?`;
		const [rows, fields] = await conn.execute(sql, [decodedJwt.id]);
		console.log(rows);
		return res.status(StatusCodes.OK).json(rows);
	}
};

const getOrderDetail = async (req, res) => {
	const conn = await mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "root",
		database: "Bookshop",
		dateStrings: true,
	});
	const decodedJwt = decodeJwt(req, res);
	if (decodedJwt.id) {
		const orderId = req.params.id;
		const sql = `SELECT (books.id) AS bookId,books.title,books.author,books.price,orderedBook.quantity
         FROM orderedBook LEFT OUTER JOIN books
         ON orderedBook.book_id=books.id
          WHERE orderedBook.order_id=?`;
		const values = [orderId];
		const [rows, fields] = await conn.execute(sql, values);
		console.log(rows);
		return res.status(StatusCodes.OK).json(rows);
	}
};

module.exports = {
	order,
	getOrders,
	getOrderDetail,
};
