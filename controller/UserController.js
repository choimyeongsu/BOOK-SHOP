const conn = require("../mariadb"); //db모듈
const { StatusCodes } = require("http-status-codes"); //status code 모듈
const jwt = require("jsonwebtoken"); //jwt 모듈
const crypto = require("crypto"); // crypot 모듈 : 암호화
const dotenv = require("dotenv"); // dotenv 모듈
dotenv.config();

const join = (req, res) => {
	let { email, password } = req.body;
	const sql = `INSERT INTO users (email,password,salt) VALUES(?,?,?)`;

	//암호화된 비밀번호와 salt값을 같이 DB에 저장
	const salt = crypto.randomBytes(10).toString("base64");
	const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, "sha512").toString("base64");

	const values = [email, hashPassword, salt];
	conn.query(sql, values, (err, results, fields) => {
		if (err) {
			console.log(err);
			return res.status(StatusCodes.BAD_REQUEST).end();
		}
		return res.status(StatusCodes.CREATED).json(results);
	});
};

const login = (req, res) => {
	let { email, password } = req.body;
	const sql = `SELECT * FROM users WHERE email=?`;
	const values = [email, password];
	conn.query(sql, values, (err, results, fields) => {
		if (err) {
			console.log(err);
			return res.status(StatusCodes.BAD_REQUEST).end();
		}
		const loginUser = results[0];
		//salt값 꺼내서 비밀번호를 암호화하고 디비 비밀번호랑비교
		const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt, 10000, 10, "sha512").toString("base64");

		if (loginUser && loginUser.password == hashPassword) {
			const token = jwt.sign(
				{
					email: loginUser.email,
					id: loginUser.id,
				},
				process.env.PRIVATE_KEY,
				{
					expiresIn: "20m",
					issuer: "choims",
				}
			);
			res.cookie("token", token, {
				httpOnly: true,
			});
			console.log(token);
			return res.status(StatusCodes.CREATED).json({
				message: `${loginUser.email}님 로그인 되었습니다.`,
			});
		} else {
			return res.status(StatusCodes.UNAUTHORIZED).end();
		}
	});
};
const passwordResetRequest = (req, res) => {
	const { email } = req.body;
	let sql = "SELECT * FROM users WHERE email=?";
	conn.query(sql, email, (err, results) => {
		if (err) {
			console.log(err);
			return res.status(StatusCodes.BAD_REQUEST).end();
		}

		const user = results[0];
		if (user) {
			return res.status(StatusCodes.OK).json({
				email: email,
			});
		} else {
			return res.status(StatusCodes.UNAUTHORIZED).end();
		}
	});
};
const passwordReset = (req, res) => {
	const { email, password } = req.body;

	const sql = "UPDATE users SET password=? , salt=? WHERE email=?";
	const salt = crypto.randomBytes(10).toString("base64");
	const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, "sha512").toString("base64");
	let values = [hashPassword, salt, email];
	conn.query(sql, values, (err, results) => {
		if (err) {
			console.log(err);
			return res.status(StatusCodes.BAD_REQUEST).end();
		}

		if (results.affectedRows == 0) return res.status(StatusCodes.BAD_REQUEST).end();
		else return res.status(StatusCodes.OK).json(results);
	});
};

module.exports = {
	join,
	login,
	passwordResetRequest,
	passwordReset,
};
