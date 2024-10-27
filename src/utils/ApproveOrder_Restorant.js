const Order = require("../models/Order");

async function order_Status(order_id , status){
    const order = await Order.findById(order_id);
    if(!order){
        return res.status(404).json({message: "Order not found"});
    }
    order.status = status;
    await order.save();
    return order;
}