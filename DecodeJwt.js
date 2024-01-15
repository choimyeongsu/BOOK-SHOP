const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const decodeJwt = (req, res) => {
	try {
		const receivedJwt = req.headers["authorization"];
		const decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
		console.log(decodedJwt);
		return decodedJwt;
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
