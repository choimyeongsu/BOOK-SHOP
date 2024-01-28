const { StatusCodes } = require("http-status-codes");
const decodeJwt = require("../middlewares/DecodeJwt");
const bookService = require("../services/BookService");

const allBooks = async (req, res) => {
	const { category_id, news, limit, currentPage } = req.query;
	try {
		const data = await bookService.allBooks(category_id, news, limit, currentPage);
		return res.status(StatusCodes.OK).json(data);
	} catch (err) {
		console.log(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
	}
};

//bookId가 없는경우 예외처리 필요
const bookDetail = async (req, res) => {
	const decodedJwt = decodeJwt(req, res);
	const bookId = req.params.id;
	try {
		const data = await bookService.bookDetail(decodedJwt, bookId);
		return res.status(StatusCodes.OK).json(data);
	} catch (err) {
		console.log(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
	}
};

module.exports = {
	allBooks,
	bookDetail,
};
