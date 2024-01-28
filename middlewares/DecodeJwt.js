const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const decodeJwt = (req, res) => {
	try {
		const receivedJwt = req.headers["authorization"];
		if (receivedJwt) {
			const decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
			return decodedJwt;
		} else {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				message: "토큰값이 필요합니다",
			});
		}
	} catch (err) {
		console.log(err);
		if (err instanceof jwt.JsonWebTokenError) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				message: "토큰 값을 확인해주세요",
			});
		} else if (err instanceof jwt.TokenExpiredError) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				message: "로그인 세션이 만료되었습니다. 다시 로그인 해주세요",
			});
		}
	}
};

module.exports = decodeJwt;
