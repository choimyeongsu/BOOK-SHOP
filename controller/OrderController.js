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
   
    let sql ="INSERT INTO delivery(address,receiver,contact) VALUE(?,?,?)"

    let values = [delivery.address, delivery.receiver, delivery.contact];
    let [results] = await conn.execute(sql,values)
    let delivery_id=results.insertId;
    

    sql = `INSERT INTO orders(book_title, total_quantity, total_price, user_id, delivery_id)
     VALUE(?,?,?,?,?)`;
    values =[firstBookTitle,totalQuantity,totalPrice,userId,delivery_id];
    [results] = await conn.execute(sql,values)
    let order_id=results.insertId;
    
    sql = `SELECT book_id,quantity FROM cartItems WHERE id IN(?)`;
    let orderItems = await conn.query(sql,[items]);
    console.log(orderItems);

    sql =`INSERT INTO orderedBook(order_id,book_id,quantity) VALUE(?)`;
    values=[];
    orderItems[0].forEach((item)=>{
        console.log(item.book_id);
        values.push([1,item.book_id,item.quantity]);
    })

    console.log(values);
    results=await conn.query(sql,values);
    
    results = await deleteCartItems(conn,items);
    
    return res.status(StatusCodes.OK).json(results[0]);
};

const deleteCartItems = async(conn,items)=>{
    let sql =`DELETE FROM cartItems WHERE id IN(?)`;
    let values=items;
    let result = await conn.query(sql,values);
    return result;
}

const getOrders = async (req,res)=>{
    const conn = await mysql.createConnection({
        host:"localhost",
        user:'root',
        password:'root',
        database:'Bookshop',
        dateStrings:true
    });

    // let {id}=req.body;
    let sql = `SELECT orders.id,book_title,total_quantity,total_price,created_at,address,receiver,contact
     FROM orders LEFT OUTER JOIN delivery ON orders.delivery_id=delivery.id`;
    let [rows,fields] = await conn.execute(sql,[]);
    console.log(rows);
    return res.status(StatusCodes.OK).json(rows);
};

const getOrderDetail = async (req,res)=>{
    const conn = await mysql.createConnection({
        host:"localhost",
        user:'root',
        password:'root',
        database:'Bookshop',
        dateStrings:true
    });
    let {id}=req.params;
    let sql = `SELECT books.id,books.title,books.author,books.price,orderedBook.quantity
     FROM orderedBook LEFT OUTER JOIN books
     ON orderedBook.book_id=books.id
      WHERE order_id=?`;
    let values = [id];
    let [rows,fields] = await conn.execute(sql,values);
    console.log(rows);
    return res.status(StatusCodes.OK).json(rows);
};

module.exports={
    order,
    getOrders,
    getOrderDetail
};