const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const order = (req,res)=>{
    const {items,delivery,totalQuantity,totalPrice,userId,firstBookTitle}=req.body;
    let delivery_id;
    let order_id;
    let sql ="INSERT INTO delivery(address,receiver,contact) VALUES(?,?,?)"

    let values = [delivery.address, delivery.receiver, delivery.contact];
    // conn.query(sql,values,
    //     (err,results,fields)=>{
    //         if(err){
    //             console.log(err);
    //             return res.status(StatusCodes.BAD_REQUEST).end();
    //         }
            
    //         delivery_id=results.insertId;

    //         return res.status(StatusCodes.OK).json(results);
    //     })
    sql = `INSERT INTO orders(book_title, total_quantity, total_price, created_at, user_id, delivery_id)
     VALUE(?,?,?,?,?,?)`;
    values =[firstBookTitle,totalQuantity,totalPrice,,userId,1];
    //  conn.query(sql,values,
    //     (err,results,fields)=>{
    //         if(err){
    //             console.log(err);
    //             return res.status(StatusCodes.BAD_REQUEST).end();
    //         }
            
    //         order_id=results.insertId;
    //         return res.status(StatusCodes.OK).json(results);
    //     })
    sql =`INSERT INTO orderedBook(order_id,book_id,quantity) VALUE(?)`;
    values=[];
    items.forEach((item)=>{
        values.push([1,item.book_id,item.quantity]);
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