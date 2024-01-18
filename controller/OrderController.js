const mysql = require("mysql2/promise");
//const conn = require('../mariadb');
const { StatusCodes } = require("http-status-codes");
const decodeJwt = require("../DecodeJwt");

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
		let [results] = await conn.execute(sql, values);
		let delivery_id = results.insertId;

		//주문
		sql = `INSERT INTO orders(book_title, total_quantity, total_price, user_id, delivery_id)
         VALUE(?,?,?,?,?)`;
		values = [firstBookTitle, totalQuantity, totalPrice, decodedJwt.id, delivery_id];
		[results] = await conn.execute(sql, values);
		let order_id = results.insertId;
		console.log("주문번호");
		console.log(order_id);

		//장바구니에서 선택한 상품 목록 조회
		sql = `SELECT book_id,quantity FROM cartItems WHERE id IN(?)`;
		let [orderItems, fields] = await conn.query(sql, [items]);
		console.log(orderItems);

		//주문된 책 목록 조회
		sql = `INSERT INTO orderedBook(order_id,book_id,quantity) VALUES ?`;
		values = [];
		orderItems.forEach((item) => {
			values.push([order_id, item.book_id, item.quantity]);
		});
		console.log(values);
		[results] = await conn.query(sql, [values]);
		console.log(results);

		//장바구니에서 선택한 상품 삭제
		let result = await deleteCartItems(conn, items);
		console.log(result);

		return res.status(StatusCodes.OK).json(results[0]);
	}
};

const deleteCartItems = async (conn, items) => {
	let sql = `DELETE FROM cartItems WHERE id IN(?)`;
	let values = items;
	let result = await conn.query(sql, [values]);
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
		let sql = `SELECT orders.id,book_title,total_quantity,total_price,created_at,address,receiver,contact
        FROM orders LEFT OUTER JOIN delivery ON orders.delivery_id=delivery.id 
		WHERE user_id=?`;
		let [rows, fields] = await conn.execute(sql, [decodedJwt.id]);
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
		let orderId = req.params.id;
		let sql = `SELECT books.id,books.title,books.author,books.price,orderedBook.quantity
         FROM orderedBook LEFT OUTER JOIN books
         ON orderedBook.book_id=books.id
          WHERE orderedBook.order_id=?`;
		let values = [orderId];
		let [rows, fields] = await conn.execute(sql, values);
		console.log(rows);
		return res.status(StatusCodes.OK).json(rows);
	}
};

module.exports = {
	order,
	getOrders,
	getOrderDetail,
};
