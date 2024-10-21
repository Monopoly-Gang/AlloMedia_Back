const express = require('express');
const MenuItem = require('../../../models/MenuItem');
const ValidateMenu = require('../../../services/Menu/Validation');

async function DeleteItem(req, res, next) {
    try {
        const { id } = req.params; // Item ID from the URL parameters

        // Find the item by ID and delete it
        const deletedItem = await MenuItem.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}