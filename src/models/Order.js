const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [{
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
        quantity: Number
    }],
    status: {
        type: String,
        enum: ['pending', 'preparing', 'ready_for_delivery', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    livreur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);