const crypto = require("crypto"); // crypot 모듈 : 암호화
const jwt = require("jsonwebtoken"); //jwt 모듈
const createConnection = require("../mariadb");

//email, password 예외처리필요
const join = async (email, password) => {
	const conn = await createConnection();
	try {
		const sql = `INSERT INTO users (email,password,salt) VALUES(?,?,?)`;

		//암호화된 비밀번호와 salt값을 같이 DB에 저장
		const salt = crypto.randomBytes(10).toString("base64");
		const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, "sha512").toString("base64");

		const values = [email, hashPassword, salt];
		const [result, fields] = await conn.execute(sql, values);
		return result;
	} catch (err) {
		console.log(err);
		return err;
	}
};
//email,password 예외처리 필요
const login = async (email, password) => {
	const conn = await createConnection();
	try {
		const sql = `SELECT * FROM users WHERE email=?`;
		const values = [email];
		const [result, fields] = await conn.execute(sql, values);

		const loginUser = result[0];

		//salt값 꺼내서 비밀번호를 암호화하고 디비비밀번호랑 비교
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

			return {
				user: loginUser,
				token: token,
			};
		}
	} catch (err) {
		console.log(err);
		return err;
	}
};
//이메일 예외처리필요
const passwordResetRequest = async (email) => {
	const conn = await createConnection();
	try {
		const sql = "SELECT * FROM users WHERE email=?";
		const [result, fields] = await conn.execute(sql, [email]);
		const user = result[0];
		return user;
	} catch (err) {
		console.log(err);
		return err;
	}
};
//이메일 ,비밀번호 에외처리 필요
const passwordReset = async (email, password) => {
	const conn = await createConnection();
	try {
		const sql = "UPDATE users SET password=? , salt=? WHERE email=?";

		const salt = crypto.randomBytes(10).toString("base64");
		const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, "sha512").toString("base64");

		const values = [hashPassword, salt, email];
		console.log(values);
		const [result, fields] = await conn.execute(sql, values);
		console.log(result);
		return rows;
	} catch (err) {
		console.log(err);
		return err;
	}
};

module.exports = {
	join,
	login,
	passwordResetRequest,
	passwordReset,
};
