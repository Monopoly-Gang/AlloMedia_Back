const express = require('express');
const MenuItem = require('../../../models/MenuItem');
const ValidateMenu = require('../../../services/Menu/Validation');
const multer = require('multer');
const mongoose = require('mongoose');



async function CreateMenuItem(req, res, next) {
    try {
        let id = req.params.id
        const { error } = ValidateMenu.menuItemValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error });
        }
        
        const { name, description, price } = req.body
        let image
        if (!req.file) {
            image = "https://example.com/logo.png"
        } else {
            image = req.file.path;
        }
        id = new mongoose.Types.ObjectId(id)
        const Item = await MenuItem.findOne({ name, restaurant: id })
        if (Item) {
            return res.status(400).json({ message: 'Item already exists' })
        } else {
            const menuItem = new MenuItem({ name, description, price, image: image, restaurant: id });
            await menuItem.save();
            res.status(201).json({ message: "Item added successfully", menuItem: menuItem });
        }
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = CreateMenuItem;