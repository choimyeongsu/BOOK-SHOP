const createConnection = require("../mariadb");

const order = async (items, delivery, totalQuantity, totalPrice, firstBookTitle, decodedJwt) => {
	const conn = await createConnection();
	try {
		if (decodedJwt.id) {
			//배송지
			let sql = "INSERT INTO delivery(address,receiver,contact) VALUE(?,?,?)";
			let values = [delivery.address, delivery.receiver, delivery.contact];
			let [result, fields] = await conn.execute(sql, values);
			const deliveryId = result.insertId;

			//주문
			sql = `INSERT INTO orders(book_title, total_quantity, total_price, user_id, delivery_id)
         VALUE(?,?,?,?,?)`;
			values = [firstBookTitle, totalQuantity, totalPrice, decodedJwt.id, deliveryId];
			[result, fields] = await conn.execute(sql, values);
			const orderId = result.insertId;

			values = [items];
			//장바구니에서 선택한 상품 목록 조회
			sql = `SELECT book_id,quantity FROM cartItems WHERE cartItems.id IN(?)`;
			[result] = await conn.query(sql, values);

			//주문된 책
			sql = `INSERT INTO orderedBook(order_id,book_id,quantity) VALUES ?`;
			values = [];
			result.forEach((item) => {
				values.push([orderId, item.book_id, item.quantity]);
			});

			[result, fields] = await conn.query(sql, [values]);

			//장바구니 선택 상품 삭제
			const deleteResult = await deleteCartItems(conn, items);
			return result;
		}
	} catch (err) {
		console.log(err);
		return err;
	}
};

const deleteCartItems = async (conn, items) => {
	try {
		const sql = `DELETE FROM cartItems WHERE id IN(?)`;
		const values = items;
		const result = await conn.query(sql, [values]);
		return result;
	} catch (err) {
		console.log(err);
		return err;
	}
};

const getOrders = async (decodedJwt) => {
	const conn = await createConnection();
	try {
		if (decodedJwt.id) {
			let sql = `SELECT orders.id,(book_title) AS bookTitle, (total_quantity) AS totalQuantity, (total_price) AS totalPrice , (created_at) AS createdAt,address,receiver,contact
            FROM orders LEFT OUTER JOIN delivery ON orders.delivery_id=delivery.id 
            WHERE user_id=?`;
			const values = [decodedJwt.id];
			const [rows, fields] = await conn.execute(sql, values);
			return rows;
		}
	} catch (err) {
		console.log(err);
		return err;
	}
};

const getOrderDetail = async (decodedJwt, orderId) => {
	const conn = await createConnection();
	try {
		if (decodedJwt.id) {
			const sql = `SELECT (books.id) AS bookId,books.title,books.author,books.price,orderedBook.quantity
             FROM orderedBook LEFT OUTER JOIN books
             ON orderedBook.book_id=books.id
              WHERE orderedBook.order_id=?`;
			const values = [orderId];
			const [rows, fields] = await conn.execute(sql, values);
			return rows;
		}
	} catch (err) {
		console.log(err);
		return err;
	}
};

module.exports = {
	order,
	getOrders,
	getOrderDetail,
};
