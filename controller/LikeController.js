const decodeJwt = require("../middlewares/DecodeJwt");
const { StatusCodes } = require("http-status-codes");
const likeService = require("../services/LikeService");

// bookId가 없는 경우 예외처리 필요
const addLike = async (req, res) => {
	const decodedJwt = decodeJwt(req, res);
	const bookId = req.params.id;
	try {
		const data = await likeService.addLike(decodedJwt, bookId);
		return res.status(StatusCodes.OK).end();
	} catch (err) {
		console.log(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
	}
};

const removeLike = async (req, res) => {
	const decodedJwt = decodeJwt(req, res);
	const bookId = req.params.id;
	try {
		const data = await likeService.removeLike(decodedJwt, bookId);
		return res.status(StatusCodes.OK).end();
	} catch (err) {
		console.log(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
	}
};

module.exports = {
	addLike,
	removeLike,
};
