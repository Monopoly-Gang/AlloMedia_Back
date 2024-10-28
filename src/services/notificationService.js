const socketService = require('./socketService');
const { SOCKET_EVENTS } = require('../utils/constants');

class NotificationService {
    async notifyNewOrderToManager(order, manager) {
        try {
            const notification = {
                type: SOCKET_EVENTS.NEW_ORDER,
                data: {
                    orderId: order._id,
                    clientName: order.client.fullName,
                    clientPhone: order.client.phoneNumber,
                    restaurantName: order.restaurant.name,
                    items: order.items.map(item => ({
                        name: item.menuItem.name,
                        quantity: item.quantity,
                        price: item.menuItem.price
                    })),
                    totalAmount: order.items.reduce((total, item) => 
                        total + (item.menuItem.price * item.quantity), 0),
                    orderDate: order.createdAt
                }
            };

            socketService.notifyUser(manager._id, SOCKET_EVENTS.NEW_ORDER, notification);

        } catch (error) {
            console.error('Error notifying restaurant manager:', error);
        }
    }

    async notifyOrderToDrivers(order) {
        const notification = {
            type: SOCKET_EVENTS.NEW_ORDER_DRIVER,
            data: {
                orderId: order._id,
                restaurantName: order.restaurant.name,
                restaurantAddress: order.restaurant.address,
                clientAddress: order.client.address,
                items: order.items.map(item => ({
                    name: item.menuItem.name,
                    quantity: item.quantity
                }))
            }
        };

        socketService.notifyByRole('livreur', SOCKET_EVENTS.NEW_ORDER_DRIVER, notification);
    }

    async notifyClientOrderStatus(order) {
        const notification = {
            type: SOCKET_EVENTS.ORDER_STATUS_UPDATED,
            data: {
                orderId: order._id,
                status: order.status,
                driverName: order.livreur?.fullName,
                driverPhone: order.livreur?.phoneNumber
            }
        };

        socketService.notifyUser(order.client._id, SOCKET_EVENTS.ORDER_STATUS_UPDATED, notification);
    }
}

module.exports = new NotificationService();