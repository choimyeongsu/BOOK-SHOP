const conn = require('../mariadb');
const {StatusCodes}=require('http-status-codes');

const addToCart = (req,res)=>{
    const {book_id,quantity,user_id}=req.body;
    const sql = `INSERT INTO cartItems(book_id,quantity,user_id) VALUE(${book_id},${quantity},${user_id})`;
    let values=[book_id,quantity,user_id];
    conn.query(sql,values,
        (err,results,fields)=>{
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.CREATED).json(results);
        })
}
const getCartItems=(req,res)=>{
    const {user_id, selected}=req.body;
    const sql = `SELECT cartItems.id, cartItems.book_id,  books.title, books.summary, cartItems.quantity, books.price FROM cartItems LEFT OUTER JOIN books ON cartItems.book_id=books.id WHERE user_id=? AND cartItems.id In(?)`;
    let values=[user_id,selected]
    conn.query(sql,values,
        (err,results,fields)=>{
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json(results);
        })
}
const removeCartItem=(req,res)=>{
    const {id} = req.params;
    const sql = `DELETE FROM cartItems WHERE cartItems.id=${id}`;
    let values=[id];
    conn.query(sql,values,
        (err,results,fields)=>{
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json(results);
        })
}

module.exports={
    addToCart,
    getCartItems,
    removeCartItem
}