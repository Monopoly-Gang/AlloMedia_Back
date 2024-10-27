const Order = require("../models/Order");


class OrderController{

    async addOrder(req,res){
        try {
            const { client, restaurant, items } = req.body;
            console.log("Received items:", req.body);
            
            
            const formattedItems = items.map(item => ({
                quantity: item.quantity,
                menuItem: item.menuItem, 
            }));
            
            const order = new Order({
                client,
                restaurant,
                items: formattedItems,
            });
    
            await order.save();
            console.log("saved");
            return res.status(201).json({ message: 'Order created successfully', order });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to create order' });
        }
    } 

    async getOrdersByUserId(req,res){
        try{
            const {id} = req.params;
            const orders = await Order.find({client:id});
            res.status(200).json({message:"Orders fetched succesfully",orders});
        }
        catch(error){
            console.error(error);
            req.status(500).json({message:" Failed to fetch orders",error:error.message});
        }
    }
}

module.exports = new OrderController();