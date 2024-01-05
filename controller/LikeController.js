const conn = require("../mariadb");
const {StatusCodes}= require('http-status-codes');

const addLike=(req,res)=>{
    const {id}=req.params;
    const {user_id}=req.body;
    const sql = `INSERT INTO likes VALUES(?,?)`;
    let values=[user_id, Number(id)];
    conn.query(sql,values,
        (err,results,fileds)=>{
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.CREATED).json(results);
        })
}

const removeLike = (req,res)=>{
    const {id} = req.params;
    const {user_id} = req.body;
    const sql = `DELETE FROM likes WHERE user_id= ? AND liked_book_id=?`;
    let value = [user_id,Number(id)]
    conn.query(sql,value,
        (err,results,fields)=>{
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json(results);
        })
}

module.exports={
    addLike,
    removeLike
}