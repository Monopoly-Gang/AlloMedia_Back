const User = require("../models/User");
const Restaurant = require("../models/Restaurant");


const searchRestaurant = async (req,res) =>{

    try{

        // Extracting query params

        const {location, cuisineType, name } = req.query;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const fieldsNumber = Object.keys(req.query).length;

        if(fieldsNumber == 0 || page<1 || limit <0) return res.status(403).json({message:"Forbidden"});

        // Calculating offset for pagination

        let offset = (page-1) * limit;
        
        // Defining the query conditions

        const conditions = [];
           
        if(location){
            conditions.push({address:location});

        }
      
        if(cuisineType){
            conditions.push({cuisineType:new RegExp(cuisineType,"i")})

        }
        if(name){
            conditions.push({name: new RegExp(name,"i")});
        }

        let restaurants;

        // Query 


        let query = {$and : conditions};
        if(fieldsNumber < 5) query = {$or : conditions};

        restaurants = await Restaurant.find(query).skip(offset).limit(limit);

        // Total results

        totalResults = await Restaurant.countDocuments(query);
            
        // Return response

        if(restaurants.length > 0) {
            return res.status(200).json({
                restaurants,
                totalResults,
                currentPage:page
            });
        }
        else{
            return res.status(404).json({message:"No ressource was found"});
        }
        
    }

    catch(error){
        console.error(error);
        return res.status(500).json({message:"Error searching restaurants"});
    }
}

module.exports={searchRestaurant};