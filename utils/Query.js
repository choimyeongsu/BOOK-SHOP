const conn = require("../mariadb"); //db모듈
const { StatusCodes } = require("http-status-codes"); //status code 모듈

const query = (sql, values) => {
	conn.query(sql, values, (err, results, fields) => {
		if (err) {
			console.log(err);
			return err;
			//return res.status(StatusCodes.BAD_REQUEST).end();
		}
		if (results.affectedRows >= 1) {
			console.log("if");
			console.log(results);
			return results;
			//return res.status(StatusCodes.CREATED).json(results);
		} else {
			console.log("else");
			console.log(results);
			return results;
			//return res.status(StatusCodes.BAD_REQUEST).end();
		}
	});
};

module.exports = query;
