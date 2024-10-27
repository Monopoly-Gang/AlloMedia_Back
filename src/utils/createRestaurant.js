const Restaurant = require("../models/Restaurant");

async function addRestaurant(data, userId) {
  try {
    const restaurant = await Restaurant.create({
      name: data.restaurantName,
      cuisineType: data.cuisineType,
      address: data.restaurantAddress,
      location: data.location,
      banner: data.banner,
      logo: data.logo,
      manager: userId,
      menu: [],
    });
    return { success: true, restaurant };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = addRestaurant;
