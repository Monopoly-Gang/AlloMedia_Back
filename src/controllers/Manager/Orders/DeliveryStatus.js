const Order = require("../../../models/Order");

const DeliveryStatus = async (req, res) => {

    try {
        const { orderId, newStatus } = req.body;

        const order = await Order.findById(orderId).sort({ status: 1 }); // Sort by status in ascending order
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (!newStatus) {
            return res.status(400).json({ message: "Status is required" });
        }

        order.status = newStatus;
        await order.save();
        res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
}

module.exports = DeliveryStatus;
