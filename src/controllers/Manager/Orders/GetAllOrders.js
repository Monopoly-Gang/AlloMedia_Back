const Order = require("../../../models/Order");
const Client = require("../../../models/User"); 
const MenuItem = require("../../../models/MenuItem");

const GetAllOrders = async (req, res) => {
    try {

        const {id} = req.params;

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
        console.error("Error retrieving orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = GetAllOrders;

