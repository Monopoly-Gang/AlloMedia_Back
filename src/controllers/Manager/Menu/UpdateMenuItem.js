const express = require('express');
const MenuItem = require('../../../models/MenuItem');
const ValidateMenu = require('../../../services/Menu/Validation');

async function UpdateItem(req, res, next) {
    try {
        const { error } = await ValidateMenu(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { id } = req.params; 
        const { name, description, price, image, Restrorant_id } = req.body;

        const updatedItem = await MenuItem.findByIdAndUpdate(id, {
            name, description, price, image, restaurant: Restrorant_id
        }, { new: true });
        
        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ message: "Item updated successfully", menuItem: updatedItem });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}
