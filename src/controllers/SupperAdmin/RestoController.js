const Restaurant = require("../../models/Restaurant");
const { sendResponse } = require("../../utils/sendResponse");
const { registerUser } = require("../../services/userService");
const sendEmailVerification = require('../../utils/sendEmailVerification');
const addRestaurant = require("../../utils/createRestaurant");


const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ isApproved: true })
            .populate({
                path: 'manager',  // Changed from 'gestionnaire' to 'manager'
                select: 'fullName email phoneNumber' 
            })
            .lean();
            
        if (!restaurants) {
            return sendResponse(res, 404, null, 'No restaurants found');
        }

        return sendResponse(res, 200, restaurants);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return sendResponse(res, 500, null, `Failed to fetch restaurants: ${error.message}`);
    }
};

 // create restaurent
const createRestaurant = async (req, res) => {
    try {
        const manageRegistered = await registerUser(req.body, 'gestionnaire');
        if (!manageRegistered.success) return res.status(400).json({message: manageRegistered.error});
        const restaurantRegistered = await addRestaurant({
            ...req.body,            
            banner: req.files.banner ? req.files.banner[0].path : '',
            logo: req.files.logo ? req.files.logo[0].path : ''
        }, manageRegistered.user._id,   isApproved=true);
        if (!restaurantRegistered.success) return res.status(400).json({message: restaurantRegistered.error});

        const isSent = await sendEmailVerification(manageRegistered.user._id, manageRegistered.user.email);
        if (isSent.error) return res.status(500).json({error: isSent.error});

        return res.status(201).json({ message: 'User and restaurant created successfully. Check your email for verification' });
            
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

    






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
        
        const { id } = req.params;
        const deletedRestaurant = await Restaurant.findByIdAndDelete(id);

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