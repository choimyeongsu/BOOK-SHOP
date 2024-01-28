const { StatusCodes } = require("http-status-codes");
const decodeJwt = require("../middlewares/DecodeJwt");
const cartService = require("../services/CartService");

const addToCart = async (req, res) => {
	const decodedJwt = decodeJwt(req, res);
	const { bookId, quantity } = req.body;
	try {
		const data = await cartService.addToCart(bookId, quantity, decodedJwt);
		return res.status(StatusCodes.OK).json(data);
	} catch (err) {
		console.log(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
	}
};
const getCartItems = async (req, res) => {
	const decodedJwt = decodeJwt(req, res);
	const { selected } = req.body;
	try {
		const data = await cartService.getCartItems(selected, decodedJwt);
		return res.status(StatusCodes.OK).json(data);
	} catch (err) {
		console.log(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
	}
};
const removeCartItem = async (req, res) => {
	const decodedJwt = decodeJwt(req, res);
	const cartItemId = req.params.id;
	try {
		const data = await cartService.removeCartItem(cartItemId, decodedJwt);
		return res.status(StatusCodes.OK).json(data);
	} catch (err) {
		console.log(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
	}
};

module.exports = {
	addToCart,
	getCartItems,
	removeCartItem,
};
