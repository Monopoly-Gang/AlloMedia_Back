const Restaurant = require("../../models/Restaurant");
const { sendResponse } = require("../../utils/sendResponse");

const getRestaurants= async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        return sendResponse(res, 200, restaurants);
    } catch (error) {
        return sendResponse(res, 500, null, 'Failed to fetch restaurants');
    }
}

const  approveRestaurant = async (req, res) => {
    try{
        const { _id } = req.params;
        const restaurant = await Restaurant.findByIdAndUpdate(
            _id,
            { isApproved: true },
            { new: true, runValidators: true }
        );
        if (!restaurant) {
            return sendResponse(res, 404, null, 'Restaurant not found');
        }
        return sendResponse(res, 200, restaurant);

    }
    catch(error){
        return sendResponse(res, 500, null, 'Failed to approve restaurant');
    }


}

const refuseRestaurant = async (req, res) => {
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


}




module.exports ={getRestaurants,approveRestaurant,refuseRestaurant};
