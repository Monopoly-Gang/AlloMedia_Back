const express = require('express');
const MenuItem = require('../../../models/MenuItem');
const  ValidateMenu   = require('../../../services/Menu/Validation');
const multer = require('multer');
const mongoose = require('mongoose');



async function CreateMenuItem(req, res, next) {
    try {
        console.log("test 1");
        
        // const {error} = ValidateMenu(req.body);
        console.log("test 2");
        // console.log(); 
        // res.status(200);  
        // if (error) {
        //     return res.status(400).json({ message: error });
        // }
        
        console.log("test 3");
        const { name, description, price, restaurant } = req.body
        const image = req.file.filename;
        console.log("test 4" , image);
        
        const id =new mongoose.Types.ObjectId(restaurant)
        // const Item = await MenuItem.findOne({ name })
        // if (Item) {
            //     return res.status(400).json({ message: 'Item already exists' })
            // } else {
            console.log("test 5" ,new mongoose.Types.ObjectId(restaurant));
            const menuItem = new MenuItem({ name, description, price, image: image, restaurant: id });
            await menuItem.save();
            res.status(201).json({ message: "Item added successfully", menuItem: menuItem });
        // }
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = CreateMenuItem;