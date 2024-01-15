const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const decodeJwt = require("../DecodeJwt");

const allBooks = (req, res) => {
	const { category_id, news, limit, currentPage } = req.query;
	// limit : page 당 도서 수 ex. 3
	// currentPage : 현재 몇 페이지 ex. 1, 2, 3 ...
	// offset : 0, 3, 6, 9, 12... ( limit * (currentPage-1) )
	let offset = limit * (currentPage - 1);
	const values = [];
	let sql = "SELECT *, (SELECT count(*) FROM likes WHERE books.id=liked_book_id) AS likes FROM books";
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

	conn.query(sql, values, (err, results, fields) => {
		if (err) {
			console.log(err);
			return res.status(StatusCodes.BAD_REQUEST).end();
		}
		if (results) return res.status(StatusCodes.OK).json(results);
		else return res.status(StatusCodes.NOT_FOUND).end();
	});
};

const bookDetail = (req, res) => {
	const noToken = true;
	const decodedJwt = decodeJwt(req, res, noToken);
	let book_id = req.params.id;
	let values = [];
	let sql;
	if (decodedJwt == undefined) {
		sql = `SELECT *,
            (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes
             FROM books LEFT OUTER JOIN category ON books.category_id=category.category_id 
             WHERE books.id=?`;
		values.push(book_id);
	} else if (decodedJwt.id) {
		sql = `SELECT *,
            (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes, 
            (SELECT EXISTS (SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked
             FROM books LEFT OUTER JOIN category ON books.category_id=category.category_id 
             WHERE books.id=?`;
		values.push(decodedJwt.id, book_id, book_id);
	}

	conn.query(sql, values, (err, results, fields) => {
		if (err) {
			console.log(err);
			return res.status(StatusCodes.BAD_REQUEST).end();
		}
		if (results[0]) return res.status(StatusCodes.OK).json(results[0]);
		else return res.status(StatusCodes.NOT_FOUND).end();
	});
};

module.exports = {
	allBooks,
	bookDetail,
};
