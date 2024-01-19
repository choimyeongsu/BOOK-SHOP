const conn = require("../mariadb"); //db모듈
const { StatusCodes } = require("http-status-codes"); //status code 모듈

const query = (sql, values, req, res) => {
	conn.query(sql, values, (err, results, fields) => {
		if (err) {
			console.log(err);
			return res.status(StatusCodes.BAD_REQUEST).end();
		}
		if (results.affectedRows >= 1) return res.status(StatusCodes.CREATED).json(results);
		else return res.status(StatusCodes.BAD_REQUEST).end();
	});
};

module.exports = query;
