const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    image: {type: String} ,
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: false }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);