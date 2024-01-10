const mysql = require('mysql2/promise');
//const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const order = async (req,res)=>{
    const conn = await mysql.createConnection({
        host:"localhost",
        user:'root',
        password:'root',
        database:'Bookshop',
        dateStrings:true
    });
    const {items,delivery,totalQuantity,totalPrice,userId,firstBookTitle}=req.body;
    let delivery_id;
    let order_id;
    let sql ="INSERT INTO delivery(address,receiver,contact) VALUES(?,?,?)"

    let values = [delivery.address, delivery.receiver, delivery.contact];
    let [results] = await conn.query(sql,values,
        (err,results,fields)=>{
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            console.log(results);

            
        })
    delivery_id=results.insertId;
    console.log(results);
    console.log(delivery_id);
    sql = `INSERT INTO orders(book_title, total_quantity, total_price, user_id, delivery_id)
     VALUE(?,?,?,?,?)`;
    values =[firstBookTitle,totalQuantity,totalPrice,userId,delivery_id];
    let [results2] = await conn.query(sql,values,
        (err,results,fields)=>{
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            console.log(results);
            
            
        })
    order_id=results2.insertId;
    sql =`INSERT INTO orderedBook(order_id,book_id,quantity) VALUE(?)`;
    values=[];
    items.forEach((item)=>{
        values.push([order_id,item.book_id,item.quantity]);
    })

    conn.query(sql,values,
        (err,results,fields)=>{
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            } 
            return res.status(StatusCodes.OK).json(results);
        })
};

const getOrders = (req,res)=>{
    res.json('주문목록조회');
};

const getOrderDetail = (req,res)=>{
    res.json('주문상세조회');
};

module.exports={
    order,
    getOrders,
    getOrderDetail
};