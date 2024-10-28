const ORDER_STATUS = {
    PENDING: 'pending',
    PREPARING: 'preparing',
    READY_FOR_DELIVERY: 'ready_for_delivery',
    OUT_FOR_DELIVERY: 'out_for_delivery',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

const SOCKET_EVENTS = {
    NEW_ORDER: 'NEW_ORDER',
    ORDER_ACCEPTED: 'ORDER_ACCEPTED',
    ORDER_READY: 'ORDER_READY',
    ORDER_DELIVERING: 'ORDER_DELIVERING',
    ORDER_DELIVERED: 'ORDER_DELIVERED'
};

module.exports = {
    ORDER_STATUS,
    SOCKET_EVENTS
};

