const Restaurant = require("../models/Restaurant");

const restaurants = [
    new Restaurant(
        {
            "name": "Tasty Bites",
            "cuisineType": "Italian",
            "address": "123 Pasta Lane, Flavor Town, FT 12345",
            "location": "40.712776, -74.005974",
            "banner": "https://example.com/images/tasty-bites-banner.jpg",
            "logo": "https://example.com/images/tasty-bites-logo.png",
            "manager": "650f6c52d3f58803c4b88e12",  
            "isApproved": true,
            "menu": [
              "650f6e48d3f58803c4b88e21", 
              "650f6e48d3f58803c4b88e22"
            ]
          }       
    ),

    new Restaurant(

        {
            "name": "Sushi Paradise",
            "cuisineType": "Japanese",
            "address": "456 Sashimi Street, Tokyo Drift, TD 56789",
            "location": "35.689487, 139.691711",
            "banner": "https://example.com/images/sushi-paradise-banner.jpg",
            "logo": "https://example.com/images/sushi-paradise-logo.png",
            "manager": "6510a7f4e2f37b0418e92a34",  
            "isApproved": false,
            "menu": [
              "6510a8f4e2f37b0418e92a45",  
              "6510a8f4e2f37b0418e92a46",
              "6510a8f4e2f37b0418e92a47"
            ]
          }
          
    )
];



const seedRestaurant = async () => {
    try{
        await Restaurant.deleteMany({});

        for(let i=0; i<restaurants.length; i++){
            restaurants[i].save();
        }
    }
    catch(err){
        console.error(err);
    }

    console.log("Mock data is seeded from seed script");
}

module.exports = seedRestaurant;