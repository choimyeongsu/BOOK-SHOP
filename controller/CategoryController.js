const { StatusCodes } = require("http-status-codes");
const categoryService = require("../services/CategoryService");

const allCategorys = async (req, res) => {
	try {
		const data = await categoryService.allCategorys();
		return res.status(StatusCodes.OK).json(data);
	} catch (err) {
		console.log(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
	}
};

module.exports = {
	allCategorys,
};
