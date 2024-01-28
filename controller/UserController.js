const { StatusCodes } = require("http-status-codes"); //status code 모듈
const userService = require("../services/UserService");

// 컨트롤러 = req수신, req 데이터 검증, 결과 반환

const join = async (req, res) => {
	const { email, password } = req.body;
	try {
		const data = await userService.join(email, password);
		return res.status(StatusCodes.CREATED).json(data);
	} catch (err) {
		console.log(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const data = await userService.login(email, password);
		res.cookie("token", data.token, {
			httpOnly: true,
		});
		return res.status(StatusCodes.CREATED).json({
			message: `${data.user.email}님 로그인 되었습니다.`,
		});
	} catch (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
	}
};
const passwordResetRequest = async (req, res) => {
	const { email } = req.body;
	try {
		const data = await userService.passwordResetRequest(email);
		return res.status(StatusCodes.OK).json({
			email: data.email,
		});
	} catch (err) {
		console.log(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
	}
};
const passwordReset = async (req, res) => {
	const { email, password } = req.body;
	try {
		const data = await userService.passwordReset(email, password);
		return res.status(StatusCodes.OK).json(data);
	} catch (err) {
		console.log(err);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
	}
};

module.exports = {
	join,
	login,
	passwordResetRequest,
	passwordReset,
};
