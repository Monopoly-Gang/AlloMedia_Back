const Restaurant = require("../../models/Restaurant");
const { createRestoValidation } = require("../../validation/SupperAdminValidation");
const { sendResponse } = require("../../utils/sendResponse");

/**
 * Get all restaurants
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        return sendResponse(res, 200, restaurants);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return sendResponse(res, 500, null, 'Failed to fetch restaurants');
    }
};

/**
 * Create a new restaurant
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createRestaurant = async (req, res) => {
    try {
        const validation = createRestoValidation(req.body);
        if (validation.error) {
            return sendResponse(res, 400, null, validation.error.details[0].message);
        }

        const newRestaurant = await Restaurant.create(req.body);
        return sendResponse(res, 201, newRestaurant);
    } catch (error) {
        console.error('Error creating restaurant:', error);
        return sendResponse(res, 500, null, 'Failed to create restaurant');
    }
};

/**
 * Update an existing restaurant
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateRestaurant = async (req, res) => {
    try {
        const { _id } = req.params;
        
        const validation = createRestoValidation(req.body);
        if (validation.error) {
            return sendResponse(res, 400, null, validation.error.details[0].message);
        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            _id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedRestaurant) {
            return sendResponse(res, 404, null, 'Restaurant not found');
        }

        return sendResponse(res, 200, updatedRestaurant);
    } catch (error) {
        console.error('Error updating restaurant:', error);
        return sendResponse(res, 500, null, 'Failed to update restaurant');
    }
};

/**
 * Delete a restaurant
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteRestaurant = async (req, res) => {
    try {
        
        const { _id } = req.params;
        console.log('Restaurant ID to delete:', _id);
        const deletedRestaurant = await Restaurant.findByIdAndDelete(_id);

        if (!deletedRestaurant) {
            return sendResponse(res, 404, null, 'Restaurant not found');
        }

        return sendResponse(res, 204);
    } catch (error) {
        console.error('Error deleting restaurant:', error);
        return sendResponse(res, 500, null, 'Failed to delete restaurant');
    }
};

module.exports = {
    getRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
};



const aproveResto=async(req,res)=>{
    const{_id}=req.params;
   try{
       if(_id) sendResponse(res,400,null,"This resto not found")
           await  Restaurant.findByIdAndUpdate(_id,
               isApproved=true,
           { new: true, runValidators: true }
               );

   }catch(error){
    return sendResponse(res, 500, null, 'Failed to aprove resto');
   }

}


