const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cuisineType: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: String, required: true },
    banner: String,
    logo: String,
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isApproved: { type: Boolean, default: false },
    menu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);