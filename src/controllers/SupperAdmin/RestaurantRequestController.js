const Restaurant = require("../../models/Restaurant");
const { sendResponse } = require("../../utils/sendResponse");



const getRestaurants = async (req, res) => {
  try {
      const restaurants = await Restaurant.find({ isApproved: false })
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



const approveRestaurant = async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
      const restaurant = await Restaurant.findByIdAndUpdate(
        id,
        { isApproved: true },
        { new: true, runValidators: true }
      );
  
      if (!restaurant) {
        return sendResponse(res, 404, null, 'Restaurant not found');
      }
  
      return sendResponse(res, 200, restaurant);
    } catch (error) {
      console.error('Error in approveRestaurant:', error);
      return sendResponse(res, 500, null, 'Failed to approve restaurant');
    }
  };
  

const refuseRestaurant = async (req, res) => {
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


}




module.exports ={getRestaurants,approveRestaurant,refuseRestaurant};
