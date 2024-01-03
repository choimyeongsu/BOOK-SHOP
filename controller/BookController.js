const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');


const allBooks = (req,res)=>{
    const {category_id} = req.query;
    console.log(category_id);
    if(category_id){
        const sql = `SELECT * FROM books WHERE category_id=?`;
        const value = category_id;
        conn.query(sql,value,
            (err,results,fields)=>{
                if(err){
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }
                if(results)
                    return res.status(StatusCodes.OK).json(results);
                else
                    return res.status(StatusCodes.NOT_FOUND).end();
            })
    }
    else{
         const sql ="SELECT * FROM books LEFT OUTER JOIN category ON books.category_id=category.id";
         conn.query(sql,
              (err,results,fields)=>{
              if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
               }
               return res.status(StatusCodes.OK).json(results);
            })
    }
};

const bookDetail = (req,res)=>{
    let {id} = req.params;
    id=Number(id);
    const sql = `SELECT * FROM books WHERE id=?`;
    const value = id;
    conn.query(sql,value,
        (err,results,fields)=>{
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            if(results[0])
                return res.status(StatusCodes.OK).json(results[0]);
            else
                return res.status(StatusCodes.NOT_FOUND).end();
        })
};



module.exports={
    allBooks,
    bookDetail
};

