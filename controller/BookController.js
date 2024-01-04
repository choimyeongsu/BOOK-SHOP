const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');


const allBooks = (req,res)=>{
    const {category_id,news,limit,currentPage} = req.query;
    // limit : page 당 도서 수 ex. 3
    // currentPage : 현재 몇 페이지 ex. 1, 2, 3 ...
    // offset : 0, 3, 6, 9, 12... ( limit * (currentPage-1) )
    let offset = limit * (currentPage-1);
    const values = [];
    let sql = "SELECT * FROM books LEFT OUTER JOIN category ON books.category_id=category.id"
    if(category_id&&news){
        sql = sql + " WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()" 
        values.push(category_id);
    }
    else if(category_id){
        sql = sql + ` WHERE category_id=?`;
        values.push(category_id);
    }
    else if(news){
        sql = sql + " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()"
    }
    values.push(Number(limit));
    values.push(offset);
    sql = sql + " LIMIT ? OFFSET ?";

    conn.query(sql,values,
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
   
};

const bookDetail = (req,res)=>{
    let {id} = req.params;
    id=Number(id);
    const sql = "SELECT * FROM books LEFT OUTER JOIN category ON books.category_id=category.id WHERE books.id=?";
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

