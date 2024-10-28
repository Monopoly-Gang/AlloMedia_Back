const { default: mongoose, isValidObjectId } = require("mongoose");
const Order = require("../models/Order");
const User = require('../models/User');


class OrderController{

    async addOrder(req,res){
       
        try {
            
            const { client, restaurant, items } = req.body; 
            const formattedItems = items.map(item => ({
                quantity: item.quantity,
                menuItem: item.menuItem, 
            }));
            
            const order = new Order({
                client: client.id,
                restaurant,
                items: formattedItems,
            });
    
            await order.save();
            console.log("saved");
            return res.status(201).json({ message: 'Order created successfully', order });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ error: 'Failed to create order' });
        }
    } 

    async getOrdersByUserId(req,res){
        try{
            const id = req.params.userId;
            if (!id || !isValidObjectId(id)) {
                console.error("Invalid userId format");
                return res.status(400).json({ message: "Invalid user ID format" });
              }
            const objectId = new mongoose.Types.ObjectId(id); 
            const orders = await Order.find({ client: objectId });
            return res.status(200).json({message:"Orders fetched succesfully",orders});
        }
        catch(error){
            console.error(error);
            res.status(400).json({message:" Failed to fetch orders",error:error.message});
        }
    }

        async getOrderById(req,res){
            
            try{
                const id =req.params.orderId;
                const order = await Order.findById(id)
                .populate({
                    path: 'client',
                    select: 'fullName email phoneNumber address' 
                }) .populate({
                    path: 'restaurant',
                    select: 'name address', 
                })
                .populate({
                    path: 'items.menuItem', 
                    select: 'price description name', 
                });
                console.log(JSON.stringify(order, null, 2));
                return res.status(200).json({message:"Order fetched succesfully",order});
            }
            catch(error){
                console.error(error);
                return res.status(400).json({message:" Failed to fetch order",error:error.message});
            }
        }
}

module.exports = new OrderController();