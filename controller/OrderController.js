const { StatusCodes } = require("http-status-codes");
const decodeJwt = require("../middlewares/DecodeJwt");
const orderService = require("../services/OrderService");

const order = async (req, res) => {
	const { items, delivery, totalQuantity, totalPrice, firstBookTitle } = req.body;
	const decodedJwt = decodeJwt(req, res);
	try {
		const data = orderService.order(items, delivery, totalQuantity, totalPrice, firstBookTitle, decodedJwt);
		return res.status(StatusCodes.OK).json(data);
	} catch (err) {
		console.log(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
	}
};

const getOrders = async (req, res) => {
	const decodedJwt = decodeJwt(req, res);
	try {
		const data = await orderService.getOrders(decodedJwt);
		return res.status(StatusCodes.OK).json(data);
	} catch (err) {
		console.log(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
	}
};

const getOrderDetail = async (req, res) => {
	const decodedJwt = decodeJwt(req, res);
	const orderId = req.params.id;
	try {
		const data = await orderService.getOrderDetail(decodedJwt, orderId);
		return res.status(StatusCodes.OK).json(data);
	} catch (err) {
		console.log(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
	}
};

module.exports = {
	order,
	getOrders,
	getOrderDetail,
};
