const User = require("../models/User");
const Restaurant = require("../models/Restaurant");


const searchRestaurant = async (req,res) =>{
    try{

        const {location, cuisineType, name } = req.query;
        const fieldsNumber = Object.keys(req.query).length;
        const conditions = [];
        console.log(fieldsNumber);
        

        if(location){
            conditions.push({address:location});

        }
        
        if(cuisineType){
            conditions.push({cuisineType:new RegExp(cuisineType,"i")})

        }
        if(name){
            conditions.push({name: new RegExp(name,"i")});
        }

        let restaurants = {};

        if(fieldsNumber < 3){
            restaurants = await Restaurant.find({
                $or : conditions
            })
        }
        
        else if(fieldsNumber == 3){
             restaurants = await Restaurant.find({
                $and : conditions
            })
        }
        
        res.json(restaurants);
        

        



        // if()

        // const restaurantName = req.query.restaurantName  || "";
        // const cuisineType = req.query.cuisineType || "";
        // const page = parseInt(req.query.page) || 1;

        // const result = await Restaurant.find(
        //     {
        //         $or : [{name:new RegExp(city,"i")},{address: new RegExp(city,"i")}]
        //     }
        // );
       console.log(restaurants);
    }
    catch(error){
        console.error(error);
    }
}

module.exports={searchRestaurant};