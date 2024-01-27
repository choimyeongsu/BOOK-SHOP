const crypto = require("crypto"); // crypot 모듈 : 암호화
const jwt = require("jsonwebtoken"); //jwt 모듈
const createConnection = require("../mariadb");

const join = async (email, password) => {
	const conn = await createConnection();
	try {
		const sql = `INSERT INTO users (email,password,salt) VALUES(?,?,?)`;

		//암호화된 비밀번호와 salt값을 같이 DB에 저장
		const salt = crypto.randomBytes(10).toString("base64");
		const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, "sha512").toString("base64");

		const values = [email, hashPassword, salt];
		const [rows, fields] = await conn.execute(sql, values);
		return rows;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

const login = async (email, password) => {
	const conn = await createConnection();
	try {
		const sql = `SELECT * FROM users WHERE email=?`;
		const values = [email];
		const [rows, fields] = await conn.execute(sql, values);

		const loginUser = rows[0];

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
const passwordResetRequest = async (email) => {
	const conn = await createConnection();
	try {
		const sql = "SELECT * FROM users WHERE email=?";
		const [rows, fields] = await conn.execute(sql, [email]);
		const user = rows[0];
		return user;
	} catch (err) {
		console.log(err);
		return err;
	}
};
const passwordReset = async (email, password) => {
	const conn = await createConnection();
	try {
		const sql = "UPDATE users SET password=? , salt=? WHERE email=?";

		const salt = crypto.randomBytes(10).toString("base64");
		const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, "sha512").toString("base64");

		const values = [hashPassword, salt, email];
		const [rows, fields] = await conn.execute(sql, values);

		return rows;
	} catch (err) {
		console.log(err);
		return err;
	}
};
module.exports.join = join;
module.exports.login = login;
module.exports.passwordResetRequest = passwordResetRequest;
module.exports.passwordReset = passwordReset;
