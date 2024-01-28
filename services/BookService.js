const createConnection = require("../mariadb");

const allBooks = async (category_id, news, limit, currentPage) => {
	const conn = await createConnection();
	try {
		// limit : page 당 도서 수 ex. 3
		// currentPage : 현재 몇 페이지 ex. 1, 2, 3 ...
		// offset : 0, 3, 6, 9, 12... ( limit * (currentPage-1) )
		const offset = limit * (currentPage - 1);
		const values = [];
		let sql = "SELECT *, (SELECT count(*) FROM likes WHERE books.id=liked_book_id) AS likes FROM books";

		let [result, fields] = await conn.execute(sql, values);
		const allBookCnt = result.length;

		if (category_id && news) {
			sql = sql + " WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
			values.push(category_id);
		} else if (category_id) {
			sql = sql + ` WHERE category_id=?`;
			values.push(category_id);
		} else if (news) {
			sql = sql + " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
		}

		values.push(Number(limit));
		values.push(offset);
		sql = sql + " LIMIT ? OFFSET ?";

		const intCurrentPage = Number(currentPage);
		[result, fields] = await conn.execute(sql, values);
		return {
			paginaton: {
				intCurrentPage,
				allBookCnt,
			},
			result,
		};
	} catch (err) {
		console.log(err);
		return err;
	}
};

const bookDetail = async (decodedJwt, bookId) => {
	const conn = await createConnection();
	try {
		const values = [];
		let sql;
		if (decodedJwt == undefined) {
			sql = `SELECT *,
            (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes
             FROM books LEFT OUTER JOIN category ON books.category_id=category.id
             WHERE books.id=?`;
			values.push(bookId);
		} else if (decodedJwt.id) {
			sql = `SELECT *,
            (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes, 
            (SELECT EXISTS (SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked
             FROM books LEFT OUTER JOIN category ON books.category_id=category.id
             WHERE books.id=?`;
			values.push(decodedJwt.id, bookId, bookId);
		}

		const [result, fields] = await conn.execute(sql, values);
		return result;
	} catch (err) {
		console.log(err);
		return err;
	}
};

module.exports = {
	allBooks,
	bookDetail,
};
