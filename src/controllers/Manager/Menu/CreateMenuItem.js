const express = require('express');
const MenuItem = require('../../../models/MenuItem');
const  ValidateMenu   = require('../../../services/Menu/Validation');
const multer = require('multer');
const mongoose = require('mongoose');



async function CreateMenuItem(req, res, next) {
    try {
        
        const {error} = ValidateMenu.menuItemValidationSchema.validate(req.body); 
        res.status(200);  
        if (error) {
            return res.status(400).json({ message: error });
        }
        const { name, description, price, restaurant } = req.body
        let image 
        if (!req.file) {
            image = "https://example.com/logo.png"
        }else{
            image = req.file.path;
        }
        const id =new mongoose.Types.ObjectId(restaurant)
        const Item = await MenuItem.findOne({ name , restaurant})
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