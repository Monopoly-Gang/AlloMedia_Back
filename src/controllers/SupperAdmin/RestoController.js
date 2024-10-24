const Restaurant = require("../../models/Restaurant");
const { createRestoValidation } = require("../../validation/SupperAdminValidation");
const { sendResponse } = require("../../utils/sendResponse");
const { validationResult } = require("express-validator");


const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        return sendResponse(res, 200, restaurants);
    } catch (error) {
        return sendResponse(res, 500, null, 'Failed to fetch restaurants');
    }
};

 // create restaurent
const createRestaurant = async (req, res) => {
    try {

        
        const data = {
            ...req.body,
            logo : req.files['logo'] ? req.files['logo'][0].filename  : null,
            banner : req.files['banner'] ? req.files['banner'][0].filename  : null
        };

        const newRestaurant = await Restaurant.create(data);

        return sendResponse(res, 201, newRestaurant);

    } catch (error) {
        return sendResponse(res, 500, null, 'Failed to create restaurant');
    }
};



const updateRestaurant = async (req, res) => {
    try {
        // get resto id from req.params
        const { _id } = req.params;
        
        const data={
            ...req.body,
            logo : req.files['logo'] ? req.files['logo'][0].filename  : null,
            banner : req.files['banner'] ? req.files['banner'][0].filename  : null
        }
        

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            _id,
            data,
            { new: true, runValidators: true }
        );

        if (!updatedRestaurant) {
            return sendResponse(res, 404, null, 'Restaurant not found');
        }

        return sendResponse(res, 200, updatedRestaurant);
    } catch (error) {
        return sendResponse(res, 500, null, 'Failed to update restaurant');
    }
};

const deleteRestaurant = async (req, res) => {
    try {
        
        const { _id } = req.params;
        const deletedRestaurant = await Restaurant.findByIdAndDelete(_id);

        if (!deletedRestaurant) {
            return sendResponse(res, 404, null, 'Restaurant not found');
        }

        return sendResponse(res, 204);
    } catch (error) {
        return sendResponse(res, 500, null, 'Failed to delete restaurant');
    }
};

module.exports = {
    getRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
};