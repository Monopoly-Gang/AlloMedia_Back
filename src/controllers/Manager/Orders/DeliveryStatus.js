// const order_Status = require("../../utils/ApproveOrder_Restorant");
const Order = require("../../../models/Order");

const DeliveryStatus = async (req , res) => {
    const {orderId , newStatus} = req.body;
    console.log(req.body);
    
    const order = await Order.findById(orderId).sort({ status: 1 }); // Sort by status in ascending order
    if(!order){
        return res.status(404).json({message: "Order not found"});
    }
    
    // Validate the status before updating
    if (!newStatus) {
        return res.status(400).json({ message: "Status is required" });
    }
    
    order.status = newStatus;
    await order.save();
    res.status(200).json(order);
}

module.exports = DeliveryStatus;
