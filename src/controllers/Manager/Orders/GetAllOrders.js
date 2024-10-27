const Order = require("../../../models/Order");
const Client = require("../../../models/User"); 
const MenuItem = require("../../../models/MenuItem");

const GetAllOrders = async (req, res) => {
    const {id} = req.params;
    try {
        const orders = await Order.find({restaurant: id})
            .populate('client') 
            .populate('items.menuItem');
        if(!orders || orders.length === 0){ 
            return res.status(404).json({message: "No orders found"});
        }else{
            console.log("Orders retrieved:", orders); 
            res.status(200).json(orders);
        }
    } catch (error) {
        console.error("Error retrieving orders:", error); // Log any errors
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = GetAllOrders;

