const conn = require('../mariadb');
const {StatusCodes}=require('http-status-codes');

const allCategorys=(req,res)=>{
    const sql = 'SELECT * FROM category';
    conn.query(sql,
        (err,results,fields)=>{
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json(results);
        })
}

module.exports={
    allCategorys
}